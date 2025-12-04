// import { useState } from 'react'
// import SkinAnalysis from './pages/SkinAnalysis'

// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
//       <header className="bg-pink-600 text-white p-6 shadow-lg">
//         <h1 className="text-3xl font-bold text-center">🌺 Pink Aura 🌺</h1>
//         <p className="text-center mt-2">AI Skin Tone Analysis</p>
//       </header>
      
//       <main className="container mx-auto px-4 py-8">
//         <SkinAnalysis />
//       </main>
//     </div>
//   )
// }

// export default App
import { useState } from 'react'
import SkinAnalysis from './pages/SkinAnalysis'
import DressColorRecommendation from './pages/DressColorRecommendation'

function App() {
  const [currentPage, setCurrentPage] = useState('skin-analysis')
  
  // Shared state for analysis results
  const [analysisResults, setAnalysisResults] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [userName, setUserName] = useState('')

  // Handle analysis completion from SkinAnalysis page
  const handleAnalysisComplete = (results, image, name) => {
    setAnalysisResults(results)
    setCapturedImage(image)
    setUserName(name)
  }

  // Reset all data
  const handleReset = () => {
    setAnalysisResults(null)
    setCapturedImage(null)
    setUserName('')
    setCurrentPage('skin-analysis') // Go back to analysis page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <header className="bg-pink-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">🌺 Pink Aura 🌺</h1>
        <p className="text-center mt-2">AI Skin Tone Analysis</p>
        
        {/* Navigation Tabs - Only show if we have results */}
        {analysisResults && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage('skin-analysis')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 'skin-analysis'
                  ? 'bg-white text-pink-600 shadow-lg'
                  : 'bg-pink-500 text-white hover:bg-pink-400'
              }`}
            >
              📊 Full Analysis
            </button>
            <button
              onClick={() => setCurrentPage('dress-colors')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 'dress-colors'
                  ? 'bg-white text-pink-600 shadow-lg'
                  : 'bg-pink-500 text-white hover:bg-pink-400'
              }`}
            >
              🎨 Dress Colors
            </button>
          </div>
        )}
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Description */}
        {analysisResults && (
          <div className="max-w-3xl mx-auto mb-6 text-center">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-gray-600">
                ✨ Analysis complete for <span className="font-bold text-pink-600">{userName}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Switch between tabs to view different aspects of your results
              </p>
            </div>
          </div>
        )}

        {/* Render Current Page */}
        {currentPage === 'skin-analysis' ? (
          <SkinAnalysis 
            onAnalysisComplete={handleAnalysisComplete}
            existingResults={analysisResults}
            onReset={handleReset}
          />
        ) : (
          <DressColorRecommendation 
            analysisResults={analysisResults}
            userName={userName}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        <p className="text-sm">
          Pink Aura - AI-Powered Beauty Analysis for Sri Lankan Skin Tones
        </p>
      </footer>
    </div>
  )
}

export default App