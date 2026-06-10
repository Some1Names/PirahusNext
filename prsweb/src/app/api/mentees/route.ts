import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const mentee = await prisma.mentee.create({
      data: {
        studentId: body.studentId,
        mentorId: body.mentorId,
      },
      include: {
        mentor: {
          include: {
            hints: true,
          },
        },
      },
    });

    return successResponse(mentee, 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const mentee = await prisma.mentee.update({
      where: {
        id: body.id,
      },
      data: {
        studentId: body.studentId,
      },
      include: {
        mentor: true,
      },
    });

    return successResponse(mentee);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const mentees = await prisma.mentee.findMany({
      include: {
        mentor: {
          include: {
            hints: true,
          },
        },
      },
    });

    return successResponse(mentees);
  } catch (error) {
    return handleError(error);
  }
}
