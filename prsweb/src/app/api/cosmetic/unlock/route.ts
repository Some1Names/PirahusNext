import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NotFoundError, AppError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { unlockCosmeticSchema } from "@/src/core/schema/cosmetic";
import { requireAuth } from "@/src/lib/get-current-user";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["mentee", "mentor", "admin"]);

    const body = await req.json();
    const validatedData = unlockCosmeticSchema.parse(body);
    const { id } = validatedData;

    const item = await prisma.shopItem.findUnique({ where: { id } });
    if (!item || item.category !== "cosmetic") {
      throw new NotFoundError("Cosmetic item not found");
    }

    const cost = item.price;
    if (typeof cost !== "number") {
      throw new AppError("Invalid cosmetic pricing", 500, "INTERNAL_ERROR");
    }

    const result = await prisma.$transaction(async (tx) => {
      let currentPoints = 0;
      let unlockedCosmetics: string[] = [];
      let userId = "";

      if (session.role === "mentee") {
        const mentee = await tx.mentee.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentee) throw new NotFoundError("Mentee not found");
        currentPoints = mentee.point;
        unlockedCosmetics = mentee.unlockedCosmetics;
        userId = mentee.id;
      } else {
        const mentor = await tx.mentor.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentor) throw new NotFoundError("Mentor not found");
        currentPoints = mentor.point;
        unlockedCosmetics = mentor.unlockedCosmetics;
        userId = mentor.id;
      }

      if (unlockedCosmetics.includes(id)) {
        throw new AppError("Cosmetic already unlocked", 400, "ALREADY_UNLOCKED");
      }

      if (currentPoints < cost) {
        throw new AppError("Not enough points", 400, "INSUFFICIENT_POINTS");
      }

      let newPoint = 0;

      if (session.role === "mentee") {
        const updatedMentee = await tx.mentee.update({
          where: { id: userId },
          data: {
            point: { decrement: cost },
            unlockedCosmetics: { push: id },
          },
        });
        newPoint = updatedMentee.point;
      } else {
        const updatedMentor = await tx.mentor.update({
          where: { id: userId },
          data: {
            point: { decrement: cost },
            unlockedCosmetics: { push: id },
          },
        });
        newPoint = updatedMentor.point;
      }

      if (newPoint < 0) {
        throw new AppError("Not enough points", 400, "INSUFFICIENT_POINTS");
      }

      return {
        cosmeticId: id,
        newPoint: newPoint,
      };
    });

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
