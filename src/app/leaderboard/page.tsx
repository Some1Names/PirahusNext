"use client";

import { useEffect, useState } from "react";
import { usePointsLeaderboard } from "@/src/hooks/leaderboard/usePointsLeaderboard";
import { useSpeedrunLeaderboard } from "@/src/hooks/leaderboard/useSpeedrunLeaderboard";
import type { Difficulty, GameKey, LeaderboardProps } from "@/src/lib/leaderboard/types";
import { GAMES, HAS_DIFFICULTY, DIFFICULTIES, formatTime } from "@/src/lib/leaderboard/types";
import { StatusLine } from "@/src/lib/leaderboard/StatusLine";
import { RankRow } from "@/src/lib/leaderboard/RankRow";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function Leaderboard({
  pointsEndpoint = "/api/leaderboard/points",
  speedrunEndpoint = "/api/leaderboard/speedrun",
  currentUserId,
}: LeaderboardProps) {
  const [activeGame, setActiveGame] = useState<GameKey>("dungeon");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("easy");
  const activeGameMeta = GAMES.find((g) => g.key === activeGame)!;
  const gameHasDifficulty = !!HAS_DIFFICULTY[activeGame];

  const points = usePointsLeaderboard(pointsEndpoint, 10);
  const speedrun = useSpeedrunLeaderboard(
    speedrunEndpoint,
    activeGame,
    5,
    gameHasDifficulty ? activeDifficulty : undefined
  );

  const panelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    background: "#0a0e14",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "18px 16px",
    position: "relative",
    overflow: "hidden",
  };

  const headerStyle = (color: string): React.CSSProperties => ({
    fontFamily: "'Pixelify Sans', sans-serif",
    fontSize: 19,
    letterSpacing: 2,
    color,
    textShadow: `0 0 12px ${color}80`,
    marginBottom: 4,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460, width: "100%" }}>
      {/* ── TOP 10 PLAYERS BY POINTS ── */}
      <div style={{ ...panelStyle, boxShadow: "0 0 24px #22d3ee1a inset" }}>
        <div style={headerStyle("#22d3ee")}>TOP 10 PLAYERS</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 14, letterSpacing: 1 }}>
          {"//"} RANKED BY TOTAL POINTS
        </div>

        <StatusLine loading={points.loading} error={points.error} empty={!points.loading && !points.error && points.entries.length === 0} />

        {!points.loading && !points.error && points.entries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
      </div>

      {/* ── TOP 5 SPEEDRUN PER GAME ── */}
      <div style={{ ...panelStyle, boxShadow: `0 0 24px ${activeGameMeta.color}1a inset` }}>
        <div style={headerStyle(activeGameMeta.color)}>TOP 5 SPEEDRUN</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 14, letterSpacing: 1 }}>
          {"//"} FASTEST CLEAR TIME{gameHasDifficulty ? ` — ${activeDifficulty.toUpperCase()}` : ""}
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
                  fontFamily: "'Share Tech Mono', monospace",
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
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 0.5,
                    border: `1px solid ${active ? activeGameMeta.color : "#1e293b"}`,
                    borderRadius: 4,
                    background: active ? `${activeGameMeta.color}14` : "transparent",
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
          empty={!speedrun.loading && !speedrun.error && speedrun.entries.length === 0}
        />

        {!speedrun.loading && !speedrun.error && speedrun.entries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {speedrun.entries.map((entry) => (
              <RankRow
                key={entry.userId}
                rank={entry.rank}
                username={entry.username}
                value={formatTime(entry.timeMs)}
                meta={
                  activeGame === "trace" && entry.correctAnswers != null
                    ? `${entry.correctAnswers}${entry.totalAnswers != null ? `/${entry.totalAnswers}` : ""} correct`
                    : undefined
                }
                isMe={entry.userId === currentUserId}
                accentColor={activeGameMeta.color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}