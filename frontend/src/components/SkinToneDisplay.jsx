// // function SkinToneDisplay({ results, onReset }) {
// //   const { user_name, category, exact_skin_color, undertone_info, ai_validation } = results

// //   return (
// //     <div className="space-y-6">
// //       {/* User Name */}
// //       <div className="text-center">
// //         <h3 className="text-2xl font-bold text-pink-600">
// //           {user_name}'s Results
// //         </h3>
// //       </div>

// //       {/* Color Swatch */}
// //       <div className="text-center">
// //         <p className="text-sm font-medium text-gray-700 mb-2">Your Skin Color</p>
// //         <div
// //           className="w-full h-32 rounded-lg border-4 border-gray-300 shadow-lg"
// //           style={{ backgroundColor: exact_skin_color.hex }}
// //         />
// //         <p className="mt-2 text-lg font-mono font-bold">
// //           {exact_skin_color.hex}
// //         </p>
// //       </div>

// //       {/* Category */}
// //       <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
// //         <p className="text-sm font-medium text-gray-600">Category</p>
// //         <p className="text-xl font-bold text-pink-700 mt-1">
// //           #{category.number} - {category.name}
// //         </p>
// //         <p className="text-sm text-gray-600 mt-1">{category.description}</p>
// //       </div>

// //       {/* Undertone */}
// //       <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
// //         <p className="text-sm font-medium text-gray-600">Undertone</p>
// //         <p className="text-xl font-bold text-purple-700 mt-1">
// //           {undertone_info.undertone}
// //         </p>
// //         <p className="text-sm text-gray-600 mt-1">{undertone_info.description}</p>
// //       </div>

// //       {/* Fitzpatrick Type */}
// //       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
// //         <p className="text-sm font-medium text-gray-600">Fitzpatrick Type</p>
// //         <p className="text-xl font-bold text-blue-700 mt-1">
// //           Type {category.fitzpatrick}
// //         </p>
// //       </div>

// //       {/* AI Validation */}
// //       {ai_validation.validated && (
// //         <div className="bg-green-50 p-4 rounded-lg border border-green-200">
// //           <p className="text-sm font-bold text-green-700">
// //             ✓ AI Validated ({Math.round(ai_validation.confidence * 100)}% confidence)
// //           </p>
// //         </div>
// //       )}

// //       {/* Reset Button */}
// //       <button
// //         onClick={onReset}
// //         className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
// //       >
// //         🔄 Analyze Another Person
// //       </button>

// //       {/* Lipstick Recommendations
// //       {results.lipstick_recommendation && (
// //         <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
// //           <p className="text-sm font-medium text-gray-600">Lipstick Recommendations</p>

// //           <p className="text-xs text-gray-500 mt-2">{results.lipstick_recommendation.explanation}</p>

// //           {results.lipstick_recommendation.recommendations?.nude && (
// //             <>
// //               <p className="mt-3 font-semibold">Nude Shades</p>
// //               <ul className="list-disc ml-5">
// //                 {results.lipstick_recommendation.recommendations.nude.map((l) => (
// //                   <li key={l.name} className="text-sm">
// //                     <span
// //                       style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
// //                     />
// //                     {l.name} — <span className="text-gray-600">{l.description}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </>
// //           )} */}

// //           {/* everyday */}
// //           {results.lipstick_recommendation.recommendations?.everyday && (
// //             <>
// //               <p className="mt-3 font-semibold">Everyday Shades</p>
// //               <ul className="list-disc ml-5">
// //                 {results.lipstick_recommendation.recommendations.everyday.map((l) => (
// //                   <li key={l.name} className="text-sm">
// //                     <span
// //                       style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
// //                     />
// //                     {l.name} — <span className="text-gray-600">{l.description}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </>
// //           )}

// //           {/* bold */}
// //           {results.lipstick_recommendation.recommendations?.bold && (
// //             <>
// //               <p className="mt-3 font-semibold">Bold Shades</p>
// //               <ul className="list-disc ml-5">
// //                 {results.lipstick_recommendation.recommendations.bold.map((l) => (
// //                   <li key={l.name} className="text-sm">
// //                     <span
// //                       style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
// //                     />
// //                     {l.name} — <span className="text-gray-600">{l.description}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </>
// //           )}

