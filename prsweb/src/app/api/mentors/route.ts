import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mentor = await prisma.mentor.create({
      data: {
        studentId: body.studentId,
      },
      include: {
        hints: true,
        mentee: true,
      },
    });

    return NextResponse.json(mentor);
  } catch (error) {
    console.error("Error creating mentor:", error);
    return NextResponse.json(
      { message: "Create mentor failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const mentors = await prisma.mentor.findMany({
    include: {
      hints: true,
      mentee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(mentors);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const mentor = await prisma.mentor.update({
    where: {
      id: body.id,
    },
    data: {
      studentId: body.studentId,
    },
    include: {
      hints: true,
      mentee: true,
    },
  });

  return NextResponse.json(mentor);
}
