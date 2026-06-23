'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Menu from '@/src/components/menu'
import MenuToggle from '@/src/components/menutoggle'
import PixelBlast from '@/src/components/reactbits/PixelBlast'
import { Pixelify_Sans } from "next/font/google";

type GameTheme = {
  slug: string
  name: string
  color: string
  colorGlow: string
  gradient: string
  icon: string
  image?: string // pass in your own art later
}

const games: GameTheme[] = [
  {
    slug: 'dungeon',
    name: 'Dungeon',
    color: '#00e5ff',
    colorGlow: '#00e5ff33',
    gradient: 'linear-gradient(135deg, #00e5ff, #00fff7, #0099cc)',
    icon: '⚔',
    image: '/images/dungeonimg.png',
  },
  {
    slug: 'mysterybox',
    name: 'Mystery Box',
    color: '#b44fff',
    colorGlow: '#b44fff33',
    gradient: 'linear-gradient(135deg, #b44fff, #e040fb, #7c3aed)',
    icon: '✦',
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    color: '#ff8c42',
    colorGlow: '#ff8c4233',
    gradient: 'linear-gradient(135deg, #ff8c42, #ffb347, #ff5722)',
    icon: '⊞',
  },
]

function GameCard({ game }: { game: GameTheme }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/minigames/${game.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '220px',
        background: '#13131f',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        border: `2px solid ${isHovered ? game.color + '66' : game.color + '00'}`,
        boxShadow: isHovered ? `0 12px 40px ${game.colorGlow}` : '0 4px 20px #00000066',
        transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.3s',
        textDecoration: 'none',
        display: 'block',
      }}
    >
      {/* Art area */}
      <div
        style={{
          width: '100%',
          height: '270px',
          position: 'relative',
          overflow: 'hidden',
          background: '#0d0d1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* corner accents */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 10,
            height: 10,
            borderTop: `2px solid ${game.color}`,
            borderLeft: `2px solid ${game.color}`,
            borderRadius: '2px 0 0 0',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderTop: `2px solid ${game.color}`,
            borderRight: `2px solid ${game.color}`,
            borderRadius: '0 2px 0 0',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
            zIndex: 2,
          }}
        />

        {/* your art goes here */}
        {game.image ? (
          <Image
            src={game.image}
            alt={game.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              color: game.color + '44',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '12px',
              letterSpacing: '1px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '36px', opacity: 0.3 }}>{game.icon}</span>
            <span>your art here</span>
          </div>
        )}

        {/* fade rising up from the bottom of the art into the footer — ends fully opaque */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '50%',
            background:
              'linear-gradient(to bottom, rgba(19,19,31,0) 0%, rgba(19,19,31,0) 10%, rgba(19,19,31,0.85) 50%, #13131f 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Footer — solid background, no transparency leaks */}
      <div
        style={{
          padding: '0 16px 18px',
          marginTop: '-50px',
          position: 'relative',
          zIndex: 1,
          background: '#13131f',
        }}
      >
        <div
          style={{
            fontFamily: "'Pixelify Sans', sans-serif",
            fontWeight: 500,
            fontSize: '24px',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '10px',
            backgroundImage: game.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {game.name}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: `1px solid ${game.color}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              color: game.color,
            }}
          >
            {game.icon}
          </div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: game.color,
            }}
          >
            PLAY ▶
          </div>
        </div>
      </div>
    </Link>
  )
}

function Lobby() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div style={{ position: 'relative' }}>
      {/* Menu toggle button, top-right, same as Page.tsx */}
      <div className="fixed top-8 right-8 flex items-center gap-4" style={{ zIndex: 2000 }}>
        <MenuToggle isOpen={isOpen} toggle={toggleMenu} />
      </div>

      {/* Lobby content — monospace font scoped here only, not on an ancestor of Menu */}
      <div
        style={{
          background: '#0d0d1a',
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >

        {/* background layer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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

        {/* foreground content sits above the background */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <p
            style={{
              fontFamily: "'Pixelify Sans', sans-serif",
              fontSize: '26px',
              fontWeight: 500,
              letterSpacing: '6px',
              color: '#888',
              marginBottom: '2rem',
              textTransform: 'uppercase',
            }}
          >
            Select Minigame
          </p>

          <div
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </div>
      {/* ^ closes the monospace-scoped lobby content div */}

      {/* Slide-down menu overlay — sibling of the lobby content, doesn't inherit its font */}
      <div
        className={`fixed inset-0 z-1000 bg-[#0d0d0d] transition-transform duration-1000ms ease-[cubic-bezier(0.85,0,0.15,1)]
                ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Menu onNavigate={() => setIsOpen(false)} />
      </div>
    </div>
  )
}

export default Lobby