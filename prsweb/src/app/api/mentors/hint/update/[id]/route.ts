import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const hints: string[] = await req.json();

    await prisma.$transaction([
      prisma.hint.deleteMany({
        where: {
          mentorId: id,
        },
      }),

      prisma.hint.createMany({
        data: hints.map((content) => ({
          content,
          mentorId: id,
        })),
      }),
    ]);

    const mentor = await prisma.mentor.findUnique({
      where: { id },
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
