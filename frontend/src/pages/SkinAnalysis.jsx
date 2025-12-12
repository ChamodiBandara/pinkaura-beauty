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

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SkinToneDisplay from '../components/SkinToneDisplay'

function SkinAnalysisPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Try location.state first, then sessionStorage
  const [pageData, setPageData] = useState(() => {
    const stateData = location.state || {}
    console.log('📊 [SkinAnalysis] location.state:', stateData);
    
    if (stateData.results && stateData.userName) {
      console.log('📊 [SkinAnalysis] Using location.state data');
      return stateData
    }
    
    // Try to restore from sessionStorage
    const savedData = sessionStorage.getItem('analysisResults')
    console.log('📊 [SkinAnalysis] sessionStorage raw:', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        console.log('📊 [SkinAnalysis] Parsed sessionStorage:', parsedData);
        return parsedData
      } catch (e) {
        console.error('Failed to parse saved data:', e)
      }
    }
    
    console.log('📊 [SkinAnalysis] No data found in sessionStorage or location.state');
    return {}
  })

  const { userName, capturedImage, results } = pageData

  // Save to sessionStorage when data changes
  useEffect(() => {
    if (results && userName) {
      sessionStorage.setItem('analysisResults', JSON.stringify({
        userName,
        results,
        capturedImageUrl: capturedImage ? 'stored' : null
      }))
    }
  }, [results, userName, capturedImage])

  // If no results, show message instead of redirecting
  if (!results || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🌺</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">No Analysis Data</h2>
          <p className="text-gray-600 mb-6">Please capture and analyze a photo first.</p>
          <button
            onClick={() => navigate('/capture')}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg"
          >
            Go to Camera
          </button>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    navigate('/lip-colors', { state: { userName, results } })
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-pink-50 p-6">
      <h2 className="text-3xl font-bold text-pink-600 mb-6">🌺 Skin Analysis Results</h2>

      {/* Photo display removed - TV only shows analysis results */}
      <p className="text-center font-semibold text-gray-700 mb-6">
        👤 <span className="text-pink-600">{userName}</span>
      </p>

      <div className="w-full max-w-4xl mb-4">
        <SkinToneDisplay results={results} />
      </div>

      <button
        onClick={handleNext}
        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
      >
        🎨 Next: Lip Colors
      </button>
    </div>
  )
}

export default SkinAnalysisPage
