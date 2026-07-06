import { HintRepository } from "@/src/repositories/hint.repository";
import { MentorRepository } from "@/src/repositories/mentor.repository";
import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { ShopItemRepository } from "@/src/repositories/shop-item.repository";
import {
  ForbiddenError,
  NotFoundError,
  AppError,
} from "@/src/core/error/error";
import { IHint, IMenteeHint, IUnlockHintResult } from "@/src/core/domain/hint";
import { Role } from "@/src/core/domain/user";
import { IHintRepository } from "@/src/core/ports/server/hint.repository.port";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";
import { IShopItemRepository } from "@/src/core/ports/server/shop-item.repository.port";

export class HintService {
  constructor(
    private readonly hintRepo: IHintRepository = new HintRepository(),
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository(),
    private readonly shopItemRepo: IShopItemRepository = new ShopItemRepository(),
  ) {}

  async addHints(
    mentorId: string,
    hints: { content: string; level: number }[],
    sessionStudentId: string,
    sessionRole: Role,
  ) {
    if (sessionRole === "mentor") {
      const dbMentor = await this.mentorRepo.findByStudentId(sessionStudentId);
      if (!dbMentor || dbMentor.id !== mentorId) {
        throw new ForbiddenError("You cannot modify other mentors' hints");
      }
    }
    return this.hintRepo.addHints(mentorId, hints);
  }

  async updateHint(
    id: string,
    content: string,
    sessionStudentId: string,
    sessionRole: Role,
  ): Promise<IHint> {
    if (sessionRole === "mentor") {
      const hint = await this.hintRepo.findById(id);
      if (!hint) throw new NotFoundError("Hint not found");
      const dbMentor = await this.mentorRepo.findByStudentId(sessionStudentId);
      if (!dbMentor || hint.mentorId !== dbMentor.id) {
        throw new ForbiddenError("You cannot update other mentors' hints");
      }
    }
    return this.hintRepo.update(id, { content });
  }

  async deleteHint(
    id: string,
    sessionStudentId: string,
    sessionRole: Role,
  ): Promise<IHint> {
    if (sessionRole === "mentor") {
      const hint = await this.hintRepo.findById(id);
      if (!hint) throw new NotFoundError("Hint not found");
      const dbMentor = await this.mentorRepo.findByStudentId(sessionStudentId);
      if (!dbMentor || hint.mentorId !== dbMentor.id) {
        throw new ForbiddenError("You cannot delete other mentors' hints");
      }
    }
    return this.hintRepo.delete(id);
  }

  async getHintsByMentorId(
    mentorId: string,
    sessionStudentId: string,
    sessionRole: Role,
  ): Promise<IHint[]> {
    if (sessionRole === "mentor") {
      const dbMentor = await this.mentorRepo.findByStudentId(sessionStudentId);
      if (!dbMentor || dbMentor.id !== mentorId) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    } else if (sessionRole === "mentee") {
      const dbMentee = await this.menteeRepo.findByStudentId(sessionStudentId);
      if (!dbMentee || dbMentee.mentorId !== mentorId) {
        throw new ForbiddenError("You cannot view other mentors' hints");
      }
    }
    return this.hintRepo.findByMentorId(mentorId);
  }

  async getMenteeHints(sessionStudentId: string): Promise<IMenteeHint[]> {
    const mentee = await this.hintRepo.findMenteeWithHints(sessionStudentId);
    if (!mentee) throw new NotFoundError("Mentee not found");

    const hintShopItems = await this.shopItemRepo.findByCategory("hint");

    const hints =
      mentee.mentor?.hints.map((hint) => {
        const isUnlocked = mentee.unlockedHintLevels.includes(hint.level);
        const shopItem = hintShopItems.find((s) => s.hintLevel === hint.level);
        return {
          id: hint.id,
          level: hint.level,
          cost: shopItem?.price || 0,
          isUnlocked,
          content: isUnlocked ? hint.content : null,
        };
      }) || [];

    hints.sort((a, b) => a.level - b.level);
    return hints;
  }

  async unlockHint(
    level: number,
    sessionStudentId: string,
  ): Promise<IUnlockHintResult> {
    const mentee = await this.menteeRepo.findByStudentId(sessionStudentId);
    if (!mentee) throw new NotFoundError("Mentee not found");

    if (mentee.unlockedHintLevels.includes(level)) {
      throw new AppError("Hint already unlocked", 400, "ALREADY_UNLOCKED");
    }

    const mentor = await this.mentorRepo.findByStudentId(mentee.mentorId);
    if (!mentor) throw new NotFoundError("Mentor not found");
    const hints = await this.hintRepo.findByMentorId(mentor.id);
    const hint = hints.find((h) => h.level === level);

    if (!hint) throw new NotFoundError("Hint not found for this level");

    const shopItem = await this.shopItemRepo.findHintItem(level);

    if (!shopItem || typeof shopItem.price !== "number") {
      throw new AppError("Invalid hint pricing in DB", 500, "INTERNAL_ERROR");
    }

    const cost = shopItem.price;

    if (mentee.point < cost) {
      throw new AppError("Not enough points", 400, "INSUFFICIENT_POINTS");
    }

    const updatedMentee = await this.hintRepo.unlockHintTransaction(
      mentee.id,
      level,
      cost,
    );

    return {
      hint: { id: hint.id, level: hint.level, content: hint.content },
      newPoint: updatedMentee.point,
    };
  }
}
