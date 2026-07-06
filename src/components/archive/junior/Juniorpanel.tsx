"use client";

import { useState } from "react";
import { FaUser, FaPencilAlt, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/auth";
// Adjust this import path if your mentor domain type lives elsewhere.
import { MenteeUser } from "@/src/core/domain/auth";
import ProfileModal from "@/src/components/profile/ProfileModal";

function MentorCard({
  senior,
}: {
  senior: { studentId: string; nickname: string } | null;
}) {
  if (!senior) {
    return (
      <div
        style={{
          position: "relative",
          padding: "16px 18px 16px 20px",
          backgroundColor: "rgba(100, 40, 30, 0.16)",
          border: "1px solid rgba(255, 100, 74, 0.2)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "3px",
            background: "#ff644a",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ff644a",
            }}
          />
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
            พี่รหัสของคุณ
          </p>
        </div>
        {
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 600,
              color: "#e8a090",
              display: "block",
              marginLeft: "14px",
            }}
          >
            ยังไม่ได้รับการจับคู่กับพี่รหัส
          </span>
        }
      </div>
    );
  }

  const firstTwo =
    senior.studentId.length >= 2 ? senior.studentId.slice(0, 2) : "";
  const rest =
    senior.studentId.length >= 2 ? senior.studentId.slice(2) : senior.studentId;

  return (
    <div
      style={{
        position: "relative",
        padding: "16px 18px 16px 20px",
        backgroundColor: "rgba(139, 92, 246, 0.07)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "3px",
          background: "linear-gradient(180deg, #c4b5fd, #8b5cf6)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#a78bfa",
            boxShadow: "0 0 6px #a78bfa",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#8b7bb8",
            fontFamily: "monospace",
          }}
        >
          พี่รหัสของคุณ
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginLeft: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            padding: "5px 10px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              color: "#c4b5fd",
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
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {firstTwo && <span style={{ color: "#c4b5fd" }}>{firstTwo}</span>}
            <span style={{ color: "#cabdf0" }}>{rest}</span>
          </span>
        </div>

        {senior.nickname && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              padding: "5px 10px",
              border: "1px solid rgba(196, 181, 253, 0.25)",
              backgroundColor: "rgba(196, 181, 253, 0.06)",
              borderRadius: "4px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                color: "#a996d9",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              NAME
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#e9e0ff",
                fontFamily: "'Share Tech Mono', monospace",
                lineHeight: 1,
              }}
            >
              {senior.nickname}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export interface JuniorPanelProps {
  junior: MenteeUser;
}

export default function JuniorPanel({ junior }: JuniorPanelProps) {
  const router = useRouter();
  const { logout } = useUserStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const firstTwo =
    junior.studentId.length >= 2 ? junior.studentId.slice(0, 2) : "";
  const rest =
    junior.studentId.length >= 2 ? junior.studentId.slice(2) : junior.studentId;

  return (
    <div
      className="backroom-col-left"
      style={{
        position: "relative",
        border: "1px solid rgba(167,139,250,0.22)",
        borderRadius: "6px",
        backgroundColor: "rgba(23, 17, 47, 0.55)",
        padding: "32px 28px",
        boxShadow: "inset 0 0 40px rgba(167,139,250,0.05)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Header — matches HintBoard's "■ LABEL" convention */}
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
        ■ JUNIOR PANEL
      </p>

      {/* Avatar + name + ID */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "rgba(139, 92, 246, 0.14)",
            border: "1px solid rgba(139, 92, 246, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 14px rgba(139,92,246,0.15)",
          }}
        >
          <FaUser size={18} style={{ color: "#c4b5fd" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6b5b95",
              fontFamily: "monospace",
            }}
          >
            Logged in as
          </p>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#c4b5fd",
              margin: 0,
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.03em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {junior.nickname || "ไม่ระบุชื่อ"}
          </h1>

          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: "5px",
              marginTop: "5px",
              padding: "2px 8px",
              border: "1px solid rgba(212, 92, 42, 0.3)",
              backgroundColor: "rgba(212, 92, 42, 0.08)",
              borderRadius: "3px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                color: "#e08a5a",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              ID
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {firstTwo && <span style={{ color: "#e08a5a" }}>{firstTwo}</span>}
              <span style={{ color: "#d8ccf0" }}>{rest}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
        <button
          onClick={() => setProfileOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            flex: 1,
            background: "rgba(139, 92, 246, 0.14)",
            border: "1px solid rgba(139,92,246,0.4)",
            borderRadius: "2px",
            color: "#c4b5fd",
            fontSize: "11px",
            fontFamily: "monospace",
            padding: "6px 8px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.14)";
          }}
        >
          <FaPencilAlt size={10} /> EDIT
        </button>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            flex: 1,
            background: "rgba(219, 39, 119, 0.1)",
            border: "1px solid rgba(219,39,119,0.32)",
            borderRadius: "2px",
            color: "#f0abc8",
            fontSize: "11px",
            fontFamily: "monospace",
            padding: "6px 8px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(219, 39, 119, 0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(219, 39, 119, 0.1)";
          }}
        >
          <FaSignOutAlt size={10} /> LOGOUT
        </button>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(167,139,250,0.25)",
          margin: "20px 0 16px",
        }}
      />

      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#8b7bb8",
          fontFamily: "monospace",
          margin: "0 0 12px",
        }}
      >
        [ MENTOR STATUS ]
      </p>
      <MentorCard senior={junior.mentor} />

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  );
}
