"use client";

import { useReducer, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { generateGame } from "@/src/lib/game/mapGen";
import { gameReducer } from "@/src/lib/game/gameReducer";
import MapDisplay from "../../../components/minigame/MapDisplay";
import GameTerminal from "../../../components/minigame/GameTerminal";
import FaultyTerminal from "../../../components/reactbits/FaultyTerminal";
import { Pixelify_Sans } from "next/font/google";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Background = memo(function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <FaultyTerminal
        scale={1.3}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={0.5}
        pause={false}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0.1}
        tint="#363248"
        mouseReact={false}
        mouseStrength={0.5}
        pageLoadAnimation
        brightness={0.6}
      />
    </div>
  );
});

const buttonStyle = {
  color: "#6b7280",
  border: "1px solid #374151",
  fontSize: "0.875rem",
  padding: "0.25rem 0.75rem",
  width: "fit-content",
  background: "transparent",
  cursor: "pointer",
  borderRadius: "0.25rem",
  fontFamily: "inherit",
  textDecoration: "none",
  display: "inline-block",
};

export default function Page() {
  const [state, dispatch] = useReducer(gameReducer, null, generateGame);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (
        state?.phase === "enterKey" ||
        state?.phase === "dead" ||
        state?.phase === "escaped"
      )
        return;
      const dir = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(dir)) {
        e.preventDefault();
        dispatch({ type: "MOVE", dir: dir as "w" | "a" | "s" | "d" });
      }
    },
    [state?.phase],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#000000",
        ...pixelifySans.style,
      }}
    >
      <Background />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        {/* Top-left header */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <h1
            style={{
              color: "#d1d5db",
              fontSize: "1.5rem",
              fontWeight: "bold",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Dungeon
          </h1>
          <button
            onClick={() => dispatch({ type: "RESTART" })}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d1d5db")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Restart
          </button>
          <Link
            href="/"
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d1d5db")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            ← Back
          </Link>
        </div>

        {/* Centered map */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <MapDisplay state={state} />
        </div>

        {/* Bottom-left terminal */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            width: "380px",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <GameTerminal state={state} dispatch={dispatch} />
          <p style={{ color: "#4b5563", fontSize: "0.75rem", margin: 0 }}>
            W A S D to move · Find fragments · Reach the exit
          </p>
        </div>
      </div>
    </div>
  );
}
