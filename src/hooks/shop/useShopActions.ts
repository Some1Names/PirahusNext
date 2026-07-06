import {
  hintService,
  cosmeticService,
  giftService,
} from "@/src/clients/container";
import Swal from "sweetalert2";
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
      Swal.fire({
        title: "ไม่อนุญาต",
        text: "คำใบ้เปิดให้เฉพาะน้องรหัส (Mentee) ซื้อเท่านั้น",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (item.disabled) {
      // TODO: router.push ไปหน้า spin จริง
      return;
    }

    if (item.category === "hint") {
      if (!hintLevel) return;
      try {
        Swal.fire({
          title: "กำลังดำเนินการ...",
          text: "โปรดรอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const result = await hintService.unlockHint(hintLevel);

        if (user && user.role === "mentee") {
          setUser({
            ...user,
            point: result.newPoint,
            unlockedHintLevels: [...user.unlockedHintLevels, hintLevel],
          } as CurrentUser);
        }
        getUser();

        Swal.fire({
          title: "สำเร็จ!",
          text: "ซื้อคำใบ้สำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "เกิดข้อผิดพลาดในการซื้อคำใบ้",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    }

    if (item.category === "cosmetic") {
      try {
        Swal.fire({
          title: "กำลังดำเนินการ...",
          text: "โปรดรอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

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

        Swal.fire({
          title: "สำเร็จ!",
          text: "ปลดล็อก Cosmetic สำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "แต้มไม่พอหรือเกิดข้อผิดพลาด",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    }
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "โปรดรอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const isEquipping = user?.equippedEffect !== item.id;
      const equipId = isEquipping ? item.id : null;

      const result = await cosmeticService.equipCosmetic(equipId);

      if (user) {
        setUser({
          ...user,
          equippedEffect: result.equippedEffect,
        } as CurrentUser);
      }
      getUser();

      Swal.fire({
        title: "สำเร็จ!",
        text: equipId ? "ติดตั้งไอเทมสำเร็จ" : "ถอดไอเทมสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "ผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเปลี่ยนเอฟเฟกต์",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleSendGift = async (transfer: GiftTransfer): Promise<boolean> => {
    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "โปรดรอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await giftService.transferGift(transfer);
      getUser();

      Swal.fire({
        title: "สำเร็จ!",
        text: "โอนแต้มให้เพื่อนเรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        title: "ผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการโอนแต้ม",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return false;
    }
  };

  return { handleBuy, handleEquip, handleSendGift };
}
