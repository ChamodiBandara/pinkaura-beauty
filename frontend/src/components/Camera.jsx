// import { useState, useRef, useEffect } from 'react'

// function Camera({ onCapture }) {
//   const [isCameraOn, setIsCameraOn] = useState(false)
//   const [isVideoReady, setIsVideoReady] = useState(false)
//   const [stream, setStream] = useState(null)
//   const [cameras, setCameras] = useState([])
//   const [selectedCamera, setSelectedCamera] = useState('')
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)

//   // Get list of available cameras
//   useEffect(() => {
//     const getCameras = async () => {
//       try {
//         // Request permission first
//         const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
//         tempStream.getTracks().forEach(track => track.stop())
        
//         // Then get device list
//         const devices = await navigator.mediaDevices.enumerateDevices()
//         const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
//         console.log('📹 Available cameras:', videoDevices)
//         setCameras(videoDevices)
        
//         // Auto-select external camera (index 1) or first available
//         if (videoDevices.length > 1) {
//           setSelectedCamera(videoDevices[1].deviceId)
//           console.log('✅ Auto-selected external camera:', videoDevices[1].label)
//         } else if (videoDevices.length > 0) {
//           setSelectedCamera(videoDevices[0].deviceId)
//           console.log('✅ Auto-selected camera:', videoDevices[0].label)
//         }
//       } catch (err) {
//         console.error('❌ Error getting cameras:', err)
//         alert('Please allow camera access to continue')
//       }
//     }
    
//     getCameras()
//   }, [])

//   const startCamera = async () => {
//     try {
//       console.log('🎥 Starting camera...')
//       setIsVideoReady(false)
      
//       const constraints = {
//         video: {
//           deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
//           width: { ideal: 640 },
//           height: { ideal: 480 }
//         }
//       }
      
//       const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
//       console.log('✅ Camera stream obtained')
      
//       // Set stream and mark camera ON so the <video> renders and can receive the stream
//       setStream(mediaStream)
//       setIsCameraOn(true)
      
//       // We no longer try to assign srcObject here because the video element may not exist yet.
//       // Attaching the stream to the video is handled in a dedicated useEffect below.
//     } catch (err) {
//       console.error('❌ Camera error:', err)
//       alert('Camera access failed: ' + err.message)
//     }
//   }
  
//   // Attach stream to video element when both are present
//   useEffect(() => {
//     if (!stream || !videoRef.current) return

//     const videoEl = videoRef.current
//     videoEl.srcObject = stream

//     const onLoadedMetadata = () => {
//       console.log('📺 Video metadata loaded (effect)')
//       videoEl.play()
//         .then(() => {
//           console.log('▶️ Video playing (effect)')
//           // ensure camera on state is consistent
//           setIsCameraOn(true)
//           // small delay to allow frames to appear
//           setTimeout(() => {
//             setIsVideoReady(true)
//             console.log('✅ Video ready for capture (effect)')
//           }, 500)
//         })
//         .catch(err => {
//           console.error('❌ Video play error (effect):', err)
//           alert('Failed to start video: ' + err.message)
//         })
//     }

//     const onError = (e) => {
//       console.error('❌ Video element error (effect):', e)
//       alert('Video error occurred')
//     }

//     videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
//     videoEl.addEventListener('error', onError)

//     return () => {
//       videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
//       videoEl.removeEventListener('error', onError)
//     }
//   }, [stream])

//   const stopCamera = () => {
//     console.log('⏹️ Stopping camera...')
    
//     if (stream) {
//       stream.getTracks().forEach(track => {
//         track.stop()
//         console.log('Stopped track:', track.label)
//       })
//     }
    
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
    
//     setStream(null)
//     setIsCameraOn(false)
//     setIsVideoReady(false)
//     console.log('✅ Camera stopped')
//   }

//   const capturePhoto = () => {
//     console.log('📸 Attempting to capture photo...')
    
//     if (!videoRef.current || !canvasRef.current) {
//       alert('❌ Video elements not ready!')
//       console.error('Missing refs:', { video: !!videoRef.current, canvas: !!canvasRef.current })
//       return
//     }

//     const video = videoRef.current
    
//     // Check video ready state
//     console.log('Video ready state:', video.readyState)
//     console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
    
//     if (video.readyState < 2) {
//       alert('⏳ Video is loading... Please wait a moment and try again.')
//       return
//     }
    
//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       alert('❌ Video dimensions not available. Try stopping and restarting the camera.')
//       return
//     }
    
//     const canvas = canvasRef.current
    
//     // Set canvas size to match video
//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight
    
//     console.log('Canvas size:', canvas.width, 'x', canvas.height)
    
//     // Draw current video frame to canvas
//     const ctx = canvas.getContext('2d')
    
//     // Mirror the image (flip horizontally)
//     ctx.translate(canvas.width, 0)
//     ctx.scale(-1, 1)
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
//     // Convert canvas to blob
//     canvas.toBlob((blob) => {
//       if (blob) {
//         console.log('✅ Photo captured:', blob.size, 'bytes')
//         onCapture(blob)
//         stopCamera()
//       } else {
//         console.error('❌ Failed to create blob')
//         alert('Failed to capture image. Please try again.')
//       }
//     }, 'image/jpeg', 0.95)
//   }

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [stream])

