import { GiftRepository } from "@/src/repositories/gift.repository";
import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { MentorRepository } from "@/src/repositories/mentor.repository";
import { Role } from "@/src/core/domain/user";
import { BadRequestError, NotFoundError } from "@/src/core/error/error";
import { IGiftRepository } from "@/src/core/ports/server/gift.repository.port";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";

export class GiftService {
  constructor(
    private readonly giftRepo: IGiftRepository = new GiftRepository(),
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository(),
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
  ) {}

  async transfer(
    senderStudentId: string,
    senderRole: Role,
    recipientCode: string,
    amount: number,
  ): Promise<boolean> {
    if (senderStudentId === recipientCode) {
      throw new BadRequestError("ไม่สามารถโอนแต้มให้ตัวเองได้");
    }

    let senderPoint = 0;
    let senderId = "";

    if (senderRole === "mentor" || senderRole === "admin") {
      const mentor = await this.mentorRepo.findByStudentId(senderStudentId);
      if (!mentor) throw new NotFoundError("ไม่พบข้อมูลผู้ส่ง");
      senderPoint = mentor.point;
      senderId = mentor.id;
    } else {
      const mentee = await this.menteeRepo.findByStudentId(senderStudentId);
      if (!mentee) throw new NotFoundError("ไม่พบข้อมูลผู้ส่ง");
      senderPoint = mentee.point;
      senderId = mentee.id;
    }

    if (senderPoint < amount) {
      throw new BadRequestError("แต้มของคุณไม่เพียงพอ");
    }

    let recipientId = "";
    let recipientRole: Role = "mentee";

    const recipientMentee =
      await this.menteeRepo.findByStudentId(recipientCode);
    const recipientMentor =
      await this.mentorRepo.findByStudentId(recipientCode);

    if (recipientMentee) {
      recipientId = recipientMentee.id;
      recipientRole = "mentee";
    } else if (recipientMentor) {
      recipientId = recipientMentor.id;
      recipientRole = recipientMentor.isAdmin ? "admin" : "mentor";
    } else {
      throw new NotFoundError("ไม่พบผู้รับจากรหัสที่ระบุ");
    }

    return this.giftRepo.executeTransferTransaction(
      senderId,
      senderRole,
      recipientId,
      recipientRole,
      amount,
    );
  }
}
