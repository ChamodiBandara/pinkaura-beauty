import React, { useState, useEffect } from "react";
import TryOn3D from "../components/TryOn3D/TryOn3D";
import { getShades } from "../api/api";
import "./VirtualTryOnPage.css"; // Import CSS

export default function VirtualTryOnPage() {
  const [shades, setShades] = useState([]);
  const [currentShade, setCurrentShade] = useState(0);

  useEffect(() => {
    getShades().then(setShades);
  }, []);

  return (
    <div className="tryon-page">
      <h2 className="page-title">💄 Virtual Lipstick Try-On</h2>

      {/* Lipstick Buttons */}
      {shades.length > 0 && (
        <div className="shade-buttons">
          {shades.map((shade, i) => (
            <button
              key={i}
              className={`lip-button ${i === currentShade ? "active" : ""}`}
              style={{ backgroundColor: shade.hex }}
              onClick={() => setCurrentShade(i)}
            />
          ))}
        </div>
      )}

      <div className="tryon-canvas-container">
        <TryOn3D currentShade={shades[currentShade]} />
      </div>
    </div>
  );
}
