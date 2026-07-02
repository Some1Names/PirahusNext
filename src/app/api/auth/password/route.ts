import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getCurrentUser } from "@/src/lib/get-current-user";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import bcrypt from "bcryptjs";
import { setupPasswordSchema } from "@/src/core/schema/auth";

export async function POST(req: NextRequest) {
  try {
    const userSession = await getCurrentUser();
    const body = await req.json();
    const { password } = setupPasswordSchema.parse(body);

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (userSession.role === "admin" || userSession.role === "mentor") {
      await prisma.mentor.update({
        where: {
          studentId: userSession.studentId,
        },
        data: {
          password: hashedPassword,
        },
      });
    } else if (userSession.role === "mentee") {
      await prisma.mentee.update({
        where: {
          studentId: userSession.studentId,
        },
        data: {
          password: hashedPassword,
        },
      });
    }

    return successResponse({
      message: "Password setup successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
