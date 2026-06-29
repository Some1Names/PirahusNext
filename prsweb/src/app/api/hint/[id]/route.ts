import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/get-current-user";
import { ForbiddenError } from "@/src/core/error/error";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor"]);
    const { id } = await params;
    const { content } = await req.json();

    if (session.role === "mentor") {
      const hint = await prisma.hint.findUnique({
        where: { id },
        include: { mentor: true },
      });
      if (!hint || hint.mentor.studentId !== session.studentId) {
        throw new ForbiddenError("You cannot update other mentors' hints");
      }
    }

    const res = await prisma.hint.update({
      where: { id },
      data: { content },
    });
    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor", "mentee"]);
    const { id } = await params; // mentorId

    if (session.role === "mentor") {
      const dbMentor = await prisma.mentor.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentor || dbMentor.id !== id) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    } else if (session.role === "mentee") {
      const dbMentee = await prisma.mentee.findUnique({
        where: { studentId: session.studentId },
      });
      if (!dbMentee || dbMentee.mentorId !== id) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    }

    const res = await prisma.hint.findMany({
      where: { mentorId: id },
    });
    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor"]);
    const { id } = await params;

    if (session.role === "mentor") {
      const hint = await prisma.hint.findUnique({
        where: { id },
        include: { mentor: true },
      });
      if (!hint || hint.mentor.studentId !== session.studentId) {
        throw new ForbiddenError("You cannot delete other mentors' hints");
      }
    }

    const res = await prisma.hint.delete({
      where: { id },
    });
    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}
