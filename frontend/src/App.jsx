import { useState } from 'react'
import SkinAnalysis from './pages/SkinAnalysis'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <header className="bg-pink-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">🌺 Pink Aura 🌺</h1>
        <p className="text-center mt-2">AI Skin Tone Analysis</p>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <SkinAnalysis />
      </main>
    </div>
  )
}

export default App