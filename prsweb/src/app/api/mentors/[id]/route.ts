import { prisma } from "@/src/lib/prisma";
import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin", "mentor"]);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin"]);

    const { id } = await params;
    const body = await req.json();

    const mentor = await prisma.mentor.update({
      where: { id },
      data: { isAdmin: body.isAdmin },
      include: { hints: true, mentee: true },
    });

    return successResponse(mentor);
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
