"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import FaultyTerminal from "@/src/components/reactbits/background/FaultyTerminal";
import { Pixelify_Sans, Share_Tech_Mono } from "next/font/google";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
});

// ── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

interface HistoryEntry {
  idx: number;
  prevValue: number;
  prevNotes: Set<number>;
}

// ── Background (same as Dungeon) ─────────────────────────────────────────────

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

// ── Shared button style (mirrors Dungeon) ─────────────────────────────────────

const btnBase: React.CSSProperties = {
  color: "#6b7280",
  border: "1px solid #374151",
  fontSize: "0.875rem",
  padding: "0.25rem 0.75rem",
  background: "transparent",
  cursor: "pointer",
  borderRadius: "0.25rem",
  fontFamily: "inherit",
  letterSpacing: "0.05em",
  transition: "color 0.15s",
};

function HoverBtn({
  onClick,
  children,
  active,
  style,
}: {
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
        ...btnBase,
        color: active ? "#d1d5db" : hovered ? "#d1d5db" : "#6b7280",
        borderColor: active ? "#6b7280" : "#374151",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Pure puzzle logic ─────────────────────────────────────────────────────────

function canPlace(board: number[], row: number, col: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row * 9 + i] === n || board[i * 9 + col] === n) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[(br + i) * 9 + (bc + j)] === n) return false;
  return true;
}

function solve(board: number[]): boolean {
  const pos = board.indexOf(0);
  if (pos < 0) return true;
  const row = Math.floor(pos / 9);
  const col = pos % 9;
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (const n of nums) {
    if (canPlace(board, row, col, n)) {
      board[pos] = n;
      if (solve(board)) return true;
      board[pos] = 0;
    }
  }
  return false;
}

