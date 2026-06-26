import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { verifyToken } from "@/src/lib/jwt";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return handleError({
        status: 401,
        message: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    if (payload.type === "mentor") {
      const mentor = await prisma.mentor.findUnique({
        where: {
          studentId: payload.studentId,
        },
        include: {
          hints: true,
          mentee: true,
        },
      });

      if (!mentor) {
        return handleError({
          status: 404,
          message: "Mentor not found",
        });
      }

      return successResponse({
        ...mentor,
        role: mentor.isAdmin ? "admin" : "mentor",
      });
    }

    if (payload.type === "mentee") {
      const mentee = await prisma.mentee.findUnique({
        where: {
          studentId: payload.studentId,
        },
        include: {
          mentor: {
            include: {
              hints: true,
            },
          },
        },
      });

      if (!mentee) {
        return handleError({
          status: 404,
          message: "Mentee not found",
        });
      }

      return successResponse({
        ...mentee,
        role: "mentee",
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
