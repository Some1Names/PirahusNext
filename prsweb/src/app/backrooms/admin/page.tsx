"use client";

import { useState } from "react";
import { FaUser, FaChevronDown, FaChevronUp, FaPlus, FaTrash, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";

type Junior = {
    id: string;
    name: string;
    surname: string;
};

type Senior = {
    id: string;
    name: string;
    surname: string;
    year: "68";
    hints: string[];
    junior: Junior;
};

function deriveJuniorId(seniorId: string): string {
    return "69" + seniorId.slice(2);
}

const MOCK_SENIORS: Senior[] = [
    {
        id: "68090500401",
        name: "John",
        surname: "Doe",
        year: "68",
        hints: ["พี่รหัสชอบแมว", "เลี้ยงปลาคาร์ป", "ชอบดื่มชานมไข่มุก"],
        junior: { id: deriveJuniorId("68090500401"), name: "Mint", surname: "Jaidee" },
    },
    {
        id: "68090500402",
        name: "Jane",
        surname: "Smith",
        year: "68",
        hints: [],
        junior: { id: deriveJuniorId("68090500402"), name: "Petch", surname: "Sombat" },
    },
    {
        id: "68090500403",
        name: "Arm",
        surname: "Wongkul",
        year: "68",
        hints: [],
        junior: { id: deriveJuniorId("68090500403"), name: "Namo", surname: "Tiparat" },
    },
];

function SeniorId({ id }: { id: string }) {
    return (
        <span style={{ fontFamily: "monospace", fontSize: "17px", fontWeight: 700, letterSpacing: "0.04em" }}>
            <span style={{ color: "#d45c2a" }}>68</span>
            <span style={{ color: "#c8d4a8" }}>{id.slice(2)}</span>
        </span>
    );
}

function JuniorId({ id }: { id: string }) {
    return (
        <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 600, letterSpacing: "0.04em" }}>
            <span style={{ color: "#4a9eff" }}>69</span>
            <span style={{ color: "#8aaccc" }}>{id.slice(2)}</span>
        </span>
    );
}

function SeniorRow({ senior, onUpdateHints }: { senior: Senior; onUpdateHints: (id: string, hints: string[]) => void }) {
    const [open, setOpen] = useState(false);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editVal, setEditVal] = useState("");
    const [adding, setAdding] = useState(false);
    const [newHint, setNewHint] = useState("");

    const saveEdit = (i: number) => {
        const updated = [...senior.hints];
        updated[i] = editVal.trim();
        onUpdateHints(senior.id, updated.filter(Boolean));
        setEditingIdx(null);
    };

    const deleteHint = (i: number) => {
        onUpdateHints(senior.id, senior.hints.filter((_, idx) => idx !== i));
    };

    const addHint = () => {
        if (!newHint.trim()) return;
        onUpdateHints(senior.id, [...senior.hints, newHint.trim()]);
        setNewHint("");
        setAdding(false);
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
            {/* Main row */}
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
                <div style={{ flex: "0 0 auto", minWidth: "170px" }}>
                    <SeniorId id={senior.id} />
                </div>

                <div style={{
                    flex: 1,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#d8e8b8",
                    letterSpacing: "0.03em",
                    fontFamily: "'Share Tech Mono', monospace",
                }}>
                    {senior.name} {senior.surname}
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

            {/* Expandable */}
            {open && (
                <div style={{
                    borderTop: "1px solid rgba(140,170,80,0.15)",
                    padding: "14px 16px",
                }}>
                    {/* Junior row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        backgroundColor: "rgba(20, 40, 70, 0.55)",
                        borderRadius: "2px",
                        border: "1px solid rgba(74, 158, 255, 0.2)",
                        marginBottom: "16px",
                    }}>
                        <FaUser size={12} style={{ color: "#4a9eff", flexShrink: 0 }} />
                        <JuniorId id={senior.junior.id} />
                        <span style={{
                            fontSize: "13px",
                            color: "#7ab8e8",
                            fontWeight: 600,
                            fontFamily: "'Share Tech Mono', monospace",
                        }}>
                            {senior.junior.name} {senior.junior.surname}
                        </span>
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
                    </div>

                    {/* Hints header */}
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

                    {/* Empty state */}
                    {senior.hints.length === 0 && !adding && (
                        <p style={{ fontSize: "12px", color: "#4a6a28", margin: "0 0 4px", fontFamily: "monospace" }}>
                            — no hints yet —
                        </p>
                    )}

                    {/* Hint items */}
                    {senior.hints.map((h, i) => (
                        <div key={i} style={{
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
                                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(i); if (e.key === "Escape") setEditingIdx(null); }}
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
                                    <button onClick={() => saveEdit(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#70b840" }}><FaCheck size={11} /></button>
                                    <button onClick={() => setEditingIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b84030" }}><FaTimes size={11} /></button>
                                </>
                            ) : (
                                <>
                                    <span style={{ flex: 1, fontSize: "13px", color: "#98b868", fontFamily: "monospace" }}>{h}</span>
                                    <button
                                        onClick={() => { setEditingIdx(i); setEditVal(h); setAdding(false); }}
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#4a6030", padding: "2px" }}
                                    >
                                        <FaPencilAlt size={10} />
                                    </button>
                                    <button
                                        onClick={() => deleteHint(i)}
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#8a3020", padding: "2px" }}
                                    >
                                        <FaTrash size={10} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Add new hint */}
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
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState<Senior[]>(MOCK_SENIORS);

    const updateHints = (id: string, hints: string[]) => {
        setStudents((prev) => prev.map((s) => s.id === id ? { ...s, hints } : s));
    };

    const filtered = students.filter((s) =>
        s.id.includes(search) ||
        s.junior.id.includes(search) ||
        `${s.name} ${s.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        `${s.junior.name} ${s.junior.surname}`.toLowerCase().includes(search.toLowerCase())
    );

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
                    backgroundColor: "rgba(10, 14, 8, 0.45)",  // was 0.55
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                    minHeight: "100vh",
                    boxShadow: "inset 60px 0 80px rgba(10,14,8,0.3), inset -60px 0 80px rgba(10,14,8,0.3)",  // was 0.6
                    isolation: "isolate",
                }}>
                {/* Grain overlay */}
                <div style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    opacity: 0.06,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px 180px",
                }} />
                {/* Header */}
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

                {/* Search */}
                <input
                    type="text"
                    placeholder="> search by id or name..."
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

                {/* Legend */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    {[
                        { color: "#d45c2a", label: "68 — senior (พี่รหัส)" },
                        { color: "#4a9eff", label: "69 — junior (น้องรหัส)" },
                    ].map(({ color, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 700, color, fontSize: "13px" }}>■</span>
                            <span style={{ fontSize: "11px", color: "#8faa55", fontFamily: "monospace" }}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* List */}
                {filtered.map((s) => (
                    <SeniorRow key={s.id} senior={s} onUpdateHints={updateHints} />
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