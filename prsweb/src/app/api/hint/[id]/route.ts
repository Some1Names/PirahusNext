import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { prisma } from "@/src/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { content } = await req.json();
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
    const { id } = await params;
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
    const { id } = await params;
    const res = await prisma.hint.delete({
      where: { id },
    });
    return successResponse(res);
  } catch (error) {
    return handleError(error);
  }
}
