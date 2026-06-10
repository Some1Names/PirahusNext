import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  return NextResponse.json(mentor);
}
