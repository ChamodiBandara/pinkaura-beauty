import { useState } from 'react'
import Camera from '../components/Camera'
import SkinToneDisplay from '../components/SkinToneDisplay'
import { analyzeSkinTone } from '../services/api'

function SkinAnalysis() {
  const [userName, setUserName] = useState('')
  const [capturedImage, setCapturedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleCapture = (imageBlob) => {
    setCapturedImage(imageBlob)
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!capturedImage) {
      alert('Please capture a photo first!')
      return
    }

    if (!userName.trim()) {
      alert('Please enter your name!')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeSkinTone(capturedImage, userName)
      setResults(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUserName('')
    setCapturedImage(null)
    setResults(null)
    setError(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT SIDE - Input */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Capture</h2>
        
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>

        {/* Camera Component */}
        <Camera onCapture={handleCapture} />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!capturedImage || isAnalyzing}
          className={`w-full mt-6 py-3 px-6 rounded-lg font-bold text-white text-lg
            ${capturedImage && !isAnalyzing 
              ? 'bg-pink-600 hover:bg-pink-700 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isAnalyzing ? '⏳ Analyzing...' : '✨ Analyze Skin Tone ✨'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ❌ {error}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - Results */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Results</h2>
        
        {!results && !error && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-xl">🌺</p>
              <p className="mt-2">Your results will appear here</p>
            </div>
          </div>
        )}

        {results && <SkinToneDisplay results={results} onReset={handleReset} />}
      </div>
    </div>
  )
}

export default SkinAnalysis