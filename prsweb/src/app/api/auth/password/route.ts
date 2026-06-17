import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getCurrentUser } from "@/src/lib/get-current-user";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { ValidationError } from "@/src/core/error/error";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const userSession = await getCurrentUser();
    const { password } = await req.json();

    if (!password || password.length < 4) {
      throw new ValidationError("Password must be at least 4 characters long");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (userSession.type === "mentor") {
      await prisma.mentor.update({
        where: {
          studentId: userSession.studentId,
        },
        data: {
          password: hashedPassword,
        },
      });
    } else if (userSession.type === "mentee") {
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
