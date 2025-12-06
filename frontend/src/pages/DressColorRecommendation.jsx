
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DressColorDisplay from "../components/DressColorDisplay";

function DressColorRecommendation({ onReset }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get analysis results and username from location state
  const { userName, results: analysisResults } = location.state || {};

  // If no analysis results → show message
  if (!analysisResults) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6">📸</div>
          <h2 className="text-5xl font-black text-gray-800 mb-4">No Photo Yet</h2>
          <p className="text-2xl text-gray-600">
            Go to <span className="font-black text-pink-600">Full Analysis</span> to capture a photo first!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-black text-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Start Analysis
          </button>
        </div>
      </div>
    );
  }

  const { dress_color_recommendations, category, undertone_info, general_classification, exact_skin_color } = analysisResults;

  // If no dress color data
  if (!dress_color_recommendations) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-5xl font-black text-gray-800 mb-4">Colors Not Available</h2>
          <p className="text-2xl text-gray-600 mb-6">
            Dress color recommendations are not available.
          </p>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-black text-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const undertone = undertone_info?.undertone || general_classification?.undertone || "Unknown";

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* User Info Header */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 p-6 rounded-3xl shadow-lg">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          {userName}'s Color Analysis
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Category */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md min-w-[200px] text-center">
            <p className="text-sm text-gray-500 font-bold uppercase mb-2">Category</p>
            <p className="text-3xl font-black text-pink-600">#{category.number}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{category.name}</p>
          </div>

          {/* Undertone */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md min-w-[180px] text-center">
            <p className="text-sm text-gray-500 font-bold uppercase mb-2">Undertone</p>
            <p className="text-3xl font-black text-purple-600">{undertone}</p>
          </div>

          {/* Skin Tone */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl border-3 border-gray-300 shadow-md flex-shrink-0"
              style={{ backgroundColor: exact_skin_color?.hex }}
            />
            <div className="text-left">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Your Tone</p>
              <p className="text-2xl font-mono font-black text-gray-800">{exact_skin_color?.hex}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dress Colors */}
      <DressColorDisplay
        dressColors={dress_color_recommendations}
        seasonName={dress_color_recommendations?.season_name}
      />

      {/* Tip */}
      <div className="bg-blue-50 p-4 rounded-2xl text-center">
        <p className="text-xl text-blue-800">
          💡 Switch to <span className="font-black">Full Analysis</span> for complete details
        </p>
      </div>

      {/* Reset Button */}
      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
      <button
  
  onClick={() =>
    navigate("/results/tryon", )
  }
  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
>
  👗 Try On Colors
</button>

        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default DressColorRecommendation;
