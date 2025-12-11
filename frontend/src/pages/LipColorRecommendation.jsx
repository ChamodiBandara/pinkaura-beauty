import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LipSwatch from "../components/LipSwatch";

function LipColorRecommendation({ onReset }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { userName, results: analysisResults } = location.state || {};

  if (!analysisResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">❌ No analysis data found</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  const lipstickData = analysisResults.lipstick_recommendation;

  if (!lipstickData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">⚠️ No lipstick data available</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(to right, rgba(255,182,193,0.3), rgba(221,160,221,0.3)), url('/bg27.png') left center no-repeat`,
        backgroundSize: "auto 100%",
      }}
    >
      {/* Main container */}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-start gap-6">

        {/* Left side - girl image is background, empty div */}
        <div className="w-full lg:w-1/2"></div>

        {/* Right side - Lip Recommendations moved further right with margin */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:ml-16">
          <h1 className="text-4xl font-bold text-pink-600 text-center lg:text-left mb-4">
             Lipstick Recommendations
          </h1>

          {userName && (
            <p className="text-center lg:text-left text-gray-700 mb-4">
              For: <span className="font-bold text-pink-600">{userName}</span>
            </p>
          )}

          {/* Lip categories */}
          <div className="flex flex-col gap-4">

            {/* Nude */}
            <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/20">
              <h2 className="text-2xl font-bold text-pink-600 mb-2 text-center lg:text-left"> Nude</h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {lipstickData.recommendations?.nude?.map((shade, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <LipSwatch color={shade.hex} className="w-16 h-8 clip-lip-shape" />
                    <span className="text-gray-800 font-medium mt-1 text-sm">{shade.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Everyday */}
            <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/20">
              <h2 className="text-2xl font-bold text-pink-600 mb-2 text-center lg:text-left"> Everyday</h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {lipstickData.recommendations?.everyday?.map((shade, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <LipSwatch color={shade.hex} className="w-16 h-8 clip-lip-shape" />
                    <span className="text-gray-800 font-medium mt-1 text-sm">{shade.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bold */}
            <div className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/20">
              <h2 className="text-2xl font-bold text-pink-600 mb-2 text-center lg:text-left"> Bold</h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {lipstickData.recommendations?.bold?.map((shade, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <LipSwatch color={shade?.hex} className="w-16 h-8 clip-lip-shape" />
                    <span className="text-gray-800 font-medium mt-1 text-sm">{shade.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-6">
            <button
              onClick={() => navigate("/results")}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
            >
              ← Back to Results
            </button>

            <button
              onClick={() =>
                navigate("/results/dress", { state: { userName, results: analysisResults } })
              }
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
            >
              Next: Dress Colors →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LipColorRecommendation;