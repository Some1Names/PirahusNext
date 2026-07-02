'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import AnimatedContent from '@/src/components/reactbits/effect/AnimatedContent'
import FadeContent from '@/src/components/reactbits/effect/FadeContent'
import { GameTheme } from './games'

export default function GameCard({ game }: { game: GameTheme }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <FadeContent blur={true} duration={1000} initialOpacity={0}>
      <AnimatedContent
        distance={100} direction="vertical" reverse={false}
        duration={0.8} ease="power3.out" initialOpacity={0}
        animateOpacity={false} scale={1} threshold={0.1} delay={0}
      >
        <Link
          href={`/minigames/${game.slug}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: '220px', background: '#13131f', borderRadius: '14px',
            overflow: 'hidden', cursor: 'pointer', position: 'relative',
            border: `2px solid ${isHovered ? game.color + '66' : game.color + '00'}`,
            boxShadow: isHovered ? `0 12px 40px ${game.colorGlow}` : '0 4px 20px #00000066',
            transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.3s',
            textDecoration: 'none', display: 'block',
          }}
        >
          {/* Art area */}
          <div style={{ width: '100%', height: '270px', position: 'relative', overflow: 'hidden', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Corner accents */}
            {[{ top: 8, left: 8, borderTop: true, borderLeft: true, borderRadius: '2px 0 0 0' },
              { top: 8, right: 8, borderTop: true, borderRight: true, borderRadius: '0 2px 0 0' }
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', width: 10, height: 10,
                borderTop:   pos.borderTop  ? `2px solid ${game.color}` : undefined,
                borderLeft:  pos.borderLeft ? `2px solid ${game.color}` : undefined,
                borderRight: (pos as any).borderRight ? `2px solid ${game.color}` : undefined,
                borderRadius: pos.borderRadius,
                top: pos.top, left: (pos as any).left, right: (pos as any).right,
                opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 2,
              }} />
            ))}

            {game.image ? (
              <Image src={game.image} alt={game.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ color: game.color + '44', fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '36px', opacity: 0.3 }}>{game.icon}</span>
                <span>your art here</span>
              </div>
            )}

            {/* Fade overlay */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(19,19,31,0) 0%, rgba(19,19,31,0) 10%, rgba(19,19,31,0.85) 50%, #13131f 100%)', pointerEvents: 'none' }} />
          </div>

          {/* Footer */}
          <div style={{ padding: '0 16px 18px', marginTop: '-50px', position: 'relative', zIndex: 1, background: '#13131f' }}>
            <div style={{ fontFamily: "'Pixelify Sans', sans-serif", fontWeight: 500, fontSize: '24px', textAlign: 'center', lineHeight: 1.1, marginBottom: '10px', backgroundImage: game.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {game.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${game.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: game.color }}>
                {game.icon}
              </div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '3px', color: game.color }}>
                PLAY ▶
              </div>
            </div>
          </div>
        </Link>
      </AnimatedContent>
    </FadeContent>
  )
}