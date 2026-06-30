import { useState, useCallback } from "react";

type GameName = "dungeon" | "sudoku" | "sort" | "trace";

interface AwardResult {
    success: boolean;
    totalPoints?: number;
    error?: string;
}

export function useGamePoints(game: GameName) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [popupPoints, setPopupPoints] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const awardPoints = useCallback(async (
        points: number,
        meta?: Record<string, unknown>
    ): Promise<AwardResult> => {
        if (points <= 0) return { success: false, error: "No points to award" };

        setPopupPoints(points);
        setShowPopup(true);

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/points", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points, game, meta }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Failed to award points");
            }

            const data = await res.json();

            // trigger popup
            setPopupPoints(points);
            setShowPopup(true);

            return { success: true, totalPoints: data.totalPoints };
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            return { success: false, error: message };
        } finally {
            setSubmitting(false);
        }
    }, [game]);

    const closePopup = useCallback(() => setShowPopup(false), []);

    return { awardPoints, submitting, error, popupPoints, showPopup, closePopup };
}