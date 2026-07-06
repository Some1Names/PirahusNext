"use client";

import { useEffect, useRef, memo, useState } from "react";
import { Share_Tech_Mono, Pixelify_Sans } from "next/font/google";
import { Info } from "lucide-react";
import FaultyTerminal from "@/src/components/reactbits/background/FaultyTerminal";
import PointsPopup from "@/src/components/minigame/PointsPopup";
import {
  useTraceGame,
  INITIAL_TIME,
  MAX_QUESTIONS,
} from "@/src/lib/game/trace/useTraceGame";
import InfoPopup from "../InfoPopup";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

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
        color: disabled ? "#1f2937" : active || hov ? "#d1d5db" : "#6b7280",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: disabled
          ? "#1f2937"
          : active
            ? "#6b7280"
            : hov
              ? "#4b5563"
              : "#374151",
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

function InfoBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label="Game Info"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.75rem",
        height: "1.75rem",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        color: hov ? "#d1d5db" : "#6b7280",
        transition: "color 0.15s, border-color 0.15s",
      }}
    >
      <Info size={16} strokeWidth={1.5} />
    </button>
  );
}

function TimerBar({ seconds, max }: { seconds: number; max: number }) {
  const pct = Math.min(seconds / max, 1);
  const color = pct > 0.5 ? "#4ade80" : pct > 0.25 ? "#fbbf24" : "#f87171";
  return (
    <div
      style={{
        width: "100%",
        height: "3px",
        background: "#1f2937",
        borderRadius: "2px",
      }}
    >
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

function CodeBlock({ code }: { code: string }) {
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
      {code.split("\n").map((line, i) => (
        <div key={i} style={{ display: "flex", gap: "1rem" }}>
          <span
            style={{
              color: "#374151",
              fontFamily: shareTechMono.style.fontFamily,
              fontSize: "0.85rem",
              userSelect: "none",
              minWidth: "1.5rem",
              textAlign: "right",
            }}
          >
            {i + 1}
          </span>
          <span
            style={{
              color: "#d1d5db",
              fontFamily: shareTechMono.style.fontFamily,
              fontSize: "0.85rem",
              whiteSpace: "pre",
            }}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TraceGame() {
  const [showInfo, setShowInfo] = useState(false);

  const {
    phase,
    currentQ,
    qIdx,
    timeLeft,
    score,
    streak,
    input,
    setInput,
    selectedChoice,
    feedback,
    bonusFlash,
    startGame,
    handleTypeSubmit,
    handleChoiceClick,
    popupPoints,
    showPopup,
    closePopup,
  } = useTraceGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "playing" && currentQ?.type === "type")
      setTimeout(() => inputRef.current?.focus(), 50);
  }, [qIdx, phase, currentQ?.type]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === "playing" && currentQ?.type === "type" && e.key === "Enter")
        handleTypeSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, currentQ, handleTypeSubmit]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  const timerColor =
    timeLeft > 90 ? "#4ade80" : timeLeft > 45 ? "#fbbf24" : "#f87171";

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
        {/* Header */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
              Trace
            </h1>
            <InfoBtn onClick={() => setShowInfo(true)} />
          </div>

          <InfoPopup
            isOpen={showInfo}
            onClose={() => setShowInfo(false)}
            title="Trace"
          >
            <p>
              Read the code snippet and predict its output before time runs out.
              Correct answers add bonus time — harder questions are worth more.
              10 questions per run.
            </p>

            <div style={{ borderTop: "1px solid #374151", margin: "0.75rem 0" }} />

            <div
              style={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "0.25rem",
                padding: "0.5rem 0.75rem",
              }}
            >
              <span
                style={{
                  color: "#fde047",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Scoring
              </span>
              <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>
                Fixed base of 40 points, scaled by your accuracy across all 10
                questions and a time bonus:{" "}
                <strong style={{ color: "#d1d5db" }}>1.5×</strong> with over 2 minutes
                left, 1.25× with over 1 minute left, 1.0× otherwise.
              </p>
            </div>
          </InfoPopup>

          <HoverBtn
            onClick={() => window.history.back()}
            style={{ marginTop: "0.25rem" }}
          >
            ← BACK
          </HoverBtn>
        </div>

        {/* Timer */}
        {phase === "playing" && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: timerColor,
                fontSize: "2rem",
                fontFamily: shareTechMono.style.fontFamily,
                lineHeight: 1,
                transition: "color 0.5s",
                textShadow: `0 0 10px ${timerColor}`,
              }}
            >
              ⏱{formatTime(timeLeft)}
            </div>
            {bonusFlash !== null && (
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "0.8rem",
                  fontFamily: shareTechMono.style.fontFamily,
                  animation: "fadeup 1s forwards",
                }}
              >
                +{bonusFlash}s
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "5rem 1rem 2rem",
            gap: "1.5rem",
          }}
        >
          {/* IDLE */}
          {phase === "idle" && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  lineHeight: 2,
                }}
              >
                <div>Read the code. Predict the output.</div>
                <div style={{ color: "#374151" }}>
                  3 min countdown · correct answers add time
                </div>
                <div style={{ color: "#374151" }}>
                  10 questions · harder as you go
                </div>
              </div>
              <HoverBtn
                onClick={startGame}
                style={{
                  fontSize: "1rem",
                  padding: "0.5rem 2rem",
                  color: "#d1d5db",
                  borderColor: "#4b5563",
                }}
              >
                START
              </HoverBtn>
            </div>
          )}

          {/* PLAYING */}
          {phase === "playing" && currentQ && (
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#4b5563",
                    fontSize: "0.75rem",
                    fontFamily: shareTechMono.style.fontFamily,
                    letterSpacing: "0.1em",
                  }}
                >
                  Q {qIdx + 1} / {MAX_QUESTIONS}
                </span>
                <span
                  style={{
                    color: "#4b5563",
                    fontSize: "0.75rem",
                    fontFamily: shareTechMono.style.fontFamily,
                  }}
                >
                  SCORE {score}
                  {streak >= 2 && (
                    <span style={{ color: "#fbbf24" }}> · {streak}🔥</span>
                  )}
                </span>
              </div>

              <TimerBar seconds={timeLeft} max={INITIAL_TIME} />

              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color:
                      currentQ.timeBonus === 8
                        ? "#4ade80"
                        : currentQ.timeBonus === 12
                          ? "#fbbf24"
                          : "#f87171",
                    border: `1px solid ${currentQ.timeBonus === 8 ? "#166534" : currentQ.timeBonus === 12 ? "#92400e" : "#7f1d1d"}`,
                    padding: "0.1rem 0.4rem",
                    borderRadius: "0.2rem",
                  }}
                >
                  {currentQ.timeBonus === 8
                    ? "EASY"
                    : currentQ.timeBonus === 12
                      ? "MEDIUM"
                      : "HARD"}
                </span>
                <span
                  style={{
                    color: "#374151",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  +{currentQ.timeBonus}s on correct
                </span>
              </div>

              <CodeBlock code={currentQ.code} />

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                }}
              >
                WHAT DOES THIS PRINT?
              </div>

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
                  <HoverBtn
                    onClick={handleTypeSubmit}
                    disabled={!!feedback || !input.trim()}
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    ↵ RUN
                  </HoverBtn>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  {currentQ.choices?.map((choice: string) => {
                    const isSelected = selectedChoice === choice;
                    const isCorrect = choice === currentQ.answer;
                    const showResult = !!feedback;
                    let borderColor = "#374151",
                      color = "#6b7280";
                    if (showResult && isCorrect) {
                      borderColor = "#4ade80";
                      color = "#4ade80";
                    } else if (showResult && isSelected && !isCorrect) {
                      borderColor = "#f87171";
                      color = "#f87171";
                    } else if (!showResult && isSelected) {
                      borderColor = "#6b7280";
                      color = "#d1d5db";
                    }
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
                          textShadow:
                            showResult && isCorrect
                              ? "0 0 8px #4ade80"
                              : "none",
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              )}

              {feedback && (
                <div
                  style={{
                    color: feedback === "correct" ? "#4ade80" : "#f87171",
                    fontSize: "0.8rem",
                    fontFamily: shareTechMono.style.fontFamily,
                    letterSpacing: "0.15em",
                    textAlign: "center",
                  }}
                >
                  {feedback === "correct"
                    ? `✓ CORRECT  +${currentQ.timeBonus}s`
                    : `✗ WRONG · answer was ${currentQ.answer}`}
                </div>
              )}
            </div>
          )}

          {/* RESULT / GAMEOVER */}
          {(phase === "result" || phase === "gameover") && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                maxWidth: "400px",
              }}
            >
              <div
                style={{
                  color: "#d1d5db",
                  fontSize: "1rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {phase === "result" ? "COMPLETE" : "TIME'S UP"}
              </div>
              <div style={{ display: "flex", gap: "3rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "#374151",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      marginBottom: "0.3rem",
                    }}
                  >
                    SCORE
                  </div>
                  <div
                    style={{
                      color:
                        score >= 8
                          ? "#4ade80"
                          : score >= 5
                            ? "#fbbf24"
                            : "#f87171",
                      fontSize: "3rem",
                      fontFamily: shareTechMono.style.fontFamily,
                      lineHeight: 1,
                    }}
                  >
                    {score}
                    <span style={{ fontSize: "1.2rem", color: "#374151" }}>
                      /10
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "#374151",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      marginBottom: "0.3rem",
                    }}
                  >
                    TIME LEFT
                  </div>
                  <div
                    style={{
                      color: timerColor,
                      fontSize: "3rem",
                      fontFamily: shareTechMono.style.fontFamily,
                      lineHeight: 1,
                    }}
                  >
                    ⏱{formatTime(timeLeft)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                }}
              >
                {score === 10
                  ? "PERFECT RUN — elite tracer 🔥"
                  : score >= 8
                    ? "SHARP — you barely need a compiler"
                    : score >= 5
                      ? "DECENT — keep tracing"
                      : "NEEDS WORK — trust the process"}
              </div>
              <HoverBtn
                onClick={startGame}
                style={{
                  fontSize: "1rem",
                  padding: "0.5rem 2rem",
                  color: "#d1d5db",
                  borderColor: "#4b5563",
                }}
              >
                TRY AGAIN
              </HoverBtn>
            </div>
          )}
        </div>
      </div>

      <PointsPopup
        points={popupPoints || 0}
        show={showPopup}
        onComplete={closePopup}
      />

      <style>{`
        @keyframes fadeup {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
