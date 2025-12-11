// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function NamePage() {
//   const [userName, setUserName] = useState('')
//   const navigate = useNavigate()

//   const handleNext = () => {
//     if (!userName.trim()) {
//       alert('Please enter your name!')
//       return
//     }
//     navigate('/capture', { state: { userName } })
//   }

//   return (
//     <div className="min-h-screen relative flex flex-col items-center justify-between overflow-hidden py-8 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      
//       {/* Decorative Floating Orbs */}
//       <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
//       <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse"></div>

//       {/* Decorative Circles */}
//       <div className="absolute top-32 right-40 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
//       <div className="absolute bottom-40 left-32 w-4 h-4 bg-rose-300 rounded-full opacity-40 animate-bounce delay-100"></div>
//       <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
//       <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-rose-400 rounded-full opacity-30 animate-pulse delay-200"></div>

//       {/* PINKAURA at Top */}
//       <div className="relative z-10 text-center pt-6 animate-fade-in">
//         <h1 className="text-7xl md:text-8xl font-black italic bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl leading-none">
//           Pink Aura
//         </h1>
//         <div className="h-2 w-80 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full shadow-lg mt-4 mx-auto"></div>
//       </div>

//       {/* Input Card at Bottom */}
//       <div className="relative z-10 w-full max-w-lg px-6 pb-8 animate-scale-in">
//         {/* Multi-layer Glowing Effect */}
//         <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[3rem] blur-2xl opacity-60 animate-pulse-slow"></div>
//         <div className="absolute -inset-2 bg-gradient-to-r from-pink-300/30 via-rose-200/30 to-pink-300/30 rounded-[2.5rem] blur-xl opacity-50"></div>
        
//         {/* Main Card */}
//         <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border-3 border-pink-200/60">
          
//           {/* Top Decoration Badge */}
//           <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
//             <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-8 py-2 shadow-xl border-3 border-white">
//               <span className="text-white font-bold text-sm tracking-wider">✨ Discover Your Beauty Palette ✨</span>
//             </div>
//           </div>

//           {/* Card Content */}
//           <div className="mt-6 space-y-5">
//             <div className="text-center">
//               <h3 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
//                 Welcome!
//               </h3>
//               <p className="text-pink-400 font-semibold text-base">
//                 Your aura awaits. Tell us your name
//               </p>
//             </div>

//             {/* Input Field */}
//             <div className="relative">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-rose-300 rounded-2xl blur opacity-30"></div>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 placeholder="Enter your name..."
//                 className="relative w-full px-6 py-4 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300/70 rounded-2xl focus:ring-4 focus:ring-pink-300/50 focus:border-pink-400 outline-none text-lg text-center font-semibold text-gray-700 placeholder-pink-300 shadow-lg transition-all duration-300"
//               />
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                 <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full animate-pulse shadow-md"></div>
//               </div>
//             </div>

//             {/* Button */}
//             <button
//               onClick={handleNext}
//               className="relative w-full px-8 py-4 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-pink-400/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
//             >
//               {/* Animated Shine Effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
//               <span className="relative tracking-wide">LET'S BEGIN</span>
//               <svg className="relative w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </button>

//             {/* Bottom Decoration */}
//             <div className="flex justify-center items-center gap-2 pt-3">
//               <div className="flex gap-2">
//                 <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce shadow-md"></div>
//                 <div className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce delay-100 shadow-md"></div>
//                 <div className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-bounce delay-200 shadow-md"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Floating Decorative Elements around Card */}
//         <div className="absolute -top-8 -right-8 w-20 h-20 bg-pink-300/30 rounded-full blur-xl animate-pulse"></div>
//         <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-300/30 rounded-full blur-xl animate-pulse-delayed"></div>
        
//         {/* Corner Sparkles */}
//         <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
//         <div className="absolute bottom-4 left-4 w-2 h-2 bg-rose-400 rounded-full animate-ping delay-100"></div>
//       </div>

//       {/* Custom Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(20px); }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes scale-in {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
        
//         .animate-float { animation: float 8s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
//         .animate-fade-in { animation: fade-in 1s ease-out; }
//         .animate-scale-in { animation: scale-in 1s ease-out 0.3s both; }
//         .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
//         .animate-pulse-delayed { animation: pulse 4s ease-in-out 2s infinite; }
//         .delay-100 { animation-delay: 100ms; }
//         .delay-200 { animation-delay: 200ms; }
//       `}</style>
//     </div>
//   )
// }

// export default NamePage


//NamePage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NamePage() {
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  const handleNext = () => {
    if (!userName.trim()) {
      alert('Please enter your name!')
      return
    }
    navigate('/capture', { state: { userName } })
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-between overflow-hidden py-8"
      style={{
        backgroundImage: "url('/images/bg24.jpg')",        // ✅ SET BACKGROUND IMAGE HERE
        backgroundSize: "cover",                // keeps original size
        backgroundPosition: "center",           // centered image
        backgroundRepeat: "no-repeat",          // no repeat
      }}
    >

      {/* Decorative Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Decorative Circles */}
      <div className="absolute top-32 right-40 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-40 left-32 w-4 h-4 bg-rose-300 rounded-full opacity-40 animate-bounce delay-100"></div>
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-rose-400 rounded-full opacity-30 animate-pulse delay-200"></div>

      {/* PINKAURA at Top */}
      <div className="relative z-10 pl-200 pt-6 animate-fade-in">
        <h1 className="text-7xl md:text-8xl font-black italic bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl leading-none">
          Pink Aura
        </h1>
        <div className="h-2 w-80 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full shadow-lg mt-4 mx-auto"></div>
      </div>

      {/* Input Card */}
      <div className="relative z-50 w-full max-w-150 px-6 pb-40 ml-200 animate-scale-in">

        <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[3rem] blur-2xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-300/30 via-rose-200/30 to-pink-300/30 rounded-[2.5rem] blur-xl opacity-50"></div>

        <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border-3 border-pink-200/60">
          {/* <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-8 py-2 shadow-xl border-3 border-white">
              <span className="text-white font-bold text-sm tracking-wider">✨ Discover Your Beauty Palette ✨</span>
            </div>
          </div> */}

          <div className="mt-6 space-y-5">
            <div className="text-center">
              <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
                Welcome!
              </h3>
              <p className="text-pink-400 font-semibold text-base">
                Your aura awaits. Tell us your name
              </p>
            </div>

            {/* Input Field */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-rose-300 rounded-2xl blur opacity-30"></div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="relative w-full px-6 py-4 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300/70 rounded-2xl focus:ring-4 focus:ring-pink-300/50 focus:border-pink-400 outline-none text-lg text-center font-semibold text-gray-700 placeholder-pink-300 shadow-lg transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full animate-pulse shadow-md"></div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="relative w-full px-8 py-4 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-pink-400/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>

              <span className="relative tracking-wide">LET'S BEGIN</span>
              <svg className="relative w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Bottom Decoration */}
            <div className="flex justify-center items-center gap-2 pt-3">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce shadow-md"></div>
                <div className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce delay-100 shadow-md"></div>
                <div className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-bounce delay-200 shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorations */}
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-pink-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-300/30 rounded-full blur-xl animate-pulse-delayed"></div>

        {/* Corner Sparkles */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-rose-400 rounded-full animate-ping delay-100"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-scale-in { animation: scale-in 1s ease-out 0.3s both; }
        .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
        .animate-pulse-delayed { animation: pulse 4s ease-in-out 2s infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  )
}

export default NamePage

