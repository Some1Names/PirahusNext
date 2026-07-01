"use client";

import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "700"] });

interface PtsBadgeProps {
  pts?: number;
  isLoading?: boolean;
}

export default function PtsBadge({ pts, isLoading }: PtsBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem 0.3rem 0.5rem",
        ...pixelify.style,
      }}
    >
      {/* coin icon */}
      <span
        style={{
          fontSize: "1.1rem",
          lineHeight: 1,
          filter: "grayscale(1) brightness(5)",
          userSelect: "none",
        }}
      >
        🪙
      </span>

      {/* pts value */}
      <span
        style={{
          color: "#d1d5db",
          fontSize: "0.85rem",
          letterSpacing: "0.05em",
          fontWeight: 400,
        }}
      >
        {isLoading ? "..." : `${pts?.toLocaleString() || 0} pts.`}
      </span>
    </div>
  );
}
