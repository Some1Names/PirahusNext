import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();

    const mentee = await prisma.mentee.create({
      data: {
        studentId: body.studentId,
        mentorId: body.mentorId,
        name: body.name,
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

export async function GET() {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
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
