"use client";

import { useEffect, memo, useState } from "react";
import { Pixelify_Sans, Share_Tech_Mono } from "next/font/google";
import FaultyTerminal from "@/src/components/reactbits/background/FaultyTerminal";
import { useSudoku, MAX_MISTAKES } from "@/src/lib/game/sudoku/useSudoku";
import { Difficulty } from "@/src/lib/game/sudoku/types";
import PointsPopup from "@/src/components/minigame/PointsPopup";
import InfoPopup from "../InfoPopup";
import { Info } from "lucide-react";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

const DIFF_TINT: Record<Difficulty, string> = {
  easy: "#2d4a3a",
  medium: "#4a3f2d",
  hard: "#4a2d2d",
};

const Background = memo(function Background({ tint }: { tint: string }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <FaultyTerminal
        scale={1.3} gridMul={[2, 1]} digitSize={1.2} timeScale={0.5}
        pause={false} scanlineIntensity={0.5} glitchAmount={1} flickerAmount={1}
        noiseAmp={1} chromaticAberration={0} dither={0} curvature={0.1}
        tint={tint}
        mouseReact={false} mouseStrength={0.5}
        pageLoadAnimation brightness={0.8}
      />
    </div>
  );
});

function HoverBtn({ onClick, children, active, style }: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: active || hovered ? "#d1d5db" : "#6b7280",
        border: `1px solid ${active ? "#6b7280" : "#374151"}`,
        fontSize: "0.875rem", padding: "0.25rem 0.75rem",
        background: "transparent", cursor: "pointer",
        borderRadius: "0.25rem", fontFamily: "inherit",
        letterSpacing: "0.05em", transition: "color 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const gridSize = "min(360px, 88vw)";

export default function Sudoku() {
  const [showInfo, setShowInfo] = useState(false);

  const {
    board, solution, given, notes, selected, setSelected,
    notesMode, toggleNotesMode, mistakes, diff,
    timer, gameOver, win,
    startGame, inputNumber, undoMove,
    popupPoints, showPopup, closePopup,
  } = useSudoku();

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver || win) return;
      if (e.key >= "1" && e.key <= "9") { inputNumber(parseInt(e.key)); return; }
      if (e.key === "Backspace" || e.key === "Delete") { inputNumber(0); return; }
      if (e.key === "n" || e.key === "N") { toggleNotesMode(); return; }
      if ((e.key === "z" || e.key === "Z") && e.ctrlKey) { undoMove(); return; }
      if (selected !== null) {
        const r = Math.floor(selected / 9), c = selected % 9;
        if (e.key === "ArrowUp" && r > 0) { setSelected(selected - 9); e.preventDefault(); }
        if (e.key === "ArrowDown" && r < 8) { setSelected(selected + 9); e.preventDefault(); }
        if (e.key === "ArrowLeft" && c > 0) { setSelected(selected - 1); e.preventDefault(); }
        if (e.key === "ArrowRight" && c < 8) { setSelected(selected + 1); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, inputNumber, undoMove, toggleNotesMode, gameOver, win, setSelected]);

  const formatTime = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  // cell color helpers
  const selRow = selected !== null ? Math.floor(selected / 9) : -1;
  const selCol = selected !== null ? selected % 9 : -1;
  const selBox = selected !== null ? Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3) : -1;
  const selVal = selected !== null ? board[selected] : 0;

  function getCellBg(i: number): string {
    const r = Math.floor(i / 9), c = i % 9;
    const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (i === selected) return "rgba(107,114,128,0.35)";
    if (selected !== null && (r === selRow || c === selCol || box === selBox)) return "rgba(107,114,128,0.12)";
    if (selVal && board[i] === selVal) return "rgba(156,163,175,0.2)";
    return (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 1 ? "rgba(255,255,255,0.03)" : "transparent";
  }

  function getCellColor(i: number): string {
    if (!board[i]) return "transparent";
    if (given[i]) return "#f3f4f6";
    if (board[i] !== solution[i]) return "#f87171";
    return "#d1d5db";
  }

  function getBorderRight(c: number) { return c === 8 ? "none" : c === 2 || c === 5 ? "2px solid #4b5563" : "1px solid #1f2937"; }
  function getBorderBottom(r: number) { return r === 8 ? "none" : r === 2 || r === 5 ? "2px solid #4b5563" : "1px solid #1f2937"; }

  function isExhausted(n: number) {
    return board.filter((v, i) => v === n && v === solution[i]).length === 9;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", backgroundColor: "#000", userSelect: "none", ...pixelifySans.style }}>
      <Background tint={DIFF_TINT[diff]} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem 2rem", gap: "1rem" }}>

        {/* Top-left: title + info icon */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ color: "#d1d5db", fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Sudoku
            </h1>
            <button
              onClick={() => setShowInfo(true)}
              aria-label="Game Info"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "1.75rem", height: "1.75rem",
                background: "transparent", cursor: "pointer", padding: 0,
                color: "#6b7280", transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.borderColor = "#6b7280"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#374151"; }}
            >
              <Info size={16} strokeWidth={1.5} />
            </button>
          </div>

          <InfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} title="Sudoku">
            <p>Fill the grid so each row, column, and 3×3 box contains 1–9 with no repeats. You have {MAX_MISTAKES} lives — use them wisely.</p>
          </InfoPopup>

          <HoverBtn onClick={() => window.history.back()} style={{ marginTop: "0.25rem", width: "fit-content" }}>← BACK</HoverBtn>
        </div>

        {/* Top-right: timer only */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <span style={{ color: "#d1d5db", fontSize: "1.5rem", letterSpacing: "0.1em", fontFamily: shareTechMono.style.fontFamily }}>
            {formatTime(timer)}
          </span>
        </div>

        {/* Bottom-left: hearts + difficulty */}
        <div style={{ position: "absolute", bottom: "1rem", left: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
              <span key={i} style={{ fontSize: "2.5rem", color: i < mistakes ? "#374151" : "#ef4444" }}>
                {i < mistakes ? "♡" : "♥"}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.375rem" }}>
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <HoverBtn key={d} onClick={() => startGame(d)} active={diff === d}>{d.toUpperCase()}</HoverBtn>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ width: gridSize, aspectRatio: "1", flexShrink: 0, padding: "4px", background: "rgba(15,15,20,0.88)", backdropFilter: "blur(8px)", border: "1px solid #374151", boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>
          <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gridTemplateRows: "repeat(9, 1fr)", border: "1px solid #4b5563" }}>
            {board.map((val, i) => {
              const r = Math.floor(i / 9), c = i % 9;
              const n = notes[i];
              return (
                <div key={i} onClick={() => setSelected(i)} style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: getCellBg(i), color: getCellColor(i), borderRight: getBorderRight(c), borderBottom: getBorderBottom(r), fontSize: "clamp(14px, 3.5vw, 22px)", fontWeight: given[i] ? "700" : "400", transition: "background-color 0.1s", position: "relative" }}>
                  {val ? (
                    <span style={{ fontFamily: shareTechMono.style.fontFamily }}>{val}</span>
                  ) : n && n.size > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", width: "100%", height: "100%", padding: "1px" }}>
                      {Array.from({ length: 9 }, (_, d) => d + 1).map((d) => (
                        <span key={d} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: "clamp(5px, 1.1vw, 8px)" }}>
                          {n.has(d) ? d : ""}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Numpad */}
        <div style={{ display: "flex", gap: "0.5rem", width: gridSize, alignItems: "flex-end" }}>
          <HoverBtn onClick={() => inputNumber(0)} style={{ width: "2.5rem", flexShrink: 0, alignSelf: "flex-end", padding: "0.6rem 0", fontSize: "1rem", textAlign: "center" }}>⌫</HoverBtn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.375rem", flex: 1 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
              isExhausted(n) ? (
                <div key={n} style={{ padding: "0.65rem 0", fontSize: "1.25rem", textAlign: "center", color: "#1f2937", border: "1px solid #1f2937", borderRadius: "0.25rem", pointerEvents: "none", letterSpacing: "0.1em", fontFamily: shareTechMono.style.fontFamily }}>{n}</div>
              ) : (
                <HoverBtn key={n} onClick={() => inputNumber(n)} style={{ padding: "0.65rem 0", fontSize: "1.25rem", textAlign: "center", fontFamily: shareTechMono.style.fontFamily, letterSpacing: "0.1em", color: "#d1d5db", borderColor: "#4b5563" }}>{n}</HoverBtn>
              )
            )}
          </div>

          <HoverBtn onClick={toggleNotesMode} active={notesMode} style={{ width: "2.5rem", flexShrink: 0, alignSelf: "flex-end", padding: "0.6rem 0", fontSize: "1rem", textAlign: "center" }}>✏️</HoverBtn>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "0.375rem", alignItems: "center", width: gridSize }}>
          <HoverBtn onClick={undoMove}>↩ UNDO</HoverBtn>
          <HoverBtn onClick={() => startGame(diff)}>↺ NEW</HoverBtn>
          {win && <span style={{ color: "#9ca3af", fontSize: "0.75rem", letterSpacing: "0.1em" }}>SOLVED · {formatTime(timer)}</span>}
          {gameOver && !win && (
            <span style={{ color: "#ef4444", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
              GAME OVER · <span onClick={() => startGame(diff)} style={{ cursor: "pointer", textDecoration: "underline" }}>RETRY</span>
            </span>
          )}
        </div>

        <p style={{ color: "#4b5563", fontSize: "0.75rem", margin: 0, letterSpacing: "0.05em" }}>
          1–9 to place · N to toggle notes · Ctrl+Z to undo · Arrows to move
        </p>

      </div>
      <PointsPopup
        points={popupPoints ?? 0}
        show={showPopup}
        onComplete={closePopup}
      />
    </div>
  );
}