"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift } from 'lucide-react'
import Menu from "@/src/components/menu";
import MenuToggle from "@/src/components/menutoggle";
import PixelBlast from "@/src/components/reactbits/background/PixelBlast";
import FadeContent from "@/src/components/reactbits/effect/FadeContent";
import GameCard from "./GameCard";
import { games } from "./games";
import PtsBadge from "@/src/components/minigame/points";
import { useUserStore } from "@/src/store/auth";

export default function Lobby() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, getUser } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const points = user?.point;

  return (
    <div style={{ position: "relative" }}>
      <div
        className="fixed top-8 right-8 flex items-center gap-4"
        style={{ zIndex: 2000 }}
      >
        <button
          onClick={() => router.push('/minigames/mysterybox')}
          className="flex items-center justify-center w-14 h-14 bg-[#0d0d0d] hover:bg-[#6812D2] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg"
          aria-label="Open Mystery Box"
        >
          <Gift size={28} strokeWidth={1.5} className="text-[#F1F1F1] transition-all duration-500" />
        </button>
        <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      </div>

      <div
        style={{
          background: "#0d0d1a",
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "'Share Tech Mono', monospace",
          userSelect: "none",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#2f3373"
            patternScale={2.25}
            patternDensity={1.3}
            pixelSizeJitter={1.2}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={1.15}
            edgeFade={0.19}
            transparent
          />
        </div>

        {/* Content */}
        <FadeContent blur={true} duration={1000} initialOpacity={0}>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: "26px",
                fontWeight: 500,
                letterSpacing: "6px",
                color: "#888",
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              Select Minigame
            </p>
            <div
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {games.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
        </FadeContent>
      </div>

      <div
        style={{
          position: "fixed",
          top: "2.5rem",
          left: "2rem",
          zIndex: 1000,
        }}
      >
        <PtsBadge pts={points} isLoading={loading} />
      </div>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-1000 bg-[#0d0d0d] transition-transform duration-1000ms ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Menu onNavigate={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
