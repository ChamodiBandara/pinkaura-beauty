// // ResultsPage.jsx
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const ResultsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // These values come from navigation state (App.jsx → ResultsPage)
//   const {
//     image,
//     skinTone,
//     lipColors = [],
//     dressColors = [],
//   } = location.state || {};

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 p-6">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate("/")}
//         className="mb-6 px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
//       >
//         ⬅ Back to Home
//       </button>

//       <h1 className="text-3xl font-bold text-center text-pink-700 mb-8">
//         Your Beauty Analysis Results
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
//         {/* Uploaded Image */}
//         <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center">
//           <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Image</h2>

//           {image ? (
//             <img
//               src={image}
//               alt="Captured"
//               className="w-64 h-64 rounded-xl object-cover border-4 border-pink-300"
//             />
//           ) : (
//             <p className="text-gray-500">No image uploaded.</p>
//           )}

//           <p className="mt-4 text-lg font-medium text-gray-700">
//             Skin Tone: <span className="text-pink-600">{skinTone}</span>
//           </p>
//         </div>

//         {/* Lipstick Colors */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             💄 Lipstick Recommendations
//           </h2>

//           <div className="space-y-3">
//             {lipColors.length > 0 ? (
//               lipColors.map((color, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-pink-50"
//                 >
//                   <span className="text-gray-700 font-medium">{color}</span>
//                   <div
//                     className="w-8 h-8 rounded-full border"
//                     style={{ backgroundColor: color }}
//                   ></div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No lipstick colors detected.</p>
//             )}
//           </div>
//         </div>

//         {/* Dress Colors */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             👗 Dress Color Recommendations
//           </h2>

//           <div className="space-y-3">
//             {dressColors.length > 0 ? (
//               dressColors.map((color, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-purple-50"
//                 >
//                   <span className="text-gray-700 font-medium">{color}</span>
//                   <div
//                     className="w-8 h-8 rounded-full border"
//                     style={{ backgroundColor: color }}
//                   ></div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No dress colors detected.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultsPage;

// ResultsPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    image,
    skinTone,
    lipColors = [],
    dressColors = [],
  } = location.state || {};

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/images/bg25.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 px-5 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
      >
        ⬅ Back to Home
      </button>

      <h1 className="text-3xl font-bold text-center text-pink-700 mb-8">
        Your Beauty Analysis Results
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Uploaded Image */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Image</h2>

          {image ? (
            <img
              src={image}
              alt="Captured"
              className="w-64 h-64 rounded-xl object-cover border-4 border-pink-300"
            />
          ) : (
            <p className="text-gray-500">No image uploaded.</p>
          )}

          <p className="mt-4 text-lg font-medium text-gray-700">
            Skin Tone: <span className="text-pink-600">{skinTone}</span>
          </p>
        </div>

        {/* Lipstick Colors */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            💄 Lipstick Recommendations
          </h2>

          <div className="space-y-3">
            {lipColors.length > 0 ? (
              lipColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-pink-50"
                >
                  <span className="text-gray-700 font-medium">{color}</span>
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No lipstick colors detected.</p>
            )}
          </div>
        </div>

        {/* Dress Colors */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            👗 Dress Color Recommendations
          </h2>

          <div className="space-y-3">
            {dressColors.length > 0 ? (
              dressColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-purple-50"
                >
                  <span className="text-gray-700 font-medium">{color}</span>
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No dress colors detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
