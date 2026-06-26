import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { ForbiddenError } from "@/src/core/error/error";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["admin", "mentor"]);
    const { hints, mentorId }: { hints: string[]; mentorId: string } =
      await req.json();

    if (session.role === "mentor") {
      const dbMentor = await prisma.mentor.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentor || dbMentor.id !== mentorId) {
        throw new ForbiddenError("You cannot modify other mentors' hints");
      }
    }

    const res = await prisma.hint.createMany({
      data: hints.map((content) => ({
        content,
        mentorId,
      })),
    });

    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}
