"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "lr" | "rl" | "tb" | "bt";

interface SlidingTextRevealProps {
  as?: React.ElementType;
  text: React.ReactNode | React.ReactNode[]; // keep this
  direction?: Direction;
  once?: boolean;
  delay?: number;
  duration?: number;
  lineStagger?: number;
  className?: string;
  coverClass?: string;
  hoverToReveal?: boolean;
}

function lineVariants(dir: Direction, duration: number) {
  const coverFrom =
    dir === "lr"
      ? { left: 0, right: "auto" }
      : dir === "rl"
      ? { right: 0, left: "auto" }
      : dir === "tb"
      ? { top: 0, bottom: "auto" }
      : { bottom: 0, top: "auto" };

  const coverExit =
    dir === "lr"
      ? { translateX: "101%" }
      : dir === "rl"
      ? { translateX: "-101%" }
      : dir === "tb"
      ? { translateY: "101%" }
      : { translateY: "-101%" };

  const textHidden = { opacity: 0, y: 8 };
  const textShow = {
    opacity: 1,
    y: 0,
    transition: { duration, ease: [0.2, 0.9, 0.2, 1] },
  };

  return { coverFrom, coverExit, textHidden, textShow };
}

export default function SlidingTextReveal({
  as = "h2",
  text,
  direction = "lr",
  once = true,
  delay = 0,
  duration = 0.8,
  lineStagger = 0.08,
  className = "",
  coverClass = "bg-neutral-900",
  hoverToReveal = false,
}: SlidingTextRevealProps) {
  const Tag = as as any;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3, once });
  const [hover, setHover] = useState(false);

  // ✅ normalize to array
  const lines = Array.isArray(text) ? text : [text];

  const active = hoverToReveal ? hover : inView;
  const { coverFrom, coverExit, textHidden, textShow } = lineVariants(direction, duration);

  return (
    <div
      ref={rootRef}
      className={`relative inline-block overflow-visible ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
    {React.createElement(Tag, { className: "leading-[1.05]" }, lines.map((line, i) => (
      <span key={i} className="block relative overflow-hidden align-top">
        {/* text */}
        <motion.span
          aria-hidden="false"
          initial={textHidden}
          animate={active ? "show" : "hidden"}
          variants={{
            hidden: textHidden,
            show: {
              ...textShow,
              transition: { delay: delay + i * lineStagger, duration },
            },
          }}
          className="inline-block will-change-transform"
        >
          {line}
        </motion.span>

        {/* cover */}
        <motion.span
          initial={{
            ...coverFrom,
            position: "absolute",
            insetInlineEnd: undefined,
            insetBlockEnd: undefined,
          }}
          animate={active ? "exit" : "enter"}
          variants={{
            enter: { translateX: 0, translateY: 0 },
            exit: {
              ...coverExit,
              transition: {
                delay: delay + i * lineStagger,
                duration,
                ease: [0.2, 0.9, 0.2, 1],
              },
            },
          }}
          className={`pointer-events-none absolute block ${
            direction === "lr" || direction === "rl"
              ? "top-0 h-full w-full"
              : "left-0 w-full h-full"
          } ${coverClass}`}
          style={{
            ...coverFrom,
            willChange: "transform",
          }}
        />
      </span>
    )))}
    </div>
  );
}
