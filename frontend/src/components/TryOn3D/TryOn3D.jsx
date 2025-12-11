import React, { useRef, useEffect, useState } from "react";

export default function TryOn3D({ currentShade }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const updateCanvasSize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const width = parent.clientWidth;
      const height = (width * 480) / 640; // keep 4:3 ratio
      setCanvasSize({ width, height });
      canvas.width = width;
      canvas.height = height;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const loadScript = (src) =>
      new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.body.appendChild(s);
      });

    const init = async () => {
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");
      const { FaceMesh } = window;
      const { FACEMESH_LIPS, FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } = window;

      faceMeshRef.current = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshRef.current.onResults((results) => {
        if (!canvas || !ctx) return;

        // Draw crisp original video
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.multiFaceLandmarks) {
          results.multiFaceLandmarks.forEach((landmarks) => {
            // =========================
            // 1️⃣ Subtle skin smoothing / foundation
            // =========================
            ctx.save();
            ctx.globalAlpha = 0.12; // subtle foundation overlay
            ctx.fillStyle = "#ffe0d6"; // soft skin tone
            ctx.beginPath();
            FACEMESH_FACE_OVAL.forEach(([i]) => {
              const x = landmarks[i].x * canvas.width;
              const y = landmarks[i].y * canvas.height;
              ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // =========================
            // 2️⃣ Blush on cheeks
            // =========================
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#ffb6c1"; // soft pink
            // Using cheeks as midpoint between eyes and face edge (approximation)
            const leftCheek = landmarks[234]; // approximate left cheek
            const rightCheek = landmarks[454]; // approximate right cheek
            ctx.beginPath();
            ctx.ellipse(leftCheek.x * canvas.width, leftCheek.y * canvas.height, 15, 10, 0, 0, Math.PI * 2);
            ctx.ellipse(rightCheek.x * canvas.width, rightCheek.y * canvas.height, 15, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // =========================
            // 3️⃣ Eyeshadow
            // =========================
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#d8b4f2"; // subtle purple shade
            const drawEye = (eyeLandmarks) => {
              ctx.beginPath();
              eyeLandmarks.forEach(([i]) => {
                const x = landmarks[i].x * canvas.width;
                const y = landmarks[i].y * canvas.height;
                ctx.lineTo(x, y);
              });
              ctx.closePath();
              ctx.fill();
            };
            drawEye(FACEMESH_LEFT_EYE);
            drawEye(FACEMESH_RIGHT_EYE);
            ctx.restore();

            // =========================
            // 4️⃣ Eyeliner (subtle)
            // =========================
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.2;
            const drawEyeliner = (eyeLandmarks) => {
              ctx.beginPath();
              eyeLandmarks.forEach(([i]) => {
                const x = landmarks[i].x * canvas.width;
                const y = landmarks[i].y * canvas.height;
                ctx.lineTo(x, y);
              });
              ctx.closePath();
              ctx.stroke();
            };
            drawEyeliner(FACEMESH_LEFT_EYE);
            drawEyeliner(FACEMESH_RIGHT_EYE);
            ctx.restore();

            // =========================
            // 5️⃣ Lipstick
            // =========================
            if (currentShade) {
              ctx.save();
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
              ctx.restore();
            }
          });
        }
      });

      // =========================
      // Webcam feed
      // =========================
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          const sendFrame = async () => {
            if (faceMeshRef.current && video.readyState >= 2) {
              await faceMeshRef.current.send({ image: video });
            }
            animationFrameId = requestAnimationFrame(sendFrame);
          };
          sendFrame();
        };
      } catch (err) {
        console.error("❌ Could not open webcam", err);
      }
    };

    init();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (faceMeshRef.current) faceMeshRef.current.close();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (video && video.srcObject)
        video.srcObject.getTracks().forEach((track) => track.stop());
    };
  }, [currentShade]);

  return (
    <div className="w-full flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border-2 border-pink-400 rounded-lg"
      />
      <video ref={videoRef} style={{ display: "none" }} playsInline muted />
    </div>
  );
}
