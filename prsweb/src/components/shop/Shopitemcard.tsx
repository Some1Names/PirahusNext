"use client";

import type { ShopItem } from "@/src/lib/shop/Types";

interface ShopItemCardProps {
  item: ShopItem;
  currentPoints: number;
  onBuy: (item: ShopItem, hintLevel?: number) => void;
}

export default function ShopItemCard({
  item,
  currentPoints,
  onBuy,
}: ShopItemCardProps) {
  const canAfford = currentPoints >= item.price;
  const isBuyDisabled = item.disabled || item.owned || !canAfford;

  const cardBase =
    "relative flex flex-col items-center gap-[0.55rem] bg-[#101712] border-2 border-[#2b3a2f] pt-[1.1rem] px-4 pb-4 [image-rendering:pixelated] transition-[transform,border-color,box-shadow] duration-[120ms] ease-in-out";
  const cardDisabled = "opacity-[0.55] grayscale-[40%]";
  const cardHover =
    "hover:-translate-y-[3px] hover:border-[#6dff9e] hover:shadow-[0_6px_0_rgba(0,0,0,0.35),0_0_16px_rgba(109,255,158,0.25)]";

  return (
    <div className={`${cardBase} ${item.disabled ? cardDisabled : cardHover}`}>
      {item.owned && (
        <span className="absolute -top-2 -right-2 rotate-6 bg-[#ffd66b] text-[#221a00] text-[0.6rem] px-[0.4rem] py-[0.2rem] font-['Pixelify_Sans']">
          มีแล้ว
        </span>
      )}

      {item.hintLevel && (
        <span className="absolute -top-2 -left-2 -rotate-6 bg-[#6dff9e] text-[#06210f] text-[0.6rem] px-[0.4rem] py-[0.2rem] font-['Pixelify_Sans']">
          Lv.{item.hintLevel}
        </span>
      )}

      <div className="w-14 h-14 flex items-center justify-center text-[1.8rem] bg-[#0d130f] border-2 border-[#22301f]">
        {item.icon}
      </div>
      <div className="font-['Pixelify_Sans'] text-[0.95rem] text-[#eaffef] text-center">
        {item.name}
      </div>
      <div className="text-[0.7rem] leading-[1.3] text-[#7c9985] text-center min-h-[2.2em]">
        {item.description}
      </div>

      <div className="flex items-center gap-[0.35rem] text-[0.85rem] text-[#ffd66b] font-bold">
        <span>🪙</span>
        <span>{item.price} pts</span>
      </div>

      <button
        className="mt-[0.2rem] w-full py-2 bg-[#16321f] border-2 border-[#3f7a4f] text-[#b8ffcf] font-['Share_Tech_Mono'] text-[0.75rem] tracking-[0.06em] cursor-pointer transition-colors duration-120ms ease-in-out enabled:hover:bg-[#6dff9e] enabled:hover:text-[#06210f] enabled:active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isBuyDisabled}
        onClick={() => !isBuyDisabled && onBuy(item, item.hintLevel)}
      >
        {item.disabled
          ? "ไปที่หน้า Spin"
          : item.owned
            ? "ปลดล็อกแล้ว"
            : canAfford
              ? "ซื้อ"
              : "แต้มไม่พอ"}
      </button>
    </div>
  );
}
