import { CosmeticRepository } from "@/src/repositories/cosmetic.repository";
import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { MentorRepository } from "@/src/repositories/mentor.repository";
import { Role } from "@/src/core/domain/user";
import { AppError, NotFoundError } from "@/src/core/error/error";
import {
  IUnlockCosmeticResult,
  IEquipCosmeticResult,
} from "@/src/core/domain/cosmetic";
import { ICosmeticRepository } from "@/src/core/ports/server/cosmetic.repository.port";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";

export class CosmeticService {
  constructor(
    private readonly cosmeticRepo: ICosmeticRepository = new CosmeticRepository(),
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository(),
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
  ) {}

  async unlockCosmetic(
    studentId: string,
    role: Role,
    itemId: string,
  ): Promise<IUnlockCosmeticResult> {
    const item = await this.cosmeticRepo.findShopItem(itemId);
    if (!item || item.category !== "cosmetic") {
      throw new NotFoundError("Cosmetic item not found");
    }

    let userId = "";
    let unlockedCosmetics: string[] = [];
    let currentPoints = 0;

    if (role === "mentee") {
      const mentee = await this.menteeRepo.findByStudentId(studentId);
      if (!mentee) throw new NotFoundError("Mentee not found");
      userId = mentee.id;
      unlockedCosmetics = mentee.unlockedCosmetics;
      currentPoints = mentee.point;
    } else {
      const mentor = await this.mentorRepo.findByStudentId(studentId);
      if (!mentor) throw new NotFoundError("Mentor not found");
      userId = mentor.id;
      unlockedCosmetics = mentor.unlockedCosmetics;
      currentPoints = mentor.point;
    }

    if (unlockedCosmetics.includes(itemId)) {
      throw new AppError("Cosmetic already unlocked", 400, "ALREADY_UNLOCKED");
    }
    if (currentPoints < item.price) {
      throw new AppError("Not enough points", 400, "INSUFFICIENT_POINTS");
    }

    return this.cosmeticRepo.unlockCosmetic(
      userId,
      role,
      itemId,
      item.price,
    );
  }

  async equipCosmetic(
    studentId: string,
    role: Role,
    itemId: string | null,
  ): Promise<IEquipCosmeticResult> {
    if (itemId !== null) {
      const item = await this.cosmeticRepo.findShopItem(itemId);
      if (!item || item.category !== "cosmetic")
        throw new NotFoundError("Cosmetic item not found");
    }

    let userId = "";
    let unlockedCosmetics: string[] = [];

    if (role === "mentee") {
      const mentee = await this.menteeRepo.findByStudentId(studentId);
      if (!mentee) throw new NotFoundError("Mentee not found");
      userId = mentee.id;
      unlockedCosmetics = mentee.unlockedCosmetics;
    } else {
      const mentor = await this.mentorRepo.findByStudentId(studentId);
      if (!mentor) throw new NotFoundError("Mentor not found");
      userId = mentor.id;
      unlockedCosmetics = mentor.unlockedCosmetics;
    }

    if (itemId !== null && !unlockedCosmetics.includes(itemId)) {
      throw new AppError("You do not own this cosmetic", 400, "NOT_OWNED");
    }

    return this.cosmeticRepo.equipCosmetic(userId, role, itemId);
  }
}
