"use client";

import React, { useEffect, useState } from "react";
import Menu from "../components/menu";
import MenuToggle from "@/src/components/menutoggle";
import ScrollHero from "@/src/components/zoomscroll";
import Loader from "@/src/components/loader";
import ScrollTrigger from "gsap/ScrollTrigger";
import NavbarLogo from "@/src/components/NavbarLogo";
import Dither from "@/src/components/reactbits/Dither";
import ASCIISection from "@/src/components/ASCIISection";
import Info from "@/src/components/info";
import ToMinigame from "@/src/components/ToMinigame";
import FAQ from "@/src/components/FAQ";
import Silk from "@/src/components/reactbits/Silk";

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false); // ← new

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      setLoading(false);

      // Wait two frames: first for React to mount ScrollHero + ASCII,
      // second for their GSAP ScrollTriggers to register and measure
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContentReady(true);
          ScrollTrigger.refresh();
        });
      });
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {loading && <Loader onComplete={() => {}} />}

      <div className="fixed top-8 left-8 z-2000">
        <NavbarLogo />
      </div>

      <MenuToggle isOpen={isOpen} toggle={toggleMenu} />

      {!loading && (
        <>
          <ScrollHero />
          <ASCIISection />
        </>
      )}

      {/* Info only mounts after ScrollHero + ASCII ScrollTriggers are registered */}
      {contentReady && (
        <div className="bg-black">
          <Info />
        </div>
      )}

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Silk
            speed={9}
            scale={1.1}
            color="#1f1729"
            noiseIntensity={1}
            rotation={1.5}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <ToMinigame />

          <div style={{ padding: "0 15rem" }}>
            <FAQ />
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-1000 bg-[#0d0d0d] transition-transform duration-1000ms ease-[cubic-bezier(0.85,0,0.15,1)]
        ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Menu />
      </div>

      <div className="fixed inset-0 -z-10">
        <Dither
          waveColor={[0.537, 0.164, 0.835]}
          disableAnimation={true}
          enableMouseInteraction={false}
          mouseRadius={0}
          colorNum={13}
          waveAmplitude={0.16}
          waveFrequency={3.2}
          waveSpeed={0.02}
        />
      </div>
    </div>
  );
}

export default Page;