//   return (
//     <div>
//       {/* Camera Selection */}
//       {cameras.length > 1 && !isCameraOn && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Camera
//           </label>
//           <select
//             value={selectedCamera}
//             onChange={(e) => {
//               setSelectedCamera(e.target.value)
//               console.log('Camera selected:', e.target.value)
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
//           >
//             {cameras.map((camera, index) => (
//               <option key={camera.deviceId} value={camera.deviceId}>
//                 {camera.label || `Camera ${index + 1}`}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Video Preview Container */}
//       <div 
//         className="relative bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-300" 
//         style={{ height: '360px', minHeight: '360px' }}
//       >
//         {!isCameraOn ? (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400">
//             <p className="text-5xl mb-3">📷</p>
//             <p className="text-xl font-semibold">Camera Off</p>
//             <p className="text-sm mt-2">Click "Start Camera" below</p>
//           </div>
//         ) : (
//           <>
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//               style={{ 
//                 transform: 'scaleX(-1)',
//                 display: 'block'
//               }}
//             />
            
//             {/* Loading Overlay */}
//             {!isVideoReady && (
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="text-white text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
//                   <p>Loading video...</p>
//                 </div>
//               </div>
//             )}
            
//             {/* Ready Indicator */}
//             {isVideoReady && (
//               <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
//                 ✓ READY
//               </div>
//             )}
//           </>
//         )}
        
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//       </div>

//       {/* Camera Controls */}
//       <div className="flex gap-2 mt-4">
//         {!isCameraOn ? (
//           <button
//             onClick={startCamera}
//             disabled={!selectedCamera && cameras.length === 0}
//             className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg"
//           >
//             ▶ Start Camera
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={capturePhoto}
//               disabled={!isVideoReady}
//               className={`flex-1 py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg
//                 ${isVideoReady 
//                   ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
//                   : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
//             >
//               {isVideoReady ? '📸 Capture' : '⏳ Loading...'}
//             </button>
//             <button
//               onClick={stopCamera}
//               className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition shadow-lg"
//             >
//               ⏹ Stop
//             </button>
//           </>
//         )}
//       </div>

//       {/* Status Info */}
//       {isCameraOn && (
//         <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-700">
//               📹 {cameras.find(c => c.deviceId === selectedCamera)?.label || 'Camera active'}
//             </span>
//             <span className={`font-semibold ${isVideoReady ? 'text-green-600' : 'text-yellow-600'}`}>
//               {isVideoReady ? '✓ Ready to capture' : '⏳ Initializing...'}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Camera

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
    <div className="w-full flex-1 flex flex-col">
      {/* Camera Selection */}
      {cameras.length > 1 && !isCameraOn && (
        <div className="mb-3 animate-fade-in">
          <label className="block text-sm font-bold text-pink-500 mb-2">
            📹 Select Camera
          </label>
          <div className="relative">
            <select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value)
                console.log('Camera selected:', e.target.value)
              }}
              className="w-full px-4 py-2 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300/70 rounded-xl focus:ring-3 focus:ring-pink-300/50 focus:border-pink-400 outline-none text-sm font-semibold text-gray-700 shadow-md transition-all duration-300 appearance-none cursor-pointer"
            >
              {cameras.map((camera, index) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Container - Flexible */}
      <div className="relative flex-1 min-h-0">
        {/* Glowing Effect */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400/30 via-rose-300/30 to-pink-400/30 rounded-2xl blur-lg opacity-60"></div>
        
        <div 
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-3 border-pink-200/50 shadow-xl h-full"
        >
          {!isCameraOn ? (
            <div className="flex flex-col items-center justify-center h-full text-pink-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full flex items-center justify-center mb-3 animate-pulse">
                <p className="text-4xl">📷</p>
              </div>
              <p className="text-xl font-bold">Camera Off</p>
              <p className="text-sm mt-1 text-pink-400/70">Click "Start Camera" below</p>
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
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-3 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-base font-semibold">Loading video...</p>
                  </div>
                </div>
              )}
              
              {/* Ready Indicator - Pink themed */}
              {isVideoReady && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-fade-in flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  READY
                </div>
              )}

              {/* Camera Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-3 left-3 w-8 h-8 border-t-3 border-l-3 border-pink-400/50 rounded-tl-lg"></div>
                <div className="absolute top-3 right-3 w-8 h-8 border-t-3 border-r-3 border-pink-400/50 rounded-tr-lg"></div>
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-3 border-l-3 border-pink-400/50 rounded-bl-lg"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-3 border-r-3 border-pink-400/50 rounded-br-lg"></div>
              </div>
            </>
          )}
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Camera Controls - Compact */}
      <div className="flex gap-2 mt-3">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            disabled={!selectedCamera && cameras.length === 0}
            className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 disabled:from-gray-400 disabled:to-gray-400 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Start Camera</span>
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              disabled={!isVideoReady}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                ${isVideoReady 
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white hover:scale-105' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isVideoReady ? 'Capture' : 'Loading...'}</span>
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span>Stop</span>
            </button>
          </>
        )}
      </div>

      {/* Status Info - Pink themed */}
      {isCameraOn && (
        <div className="mt-2 p-2.5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200/60 shadow-md animate-fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-700 font-semibold flex items-center gap-1.5">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="truncate">{cameras.find(c => c.deviceId === selectedCamera)?.label || 'Camera active'}</span>
            </span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${isVideoReady ? 'bg-pink-100 text-pink-600' : 'bg-rose-100 text-rose-600'}`}>
              {isVideoReady ? '✓ Ready' : '⏳ Loading'}
            </span>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Camera