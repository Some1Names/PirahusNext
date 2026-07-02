"use client";

import { useEffect, useState } from "react";
import ShopSection from "@/src/components/shop/Section";
import GiftPointsButton from "@/src/components/shop/Giftpointsbutton";
import GiftModal from "@/src/components/shop/Giftmodal";
import PtsBadge from "@/src/components/minigame/points";
import { useUserStore } from "@/src/store/auth";

// Refactored Hooks & Components
import ShopLoading from "@/src/components/shop/ShopLoading";
import { useShopItems } from "@/src/hooks/shop/useShopItems";
import { useShopActions } from "@/src/hooks/shop/useShopActions";

export default function Shop() {
  const { user, loading: storeLoading, getUser, setUser } = useUserStore();
  const points = user?.point ?? 0;
  const isMentor = user?.role === "mentor" || user?.role === "admin";
  const [giftOpen, setGiftOpen] = useState(false);

  useEffect(() => {
    if (!user) getUser();
  }, [user, getUser]);

  const { spinItems, hintItems, cosmeticItems, isLoadingItems } =
    useShopItems(user);

  const { handleBuy, handleEquip, handleSendGift } = useShopActions(
    user,
    setUser,
    getUser,
    isMentor,
  );

  if (
    storeLoading ||
    (isLoadingItems &&
      !spinItems.length &&
      !hintItems.length &&
      !cosmeticItems.length)
  ) {
    return <ShopLoading />;
  }

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

      <ShopSection
        title="Spin"
        items={spinItems}
        currentPoints={points}
        onBuy={handleBuy}
      />

      <ShopSection
        title="Hint"
        items={hintItems}
        currentPoints={points}
        onBuy={handleBuy}
        isMentor={isMentor}
      />

      <ShopSection
        title="Cosmetic"
        items={cosmeticItems}
        currentPoints={points}
        onBuy={handleBuy}
        onEquip={handleEquip}
        equippedEffect={user?.equippedEffect}
      />

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
