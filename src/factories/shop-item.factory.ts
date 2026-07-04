import { ShopItem } from "@/prisma/generated/client";
import { ShopItemEntity } from "@/src/core/domain/shop-item";

export function mapToShopItemEntity(item: ShopItem): ShopItemEntity {
  return {
    ...item,
    category: item.category === "spin" || item.category === "cosmetic" || item.category === "hint" ? item.category : "cosmetic",
    effectKey: item.effectKey === "click-spark" || item.effectKey === "ribbons" || item.effectKey === "splash-cursor" ? item.effectKey : null,
  };
}
