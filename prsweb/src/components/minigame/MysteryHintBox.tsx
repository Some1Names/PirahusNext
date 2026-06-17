"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Pixelify_Sans } from "next/font/google";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "700"] });

const hints = [
    {
        emoji: "🔍",
        tag: "Debugging",
        text: "When your code doesn't work, add console.log() before and after the broken line to see what value you're actually working with.",
    },
    {
        emoji: "📦",
        tag: "Functions",
        text: "If you're copying and pasting the same code block more than twice, it's a sign you should wrap it in a function.",
    },
    {
        emoji: "🧪",
        tag: "Testing",
        text: "Write the simplest possible test first. It doesn't need to cover every case — just one real scenario helps you trust your code more.",
    },
    {
        emoji: "📖",
        tag: "Readability",
        text: "Name variables after what they represent, not how they're used. 'userAge' beats 'n' every time.",
    },
    {
        emoji: "🔧",
        tag: "Refactoring",
        text: "Before adding a new feature, take 5 minutes to clean up the code you'll be touching. Small cleanups compound fast.",
    },
    {
        emoji: "💡",
        tag: "Problem Solving",
        text: "If you're stuck for more than 20 minutes, explain the problem out loud to yourself or a rubber duck — saying it aloud often reveals the answer.",
    },
    {
        emoji: "🎯",
        tag: "Focus",
        text: "Work on one bug at a time. Trying to fix multiple issues at once makes it hard to know which change actually solved the problem.",
    },
];

const SPIN_EMOJIS = ["✨", "💡", "🔮", "🎲", "⚡", "🌀", "🎯", "💫"];

// ── 8×8 pixel art (used during spin frames) ──────────────────────────────────
const GRID_SIZE = 8;
const PIXEL_SIZE = 8; // 8 × 8 = 64px

type PixelData = { r: number; g: number; b: number; a: number };

function emojiToPixels(emoji: string): PixelData[] {
    if (typeof window === "undefined") return [];
    const RENDER = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = RENDER;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    ctx.font = `${RENDER * 0.85}px serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(emoji, RENDER / 2, RENDER / 2);
    const { data } = ctx.getImageData(0, 0, RENDER, RENDER);
    const cellSize = RENDER / GRID_SIZE;
    const pixels: PixelData[] = [];
    for (let gy = 0; gy < GRID_SIZE; gy++) {
        for (let gx = 0; gx < GRID_SIZE; gx++) {
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            for (let py = 0; py < cellSize; py++) {
                for (let px = 0; px < cellSize; px++) {
                    const sx = Math.floor(gx * cellSize + px);
                    const sy = Math.floor(gy * cellSize + py);
                    const i = (sy * RENDER + sx) * 4;
                    r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3];
                    count++;
                }
            }
            pixels.push({ r: r / count, g: g / count, b: b / count, a: (a / count) / 255 });
        }
    }
    return pixels;
}

function makePixelCanvas(emoji: string): HTMLCanvasElement {
    const pixels = emojiToPixels(emoji);
    const cvs = document.createElement("canvas");
    cvs.width = cvs.height = GRID_SIZE * PIXEL_SIZE;
    cvs.style.imageRendering = "pixelated";
    const ctx = cvs.getContext("2d")!;
    pixels.forEach((px, i) => {
        if (px.a < 0.05) return;
        const gx = i % GRID_SIZE;
        const gy = Math.floor(i / GRID_SIZE);
        ctx.fillStyle = `rgba(${Math.round(px.r)},${Math.round(px.g)},${Math.round(px.b)},${px.a.toFixed(2)})`;
        ctx.fillRect(gx * PIXEL_SIZE, gy * PIXEL_SIZE, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
    });
    return cvs;
}

type AsciiPixel = { color: string | null; ch: string };

function emojiToColorAscii(emoji: string, size = 60): AsciiPixel[][] {
    if (typeof window === "undefined") return [];

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    ctx.font = `${size * 0.85}px serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(emoji, size / 2, size / 2);

    const { data } = ctx.getImageData(0, 0, size, size);
    const chars = " ░▒▓█";
    const rows: AsciiPixel[][] = [];

    for (let y = 0; y < size; y += 2) {
        const row: AsciiPixel[] = [];
        for (let x = 0; x < size; x += 2) {  // ← add += 2, was x++
            const i = (y * size + x) * 4;
            const a = data[i + 3] / 255;
            const brightness = ((data[i] + data[i + 1] + data[i + 2]) / 3) * a;
            const ch = chars[Math.floor((brightness / 255) * (chars.length - 1))];
            const color =
                a > 0.1
                    ? `rgb(${Math.round(data[i] / 32) * 32},${Math.round(data[i + 1] / 32) * 32},${Math.round(data[i + 2] / 32) * 32})`
                    : null;
            row.push({ color, ch });
        }
        rows.push(row);
    }

    return rows;
}

