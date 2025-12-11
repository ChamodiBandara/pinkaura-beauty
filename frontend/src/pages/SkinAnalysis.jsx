// // import { useState } from 'react'
// // import Camera from '../components/Camera'
// // import SkinToneDisplay from '../components/SkinToneDisplay'
// // import { analyzeSkinTone } from '../services/api'

// // function SkinAnalysis() {
// //   const [userName, setUserName] = useState('')
// //   const [capturedImage, setCapturedImage] = useState(null)
// //   const [isAnalyzing, setIsAnalyzing] = useState(false)
// //   const [results, setResults] = useState(null)
// //   const [error, setError] = useState(null)

// //   const handleCapture = (imageBlob) => {
// //     setCapturedImage(imageBlob)
// //     setResults(null)
// //     setError(null)
// //   }

// //   const handleAnalyze = async () => {
// //     if (!capturedImage) {
// //       alert('Please capture a photo first!')
// //       return
// //     }

// //     if (!userName.trim()) {
// //       alert('Please enter your name!')
// //       return
// //     }

// //     setIsAnalyzing(true)
// //     setError(null)

// //     try {
// //       const result = await analyzeSkinTone(capturedImage, userName)
// //       setResults(result)
// //     } catch (err) {
// //       setError(err.message)
// //     } finally {
// //       setIsAnalyzing(false)
// //     }
// //   }

// //   const handleReset = () => {
// //     setUserName('')
// //     setCapturedImage(null)
// //     setResults(null)
// //     setError(null)
// //   }

// //   return (
// //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //       {/* LEFT SIDE - Input */}
// //       <div className="bg-white rounded-lg shadow-lg p-6">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Capture</h2>
        
// //         {/* Name Input */}
// //         <div className="mb-4">
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Your Name
// //           </label>
// //           <input
// //             type="text"
// //             value={userName}
// //             onChange={(e) => setUserName(e.target.value)}
// //             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
// //             placeholder="Enter your name"
// //           />
// //         </div>

// //         {/* Camera Component */}
// //         <Camera onCapture={handleCapture} />

// //         {/* Analyze Button */}
// //         <button
// //           onClick={handleAnalyze}
// //           disabled={!capturedImage || isAnalyzing}
// //           className={`w-full mt-6 py-3 px-6 rounded-lg font-bold text-white text-lg
// //             ${capturedImage && !isAnalyzing 
// //               ? 'bg-pink-600 hover:bg-pink-700 cursor-pointer' 
// //               : 'bg-gray-400 cursor-not-allowed'}`}
// //         >
// //           {isAnalyzing ? '⏳ Analyzing...' : '✨ Analyze Skin Tone ✨'}
// //         </button>

// //         {/* Error Display */}
// //         {error && (
// //           <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
// //             ❌ {error}
// //           </div>
// //         )}
// //       </div>

// //       {/* RIGHT SIDE - Results */}
// //       <div className="bg-white rounded-lg shadow-lg p-6">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Results</h2>
        
// //         {!results && !error && (
// //           <div className="flex items-center justify-center h-64 text-gray-400">
// //             <div className="text-center">
// //               <p className="text-xl">🌺</p>
// //               <p className="mt-2">Your results will appear here</p>
// //             </div>
// //           </div>
// //         )}

// //         {results && <SkinToneDisplay results={results} onReset={handleReset} />}
// //       </div>
// //     </div>
// //   )
// // }

// // export default SkinAnalysis

// import { useState, useEffect } from 'react'
// import Camera from '../components/Camera'
// import SkinToneDisplay from '../components/SkinToneDisplay'
// import { analyzeSkinTone } from '../services/api'

// function SkinAnalysis({ onAnalysisComplete, existingResults, onReset }) {
//   const [userName, setUserName] = useState('')
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [results, setResults] = useState(existingResults)
//   const [error, setError] = useState(null)

//   // Update results when existingResults change
//   useEffect(() => {
//     if (existingResults) {
//       setResults(existingResults)
//     }
//   }, [existingResults])

//   const handleCapture = (imageBlob) => {
//     setCapturedImage(imageBlob)
//     setError(null)
//   }

//   const handleAnalyze = async () => {
//     if (!capturedImage) {
//       alert('Please capture a photo first!')
//       return
//     }

//     if (!userName.trim()) {
//       alert('Please enter your name!')
//       return
//     }

//     setIsAnalyzing(true)
//     setError(null)

//     try {
//       const result = await analyzeSkinTone(capturedImage, userName)
//       setResults(result)
      
