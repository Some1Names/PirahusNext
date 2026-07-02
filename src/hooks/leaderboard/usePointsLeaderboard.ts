import { useEffect, useState } from "react";
import { PointsEntry } from "@/src/lib/leaderboard/types";

export function usePointsLeaderboard(endpoint: string, limit: number) {
  const [entries, setEntries] = useState<PointsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${endpoint}?limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: PointsEntry[]) => {
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
  }, [endpoint, limit]);

  return { entries, loading, error };
}