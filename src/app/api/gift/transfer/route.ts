import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { BadRequestError, NotFoundError } from "@/src/core/error/error";
import { handleError } from "@/src/lib/handle-error";
import { giftTransferSchema } from "@/src/core/schema/gift";
import { requireAuth } from "@/src/lib/get-current-user";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["mentor", "mentee", "admin"]);
    const body = await req.json();

    const { recipientCode, amount } = giftTransferSchema.parse(body);

    if (session.studentId === recipientCode) {
      throw new BadRequestError("ไม่สามารถโอนแต้มให้ตัวเองได้");
    }

    await prisma.$transaction(async (tx) => {
      let senderPoint = 0;
      let senderId = "";
      let senderType: "mentor" | "mentee" = "mentee";

      if (session.role === "mentor" || session.role === "admin") {
        const mentor = await tx.mentor.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentor) throw new NotFoundError("ไม่พบข้อมูลผู้ส่ง");
        senderPoint = mentor.point;
        senderId = mentor.id;
        senderType = "mentor";
      } else {
        const mentee = await tx.mentee.findUnique({
          where: { studentId: session.studentId },
        });
        if (!mentee) throw new NotFoundError("ไม่พบข้อมูลผู้ส่ง");
        senderPoint = mentee.point;
        senderId = mentee.id;
        senderType = "mentee";
      }

      if (senderPoint < amount) {
        throw new BadRequestError("แต้มของคุณไม่เพียงพอ");
      }

      const recipientMentee = await tx.mentee.findUnique({
        where: { studentId: recipientCode },
      });
      const recipientMentor = await tx.mentor.findUnique({
        where: { studentId: recipientCode },
      });

      if (!recipientMentee && !recipientMentor) {
        throw new NotFoundError("ไม่พบผู้รับจากรหัสที่ระบุ");
      }

      if (senderType === "mentor") {
        await tx.mentor.update({
          where: { id: senderId },
          data: { point: { decrement: amount } },
        });
      } else {
        await tx.mentee.update({
          where: { id: senderId },
          data: { point: { decrement: amount } },
        });
      }

      if (recipientMentee) {
        await tx.mentee.update({
          where: { id: recipientMentee.id },
          data: { point: { increment: amount } },
        });
      } else if (recipientMentor) {
        await tx.mentor.update({
          where: { id: recipientMentor.id },
          data: { point: { increment: amount } },
        });
      }
    });

    return successResponse(true);
  } catch (error) {
    return handleError(error);
  }
}
