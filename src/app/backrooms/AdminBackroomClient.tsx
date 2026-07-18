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
import {
  mentorService,
  hintService,
  menteeService,
} from "@/src/clients/container";
import { useUserStore } from "@/src/store/auth";
import { alertUtil } from "@/src/utils/alert.util";
import { ALERT_MESSAGES } from "@/src/core/constants/messages";
import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

function MentorBadge({
  id,
  nickname,
  point,
}: {
  id: string;
  nickname?: string | null;
  point: number;
}) {
  const firstTwo = id.length >= 2 ? id.slice(0, 2) : "";
  const rest = id.length >= 2 ? id.slice(2) : id;
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        margin: "4px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          padding: "6px 12px",
          border: "1px solid rgba(212, 92, 42, 0.3)",
          backgroundColor: "rgba(212, 92, 42, 0.08)",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#d45c2a",
            fontWeight: 700,
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          ID
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {firstTwo && <span style={{ color: "#d45c2a" }}>{firstTwo}</span>}
          <span style={{ color: "#c8d4a8" }}>{rest}</span>
        </span>
      </div>
      {nickname && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            padding: "6px 12px",
            border: "1px solid rgba(168, 192, 96, 0.3)",
            backgroundColor: "rgba(168, 192, 96, 0.08)",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#a8c060",
              fontWeight: 700,
              letterSpacing: "1px",
              lineHeight: 1,
            }}
          >
            NAME
          </span>
          <span
            style={{
              fontSize: "14px",
              fontFamily: "'Share Tech Mono', monospace",
              color: "#d8e8b8",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {nickname}
          </span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          padding: "6px 12px",
          border: "1px solid rgba(220, 180, 50, 0.3)",
          backgroundColor: "rgba(220, 180, 50, 0.08)",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#e8c850",
            fontWeight: 700,
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          PTS
        </span>
        <span
          style={{
            fontSize: "14px",
            fontFamily: "'Share Tech Mono', monospace",
            color: "#f8e8a8",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {point}
        </span>
      </div>
    </div>
  );
}

function MenteeBadge({
  id,
  nickname,
  point,
}: {
  id: string;
  nickname?: string | null;
  point: number;
}) {
  const firstTwo = id.length >= 2 ? id.slice(0, 2) : "";
  const rest = id.length >= 2 ? id.slice(2) : id;
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          padding: "6px 12px",
          border: "1px solid rgba(74, 158, 255, 0.25)",
          backgroundColor: "rgba(74, 158, 255, 0.08)",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#4a9eff",
            fontWeight: 700,
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          ID
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {firstTwo && <span style={{ color: "#4a9eff" }}>{firstTwo}</span>}
          <span style={{ color: "#8aaccc" }}>{rest}</span>
        </span>
      </div>
      {nickname && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            padding: "6px 12px",
            border: "1px solid rgba(122, 184, 232, 0.25)",
            backgroundColor: "rgba(122, 184, 232, 0.08)",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#7ab8e8",
              fontWeight: 700,
              letterSpacing: "1px",
              lineHeight: 1,
            }}
          >
            NAME
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#aadcff",
              fontFamily: "'Share Tech Mono', monospace",
              lineHeight: 1,
            }}
          >
            {nickname}
          </span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          padding: "6px 12px",
          border: "1px solid rgba(220, 180, 50, 0.3)",
          backgroundColor: "rgba(220, 180, 50, 0.08)",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#e8c850",
            fontWeight: 700,
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          PTS
        </span>
        <span
          style={{
            fontSize: "14px",
            fontFamily: "'Share Tech Mono', monospace",
            color: "#f8e8a8",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {point}
        </span>
      </div>
    </div>
  );
}

type AdminMentorData = IMentor & {
  hasPassword?: boolean;
  mentee?: (IMentee & { hasPassword?: boolean }) | null;
};

