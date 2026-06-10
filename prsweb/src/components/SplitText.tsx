"use client"

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;            // ms between items
  duration?: number;         // seconds per item
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"p"|"span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  /** NEW: choose how to trigger the animation */
  triggerMode?: "scroll" | "hover";
  /** NEW: reverse back on mouse leave (hover mode only) */
  hoverReverse?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
  triggerMode = "scroll",
  hoverReverse = true,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<GSAPSplitText | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts?.status === "loaded") setFontsLoaded(true);
    else document.fonts?.ready.then(() => setFontsLoaded(true));
  }, []);

  // Helper: pick targets in requested order
  const pickTargets = (self: GSAPSplitText) => {
    if (splitType.includes("chars") && self.chars?.length) return self.chars;
    if (splitType.includes("words") && self.words?.length) return self.words;
    if (splitType.includes("lines") && self.lines?.length) return self.lines;
    return self.chars || self.words || self.lines || [];
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      // Clean up old instances
      tlRef.current?.kill();
      tlRef.current = null;
      splitRef.current?.revert();
      splitRef.current = null;

      // Create one SplitText instance and keep it
      const split = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });
      splitRef.current = split;

      const targets = pickTargets(split);
      const stagger = delay / 1000;

      if (triggerMode === "scroll") {
        // Scroll-triggered (original behavior)
        const startPct = (1 - threshold) * 100;
        const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
        const marginValue = mm ? parseFloat(mm[1]) : 0;
        const marginUnit = mm ? mm[2] || "px" : "px";
        const sign =
          marginValue === 0
            ? ""
            : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
        const start = `top ${startPct}%${sign}`;

        gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
            onComplete: onLetterAnimationComplete,
            willChange: "transform, opacity",
            force3D: true,
          }
        );
      } else {
        // Hover-triggered: build a paused timeline once
        const tl = gsap.timeline({
          paused: true,
          onComplete: onLetterAnimationComplete,
        });
        tl.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger,
            willChange: "transform, opacity",
            force3D: true,
          },
          0
        );
        tlRef.current = tl;

        // Event handlers
        const onEnter = () => tlRef.current?.play();
        const onLeave = () => {
          if (hoverReverse) tlRef.current?.reverse();
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        // Cleanup hover listeners
        return () => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        };
      }

      // Cleanup on unmount / deps change
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        tlRef.current?.kill();
        splitRef.current?.revert();
        tlRef.current = null;
        splitRef.current = null;
      };
    },
    {
      dependencies: [
        text,
        className,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        triggerMode,
        hoverReverse,
      ],
      scope: ref,
    }
  );

  const commonProps = {
    ref,
    style: {
      textAlign,
      wordWrap: "break-word",
      willChange: "transform, opacity",
    } as React.CSSProperties,
    className: `split-parent overflow-hidden inline-block whitespace-normal ${className}`,
    // Important for hover UX:
    // Keep it interactive even when children are split spans.
  };

  switch (tag) {
    case "h1":
      return <h1 {...commonProps}>{text}</h1>;
    case "h2":
      return <h2 {...commonProps}>{text}</h2>;
    case "h3":
      return <h3 {...commonProps}>{text}</h3>;
    case "h4":
      return <h4 {...commonProps}>{text}</h4>;
    case "h5":
      return <h5 {...commonProps}>{text}</h5>;
    case "h6":
      return <h6 {...commonProps}>{text}</h6>;
    case "span":
      return <span {...commonProps}>{text}</span>;
    default:
      return <p {...commonProps}>{text}</p>;
  }
};

export default SplitText;
