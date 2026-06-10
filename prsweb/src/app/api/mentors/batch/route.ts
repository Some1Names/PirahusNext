import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";

export async function POST(req: Request) {
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

    return successResponse(mentors);
  } catch (error) {
    return handleError(error);
  }
}
