"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaCheck,
  FaTimes,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authService, hintService } from "@/src/infra/container";
import Swal from "sweetalert2";
import { IHint } from "@/src/core/domain/hint";



function JuniorCard({ junior }: { junior: { id: string } | null }) {
  if (!junior) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "16px 20px",
          backgroundColor: "rgba(100, 40, 30, 0.25)",
          border: "1px solid rgba(255, 100, 74, 0.25)",
          borderRadius: "3px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 100, 74, 0.1)",
            border: "1px solid rgba(255, 100, 74, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FaUser size={16} style={{ color: "#ff644a" }} />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c08070",
              fontFamily: "monospace",
            }}
          >
            น้องรหัสของคุณ
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "3px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: 600,
                color: "#e8a090",
              }}
            >
              ยังไม่ได้รับการจับคู่กับน้องรหัส
            </span>
          </div>
        </div>
      </div>
    );
  }

  const firstTwo = junior.id.length >= 2 ? junior.id.slice(0, 2) : "";
  const rest = junior.id.length >= 2 ? junior.id.slice(2) : junior.id;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 20px",
        backgroundColor: "rgba(20, 40, 70, 0.55)",
        border: "1px solid rgba(74, 158, 255, 0.2)",
        borderRadius: "3px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "rgba(74, 158, 255, 0.1)",
          border: "1px solid rgba(74, 158, 255, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FaUser size={16} style={{ color: "#4a9eff" }} />
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#2a5070",
            fontFamily: "monospace",
          }}
        >
          น้องรหัสของคุณ
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "3px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            {firstTwo && <span style={{ color: "#4a9eff" }}>{firstTwo}</span>}
            <span style={{ color: "#8aaccc" }}>{rest}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function HintItem({
  hint,
  index,
  onDelete,
  onEdit,
}: {
  hint: IHint;
  index: number;
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
        backgroundColor: "rgba(10, 14, 8, 0.5)",
        border: "1px solid rgba(140, 170, 80, 0.1)",
        borderRadius: "2px",
        marginBottom: "6px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#3a4a20",
          fontFamily: "monospace",
          minWidth: "20px",
        }}
      >
        {index + 1}.
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
              background: "rgba(140,170,80,0.08)",
              border: "1px solid rgba(140,170,80,0.35)",
              borderRadius: "2px",
              color: "#d8e8b8",
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
              color: "#70b840",
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
              color: "#b84030",
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
              color: "#98b868",
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
              color: "#4a6030",
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
              color: "#8a3020",
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

