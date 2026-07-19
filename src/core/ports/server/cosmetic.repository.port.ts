import { Role } from "@/src/core/domain/user";
import { IUnlockCosmeticResult, IEquipCosmeticResult } from "@/src/core/domain/cosmetic";
import { ShopItemEntity } from "@/src/core/domain/shop-item";

export interface ICosmeticRepository {
  findShopItem(id: string): Promise<ShopItemEntity | null>;
  unlockCosmetic(
    userId: string,
    role: Role,
    itemId: string,
    cost: number
  ): Promise<IUnlockCosmeticResult>;
  equipCosmetic(
    userId: string,
    role: Role,
    itemId: string | null
  ): Promise<IEquipCosmeticResult>;
}
