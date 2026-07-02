import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NextRequest } from "next/server";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { ForbiddenError } from "@/src/core/error/error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor", "mentee"]);
    const { mentorId } = await params;

    if (session.role === "mentor") {
      const dbMentor = await prisma.mentor.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentor || dbMentor.id !== mentorId) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    } else if (session.role === "mentee") {
      const dbMentee = await prisma.mentee.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentee || dbMentee.mentorId !== mentorId) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    }

    const hints = await prisma.hint.findMany({
      where: { mentorId },
      orderBy: {
        level: "asc",
      },
    });
    return successResponse(hints);
  } catch (error) {
    return handleError(error);
  }
}
