import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

  return NextResponse.json(mentors);
}
