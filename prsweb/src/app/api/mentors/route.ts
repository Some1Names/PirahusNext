import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { createMentorSchema, updateMentorSchema } from "@/src/core/schema/mentor";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = createMentorSchema.parse(body);

    const mentor = await prisma.mentor.create({
      data: {
        studentId: validatedData.studentId,
        name: validatedData.name,
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
    await requireAuth(["admin", "mentor"]);
    const mentors = await prisma.mentor.findMany({
      include: {
        hints: true,
        mentee: true,
      },
      orderBy: {
        studentId: "asc",
      },
    });

    return successResponse(mentors);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = updateMentorSchema.parse(body);

    const mentor = await prisma.mentor.update({
      where: {
        id: validatedData.id,
      },
      data: {
        studentId: validatedData.studentId,
        name: validatedData.name,
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
