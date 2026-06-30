import { prisma } from "@/src/lib/prisma";
import { handleError } from "@/src/lib/handle-error";
import { successResponse } from "@/src/lib/api-response";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { z } from "zod";
import { createMenteeSchema } from "@/src/core/schema/mentee";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = z.array(createMenteeSchema).parse(body);

    await prisma.mentee.createMany({
      data: validatedData,
      skipDuplicates: true,
    });

    const mentees = await prisma.mentee.findMany({
      include: {
        mentor: true,
      },
    });

    return successResponse(mentees, 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}
