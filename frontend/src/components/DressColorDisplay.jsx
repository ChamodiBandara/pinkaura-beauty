// import React from 'react';

// function DressColorDisplay({ dressColors, seasonName }) {
//   if (!dressColors) return null;

//   const { best_colors, jewelry, styling_tips, color_summary } = dressColors;

//   // Larger, more visible frock design
//   const SimpleFrock = ({ color, size = "w-40 h-48" }) => (
//     <svg 
//       className={size}
//       viewBox="0 0 120 160" 
//       fill="none" 
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {/* Hanger */}
//       <path
//         d="M40 8 Q60 3 80 8"
//         stroke="#2C3E50"
//         strokeWidth="4"
//         strokeLinecap="round"
//         fill="none"
//       />
//       <circle cx="60" cy="6" r="4" fill="#2C3E50" />
      
//       {/* Dress straps */}
//       <line x1="45" y1="8" x2="48" y2="30" stroke="#2C3E50" strokeWidth="3" />
//       <line x1="75" y1="8" x2="72" y2="30" stroke="#2C3E50" strokeWidth="3" />
      
//       {/* Main dress body - A-line silhouette */}
//       <path
//         d="M48 30 L46 35 L43 55 L40 85 L38 130 Q38 148 50 148 L70 148 Q82 148 82 130 L80 85 L77 55 L74 35 L72 30 Z"
//         fill={color}
//         stroke="#2C3E50"
//         strokeWidth="2.5"
//         strokeLinejoin="round"
//       />
      
//       {/* V-neck highlight */}
//       <path
//         d="M48 30 L60 42 L72 30"
//         fill="rgba(255, 255, 255, 0.3)"
//         stroke="#2C3E50"
//         strokeWidth="2"
//       />
      
//       {/* Waist definition */}
//       <ellipse
//         cx="60"
//         cy="65"
//         rx="20"
//         ry="3"
//         fill="#000"
//         opacity="0.15"
//       />
      
//       {/* Side shadows for depth */}
//       <path
//         d="M48 30 L46 35 L43 55 L40 85 L38 130"
//         stroke="#000"
//         strokeWidth="2"
//         opacity="0.2"
//         fill="none"
//       />
//       <path
//         d="M72 30 L74 35 L77 55 L80 85 L82 130"
//         stroke="#000"
//         strokeWidth="2"
//         opacity="0.2"
//         fill="none"
//       />
      
//       {/* Hem shadow */}
//       <ellipse
//         cx="60"
//         cy="148"
//         rx="22"
//         ry="3"
//         fill="#000"
//         opacity="0.25"
//       />
//     </svg>
//   );

//   return (
//     <div className="space-y-8 py-6">
//       {/* Divider */}
//       <div className="border-t-4 border-pink-300 my-8"></div>

//       {/* Header */}
//       <div className="text-center space-y-4">
//         <h2 className="text-4xl font-bold text-gray-800 mb-3">
//           Your Best Colors on Dresses
//         </h2>
//         {seasonName && (
//           <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 px-8 py-3 rounded-full shadow-lg border-2 border-pink-300">
//             <p className="text-2xl font-bold text-purple-700">
//               {seasonName}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Color Summary */}
//       {color_summary && (
//         <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-200 shadow-md">
//           <p className="text-gray-700 text-center leading-relaxed text-lg">
//             {color_summary}
//           </p>
//         </div>
//       )}

//       {/* Main Dress Colors Section */}
//       <div className="bg-white p-8 rounded-2xl shadow-xl border-3 border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
//           {best_colors?.map((color, idx) => (
//             <div 
//               key={idx}
//               className="relative flex flex-col items-center p-6 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-3 border-gray-200 hover:border-pink-400 hover:-translate-y-3"
//             >
//               {/* Number Badge - Top Right */}
//               <div 
//                 className="absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center font-bold text-white text-xl z-10"
//                 style={{ backgroundColor: color.hex }}
//               >
//                 {idx + 1}
//               </div>

//               {/* Dress with Color - Much Larger */}
//               <div className="mb-4 transform transition-transform hover:scale-110">
//                 <SimpleFrock color={color.hex} size="w-48 h-56" />
//               </div>

//               {/* Color Name - Larger */}
//               <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
//                 {color.name}
//               </h3>
              
//               {/* Category Badge */}
//               <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-700 text-sm rounded-full font-semibold mb-3">
//                 {color.category}
//               </span>

//               {/* Hex Code - Larger */}
//               <div className="bg-gray-100 px-4 py-2 rounded-lg mb-3">
//                 <p className="text-base font-mono text-gray-700 font-bold">
//                   {color.hex}
//                 </p>
//               </div>

//               {/* Description */}
//               <p className="text-sm text-gray-600 text-center leading-relaxed">
//                 {color.description}
//               </p>

