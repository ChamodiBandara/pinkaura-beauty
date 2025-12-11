import React, { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam"

function SharedCamera({ onCapture, enableOverlay = true }) {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const lastDetectionRef = useRef(0)
  const lastLandmarksRef = useRef(null)
  const lastLandmarksTimeRef = useRef(0)
  const [error, setError] = useState(null)
  const [faceDetected, setFaceDetected] = useState(false)

  // Load face detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load face-api.js for face detection
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js'
        script.async = true
        script.onload = async () => {
          console.log('✅ face-api.js loaded')
          // Load the models
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'
          await window.faceapi.nets.tinyFaceDetector.load(MODEL_URL)
          await window.faceapi.nets.faceLandmark68Net.load(MODEL_URL)
          console.log('✅ Face detection models loaded')
        }
        document.body.appendChild(script)
      } catch (err) {
        console.error('Error loading face detection:', err)
      }
    }

    loadModel()
  }, [])

  // Draw polygon region helper function
  const drawPolygonRegion = (ctx, pts, label) => {
    if (!pts || pts.length === 0) return
    
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.closePath()

    ctx.fillStyle = "rgba(0,255,0,0.18)"
    ctx.strokeStyle = "#00FF00"
    ctx.lineWidth = 3
    ctx.fill()
    ctx.stroke()

    // Draw label un-mirrored
    ctx.save()
    const labelX = ctx.canvas.width - pts[0].x
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = "#00FF00"
    ctx.font = "bold 14px Arial"
    ctx.fillText(label, labelX, pts[0].y - 10)
    ctx.restore()
  }

  // Draw real face shape regions using landmarks
  const drawFaceShapeRegions = (ctx, landmarks, box) => {
    if (!enableOverlay) return
    if (!landmarks || !landmarks.positions) {
      console.log('❌ No landmarks data')
      return
    }

    const points = landmarks.positions
    try {
      // Forehead (above eyebrows)
      const browLeft = points[19] // left inner brow
      const browRight = points[24] // right inner brow

      // Smaller forehead height
      const foreheadTopY = Math.min(browLeft.y, browRight.y) - (box.height * 0.12)

      ctx.beginPath()
      ctx.moveTo(browLeft.x, browLeft.y)
      ctx.lineTo(browRight.x, browRight.y)
      ctx.lineTo(browRight.x, foreheadTopY)
      ctx.lineTo(browLeft.x, foreheadTopY)
      ctx.closePath()

      ctx.fillStyle = "rgba(0,255,0,0.15)"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 3
      ctx.fill()
      ctx.stroke()
      
      // Draw label un-mirrored
      ctx.save()
      const labelX = ctx.canvas.width - browLeft.x
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = "#00FF00"
      ctx.font = "bold 12px Arial"
      ctx.fillText("FOREHEAD", labelX, foreheadTopY - 5)
      ctx.restore()

      // LEFT cheek
      const leftCheekPoints = [points[2], points[3], points[4], points[5]]
      drawPolygonRegion(ctx, leftCheekPoints, "LEFT CHEEK")

      // RIGHT cheek
      const rightCheekPoints = [points[12], points[13], points[14], points[15]]
      drawPolygonRegion(ctx, rightCheekPoints, "RIGHT CHEEK")

      // Draw face outline
      ctx.strokeStyle = "#00FFFF"
      ctx.lineWidth = 3
      const jaw = points.slice(0, 17)
      ctx.beginPath()
      ctx.moveTo(jaw[0].x, jaw[0].y)
      jaw.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    } catch (err) {
      console.error('❌ Error drawing regions:', err)
    }
  }

  const detectAndDraw = useCallback(async () => {
    if (!enableOverlay) return
    if (!webcamRef.current || !canvasRef.current) {
      animationRef.current = requestAnimationFrame(detectAndDraw)
      return
    }

    const video = webcamRef.current.video
    const canvas = canvasRef.current
    if (!video || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectAndDraw)
      return
    }

    // Throttle detection to reduce lag but keep overlay responsive
    const now = performance.now()
    if (now - lastDetectionRef.current < 70) {
      animationRef.current = requestAnimationFrame(detectAndDraw)
      return
    }
    lastDetectionRef.current = now

    // IMPORTANT: Set canvas size to match video dimensions
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      console.log(`📐 Canvas resized to ${canvas.width}x${canvas.height}`)
    }

    const ctx = canvas.getContext('2d')

    try {
      if (!window.faceapi) {
        animationRef.current = requestAnimationFrame(detectAndDraw)
        return
      }

      const detection = await window.faceapi
        .detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      let landmarks = null
      const nowTs = performance.now()
      
      // Check if detection is valid (has valid coordinates)
      if (detection && detection.landmarks && detection.detection) {
        // Validate detection box has valid coordinates
        const box = detection.detection.box
        const boxValues = [box?.x, box?.y, box?.width, box?.height]
        const allFinite = boxValues.every(v => Number.isFinite(v))
        if (allFinite) {
          landmarks = detection.landmarks
          lastLandmarksRef.current = landmarks
          lastLandmarksTimeRef.current = nowTs
          setFaceDetected(true)
        } else {
          // Invalid box, treat as no detection
          console.log('⚠️ Face detected but box has invalid coordinates')
          throw new Error('Invalid detection box')
        }
      } else {
        throw new Error('No detection data')
      }

      const box = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
      }

      // Mirror overlay to match mirrored webcam feed
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-canvas.width, 0)
      // Clear only when we actually draw, so overlay persists on brief drops
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawFaceShapeRegions(ctx, landmarks, box)
      ctx.restore()

    } catch (detectionError) {
      // face-api can throw when box has null/undefined; swallow and reuse last good landmarks if recent
      // If detection failed or invalid, reuse last landmarks for up to 1500ms to keep overlay visible
      const nowTs = performance.now()
      if (lastLandmarksRef.current && (nowTs - lastLandmarksTimeRef.current) < 1500) {
        const landmarks = lastLandmarksRef.current
        setFaceDetected(true)
        
        const box = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height
        }

        ctx.save()
        ctx.scale(-1, 1)
        ctx.translate(-canvas.width, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawFaceShapeRegions(ctx, landmarks, box)
        ctx.restore()
      } else {
        // No landmarks to draw
        setFaceDetected(false)
      }
    }

    animationRef.current = requestAnimationFrame(detectAndDraw)
  }, [drawFaceShapeRegions])

  // Start detection loop when video is ready (only if overlay enabled)
  useEffect(() => {
    if (!enableOverlay) return undefined

    const startDetection = () => {
      const videoEl = webcamRef.current?.video
      if (videoEl && videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
        animationRef.current = requestAnimationFrame(detectAndDraw)
      } else {
        setTimeout(startDetection, 200)
      }
    }

    startDetection()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [detectAndDraw, enableOverlay])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => onCapture?.(blob))
      .catch((err) => console.error("Failed to capture screenshot", err))
  }, [onCapture])

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px', textAlign: 'center' }}>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: "640px",
      margin: "0 auto",
      overflow: "hidden",
      borderRadius: "8px",
      border: faceDetected ? "3px solid #00FF00" : "2px solid #999"
    }}>
      {/* Container with aspect ratio - keeps webcam/canvas properly aligned */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "75%" /* 4:3 aspect ratio */
      }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block"
          }}
          mirrored
        />

        {/* Canvas - overlays webcam perfectly */}
        {enableOverlay && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 10
            }}
          />
        )}
      </div>

      {/* Status */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        color: faceDetected ? "#0f0" : "#f00",
        fontFamily: "monospace",
        fontSize: "12px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: "5px 10px",
        borderRadius: "4px",
        fontWeight: "bold",
        zIndex: 20
      }}>
        {faceDetected ? '✓ FACE DETECTED' : '⏳ LOADING...'}
      </div>

      {onCapture && (
        <button
          onClick={capture}
          disabled={!faceDetected}
          style={{
            position: "absolute",
            bottom: "15px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: faceDetected ? "#c94e8f" : "#999",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "2px solid white",
            cursor: faceDetected ? "pointer" : "not-allowed",
            fontSize: "14px",
            opacity: faceDetected ? 1 : 0.6,
            zIndex: 20
          }}
        >
          📸 CAPTURE PHOTO
        </button>
      )}
    </div>
  )
}

export default SharedCamera