//       // Share results with parent App component
//       if (onAnalysisComplete) {
//         onAnalysisComplete(result, capturedImage, userName)
//       }
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   const handleLocalReset = () => {
//     setUserName('')
//     setCapturedImage(null)
//     setResults(null)
//     setError(null)
    
//     // Call parent reset
//     if (onReset) {
//       onReset()
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       {/* LEFT SIDE - Input */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           {results ? 'Your Photo' : 'Step 1: Capture'}
//         </h2>
        
//         {/* Show capture interface only if no results */}
//         {!results && (
//           <>
//             {/* Name Input */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 placeholder="Enter your name"
//               />
//             </div>

//             {/* Camera Component */}
//             <Camera onCapture={handleCapture} />

//             {/* Analyze Button */}
//             <button
//               onClick={handleAnalyze}
//               disabled={!capturedImage || isAnalyzing}
//               className={`w-full mt-6 py-3 px-6 rounded-lg font-bold text-white text-lg
//                 ${capturedImage && !isAnalyzing 
//                   ? 'bg-pink-600 hover:bg-pink-700 cursor-pointer' 
//                   : 'bg-gray-400 cursor-not-allowed'}`}
//             >
//               {isAnalyzing ? '⏳ Analyzing...' : '✨ Analyze Skin Tone ✨'}
//             </button>

//             {/* Error Display */}
//             {error && (
//               <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                 ❌ {error}
//               </div>
//             )}
//           </>
//         )}

//         {/* Show captured photo when results exist */}
//         {results && capturedImage && (
//           <div className="space-y-4">
//             <div className="relative">
//               <img 
//                 src={URL.createObjectURL(capturedImage)} 
//                 alt="Captured" 
//                 className="w-full rounded-lg border-4 border-pink-200 shadow-lg"
//               />
//               <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
//                 ✓ ANALYZED
//               </div>
//             </div>
//             <p className="text-center text-sm text-gray-600">
//               Switch to 🎨 <span className="font-bold text-pink-600">Dress Colors</span> tab to see color recommendations
//             </p>
//           </div>
//         )}
//       </div>

//       {/* RIGHT SIDE - Results */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           {results ? 'Your Results' : 'Step 2: Results'}
//         </h2>
        
//         {!results && !error && (
//           <div className="flex items-center justify-center h-64 text-gray-400">
//             <div className="text-center">
//               <p className="text-xl">🌺</p>
//               <p className="mt-2">Your results will appear here</p>
//             </div>
//           </div>
//         )}

//         {results && <SkinToneDisplay results={results} onReset={handleLocalReset} />}
//       </div>
//     </div>
//   )
// }

// export default SkinAnalysis

// import { useLocation, useNavigate } from 'react-router-dom'
// import { useEffect } from 'react'
// import SkinToneDisplay from '../components/SkinToneDisplay'

// function SkinAnalysisPage() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { userName, capturedImage, results } = location.state || {}

//   if (!results || !userName || !capturedImage) {
//     navigate('/') // redirect if missing data
//     return null
//   }

//   const handleNext = () => {
//     navigate('/lip-colors', { state: { userName, results } })
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-pink-50 p-6"
//      style={{
//         backgroundImage: "url('/images/bg25.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <h2 className="text-3xl font-bold text-pink-600 mb-6">Your aura is about to be analyzed</h2>

//       <div className="w-full max-w-4xl mb-4">
//         <SkinToneDisplay results={results} />
//       </div>

//       <button
//         onClick={handleNext}
//         className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
//       >
//         🎨 Next: Lip Colors
//       </button>
//     </div>
//   )
// }

// export default SkinAnalysisPage


// SkinAnalysisPage.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import SkinToneDisplay from '../components/SkinToneDisplay'


function SkinAnalysisPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, capturedImage, results } = location.state || {}

  if (!results || !userName || !capturedImage) {
    navigate('/')
    return null
  }

  const handleNext = () => {
    navigate('/lip-colors', { state: { userName, results } })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{
        backgroundImage: "url('/images/bg25.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Heading */}
      <h2 className="text-3xl font-bold text-pink-700 mb-6">
        Your aura is about to be analyzed
      </h2>

      {/* Top Section with image & aura patch */}
      <div className="relative w-full max-w-3xl flex flex-col items-center mb-12">

        {/* Girl Illustration Behind Everything */}
        <img
          src="/images/bg26.png"
          alt="Girl Illustration"
          className="absolute top-0 w-60 opacity-100 pointer-events-none select-none"
          style={{ zIndex: 4 }}
        />

       <div
  className="absolute w-100 h-100 opacity-100"
  style={{
    top: "10px",
    left: "35%", // center horizontally
    transform: "translateX(-50%)", // adjust for center
    width: "200px", // circle width
    height: "200px", // circle height
    backgroundColor: results.exact_skin_color?.hex,
    clipPath: "circle(50% at 50% 50%)", // circle shape
    zIndex: 2,
  }}
></div>

        
      </div>

      {/* Result Cards Section */}
      <div className="w-full max-w-5xl">
        <SkinToneDisplay results={results} />
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center mt-10 gap-4">
        <button
              onClick={() => navigate('/enter-name')}
              className="relative w-full px-60 mt-10 py-2 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-pink-400/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative tracking-wide">Analyze Another</span>
              <svg className="relative w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

        <button
          onClick={handleNext}
          className="px-10 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold shadow-md"
        >
          Next : Lip Color
        </button>
      </div>
    </div>
  )
}

export default SkinAnalysisPage
