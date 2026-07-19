import {
  hintService,
  cosmeticService,
  giftService,
} from "@/src/clients/container";
import { alertUtil } from "@/src/utils/alert.util";
import { ALERT_MESSAGES } from "@/src/core/constants/messages";
import type { ShopItem, GiftTransfer } from "@/src/lib/shop/Types";
import type { CurrentUser } from "@/src/core/domain/user";

export function useShopActions(
  user: CurrentUser | null,
  setUser: (user: CurrentUser) => void,
  getUser: () => void,
  isMentor: boolean,
) {
  const handleBuy = async (item: ShopItem, hintLevel?: number) => {
    if (item.category === "hint" && isMentor) {
      alertUtil.showWarning("ไม่อนุญาต", "คำใบ้เปิดให้เฉพาะน้องรหัส (Mentee) ซื้อเท่านั้น");
      return;
    }

    if (item.disabled) {
      return;
    }

    if (item.category === "hint") {
      if (!hintLevel) return;

      const confirmResult = await alertUtil.showConfirm(
        ALERT_MESSAGES.CONFIRM.BUY_ITEM,
        ALERT_MESSAGES.CONFIRM.BUY_ITEM_DESC(item.name, item.price)
      );
      if (!confirmResult.isConfirmed) return;

      try {
        alertUtil.showLoading(ALERT_MESSAGES.LOADING.GENERIC);

        const result = await hintService.unlockHint(hintLevel);

        if (user && user.role === "mentee") {
          setUser({
            ...user,
            point: result.newPoint,
            unlockedHintLevels: [...user.unlockedHintLevels, hintLevel],
          } as CurrentUser);
        }
        getUser();

        alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.BUY);
      } catch {
        alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.BUY);
      }
    }

    if (item.category === "cosmetic") {
      const confirmResult = await alertUtil.showConfirm(
        ALERT_MESSAGES.CONFIRM.BUY_ITEM,
        ALERT_MESSAGES.CONFIRM.BUY_ITEM_DESC(item.name, item.price)
      );
      if (!confirmResult.isConfirmed) return;

      try {
        alertUtil.showLoading(ALERT_MESSAGES.LOADING.GENERIC);

        const result = await cosmeticService.unlockCosmetic(item.id);

        if (user) {
          const unlocked = user.unlockedCosmetics || [];
          setUser({
            ...user,
            point: result.newPoint,
            unlockedCosmetics: [...unlocked, item.id],
          } as CurrentUser);
        }
        getUser();

        alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.BUY);
      } catch {
        alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.BUY);
      }
    }
  };

  const handleEquip = async (item: ShopItem) => {
    const isEquipping = user?.equippedEffect !== item.id;
    const actionLabel = isEquipping ? "ใส่" : "ถอด";

    const confirmResult = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.EQUIP_ITEM(actionLabel),
      ALERT_MESSAGES.CONFIRM.EQUIP_ITEM_DESC(actionLabel, item.name)
    );
    if (!confirmResult.isConfirmed) return;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.GENERIC);

      const equipId = isEquipping ? item.id : null;

      const result = await cosmeticService.equipCosmetic(equipId);

      if (user) {
        setUser({
          ...user,
          equippedEffect: result.equippedEffect,
        } as CurrentUser);
      }
      getUser();

      alertUtil.showSuccess(
        ALERT_MESSAGES.SUCCESS.TITLE,
        equipId ? ALERT_MESSAGES.SUCCESS.EQUIP : ALERT_MESSAGES.SUCCESS.UNEQUIP,
        { timer: 1500, showConfirmButton: false }
      );
    } catch {
      alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.EQUIP);
    }
  };

  const handleSendGift = async (transfer: GiftTransfer): Promise<boolean> => {
    const confirmResult = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.SEND_GIFT,
      ALERT_MESSAGES.CONFIRM.SEND_GIFT_DESC(transfer.amount)
    );
    if (!confirmResult.isConfirmed) return false;

    try {
      alertUtil.showLoading(ALERT_MESSAGES.LOADING.TRANSFER);

      await giftService.transferGift(transfer);
      getUser();

      alertUtil.showSuccess(ALERT_MESSAGES.SUCCESS.TITLE, ALERT_MESSAGES.SUCCESS.TRANSFER, {
        timer: 1500,
        showConfirmButton: false,
      });
      return true;
    } catch {
      alertUtil.showError(ALERT_MESSAGES.ERROR.TITLE, ALERT_MESSAGES.ERROR.TRANSFER);
      return false;
    }
  };

  return { handleBuy, handleEquip, handleSendGift };
}
