"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete,
    });

    tl.to(".loader", {
      duration: 1.3,
      ease: "power2.out",
    }).set(".loader", {
      display: "none",
    });
  }, [onComplete]);

  return (
    <div className="loader fixed inset-0 z-9999 bg-[#6812D2] flex items-center justify-center text-white">
      <h1 className="text-3xl tracking-widest">loading...</h1>
    </div>  
  );
}