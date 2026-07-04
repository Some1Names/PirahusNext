import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/get-current-user";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { updateProfileSchema } from "@/src/core/schema/profile";

export async function PUT(req: NextRequest) {
  try {
    const userSession = await requireAuth(["admin", "mentor", "mentee"]);

    const body = await req.json();
    const { nickname } = updateProfileSchema.parse(body);

    if (userSession.role === "admin" || userSession.role === "mentor") {
      await prisma.mentor.update({
        where: {
          studentId: userSession.studentId,
        },
        data: {
          nickname,
        },
      });
    } else if (userSession.role === "mentee") {
      const studentIdStr = userSession.studentId;
      const lastThreeDigits = studentIdStr.slice(-3);
      const formattedNickname = `${lastThreeDigits} ${nickname}`;
      
      await prisma.mentee.update({
        where: {
          studentId: userSession.studentId,
        },
        data: {
          nickname: formattedNickname,
        },
      });
    }

    return successResponse({
      message: "Profile updated successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
