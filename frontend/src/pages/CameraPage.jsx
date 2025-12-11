// CameraPage.jsx
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { analyzeSkinTone } from '../services/api'

/* CAMERA COMPONENT */
const Camera = forwardRef(function Camera({ onCapture, hideControls = false, onCameraStateChange }, ref) {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [stream, setStream] = useState(null)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const getCameras = async () => {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
        tempStream.getTracks().forEach(track => track.stop())

        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameras(videoDevices)

        if (videoDevices.length > 1) {
          setSelectedCamera(videoDevices[1].deviceId)
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId)
        }
      } catch (err) {
        console.warn('Camera permission or device enumeration failed', err)
      }
    }

    getCameras()
  }, [])

  const startCamera = async () => {
    try {
      setIsVideoReady(false)
      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setIsCameraOn(true)
      if (onCameraStateChange) onCameraStateChange(true)
    } catch (err) {
      alert('Camera access failed: ' + err.message)
    }
  }

  useEffect(() => {
    if (!stream || !videoRef.current) return
    const videoEl = videoRef.current
    videoEl.srcObject = stream

    const onLoadedMetadata = () => {
      videoEl.play()
        .then(() => {
          setIsCameraOn(true)
          setTimeout(() => setIsVideoReady(true), 200)
        })
        .catch(err => alert('Failed to start video: ' + err.message))
    }

    const onError = () => alert('Video error occurred')

    videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
    videoEl.addEventListener('error', onError)

    return () => {
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
      videoEl.removeEventListener('error', onError)
    }
  }, [stream])

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStream(null)
    setIsCameraOn(false)
    setIsVideoReady(false)
    if (onCameraStateChange) onCameraStateChange(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      alert('❌ Video not ready!')
      return
    }

    const video = videoRef.current
    if (video.readyState < 2 || video.videoWidth === 0) {
      alert('Video not ready. Restart camera.')
      return
    }

    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob)
        stopCamera()
      } else {
        alert('Failed to capture. Try again.')
      }
    }, 'image/jpeg', 0.95)
  }

  useEffect(() => () => { if (stream) stream.getTracks().forEach(track => track.stop()) }, [stream])

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    capturePhoto
  }), [selectedCamera, stream])

  return (
    <div className="h-full w-full flex flex-col">
      {cameras.length > 1 && !isCameraOn && !hideControls && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Camera
          </label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="relative bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-300" style={{ height: '100%', width: '100%' }}>
        {!isCameraOn ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-5xl mb-3">📷</p>
            <p className="text-xl font-semibold">Camera Off</p>
            {!hideControls && <p className="text-sm mt-2">Click "Start Camera"</p>}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {!isVideoReady && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}
            {isVideoReady && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ✓ READY
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
})

/* CAPTURE PHOTO PAGE */
function CapturePhotoPage(props) {
  const { userName: propUserName, setCapturedImage: setCapturedImageProp, setAnalysisResults: setAnalysisResultsProp } = props || {}
  const location = useLocation()
  const navigate = useNavigate()
  const locUserName = location.state?.userName
  const userName = propUserName || locUserName

  const [capturedImage, setCapturedImageLocal] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const cameraRef = useRef(null)

  if (!userName) {
    navigate('/')
    return null
  }

  const handleCapture = (imageBlob) => {
    setCapturedImageLocal(imageBlob)
    if (setCapturedImageProp) setCapturedImageProp(imageBlob)
  }

  const handleProceed = async () => {
    if (!capturedImage) return alert('Capture a photo first')

    setIsAnalyzing(true)
    try {
      const results = await analyzeSkinTone(capturedImage, userName)
      if (setAnalysisResultsProp) setAnalysisResultsProp(results)
      if (setCapturedImageProp) setCapturedImageProp(capturedImage)

      // ✅ Pass captured image and results via state
      navigate('/results', { state: { userName, capturedImage, results } })
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (capturedImage && !isAnalyzing) {
      const timer = setTimeout(() => handleProceed(), 1200)
      return () => clearTimeout(timer)
    }
  }, [capturedImage, isAnalyzing])

  const handleCapturePhoto = () => {
    if (cameraRef.current?.capturePhoto) {
      cameraRef.current.capturePhoto()
    }
  }

  const toggleCamera = async () => {
    if (!cameraRef.current) return
    if (!isCameraActive) {
      await cameraRef.current.startCamera()
      setIsCameraActive(true)
    } else {
      cameraRef.current.stopCamera()
      setIsCameraActive(false)
    }
  }

  const onCameraStateChange = (state) => setIsCameraActive(state)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: 'url(/images/bg23.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* <div className="absolute inset-0 bg-black/50"></div> */}

      {/* Top-right start/stop camera button */}
      <div className="absolute bottom-6 left-6 z-40">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-full font-semibold text-white shadow-lg transition-all
            ${isCameraActive ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-300 hover:bg-pink-400'}`}
        >
          {isCameraActive ? '⏹ Stop' : '▶ Start Camera'}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-pink-500 rounded-full blur-lg opacity-100 animate-pulse"></div>
          <div
            className="relative rounded-full shadow-2xl overflow-hidden bg-transparent"
            style={{ width: '790px', height: '790px' }} // 15 cm diameter
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <Camera
                ref={cameraRef}
                onCapture={handleCapture}
                hideControls={true}
                onCameraStateChange={onCameraStateChange}
              />

              <div className="absolute inset-0 rounded-full border-4 border-white/30 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white/50"></div>
              </div>

              {capturedImage && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white text-xl font-semibold">Photo Captured!</p>
                    <p className="text-gray-300 mt-2">Processing...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* {!capturedImage && isCameraActive && (
          <p className="text-center text-gray-300 mt-4 text-lg">
            Center your face in the circle and click the camera icon
          </p>
        )} */}
      </div>

      {!capturedImage && isCameraActive && (
        <button
          onClick={handleCapturePhoto}
          className="fixed bottom-10 right-10 z-50 w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 border-4 border-white/80 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping group-hover:animate-none"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  )
}

export default CapturePhotoPage