function getRandomHint(exclude?: number): number {
    let idx: number;
    do {
        idx = Math.floor(Math.random() * hints.length);
    } while (idx === exclude && hints.length > 1);
    return idx;
}

export default function MysteryHintBox() {
    const [hintIdx, setHintIdx] = useState<number | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinCount, setSpinCount] = useState(0);
    const [asciiRows, setAsciiRows] = useState<AsciiPixel[][] | null>(null);

    const boxRef = useRef<HTMLDivElement>(null);
    const spinFrameRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    function makePixelCanvas(emoji: string): HTMLCanvasElement {
        const pixels = emojiToPixels(emoji);
        const cvs = document.createElement("canvas");
        cvs.width = cvs.height = GRID_SIZE * PIXEL_SIZE;
        cvs.style.imageRendering = "pixelated";
        const ctx = cvs.getContext("2d")!;
        pixels.forEach((px, i) => {
            if (px.a < 0.05) return;
            const gx = i % GRID_SIZE;
            const gy = Math.floor(i / GRID_SIZE);
            ctx.fillStyle = `rgba(${Math.round(px.r)},${Math.round(px.g)},${Math.round(px.b)},${px.a.toFixed(2)})`;
            ctx.fillRect(gx * PIXEL_SIZE, gy * PIXEL_SIZE, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
        });
        return cvs;
    }

    function spawnParticles() {
        const container = particlesRef.current;
        if (!container) return;
        container.innerHTML = "";
        const colors = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD", "#BA7517"];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement("span");
            p.style.cssText = `
        position:absolute; width:7px; height:7px; border-radius:50%;
        background:${colors[i % colors.length]};
        left:50%; top:50%; pointer-events:none;
      `;
            container.appendChild(p);
            gsap.to(p, {
                x: (Math.random() - 0.5) * 220,
                y: (Math.random() - 0.5) * 220,
                opacity: 0,
                scale: Math.random() * 1.5 + 0.5,
                duration: 0.8 + Math.random() * 0.4,
                ease: "power2.out",
                onComplete: () => p.remove(),
            });
        }
    }

    function spin() {
        if (isSpinning) return;
        setIsSpinning(true);

        const tl = gsap.timeline({
            onComplete: () => {
                const nextIdx = getRandomHint(hintIdx ?? undefined);
                setHintIdx(nextIdx);
                setSpinCount((c) => c + 1);
                // switch to colored ASCII reveal
                setAsciiRows(emojiToColorAscii(hints[nextIdx].emoji));

                gsap.fromTo(
                    cardRef.current,
                    { opacity: 0, y: 24, scale: 0.96 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
                );

                spawnParticles();

                gsap.fromTo(
                    boxRef.current,
                    { scale: 1 },
                    { scale: 1.04, yoyo: true, repeat: 1, duration: 0.15, ease: "power2.out" }
                );
            },
        });

        tl.to(buttonRef.current, { scale: 0.94, duration: 0.1, ease: "power2.in" });
        tl.to(buttonRef.current, { scale: 1, duration: 0.15, ease: "back.out(2)" });

        const spinDuration = 0.06;
        const spinRounds = 10;
        for (let i = 0; i < spinRounds; i++) {
            tl.call(((idx) => () => {
                const el = spinFrameRef.current;
                if (!el) return;
                el.innerHTML = "";
                el.appendChild(makePixelCanvas(SPIN_EMOJIS[idx % SPIN_EMOJIS.length]));
                gsap.fromTo(el, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: spinDuration * 0.6, ease: "power1.out" }
                );
            })(i));
            tl.to({}, { duration: spinDuration });
        }
    }

    const currentHint = hintIdx !== null ? hints[hintIdx] : null;

    return (
        <div
            style={{
                fontFamily: "var(--font-sans)",
                maxWidth: 520,
                margin: "0 auto",
                padding: "2rem 1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
            }}
        >
            <h2 className="sr-only">Mystery Hint Box — spin for a random coding tip</h2>

            {/* box */}
            <div
                ref={boxRef}
                style={{
                    width: 180,
                    height: 180,
                    borderRadius: "var(--border-radius-lg)",
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    userSelect: "none",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={particlesRef}
                    style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
                />

                {/* spin frames: 8×8 pixel art */}
                {!asciiRows && (
                    <div
                        ref={spinFrameRef}
                        aria-hidden="true"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <span style={{ fontSize: 48, lineHeight: 1 }}>🎁</span>
                    </div>
                )}

                {/* reveal: colored ASCII art */}
                {asciiRows && (
                    <pre
                        aria-hidden="true"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: "5.5px",
                            lineHeight: 1.05,
                            letterSpacing: "1px",
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        {asciiRows.map((row, ri) => (
                            <span key={ri}>
                                {row.map((pixel, ci) =>
                                    pixel.color ? (
                                        <span key={ci} style={{ color: pixel.color }}>
                                            {pixel.ch}
                                        </span>
                                    ) : (
                                        pixel.ch
                                    )
                                )}
                                {"\n"}
                            </span>
                        ))}
                    </pre>
                )}

                <span
                    className={pixelifySans.className}
                    style={{
                        fontSize: 11,
                        color: "var(--color-text-tertiary)",
                        letterSpacing: "0.04em",
                        position: "absolute",
                        bottom: 10,
                    }}
                >
                    {spinCount === 0 ? "ready" : `hint #${spinCount}`}
                </span>
            </div>

            {/* button */}
            <button
                ref={buttonRef}
                onClick={spin}
                disabled={isSpinning}
                className={pixelifySans.className}
                style={{
                    padding: "10px 28px",
                    borderRadius: "var(--border-radius-md)",
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-primary)",
                    color: "var(--color-text-primary)",
                    fontSize: 13,
                    fontWeight: 400,
                    cursor: isSpinning ? "not-allowed" : "pointer",
                    opacity: isSpinning ? 0.5 : 1,
                    transition: "opacity 0.15s",
                }}
            >
                {spinCount === 0 ? "Spin for a hint" : "Spin again"}
            </button>

            {/* hint card */}
            {currentHint && (
                <div
                    ref={cardRef}
                    style={{
                        width: "100%",
                        background: "var(--color-background-primary)",
                        border: "0.5px solid var(--color-border-tertiary)",
                        borderRadius: "var(--border-radius-lg)",
                        padding: "1.25rem 1.5rem",
                    }}
                >
                    <div style={{ marginBottom: 10 }}>
                        <span
                            className={pixelifySans.className}
                            style={{
                                fontSize: 12,
                                fontWeight: 400,
                                padding: "3px 10px",
                                borderRadius: "var(--border-radius-md)",
                                background: "var(--color-background-info)",
                                color: "var(--color-text-info)",
                            }}
                        >
                            {currentHint.tag}
                        </span>
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {currentHint.text}
                    </p>
                </div>
            )}
        </div>
    );
}