"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

function ToMinigame() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty("--x", `${x}px`);
        btn.style.setProperty("--y", `${y}px`);
    };

    const handleMouseEnter = () => {
        btnRef.current?.style.setProperty("--opacity", "1");
    };

    const handleMouseLeave = () => {
        btnRef.current?.style.setProperty("--opacity", "0");
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-screen relative overflow-hidden"
            style={{ background: "#0f0a14" }}
        >
            {/* faint scanline texture, matches the terminal chrome used elsewhere */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, #c084fc 0px, #c084fc 1px, transparent 1px, transparent 3px)",
                }}
            />

            <div
                className="text-sm tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(192,132,252,0.5)" }}
            >
                system // navigation
            </div>
            <div
                className="text-5xl font-bold mb-10"
                style={{ fontFamily: "'Pixelify Sans', sans-serif", color: "#f5eaff" }}
            >
                /to Minigame
            </div>

            <style>{`
        .glow-btn {
          position: relative;
          padding: 1.1rem 2.75rem;
          border-radius: 6px;
          background: #150f1c;
          border: 1px solid rgba(192, 132, 252, 0.35);
          color: #f5eaff;
          font-weight: 500;
          font-size: 1.05rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform 0.1s ease, border-color 0.2s ease;
        }

        .glow-btn:hover {
          border-color: rgba(244, 114, 182, 0.6);
        }

        .glow-btn:active {
          transform: scale(0.96);
        }

        .glow-btn:focus-visible {
          outline: 2px solid #f472b6;
          outline-offset: 3px;
        }

        .glow-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 6px;
          padding: 1px;
          background: radial-gradient(
            120px circle at var(--x) var(--y),
            #c084fc, #f472b6, transparent 70%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: var(--opacity, 0);
          transition: opacity 0.3s ease;
        }

        .glow-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 6px;
          background: radial-gradient(
            80px circle at var(--x) var(--y),
            rgba(192, 132, 252, 0.15), transparent 70%
          );
          opacity: var(--opacity, 0);
          transition: opacity 0.3s ease;
        }

        .glow-btn .arrow {
          transition: transform 0.2s ease;
        }

        .glow-btn:hover .arrow {
          transform: translateX(4px);
        }

        .cursor-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cursor-blink { animation: none; }
          .glow-btn .arrow { transition: none; }
        }
      `}</style>

            <button
                ref={btnRef}
                className="glow-btn"
                onClick={() => router.push("/minigames")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Go to Minigame
                <FaArrowRight size={16} className="arrow" style={{ color: "#c084fc" }} />
            </button>

            <div
                className="mt-6 text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(192,132,252,0.35)" }}
            >
                press to continue<span className="cursor-blink">_</span>
            </div>
        </div>
    );
}

export default ToMinigame;