import { useState, useRef, useEffect } from 'react'

function Camera({ onCapture }) {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [stream, setStream] = useState(null)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Get list of available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Request permission first
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
        tempStream.getTracks().forEach(track => track.stop())
        
        // Then get device list
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
        console.log('📹 Available cameras:', videoDevices)
        setCameras(videoDevices)
        
        // Auto-select external camera (index 1) or first available
        if (videoDevices.length > 1) {
          setSelectedCamera(videoDevices[1].deviceId)
          console.log('✅ Auto-selected external camera:', videoDevices[1].label)
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId)
          console.log('✅ Auto-selected camera:', videoDevices[0].label)
        }
      } catch (err) {
        console.error('❌ Error getting cameras:', err)
        alert('Please allow camera access to continue')
      }
    }
    
    getCameras()
  }, [])

  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera...')
      setIsVideoReady(false)
      
      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('✅ Camera stream obtained')
      
      // Set stream and mark camera ON so the <video> renders and can receive the stream
      setStream(mediaStream)
      setIsCameraOn(true)
      
      // We no longer try to assign srcObject here because the video element may not exist yet.
      // Attaching the stream to the video is handled in a dedicated useEffect below.
    } catch (err) {
      console.error('❌ Camera error:', err)
      alert('Camera access failed: ' + err.message)
    }
  }
  
  // Attach stream to video element when both are present
  useEffect(() => {
    if (!stream || !videoRef.current) return

    const videoEl = videoRef.current
    videoEl.srcObject = stream

    const onLoadedMetadata = () => {
      console.log('📺 Video metadata loaded (effect)')
      videoEl.play()
        .then(() => {
          console.log('▶️ Video playing (effect)')
          // ensure camera on state is consistent
          setIsCameraOn(true)
          // small delay to allow frames to appear
          setTimeout(() => {
            setIsVideoReady(true)
            console.log('✅ Video ready for capture (effect)')
          }, 500)
        })
        .catch(err => {
          console.error('❌ Video play error (effect):', err)
          alert('Failed to start video: ' + err.message)
        })
    }

    const onError = (e) => {
      console.error('❌ Video element error (effect):', e)
      alert('Video error occurred')
    }

    videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
    videoEl.addEventListener('error', onError)

    return () => {
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
      videoEl.removeEventListener('error', onError)
    }
  }, [stream])

  const stopCamera = () => {
    console.log('⏹️ Stopping camera...')
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
        console.log('Stopped track:', track.label)
      })
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setStream(null)
    setIsCameraOn(false)
    setIsVideoReady(false)
    console.log('✅ Camera stopped')
  }

  const capturePhoto = () => {
    console.log('📸 Attempting to capture photo...')
    
    if (!videoRef.current || !canvasRef.current) {
      alert('❌ Video elements not ready!')
      console.error('Missing refs:', { video: !!videoRef.current, canvas: !!canvasRef.current })
      return
    }

    const video = videoRef.current
    
    // Check video ready state
    console.log('Video ready state:', video.readyState)
    console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
    
    if (video.readyState < 2) {
      alert('⏳ Video is loading... Please wait a moment and try again.')
      return
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('❌ Video dimensions not available. Try stopping and restarting the camera.')
      return
    }
    
    const canvas = canvasRef.current
    
    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    console.log('Canvas size:', canvas.width, 'x', canvas.height)
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d')
    
    // Mirror the image (flip horizontally)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('✅ Photo captured:', blob.size, 'bytes')
        onCapture(blob)
        stopCamera()
      } else {
        console.error('❌ Failed to create blob')
        alert('Failed to capture image. Please try again.')
      }
    }, 'image/jpeg', 0.95)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <div>
      {/* Camera Selection */}
      {cameras.length > 1 && !isCameraOn && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Camera
          </label>
          <select
            value={selectedCamera}
            onChange={(e) => {
              setSelectedCamera(e.target.value)
              console.log('Camera selected:', e.target.value)
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Preview Container */}
      <div 
        className="relative bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-300" 
        style={{ height: '360px', minHeight: '360px' }}
      >
        {!isCameraOn ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-5xl mb-3">📷</p>
            <p className="text-xl font-semibold">Camera Off</p>
            <p className="text-sm mt-2">Click "Start Camera" below</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ 
                transform: 'scaleX(-1)',
                display: 'block'
              }}
            />
            
            {/* Loading Overlay */}
            {!isVideoReady && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}
            
            {/* Ready Indicator */}
            {isVideoReady && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ✓ READY
              </div>
            )}
          </>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Camera Controls */}
      <div className="flex gap-2 mt-4">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            disabled={!selectedCamera && cameras.length === 0}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg"
          >
            ▶ Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              disabled={!isVideoReady}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg
                ${isVideoReady 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
            >
              {isVideoReady ? '📸 Capture' : '⏳ Loading...'}
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>

      {/* Status Info */}
      {isCameraOn && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              📹 {cameras.find(c => c.deviceId === selectedCamera)?.label || 'Camera active'}
            </span>
            <span className={`font-semibold ${isVideoReady ? 'text-green-600' : 'text-yellow-600'}`}>
              {isVideoReady ? '✓ Ready to capture' : '⏳ Initializing...'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Camera