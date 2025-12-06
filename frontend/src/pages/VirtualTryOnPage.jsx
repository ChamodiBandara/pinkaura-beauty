// import React, { useState, useEffect } from "react";
// import TryOn3D from "../components/TryOn3D/TryOn3D";
// import { getShades } from "../api/api";
// import "./VirtualTryOnPage.css"; // Import CSS

// export default function VirtualTryOnPage() {
//   const [shades, setShades] = useState([]);
//   const [currentShade, setCurrentShade] = useState(0);

//   useEffect(() => {
//     getShades().then(setShades);
//   }, []);

//   return (
//     <div className="tryon-page">
//       <h2 className="page-title">💄 Virtual Lipstick Try-On</h2>

//       {/* Lipstick Buttons */}
//       {shades.length > 0 && (
//         <div className="shade-buttons">
//           {shades.map((shade, i) => (
//             <button
//               key={i}
//               className={`lip-button ${i === currentShade ? "active" : ""}`}
//               style={{ backgroundColor: shade.hex }}
//               onClick={() => setCurrentShade(i)}
//             />
//           ))}
//         </div>
//       )}

//       <div className="tryon-canvas-container">
//         <TryOn3D currentShade={shades[currentShade]} />
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import TryOn3D from "../components/TryOn3D/TryOn3D";
import { getShades } from "../api/api";

export default function VirtualTryOnPage() {
  const [shades, setShades] = useState([]);
  const [currentShade, setCurrentShade] = useState(0);

  useEffect(() => {
    getShades().then(setShades);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-[#fcd5ce] to-[#d0bbe4]">
      <h2 className="text-3xl font-bold text-[#b30059] mb-6 text-center">
        💄 Virtual Lipstick Try-On
      </h2>

      {/* Lipstick Buttons */}
      {shades.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {shades.map((shade, i) => (
            <button
              key={i}
              onClick={() => setCurrentShade(i)}
              style={{ backgroundColor: shade.hex }}
              className={`w-[60px] h-[40px] rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border-2 border-white
                transition-all duration-200 cursor-pointer
                hover:scale-115 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]
                ${i === currentShade ? "border-[3px] border-black scale-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]" : ""}
              `}
            />
          ))}
        </div>
      )}

      {/* Canvas Container */}
      <div className="w-[680px] h-[520px] border-[3px] border-pink-400 rounded-2xl overflow-hidden flex justify-center items-center shadow-lg">
        <TryOn3D currentShade={shades[currentShade]} />
      </div>
    </div>
  );
}
