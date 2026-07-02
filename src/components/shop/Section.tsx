"use client";

import ShopItemCard from "@/src/components/shop/Shopitemcard";
import type { ShopItem } from "@/src/lib/shop/Types";

interface ShopSectionProps {
  title: string;
  items: ShopItem[];
  currentPoints: number;
  onBuy: (item: ShopItem, hintLevel?: number) => void;
  onEquip?: (item: ShopItem) => void;
  equippedEffect?: string | null;
  isMentor?: boolean;
}

export default function ShopSection({
  title,
  items,
  currentPoints,
  onBuy,
  onEquip,
  equippedEffect,
  isMentor,
}: ShopSectionProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mx-auto mb-4 flex max-w-5xl items-center gap-2 font-['Pixelify_Sans'] text-xl text-[#ffd66b] before:block before:h-10px before:w-10px before:bg-[#ffd66b] before:shadow-[0_0_8px_#ffd66b]">
        {title}
      </h2>
      <div className="mx-auto mb-12 grid max-w-5xl grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            currentPoints={currentPoints}
            onBuy={onBuy}
            onEquip={onEquip}
            isEquipped={equippedEffect === item.id}
            isMentor={isMentor}
          />
        ))}
      </div>
    </section>
  );
}
