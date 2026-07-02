import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { ForbiddenError } from "@/src/core/error/error";
import { addHintsSchema } from "@/src/core/schema/hint";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["admin", "mentor"]);
    const body = await req.json();
    const { hints, mentorId } = addHintsSchema.parse(body);

    if (session.role === "mentor") {
      const dbMentor = await prisma.mentor.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentor || dbMentor.id !== mentorId) {
        throw new ForbiddenError("You cannot modify other mentors' hints");
      }
    }

    const res = await prisma.hint.createMany({
      data: hints.map((h) => ({
        content: h.content,
        level: h.level,
        mentorId,
      })),
    });

    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}
