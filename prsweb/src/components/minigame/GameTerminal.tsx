"use client";

import { useState, useEffect } from "react";
import { GameState, GameAction } from "@/src/lib/game/gameTypes";

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function getLogColor(line: string): string {
  if (line.startsWith("📜")) return "#93c5fd";
  if (line.startsWith("🔑")) return "#fde047";
  if (line.startsWith("💀")) return "#f87171";
  if (line.startsWith("🚪")) return "#4ade80";
  if (line.startsWith("✅")) return "#34d399";
  if (line.startsWith("❌")) return "#f87171";
  return "#d1d5db";
}

export default function GameTerminal({ state, dispatch }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !state) return null;

  const logs = state.logs.slice(-5);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        fontFamily: "monospace",
        fontSize: "0.875rem",
        backgroundColor: "transparent",
        color: "inherit",
      }}
    >
      {/* Log output */}
      <div
        style={{
          backgroundColor: "#030712",
          border: "1px solid #374151",
          borderRadius: "0.25rem",
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          minHeight: "7rem",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#4b5563", lineHeight: "1.25rem" }}>
            Entering the dungeon...
          </div>
        ) : (
          logs.map((line, i) => (
            <div
              key={i}
              style={{ color: getLogColor(line), lineHeight: "1.25rem" }}
            >
              {line}
            </div>
          ))
        )}
      </div>

      {/* HUD */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          fontSize: "0.75rem",
          color: "#6b7280",
          paddingLeft: "0.25rem",
          backgroundColor: "transparent",
        }}
      >
        <span>🧩 Fragments: {state.collectedParts.length} / 4</span>
        <span>
          📍 ({state.playerX}, {state.playerY})
        </span>
      </div>

      {/* Key fragments collected */}
      {state.collectedParts.length > 0 && (
        <div
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "0.25rem",
            padding: "0.5rem 0.75rem",
            fontSize: "0.75rem",
            color: "#fde047",
          }}
        >
          Key fragments: {state.collectedParts.join(" · ")}
        </div>
      )}

      {/* Enter key phase */}
      {state.phase === "enterKey" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div
            style={{
              color: "#facc15",
              fontSize: "0.75rem",
              paddingLeft: "0.25rem",
            }}
          >
            Hint: ค่ายครั้งนี้ — Enter the full key:
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              autoFocus
              type="text"
              value={state.keyInput}
              onChange={(e) =>
                dispatch({ type: "SET_KEY_INPUT", value: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") dispatch({ type: "SUBMIT_KEY" });
                if (e.key === "Escape") dispatch({ type: "CANCEL_KEY" });
              }}
              style={{
                flex: 1,
                backgroundColor: "#111827",
                border: "1px solid #4b5563",
                borderRadius: "0.25rem",
                padding: "0.375rem 0.75rem",
                color: "#ffffff",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "monospace",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#facc15")}
              onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
              placeholder="Enter key..."
            />
            <button
              onClick={() => dispatch({ type: "SUBMIT_KEY" })}
              style={{
                backgroundColor: "#eab308",
                color: "#000000",
                borderRadius: "0.25rem",
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#facc15")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#eab308")
              }
            >
              Submit
            </button>
            <button
              onClick={() => dispatch({ type: "CANCEL_KEY" })}
              style={{
                backgroundColor: "#374151",
                color: "#ffffff",
                borderRadius: "0.25rem",
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4b5563")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#374151")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dead / Escaped */}
      {(state.phase === "dead" || state.phase === "escaped") && (
        <button
          onClick={() => dispatch({ type: "RESTART" })}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            backgroundColor: "#374151",
            color: "#ffffff",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#4b5563")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#374151")
          }
        >
          {state.phase === "escaped" ? "🎉 Play Again" : "💀 Try Again"}
        </button>
      )}
    </div>
  );
}
