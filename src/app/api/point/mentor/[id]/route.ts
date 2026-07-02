import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NotFoundError, ForbiddenError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { addMentorPointSchema } from "@/src/core/schema/point";
import { requireAuth } from "@/src/lib/get-current-user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
    const { id } = await params;
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      const mentorByStudentId = await prisma.mentor.findUnique({
        where: { studentId: id },
      });
      if (!mentorByStudentId) throw new NotFoundError("Mentor not found");
      return successResponse(mentorByStudentId.point);
    }

    return successResponse(mentor.point);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor"]);
    const { id } = await params;
    const body = await req.json();

    const validatedData = addMentorPointSchema.parse(body);

    let mentor = await prisma.mentor.findUnique({ where: { id } });

    if (!mentor) {
      mentor = await prisma.mentor.findUnique({ where: { studentId: id } });
      if (!mentor) throw new NotFoundError("Mentor not found");
    }

    if (session.role === "mentor" && mentor.studentId !== session.studentId) {
      throw new ForbiddenError("You can only modify your own points");
    }

    const updatedMentor = await prisma.mentor.update({
      where: { id: mentor.id },
      data: {
        point: {
          increment: validatedData.point,
        },
      },
    });

    return successResponse(updatedMentor.point);
  } catch (error) {
    return handleError(error);
  }
}
