import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { hints, mentorId }: { hints: string[]; mentorId: string } =
      await req.json();

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