// //           {/* Tips & Avoid */}
// //           {results.lipstick_recommendation.tips && (
// //             <div className="mt-3">
// //               <p className="font-semibold">Application Tips</p>
// //               <ul className="list-disc ml-5 text-sm">
// //                 {results.lipstick_recommendation.tips.map((t, i) => <li key={i}>{t}</li>)}
// //               </ul>
// //             </div>
// //           )}
// //           {results.lipstick_recommendation.avoid && (
// //             <div className="mt-3">
// //               <p className="font-semibold">Colors to Avoid</p>
// //               <ul className="list-disc ml-5 text-sm">
// //                 {results.lipstick_recommendation.avoid.map((a, i) => <li key={i}>{a}</li>)}
// //               </ul>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default SkinToneDisplay

// function SkinToneDisplay({ results, onReset }) {
//   const { user_name, category, exact_skin_color, undertone_info, ai_validation } = results;

//   return (
//     <div className="space-y-6">
//       {/* User Name */}
//       <div className="text-center">
//         <h3 className="text-2xl font-bold text-pink-600">
//           {user_name}'s Results
//         </h3>
//       </div>

//       {/* Color Swatch */}
//       <div className="text-center">
//         <p className="text-sm font-medium text-gray-700 mb-2">Your Skin Color</p>
//         <div
//           className="w-full h-32 rounded-lg border-4 border-gray-300 shadow-lg"
//           style={{ backgroundColor: exact_skin_color.hex }}
//         />
//         <p className="mt-2 text-lg font-mono font-bold">
//           {exact_skin_color.hex}
//         </p>
//       </div>

//       {/* Category */}
//       <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
//         <p className="text-sm font-medium text-gray-600">Category</p>
//         <p className="text-xl font-bold text-pink-700 mt-1">
//           #{category.number} - {category.name}
//         </p>
//         <p className="text-sm text-gray-600 mt-1">{category.description}</p>
//       </div>

//       {/* Undertone */}
//       <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//         <p className="text-sm font-medium text-gray-600">Undertone</p>
//         <p className="text-xl font-bold text-purple-700 mt-1">
//           {undertone_info.undertone}
//         </p>
//         <p className="text-sm text-gray-600 mt-1">{undertone_info.description}</p>
//       </div>

//       {/* Fitzpatrick Type */}
//       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//         <p className="text-sm font-medium text-gray-600">Fitzpatrick Type</p>
//         <p className="text-xl font-bold text-blue-700 mt-1">
//           Type {category.fitzpatrick}
//         </p>
//       </div>

//       {/* AI Validation */}
//       {ai_validation.validated && (
//         <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//           <p className="text-sm font-bold text-green-700">
//             ✓ AI Validated ({Math.round(ai_validation.confidence * 100)}% confidence)
//           </p>
//         </div>
//       )}

//       {/* Reset Button */}
//       <button
//         onClick={onReset}
//         className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
//       >
//         🔄 Analyze Another Person
//       </button>
//     </div>
//   );
// }

// export default SkinToneDisplay;
  

// function SkinToneDisplay({ results, onReset }) {
//   const { user_name, category, exact_skin_color, undertone_info, ai_validation } = results;

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 py-6 px-4">
      
//       {/* Decorative Floating Orbs */}
//       <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-float"></div>
//       <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-3xl mx-auto">
        
//         {/* Header - Compact */}
//         <div className="text-center mb-6 animate-fade-in">
//           <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
//             {user_name}'s Beauty Profile ✨
//           </h2>
//           <p className="text-pink-400 text-base font-semibold">Your personalized skin tone analysis</p>
//           <div className="h-1 w-48 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full shadow-lg mt-3 mx-auto"></div>
//         </div>

//         {/* Results Card */}
//         <div className="relative animate-scale-in">
//           {/* Glowing Effect */}
//           <div className="absolute -inset-3 bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 rounded-[2rem] blur-xl opacity-60 animate-pulse-slow"></div>
          
//           {/* Main Card */}
//           <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border-3 border-pink-200/60">
            
//             {/* Top Badge */}
//             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//               <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-6 py-1.5 shadow-xl border-2 border-white">
//                 <span className="text-white font-bold text-xs tracking-wider">🎨 YOUR RESULTS</span>
//               </div>
//             </div>

//             <div className="mt-4 space-y-5">
              
//               {/* Color Swatch - Compact */}
//               <div className="text-center">
//                 <p className="text-sm font-bold text-pink-500 mb-2">Your Exact Skin Color</p>
//                 <div className="relative mx-auto max-w-sm">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-rose-300 rounded-xl blur opacity-40"></div>
//                   <div
//                     className="relative w-full h-24 rounded-xl border-3 border-white shadow-xl"
//                     style={{ backgroundColor: exact_skin_color.hex }}
//                   />
//                 </div>
//                 <p className="mt-3 text-xl font-mono font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
//                   {exact_skin_color.hex}
//                 </p>
//               </div>

