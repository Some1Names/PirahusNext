import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { IUpdateHintItem } from "@/src/core/domain/mentor";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { hints }: { hints: IUpdateHintItem[] } = await req.json();

    await Promise.all(
      hints.map((hint) =>
        prisma.hint.update({
          where: {
            id: hint.id,
          },
          data: {
            content: hint.content,
          },
        }),
      ),
    );

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
