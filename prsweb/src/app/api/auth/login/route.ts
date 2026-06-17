import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { signToken } from "@/src/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { UnauthorizedError } from "@/src/core/error/error";

import { Mentor, Mentee } from "@/prisma/generated/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = body.studentId;
    const password = body.password;

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

    let user: Mentor | Mentee | null = null;
    let userType: "mentor" | "mentee" = "mentor";

    if (studentId.startsWith(config?.mentorYear)) {
      user = await prisma.mentor.findUnique({
        where: {
          studentId,
        },
      });
      userType = "mentor";
      if (!user) {
        return handleError({
          status: 404,
          message: "Mentor not found",
        });
      }
    } else if (studentId.startsWith(config?.menteeYear)) {
      user = await prisma.mentee.findUnique({
        where: {
          studentId,
        },
      });
      userType = "mentee";
      if (!user) {
        return handleError({
          status: 404,
          message: "Mentee not found",
        });
      }
    } else {
      return handleError({
        status: 400,
        message: "Invalid Student ID format for mentors or mentees",
      });
    }

    const isFirstLogin = user.password === null;

    if (isFirstLogin) {
      const token = signToken({
        studentId,
        type: userType,
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
        firstLogin: true,
      });
    } else {
      if (!password) {
        return successResponse({
          studentId,
          firstLogin: false,
          hasPassword: true,
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password!);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Incorrect password");
      }

      const token = signToken({
        studentId,
        type: userType,
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
        firstLogin: false,
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
