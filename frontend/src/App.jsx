// import { useState } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import SkinAnalysis from "./pages/SkinAnalysis";
// import DressColorRecommendation from "./pages/DressColorRecommendation";
// import VirtualTryOnPage from "./pages/VirtualTryOnPage";
// import LipColorRecommendation from "./pages/LipColorRecommendation"; // ✅ NEW IMPORT

// function App() {
//   const [currentPage, setCurrentPage] = useState("skin-analysis");

//   // Shared state
//   const [analysisResults, setAnalysisResults] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [userName, setUserName] = useState("");

//   // Callback when SkinAnalysis is complete
//   const handleAnalysisComplete = (results, image, name) => {
//     setAnalysisResults(results);
//     setCapturedImage(image);
//     setUserName(name);
//     setCurrentPage("skin-analysis"); // default tab
//   };

//   const handleReset = () => {
//     setAnalysisResults(null);
//     setCapturedImage(null);
//     setUserName("");
//     setCurrentPage("skin-analysis");
//   };

//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
//         {/* Header */}
//         <header className="bg-pink-600 text-white p-6 shadow-lg">
//           <h1 className="text-3xl font-bold text-center">🌺 Pink Aura 🌺</h1>
//           <p className="text-center mt-2">AI Skin Tone & Beauty Assistant</p>

//           {/* Navigation tabs (only after analysis) */}
//           {analysisResults && (
//             <div className="flex justify-center gap-4 mt-4">
//               {/* Skin Analysis */}
//               <button
//                 onClick={() => setCurrentPage("skin-analysis")}
//                 className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//                   currentPage === "skin-analysis"
//                     ? "bg-white text-pink-600 shadow-lg"
//                     : "bg-pink-500 text-white hover:bg-pink-400"
//                 }`}
//               >
//                 📊 Skin Analysis
//               </button>

//               {/* Dress Colors */}
//               <button
//                 onClick={() => setCurrentPage("dress-colors")}
//                 className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//                   currentPage === "dress-colors"
//                     ? "bg-white text-pink-600 shadow-lg"
//                     : "bg-pink-500 text-white hover:bg-pink-400"
//                 }`}
//               >
//                 🎨 Dress Colors
//               </button>

//               {/* Lip Colors – NEW TAB */}
//               <button
//                 onClick={() => setCurrentPage("lip-colors")}
//                 className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//                   currentPage === "lip-colors"
//                     ? "bg-white text-pink-600 shadow-lg"
//                     : "bg-pink-500 text-white hover:bg-pink-400"
//                 }`}
//               >
//                 💄 Lip Colors
//               </button>

//               {/* 3D Try-On */}
//               <Link
//                 to="/tryon3d"
//                 className="px-6 py-2 rounded-lg font-semibold bg-pink-500 text-white hover:bg-pink-400 transition-all"
//               >
//                 🕶️ 3D Virtual Try-On
//               </Link>
//             </div>
//           )}
//         </header>

//         {/* Page description */}
//         {analysisResults && (
//           <div className="max-w-3xl mx-auto mb-6 text-center">
//             <div className="bg-white rounded-lg p-4 shadow-md">
//               <p className="text-sm text-gray-600">
//                 ✨ Analysis complete for{" "}
//                 <span className="font-bold text-pink-600">{userName}</span>
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 Switch between tabs to view different aspects of your results
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Main content */}
//         <main className="container mx-auto px-4 py-8">
//           <Routes>
//             {/* Home route */}
//             <Route
//               path="/"
//               element={
//                 currentPage === "skin-analysis" ? (
//                   <SkinAnalysis
//                     onAnalysisComplete={handleAnalysisComplete}
//                     existingResults={analysisResults}
//                     onReset={handleReset}
//                   />
//                 ) : currentPage === "dress-colors" ? (
//                   <DressColorRecommendation
//                     analysisResults={analysisResults}
//                     capturedImage={capturedImage}
//                     userName={userName}
//                     onReset={handleReset}
//                   />
//                 ) : (
//                   // Lip colors page
//                   <LipColorRecommendation
//                     lipstickData={analysisResults?.lipstick_recommendation}
//                     userName={userName}
//                   />
//                 )
//               }
//             />

//             {/* Virtual Try-On route */}
//             <Route
//               path="/tryon3d"
//               element={<VirtualTryOnPage capturedImage={capturedImage} />}
//             />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <footer className="text-center py-6 text-gray-600">
//           <p className="text-sm">
//             Pink Aura - AI-Powered Beauty Analysis for Sri Lankan Skin Tones
//           </p>
//         </footer>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;


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
