import { prisma } from "@/src/lib/prisma";
import { Role } from "@/src/core/domain/auth";
import { IUnlockCosmeticResult, IEquipCosmeticResult } from "@/src/core/domain/cosmetic";
import { ShopItemEntity } from "@/src/core/domain/shop-item";
import { mapToShopItemEntity } from "@/src/factories/shop-item.factory";

export class CosmeticRepository {
  async findShopItem(id: string): Promise<ShopItemEntity | null> {
    const item = await prisma.shopItem.findUnique({ where: { id } });
    return item ? mapToShopItemEntity(item) : null;
  }

  async unlockCosmeticTransaction(
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

  async equipCosmeticTransaction(
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
