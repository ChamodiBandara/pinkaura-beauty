import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your pages
import LandingPage from "./pages/LandingPage";
import NamePage from "./pages/NamePage";
import CameraPage from "./pages/CameraPage";
import SkinAnalysis from "./pages/SkinAnalysis";
import LipColorRecommendation from "./pages/LipColorRecommendation";
import DressColorPage from "./pages/DressColorRecommendation";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import AdminPage from "./pages/AdminPage";

// ✅ 1. Import the new Listener
import TVListener from "./components/TVListener";

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
      {/* ✅ 2. Add the Listener HERE (Invisible, but always listening) */}
     <TVListener 
  setAnalysisResults={setAnalysisResults} 
  setCapturedImage={setCapturedImage}
  setUserName={setUserName}
/>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/enter-name" element={<NamePage setUserName={setUserName} />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route
          path="/capture"
          element={
            <CameraPage
              userName={userName}
              setCapturedImage={setCapturedImage}
              setAnalysisResults={setAnalysisResults}
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
          element={
            <VirtualTryOnPage 
              capturedImage={capturedImage}
              analysisResults={analysisResults}
              userName={userName}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;