"use client";

import { IMenteeHint } from "@/src/core/domain/hint";

function JuniorHintItem({ hint }: { hint: IMenteeHint }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        backgroundColor: "rgba(23, 17, 47, 0.55)",
        border: "1px solid rgba(167, 139, 250, 0.14)",
        borderRadius: "2px",
        marginBottom: "6px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#c4b5fd",
          backgroundColor: "rgba(196, 181, 253, 0.12)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          borderRadius: "2px",
          padding: "3px 6px",
          fontFamily: "monospace",
          minWidth: "56px",
          textAlign: "center",
        }}
      >
        Level {hint.level}
      </span>

      {hint.content && (
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            color: "#cabdf0",
            fontFamily: "monospace",
          }}
        >
          {hint.content}
        </span>
      )}

      {!hint.content && (
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            color: "red",
            fontFamily: "monospace",
          }}
        >
          คำใบ้ถูกซ่อนอยู่
        </span>
      )}
    </div>
  );
}

export interface JuniorHintBoardProps {
  hints: IMenteeHint[];
}

export default function JuniorHintBoard({ hints }: JuniorHintBoardProps) {
  const sortedHints = [...hints].sort((a, b) => a.level - b.level);

  return (
    <div className="backroom-col-right">
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#a996d9",
          marginBottom: "4px",
          fontFamily: "monospace",
        }}
      >
        ■ HINT BOARD
      </p>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#c4b5fd",
          margin: "0 0 4px",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.04em",
        }}
      >
        คำใบ้จากพี่รหัส
      </h1>

      <div
        style={{
          borderTop: "1px solid rgba(167,139,250,0.25)",
          margin: "16px 0 20px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#8b7bb8",
            fontFamily: "monospace",
          }}
        >
          [ HINTS ] — {sortedHints.length} available
        </span>
      </div>

      {sortedHints.length === 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "#6b5b95",
            fontFamily: "monospace",
            margin: "16px 0",
          }}
        >
          — พี่รหัสของคุณยังไม่ได้ฝากคำใบ้ไว้ —
        </p>
      )}

      {sortedHints.map((h) => (
        <JuniorHintItem key={h.id} hint={h} />
      ))}
    </div>
  );
}
