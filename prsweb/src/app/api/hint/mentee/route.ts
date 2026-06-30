import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { HINT_PRICING } from "@/src/core/config/hint-pricing";
import { NotFoundError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";

export async function GET() {
  try {
    const session = await requireAuth(["mentee"]);

    const mentee = await prisma.mentee.findUnique({
      where: { studentId: session.studentId },
      include: {
        mentor: {
          include: { hints: true },
        },
      },
    });

    if (!mentee) throw new NotFoundError("Mentee not found");

    const hints = mentee.mentor.hints.map((hint) => {
      const isUnlocked = mentee.unlockedHintLevels.includes(hint.level);
      return {
        id: hint.id,
        level: hint.level,
        cost: HINT_PRICING[hint.level] || 0,
        isUnlocked,
        content: isUnlocked ? hint.content : null,
      };
    });

    hints.sort((a, b) => a.level - b.level);

    return successResponse(hints);
  } catch (error) {
    return handleError(error);
  }
}
