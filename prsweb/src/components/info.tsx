"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Grainient from "./reactbits/background/Grainient";

export default function Info() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;

    const ctx = gsap.context(() => {
      // Wait for other ScrollTriggers (ScrollHero, etc.) to register first
      ScrollTrigger.refresh();

      const getDistance = () => el.scrollWidth - window.innerWidth;

      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
      });

      gsap.to(el, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      ScrollTrigger.refresh(); // refresh again after Info registers
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      ref={wrapperRef}
    >
      {/* ColorBends as background */}
      <div className="absolute inset-0 -z-10">
        <Grainient
          color1="#2e282e"
          color2="#373050"
          color3="#b871d0"
          timeSpeed={0.35}
          colorBalance={0}
          warpStrength={0.75}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={45}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.85}
        />
      </div>
      <div
        className="w-max h-screen flex gap-80 px-32 py-48 items-stretch"
        ref={containerRef}
      >
        <div className="flex flex-col w-lg shrink-0 justify-between items-center">
          <div className="flex flex-col gap-9 justify-center items-start w-4xs text-justify tracking-wide">
            <span className="font-black text-6xl">หวัดดีน้อง!!</span>
            <span className="font-medium text-5xl">นี่คือเว็บพี่รหัส</span>
            <span className="font-normal text-2xl">
              โดยน้องสามารถหาคำใบ้ว่าพี่คือใครได้จากเว็บนี้
            </span>
          </div>
          <img src="/images/image.jpg" alt="test" />
        </div>
        <div className="flex flex-col w-lg shrink-0 justify-between items-center">
          <img src="/images/image.jpg" alt="test" />
          <div className="flex flex-col gap-9 justify-center items-start w-4xs text-2xl">
            <section>ส่วนจุดประสงค์ในการทำเว็บนี้คือพี่ว่าง...</section>
            <section>
              แต่ถ้าเอาจริงๆคือพี่มีปม เพราะว่าปีที่แล้วพี่ไม่มีพี่รหัส
              ทำให้มันรู้สึกเฟลนิดหน่อย
            </section>
          </div>
        </div>
        <div className="flex flex-col w-lg shrink-0 justify-center items-center font-medium text-4xl">
          <section>
            พี่เลยตั้งใจเก็บความแค้นทำเว็บนี้ขึ้นมาให้น้องเล่น
            เพราะว่าการที่ไม่มีพี่รหัสมันแย่มากๆ
          </section>
        </div>
        <div className="flex flex-col h-full shrink-0 justify-center items-end ">
          <div className="flex flex-col h-3/5 justify-center items-center font-black gap-3.5">
            <div className="w-full text-6xl text-left">❝</div>
            <section className="text-6xl">
              หวังว่าน้องจะสนุกกับการเล่นเว็บนี้นะ
            </section>
            <div className="w-full text-6xl text-right">❞</div>
          </div>
          <div className="flex flex-col gap-4 justify-end h-full w-xs shrink-0 font-normal text-m text-justify tracking-wide">
            <p>
              *ช่องทางการติดต่อพี่อยู่ในหน้าเมนู ขอให้ไว้แค่สองอันก่อน
              คือเมลสำรองพี่กับดิสคอร์ด มีอะไรก็ทักถามได้เลย
            </p>
            <p>
              **เอาจริงๆแล้วระบบสายรหัสมันหาพี่รหัสง่ายมากๆเลย
              แค่น้อง...ก็หาพี่รหัสได้ละ แต่ว่ามันจะไปสนุกอะไรหละ
              ก็พยายามหาคำใบ้จากการถามพี่คนอื่น ไม่ก็เว็บนี้เท่านั้นนะ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
