import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { verifyToken } from "@/src/lib/jwt";
import { successResponse } from "@/src/lib/api-response";
import { HINT_PRICING } from "@/src/core/config/hint-pricing";
import { UnauthorizedError, NotFoundError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) throw new UnauthorizedError();
    const payload = verifyToken(token);
    if (payload.type !== "mentee") throw new UnauthorizedError();

    const mentee = await prisma.mentee.findUnique({
      where: { studentId: payload.studentId },
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