//               {/* Grid Layout for Info Cards - Compact */}
//               <div className="grid grid-cols-2 gap-3 mt-4">
                
//                 {/* Category Card */}
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border-2 border-pink-200/60 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">🏷️</span>
//                       <p className="text-xs font-bold text-gray-600">Category</p>
//                     </div>
//                     <p className="text-sm font-black text-pink-600 mt-1">
//                       #{category.number} - {category.name}
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1.5 leading-snug line-clamp-2">{category.description}</p>
//                   </div>
//                 </div>

//                 {/* Undertone Card */}
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200/60 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">🎨</span>
//                       <p className="text-xs font-bold text-gray-600">Undertone</p>
//                     </div>
//                     <p className="text-sm font-black text-purple-600 mt-1">
//                       {undertone_info.undertone}
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1.5 leading-snug line-clamp-2">{undertone_info.description}</p>
//                   </div>
//                 </div>

//                 {/* Fitzpatrick Type Card */}
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 p-3 rounded-lg border-2 border-rose-200/60 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">☀️</span>
//                       <p className="text-xs font-bold text-gray-600">Fitzpatrick</p>
//                     </div>
//                     <p className="text-sm font-black text-rose-600 mt-1">
//                       Type {category.fitzpatrick}
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1.5">Skin sensitivity level</p>
//                   </div>
//                 </div>

//                 {/* AI Validation Card */}
//                 {ai_validation.validated && (
//                   <div className="relative group">
//                     <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
//                     <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border-2 border-pink-200/60 shadow-md">
//                       <div className="flex items-center gap-1.5 mb-1">
//                         <span className="text-base">✓</span>
//                         <p className="text-xs font-bold text-gray-600">AI Verified</p>
//                       </div>
//                       <p className="text-sm font-black text-pink-600 mt-1">
//                         {Math.round(ai_validation.confidence * 100)}% Sure
//                       </p>
//                       <p className="text-xs text-gray-600 mt-1.5">AI analysis validated</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Action Button - Compact */}
//               <div className="mt-5">
//                 <button
//                   onClick={onReset}
//                   className="relative w-full px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white rounded-xl font-black text-base shadow-xl shadow-pink-400/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
//                 >
//                   {/* Animated Shine Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  
//                   <svg className="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <span className="relative tracking-wide">Analyze Another</span>
//                 </button>
//               </div>

//               {/* Bottom Decoration */}
//               <div className="flex justify-center items-center gap-2 pt-2">
//                 <div className="flex gap-1.5">
//                   <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-100"></div>
//                   <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-200"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Floating Decorative Elements */}
//           <div className="absolute -top-6 -right-6 w-16 h-16 bg-pink-300/30 rounded-full blur-lg animate-pulse"></div>
//           <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-rose-300/30 rounded-full blur-lg animate-pulse-delayed"></div>
//         </div>
//       </div>

//       {/* Custom Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-15px); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(15px); }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes scale-in {
//           from { opacity: 0; transform: scale(0.98); }
//           to { opacity: 1; transform: scale(1); }
//         }
        
//         .animate-float { animation: float 8s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
//         .animate-fade-in { animation: fade-in 0.8s ease-out; }
//         .animate-scale-in { animation: scale-in 0.8s ease-out 0.2s both; }
//         .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
//         .animate-pulse-delayed { animation: pulse 4s ease-in-out 2s infinite; }
//         .delay-100 { animation-delay: 100ms; }
//         .delay-200 { animation-delay: 200ms; }
//       `}</style>
//     </div>
//   );
// }

// export default SkinToneDisplay;



// // SkinToneDisplay.jsx
// function SkinToneDisplay({ results, onReset }) {
//   const { user_name, category, exact_skin_color, undertone_info, ai_validation } = results;

//   return (
//     <div className="w-full py-6 px-4">

//       {/* Main Content */}
//       <div className="relative z-10 max-w-3xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-6 animate-fade-in">
//           <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
//             {user_name}'s Beauty Profile ✨
//           </h2>
//           <p className="text-pink-400 text-base font-semibold">
//             Your personalized skin tone analysis
//           </p>
//           <div className="h-1 w-48 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full shadow-lg mt-3 mx-auto"></div>
//         </div>

