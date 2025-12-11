import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import NamePage from "./pages/NamePage";
import CameraPage from "./pages/CameraPage";
import SkinAnalysis from "./pages/SkinAnalysis";
import LipColorRecommendation from "./pages/LipColorRecommendation";
import DressColorPage from "./pages/DressColorRecommendation";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";

function App() {
  const [userName, setUserName] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleReset = () => {
    setUserName("");
    setCapturedImage(null);
    setAnalysisResults(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/enter-name" element={<NamePage setUserName={setUserName} />} />
        <Route
          path="/capture"
          element={
            <CameraPage
              userName={userName}
              setCapturedImage={setCapturedImage}
              setAnalysisResults={setAnalysisResults}  // ✅ Must pass this
            />
          }
        />
        <Route
          path="/results"
          element={
            <SkinAnalysis 
              analysisResults={analysisResults} 
              capturedImage={capturedImage}
              userName={userName}
              onReset={handleReset} 
            />
          }
        />
        <Route
          path="/lip-colors"
          element={
            <LipColorRecommendation
              analysisResults={analysisResults}
              userName={userName}
              onReset={handleReset}
            />
          }
        />
      <Route
  path="/results/dress"
  element={
    <DressColorPage 
      analysisResults={analysisResults}
      userName={userName}
      onReset={handleReset}
    />
  }
/>
        <Route
          path="/results/tryon"
          element={<VirtualTryOnPage capturedImage={capturedImage} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
