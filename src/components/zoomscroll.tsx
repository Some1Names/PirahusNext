"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function ScrollHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { scale: 1 },
        {
          scale: 0.5, // zoom out smaller than normal
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=120%",
            scrub: 0.8,
            pin: true,
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Inner wrapper (this is what scales) */}
      <div
        ref={innerRef}
        className="relative w-full h-full"
      >
        {/* Background image */}
        <Image
          src="/images/prsbg.jpg"
          alt="Hero background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />

        {/* Logo overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Image
            src="/images/prslogo2.png"
            alt="Logo"
            width={1200}
            height={1200}
            priority
            quality={100}
            className="w-full max-w-5xl h-auto object-contain px-8"
          />
        </div>
      </div>
    </section>
  );
}