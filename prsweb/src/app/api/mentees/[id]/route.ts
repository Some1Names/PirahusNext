import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { sanitizeMentee } from "@/src/lib/sanitize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin", "mentor"]);
    const { id } = await params;

    const mentee = await prisma.mentee.findUnique({
      where: {
        id,
      },
      include: {
        mentor: {
          include: {
            hints: true,
          },
        },
      },
    });

    if (!mentee) {
      return handleError({
        status: 404,
        message: "Mentee not found",
      });
    }

    return successResponse(sanitizeMentee(mentee));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin"]);
    const { id } = await params;

    const mentee = await prisma.mentee.delete({
      where: {
        id,
      },
    });

    return successResponse(sanitizeMentee(mentee));
  } catch (error) {
    return handleError(error);
  }
}
