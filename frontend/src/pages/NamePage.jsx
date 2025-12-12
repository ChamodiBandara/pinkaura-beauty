import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendCommand, listenForCommands } from '../utils/broadcast'
import SharedCamera from '../components/SharedCamera'

function NamePage() {
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const navigationRef = useRef(navigate)
  const [stage, setStage] = useState('name') // 'name', 'waiting', or 'camera'
  const [statusMessage, setStatusMessage] = useState('')

  // Keep navigationRef in sync with navigate
  useEffect(() => {
    navigationRef.current = navigate
  }, [navigate])

  useEffect(() => {
    // Listen for analysis complete signal from admin
    const cleanup = listenForCommands((msg) => {
      console.log('📺 [NamePage] Received message:', msg);
      if (msg.type === 'ANALYSIS_COMPLETE') {
        console.log('📺 [NamePage] ANALYSIS_COMPLETE received! Navigating to /results');
        // Navigate to results to show the analysis
        navigationRef.current('/results')
      }
      // Listen for camera open on TV
      if (msg.type === 'OPEN_CAMERA_TV') {
        console.log('📺 [NamePage] OPEN_CAMERA_TV received! Opening camera...');
        setStage('camera')
      }
    })
    return cleanup
  }, [])

  const handleNext = () => {
    if (!userName.trim()) {
      alert('Please enter your name!')
      return
    }
    
    // Save name to sessionStorage
    sessionStorage.setItem('userName', userName.trim())
    
    // Send notification to admin laptop
    sendCommand('USER_READY', { userName: userName.trim() })
    
    // Move to waiting stage
    setStage('waiting')
    setStatusMessage('📸 Place your face in the webcam')
  }

  const handleCapture = () => {
    // Tell admin laptop to open camera
    console.log('📸 [NamePage] Capture button clicked, sending OPEN_CAMERA command');
    sendCommand('OPEN_CAMERA', { userName })
    console.log('📸 [NamePage] OPEN_CAMERA command sent with userName:', userName);
    setStatusMessage('📸 Opening camera on admin panel...')
  }

  // WAITING STAGE - Show on TV
  if (stage === 'waiting') {
    return (
      <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
        
        {/* Decorative Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-full h-full bg-gradient-to-br from-rose-300/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8 px-6">
          
          {/* Animated Webcam Icon */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="text-7xl animate-bounce">📷</div>
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-3">
              Ready, {userName}?
            </h1>
            <p className="text-2xl text-gray-700 mb-2">{statusMessage}</p>
            <p className="text-gray-600">Your admin is standing by to capture your photo</p>
          </div>

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            className="px-12 py-5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white text-2xl font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:scale-110 transform"
          >
            📸 Capture Photo
          </button>

          {/* Status Indicator */}
          <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-200/50">
            <p className="text-sm text-gray-600">
              <span className="text-green-500 font-bold">●</span> Admin panel is ready
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-pink-500 text-sm font-light">📺 TV Display</p>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(-5deg); }
            50% { transform: translateY(20px) rotate(0deg); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  // CAMERA STAGE - Show on TV
  if (stage === 'camera') {
    return (
      <div className="h-screen relative flex flex-col overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
        
        {/* Decorative Floating Orbs */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 py-4">
          
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-1">
              Hello, {userName}! 👋
            </h2>
            <p className="text-pink-400 text-base font-semibold">Your skin tone analysis is starting...</p>
          </div>

          {/* Camera Card */}
          <div className="relative flex-1 max-w-3xl mx-auto w-full">
            <div className="absolute -inset-3 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[2rem] blur-xl opacity-60 animate-pulse"></div>
            
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 shadow-2xl border-3 border-pink-200/60 h-full flex flex-col">
              
              {/* Top Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-6 py-1.5 shadow-xl border-2 border-white">
                  <span className="text-white font-bold text-xs tracking-wider">📸 LIVE FEED</span>
                </div>
              </div>

              {/* Camera Component - No Mesh on TV */}
              <div className="mt-3 flex-1 flex flex-col">
                <SharedCamera enableOverlay={false} />
              </div>

              {/* Status Text */}
              <div className="mt-3 text-center text-pink-500 font-semibold">
                <p>✨ Your admin is capturing your analysis...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center pb-6">
          <p className="text-pink-500 text-sm font-light">📺 TV Display</p>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  // NAME ENTRY STAGE - Show on TV
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between overflow-hidden py-8 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      
      {/* Decorative Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>

      {/* PINKAURA at Top */}
      <div className="relative z-10 text-center pt-6 animate-fade-in">
        <h1 className="text-7xl md:text-8xl font-black italic bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl leading-none">
          PINKAURA
        </h1>
        <div className="h-2 w-80 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full shadow-lg mt-4 mx-auto"></div>
        <p className="mt-3 text-pink-400 text-lg font-light italic">Discover Your Beauty Palette</p>
      </div>

      {/* Input Card at Bottom */}
      <div className="relative z-10 w-full max-w-lg px-6 pb-8 animate-scale-in">
        {/* Glowing Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[3rem] blur-2xl opacity-60 animate-pulse-slow"></div>
        
        <div className="relative bg-white/80 backdrop-blur-md px-8 py-10 rounded-3xl shadow-2xl border border-pink-200/50">
          <h2 className="text-4xl font-bold text-center text-pink-600 mb-2">Welcome! 👋</h2>
          <p className="text-center text-gray-600 mb-6 text-sm">Please enter your name to begin</p>
          
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            placeholder="Your beautiful name..."
            className="w-full px-6 py-4 border-2 border-pink-300 rounded-xl focus:ring-3 focus:ring-pink-300/50 focus:border-pink-400 outline-none text-lg mb-6 bg-pink-50/50"
            autoFocus
          />
          
          <button
            onClick={handleNext}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:scale-105 transform"
          >
            ✨ Next: Face Capture
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-4">Your admin is standing by...</p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-pink-500 text-sm font-light">📺 TV Display</p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default NamePage

