import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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

    return successResponse(mentor, 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        hints: true,
        mentee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(mentors);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
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

    return successResponse(mentor);
  } catch (error) {
    return handleError(error);
  }
}