function MentorRow({
  mentor,
  mode,
  onRefresh,
}: {
  mentor: AdminMentorData;
  mode: "mentors" | "passwords";
  onRefresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");
  const [adding, setAdding] = useState(false);
  const [newHint, setNewHint] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [togglingAdmin, setTogglingAdmin] = useState(false);



  const setPointsToUser = async (
    id: string,
    role: "mentor" | "mentee",
    studentId: string,
  ) => {
    const { value: amount } = await alertUtil.showPrompt(
      ALERT_MESSAGES.PROMPT.SET_POINTS(studentId),
      ALERT_MESSAGES.PROMPT.SET_POINTS_LABEL,
    );

    if (amount) {
      const points = parseInt(amount, 10);
      if (isNaN(points) || points < 0) return;

      const confirmResult = await alertUtil.showConfirm(
        ALERT_MESSAGES.CONFIRM.SET_POINTS,
        ALERT_MESSAGES.CONFIRM.SET_POINTS_DESC(studentId, points),
      );
      if (!confirmResult.isConfirmed) return;

      try {
        alertUtil.showLoading(ALERT_MESSAGES.LOADING.SET_POINTS);

        if (role === "mentor") {
          await mentorService.setMentorPoint(id, points);
        } else {
          await menteeService.setMenteePoint(id, points);
        }

        await onRefresh();
        alertUtil.showSuccess(
          ALERT_MESSAGES.SUCCESS.TITLE,
          ALERT_MESSAGES.SUCCESS.SET_POINTS,
        );
      } catch (err) {
        console.error("Failed to set points:", err);
        alertUtil.showError(
          ALERT_MESSAGES.ERROR.TITLE,
          ALERT_MESSAGES.ERROR.SET_POINTS,
        );
      }
    }
  };

  const toggleAdmin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !mentor.isAdmin;
    const label = next ? "แอดมิน" : "Mentor";
    const result = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.TOGGLE_ROLE(label),
      ALERT_MESSAGES.CONFIRM.TOGGLE_ROLE_DESC(
        mentor.nickname || mentor.studentId,
        label,
      ),
    );
    if (!result.isConfirmed) return;
    try {
      setTogglingAdmin(true);
      await mentorService.setAdminRole(mentor.id, next);
      await onRefresh();
    } catch (err) {
      console.error("Failed to toggle admin:", err);
      alertUtil.showError(
        ALERT_MESSAGES.ERROR.TITLE,
        ALERT_MESSAGES.ERROR.TOGGLE_ROLE,
      );
    } finally {
      setTogglingAdmin(false);
    }
  };

  const saveEdit = async (hintId: string) => {
    if (!editVal.trim()) return;

    const result = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.EDIT_HINT,
      ALERT_MESSAGES.CONFIRM.EDIT_HINT_DESC,
    );
    if (!result.isConfirmed) return;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.EDIT_HINT);
      await hintService.updateHints(hintId, { content: editVal.trim() });
      setEditingIdx(null);
      await onRefresh();
      alertUtil.showSuccess(
        ALERT_MESSAGES.SUCCESS.TITLE,
        ALERT_MESSAGES.SUCCESS.EDIT_HINT,
      );
    } catch (err) {
      console.error("Failed to edit hint:", err);
      alertUtil.showError(
        ALERT_MESSAGES.ERROR.TITLE,
        ALERT_MESSAGES.ERROR.EDIT_HINT,
      );
    }
  };

  const deleteHint = async (hintId: string) => {
    const result = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.DELETE_HINT,
      ALERT_MESSAGES.CONFIRM.DELETE_HINT_DESC,
      { isDanger: true, confirmButtonText: "ลบ" },
    );

    if (result.isConfirmed) {
      try {
        alertUtil.showLoading(ALERT_MESSAGES.LOADING.DELETE_HINT);
        await hintService.deleteHint(hintId);
        await onRefresh();
        alertUtil.showSuccess(
          ALERT_MESSAGES.SUCCESS.TITLE,
          ALERT_MESSAGES.SUCCESS.DELETE_HINT,
        );
      } catch (err) {
        console.error("Failed to delete hint:", err);
        alertUtil.showError(
          ALERT_MESSAGES.ERROR.TITLE,
          ALERT_MESSAGES.ERROR.DELETE_HINT,
        );
      }
    }
  };

  const addHint = async () => {
    if (!newHint.trim()) return;

    const result = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.ADD_HINT,
      ALERT_MESSAGES.CONFIRM.ADD_HINT_DESC,
    );
    if (!result.isConfirmed) return;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.SAVE_HINT);
      await hintService.addHints({
        mentorId: mentor.id,
        hints: [{ content: newHint.trim(), level: newLevel }],
      });
      setNewHint("");
      setNewLevel(1);
      setAdding(false);
      await onRefresh();
      alertUtil.showSuccess(
        ALERT_MESSAGES.SUCCESS.TITLE,
        ALERT_MESSAGES.SUCCESS.SAVE_HINT,
      );
    } catch (err) {
      console.error("Failed to add hint:", err);
      alertUtil.showError(
        ALERT_MESSAGES.ERROR.TITLE,
        ALERT_MESSAGES.ERROR.SAVE_HINT,
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 14, 8, 0.88)",
        backdropFilter: "blur(6px)",
        borderRadius: "3px",
        border: "1px solid rgba(140, 170, 80, 0.2)",
        marginBottom: "8px",
        overflow: "visible",
      }}
    >
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
        <div
          style={{
            flex: 1,
            minWidth: "170px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <MentorBadge
            id={mentor.studentId}
            nickname={mentor.nickname}
            point={mentor.point}
          />
        </div>

        {mode === "passwords" && (
          <div style={{ marginRight: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            {mentor.hasPassword ? (
              <span style={{ fontSize: "12px", color: "#4ade80", fontFamily: "monospace", fontWeight: "bold" }}>✅ มีรหัส</span>
            ) : (
              <span style={{ fontSize: "12px", color: "#f87171", fontFamily: "monospace", fontWeight: "bold" }}>❌ ไม่มีรหัส</span>
            )}
            {mentor.hasPassword && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const res = await alertUtil.showConfirm("ลบรหัสผ่าน?", `คุณแน่ใจหรือไม่ที่จะลบรหัสผ่านของ ${mentor.studentId}?`, { isDanger: true, confirmButtonText: "ลบ" });
                  if (res.isConfirmed) {
                    try {
                      alertUtil.showLoading("กำลังลบ...");
                      const { authService } = await import("@/src/clients/container");
                      await authService.deletePassword(mentor.id, "mentor");
                      await onRefresh();
                      alertUtil.showSuccess("สำเร็จ", "ลบรหัสผ่านเรียบร้อย");
                    } catch (err) {
                      console.error(err);
                      alertUtil.showError("ผิดพลาด", "ไม่สามารถลบรหัสผ่านได้");
                    }
                  }
                }}
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  border: "1px solid rgba(220, 50, 50, 0.5)",
                  backgroundColor: "rgba(220, 50, 50, 0.15)",
                  color: "#e85050",
                }}
              >
                ลบรหัสผ่าน
              </button>
            )}
          </div>
        )}

        {mode === "mentors" && mentor.hints.length > 0 && (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#708840",
              backgroundColor: "rgba(112, 136, 64, 0.15)",
              border: "1px solid rgba(112,136,64,0.3)",
              borderRadius: "2px",
              padding: "2px 7px",
            }}
          >
            {mentor.hints.length} hint{mentor.hints.length > 1 ? "s" : ""}
          </span>
        )}

        {mode !== "passwords" && (
          <div onClick={(e) => e.stopPropagation()}>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPointsToUser(mentor.id, "mentor", mentor.studentId);
              }}
              title="แก้ไขแต้ม (แทนที่ค่าเดิม)"
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "2px 8px",
                borderRadius: "2px",
                cursor: "pointer",
                border: "1px solid rgba(220, 100, 50, 0.5)",
                backgroundColor: "rgba(220, 100, 50, 0.15)",
                color: "#e88050",
                marginRight: "6px",
              }}
            >
              EDIT PTS
            </button>
            <button
            onClick={toggleAdmin}
            disabled={togglingAdmin}
            title={
              mentor.isAdmin
                ? "คลิกเพื่อลด role เป็น Mentor"
                : "คลิกเพื่อเพิ่มเป็น Admin"
            }
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "2px 8px",
              borderRadius: "2px",
              cursor: togglingAdmin ? "not-allowed" : "pointer",
              opacity: togglingAdmin ? 0.5 : 1,
              border: mentor.isAdmin
                ? "1px solid rgba(168, 192, 96, 0.7)"
                : "1px solid rgba(112, 136, 64, 0.3)",
              backgroundColor: mentor.isAdmin
                ? "rgba(168, 192, 96, 0.15)"
                : "rgba(30, 40, 20, 0.4)",
              color: mentor.isAdmin ? "#a8c060" : "#708840",
            }}
          >
            {mentor.isAdmin ? "ADMIN" : "MENTOR"}
          </button>
        </div>
        )}

        <div onClick={(e) => e.stopPropagation()}>
          {open ? (
            <FaChevronUp size={11} style={{ color: "#a8c060" }} />
          ) : (
            <FaChevronDown size={11} style={{ color: "#4a5a30" }} />
          )}
        </div>
      </div>

      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(140,170,80,0.15)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              backgroundColor: mentor.mentee
                ? "rgba(20, 40, 70, 0.55)"
                : "rgba(100, 40, 30, 0.25)",
              borderRadius: "2px",
              border: `1px solid ${mentor.mentee ? "rgba(74, 158, 255, 0.2)" : "rgba(255, 100, 74, 0.25)"}`,
              marginBottom: "16px",
            }}
          >
            <FaUser
              size={12}
              style={{
                color: mentor.mentee ? "#4a9eff" : "#ff644a",
                flexShrink: 0,
              }}
            />
            {mentor.mentee ? (
              <>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MenteeBadge
                    id={mentor.mentee.studentId}
                    nickname={mentor.mentee.nickname}
                    point={mentor.mentee.point}
                  />
                </div>
                {mode === "passwords" && (
                  <div style={{ marginLeft: "auto", marginRight: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {mentor.mentee.hasPassword ? (
                      <span style={{ fontSize: "12px", color: "#4ade80", fontFamily: "monospace", fontWeight: "bold" }}>✅ มีรหัส</span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#f87171", fontFamily: "monospace", fontWeight: "bold" }}>❌ ไม่มีรหัส</span>
                    )}
                    {mentor.mentee.hasPassword && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await alertUtil.showConfirm("ลบรหัสผ่าน?", `คุณแน่ใจหรือไม่ที่จะลบรหัสผ่านของ ${mentor.mentee!.studentId}?`, { isDanger: true, confirmButtonText: "ลบ" });
                          if (res.isConfirmed) {
                            try {
                              alertUtil.showLoading("กำลังลบ...");
                              const { authService } = await import("@/src/clients/container");
                              await authService.deletePassword(mentor.mentee!.id, "mentee");
                              await onRefresh();
                              alertUtil.showSuccess("สำเร็จ", "ลบรหัสผ่านเรียบร้อย");
                            } catch (err) {
                              console.error(err);
                              alertUtil.showError("ผิดพลาด", "ไม่สามารถลบรหัสผ่านได้");
                            }
                          }
                        }}
                        style={{
                          fontSize: "10px",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          border: "1px solid rgba(220, 50, 50, 0.5)",
                          backgroundColor: "rgba(220, 50, 50, 0.15)",
                          color: "#e85050",
                        }}
                      >
                        ลบรหัสผ่าน
                      </button>
                    )}
                  </div>
                )}
                {mode !== "passwords" && (
                  <>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPointsToUser(
                          mentor.mentee!.id,
                          "mentee",
                          mentor.mentee!.studentId,
                        );
                      }}
                      title="แก้ไขแต้ม (แทนที่ค่าเดิม)"
                      style={{
                        marginLeft: "auto",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "2px",
                        cursor: "pointer",
                        border: "1px solid rgba(158, 100, 255, 0.5)",
                        backgroundColor: "rgba(158, 100, 255, 0.15)",
                        color: "#b880e8",
                        marginRight: "10px",
                      }}
                    >
                      EDIT PTS
                    </button>
                  </>
                )}
                <span
                  style={{
                    fontSize: "10px",
                    color: "#2a5070",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                  }}
                >
                  น้องรหัส
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: "13px",
                  color: "#e8a090",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                ยังไม่มีข้อมูลน้องรหัสในระบบ
              </span>
            )}
          </div>

          {mode === "mentors" && (
            <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
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
              [ hints ]
            </span>
            {mentor.hints.length < 5 && (
              <button
                onClick={() => {
                  const usedLevels = mentor.hints.map((h) => h.level);
                  const availableLevels = [1, 2, 3, 4, 5].filter(
                    (l) => !usedLevels.includes(l),
                  );
                  if (availableLevels.length > 0) {
                    setNewLevel(availableLevels[0]);
                  }
                  setAdding(true);
                  setEditingIdx(null);
                }}
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
            )}
          </div>

          {mentor.hints.length === 0 && !adding && (
            <p
              style={{
                fontSize: "12px",
                color: "#4a6a28",
                margin: "0 0 4px",
                fontFamily: "monospace",
              }}
            >
              — no hints yet —
            </p>
          )}

          {mentor.hints.map((h, i) => (
            <div
              key={h.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 0",
                borderBottom: "1px solid rgba(140,170,80,0.07)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#a8c060",
                  backgroundColor: "rgba(168, 192, 96, 0.12)",
                  border: "1px solid rgba(168, 192, 96, 0.3)",
                  borderRadius: "2px",
                  padding: "3px 6px",
                  fontFamily: "monospace",
                  minWidth: "56px",
                  textAlign: "center",
                }}
              >
                Level {h.level}
              </span>

              {editingIdx === i ? (
                <>
                  <input
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(h.id);
                      if (e.key === "Escape") setEditingIdx(null);
                    }}
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
                  <button
                    onClick={() => saveEdit(h.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#70b840",
                    }}
                  >
                    <FaCheck size={11} />
                  </button>
                  <button
                    onClick={() => setEditingIdx(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#b84030",
                    }}
                  >
                    <FaTimes size={11} />
                  </button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      color: "#98b868",
                      fontFamily: "monospace",
                    }}
                  >
                    {h.content}
                  </span>
                  <button
                    onClick={() => {
                      setEditingIdx(i);
                      setEditVal(h.content);
                      setAdding(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#4a6030",
                      padding: "2px",
                    }}
                  >
                    <FaPencilAlt size={10} />
                  </button>
                  <button
                    onClick={() => deleteHint(h.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#8a3020",
                      padding: "2px",
                    }}
                  >
                    <FaTrash size={10} />
                  </button>
                </>
              )}
            </div>
          ))}

          {adding && (
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
                style={{
                  background: "rgba(140,170,80,0.08)",
                  border: "1px solid rgba(140,170,80,0.3)",
                  borderRadius: "2px",
                  color: "#d8e8b8",
                  fontSize: "13px",
                  padding: "5px",
                  fontFamily: "monospace",
                  outline: "none",
                }}
              >
                {[1, 2, 3, 4, 5].map((l) => {
                  const isUsed = mentor.hints.some((h) => h.level === l);
                  return (
                    <option
                      key={l}
                      value={l}
                      disabled={isUsed}
                      style={{
                        background: "#0a0e08",
                        color: isUsed ? "#4a5a3a" : "#d8e8b8",
                      }}
                    >
                      L{l} {isUsed ? "(เลือกแล้ว)" : ""}
                    </option>
                  );
                })}
              </select>
              <input
                autoFocus
                placeholder="type hint here..."
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addHint();
                  if (e.key === "Escape") {
                    setAdding(false);
                    setNewHint("");
                  }
                }}
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
              <button
                onClick={addHint}
                style={{
                  background: "rgba(112,136,64,0.18)",
                  border: "1px solid rgba(112,136,64,0.4)",
                  borderRadius: "2px",
                  color: "#a8c060",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                SAVE
              </button>
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
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
            </div>
          )}
          </>
        )}
        </div>
      )}
    </div>
  );
}

