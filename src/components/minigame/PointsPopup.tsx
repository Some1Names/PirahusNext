"use client";

import { useEffect, useState } from "react";
import { Share_Tech_Mono } from "next/font/google";

const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

interface PointsPopupProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export default function PointsPopup({ points, show, onComplete }: PointsPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2200);
    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          animation: visible ? "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : "none",
        }}
      >
        <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>🪙</span>
        <span
          style={{
            color: "#fbbf24",
            fontSize: "2.5rem",
            fontFamily: shareTechMono.style.fontFamily,
            letterSpacing: "0.05em",
            textShadow: "0 0 20px #fbbf24aa",
          }}
        >
          +{points} pts
        </span>
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.5) translateY(20px); opacity: 0; }
          60%  { transform: scale(1.1) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}