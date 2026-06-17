"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";

interface HistoryEntry {
  idx: number;
  prevValue: number;
  prevNotes: Set<number>;
}

// ── Pure puzzle logic (no React) ─────────────────────────────────────────────

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
  const [notes, setNotes] = useState<Set<number>[]>(Array(81).fill(null).map(() => new Set()));
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startGame]);

  const formatTime = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

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

      // Clear related notes
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
    setNotes((prev) => { const next = prev.map((s) => new Set(s)); next[last.idx] = last.prevNotes; return next; });
  }, [history, gameOver, win]);

  // Keyboard handler
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

  // Cell styling helpers
  const selRow = selected !== null ? Math.floor(selected / 9) : -1;
  const selCol = selected !== null ? selected % 9 : -1;
  const selBox = selected !== null ? Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3) : -1;
  const selVal = selected !== null ? board[selected] : 0;

  function getCellBg(i: number): string {
    const r = Math.floor(i / 9), c = i % 9;
    const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (i === selected) return "bg-blue-100 dark:bg-blue-900/40";
    if (selected !== null && (r === selRow || c === selCol || box === selBox))
      return "bg-gray-100 dark:bg-gray-800";
    if (selVal && board[i] === selVal) return "bg-green-100 dark:bg-green-900/30";
    return "bg-white dark:bg-gray-900";
  }

  function getCellText(i: number): string {
    if (!board[i]) return "text-gray-400";
    if (given[i]) return "font-semibold text-gray-900 dark:text-gray-100";
    if (board[i] !== solution[i]) return "text-red-500 font-medium";
    return "text-blue-600 dark:text-blue-400 font-medium";
  }

  function getBorderRight(c: number): string {
    if (c === 8) return "border-r-0";
    if (c === 2 || c === 5) return "border-r-2 border-r-gray-700 dark:border-r-gray-300";
    return "border-r border-r-gray-200 dark:border-r-gray-700";
  }

  function getBorderBottom(r: number): string {
    if (r === 8) return "border-b-0";
    if (r === 2 || r === 5) return "border-b-2 border-b-gray-700 dark:border-b-gray-300";
    return "border-b border-b-gray-200 dark:border-b-gray-700";
  }

  return (
    <div className="flex flex-col items-center gap-5 py-8 select-none">
      {/* Header */}
      <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
        Sudoku
      </h1>

      {/* Timer + Mistakes */}
      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-mono text-base">{formatTime(timer)}</span>
        <div className="flex gap-1">
          {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
            <span key={i} className={i < mistakes ? "text-red-400" : "text-red-500"}>
              {i < mistakes ? "♡" : "♥"}
            </span>
          ))}
        </div>
      </div>

      {/* Difficulty + actions */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => startGame(d)}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors capitalize ${
              diff === d
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={undoMove}
          title="Undo (Ctrl+Z)"
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ↩
        </button>
        <button
          onClick={() => startGame(diff)}
          title="New game"
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ↺
        </button>
      </div>

      {/* Grid */}
      <div
        className="border-2 border-gray-700 dark:border-gray-300 rounded-xl overflow-hidden"
        style={{ width: "min(360px, 92vw)", aspectRatio: "1" }}
      >
        <div className="grid grid-cols-9 w-full h-full">
          {board.map((val, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const n = notes[i];
            return (
              <div
                key={i}
                onClick={() => setSelected(i)}
                className={`flex items-center justify-center cursor-pointer transition-colors text-base
                  ${getCellBg(i)} ${getCellText(i)}
                  ${getBorderRight(c)} ${getBorderBottom(r)}`}
              >
                {val ? (
                  <span>{val}</span>
                ) : n && n.size > 0 ? (
                  <div className="grid grid-cols-3 w-full h-full p-px">
                    {Array.from({ length: 9 }, (_, d) => d + 1).map((d) => (
                      <span
                        key={d}
                        className="flex items-center justify-center text-gray-400 dark:text-gray-500"
                        style={{ fontSize: "clamp(5px, 1.3vw, 9px)" }}
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

      {/* Numpad */}
      <div
        className="grid grid-cols-5 gap-2"
        style={{ width: "min(360px, 92vw)" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => inputNumber(n)}
            className="py-3 text-lg font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setNotesMode((m) => !m)}
          title="Toggle notes (N)"
          className={`py-3 text-sm rounded-lg border transition-colors ${
            notesMode
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          ✏️
        </button>
        <button
          onClick={() => inputNumber(0)}
          title="Erase"
          className="py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          ⌫
        </button>
      </div>

      {/* Status */}
      {win && (
        <p className="text-green-600 dark:text-green-400 font-medium text-base">
          Puzzle solved! 🎉
        </p>
      )}
      {gameOver && !win && (
        <p className="text-red-500 font-medium text-base">
          Game over — too many mistakes.{" "}
          <button onClick={() => startGame(diff)} className="underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
}