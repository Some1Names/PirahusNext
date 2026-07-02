"use client";

interface GiftPointsButtonProps {
  onClick: () => void;
}

export default function GiftPointsButton({ onClick }: GiftPointsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-8 right-8 z-1000
        inline-flex items-center gap-2
        border-2 border-[#ffb347]
        bg-[#101712]
        px-5 py-3
        font-['Pixelify_Sans']
        text-[0.95rem]
        tracking-wide
        text-[#ffb347]
        shadow-[0_4px_0_rgba(0,0,0,0.4)]
        transition-all duration-150
        hover:-translate-y-0.5
        hover:bg-[#ffb347]
        hover:text-[#221200]
        active:translate-y-0
      "
    >
      <span className="text-lg leading-none">✉️</span>
      <span>Gift</span>
    </button>
  );
}