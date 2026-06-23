"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaCheck,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authService, mentorService, hintService } from "@/src/infra/container";
import Swal from "sweetalert2";
import { IMentor } from "@/src/core/domain/mentor";

function SeniorId({ id }: { id: string }) {
  const firstTwo = id.length >= 2 ? id.slice(0, 2) : "";
  const rest = id.length >= 2 ? id.slice(2) : id;
  return (
    <span style={{ fontFamily: "monospace", fontSize: "17px", fontWeight: 700, letterSpacing: "0.04em" }}>
      {firstTwo && <span style={{ color: "#d45c2a" }}>{firstTwo}</span>}
      <span style={{ color: "#c8d4a8" }}>{rest}</span>
    </span>
  );
}

function JuniorId({ id }: { id: string }) {
  const firstTwo = id.length >= 2 ? id.slice(0, 2) : "";
  const rest = id.length >= 2 ? id.slice(2) : id;
  return (
    <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 600, letterSpacing: "0.04em" }}>
      {firstTwo && <span style={{ color: "#4a9eff" }}>{firstTwo}</span>}
      <span style={{ color: "#8aaccc" }}>{rest}</span>
    </span>
  );
}

function SeniorRow({ senior, onRefresh }: { senior: IMentor; onRefresh: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");
  const [adding, setAdding] = useState(false);
  const [newHint, setNewHint] = useState("");

  const saveEdit = async (hintId: string) => {
    if (!editVal.trim()) return;
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
      await hintService.updateHints(hintId, { content: editVal.trim() });
      setEditingIdx(null);
      await onRefresh();
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

  const deleteHint = async (hintId: string) => {
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
        await hintService.deleteHint(hintId);
        await onRefresh();
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

  const addHint = async () => {
    if (!newHint.trim()) return;
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
        mentorId: senior.id,
        hints: [newHint.trim()],
      });
      setNewHint("");
      setAdding(false);
      await onRefresh();
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

  return (
    <div style={{
      backgroundColor: "rgba(10, 14, 8, 0.88)",
      backdropFilter: "blur(6px)",
      borderRadius: "3px",
      border: "1px solid rgba(140, 170, 80, 0.2)",
      marginBottom: "8px",
      overflow: "visible",
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "13px 16px",
          gap: "16px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <div style={{ flex: 1, minWidth: "170px", display: "flex", alignItems: "center", gap: "10px" }}>
          <SeniorId id={senior.studentId} />
          {senior.name && (
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#d8e8b8", fontFamily: "monospace" }}>
              {senior.name}
            </span>
          )}
        </div>

        {senior.hints.length > 0 && (
          <span style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#708840",
            backgroundColor: "rgba(112, 136, 64, 0.15)",
            border: "1px solid rgba(112,136,64,0.3)",
            borderRadius: "2px",
            padding: "2px 7px",
          }}>
            {senior.hints.length} hint{senior.hints.length > 1 ? "s" : ""}
          </span>
        )}

        <div onClick={(e) => e.stopPropagation()}>
          {open
            ? <FaChevronUp size={11} style={{ color: "#a8c060" }} />
            : <FaChevronDown size={11} style={{ color: "#4a5a30" }} />
          }
        </div>
      </div>

      {open && (
        <div style={{
          borderTop: "1px solid rgba(140,170,80,0.15)",
          padding: "14px 16px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            backgroundColor: senior.mentee ? "rgba(20, 40, 70, 0.55)" : "rgba(100, 40, 30, 0.25)",
            borderRadius: "2px",
            border: `1px solid ${senior.mentee ? "rgba(74, 158, 255, 0.2)" : "rgba(255, 100, 74, 0.25)"}`,
            marginBottom: "16px",
          }}>
            <FaUser size={12} style={{ color: senior.mentee ? "#4a9eff" : "#ff644a", flexShrink: 0 }} />
            {senior.mentee ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <JuniorId id={senior.mentee.studentId} />
                  {senior.mentee.name && (
                    <span style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#7ab8e8",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}>
                      {senior.mentee.name}
                    </span>
                  )}
                </div>
                <span style={{
                  marginLeft: "auto",
                  fontSize: "10px",
                  color: "#2a5070",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}>
                  น้องรหัส
                </span>
              </>
            ) : (
              <span style={{
                fontSize: "13px",
                color: "#e8a090",
                fontWeight: 600,
                fontFamily: "monospace",
              }}>
                ยังไม่มีข้อมูลน้องรหัสในระบบ
              </span>
            )}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}>
            <span style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#708840",
              fontFamily: "monospace",
            }}>
              [ hints ]
            </span>
            <button
              onClick={() => { setAdding(true); setEditingIdx(null); }}
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
                padding: "3px 8px",
                cursor: "pointer",
              }}
            >
              <FaPlus size={9} /> ADD
            </button>
          </div>

          {senior.hints.length === 0 && !adding && (
            <p style={{ fontSize: "12px", color: "#4a6a28", margin: "0 0 4px", fontFamily: "monospace" }}>
              — no hints yet —
            </p>
          )}

          {senior.hints.map((h, i) => (
            <div key={h.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 0",
              borderBottom: "1px solid rgba(140,170,80,0.07)",
            }}>
              <span style={{ fontSize: "11px", color: "#3a4a20", fontFamily: "monospace", minWidth: "16px" }}>
                {i + 1}.
              </span>

              {editingIdx === i ? (
                <>
                  <input
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(h.id); if (e.key === "Escape") setEditingIdx(null); }}
                    style={{
                      flex: 1,
                      background: "rgba(140,170,80,0.08)",
                      border: "1px solid rgba(140,170,80,0.3)",
                      borderRadius: "2px",
                      color: "#d8e8b8",
                      fontSize: "13px",
                      padding: "3px 8px",
                      fontFamily: "monospace",
                      outline: "none",
                    }}
                  />
                  <button onClick={() => saveEdit(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#70b840" }}><FaCheck size={11} /></button>
                  <button onClick={() => setEditingIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b84030" }}><FaTimes size={11} /></button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: "13px", color: "#98b868", fontFamily: "monospace" }}>{h.content}</span>
                  <button
                    onClick={() => { setEditingIdx(i); setEditVal(h.content); setAdding(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#4a6030", padding: "2px" }}
                  >
                    <FaPencilAlt size={10} />
                  </button>
                  <button
                    onClick={() => deleteHint(h.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#8a3020", padding: "2px" }}
                  >
                    <FaTrash size={10} />
                  </button>
                </>
              )}
            </div>
          ))}

          {adding && (
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <input
                autoFocus
                placeholder="type hint here..."
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addHint(); if (e.key === "Escape") { setAdding(false); setNewHint(""); } }}
                style={{
                  flex: 1,
                  background: "rgba(140,170,80,0.08)",
                  border: "1px solid rgba(140,170,80,0.3)",
                  borderRadius: "2px",
                  color: "#d8e8b8",
                  fontSize: "13px",
                  padding: "5px 10px",
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
              <button onClick={addHint} style={{ background: "rgba(112,136,64,0.18)", border: "1px solid rgba(112,136,64,0.4)", borderRadius: "2px", color: "#a8c060", fontSize: "11px", fontFamily: "monospace", padding: "4px 10px", cursor: "pointer" }}>
                SAVE
              </button>
              <button onClick={() => { setAdding(false); setNewHint(""); }} style={{ background: "none", border: "1px solid rgba(140,60,40,0.4)", borderRadius: "2px", color: "#b85040", fontSize: "11px", fontFamily: "monospace", padding: "4px 10px", cursor: "pointer" }}>
                CANCEL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<IMentor[]>([]);

  const refreshData = async () => {
    try {
      const list = await mentorService.getAllMentors();
      setStudents(list);
    } catch (err) {
      console.error("Failed to fetch mentors:", err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await authService.me() as any;
        if (!res?.user || res?.user?.role !== "admin") {
          router.push("/");
          return;
        }
        await refreshData();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const filtered = students.filter((s) =>
    s.studentId.includes(search) ||
    (s.mentee && s.mentee.studentId.includes(search))
  );

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/backroomspattern.png')",
        backgroundSize: "300px 300px",
        backgroundRepeat: "repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 14, 8, 1)",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#a8c060",
          letterSpacing: "0.15em",
        }}>
          LOADING ADMIN SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/images/backroomspattern.png')",
      backgroundSize: "300px 300px",
      backgroundRepeat: "repeat",
      position: "relative",
    }}>
      <style>{`
        .admin-page *::selection {
          background-color: rgba(140, 170, 80, 0.35);
          color: #d8e8b8;
        }
      `}</style>
      <div className="admin-page"
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
          boxShadow: "inset 60px 0 80px rgba(10,14,8,0.3), inset -60px 0 80px rgba(10,14,8,0.3)",
          isolation: "isolate",
        }}>
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }} />

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

        <div style={{ marginBottom: "36px" }}>
          <p style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8faa55",
            marginBottom: "4px",
            fontFamily: "monospace",
          }}>
            ■ SYSTEM / ADMIN PANEL
          </p>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#a8c060",
            margin: "0 0 4px",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.06em",
          }}>
            พี่รหัส — น้องรหัส
          </h1>
          <p style={{ fontSize: "12px", color: "#8faa55", margin: 0, fontFamily: "monospace" }}>
            {students.length} pairs registered
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(140,170,80,0.25)", marginBottom: "20px" }} />

        <input
          type="text"
          placeholder="> search by id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "9px 14px",
            borderRadius: "2px",
            border: "1px solid rgba(140,170,80,0.25)",
            backgroundColor: "rgba(10, 14, 8, 0.82)",
            color: "#a8c060",
            fontSize: "13px",
            outline: "none",
            marginBottom: "16px",
            fontFamily: "monospace",
            caretColor: "#a8c060",
          }}
        />

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {[
            { color: "#d45c2a", label: "senior (พี่รหัส)" },
            { color: "#4a9eff", label: "junior (น้องรหัส)" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color, fontSize: "13px" }}>■</span>
              <span style={{ fontSize: "11px", color: "#8faa55", fontFamily: "monospace" }}>{label}</span>
            </div>
          ))}
        </div>

        {filtered.map((s) => (
          <SeniorRow key={s.id} senior={s} onRefresh={refreshData} />
        ))}

        {filtered.length === 0 && (
          <p style={{ color: "#5a7a38", textAlign: "center", marginTop: "48px", fontFamily: "monospace", fontSize: "13px" }}>
            — no results —
          </p>
        )}
      </div>
    </div>
  );
}
