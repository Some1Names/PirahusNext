import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NextRequest } from "next/server";
import { handleError } from "@/src/lib/handle-error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> },
) {
  try {
    const { mentorId } = await params;
    const hints = await prisma.hint.findMany({
      where: { mentorId },
    });
    return successResponse(hints);
  } catch (error) {
    return handleError(error);
  }
}
