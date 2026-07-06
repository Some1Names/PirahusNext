import { useState, useEffect } from "react";
import { minigameService } from "@/src/clients/container";
import { IMinigameRecordResponse } from "@/src/core/domain/minigame";
import { SpeedrunEntry } from "@/src/lib/leaderboard/types";

import type { Difficulty, GameKey } from "@/src/lib/leaderboard/types";

export function useSpeedrunLeaderboard(
  endpoint: string,
  game: GameKey,
  limit: number,
  difficulty?: Difficulty
) {
  const [entries, setEntries] = useState<SpeedrunEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fullGameName = difficulty ? `${game}-${difficulty}` : game;
    
    if (!fullGameName) {
      setEntries([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const result = await minigameService.getLeaderboard(fullGameName, limit);
        if (cancelled) return;
        setEntries(result.map((r: IMinigameRecordResponse) => ({
          ...r,
          timeMs: r.timeTaken * 1000
        })));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load speedruns");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [game, difficulty, limit]);

  return { entries, loading, error };
}