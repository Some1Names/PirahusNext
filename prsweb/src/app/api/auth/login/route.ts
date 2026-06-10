import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { signToken } from "@/src/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const studentId = body.studentId;

    if (!studentId) {
      return handleError({
        status: 400,
        message: "Student ID is required",
      });
    }

    const config = await prisma.admissionYear.findFirst();

    if (!config) {
      return handleError({
        status: 500,
        message: "Admission year setting not configured",
      });
    }

    if (studentId.startsWith(config?.mentorYear)) {
      const mentor = await prisma.mentor.findUnique({
        where: {
          studentId,
        },
      });

      if (!mentor) {
        return handleError({
          status: 404,
          message: "Mentor not found",
        });
      }
    } else if (studentId.startsWith(config?.menteeYear)) {
      const mentee = await prisma.mentee.findUnique({
        where: {
          studentId,
        },
      });

      if (!mentee) {
        return handleError({
          status: 404,
          message: "Mentee not found",
        });
      }
    }

    const token = signToken({
      studentId,
      type: studentId.startsWith(config?.mentorYear) ? "mentor" : "mentee",
    });

    const cookieStore = await cookies();

    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return successResponse({
      studentId,
    });
  } catch (error) {
    return handleError(error);
  }
}
