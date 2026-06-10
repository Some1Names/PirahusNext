import { prisma } from "@/src/lib/prisma";
import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const mentor = await prisma.mentor.findUnique({
      where: {
        id,
      },
      include: {
        hints: true,
        mentee: true,
      },
    });

    if (!mentor) {
      return handleError({
        status: 404,
        message: "Mentor not found",
      });
    }

    return successResponse(mentor);
  } catch (error) {
    return handleError(error);
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const mentor = await prisma.mentor.delete({
      where: {
        id,
      },
      include: {
        hints: true,
        mentee: true,
      },
    });

    return successResponse(mentor);
  } catch (error) {
    return handleError(error);
  }
}
