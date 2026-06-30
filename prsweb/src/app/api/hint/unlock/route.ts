import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { HINT_PRICING } from "@/src/core/config/hint-pricing";
import { NotFoundError, AppError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { unlockHintSchema } from "@/src/core/schema/hint";
import { requireAuth } from "@/src/lib/get-current-user";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["mentee"]);

    const body = await req.json();
    const validatedData = unlockHintSchema.parse(body);
    const { level } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      const mentee = await tx.mentee.findUnique({
        where: { studentId: session.studentId },
        include: {
          mentor: {
            include: { hints: true },
          },
        },
      });

      if (!mentee) throw new NotFoundError("Mentee not found");

      if (mentee.unlockedHintLevels.includes(level)) {
        throw new AppError("Hint already unlocked", 400, "ALREADY_UNLOCKED");
      }

      const hint = mentee.mentor.hints.find((h) => h.level === level);
      if (!hint) {
        throw new NotFoundError("Hint not found for this level");
      }

      const cost = HINT_PRICING[level];
      if (typeof cost !== "number") {
        throw new AppError("Invalid hint pricing", 500, "INTERNAL_ERROR");
      }

      if (mentee.point < cost) {
        throw new AppError("Not enough points", 400, "INSUFFICIENT_POINTS");
      }

      const updatedMentee = await tx.mentee.update({
        where: { id: mentee.id },
        data: {
          point: { decrement: cost },
          unlockedHintLevels: { push: level },
        },
      });

      return {
        hint: {
          id: hint.id,
          level: hint.level,
          content: hint.content,
        },
        newPoint: updatedMentee.point,
      };
    });

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