import ShopAdminTab from "@/src/components/admin/ShopAdminTab";

export default function AdminBackroomClient() {
  const router = useRouter();
  const { user, loading: authLoading, getUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<AdminMentorData[]>([]);
  const [activeTab, setActiveTab] = useState<"mentors" | "shop" | "passwords">("mentors");

  const refreshData = async () => {
    try {
      const list = await mentorService.getAllMentors();
      setStudents(list);
    } catch (err) {
      console.error("Failed to fetch mentors:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      await refreshData();
      setLoading(false);
    })();
  }, [user, authLoading]);

  const filtered = students.filter(
    (s) =>
      s.studentId.includes(search) ||
      (s.mentee && s.mentee.studentId.includes(search)),
  );

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
          LOADING ADMIN SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/backroomspattern.png')",
        backgroundSize: "300px 300px",
        backgroundRepeat: "repeat",
        position: "relative",
      }}
    >
      <style>{`
        .admin-page *::selection {
          background-color: rgba(140, 170, 80, 0.35);
          color: #d8e8b8;
        }
      `}</style>
      <div
        className="admin-page"
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={() => setActiveTab("mentors")}
              style={{
                background: "none",
                border: "none",
                color: activeTab === "mentors" ? "#a8c060" : "#5a7a38",
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                cursor: "pointer",
                padding: "0 0 4px",
                borderBottom:
                  activeTab === "mentors"
                    ? "2px solid #a8c060"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              จัดการสายรหัส
            </button>
            <button
              onClick={() => setActiveTab("passwords")}
              style={{
                background: "none",
                border: "none",
                color: activeTab === "passwords" ? "#a8c060" : "#5a7a38",
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                cursor: "pointer",
                padding: "0 0 4px",
                borderBottom:
                  activeTab === "passwords"
                    ? "2px solid #a8c060"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              จัดการรหัสผ่าน
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              style={{
                background: "none",
                border: "none",
                color: activeTab === "shop" ? "#a8c060" : "#5a7a38",
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                cursor: "pointer",
                padding: "0 0 4px",
                borderBottom:
                  activeTab === "shop"
                    ? "2px solid #a8c060"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              จัดการร้านค้า
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "1px solid rgba(140,170,80,0.4)",
              color: "#a8c060",
              fontSize: "12px",
              fontFamily: "monospace",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
          >
            <FaArrowLeft size={10} /> HOME
          </button>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(140,170,80,0.25)",
            marginBottom: "20px",
          }}
        />

        {activeTab === "mentors" || activeTab === "passwords" ? (
          <>
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
                { color: "#d45c2a", label: "mentor (พี่รหัส)" },
                { color: "#4a9eff", label: "mentee (น้องรหัส)" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color,
                      fontSize: "13px",
                    }}
                  >
                    ■
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#8faa55",
                      fontFamily: "monospace",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {filtered.map((s) => (
              <MentorRow key={s.id} mentor={s} mode={activeTab as "mentors" | "passwords"} onRefresh={refreshData} />
            ))}

            {filtered.length === 0 && (
              <p
                style={{
                  color: "#5a7a38",
                  textAlign: "center",
                  marginTop: "48px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                — no results —
              </p>
            )}
          </>
        ) : (
          <ShopAdminTab />
        )}
      </div>
    </div>
  );
}
