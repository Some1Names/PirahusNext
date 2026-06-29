"use client";

import { useState, useEffect, useCallback, memo } from "react";
import FaultyTerminal from "@/src/components/reactbits/background/FaultyTerminal";
import { Pixelify_Sans, Share_Tech_Mono } from "next/font/google";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

interface Level {
  size: number;   // number of bars
  par: number;    // target swap count
}

const LEVELS: Record<Difficulty, Level> = {
  easy:   { size: 6,  par: 6  },
  medium: { size: 9,  par: 12 },
  hard:   { size: 12, par: 20 },
};

const MAX_BAR_HEIGHT = 12; // rows of █

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  // Fisher-Yates, ensure not already sorted
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (isSorted(a));
  return a;
}

function isSorted<T>(arr: T[], compare: (prev: T, curr: T) => boolean = (prev, curr) => (prev as any) <= (curr as any)): boolean {
  return arr.every((v, i) => i === 0 || compare(arr[i - 1], v));
}

function minSwaps(arr: number[]): number {
  // Count inversions as a proxy for minimum swaps (adjacent)
  let inv = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] > arr[j]) inv++;
  return inv;
}

function generatePuzzle(diff: Difficulty): number[] {
  const { size } = LEVELS[diff];
  // Values spread evenly 1..MAX_BAR_HEIGHT
  const values = Array.from({ length: size }, (_, i) =>
    Math.round(1 + (i / (size - 1)) * (MAX_BAR_HEIGHT - 1))
  );
  return shuffle(values);
}

function scoreLabel(swaps: number, par: number): { text: string; color: string } {
  const diff = swaps - par;
  if (diff <= 0)  return { text: `EAGLE  (${swaps} swaps)`, color: "#86efac" };
  if (diff === 1) return { text: `BIRDIE  (${swaps} swaps)`, color: "#6ee7b7" };
  if (diff === 2) return { text: `PAR  (${swaps} swaps)`,    color: "#d1d5db" };
  if (diff === 3) return { text: `BOGEY  (${swaps} swaps)`,  color: "#fbbf24" };
  return { text: `DOUBLE+  (${swaps} swaps)`, color: "#f87171" };
}

// ── Background ────────────────────────────────────────────────────────────────

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

// ── Button ────────────────────────────────────────────────────────────────────

const btnBase: React.CSSProperties = {
  color: "#6b7280",
  border: "1px solid #374151",
  fontSize: "0.875rem",
  padding: "0.25rem 0.75rem",
  background: "transparent",
  cursor: "pointer",
  borderRadius: "0.25rem",
  letterSpacing: "0.05em",
  transition: "color 0.15s, border-color 0.15s",
};

