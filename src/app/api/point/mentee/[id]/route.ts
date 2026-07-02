import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NotFoundError, ForbiddenError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { addMenteePointSchema } from "@/src/core/schema/point";
import { requireAuth } from "@/src/lib/get-current-user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
    const { id } = await params;
    const mentee = await prisma.mentee.findUnique({
      where: { id },
    });

    if (!mentee) {
      const menteeByStudentId = await prisma.mentee.findUnique({
        where: { studentId: id },
      });
      if (!menteeByStudentId) throw new NotFoundError("Mentee not found");
      return successResponse(menteeByStudentId.point);
    }

    return successResponse(mentee.point);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth(["admin", "mentor", "mentee"]);
    const { id } = await params;
    const body = await req.json();

    const validatedData = addMenteePointSchema.parse(body);

    let mentee = await prisma.mentee.findUnique({ where: { id } });

    if (!mentee) {
      mentee = await prisma.mentee.findUnique({ where: { studentId: id } });
      if (!mentee) throw new NotFoundError("Mentee not found");
    }

    if (session.role === "mentee" && mentee.studentId !== session.studentId) {
      throw new ForbiddenError("You can only modify your own points");
    }

    const updatedMentee = await prisma.mentee.update({
      where: { id: mentee.id },
      data: {
        point: {
          increment: validatedData.point,
        },
      },
    });

    return successResponse(updatedMentee.point);
  } catch (error) {
    return handleError(error);
  }
}
