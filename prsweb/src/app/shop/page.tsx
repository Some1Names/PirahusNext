"use client";

import { useEffect, useState } from "react";
import ShopSection from "@/src/components/shop/Section";
import GiftPointsButton from "@/src/components/shop/Giftpointsbutton";
import GiftModal from "@/src/components/shop/Giftmodal";
import type { ShopItem, GiftTransfer } from "@/src/lib/shop/Types";
import { SHOP_ITEMS } from "@/src/components/shop/Items"; 

import PtsBadge from "@/src/components/minigame/points";
import { useUserStore } from "@/src/store/auth";

export default function Shop() {
  const user = useUserStore((s) => s.user);
  const storeLoading = useUserStore((s) => s.loading);
  const getUser = useUserStore((s) => s.getUser);

  const points = user?.point ?? 0;
  const [giftOpen, setGiftOpen] = useState(false);

  useEffect(() => {
    if (!user) getUser();
  }, [user, getUser]);

  const spinItems = SHOP_ITEMS.filter((i) => i.category === "spin");
  const hintItems = SHOP_ITEMS.filter((i) => i.category === "hint");
  const cosmeticItems = SHOP_ITEMS.filter((i) => i.category === "cosmetic");

  const handleBuy = async (item: ShopItem) => {
    if (item.disabled) {
      // TODO: router.push ไปหน้า spin จริง
      return;
    }
    // TODO: เรียก API ซื้อสินค้าจริง เช่น mentorService/menteeService.spendPoint(...)
    // (ต้องเพิ่ม method หัก point ฝั่ง service เอง เพราะตอนนี้มีแต่ addMentorPoint/addMenteePoint)
    // แล้วค่อย getUser() ใหม่เพื่อ sync ยอด point ล่าสุดจาก store
    console.log("buy item", item.id);
  };

  const handleSendGift = async (transfer: GiftTransfer): Promise<boolean> => {
    // TODO: เรียก API จริงสำหรับโอนแต้มให้เพื่อน แล้ว getUser() ใหม่หลังโอนสำเร็จ
    console.log("send gift", transfer);
    return true;
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0f0d] px-8 pt-24 pb-12 font-mono text-[#d8ffe4]">
      <div
        className="pointer-events-none fixed inset-0 z-1 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(140,255,176,0.035) 0px, rgba(140,255,176,0.035) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* currency badge มุมซ้ายบน */}
      <div
        style={{
          position: "fixed",
          top: "2.5rem",
          left: "2rem",
          zIndex: 1000,
        }}
      >
        <PtsBadge pts={points} isLoading={storeLoading} />
      </div>

      <header className="mx-auto mb-10 max-w-5xl text-center">
        <h1 className="font-['Pixelify_Sans'] text-4xl tracking-wider text-[#8cffb0] drop-shadow-[0_0_12px_rgba(140,255,176,.45)]">
          SHOP
        </h1>

        <p className="mt-2 text-sm tracking-wide text-[#7c9985]">
          ใช้แต้มแลกของและเอฟเฟกต์พิเศษ
        </p>
      </header>

      <ShopSection title="Spin" items={spinItems} currentPoints={points} onBuy={handleBuy} />
      <ShopSection title="Hint" items={hintItems} currentPoints={points} onBuy={handleBuy} />
      <ShopSection title="Cosmetic" items={cosmeticItems} currentPoints={points} onBuy={handleBuy} />

      <GiftPointsButton onClick={() => setGiftOpen(true)} />

      {giftOpen && (
        <GiftModal
          currentPoints={points}
          onClose={() => setGiftOpen(false)}
          onSend={handleSendGift}
        />
      )}
    </div>
  );
}