//               {/* Color Preview Bar */}
//               <div 
//                 className="w-full h-4 rounded-full mt-4 shadow-inner"
//                 style={{ backgroundColor: color.hex }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Jewelry Recommendation */}
//       {jewelry && (
//         <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-2xl border-3 border-yellow-300 shadow-lg">
//           <div className="flex items-center justify-center gap-4">
//             <span className="text-5xl">💍</span>
//             <div className="text-center">
//               <p className="font-bold text-yellow-800 text-2xl mb-1">Perfect Jewelry Match</p>
//               <p className="text-gray-700 text-xl">{jewelry}</p>
//             </div>
//             <span className="text-5xl">✨</span>
//           </div>
//         </div>
//       )}

//       {/* Styling Tips */}
//       {styling_tips && styling_tips.length > 0 && (
//         <div className="bg-purple-50 p-8 rounded-2xl border-3 border-purple-200 shadow-lg">
//           <h3 className="text-3xl font-bold text-purple-700 mb-6 text-center flex items-center justify-center gap-3">
//             <span>💡</span>
//             Expert Styling Tips
//             <span>💡</span>
//           </h3>
//           <div className="grid md:grid-cols-2 gap-5">
//             {styling_tips.map((tip, idx) => (
//               <div 
//                 key={idx} 
//                 className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
//               >
//                 <span className="text-green-500 text-3xl flex-shrink-0">✓</span>
//                 <span className="text-gray-700 leading-relaxed text-base">{tip}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Color Palette Preview Bar */}
//       <div className="bg-white p-8 rounded-2xl border-3 border-gray-300 shadow-xl">
//         <p className="text-2xl font-bold text-gray-700 mb-5 text-center flex items-center justify-center gap-3">
//           <span>🎨</span>
//           Your Complete Color Palette
//         </p>
//         <div className="space-y-4">
//           {/* Color bar */}
//           <div className="flex rounded-2xl overflow-hidden border-4 border-gray-400 h-32 shadow-lg">
//             {best_colors?.map((color, idx) => (
//               <div
//                 key={idx}
//                 className="flex-1 transition-all duration-300 hover:flex-[2] cursor-pointer relative group"
//                 style={{ backgroundColor: color.hex }}
//                 title={`${color.name} - ${color.hex}`}
//               >
//                 {/* Overlay on hover */}
//                 <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                
//                 {/* Name tooltip on hover */}
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                   <span className="text-white font-bold text-lg bg-black bg-opacity-70 px-4 py-2 rounded-xl shadow-2xl">
//                     {color.name}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Hex codes below */}
//           <div className="flex justify-between text-sm text-gray-700 font-mono font-bold px-2">
//             {best_colors?.map((color, idx) => (
//               <span key={idx} className="text-center flex-1">
//                 {color.hex}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-t-4 border-pink-300 my-8"></div>
//     </div>
//   );
// }

// export default DressColorDisplay;

import React from 'react';

function DressColorDisplay({ dressColors, seasonName }) {
  console.log('🎨 DressColorDisplay received:', { dressColors, seasonName });
  
  if (!dressColors) {
    console.log('❌ No dressColors data');
    return null;
  }

  const { best_colors, jewelry, styling_tips } = dressColors;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      
      {/* Season Name Header */}
      {seasonName && (
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg">
            <p className="text-2xl md:text-3xl font-black">✨ {seasonName} ✨</p>
          </div>
        </div>
      )}

      {/* Color Grid - Simple and Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {best_colors?.map((color, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-3">
            
            {/* Large Color Box */}
            <div 
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-2xl shadow-2xl border-4 border-white hover:scale-105 hover:-rotate-2 transition-all duration-300"
              style={{ 
                backgroundColor: color.hex,
                minWidth: '128px',
                minHeight: '128px'
              }}
            />
            
            {/* Color Name */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 text-center leading-tight">
              {color.name}
            </h3>
            
            {/* Hex Code */}
            <p className="text-sm sm:text-base font-mono text-gray-600 font-bold">
              {color.hex}
            </p>
          </div>
        ))}
      </div>

      {/* Jewelry Section */}
      {jewelry && (
        <div className="text-center py-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 rounded-3xl shadow-lg">
          <p className="text-2xl md:text-3xl font-black text-yellow-900 mb-2">
            💍 Perfect Jewelry
          </p>
          <p className="text-xl md:text-2xl text-gray-800 font-bold">
            {jewelry}
          </p>
        </div>
      )}

      {/* Styling Tips */}
      {styling_tips && styling_tips.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg">
          <h3 className="text-3xl md:text-4xl font-black text-purple-900 mb-6 text-center">
            💡 Expert Styling Tips
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {styling_tips.map((tip, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-md"
              >
                <span className="text-2xl flex-shrink-0">✓</span>
                <span className="text-base md:text-lg text-gray-800 font-medium">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color Palette Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <p className="text-2xl md:text-3xl font-black text-gray-800 mb-4 text-center">
          🎨 Your Complete Color Palette
        </p>
        
        <div className="flex rounded-2xl overflow-hidden h-24 shadow-xl border-4 border-gray-200">
          {best_colors?.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 transition-all duration-300 hover:flex-[1.5] cursor-pointer relative group"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                <p className="text-white font-black text-lg px-2 text-center break-words">
                  {color.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DressColorDisplay;