import { prisma } from "@/src/lib/prisma";
import { Role } from "@/src/core/domain/user";
import { IUnlockCosmeticResult, IEquipCosmeticResult } from "@/src/core/domain/cosmetic";
import { ShopItemEntity } from "@/src/core/domain/shop-item";
import { mapToShopItemEntity } from "@/src/factories/shop-item.factory";

import { ICosmeticRepository } from "@/src/core/ports/server/cosmetic.repository.port";

export class CosmeticRepository implements ICosmeticRepository {
  async findShopItem(id: string): Promise<ShopItemEntity | null> {
    const item = await prisma.shopItem.findUnique({ where: { id } });
    return item ? mapToShopItemEntity(item) : null;
  }

  async unlockCosmetic(
    userId: string,
    role: Role,
    itemId: string,
    cost: number
  ): Promise<IUnlockCosmeticResult> {
    if (role === "mentee") {
      const updated = await prisma.mentee.update({
        where: { id: userId },
        data: { point: { decrement: cost }, unlockedCosmetics: { push: itemId } },
      });
      return { cosmeticId: itemId, newPoint: updated.point };
    } else {
      const updated = await prisma.mentor.update({
        where: { id: userId },
        data: { point: { decrement: cost }, unlockedCosmetics: { push: itemId } },
      });
      return { cosmeticId: itemId, newPoint: updated.point };
    }
  }

  async equipCosmetic(
    userId: string,
    role: Role,
    itemId: string | null
  ): Promise<IEquipCosmeticResult> {
    if (role === "mentee") {
      const updated = await prisma.mentee.update({
        where: { id: userId },
        data: { equippedEffect: itemId },
      });
      return { equippedEffect: updated.equippedEffect };
    } else {
      const updated = await prisma.mentor.update({
        where: { id: userId },
        data: { equippedEffect: itemId },
      });
      return { equippedEffect: updated.equippedEffect };
    }
  }
}
