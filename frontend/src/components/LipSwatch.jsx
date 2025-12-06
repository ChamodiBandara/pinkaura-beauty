import React from "react";

/**
 * LipSwatch as a solid color block
 * Props:
 *  - color: string (hex color)
 *  - size: number (width & height in px, default 120)
 */
function LipSwatch({ color, size = 120 }) {
  return (
    <div
      className="shadow-lg hover:scale-105 transition-transform duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color || "#ccc", // solid color
        borderRadius: "16px", // rounded corners
        border: "2px solid #ddd",
      }}
    ></div>
  );
}

export default LipSwatch;
