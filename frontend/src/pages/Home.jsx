// Home.jsx
import React, { useState } from "react";
import LipColorRecommendation from "./LipColorRecommendation";
import DressColorRecommendation from "./DressColorRecommendation";
import Camera from "./CameraPage";

const Home = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = (image) => {
    setCapturedImage(image);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-10">

      {/* Title */}
      <h1 className="text-center text-3xl font-bold text-pink-600 mb-8">
        PinkAura Beauty Analyzer
      </h1>

      {/* Camera + Preview Section */}
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md border">

        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Capture Your Face
        </h2>

        <Camera onCapture={handleCapture} />

        {/* Show captured image preview */}
        {capturedImage && (
          <div className="mt-6">
            <p className="font-semibold text-gray-700 mb-2">Captured Image:</p>
            <img
              src={capturedImage}
              alt="Captured Preview"
              className="w-64 h-64 object-cover rounded-xl shadow-md border"
            />
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {capturedImage && (
        <div className="max-w-3xl mx-auto mt-10 space-y-10">

          <LipColorRecommendation image={capturedImage} />

          <DressColorRecommendation image={capturedImage} />

        </div>
      )}
    </div>
  );
};

export default Home;
