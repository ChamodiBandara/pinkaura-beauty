// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   // --- Background slideshow images ---
//   const images = [
//     "/images/bg4.jpg",
//     "/images/bg12.jpg",
//     "/images/bg14.jpg",
//   ];

//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 5000); // change every 5 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       className="min-h-screen flex items-center justify-start px-20"
//       style={{
//         backgroundImage: `url(${images[currentImage]})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         transition: "background-image 1s ease-in-out",
//       }}
//     >
//       <div>
//         <h1 className="text-6xl font-bold text-pink-600 drop-shadow-lg mb-6">
//           PINK AURA
//         </h1>

//         <Link
//           to="/enter-name"
//           className="bg-pink-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-pink-700 transition"
//         >
//           Get Started
//         </Link>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const images = [
    "/images/bg2.jpeg",
    "/images/bg19.jpg",
    "/images/bg20.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const letters = [
    { char: "P", anim: "animate-slideFromLeft" },
    { char: "I", anim: "animate-slideFromRight" },
    { char: "N", anim: "animate-slideFromTop" },
    { char: "K", anim: "animate-slideFromBottom" },
    { char: " ", anim: "" },
    { char: "A", anim: "animate-slideFromLeft" },
    { char: "U", anim: "animate-slideFromRight" },
    { char: "R", anim: "animate-slideFromTop" },
    { char: "A", anim: "animate-slideFromBottom" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Transition */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-pink-600/30"></div>

      {/* Decorative Floating Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-rose-400/20 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Animated Title */}
        <div className="mb-12">
          <h1
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 drop-shadow-2xl flex justify-center space-x-3"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              textShadow: "0 0 40px rgba(236, 72, 153, 0.3)"
            }}
          >
            {letters.map((item, index) => (
              <span 
                key={index} 
                className={`${item.anim} hover:scale-110 transition-transform duration-300`}
              >
                {item.char}
              </span>
            ))}
          </h1>
        </div>

        {/* CTA Button */}
        <div className="relative">
          {/* Button Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-xl opacity-60 animate-pulse-slow"></div>
          
          <Link
            to="/enter-name"
            className="relative group bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white px-16 py-6 rounded-full text-2xl font-black shadow-2xl shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            
            <span className="relative tracking-wide">Get Started</span>
            <svg className="relative w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideFromLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideFromRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideFromTop {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideFromBottom {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        
        .animate-slideFromLeft { animation: slideFromLeft 0.8s ease-out; }
        .animate-slideFromRight { animation: slideFromRight 0.8s ease-out; }
        .animate-slideFromTop { animation: slideFromTop 0.8s ease-out; }
        .animate-slideFromBottom { animation: slideFromBottom 0.8s ease-out; }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

