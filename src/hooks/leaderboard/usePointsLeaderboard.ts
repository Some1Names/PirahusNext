import { useEffect, useState } from "react";
import { PointsEntry } from "@/src/lib/leaderboard/types";
import { leaderboardService } from "@/src/clients/container";
import { ILeaderboardEntry } from "@/src/core/domain/leaderboard";

export function usePointsLeaderboard(endpoint: string, limit: number) {
  const [entries, setEntries] = useState<PointsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const data = await leaderboardService.getTopScores(limit);
        if (cancelled) return;

        const combined = [
          ...data.mentors.map(
            (m: ILeaderboardEntry) => ({
              userId: m.id,
              username: `[Mentor] ${m.nickname || m.studentId}`,
              points: m.point,
            }),
          ),
          ...data.mentees.map(
            (m: ILeaderboardEntry) => ({
              userId: m.id,
              username: `[Mentee] ${m.nickname || m.studentId}`,
              points: m.point,
            }),
          ),
        ].filter((entry) => entry.points > 0);

        combined.sort((a, b) => b.points - a.points);

        const ranked: PointsEntry[] = combined
          .slice(0, limit)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1,
          }));

        setEntries(ranked);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { entries, loading, error };
}
