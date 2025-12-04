// import DressColorDisplay from '../components/DressColorDisplay'

// function DressColorRecommendation({ analysisResults, userName, onReset }) {
  
//   // If no results, show message to capture first
//   if (!analysisResults) {
//     return (
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-12">
//           <div className="text-center">
//             <p className="text-6xl mb-6">📸</p>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">
//               No Photo Captured Yet
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Please go to the <span className="font-bold text-pink-600">📊 Full Analysis</span> tab 
//               to capture a photo and analyze your skin tone first.
//             </p>
//             <p className="text-sm text-gray-500">
//               Once analyzed, you can view your dress color recommendations here without capturing again!
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const { dress_color_recommendations, category, undertone_info, general_classification, exact_skin_color } = analysisResults

//   // If analysis exists but no dress colors
//   if (!dress_color_recommendations) {
//     return (
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-12">
//           <div className="text-center">
//             <p className="text-6xl mb-6">⚠️</p>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">
//               Dress Colors Not Available
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Dress color recommendations are not included in your analysis results.
//             </p>
//             <p className="text-sm text-gray-500 mb-4">
//               Please make sure the backend dress color service is running.
//             </p>
//             <button
//               onClick={onReset}
//               className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg font-bold"
//             >
//               🔄 Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Get undertone from available sources
//   const undertone = undertone_info?.undertone || general_classification?.undertone || 'Unknown'

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {/* User Info Summary Header */}
//         <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200 mb-6">
//           <h2 className="text-2xl font-bold text-pink-600 mb-3 text-center">
//             🎨 {userName}'s Perfect Color Palette
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//             {/* Skin Category */}
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <p className="text-xs text-gray-600 mb-1">Skin Category</p>
//               <p className="font-bold text-gray-800">
//                 #{category.number} {category.name}
//               </p>
//             </div>
            
//             {/* Undertone */}
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <p className="text-xs text-gray-600 mb-1">Undertone</p>
//               <p className="font-bold text-purple-700">{undertone}</p>
//             </div>
            
//             {/* Skin Color */}
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <p className="text-xs text-gray-600 mb-1">Your Skin Tone</p>
//               <div className="flex items-center justify-center gap-2">
//                 <div
//                   className="w-8 h-8 rounded-md border-2 border-gray-300 shadow-sm"
//                   style={{ backgroundColor: exact_skin_color?.hex }}
//                 />
//                 <span className="text-xs font-mono text-gray-600">
//                   {exact_skin_color?.hex}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dress Color Display */}
//         {/* <DressColorDisplay dressColors={dress_color_recommendations} /> */}
//         <DressColorDisplay 
//             dressColors={dress_color_recommendations}
//             seasonName={dress_color_recommendations?.season_name}
//         />

//         {/* Navigation Hint */}
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
//           <p className="text-sm text-blue-700">
//             💡 <span className="font-semibold">Tip:</span> Switch to <span className="font-bold">📊 Full Analysis</span> tab 
//             to see complete skin tone details and recommendations
//           </p>
//         </div>

//         {/* Reset Button */}
//         <button
//           onClick={onReset}
//           className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
//         >
//           🔄 Analyze Another Person
//         </button>
//       </div>
//     </div>
//   )
// }

// export default DressColorRecommendation
import DressColorDisplay from '../components/DressColorDisplay'

function DressColorRecommendation({ analysisResults, userName, onReset }) {
  
  if (!analysisResults) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6">📸</div>
          <h2 className="text-5xl font-black text-gray-800 mb-4">
            No Photo Yet
          </h2>
          <p className="text-2xl text-gray-600">
            Go to <span className="font-black text-pink-600">Full Analysis</span> to capture a photo first!
          </p>
        </div>
      </div>
    )
  }

  const { dress_color_recommendations, category, undertone_info, general_classification, exact_skin_color } = analysisResults

  if (!dress_color_recommendations) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-5xl font-black text-gray-800 mb-4">
            Colors Not Available
          </h2>
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
    )
  }

  const undertone = undertone_info?.undertone || general_classification?.undertone || 'Unknown'

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      
      {/* FIXED ALIGNMENT - Info in ONE ROW, properly aligned */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 p-6 rounded-3xl shadow-lg">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          {userName}'s Color Analysis
        </h2>
        
        {/* HORIZONTAL LAYOUT - All in one row! */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          
          {/* Category Card - FIXED ALIGNMENT */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md min-w-[200px] text-center">
            <p className="text-sm text-gray-500 font-bold uppercase mb-2">Category</p>
            <p className="text-3xl font-black text-pink-600">#{category.number}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{category.name}</p>
          </div>
          
          {/* Undertone Card - FIXED ALIGNMENT */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md min-w-[180px] text-center">
            <p className="text-sm text-gray-500 font-bold uppercase mb-2">Undertone</p>
            <p className="text-3xl font-black text-purple-600">{undertone}</p>
          </div>
          
          {/* Skin Tone Card - FIXED ALIGNMENT */}
          <div className="bg-white px-8 py-4 rounded-2xl shadow-md flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl border-3 border-gray-300 shadow-md flex-shrink-0"
              style={{ backgroundColor: exact_skin_color?.hex }}
            />
            <div className="text-left">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Your Tone</p>
              <p className="text-2xl font-mono font-black text-gray-800">
                {exact_skin_color?.hex}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main display component */}
      <DressColorDisplay 
        dressColors={dress_color_recommendations}
        seasonName={dress_color_recommendations?.season_name}
      />

      {/* Simple tip - no heavy box */}
      <div className="bg-blue-50 p-4 rounded-2xl text-center">
        <p className="text-xl text-blue-800">
          💡 Switch to <span className="font-black">Full Analysis</span> for complete details
        </p>
      </div>

      {/* Clean button */}
      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-5 px-6 rounded-3xl font-black text-2xl shadow-lg transform hover:scale-105 transition-all"
      >
        🔄 Analyze Another Person
      </button>
    </div>
  )
}

export default DressColorRecommendation