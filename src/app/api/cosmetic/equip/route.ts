import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { NotFoundError, AppError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { equipCosmeticSchema } from "@/src/core/schema/cosmetic";
import { requireAuth } from "@/src/lib/get-current-user";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["mentee", "mentor", "admin"]);

    const body = await req.json();
    const validatedData = equipCosmeticSchema.parse(body);
    const { id } = validatedData;

    if (id !== null) {
      const item = await prisma.shopItem.findUnique({ where: { id } });
      if (!item || item.category !== "cosmetic") {
        throw new NotFoundError("Cosmetic item not found");
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      let unlockedCosmetics: string[] = [];
      let userId = "";

      if (session.role === "mentee") {
        const mentee = await tx.mentee.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentee) throw new NotFoundError("Mentee not found");
        unlockedCosmetics = mentee.unlockedCosmetics;
        userId = mentee.id;
      } else {
        const mentor = await tx.mentor.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentor) throw new NotFoundError("Mentor not found");
        unlockedCosmetics = mentor.unlockedCosmetics;
        userId = mentor.id;
      }

      if (id !== null && !unlockedCosmetics.includes(id)) {
        throw new AppError("You do not own this cosmetic", 400, "NOT_OWNED");
      }

      let equippedEffect: string | null = null;

      if (session.role === "mentee") {
        const updatedMentee = await tx.mentee.update({
          where: { id: userId },
          data: {
            equippedEffect: id,
          },
        });
        equippedEffect = updatedMentee.equippedEffect;
      } else {
        const updatedMentor = await tx.mentor.update({
          where: { id: userId },
          data: {
            equippedEffect: id,
          },
        });
        equippedEffect = updatedMentor.equippedEffect;
      }

      return {
        equippedEffect,
      };
    });

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
