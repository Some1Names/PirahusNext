import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const mentor = await prisma.mentor.findUnique({
    where: {
      id,
    },
    include: {
      hints: true,
      mentee: true,
    },
  });

  if (!mentor) {
    return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
  }

  return NextResponse.json(mentor);
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const mentor = await prisma.mentor.delete({
    where: {
      id,
    },
    include: {
      hints: true,
      mentee: true,
    },
  });

  return NextResponse.json(mentor);
}
