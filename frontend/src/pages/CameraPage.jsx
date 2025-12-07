// import { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import Camera from '../components/Camera'
// import { analyzeSkinTone } from '../services/api'

// function CapturePhotoPage() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { userName } = location.state || {}
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [isAnalyzing, setIsAnalyzing] = useState(false)

//   if (!userName) {
//     navigate('/') // redirect to name page if no username
//     return null
//   }

//   const handleCapture = (imageBlob) => {
//     setCapturedImage(imageBlob)
//   }

//   const handleProceed = async () => {
//     if (!capturedImage) {
//       alert('Please capture a photo first!')
//       return
//     }

//     setIsAnalyzing(true)
//     try {
//       const results = await analyzeSkinTone(capturedImage, userName)
//       navigate('/results', { state: { userName, capturedImage, results } })
//     } catch (err) {
//       alert('Analysis failed: ' + err.message)
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-pink-50 p-6">
//       <h2 className="text-3xl font-bold text-pink-600 mb-6">📸 Capture Your Photo</h2>
//       <Camera onCapture={handleCapture} />

//       <button
//         onClick={handleProceed}
//         disabled={!capturedImage || isAnalyzing}
//         className="mt-4 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
//       >
//         {isAnalyzing ? '⏳ Analyzing...' : '➡ Proceed'}
//       </button>
//     </div>
//   )
// }

// export default CapturePhotoPage

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Camera from '../components/Camera'
import { analyzeSkinTone } from '../services/api'

function CapturePhotoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName } = location.state || {}
  const [capturedImage, setCapturedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (!userName) {
    navigate('/') // redirect to name page if no username
    return null
  }

  const handleCapture = (imageBlob) => {
    setCapturedImage(imageBlob)
  }

  const handleProceed = async () => {
    if (!capturedImage) {
      alert('Please capture a photo first!')
      return
    }

    setIsAnalyzing(true)
    try {
      const results = await analyzeSkinTone(capturedImage, userName)
      navigate('/results', { state: { userName, capturedImage, results } })
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="h-screen relative flex flex-col overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      
      {/* Decorative Floating Orbs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 py-4">
        
        {/* Header - Compact */}
        <div className="text-center mb-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-1">
            Hello, {userName}! 👋
          </h2>
          <p className="text-pink-400 text-base font-semibold">Let's capture your beautiful face</p>
        </div>

        {/* Camera Card - Flexible Height */}
        <div className="relative flex-1 max-w-3xl mx-auto w-full animate-scale-in">
          {/* Glowing Effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[2rem] blur-xl opacity-60 animate-pulse-slow"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 shadow-2xl border-3 border-pink-200/60 h-full flex flex-col">
            
            {/* Top Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-6 py-1.5 shadow-xl border-2 border-white">
                <span className="text-white font-bold text-xs tracking-wider">📸 CAPTURE MOMENT</span>
              </div>
            </div>

            {/* Camera Component - Flexible */}
            <div className="mt-3 flex-1 flex flex-col">
              <Camera onCapture={handleCapture} />
            </div>

            {/* Status Indicator - Compact */}
            {capturedImage && (
              <div className="mt-3 flex items-center justify-center gap-2 text-pink-500 font-semibold text-sm animate-fade-in">
                <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></div>
                <span>Photo captured successfully!</span>
              </div>
            )}

            {/* Proceed Button - Compact */}
            <button
              onClick={handleProceed}
              disabled={!capturedImage || isAnalyzing}
              className={`relative w-full mt-3 px-6 py-3 rounded-xl font-black text-base shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group
                ${capturedImage && !isAnalyzing 
                  ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white hover:scale-105 shadow-pink-400/50' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {/* Animated Shine Effect */}
              {capturedImage && !isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              )}
              
              {isAnalyzing ? (
                <>
                  <div className="relative w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="relative">Analyzing Your Beauty...</span>
                </>
              ) : (
                <>
                  <span className="relative tracking-wide">ANALYZE MY SKIN TONE</span>
                  <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Info Text - Compact */}
            <p className="text-center text-pink-400 text-xs mt-2 font-medium">
              {!capturedImage ? '✨ Capture your photo to begin' : '🎉 Ready to discover your palette!'}
            </p>

            {/* Bottom Decoration */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.8s ease-out 0.2s both; }
        .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  )
}

export default CapturePhotoPage