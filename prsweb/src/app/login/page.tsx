"use client"

import { useState } from 'react'
import GradientText from '../../components/reactbits/GradientText'
import SideRays from '../../components/reactbits/SideRays'
import { FaIdCard, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { Pixelify_Sans } from 'next/font/google'

const pixelifySans = Pixelify_Sans({ subsets: ['latin'] })

export default function Page() {
    const [showPassword, setShowPassword] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', overflow: 'hidden', backgroundColor: '#000' }}>

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px', width: '420px', flexShrink: 0, marginLeft: '150px' }}>

                <button
                    onClick={() => window.location.href = '/'}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: isHovered ? '#6812D2' : '#fff',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: '48px',
                        width: 'fit-content',
                        transition: 'color 0.2s ease',
                    }}
                >
                    <FaArrowLeft size={12} /> BACK
                </button>

                <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                        Student Portal
                    </span>
                    <h1 style={{ fontSize: '60px', fontWeight: 500, lineHeight: 1.2 }}>
                        <GradientText
                            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
                            animationSpeed={8}
                            showBorder={false}
                            className={pixelifySans.className}
                        >
                            welcome_
                        </GradientText>
                    </h1>
                    <p style={{ marginTop: '8px', fontSize: '14px', marginBottom: 0, color: '#6b7280' }}>
                        Enter your student ID to continue.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#6b7280' }}>
                            Student ID
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', height: '40px', padding: '0 12px', gap: '8px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#09090b' }}>
                            <FaIdCard style={{ color: '#6b7280', flexShrink: 0 }} size={14} />
                            <input
                                type="text"
                                placeholder="e.g. 69090500499"
                                style={{ flex: 1, background: 'transparent', fontSize: '14px', outline: 'none', border: 'none', fontFamily: 'monospace', color: '#fff' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#6b7280' }}>
                            Password
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', height: '40px', padding: '0 12px', gap: '8px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#09090b' }}>
                            <FaLock style={{ color: '#6b7280', flexShrink: 0 }} size={14} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={{ flex: 1, background: 'transparent', fontSize: '14px', outline: 'none', border: 'none', color: '#fff' }}
                            />
                            {showPassword
                                ? <FaEyeSlash style={{ color: '#6b7280', cursor: 'pointer' }} size={14} onClick={() => setShowPassword(false)} />
                                : <FaEye style={{ color: '#6b7280', cursor: 'pointer' }} size={14} onClick={() => setShowPassword(true)} />
                            }
                        </div>
                    </div>

                    <button
                        style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginTop: '8px', width: '100%', border: '1px solid #27272a', backgroundColor: '#09090b', color: '#fff' }}
                    >
                        SIGN IN <FaArrowRight size={14} />
                    </button>

                </div>

                <p style={{ marginTop: '32px', fontSize: '12px', marginBottom: 0, color: '#6b7280' }}>
                    Forgot your ID?{' '}
                    <span style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px', color: '#fff' }}>
                        click here
                    </span>
                </p>

            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <SideRays
                        speed={2.5}
                        rayColor1="#ea08c9"
                        rayColor2="#9727d7"
                        intensity={2}
                        spread={2}
                        origin="top-right"
                        tilt={0}
                        saturation={1.5}
                        blend={0.75}
                        falloff={1.6}
                        opacity={1}
                    />
                </div>
            </div>

        </div>
    )
}