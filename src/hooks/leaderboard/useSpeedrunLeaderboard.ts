import { useEffect, useState } from "react";
import type { SpeedrunEntry, Difficulty, GameKey } from "@/src/lib/leaderboard/types";

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
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ game, limit: String(limit) });
    if (difficulty) params.set("difficulty", difficulty);

    fetch(`${endpoint}?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: SpeedrunEntry[]) => {
        if (!cancelled) setEntries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, game, limit, difficulty]);

  return { entries, loading, error };
}