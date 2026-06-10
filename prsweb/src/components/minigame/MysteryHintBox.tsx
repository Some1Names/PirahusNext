"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

// Example implementations.
// Replace these with your real coin system.
function getCoins() {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("coins") ?? 10);
}

function spendCoin() {
    if (typeof window === "undefined") return false;

    const coins = getCoins();

    if (coins <= 0) return false;

    localStorage.setItem("coins", String(coins - 1));
    return true;
}

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
    // ...
];

function getRandomHint(exclude?: number) {
    let idx: number;

    do {
        idx = Math.floor(Math.random() * hints.length);
    } while (idx === exclude && hints.length > 1);

    return idx;
}

export default function MysteryHintBox() {
    const [coins, setCoins] = useState(0);
    const [hintIdx, setHintIdx] = useState<number | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinCount, setSpinCount] = useState(0);

    useEffect(() => {
        setCoins(getCoins());
    }, []);

    const boxRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    const SPIN_EMOJIS = ["✨", "💡", "🔮", "🎲", "⚡", "🌀", "🎯", "💫"];

    function spawnParticles() {
        const container = particlesRef.current;
        if (!container) return;
        container.innerHTML = "";
        const colors = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD", "#BA7517"];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement("span");
            p.style.cssText = `
        position:absolute; width:8px; height:8px; border-radius:50%;
        background:${colors[i % colors.length]};
        left:50%; top:50%; pointer-events:none;
      `;
            container.appendChild(p);
            gsap.to(p, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: Math.random() * 1.5 + 0.5,
                duration: 0.8 + Math.random() * 0.4,
                ease: "power2.out",
                onComplete: () => p.remove(),
            });
        }
    }

    function spin() {
        const success = spendCoin();
        if (!success) return; // show "no coins" state
        setCoins(getCoins());
        if (isSpinning) return;
        setIsSpinning(true);

        const tl = gsap.timeline({
            onComplete: () => {
                const nextIdx = getRandomHint(hintIdx ?? undefined);
                setHintIdx(nextIdx);
                setSpinCount((c) => c + 1);
                setIsSpinning(false);

                // reveal card
                gsap.fromTo(
                    cardRef.current,
                    { opacity: 0, y: 24, scale: 0.96 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
                );

                spawnParticles();

                // bounce box
                gsap.fromTo(
                    boxRef.current,
                    { scale: 1 },
                    { scale: 1.04, yoyo: true, repeat: 1, duration: 0.15, ease: "power2.out" }
                );
            },
        });

        // button press
        tl.to(buttonRef.current, { scale: 0.94, duration: 0.1, ease: "power2.in" });
        tl.to(buttonRef.current, { scale: 1, duration: 0.15, ease: "back.out(2)" });

        // spin the emoji through fake ones
        const spinDuration = 0.06;
        const spinRounds = 10;
        for (let i = 0; i < spinRounds; i++) {
            tl.call(() => {
                const el = emojiRef.current;
                if (!el) return;
                el.textContent = SPIN_EMOJIS[i % SPIN_EMOJIS.length];
                gsap.fromTo(
                    el,
                    { y: -16, opacity: 0 },
                    { y: 0, opacity: 1, duration: spinDuration * 0.6, ease: "power1.out" }
                );
            });
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
                    width: 140,
                    height: 140,
                    borderRadius: "var(--border-radius-lg)",
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    userSelect: "none",
                }}
            >
                <div
                    ref={particlesRef}
                    style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
                />
                <div
                    ref={emojiRef}
                    style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}
                    aria-hidden="true"
                >
                    {currentHint ? currentHint.emoji : "🎁"}
                </div>
                <span
                    style={{
                        fontSize: 11,
                        color: "var(--color-text-tertiary)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
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
                style={{
                    padding: "10px 28px",
                    borderRadius: "var(--border-radius-md)",
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-primary)",
                    color: "var(--color-text-primary)",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: isSpinning ? "not-allowed" : "pointer",
                    opacity: isSpinning ? 0.5 : 1,
                    transition: "opacity 0.15s",
                    fontFamily: "var(--font-sans)",
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
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 500,
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