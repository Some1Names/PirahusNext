import React, { useRef } from 'react'
import { FaArrowRight } from 'react-icons/fa'

function ToMinigame() {
    const btnRef = useRef<HTMLButtonElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = btnRef.current
        if (!btn) return
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        btn.style.setProperty('--x', `${x}px`)
        btn.style.setProperty('--y', `${y}px`)
    }

    const handleMouseEnter = () => {
        const btn = btnRef.current
        if (!btn) return
        btn.style.setProperty('--opacity', '1')
    }

    const handleMouseLeave = () => {
        const btn = btnRef.current
        if (!btn) return
        btn.style.setProperty('--opacity', '0')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="text-6xl font-bold text-white mb-8">/To Minigame test</div>

            <style>{`
        .glow-btn {
          position: relative;
          padding: 1.25rem 3rem;
          border-radius: 28px;
          background: transparent;
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: white;
          font-weight: 500;
          font-size: 1.25rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform 0.1s ease;
          background: #111112;
        }

        .glow-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 28px;
          padding: 1px;
          background: radial-gradient(
            120px circle at var(--x) var(--y),
            #c084fc, #f472b6, transparent 70%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: var(--opacity, 0);
          transition: opacity 0.3s ease;
        }

        .glow-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: radial-gradient(
            80px circle at var(--x) var(--y),
            rgba(192, 132, 252, 0.15), transparent 70%
          );
          opacity: var(--opacity, 0);
          transition: opacity 0.3s ease;
        }
      `}</style>

            <button
                ref={btnRef}
                className="glow-btn"
                onClick={() => window.location.href = '/minigames'}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                Go to Minigame
                <FaArrowRight size={18} />
            </button>
        </div>
    )
}

export default ToMinigame