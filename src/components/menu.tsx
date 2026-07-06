"use client";

import React, { useState } from "react";
import SlidingTextReveal from "./SlidingTextRevealProps";
import SplitText from "./SplitText";
import { useUserStore } from "../store/auth";

interface MenuProps {
  onNavigate?: () => void; // call this to close the menu before route change
}

function Menu({ onNavigate }: MenuProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { user } = useUserStore();
  const usertype = user?.role;

  const getArchiveHref = () => {
    if (usertype === "admin" || usertype === "mentor") return "/archive/senior";
    if (usertype === "mentee") return "/archive/junior";
    return "/auth/login";
  };

  const links = [
    { name: "HOME", href: "/" },
    { name: "MINIGAMES", href: "/minigames" },
    { name: "ARCHIVE", href: getArchiveHref() },
  ];

  return (
    <nav className="flex flex-col items-center justify-center min-h-screen gap-15 ptsans text-[#F1F1F1] tracking-wide">
      <ul className="flex flex-col items-center gap-0 text-lg md:text-7xl font-bold uppercase">
        {links.map((link, i) => (
          <li key={link.name}>
            <a
              href={link.href}
              onClick={() => onNavigate?.()}
              className="group relative inline-block"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              {/* Base layer */}
              <span
                className={`block transition-opacity duration-200 ${
                  hovered === i ? "opacity-0" : "opacity-100"
                }`}
              >
                <SlidingTextReveal
                  as="span"
                  text={[link.name]}
                  direction="lr"
                  once
                  delay={0.15 + i * 0.1}
                  duration={1.8}
                  lineStagger={0.2}
                  coverClass="bg-[#6812D2]"
                  className="inline-block text-white"
                />
              </span>

              {/* Hover layer — mounted ONLY while hovered */}
              {hovered === i && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <SplitText
                    text={link.name}
                    tag="span"
                    className="text-[#F1F1F1]"
                    splitType="chars"
                    triggerMode="scroll"
                    from={{ opacity: 0, y: -24 }}
                    to={{ opacity: 1, y: -7 }}
                    delay={100}
                    duration={0.5}
                    ease="power3.out"
                    textAlign="center"
                  />
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* CONTACT SECTION */}
      <span className="flex flex-col gap-4 items-center mt-10">
        {/* Title with sliding reveal */}
        <SlidingTextReveal
          as="span"
          text={["Contact Via"]}
          direction="lr"
          once
          delay={0.2}
          duration={1.4}
          lineStagger={0.15}
          coverClass="bg-[#6812D2]"
          className="font-bold text-2xl uppercase"
        />

        <div className="flex flex-col gap-0 font-2xl">
          {/* Gmail */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=himarukoishiwa@gmail.com"
            target="_blank"
            title="mail me"
            className="inline-flex gap-5 items-center"
          >
            <SlidingTextReveal
              as="span"
              text={[
                <span key="gmail" className="inline-flex gap-5 items-center">
                  <img
                    src="/images/gmail.svg"
                    alt="gmail"
                    className="size-7 opacity-100 invert brightness-0"
                  />
                  <span>himarukoishiwa@gmail.com</span>
                </span>,
              ]}
              direction="lr"
              once
              delay={0.35}
              duration={1.3}
              coverClass="bg-[#6812D2]"
              className="inline-flex items-center gap-5"
            />
          </a>

          {/* Discord */}
          <a
            href="https://discord.com/users/mand3la"
            target="_blank"
            title="discord"
            className=" inline-flex gap-5 items-center"
          >
            <SlidingTextReveal
              as="span"
              text={[
                <span key="discord" className="inline-flex gap-5 items-center">
                  <img
                    src="/images/discord.svg"
                    alt="discord"
                    className="size-7 opacity-100 invert brightness-0"
                  />
                  <span>N0tH1ma</span>
                </span>,
              ]}
              direction="lr"
              once
              delay={0.45}
              duration={1.3}
              coverClass="bg-[#6812D2]"
              className="inline-flex items-center gap-5"
            />
          </a>
        </div>
      </span>
    </nav>
  );
}

export default Menu;
