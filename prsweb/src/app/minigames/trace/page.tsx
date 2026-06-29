"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import FaultyTerminal from "@/src/components/reactbits/background/FaultyTerminal";
import { Pixelify_Sans, Share_Tech_Mono } from "next/font/google";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

// ── Types ─────────────────────────────────────────────────────────────────────

type QType = "type" | "mcq";

interface Question {
  code: string;
  answer: string;
  type: QType;
  choices?: string[];
  timeBonus: number; // seconds added on correct
  language: string;
}

// ── Question Bank ─────────────────────────────────────────────────────────────
// Difficulty tiers: 1-3 easy (type), 4-6 medium (type), 7-10 hard (MCQ)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMCQ(answer: string, wrongs: string[]): string[] {
  return shuffle([answer, ...wrongs.slice(0, 3)]);
}

const QUESTION_POOL: Question[] = [
  // ── EASY (type) ──────────────────────────────────────────────────────────
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `x = 5
y = 3
print(x + y)`,
    answer: "8",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `a = 10
b = a // 3
print(b)`,
    answer: "3",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `x = 7
if x > 5:
    print("big")
else:
    print("small")`,
    answer: "big",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `s = "hello"
print(len(s))`,
    answer: "5",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `x = 2
y = x ** 3
print(y)`,
    answer: "8",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 8,
    code: `items = [1, 2, 3, 4]
print(items[-1])`,
    answer: "4",
  },
  // ── MEDIUM (type) ────────────────────────────────────────────────────────
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `total = 0
for i in range(4):
    total += i
print(total)`,
    answer: "6",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `x = 1
while x < 16:
    x *= 2
print(x)`,
    answer: "16",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `def f(n):
    return n * 2 + 1

print(f(f(3)))`,
    answer: "15",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `count = 0
for i in range(10):
    if i % 3 == 0:
        count += 1
print(count)`,
    answer: "4",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `a = [1, 2, 3]
b = a[::-1]
print(b[0])`,
    answer: "3",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `x = 5
result = 1
for i in range(1, x):
    result *= i
print(result)`,
    answer: "24",
  },
  {
    language: "python",
    type: "type",
    timeBonus: 12,
    code: `def mystery(a, b):
    if a > b:
        return a - b
    return b - a

print(mystery(3, 8))`,
    answer: "5",
  },
  // ── HARD (MCQ) ───────────────────────────────────────────────────────────
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

print(fib(6))`,
    answer: "8",
    choices: makeMCQ("8", ["6", "13", "5"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `def f(lst, n):
    if n == 0:
        return 0
    return lst[n-1] + f(lst, n-1)

print(f([1,2,3,4,5], 4))`,
    answer: "10",
    choices: makeMCQ("10", ["15", "4", "6"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `x = [[i*j for j in range(3)]
      for i in range(3)]
print(x[2][2])`,
    answer: "4",
    choices: makeMCQ("4", ["6", "2", "9"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `def count(s, c):
    return sum(1 for ch in s if ch == c)

print(count("mississippi", "s"))`,
    answer: "4",
    choices: makeMCQ("4", ["3", "5", "2"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `stack = []
for i in [1,2,3,4]:
    stack.append(i)
stack.pop()
stack.pop()
print(stack[-1])`,
    answer: "2",
    choices: makeMCQ("2", ["3", "1", "4"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 18,
    code: `def g(n, acc=0):
    if n == 0:
        return acc
    return g(n-1, acc+n)

print(g(5))`,
    answer: "15",
    choices: makeMCQ("15", ["10", "20", "5"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 20,
    code: `memo = {}
