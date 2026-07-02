"use client";

import { useState, useEffect } from "react";
import { GameState } from "@/src/lib/game/dungeon/gameTypes";
import { posKey, MAP_W, MAP_H } from "@/src/lib/game/dungeon/mapGen";

interface Props {
  state: GameState;
  debug?: boolean;
}

function getCellColor(
  isPlayer: boolean,
  isFloor: boolean,
  debug: boolean,
  isExit: boolean,
  isFragment: boolean,
  isTrap: boolean,
): string {
  if (isPlayer) return "#4ade80";
  if (!isFloor) return "#374151";
  if (debug && isExit) return "#fde047";
  if (debug && isFragment) return "#60a5fa";
  if (debug && isTrap) return "#ef4444";
  return "#4b5563";
}

export default function MapDisplay({ state, debug = false }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !state) return null;

  const rows = [];

  for (let y = 0; y < MAP_H; y++) {
    const cells = [];
    for (let x = 0; x < MAP_W; x++) {
      const pk = posKey(x, y);
      const isPlayer = x === state.playerX && y === state.playerY;
      const isExit = x === state.exit.x && y === state.exit.y;
      const isTrap = state.traps.includes(pk);
      const isFragment = !!state.finalKeyPositions[pk];
      const isFloor = state.map[y][x] === ".";

      const char = isPlayer
        ? "P"
        : !isFloor
          ? "█"
          : debug && isExit
            ? "E"
            : debug && isFragment
              ? "F"
              : debug && isTrap
                ? "T"
                : "·";

      const color = getCellColor(
        isPlayer,
        isFloor,
        debug,
        isExit,
        isFragment,
        isTrap,
      );

      cells.push(
        <span
          key={x}
          style={{
            color,
            userSelect: "none",
            display: "inline-block",
            textAlign: "center",
            width: "0.6rem",
            lineHeight: "1rem",
          }}
        >
          {char}
        </span>,
      );
    }

    rows.push(
      <div key={y} style={{ display: "flex" }}>
        {cells}
      </div>,
    );
  }

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "0.75rem",
        backgroundColor: "#030712",
        padding: "0.75rem",
        borderRadius: "0.25rem",
        border: "1px solid #374151",
        overflow: "auto",
      }}
    >
      {rows}
    </div>
  );
}
