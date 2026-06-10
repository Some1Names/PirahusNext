import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await prisma.mentor.createMany({
      data: body,
      skipDuplicates: true,
    });

    const mentors = await prisma.mentor.findMany({
      include: {
        hints: true,
        mentee: true,
      },
    });

    return successResponse(mentors, 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}