def dp(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = dp(n-1) + dp(n-2)
    return memo[n]

print(dp(7))`,
    answer: "13",
    choices: makeMCQ("13", ["8", "21", "12"]),
  },
  {
    language: "python",
    type: "mcq",
    timeBonus: 20,
    code: `def mystery(n):
    if n == 1: return 0
    if n % 2 == 0:
        return 1 + mystery(n // 2)
    return 1 + mystery(3*n + 1)

print(mystery(6))`,
    answer: "8",
    choices: makeMCQ("8", ["6", "9", "7"]),
  },
];

// Build a 10-question sequence scaling in difficulty
function buildQuestionSet(): Question[] {
  const easy = shuffle(QUESTION_POOL.filter((q) => q.type === "type" && q.timeBonus === 8));
  const medium = shuffle(QUESTION_POOL.filter((q) => q.type === "type" && q.timeBonus === 12));
  const hard = shuffle(QUESTION_POOL.filter((q) => q.type === "mcq"));

  // q1-3: easy, q4-6: medium, q7-10: hard
  return [
    ...easy.slice(0, 3),
    ...medium.slice(0, 3),
    ...hard.slice(0, 4),
  ];
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
        color: disabled ? "#1f2937" : active ? "#d1d5db" : hov ? "#d1d5db" : "#6b7280",
        border: `1px solid ${disabled ? "#1f2937" : active ? "#6b7280" : hov ? "#4b5563" : "#374151"}`,
        fontSize: "0.875rem",
        padding: "0.25rem 0.75rem",
        background: "transparent",
        cursor: disabled ? "default" : "pointer",
        borderRadius: "0.25rem",
        fontFamily: "inherit",
        letterSpacing: "0.05em",
        transition: "color 0.15s, border-color 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Timer bar ─────────────────────────────────────────────────────────────────

function TimerBar({ seconds, max }: { seconds: number; max: number }) {
  const pct = Math.min(seconds / max, 1);
  const color = pct > 0.5 ? "#4ade80" : pct > 0.25 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ width: "100%", height: "3px", background: "#1f2937", borderRadius: "2px" }}>
      <div
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          background: color,
          borderRadius: "2px",
          transition: "width 0.5s linear, background 0.5s",
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
}

// ── Code display ──────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
        border: "1px solid #374151",
        borderRadius: "0.25rem",
        padding: "1rem 1.25rem",
        width: "100%",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: "1rem" }}>
          <span style={{ color: "#374151", fontFamily: shareTechMono.style.fontFamily, fontSize: "0.85rem", userSelect: "none", minWidth: "1.5rem", textAlign: "right" }}>
            {i + 1}
          </span>
          <span style={{ color: "#d1d5db", fontFamily: shareTechMono.style.fontFamily, fontSize: "0.85rem", whiteSpace: "pre" }}>
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type Phase = "idle" | "playing" | "result" | "gameover";

const INITIAL_TIME = 180; // 3 minutes
const MAX_QUESTIONS = 10;

export default function TraceGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [bonusFlash, setBonusFlash] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = questions[qIdx] ?? null;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const startGame = useCallback(() => {
    const qs = buildQuestionSet();
    setQuestions(qs);
    setQIdx(0);
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setStreak(0);
    setInput("");
    setSelectedChoice(null);
    setFeedback(null);
    setBonusFlash(null);
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase === "playing") startTimer();
    else stopTimer();
    return stopTimer;
  }, [phase, startTimer, stopTimer]);

  // Focus input on new question
  useEffect(() => {
    if (phase === "playing" && currentQ?.type === "type") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [qIdx, phase, currentQ?.type]);

  const advance = useCallback(() => {
    setFeedback(null);
    setInput("");
    setSelectedChoice(null);
    setBonusFlash(null);
    const next = qIdx + 1;
    if (next >= MAX_QUESTIONS || next >= questions.length) {
      setPhase("result");
    } else {
      setQIdx(next);
    }
  }, [qIdx, questions.length]);

  const submitAnswer = useCallback((answer: string) => {
    if (!currentQ || feedback) return;
    const correct = answer.trim() === currentQ.answer.trim();

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setTimeLeft((t) => Math.min(t + currentQ.timeBonus, INITIAL_TIME));
      setBonusFlash(currentQ.timeBonus);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }

    setTimeout(advance, correct ? 1200 : 1800);
  }, [currentQ, feedback, advance]);

  const handleTypeSubmit = useCallback(() => {
    submitAnswer(input);
  }, [input, submitAnswer]);

  const handleChoiceClick = useCallback((choice: string) => {
    if (feedback) return;
    setSelectedChoice(choice);
    submitAnswer(choice);
  }, [feedback, submitAnswer]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (currentQ?.type === "type" && e.key === "Enter") handleTypeSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, currentQ, handleTypeSubmit]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  const timerColor = timeLeft > 90 ? "#4ade80" : timeLeft > 45 ? "#fbbf24" : "#f87171";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", backgroundColor: "#000", ...pixelifySans.style }}>
      <Background />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <h1 style={{ color: "#d1d5db", fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            Trace
          </h1>
          <HoverBtn onClick={() => window.history.back()} style={{ marginTop: "0.25rem" }}>← BACK</HoverBtn>
        </div>

        {/* Timer top-right */}
        {phase === "playing" && (
          <div style={{ position: "absolute", top: "1rem", right: "1rem", textAlign: "right" }}>
            <div style={{ color: timerColor, fontSize: "2rem", fontFamily: shareTechMono.style.fontFamily, lineHeight: 1, transition: "color 0.5s", textShadow: `0 0 10px ${timerColor}` }}>
              {formatTime(timeLeft)}
            </div>
            {bonusFlash !== null && (
              <div style={{ color: "#4ade80", fontSize: "0.8rem", fontFamily: shareTechMono.style.fontFamily, animation: "fadeup 1s forwards" }}>
                +{bonusFlash}s
              </div>
            )}
          </div>
        )}

        {/* Center content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "5rem 1rem 2rem",
          gap: "1.5rem",
        }}>

          {/* ── IDLE ── */}
          {phase === "idle" && (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ color: "#6b7280", fontSize: "0.875rem", letterSpacing: "0.1em", lineHeight: 2 }}>
                <div>Read the code. Predict the output.</div>
                <div style={{ color: "#374151" }}>3 min countdown · correct answers add time</div>
                <div style={{ color: "#374151" }}>10 questions · harder as you go</div>
              </div>
              <HoverBtn onClick={startGame} style={{ fontSize: "1rem", padding: "0.5rem 2rem", color: "#d1d5db", borderColor: "#4b5563" }}>
                START
              </HoverBtn>
            </div>
          )}

          {/* ── PLAYING ── */}
          {phase === "playing" && currentQ && (
            <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Progress + timer bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#4b5563", fontSize: "0.75rem", fontFamily: shareTechMono.style.fontFamily, letterSpacing: "0.1em" }}>
                  Q {qIdx + 1} / {MAX_QUESTIONS}
                </span>
                <span style={{ color: "#4b5563", fontSize: "0.75rem", fontFamily: shareTechMono.style.fontFamily }}>
                  SCORE {score}
                  {streak >= 2 && <span style={{ color: "#fbbf24" }}> · {streak}🔥</span>}
                </span>
              </div>

              <TimerBar seconds={timeLeft} max={INITIAL_TIME} />

              {/* Difficulty badge */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: currentQ.timeBonus === 8 ? "#4ade80" : currentQ.timeBonus === 12 ? "#fbbf24" : "#f87171",
                  border: `1px solid ${currentQ.timeBonus === 8 ? "#166534" : currentQ.timeBonus === 12 ? "#92400e" : "#7f1d1d"}`,
                  padding: "0.1rem 0.4rem",
                  borderRadius: "0.2rem",
                }}>
                  {currentQ.timeBonus === 8 ? "EASY" : currentQ.timeBonus === 12 ? "MEDIUM" : "HARD"}
                </span>
                <span style={{ color: "#374151", fontSize: "0.65rem", letterSpacing: "0.1em" }}>+{currentQ.timeBonus}s on correct</span>
              </div>

              {/* Code block */}
              <CodeBlock code={currentQ.code} />

              {/* "What does this print?" label */}
              <div style={{ color: "#6b7280", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
                WHAT DOES THIS PRINT?
              </div>

              {/* Answer area */}
              {currentQ.type === "type" ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!!feedback}
                    placeholder="type output..."
                    style={{
                      flex: 1,
                      background: "rgba(15,15,20,0.88)",
                      border: `1px solid ${feedback === "correct" ? "#4ade80" : feedback === "wrong" ? "#f87171" : "#374151"}`,
                      color: "#d1d5db",
                      fontFamily: shareTechMono.style.fontFamily,
                      fontSize: "1rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.25rem",
                      outline: "none",
                      letterSpacing: "0.05em",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <HoverBtn onClick={handleTypeSubmit} disabled={!!feedback || !input.trim()} style={{ padding: "0.5rem 1rem" }}>
                    ↵ RUN
                  </HoverBtn>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {currentQ.choices?.map((choice) => {
                    const isSelected = selectedChoice === choice;
                    const isCorrect = choice === currentQ.answer;
                    const showResult = !!feedback;
                    let borderColor = "#374151";
                    let color = "#6b7280";
                    if (showResult && isCorrect) { borderColor = "#4ade80"; color = "#4ade80"; }
                    else if (showResult && isSelected && !isCorrect) { borderColor = "#f87171"; color = "#f87171"; }
                    else if (!showResult && isSelected) { borderColor = "#6b7280"; color = "#d1d5db"; }
                    return (
                      <button
                        key={choice}
                        onClick={() => handleChoiceClick(choice)}
                        disabled={!!feedback}
                        style={{
                          background: "rgba(15,15,20,0.88)",
                          border: `1px solid ${borderColor}`,
                          color,
                          fontFamily: shareTechMono.style.fontFamily,
                          fontSize: "1.1rem",
                          padding: "0.75rem",
                          borderRadius: "0.25rem",
                          cursor: feedback ? "default" : "pointer",
                          transition: "all 0.2s",
                          letterSpacing: "0.1em",
                          textShadow: showResult && isCorrect ? "0 0 8px #4ade80" : "none",
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div style={{
                  color: feedback === "correct" ? "#4ade80" : "#f87171",
                  fontSize: "0.8rem",
                  fontFamily: shareTechMono.style.fontFamily,
                  letterSpacing: "0.15em",
                  textAlign: "center",
                }}>
                  {feedback === "correct"
                    ? `✓ CORRECT  +${currentQ.timeBonus}s`
                    : `✗ WRONG · answer was ${currentQ.answer}`}
                </div>
              )}
            </div>
          )}

          {/* ── RESULT ── */}
          {(phase === "result" || phase === "gameover") && (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "400px" }}>
              <div style={{ color: "#d1d5db", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {phase === "result" ? "COMPLETE" : "TIME'S UP"}
              </div>

              <div style={{ display: "flex", gap: "3rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#374151", fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: "0.3rem" }}>SCORE</div>
                  <div style={{ color: score >= 8 ? "#4ade80" : score >= 5 ? "#fbbf24" : "#f87171", fontSize: "3rem", fontFamily: shareTechMono.style.fontFamily, lineHeight: 1 }}>
                    {score}<span style={{ fontSize: "1.2rem", color: "#374151" }}>/10</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#374151", fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: "0.3rem" }}>TIME LEFT</div>
                  <div style={{ color: timerColor, fontSize: "3rem", fontFamily: shareTechMono.style.fontFamily, lineHeight: 1 }}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <div style={{ color: "#6b7280", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                {score === 10 ? "PERFECT RUN — elite tracer 🔥" :
                 score >= 8  ? "SHARP — you barely need a compiler" :
                 score >= 5  ? "DECENT — keep tracing" :
                               "NEEDS WORK — trust the process"}
              </div>

              <HoverBtn onClick={startGame} style={{ fontSize: "1rem", padding: "0.5rem 2rem", color: "#d1d5db", borderColor: "#4b5563" }}>
                TRY AGAIN
              </HoverBtn>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeup {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}