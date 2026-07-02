export default function ShopLoading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-[#0a0f0d] px-8 font-mono text-[#d8ffe4]">
      <div
        className="pointer-events-none fixed inset-0 z-1 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(140,255,176,0.035) 0px, rgba(140,255,176,0.035) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="z-10 flex flex-col items-center gap-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#16321f] border-t-[#8cffb0]"></div>
        <p className="font-['Pixelify_Sans'] text-2xl tracking-wider text-[#8cffb0] animate-pulse drop-shadow-[0_0_8px_rgba(140,255,176,.45)]">
          LOADING SHOP...
        </p>
      </div>
    </div>
  );
}