function HoverBtn({
  onClick,
  children,
  active,
  style,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...btnBase,
        fontFamily: "inherit",
        color: disabled ? "#1f2937" : active ? "#d1d5db" : hov ? "#d1d5db" : "#6b7280",
        borderColor: disabled ? "#1f2937" : active ? "#6b7280" : hov ? "#4b5563" : "#374151",
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Bar component ─────────────────────────────────────────────────────────────

function Bar({
  value,
  maxValue,
  selected,
  swappable,
  sorted,
  onClick,
  index,
}: {
  value: number;
  maxValue: number;
  selected: boolean;
  swappable: boolean;
  sorted: boolean;
  onClick: () => void;
  index: number;
}) {
  const [hov, setHov] = useState(false);

  const barColor = sorted
    ? "#4ade80"
    : selected
    ? "#f3f4f6"
    : swappable
    ? "#fbbf24"
    : hov
    ? "#9ca3af"
    : "#6b7280";

  const blocks = Math.round((value / maxValue) * MAX_BAR_HEIGHT);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        cursor: "pointer",
        transition: "transform 0.1s",
        transform: selected ? "translateY(-4px)" : "none",
      }}
    >
      {/* Bar column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          height: `${MAX_BAR_HEIGHT * 1.4}rem`,
          justifyContent: "flex-start",
          gap: "1px",
        }}
      >
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            style={{
              color: barColor,
              fontSize: "1rem",
              lineHeight: 1,
              fontFamily: shareTechMono.style.fontFamily,
              transition: "color 0.15s",
              textShadow: selected || swappable ? `0 0 8px ${barColor}` : "none",
            }}
          >
            █
          </div>
        ))}
      </div>

      {/* Value label */}
      <span
        style={{
          color: barColor,
          fontSize: "0.75rem",
          fontFamily: shareTechMono.style.fontFamily,
          transition: "color 0.15s",
        }}
      >
        {value}
      </span>

      {/* Index label */}
      <span style={{ color: "#374151", fontSize: "0.65rem", fontFamily: shareTechMono.style.fontFamily }}>
        [{index}]
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SortGame() {
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [bars, setBars] = useState<number[]>([]);
  const [original, setOriginal] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const startGame = useCallback((d: Difficulty) => {
    const puzzle = generatePuzzle(d);
    setBars(puzzle);
    setOriginal(puzzle);
    setSelected(null);
    setSwaps(0);
    setWon(false);
    setHistory([]);
    setDiff(d);
    setTimer(0);
    setTimerActive(true);
  }, []);

  useEffect(() => { startGame("easy"); }, [startGame]);

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  const par = LEVELS[diff].par;
  const maxVal = Math.max(...bars, 1);

  // Which bars are "in final sorted position"
  const sortedBars = (() => {
    const sorted = [...bars].sort((a, b) => a - b);
    return bars.map((v, i) => v === sorted[i]);
  })();

  const handleBarClick = useCallback((idx: number) => {
    if (won) return;

    if (selected === null) {
      setSelected(idx);
      return;
    }

    if (selected === idx) {
      setSelected(null);
      return;
    }

    // Only allow adjacent swaps
    if (Math.abs(selected - idx) !== 1) {
      setSelected(idx); // reselect
      return;
    }

    // Swap
    setHistory((h) => [...h, [...bars]]);
    const next = [...bars];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setBars(next);
    setSwaps((s) => s + 1);
    setSelected(null);

    if (isSorted(next)) {
      setWon(true);
      setTimerActive(false);
    }
  }, [selected, bars, won]);

  const undo = useCallback(() => {
    if (!history.length || won) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBars(prev);
    setSwaps((s) => Math.max(0, s - 1));
    setSelected(null);
  }, [history, won]);

  const reset = useCallback(() => {
    setBars(original);
    setSelected(null);
    setSwaps(0);
    setWon(false);
    setHistory([]);
    setTimer(0);
    setTimerActive(true);
  }, [original]);

  // Keyboard: left/right to move selection, space/enter to confirm swap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (won) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        if (selected === null) {
          setSelected(e.key === "ArrowLeft" ? 0 : bars.length - 1);
          return;
        }
        const next = e.key === "ArrowLeft" ? selected - 1 : selected + 1;
        if (next >= 0 && next < bars.length) handleBarClick(next);
      }
      if (e.key === "Escape") setSelected(null);
      if ((e.key === "z" || e.key === "Z") && e.ctrlKey) undo();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, bars.length, won, handleBarClick, undo]);

  const score = won ? scoreLabel(swaps, par) : null;
  const parDiff = swaps - par;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        ...pixelifySans.style,
      }}
    >
      <Background />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* ── Top-left header ── */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h1 style={{ color: "#d1d5db", fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            Sort
          </h1>
          <span style={{ color: "#6b7280", fontSize: "0.875rem", letterSpacing: "0.1em", fontFamily: shareTechMono.style.fontFamily }}>
            {formatTime(timer)}
          </span>
          <div style={{ display: "flex", gap: "0.375rem", marginTop: "0.25rem" }}>
            <HoverBtn onClick={undo} disabled={!history.length || won}>↩ UNDO</HoverBtn>
            <HoverBtn onClick={reset}>↺ RESET</HoverBtn>
          </div>
          <HoverBtn onClick={() => window.history.back()} style={{ width: "fit-content" }}>← BACK</HoverBtn>
        </div>

        {/* ── Top-right difficulty ── */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.375rem" }}>
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <HoverBtn key={d} onClick={() => startGame(d)} active={diff === d}>
              {d.toUpperCase()}
            </HoverBtn>
          ))}
        </div>

        {/* ── Center content ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "2rem",
            padding: "6rem 1rem 2rem",
          }}
        >
          {/* Par / swaps display */}
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#374151", fontSize: "0.7rem", letterSpacing: "0.15em", marginBottom: "0.2rem" }}>PAR</div>
              <div style={{ color: "#6b7280", fontSize: "1.75rem", fontFamily: shareTechMono.style.fontFamily, lineHeight: 1 }}>
                {par}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#374151", fontSize: "0.7rem", letterSpacing: "0.15em", marginBottom: "0.2rem" }}>SWAPS</div>
              <div style={{
                fontSize: "1.75rem",
                fontFamily: shareTechMono.style.fontFamily,
                lineHeight: 1,
                color: parDiff < 0 ? "#4ade80" : parDiff === 0 ? "#d1d5db" : parDiff <= 2 ? "#fbbf24" : "#f87171",
              }}>
                {swaps}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#374151", fontSize: "0.7rem", letterSpacing: "0.15em", marginBottom: "0.2rem" }}>MIN</div>
              <div style={{ color: "#4b5563", fontSize: "1.75rem", fontFamily: shareTechMono.style.fontFamily, lineHeight: 1 }}>
                {minSwaps(bars)}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              background: "rgba(15, 15, 20, 0.88)",
              backdropFilter: "blur(8px)",
              border: "1px solid #374151",
              boxShadow: "0 0 40px rgba(0,0,0,0.8)",
              padding: "1.5rem 2rem 1rem",
              display: "flex",
              alignItems: "flex-end",
              gap: bars.length > 9 ? "0.6rem" : "1rem",
            }}
          >
            {bars.map((val, i) => (
              <Bar
                key={i}
                index={i}
                value={val}
                maxValue={maxVal}
                selected={selected === i}
                swappable={selected !== null && Math.abs(selected - i) === 1}
                sorted={won ? true : sortedBars[i]}
                onClick={() => handleBarClick(i)}
              />
            ))}
          </div>

          {/* Win state */}
          {won && score && (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ color: score.color, fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {score.text}
              </span>
              <HoverBtn onClick={() => startGame(diff)} style={{ alignSelf: "center" }}>
                PLAY AGAIN
              </HoverBtn>
            </div>
          )}

          {/* Hint */}
          {!won && (
            <p style={{ color: "#374151", fontSize: "0.75rem", margin: 0, letterSpacing: "0.05em" }}>
              Click a bar to select · Click adjacent bar to swap · ←→ keyboard · Ctrl+Z undo
            </p>
          )}
        </div>

      </div>
    </div>
  );
}