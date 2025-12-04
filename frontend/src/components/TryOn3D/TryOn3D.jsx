import React, { useRef, useEffect } from "react";

export default function TryOn3D({ currentShade }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load MediaPipe scripts from CDN
    const loadScript = (src) =>
      new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.body.appendChild(s);
      });

    const init = async () => {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
      );

      const { FaceMesh } = window;
      const { drawConnectors, FACEMESH_LIPS } = window;

      faceMeshRef.current = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshRef.current.onResults((results) => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.multiFaceLandmarks && currentShade) {
          results.multiFaceLandmarks.forEach((landmarks) => {
            ctx.fillStyle = currentShade.hex;
            ctx.globalAlpha = 0.6;

            ctx.beginPath();
            FACEMESH_LIPS.forEach(([i]) => {
              const x = landmarks[i].x * canvas.width;
              const y = landmarks[i].y * canvas.height;
              ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
          });
        }
      });

      // Start webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          // Start sending frames to MediaPipe
          const sendFrame = async () => {
            if (faceMeshRef.current && video.readyState >= 2) {
              await faceMeshRef.current.send({ image: video });
            }
            requestAnimationFrame(sendFrame);
          };
          sendFrame();
        };
      } catch (err) {
        console.error("❌ Could not open webcam", err);
      }
    };

    init();
  }, [currentShade]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border-2 border-pink-400 rounded-lg"
      />
      <video
        ref={videoRef}
        style={{ display: "none" }}
      />
    </div>
  );
}
