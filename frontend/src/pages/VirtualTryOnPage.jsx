import React, { useState, useEffect } from "react";
import TryOn3D from "../components/TryOn3D/TryOn3D";
import { useLocation, useNavigate } from "react-router-dom";

export default function VirtualTryOnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results: analysisResults, userName } = location.state || {};

  const [shades, setShades] = useState([]);
  const [currentShade, setCurrentShade] = useState(0);

  useEffect(() => {
    if (!analysisResults) {
      alert("No analysis data found! Redirecting to results page.");
      navigate("/results");
      return;
    }

    const lipstickData = analysisResults.lipstick_recommendation;
    if (lipstickData) {
      const allShades = [
        ...(lipstickData.recommendations?.nude || []).map(s => ({ ...s, category: "Nude" })),
        ...(lipstickData.recommendations?.everyday || []).map(s => ({ ...s, category: "Everyday" })),
        ...(lipstickData.recommendations?.bold || []).map(s => ({ ...s, category: "Bold" })),
      ];
      setShades(allShades);
    }
  }, [analysisResults, navigate]);

  if (!analysisResults) return null;

  const currentShadeData = shades[currentShade];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg22.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Dancing Script', cursive",
        color: "#5b0e2d",
      }}
    >
      {/* Include Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Title */}
      <h2 className="text-5xl md:text-6xl font-bold mb-6 z-10 text-center drop-shadow-md">
        Virtual Lipstick Try-On
      </h2>

      {/* Selected shade info */}
      {currentShadeData && (
        <div className="mb-6 text-center z-10 relative">
          <p className="text-2xl md:text-3xl font-semibold">
            {currentShadeData.name}{" "}
            <span className="text-pink-600">({currentShadeData.category})</span>
          </p>
        </div>
      )}

      {/* Lipstick Buttons */}
      {shades.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-10 z-10 relative">
          {shades.map((shade, i) => (
            <button
              key={i}
              onClick={() => setCurrentShade(i)}
              style={{ backgroundColor: shade.hex }}
              className={`w-[60px] h-[40px] rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border-2 border-white
                transition-all duration-200 cursor-pointer
                hover:scale-115 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]
                ${i === currentShade ? "border-[3px] border-black scale-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]" : ""}`}
            />
          ))}
        </div>
      )}

      {/* Camera / Canvas Container with Beautifying Filters */}
      <div className="w-full max-w-[900px] h-[700px] border-4 border-pink-400 rounded-3xl overflow-hidden flex justify-center items-center shadow-2xl z-10 relative">
        <div
          className="w-full h-full"
          style={{
            filter: `
              brightness(1.1) 
              contrast(1.05) 
              saturate(1.05) 
              blur(0.8px)
            `
          }}
        >
          {/* Apply subtle "foundation" blush/eyeshadow effects */}
          <TryOn3D
            currentShade={currentShadeData}
            additionalMakeup={{
              foundationOpacity: 0.08, // subtle skin smoothing
              blushOpacity: 0.05,      // light cheek blush
              eyeshadowOpacity: 0.03,  // soft eyeshadow
              eyelinerOpacity: 0.02,   // subtle eyeliner
            }}
          />
        </div>
      </div>

      {/* Floating "You're Beautiful" Text */}
      <div className="absolute top-10 right-10 z-20 text-3xl md:text-4xl font-bold text-pink-600 drop-shadow-lg animate-floatText">
        You're beautiful
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes floatText {
            0% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0); }
          }

          .animate-floatText {
            animation: floatText 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
