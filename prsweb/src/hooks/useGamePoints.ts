import { useState, useCallback, useRef } from "react";
import {
  mentorService,
  menteeService,
  authService,
} from "@/src/infra/container";
import { useUserStore } from "@/src/store/auth";

type GameName = "dungeon" | "sudoku" | "sort" | "trace";

interface AwardResult {
  success: boolean;
  totalPoints?: number;
  error?: string;
}

export function useGamePoints(game: GameName) {
  const [submitting, setSubmitting] = useState(false);
  const getUser = useUserStore((s) => s.getUser);
  const [error, setError] = useState<string | null>(null);
  const [popupPoints, setPopupPoints] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const isSubmittingRef = useRef(false);

  const awardPoints = useCallback(
    async (
      points: number,
      meta?: Record<string, unknown>,
    ): Promise<AwardResult> => {
      if (points <= 0) return { success: false, error: "No points to award" };
      if (isSubmittingRef.current) return { success: false, error: "Already submitting" };
      isSubmittingRef.current = true;

      setPopupPoints(points);
      setShowPopup(true);

      setSubmitting(true);
      setError(null);

      try {
        const user = await authService.me();

        if (!user) throw new Error("Not logged in");

        let totalPoints = 0;

        if (user.type === "mentor") {
          totalPoints = await mentorService.addMentorPoint(user.id, points);
        } else if (user.type === "mentee") {
          totalPoints = await menteeService.addMenteePoint(user.id, points);
        }

        setPopupPoints(points);
        setShowPopup(true);
        
        await getUser();

        return { success: true, totalPoints };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return { success: false, error: message };
      } finally {
        setSubmitting(false);
        isSubmittingRef.current = false;
      }
    },
    [game],
  );

  const closePopup = useCallback(() => setShowPopup(false), []);

  return { awardPoints, submitting, error, popupPoints, showPopup, closePopup };
}