function generatePuzzle(diff: Difficulty): { board: number[]; solution: number[] } {
  const sol = Array(81).fill(0);
  solve(sol);
  const puzzle = [...sol];
  const removals: Record<Difficulty, number> = { easy: 35, medium: 45, hard: 52 };
  const cells = [...Array(81).keys()].sort(() => Math.random() - 0.5);
  for (let i = 0; i < removals[diff]; i++) puzzle[cells[i]] = 0;
  return { board: puzzle, solution: sol };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Sudoku() {
  const [board, setBoard] = useState<number[]>(Array(81).fill(0));
  const [solution, setSolution] = useState<number[]>(Array(81).fill(0));
  const [given, setGiven] = useState<boolean[]>(Array(81).fill(false));
  const [notes, setNotes] = useState<Set<number>[]>(
    Array(81).fill(null).map(() => new Set())
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_MISTAKES = 3;

  const startGame = useCallback((d: Difficulty) => {
    const { board: b, solution: s } = generatePuzzle(d);
    setBoard(b);
    setSolution(s);
    setGiven(b.map((v) => v !== 0));
    setNotes(Array(81).fill(null).map(() => new Set()));
    setSelected(null);
    setNotesMode(false);
    setMistakes(0);
    setHistory([]);
    setDiff(d);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  }, []);

  useEffect(() => {
    startGame("easy");
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startGame]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  const inputNumber = useCallback(
    (n: number) => {
      if (selected === null || given[selected] || gameOver || win) return;
      setHistory((h) => [
        ...h,
        { idx: selected, prevValue: board[selected], prevNotes: new Set(notes[selected]) },
      ]);
      if (notesMode && n !== 0) {
        setNotes((prev) => {
          const next = prev.map((s) => new Set(s));
          if (next[selected].has(n)) next[selected].delete(n);
          else next[selected].add(n);
          return next;
        });
        return;
      }
      if (n === 0) {
        setBoard((b) => { const nb = [...b]; nb[selected] = 0; return nb; });
        return;
      }
      if (board[selected] === n) {
        setBoard((b) => { const nb = [...b]; nb[selected] = 0; return nb; });
        return;
      }
      const isCorrect = n === solution[selected];
      if (!isCorrect) {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        if (newMistakes >= MAX_MISTAKES) {
          setGameOver(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
      setBoard((b) => {
        const nb = [...b];
        nb[selected] = n;
        const solved = nb.every((v, i) => v === solution[i]);
        if (solved) {
          setWin(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return nb;
      });
      if (isCorrect) {
        setNotes((prev) => {
          const next = prev.map((s) => new Set(s));
          const selRow = Math.floor(selected / 9);
          const selCol = selected % 9;
          const selBox = Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3);
          for (let i = 0; i < 81; i++) {
            const r = Math.floor(i / 9), c = i % 9;
            const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
            if (r === selRow || c === selCol || box === selBox) next[i].delete(n);
          }
          return next;
        });
      }
    },
    [selected, given, gameOver, win, notesMode, board, solution, mistakes, notes]
  );

  const undoMove = useCallback(() => {
    if (!history.length || gameOver || win) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBoard((b) => { const nb = [...b]; nb[last.idx] = last.prevValue; return nb; });
    setNotes((prev) => {
      const next = prev.map((s) => new Set(s));
      next[last.idx] = last.prevNotes;
      return next;
    });
  }, [history, gameOver, win]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver || win) return;
      if (e.key >= "1" && e.key <= "9") { inputNumber(parseInt(e.key)); return; }
      if (e.key === "Backspace" || e.key === "Delete") { inputNumber(0); return; }
      if (e.key === "n" || e.key === "N") { setNotesMode((m) => !m); return; }
      if ((e.key === "z" || e.key === "Z") && e.ctrlKey) { undoMove(); return; }
      if (selected !== null) {
        const r = Math.floor(selected / 9), c = selected % 9;
        if (e.key === "ArrowUp" && r > 0) { setSelected(selected - 9); e.preventDefault(); }
        else if (e.key === "ArrowDown" && r < 8) { setSelected(selected + 9); e.preventDefault(); }
        else if (e.key === "ArrowLeft" && c > 0) { setSelected(selected - 1); e.preventDefault(); }
        else if (e.key === "ArrowRight" && c < 8) { setSelected(selected + 1); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, inputNumber, undoMove, gameOver, win]);

  // ── Cell color helpers (terminal palette) ────────────────────────────────

  const selRow = selected !== null ? Math.floor(selected / 9) : -1;
  const selCol = selected !== null ? selected % 9 : -1;
  const selBox =
    selected !== null ? Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3) : -1;
  const selVal = selected !== null ? board[selected] : 0;

  function getCellBg(i: number): string {
    const r = Math.floor(i / 9), c = i % 9;
    const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (i === selected) return "rgba(107,114,128,0.35)";
    if (selected !== null && (r === selRow || c === selCol || box === selBox))
      return "rgba(107,114,128,0.12)";
    if (selVal && board[i] === selVal) return "rgba(156,163,175,0.2)";
    // Alternate 3x3 box shading for readability
    const boxRow = Math.floor(r / 3);
    const boxCol = Math.floor(c / 3);
    const isAltBox = (boxRow + boxCol) % 2 === 1;
    return isAltBox ? "rgba(255,255,255,0.03)" : "transparent";
  }

  function getCellColor(i: number): string {
    if (!board[i]) return "transparent";
    if (given[i]) return "#f3f4f6";                  // given: near-white
    if (board[i] !== solution[i]) return "#f87171";   // wrong: bright red
    return "#d1d5db";                                 // correct user: bright gray
  }

  function getBorderRight(c: number): string {
    if (c === 8) return "none";
    if (c === 2 || c === 5) return "2px solid #4b5563";
    return "1px solid #1f2937";
  }

  function getBorderBottom(r: number): string {
    if (r === 8) return "none";
    if (r === 2 || r === 5) return "2px solid #4b5563";
    return "1px solid #1f2937";
  }

  // ── Exhausted numbers (all 9 placed correctly) ───────────────────────────

  function isExhausted(n: number): boolean {
    let count = 0;
    for (let i = 0; i < 81; i++) {
      if (board[i] === n && board[i] === solution[i]) count++;
    }
    return count === 9;
  }

  // ── Grid size ────────────────────────────────────────────────────────────

  const gridSize = "min(360px, 88vw)";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#000000",
        userSelect: "none",
        ...pixelifySans.style,
      }}
    >
      <Background />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1rem 2rem",
          gap: "1rem",
        }}
      >
        {/* ── Header (top-left, mirrors Dungeon) ── */}
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
            Sudoku
          </h1>

          {/* Timer */}
          <span
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
            }}
          >
            {formatTime(timer)}
          </span>

          {/* Mistakes */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.875rem",
                  color: i < mistakes ? "#374151" : "#ef4444",
                }}
              >
                {i < mistakes ? "♡" : "♥"}
              </span>
            ))}
          </div>
        </div>

        {/* ── Difficulty buttons (top-right) ── */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            gap: "0.375rem",
          }}
        >
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <HoverBtn key={d} onClick={() => startGame(d)} active={diff === d}>
              {d.toUpperCase()}
            </HoverBtn>
          ))}
        </div>

        {/* ── Grid panel ── */}
        <div
          style={{
            width: gridSize,
            aspectRatio: "1",
            flexShrink: 0,
            padding: "4px",
            background: "rgba(15, 15, 20, 0.88)",
            backdropFilter: "blur(8px)",
            border: "1px solid #374151",
            boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gridTemplateRows: "repeat(9, 1fr)",
              border: "1px solid #4b5563",
            }}
          >
            {board.map((val, i) => {
              const r = Math.floor(i / 9);
              const c = i % 9;
              const n = notes[i];
              return (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: getCellBg(i),
                    color: getCellColor(i),
                    borderRight: getBorderRight(c),
                    borderBottom: getBorderBottom(r),
                    fontSize: "clamp(14px, 3.5vw, 22px)",
                    fontWeight: given[i] ? "700" : "400",
                    transition: "background-color 0.1s",
                    position: "relative",
                  }}
                >
                  {val ? (
                    <span style={{ fontFamily: shareTechMono.style.fontFamily }}>{val}</span>
                  ) : n && n.size > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridTemplateRows: "repeat(3, 1fr)",
                        width: "100%",
                        height: "100%",
                        padding: "1px",
                      }}
                    >
                      {Array.from({ length: 9 }, (_, d) => d + 1).map((d) => (
                        <span
                          key={d}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                            fontSize: "clamp(5px, 1.1vw, 8px)",
                          }}
                        >
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

        {/* ── Numpad ── */}
        <div style={{ display: "flex", gap: "0.5rem", width: gridSize, alignItems: "flex-end" }}>

          {/* Erase — left of 3x3 */}
          <HoverBtn
            onClick={() => inputNumber(0)}
            style={{
              width: "2.5rem",
              flexShrink: 0,
              alignSelf: "flex-end",
              padding: "0.6rem 0",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            ⌫
          </HoverBtn>

          {/* 3×3 digit grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.375rem",
              flex: 1,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
              const done = isExhausted(n);
              return done ? (
                <div
                  key={n}
                  style={{
                    padding: "0.65rem 0",
                    fontSize: "1.25rem",
                    textAlign: "center",
                    color: "#1f2937",
                    border: "1px solid #1f2937",
                    borderRadius: "0.25rem",
                    pointerEvents: "none",
                    letterSpacing: "0.1em",
                    fontFamily: shareTechMono.style.fontFamily,
                  }}
                >
                  {n}
                </div>
              ) : (
                <HoverBtn
                  key={n}
                  onClick={() => inputNumber(n)}
                  style={{
                    padding: "0.65rem 0",
                    fontSize: "1.25rem",
                    textAlign: "center",
                    fontFamily: shareTechMono.style.fontFamily,
                    letterSpacing: "0.1em",
                    color: "#d1d5db",
                    borderColor: "#4b5563",
                  }}
                >
                  {n}
                </HoverBtn>
              );
            })}
          </div>

          {/* Notes — right of 3x3 */}
          <HoverBtn
            onClick={() => setNotesMode((m) => !m)}
            active={notesMode}
            style={{
              width: "2.5rem",
              flexShrink: 0,
              alignSelf: "flex-end",
              padding: "0.6rem 0",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            ✏️
          </HoverBtn>

        </div>

        {/* ── Bottom toolbar ── */}
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            alignItems: "center",
            width: gridSize,
          }}
        >
          <HoverBtn onClick={undoMove}>↩ UNDO</HoverBtn>
          <HoverBtn onClick={() => startGame(diff)}>↺ NEW</HoverBtn>

          {win && (
            <span style={{ color: "#9ca3af", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
              SOLVED · {formatTime(timer)}
            </span>
          )}
          {gameOver && !win && (
            <span style={{ color: "#ef4444", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
              GAME OVER ·{" "}
              <span
                onClick={() => startGame(diff)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                RETRY
              </span>
            </span>
          )}
        </div>

        {/* ── Hint ── */}
        <p style={{ color: "#4b5563", fontSize: "0.75rem", margin: 0, letterSpacing: "0.05em" }}>
          1–9 to place · N to toggle notes · Ctrl+Z to undo · Arrows to move
        </p>

      </div>
    </div>
  );
}