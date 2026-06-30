import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { verifyToken, signToken } from "@/src/lib/jwt";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { UnauthorizedError, NotFoundError } from "@/src/core/error/error";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return handleError(new UnauthorizedError("Unauthorized"));
    }

    const payload = verifyToken(token);
    let currentRole: "admin" | "mentor" | "mentee" = "mentee";

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
        return handleError(new NotFoundError("Mentor not found"));
      }

      currentRole = mentor.isAdmin ? "admin" : "mentor";

      if (payload.role !== currentRole) {
        const newToken = signToken({
          studentId: payload.studentId,
          type: payload.type,
          role: currentRole,
        });

        const cookieStore = await cookies();
        cookieStore.set("access_token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }

      return successResponse({
        ...mentor,
      });
    }

    if (payload.type === "mentee") {
      const mentee = await prisma.mentee.findUnique({
        where: {
          studentId: payload.studentId,
        },
        include: {
          mentor: true,
        },
      });

      if (!mentee) {
        return handleError(new NotFoundError("Mentee not found"));
      }

      currentRole = "mentee";

      if (payload.role !== currentRole) {
        const newToken = signToken({
          studentId: payload.studentId,
          type: payload.type,
          role: currentRole,
        });

        const cookieStore = await cookies();
        cookieStore.set("access_token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }

      return successResponse({
        ...mentee,
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
