import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { z } from "zod";
import { createMentorSchema } from "@/src/core/schema/mentor";
import { sanitizeMentor } from "@/src/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = z.array(createMentorSchema).parse(body);

    await prisma.mentor.createMany({
      data: validatedData,
      skipDuplicates: true,
    });

    const mentors = await prisma.mentor.findMany({
      include: {
        hints: true,
        mentee: true,
      },
    });

    return successResponse(mentors.map(sanitizeMentor), 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}
