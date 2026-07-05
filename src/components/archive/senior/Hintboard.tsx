"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";
import { IHint } from "@/src/core/domain/hint";

function HintItem({
  hint,
  onDelete,
  onEdit,
}: {
  hint: IHint;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(hint.content);

  const save = () => {
    if (val.trim()) {
      onEdit(hint.id, val.trim());
      setEditing(false);
    }
  };

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

      {editing ? (
        <>
          <input
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setEditing(false);
                setVal(hint.content);
              }
            }}
            style={{
              flex: 1,
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.4)",
              borderRadius: "2px",
              color: "#e9e0ff",
              fontSize: "14px",
              padding: "5px 10px",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
          <button
            onClick={save}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#7dd3a0",
              padding: "4px",
            }}
          >
            <FaCheck size={12} />
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setVal(hint.content);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f0abc8",
              padding: "4px",
            }}
          >
            <FaTimes size={12} />
          </button>
        </>
      ) : (
        <>
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

          <button
            onClick={() => setEditing(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8b7bb8",
              padding: "4px",
            }}
          >
            <FaPencilAlt size={11} />
          </button>
          <button
            onClick={() => onDelete(hint.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#d1548a",
              padding: "4px",
            }}
          >
            <FaTrash size={11} />
          </button>
        </>
      )}
    </div>
  );
}

export interface HintBoardProps {
  hints: IHint[];
  adding: boolean;
  newHint: string;
  newLevel: number;
  setAdding: (adding: boolean) => void;
  setNewHint: (val: string) => void;
  setNewLevel: (level: number) => void;
  addHint: () => void;
  deleteHint: (id: string) => void;
  editHint: (id: string, content: string) => void;
}

export default function HintBoard({
  hints,
  adding,
  newHint,
  newLevel,
  setAdding,
  setNewHint,
  setNewLevel,
  addHint,
  deleteHint,
  editHint,
}: HintBoardProps) {
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
        ฝากคำใบ้ให้น้องรหัส
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
          [ HINTS ] — {hints.length} added
        </span>

        {hints.length < 5 && (
          <button
            onClick={() => {
              const usedLevels = hints.map((h) => h.level);
              const availableLevels = [1, 2, 3, 4, 5].filter(
                (l) => !usedLevels.includes(l),
              );
              if (availableLevels.length > 0) {
                setNewLevel(availableLevels[0]);
              }
              setAdding(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(139, 92, 246, 0.14)",
              border: "1px solid rgba(139,92,246,0.4)",
              borderRadius: "2px",
              color: "#c4b5fd",
              fontSize: "11px",
              fontFamily: "monospace",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            <FaPlus size={9} /> ADD HINT
          </button>
        )}
      </div>

      {hints.length === 0 && !adding && (
        <p
          style={{
            fontSize: "13px",
            color: "#6b5b95",
            fontFamily: "monospace",
            margin: "16px 0",
          }}
        >
          — ยังไม่มีคำใบ้ เพิ่มคำใบ้แรกได้เลย —
        </p>
      )}

      {hints.map((h) => (
        <HintItem key={h.id} hint={h} onDelete={deleteHint} onEdit={editHint} />
      ))}

      {adding && (
        <div
          style={{
            marginTop: "10px",
            padding: "14px",
            backgroundColor: "rgba(23,17,47,0.6)",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: "3px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#8b7bb8",
              fontFamily: "monospace",
              margin: "0 0 8px",
              letterSpacing: "0.08em",
            }}
          >
            NEW HINT
          </p>
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(Number(e.target.value))}
            style={{
              width: "100%",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "2px",
              color: "#e9e0ff",
              fontSize: "14px",
              padding: "8px 12px",
              fontFamily: "monospace",
              outline: "none",
              marginBottom: "10px",
            }}
          >
            {[1, 2, 3, 4, 5].map((l) => {
              const isUsed = hints.some((h) => h.level === l);
              return (
                <option
                  key={l}
                  value={l}
                  disabled={isUsed}
                  style={{
                    background: "#17112f",
                    color: isUsed ? "#4a3f6b" : "#e9e0ff",
                  }}
                >
                  Level {l} {isUsed ? "(เลือกแล้ว)" : ""}
                </option>
              );
            })}
          </select>
          <textarea
            autoFocus
            placeholder="เขียนคำใบ้ที่นี่..."
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "2px",
              color: "#e9e0ff",
              fontSize: "14px",
              padding: "8px 12px",
              fontFamily: "monospace",
              outline: "none",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setAdding(false);
                setNewHint("");
              }}
              style={{
                background: "none",
                border: "1px solid rgba(219,39,119,0.4)",
                borderRadius: "2px",
                color: "#f0abc8",
                fontSize: "11px",
                fontFamily: "monospace",
                padding: "5px 12px",
                cursor: "pointer",
              }}
            >
              CANCEL
            </button>
            <button
              onClick={addHint}
              disabled={!newHint.trim()}
              style={{
                background: newHint.trim()
                  ? "rgba(139,92,246,0.22)"
                  : "rgba(139,92,246,0.06)",
                border: `1px solid ${newHint.trim() ? "rgba(139,92,246,0.55)" : "rgba(139,92,246,0.18)"}`,
                borderRadius: "2px",
                color: newHint.trim() ? "#c4b5fd" : "#5a4d80",
                fontSize: "11px",
                fontFamily: "monospace",
                padding: "5px 14px",
                cursor: newHint.trim() ? "pointer" : "not-allowed",
              }}
            >
              SAVE HINT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}