//         {/* Results Card */}
//         <div className="relative animate-scale-in">

//           {/* Main Card */}
//           <div className="relative bg-white/95 rounded-[2rem] p-6 shadow-xl border-2 border-pink-200">

//             {/* Top Badge */}
//             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//               <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full px-6 py-1.5 shadow-xl border-2 border-white">
//                 <span className="text-white font-bold text-xs tracking-wider">🎨 YOUR RESULTS</span>
//               </div>
//             </div>

//             <div className="mt-4 space-y-5">

//               {/* Exact Skin Color */}
//               <div className="text-center">
//                 <p className="text-sm font-bold text-pink-500 mb-2">Your Exact Skin Color</p>

//                 <div className="relative mx-auto max-w-sm">
//                   <div
//                     className="relative w-full h-24 rounded-xl border-2 border-white shadow-xl"
//                     style={{ backgroundColor: exact_skin_color.hex }}
//                   />
//                 </div>

//                 <p className="mt-3 text-xl font-mono font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
//                   {exact_skin_color.hex}
//                 </p>
//               </div>

//               {/* Grid of Info Cards */}
//               <div className="grid grid-cols-2 gap-3 mt-4">

//                 {/* Category Card */}
//                 <div className="relative group">
//                   <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border-2 border-pink-200 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">🏷️</span>
//                       <p className="text-xs font-bold text-gray-600">Category</p>
//                     </div>
//                     <p className="text-sm font-black text-pink-600 mt-1">
//                       #{category.number} - {category.name}
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1.5">
//                       {category.description}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Undertone Card */}
//                 <div className="relative group">
//                   <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">🎨</span>
//                       <p className="text-xs font-bold text-gray-600">Undertone</p>
//                     </div>
//                     <p className="text-sm font-black text-purple-600 mt-1">
//                       {undertone_info.undertone}
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1.5">
//                       {undertone_info.description}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Fitzpatrick */}
//                 <div className="relative group">
//                   <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 p-3 rounded-lg border-2 border-rose-200 shadow-md">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="text-base">☀️</span>
//                       <p className="text-xs font-bold text-gray-600">Fitzpatrick</p>
//                     </div>
//                     <p className="text-sm font-black text-rose-600 mt-1">
//                       Type {category.fitzpatrick}
//                     </p>
//                   </div>
//                 </div>

//                 {/* AI validation */}
//                 {ai_validation.validated && (
//                   <div className="relative group">
//                     <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border-2 border-pink-200 shadow-md">
//                       <div className="flex items-center gap-1.5 mb-1">
//                         <span className="text-base">✓</span>
//                         <p className="text-xs font-bold text-gray-600">AI Verified</p>
//                       </div>
//                       <p className="text-sm font-black text-pink-600 mt-1">
//                         {Math.round(ai_validation.confidence * 100)}% Sure
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Reset Button */}
//               <div className="mt-5">
//                 <button
//                   onClick={onReset}
//                   className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white rounded-xl font-black shadow-xl hover:scale-105 transition-all"
//                 >
//                   Analyze Another
//                 </button>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SkinToneDisplay;

// SkinToneDisplay.jsx
function SkinToneDisplay({ results }) {
  const { category, undertone_info, exact_skin_color } = results;

  return (
    <div className="w-full max-w-5xl flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 w-full">

        {/* CATEGORY BOX */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-300 shadow mt-75">
          <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
            🏷 Category
          </h3>
          <p className="mt-2 font-semibold text-pink-600">
            #{category.number} - {category.name}
          </p>
          <p className="text-gray-600 mt-1 text-sm leading-snug">
            {category.description}
          </p>
        </div>

        {/* UNDERTONE BOX */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-300 shadow mt-75">
          <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
            🎨 Undertone
          </h3>
          <p className="mt-2 font-semibold text-purple-600">
            {undertone_info.undertone}
          </p>
          <p className="text-gray-600 mt-1 text-sm leading-snug">
            {undertone_info.description}
          </p>
        </div>

        {/* FITZPATRICK BOX */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-300 shadow mt-75">
          <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
            ☀ Fitzpatrick
          </h3>
          <p className="mt-2 font-semibold text-rose-600">
            Type {category.fitzpatrick}
          </p>
          <p className="text-gray-600 mt-1 text-sm">Skin sensitivity level</p>
        </div>

      </div>
    </div>
  );
}

export default SkinToneDisplay;


