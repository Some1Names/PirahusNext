"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ShopSection from "@/src/components/shop/Section";
import GiftPointsButton from "@/src/components/shop/Giftpointsbutton";
import GiftModal from "@/src/components/shop/Giftmodal";
import PtsBadge from "@/src/components/minigame/points";
import { useUserStore } from "@/src/store/auth";
import { Pixelify_Sans } from "next/font/google";

// Refactored Hooks & Components
import ShopLoading from "@/src/components/shop/ShopLoading";
import { useShopItems } from "@/src/hooks/shop/useShopItems";
import { useShopActions } from "@/src/hooks/shop/useShopActions";
import MenuToggle from "@/src/components/menutoggle";
import Menu from "@/src/components/menu";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const LightRays = dynamic(
  () => import("@/src/components/reactbits/background/LightRays"),
  { ssr: false },
);

const buttonStyle = {
  color: "#7c9985",
  border: "1px solid #1f3a2a",
  fontSize: "0.875rem",
  padding: "0.25rem 0.75rem",
  width: "fit-content",
  background: "transparent",
  cursor: "pointer",
  borderRadius: "0.25rem",
  textDecoration: "none",
  display: "inline-block",
  ...pixelifySans.style,
};

export default function Shop() {
  const { user, loading: storeLoading, getUser, setUser } = useUserStore();
  const points = user?.point ?? 0;
  const isMentor = user?.role === "mentor" || user?.role === "admin";
  const [giftOpen, setGiftOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
    <div style={{ position: "relative" }}>
      <div
        className="fixed top-8 right-8 flex items-center gap-4"
        style={{ zIndex: 2000 }}
      >
        <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      </div>

      {/* Content — font-mono lives ONLY on this inner div, not on any ancestor of the menu overlay */}
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0f0d] px-8 pt-24 pb-12 font-mono text-[#d8ffe4]">
        {/* WebGL background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#5be35b"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>

        <div
          className="pointer-events-none fixed inset-0 z-1 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(140,255,176,0.035) 0px, rgba(140,255,176,0.035) 1px, transparent 1px, transparent 3px)",
          }}
        />

        <header className="mx-auto mb-10 max-w-5xl text-center relative z-10">
          <h1 className="font-['Pixelify_Sans'] text-4xl tracking-wider text-[#8cffb0] drop-shadow-[0_0_12px_rgba(140,255,176,.45)]">
            SHOP
          </h1>

          <p className="mt-2 text-sm tracking-wide text-[#7c9985]">
            ใช้แต้มแลกของและเอฟเฟกต์พิเศษ
          </p>
        </header>

        <div className="relative z-10">
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
        </div>
      </div>

      {/* back button มุมซ้ายบน — sibling, outside the font-mono content div */}
      <div
        style={{
          position: "fixed",
          top: "2.5rem",
          left: "2rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        <PtsBadge pts={points} isLoading={storeLoading} />
        <Link
          href="/minigames"
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#8cffb0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7c9985")}
        >
          ← BACK
        </Link>
      </div>

      {giftOpen && (
        <GiftModal
          currentPoints={points}
          onClose={() => setGiftOpen(false)}
          onSend={handleSendGift}
        />
      )}

      {/* Menu overlay — sibling, outside the font-mono content div */}
      <div
        className={`fixed inset-0 z-1000 bg-[#0d0d0d] transition-transform duration-1000ms ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Menu onNavigate={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
