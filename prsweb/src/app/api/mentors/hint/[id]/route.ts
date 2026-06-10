import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const hint = await prisma.hint.findMany({
      where: { mentorId: id },
    });
    if (!hint) {
      return successResponse(null, 404);
    }
    return successResponse(hint);
  } catch (error) {
    return handleError(error);
  }
}
