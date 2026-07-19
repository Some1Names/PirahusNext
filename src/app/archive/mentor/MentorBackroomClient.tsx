"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { hintService } from "@/src/clients/container";
import { useUserStore } from "@/src/store/auth";
import { alertUtil } from "@/src/utils/alert.util";
import { ALERT_MESSAGES } from "@/src/core/constants/messages";
import { IHint } from "@/src/core/domain/hint";
import { MentorUser } from "@/src/core/domain/user";
import HintBoard from "@/src/components/archive/mentor/Hintboard";
import MentorPanel from "@/src/components/archive/mentor/Mentorpanel";
import Link from "next/dist/client/link";
import Grainient from "@/src/components/reactbits/background/Grainient";

export default function MentorBackroomClient() {
  const { user, loading: authLoading, getUser } = useUserStore();
  const mentor = user as MentorUser | null;
  const [hints, setHints] = useState<IHint[]>([]);
  const [newHint, setNewHint] = useState("");
  const [newLevel, setNewLevel] = useState<number>(1);
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
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (authLoading || !user) return;

    hintService
      .getHintsByMentorId(user.id)
      .then(setHints)
      .catch((err) => console.error("Failed to load hints:", err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const addHint = async () => {
    if (!newHint.trim() || !mentor) return;
    
    const confirmResult = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.ADD_HINT,
      ALERT_MESSAGES.CONFIRM.ADD_HINT_DESC
    );
    if (!confirmResult.isConfirmed) return;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.SAVE_HINT);

      await hintService.addHints({
        mentorId: mentor.id,
        hints: [{ content: newHint.trim(), level: newLevel }],
      });
      setNewHint("");
      setNewLevel(1);
      setAdding(false);
      await refreshHints(mentor.id);

      alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.SAVE_HINT);
    } catch (err) {
      console.error("Failed to add hint:", err);
      alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.SAVE_HINT);
    }
  };

  const deleteHint = async (id: string) => {
    if (!mentor) return;
    const result = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.DELETE_HINT,
      ALERT_MESSAGES.CONFIRM.DELETE_HINT_DESC,
      { isDanger: true, confirmButtonText: "ลบ" }
    );

    if (result.isConfirmed) {
      try {
        alertUtil.showLoading(ALERT_MESSAGES.LOADING.DELETE_HINT);

        await hintService.deleteHint(id);
        await refreshHints(mentor.id);

        alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.DELETE_HINT);
      } catch (err) {
        console.error("Failed to delete hint:", err);
        alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.DELETE_HINT);
      }
    }
  };

  const editHint = async (id: string, content: string) => {
    if (!mentor) return;

    const confirmResult = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.EDIT_HINT,
      ALERT_MESSAGES.CONFIRM.EDIT_HINT_DESC
    );
    if (!confirmResult.isConfirmed) return;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.EDIT_HINT);

      await hintService.updateHints(id, { content });
      await refreshHints(mentor.id);

      alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.EDIT_HINT);
    } catch (err) {
      console.error("Failed to edit hint:", err);
      alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.EDIT_HINT);
    }
  };

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0a1a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(96, 69, 153, 0.25), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 18px 4px rgba(167, 139, 250, 0.6)",
            }}
          />
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#c4b5fd",
              letterSpacing: "0.2em",
            }}
          >
            LOADING DATA ACCESS...
          </div>
        </div>
      </div>
    );
  }

  const buttonStyle = {
    color: "#c4b5fd",
    border: "1px solid rgba(167, 139, 250, 0.45)",
    fontSize: "0.875rem",
    padding: "0.5rem 1rem",
    width: "fit-content",
    background: "rgba(23, 17, 47, 0.65)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    cursor: "pointer",
    borderRadius: "0.25rem",
    fontFamily: "Pixelify Sans",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    letterSpacing: "0.05em",
    transition: "all 0.2s ease",
    boxShadow: "0 0 0 rgba(139,92,246,0)",
  } as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Grainient
          color1="#604599"
          color2="#17112f"
          color3="#222b57"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div
        style={{
          position: "fixed",
          top: "2.5rem",
          left: "2rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        <Link
          href="/"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e9e0ff";
            e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.8)";
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.18)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(139,92,246,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#c4b5fd";
            e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.45)";
            e.currentTarget.style.background = "rgba(23, 17, 47, 0.65)";
            e.currentTarget.style.boxShadow = "0 0 0 rgba(139,92,246,0)";
          }}
        >
          <FaArrowLeft size={11} />
          BACK
        </Link>
      </div>

      <style>{`
      .backroom-columns {
        display: flex;
        gap: 72px;
        align-items: center;
      }
      .backroom-col-left {
        flex: 0 0 280px;
      }
      .backroom-col-right {
        flex: 1;
        min-width: 0;
      }
      @media (max-width: 720px) {
        .backroom-columns {
          flex-direction: column;
          gap: 32px;
        }
        .backroom-col-left {
          flex: 1 1 auto;
          width: 100%;
        }
      }

      .swal2-popup.backroom-swal-popup {
        border: 1px solid rgba(167, 139, 250, 0.3) !important;
        border-radius: 8px !important;
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.15) !important;
        font-family: monospace !important;
      }
      .swal2-popup.backroom-swal-popup .swal2-title {
        color: #c4b5fd !important;
      }
      .swal2-popup.backroom-swal-popup .swal2-html-container {
        color: #a996d9 !important;
      }
      .swal2-popup.backroom-swal-popup .swal2-actions button {
        font-family: monospace !important;
        letter-spacing: 0.05em;
      }
    `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "980px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "40px",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#8b7bb8",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 8px #a78bfa",
            }}
          />
          Mentor Archive — Access Terminal
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(167,139,250,0.2)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            padding: "40px",
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: "4px",
            background: "rgba(15, 11, 30, 0.25)",
            backdropFilter: "blur(2px)",
          }}
        >
          {(["top left", "top right", "bottom left", "bottom right"] as const).map(
            (pos) => {
              const [v, h] = pos.split(" ") as ["top" | "bottom", "left" | "right"];
              return (
                <div
                  key={pos}
                  style={{
                    position: "absolute",
                    [v]: "-1px",
                    [h]: "-1px",
                    width: "18px",
                    height: "18px",
                    borderTop: v === "top" ? "2px solid #a78bfa" : "none",
                    borderBottom: v === "bottom" ? "2px solid #a78bfa" : "none",
                    borderLeft: h === "left" ? "2px solid #a78bfa" : "none",
                    borderRight: h === "right" ? "2px solid #a78bfa" : "none",
                    opacity: 0.6,
                  }}
                />
              );
            },
          )}

          <div className="backroom-columns">
            {mentor && <MentorPanel mentor={mentor} />}

            <HintBoard
              hints={hints}
              adding={adding}
              newHint={newHint}
              newLevel={newLevel}
              setAdding={setAdding}
              setNewHint={setNewHint}
              setNewLevel={setNewLevel}
              addHint={addHint}
              deleteHint={deleteHint}
              editHint={editHint}
            />
          </div>
        </div>
      </div>
    </div>
  );
}