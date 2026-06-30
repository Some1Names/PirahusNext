// src/lib/game/dungeon/useDungeonPoints.ts
import { useEffect, useRef } from "react";
import { GameState } from "./gameTypes";
import { useGamePoints } from "@/src/hooks/useGamePoints";
import { calculateDungeonPts } from "@/src/lib/game/scoring";

export function useDungeonPoints(state: GameState) {
  const { awardPoints, popupPoints, showPopup, closePopup } = useGamePoints("dungeon");
  const awarded = useRef(false);

  useEffect(() => {
    if (state.phase === "escaped" && !awarded.current) {
      awarded.current = true;
      const pts = calculateDungeonPts(state.collectedParts.length, state.traps.length);
      awardPoints(pts, { fragments: state.collectedParts.length });
    }
    if (state.phase === "playing") {
      awarded.current = false; // reset so a new run can award again
    }
  }, [state.phase, state.collectedParts.length, state.traps.length, awardPoints]);

  return { popupPoints, showPopup, closePopup };
}