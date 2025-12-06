
// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// function LipColorRecommendation({ onReset }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Receive data from SkinAnalysisPage
//   const { userName, results: analysisResults } = location.state || {};

//   // If no analysis data → stop here
//   if (!analysisResults) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-pink-50">
//         <div className="text-center">
//           <p className="text-xl text-gray-700 mb-4">❌ No analysis data found</p>
//           <button
//             onClick={() => navigate('/')}
//             className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
//           >
//             Start New Analysis
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const lipstickData = analysisResults.lipstick_recommendation;

//   // If lipstick data is missing
//   if (!lipstickData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-pink-50">
//         <div className="text-center">
//           <p className="text-xl text-gray-700 mb-4">⚠️ No lipstick data available</p>
//           <button
//             onClick={() => navigate('/')}
//             className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
//           >
//             Start New Analysis
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-pink-600 text-center mb-8">
//           💄 Lipstick Recommendations
//         </h1>

//         {userName && (
//           <p className="text-center text-gray-700 mb-6">
//             For: <span className="font-bold text-pink-600">{userName}</span>
//           </p>
//         )}

//         {/* Recommendations Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
//           {/* Nude Shades */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-pink-600 mb-4">🌸 Nude</h2>
//             <div className="space-y-3">
//               {lipstickData.recommendations?.nude?.map((shade, idx) => (
//                 <div key={idx} className="flex items-center gap-3">
//                   <div
//                     className="w-8 h-8 rounded-full border-2 border-gray-300"
//                     style={{ backgroundColor: shade.hex || "#ccc" }}
//                   />
//                   <span className="text-gray-700">{shade.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Everyday Shades */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-pink-600 mb-4">🌺 Everyday</h2>
//             <div className="space-y-3">
//               {lipstickData.recommendations?.everyday?.map((shade, idx) => (
//                 <div key={idx} className="flex items-center gap-3">
//                   <div
//                     className="w-8 h-8 rounded-full border-2 border-gray-300"
//                     style={{ backgroundColor: shade.hex || "#ccc" }}
//                   />
//                   <span className="text-gray-700">{shade.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bold Shades */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-pink-600 mb-4">💃 Bold</h2>
//             <div className="space-y-3">
//               {lipstickData.recommendations?.bold?.map((shade, idx) => (
//                 <div key={idx} className="flex items-center gap-3">
//                   <div
//                     className="w-8 h-8 rounded-full border-2 border-gray-300"
//                     style={{ backgroundColor: shade.hex || "#ccc" }}
//                   />
//                   <span className="text-gray-700">{shade.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-center gap-4 mt-8">
//           <button
//             onClick={() => navigate('/results')}
//             className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
//           >
//             ← Back to Results
//           </button>

//           <button
//             onClick={() => {
//               onReset?.();
//               navigate('/');
//             }}
//             className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
//           >
//             Start Over
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LipColorRecommendation;
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LipSwatch from "../components/LipSwatch"; // Reusable lip shape component

function LipColorRecommendation({ onReset }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state
  const { userName, results: analysisResults } = location.state || {};

  // If no analysis data
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

  // If lipstick data is missing
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-8">
          💄 Lipstick Recommendations
        </h1>

        {userName && (
          <p className="text-center text-gray-700 mb-6">
            For: <span className="font-bold text-pink-600">{userName}</span>
          </p>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Nude Shades */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">🌸 Nude</h2>
            <div className="space-y-6 flex flex-col items-center">
              {lipstickData.recommendations?.nude?.map((shade, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <LipSwatch color={shade.hex || "#ccc"} />
                  <span className="text-gray-800 font-medium mt-2 text-lg">{shade.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Everyday Shades */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">🌺 Everyday</h2>
            <div className="space-y-6 flex flex-col items-center">
              {lipstickData.recommendations?.everyday?.map((shade, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <LipSwatch color={shade.hex || "#ccc"} />
                  <span className="text-gray-800 font-medium mt-2 text-lg">{shade.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bold Shades */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">💃 Bold</h2>
            <div className="space-y-6 flex flex-col items-center">
              {lipstickData.recommendations?.bold?.map((shade, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <LipSwatch color={shade.hex || "#ccc"} />
                  <span className="text-gray-800 font-medium mt-2 text-lg">{shade.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => navigate("/results")}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold"
          >
            ← Back to Results
          </button>
          {/* NEW: Navigate to Dress Color Recommendation */}
<button
  onClick={() =>
    navigate("/results/dress", { state: { userName, results: analysisResults } })
  }
  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
>
 Next: Dress Colors
</button>
        </div>
      </div>
    </div>
  );
}

export default LipColorRecommendation;
