"use client";

import React, { useEffect, useState } from "react";
import Menu from "./menu";
import MenuToggle from "./menutoggle";
import LoginButton from "./LoginButton";
import ScrollHero from "./zoomscroll";
import Loader from "./loader";
import ScrollTrigger from "gsap/ScrollTrigger";
import NavbarLogo from "./NavbarLogo";
import Dither from "./reactbits/background/Dither";
import ASCIISection from "./ASCIISection";
import Info from "./info";
import ToMinigame from "./ToMinigame";
import FAQ from "./FAQ";
import Silk from "./reactbits/background/Silk";

interface HomeClientProps {
  role: string | null;
}

function HomeClient({ role }: HomeClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      setLoading(false);

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
      {loading && <Loader onComplete={() => { }} />}

      <div className="fixed top-8 left-8 z-2000">
        <NavbarLogo />
      </div>

      <div className="fixed top-8 right-8 flex items-center gap-4" style={{ zIndex: 2000 }}>
        <LoginButton role={role} />
        <MenuToggle isOpen={isOpen} toggle={toggleMenu} />
      </div>

      {!loading && (
        <>
          <ScrollHero />
          <ASCIISection />
        </>
      )}

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

export default HomeClient;
