import { useState, useEffect } from "react";
import { shopItemService } from "@/src/clients/container";
import type { ShopItem } from "@/src/lib/shop/Types";
import type { CurrentUser } from "@/src/core/domain/user";

export function useShopItems(user: CurrentUser | null) {
  const [spinItems, setSpinItems] = useState<ShopItem[]>([]);
  const [hintItems, setHintItems] = useState<ShopItem[]>([]);
  const [cosmeticItems, setCosmeticItems] = useState<ShopItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadShopItems = async () => {
      try {
        setIsLoadingItems(true);
        const currentUnlockedHintLevels =
          user && user.role === "mentee" ? user.unlockedHintLevels : [];
        const currentUnlockedCosmetics = user?.unlockedCosmetics || [];

        const [fetchedSpin, fetchedHint, fetchedCosmetic] = await Promise.all([
          shopItemService.getShopItemsByCategory("spin"),
          shopItemService.getShopItemsByCategory("hint"),
          shopItemService.getShopItemsByCategory("cosmetic"),
        ]);

        if (!isMounted) return;

        setSpinItems(
          fetchedSpin.map((i) => ({
            ...i,
            effectKey: i.effectKey || undefined,
            hintLevel: i.hintLevel || undefined,
          })),
        );

        setHintItems(
          fetchedHint.map((i) => ({
            ...i,
            effectKey: i.effectKey || undefined,
            hintLevel: i.hintLevel || undefined,
            owned:
              i.hintLevel && currentUnlockedHintLevels.includes(i.hintLevel)
                ? true
                : i.disabled || false,
          })),
        );

        setCosmeticItems(
          fetchedCosmetic.map((i) => ({
            ...i,
            effectKey: i.effectKey || undefined,
            hintLevel: i.hintLevel || undefined,
            owned: currentUnlockedCosmetics.includes(i.id)
              ? true
              : i.disabled || false,
          })),
        );
      } catch (error) {
        console.error("Failed to load shop items", error);
      } finally {
        if (isMounted) setIsLoadingItems(false);
      }
    };

    if (user) {
      loadShopItems();
    } else {
      setIsLoadingItems(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  return { spinItems, hintItems, cosmeticItems, isLoadingItems };
}
