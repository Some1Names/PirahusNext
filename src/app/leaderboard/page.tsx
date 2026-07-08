"use client";

import { useState } from "react";
import Link from "next/link";
import { usePointsLeaderboard } from "@/src/hooks/leaderboard/usePointsLeaderboard";
import { useSpeedrunLeaderboard } from "@/src/hooks/leaderboard/useSpeedrunLeaderboard";
import type {
  Difficulty,
  GameKey,
  LeaderboardProps,
} from "@/src/lib/leaderboard/types";
import {
  GAMES,
  HAS_DIFFICULTY,
  DIFFICULTIES,
  formatTime,
} from "@/src/lib/leaderboard/types";
import { StatusLine } from "@/src/lib/leaderboard/StatusLine";
import { RankRow } from "@/src/lib/leaderboard/RankRow";
import Dither from "@/src/components/reactbits/background/Dither";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

type Tab = "points" | "speedrun";

export default function Leaderboard({
  pointsEndpoint = "/api/leaderboard/points",
  speedrunEndpoint = "/api/leaderboard/speedrun",
  currentUserId,
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("points");
  const [activeGame, setActiveGame] = useState<GameKey>("dungeon");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("easy");
  const activeGameMeta = GAMES.find((g) => g.key === activeGame)!;
  const gameHasDifficulty = !!HAS_DIFFICULTY[activeGame];

  const points = usePointsLeaderboard(pointsEndpoint, 10);
  const speedrun = useSpeedrunLeaderboard(
    speedrunEndpoint,
    activeGame,
    5,
    gameHasDifficulty ? activeDifficulty : undefined,
  );

  const accentColor = activeTab === "points" ? "#22d3ee" : activeGameMeta.color;

  const panelStyle: React.CSSProperties = {
    fontFamily: "Pixelify Sans",
    background: "#040408",
    border: "1px solid #1e293b",
    padding: "50px 40px",
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 0 24px ${accentColor}1a inset`,
    maxWidth: 560,
    width: "90%",
    height: "85%",
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Pixelify Sans', sans-serif",
    fontSize: 22,
    letterSpacing: 2,
    color: "#e2e8f0",
    textShadow: "0 0 12px #e2e8f080",
    marginBottom: 14,
    textAlign: "center",
  };

  const buttonStyle = {
    color: "#6b7280",
    border: "1px solid #374151",
    fontSize: "0.875rem",
    padding: "0.25rem 0.75rem",
    width: "fit-content",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "0.25rem",
    fontFamily: "Pixelify Sans",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Dither
          waveColor={[
            0.19215686274509805, 0.23921568627450981, 0.30980392156862746,
          ]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.03}
        />
      </div>

      <div style={{ ...panelStyle, position: "relative", zIndex: 1 }}>
        <div style={titleStyle}>LEADERBOARD</div>

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
            href="/minigames"
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d1d5db")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            ← BACK
          </Link>
        </div>

        {/* ── main tabs: points / speedrun ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {(["points", "speedrun"] as Tab[]).map((tab) => {
            const active = tab === activeTab;
            const tabColor =
              tab === "points" ? "#22d3ee" : activeGameMeta.color;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  fontFamily: "Pixelify Sans",
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  border: `1px solid ${active ? tabColor : "#1e293b"}`,
                  borderRadius: 4,
                  background: active ? `${tabColor}1f` : "transparent",
                  color: active ? tabColor : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab === "points" ? "Points" : "Speedrun"}
              </button>
            );
          })}
        </div>

        <div style={{ borderBottom: "1px solid #1e293b", marginBottom: 14 }} />

        <style>{`
          .lb-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .lb-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .lb-scroll::-webkit-scrollbar-thumb {
            background: ${accentColor}55;
            border-radius: 3px;
          }
          .lb-scroll::-webkit-scrollbar-thumb:hover {
            background: ${accentColor}99;
          }
          .lb-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${accentColor}55 transparent;
          }
        `}</style>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {activeTab === "points" ? (
            <>
              <div
                style={{
                  fontFamily: "Pixelify Sans",
                  fontSize: 11,
                  color: "#64748b",
                  marginBottom: 14,
                  letterSpacing: 1,
                }}
              ></div>

              <StatusLine
                loading={points.loading}
                error={points.error}
                empty={
                  !points.loading &&
                  !points.error &&
                  points.entries.length === 0
                }
              />

              {!points.loading &&
                !points.error &&
                points.entries.length > 0 && (
                  <div
                    className="lb-scroll"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      paddingRight: 6,
                    }}
                  >
                    {points.entries.map((entry) => (
                      <RankRow
                        key={entry.userId}
                        rank={entry.rank}
                        username={entry.username}
                        value={entry.points.toLocaleString()}
                        valueSuffix="pts"
                        isMe={entry.userId === currentUserId}
                        accentColor="#22d3ee"
                      />
                    ))}
                  </div>
                )}
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  marginBottom: 14,
                  letterSpacing: 1,
                }}
              >
                {"//"} FASTEST CLEAR TIME
                {gameHasDifficulty
                  ? ` — ${activeDifficulty.toUpperCase()}`
                  : ""}
              </div>

              {/* game tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {GAMES.map((g) => {
                  const active = g.key === activeGame;
                  return (
                    <button
                      key={g.key}
                      onClick={() => setActiveGame(g.key)}
                      style={{
                        flex: 1,
                        padding: "7px 4px",
                        fontFamily: "Pixelify Sans",
                        fontSize: 11,
                        letterSpacing: 0.5,
                        border: `1px solid ${active ? g.color : "#1e293b"}`,
                        borderRadius: 4,
                        background: active ? `${g.color}1f` : "transparent",
                        color: active ? g.color : "#64748b",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>

              {/* difficulty selector — sudoku & sort only */}
              {gameHasDifficulty && (
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {DIFFICULTIES.map((d) => {
                    const active = d.key === activeDifficulty;
                    return (
                      <button
                        key={d.key}
                        onClick={() => setActiveDifficulty(d.key)}
                        style={{
                          flex: 1,
                          padding: "5px 4px",
                          fontFamily: "Pixelify Sans",
                          fontSize: 10,
                          letterSpacing: 0.5,
                          border: `1px solid ${active ? activeGameMeta.color : "#1e293b"}`,
                          borderRadius: 4,
                          background: active
                            ? `${activeGameMeta.color}14`
                            : "transparent",
                          color: active ? activeGameMeta.color : "#475569",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <StatusLine
                loading={speedrun.loading}
                error={speedrun.error}
                empty={
                  !speedrun.loading &&
                  !speedrun.error &&
                  speedrun.entries.length === 0
                }
              />

              {!speedrun.loading &&
                !speedrun.error &&
                speedrun.entries.length > 0 && (
                  <div
                    className="lb-scroll"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      paddingRight: 6,
                    }}
                  >
                    {speedrun.entries.map((entry) => (
                      <RankRow
                        key={entry.userId}
                        rank={entry.rank}
                        username={entry.username}
                        value={
                          activeGame === "trace" && entry.score != null
                            ? `${entry.score.toFixed(2)} pts`
                            : formatTime(entry.timeMs)
                        }
                        meta={
                          activeGame === "trace" && entry.correctAnswers != null
                            ? `${entry.correctAnswers}${entry.totalAnswers != null ? `/${entry.totalAnswers}` : ""} correct · ⏱ ${formatTime(entry.timeMs)}`
                            : undefined
                        }
                        isMe={entry.userId === currentUserId}
                        accentColor={activeGameMeta.color}
                      />
                    ))}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}