export default function HintPage() {
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [hints, setHints] = useState<IHint[]>([]);
  const [newHint, setNewHint] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshHints = async (mentorId: string) => {
    try {
      const hintList = await hintService.getHintsByMentorId(mentorId);
      setHints(hintList);
    } catch (err) {
      console.error("Failed to refresh hints:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await authService.me() as any;

        if (!res?.user || !res?.user?.id || !("mentee" in res.user)) {
          router.push("/auth/login");
          return;
        }

        setMentor(res.user);

        const hintList = await hintService.getHintsByMentorId(res.user.id);
        setHints(hintList);
      } catch (err) {
        console.error("Failed to load mentor session:", err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const addHint = async () => {
    if (!newHint.trim() || !mentor) return;
    try {
      Swal.fire({
        title: "กำลังบันทึกคำใบ้...",
        allowOutsideClick: false,
        background: "#0a0e08",
        color: "#d8e8b8",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await hintService.addHints({
        mentorId: mentor.id,
        hints: [newHint.trim()],
      });
      setNewHint("");
      setAdding(false);
      await refreshHints(mentor.id);

      Swal.fire({
        title: "บันทึกสำเร็จ",
        text: "บันทึกคำใบ้เรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#708840",
        background: "#0a0e08",
        color: "#d8e8b8",
      });
    } catch (err) {
      console.error("Failed to add hint:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มคำใบ้ได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#708840",
        background: "#0a0e08",
        color: "#d8e8b8",
      });
    }
  };

  const deleteHint = async (id: string) => {
    if (!mentor) return;
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบคำใบ้นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#b85040",
      cancelButtonColor: "#4a6030",
      background: "#0a0e08",
      color: "#d8e8b8",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "กำลังลบคำใบ้...",
          allowOutsideClick: false,
          background: "#0a0e08",
          color: "#d8e8b8",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await hintService.deleteHint(id);
        await refreshHints(mentor.id);

        Swal.fire({
          title: "ลบสำเร็จ",
          text: "ลบคำใบ้เรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#708840",
          background: "#0a0e08",
          color: "#d8e8b8",
        });
      } catch (err) {
        console.error("Failed to delete hint:", err);
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถลบคำใบ้ได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#708840",
          background: "#0a0e08",
          color: "#d8e8b8",
        });
      }
    }
  };

  const editHint = async (id: string, content: string) => {
    if (!mentor) return;
    try {
      Swal.fire({
        title: "กำลังแก้ไขคำใบ้...",
        allowOutsideClick: false,
        background: "#0a0e08",
        color: "#d8e8b8",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await hintService.updateHints(id, { content });
      await refreshHints(mentor.id);

      Swal.fire({
        title: "แก้ไขสำเร็จ",
        text: "แก้ไขคำใบ้เรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#708840",
        background: "#0a0e08",
        color: "#d8e8b8",
      });
    } catch (err) {
      console.error("Failed to edit hint:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขคำใบ้ได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#708840",
        background: "#0a0e08",
        color: "#d8e8b8",
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/images/backroomspattern.png')",
          backgroundSize: "300px 300px",
          backgroundRepeat: "repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(10, 14, 8, 1)",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#a8c060",
            letterSpacing: "0.15em",
          }}
        >
          LOADING DATA ACCESS...
        </div>
      </div>
    );
  }

  const firstTwo = mentor.studentId.length >= 2 ? mentor.studentId.slice(0, 2) : "";
  const rest = mentor.studentId.length >= 2 ? mentor.studentId.slice(2) : mentor.studentId;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/backroomspattern.png')",
        backgroundSize: "300px 300px",
        backgroundRepeat: "repeat",
        backgroundColor: "rgba(10, 14, 8, 0.45)",
      }}
    >
      <style>{`
        .hint-page *::selection {
          background-color: rgba(140, 170, 80, 0.35);
          color: #d8e8b8;
        }
      `}</style>

      <div
        className="hint-page"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "820px",
          margin: "0 auto",
          padding: "48px 24px",
          backgroundColor: "rgba(10, 14, 8, 0.45)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          minHeight: "100vh",
          boxShadow:
            "inset 60px 0 80px rgba(10,14,8,0.3), inset -60px 0 80px rgba(10,14,8,0.3)",
          isolation: "isolate",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#708840",
            fontSize: "12px",
            fontFamily: "monospace",
            cursor: "pointer",
            padding: 0,
            marginBottom: "24px",
          }}
        >
          <FaArrowLeft size={10} /> BACK TO HOME
        </button>

        <div style={{ marginBottom: "8px" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8faa55",
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
              color: "#a8c060",
              margin: "0 0 4px",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            ฝากคำใบ้ให้น้องรหัส
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#8faa55",
              margin: "0 0 28px",
              fontFamily: "monospace",
            }}
          >
            Logged in as{" "}
            {firstTwo && <span style={{ color: "#d45c2a" }}>{firstTwo}</span>}
            <span style={{ color: "#c8d4a8" }}>{rest}</span>
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(140,170,80,0.2)",
            marginBottom: "28px",
          }}
        />

        <JuniorCard junior={mentor.mentee ? { id: mentor.mentee.studentId } : null} />

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
              color: "#708840",
              fontFamily: "monospace",
            }}
          >
            [ HINTS ] — {hints.length} added
          </span>
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(112, 136, 64, 0.12)",
              border: "1px solid rgba(112,136,64,0.35)",
              borderRadius: "2px",
              color: "#a8c060",
              fontSize: "11px",
              fontFamily: "monospace",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            <FaPlus size={9} /> ADD HINT
          </button>
        </div>

        {hints.length === 0 && !adding && (
          <p
            style={{
              fontSize: "13px",
              color: "#3a4a20",
              fontFamily: "monospace",
              margin: "16px 0",
            }}
          >
            — ยังไม่มีคำใบ้ เพิ่มคำใบ้แรกได้เลย —
          </p>
        )}

        {hints.map((h, i) => (
          <HintItem
            key={h.id}
            hint={h}
            index={i}
            onDelete={deleteHint}
            onEdit={editHint}
          />
        ))}

        {adding && (
          <div
            style={{
              marginTop: "10px",
              padding: "14px",
              backgroundColor: "rgba(10,14,8,0.6)",
              border: "1px solid rgba(140,170,80,0.2)",
              borderRadius: "3px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "#708840",
                fontFamily: "monospace",
                margin: "0 0 8px",
                letterSpacing: "0.08em",
              }}
            >
              NEW HINT
            </p>
            <textarea
              autoFocus
              placeholder="เขียนคำใบ้ที่นี่..."
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "rgba(140,170,80,0.06)",
                border: "1px solid rgba(140,170,80,0.25)",
                borderRadius: "2px",
                color: "#d8e8b8",
                fontSize: "14px",
                padding: "8px 12px",
                fontFamily: "monospace",
                outline: "none",
                resize: "vertical",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setAdding(false);
                  setNewHint("");
                }}
                style={{
                  background: "none",
                  border: "1px solid rgba(140,60,40,0.4)",
                  borderRadius: "2px",
                  color: "#b85040",
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
                    ? "rgba(112,136,64,0.2)"
                    : "rgba(112,136,64,0.05)",
                  border: `1px solid ${newHint.trim() ? "rgba(112,136,64,0.5)" : "rgba(112,136,64,0.15)"}`,
                  borderRadius: "2px",
                  color: newHint.trim() ? "#a8c060" : "#4a6028",
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
    </div>
  );
}
