"use client"

import { motion, useAnimation } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

// ─── Confetti ────────────────────────────────────────────────────────────────
const RainingConfetti = () => {
    const [pieces, setPieces] = useState([])
    useEffect(() => {
        const colors = ['#f472b6', '#a855f7', '#fcd34d', '#fb7185', '#c084fc', '#ffffff']
        setPieces(Array.from({ length: 90 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            dur: Math.random() * 4 + 3,
            delay: Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 9 + 5,
            isCircle: Math.random() > 0.5,
            drift: Math.random() * 80 - 40,
            rotate: Math.random() * 720,
        })))
    }, [])

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
            {pieces.map(p => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.isCircle ? p.size : p.size * 1.6,
                        backgroundColor: p.color,
                        borderRadius: p.isCircle ? '50%' : '2px',
                        boxShadow: `0 0 8px ${p.color}99`,
                    }}
                    animate={{ y: ['0vh', '110vh'], x: [0, p.drift, 0], rotate: [0, p.rotate] }}
                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
                />
            ))}
        </div>
    )
}

// ─── Flame ───────────────────────────────────────────────────────────────────
const Flame = () => (
    <motion.div
        style={{ position: 'relative', width: 18, height: 26, margin: '0 auto' }}
        animate={{ scaleX: [1, 1.15, 0.9, 1.1, 1], scaleY: [1, 0.92, 1.08, 0.95, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
    >
        {/* outer glow */}
        <div style={{
            position: 'absolute', inset: '-6px', borderRadius: '50% 50% 40% 40%',
            background: 'radial-gradient(ellipse, #fde68a55 0%, transparent 70%)',
            filter: 'blur(4px)',
        }} />
        {/* outer flame */}
        <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, #f97316, #fbbf24, #fef08a)',
            borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
            boxShadow: '0 0 12px 4px #f9731688',
        }} />
        {/* inner blue core */}
        <div style={{
            position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
            width: 7, height: 10,
            background: 'linear-gradient(to top, #93c5fd, #bfdbfe)',
            borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
        }} />
    </motion.div>
)

// ─── Cake ────────────────────────────────────────────────────────────────────
const AnimatedCake = () => {
    const floatAnim = { y: [0, -12, 0] }
    const floatTrans = { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }

    // Shared style helpers
    const layer = (bg, w, h, radius = '14px 14px 6px 6px') => ({
        width: w, height: h,
        background: bg,
        borderRadius: radius,
        margin: '0 auto',
        position: 'relative',
    })

    const icingDrips = (color, top = -12) => (
        <div style={{ position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '0 8px' }}>
            {[14, 22, 18, 25, 16, 20, 13].map((h, i) => (
                <div key={i} style={{
                    width: 10, height: h,
                    background: color,
                    borderRadius: '0 0 8px 8px',
                    marginTop: 4,
                }} />
            ))}
        </div>
    )

    return (
        <motion.div
            animate={floatAnim}
            transition={floatTrans}
            style={{ position: 'relative', width: 180, margin: '0 auto', paddingTop: 16 }}
        >
            {/* Soft glow behind cake */}
            <div style={{
                position: 'absolute', top: '40%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 200, height: 200,
                background: 'radial-gradient(ellipse, #f472b630 0%, transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
            }} />

            {/* ── Candle ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: -2, zIndex: 10, position: 'relative' }}>
                <Flame />
                <div style={{
                    width: 14, height: 42,
                    background: 'linear-gradient(to bottom, #fde68a, #fbbf24)',
                    borderRadius: '4px 4px 2px 2px',
                    boxShadow: '0 0 8px #fbbf2466, inset -3px 0 0 #f59e0b44',
                    position: 'relative',
                }}>
                    {/* stripe decoration */}
                    {[8, 18, 28].map(t => (
                        <div key={t} style={{
                            position: 'absolute', top: t, left: 0, right: 0,
                            height: 3, background: '#f472b6aa', borderRadius: 2
                        }} />
                    ))}
                </div>
            </div>

            {/* ── Top Tier ── */}
            <div style={{ ...layer('linear-gradient(135deg, #f9a8d4, #ec4899, #db2777)', 120, 52, '14px 14px 4px 4px'), margin: '0 auto' }}>
                {icingDrips('linear-gradient(to bottom, #fdf2f8, #fbcfe8)')}
                {/* dots decoration */}
                <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {['#fcd34d','#a78bfa','#fcd34d','#a78bfa'].map((c,i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
                    ))}
                </div>
                {/* shine */}
                <div style={{
                    position: 'absolute', top: 8, left: 12, width: 28, height: 8,
                    background: 'rgba(255,255,255,0.35)', borderRadius: 8,
                    transform: 'rotate(-10deg)',
                }} />
            </div>

            {/* ── Middle Tier ── */}
            <div style={{ ...layer('linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)', 150, 58, '4px 4px 4px 4px'), margin: '0 auto', marginTop: -2 }}>
                {icingDrips('linear-gradient(to bottom, #faf5ff, #e9d5ff)', -10)}
                {/* hearts decoration row */}
                <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
                    {['♥','♥','♥','♥'].map((h,i) => (
                        <span key={i} style={{ fontSize: 11, color: '#fcd34d', filter: 'drop-shadow(0 0 3px #fcd34d)' }}>{h}</span>
                    ))}
                </div>
                {/* shine */}
                <div style={{
                    position: 'absolute', top: 10, left: 16, width: 34, height: 9,
                    background: 'rgba(255,255,255,0.25)', borderRadius: 8,
                    transform: 'rotate(-8deg)',
                }} />
            </div>

            {/* ── Bottom Tier ── */}
            <div style={{ ...layer('linear-gradient(135deg, #f472b6, #ec4899, #be185d)', 180, 68, '4px 4px 10px 10px'), margin: '0 auto', marginTop: -2 }}>
                {icingDrips('linear-gradient(to bottom, #fdf2f8, #fce7f3)', -10)}
                {/* stars */}
                <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
                    {['★','★','★','★','★'].map((s,i) => (
                        <span key={i} style={{ fontSize: 13, color: '#fcd34d', filter: 'drop-shadow(0 0 4px #fcd34d)' }}>{s}</span>
                    ))}
                </div>
                {/* shine */}
                <div style={{
                    position: 'absolute', top: 12, left: 20, width: 40, height: 10,
                    background: 'rgba(255,255,255,0.2)', borderRadius: 8,
                    transform: 'rotate(-6deg)',
                }} />
            </div>

            {/* ── Plate ── */}
            <div style={{
                width: 210, height: 20,
                background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
                borderRadius: '50%',
                margin: '0 auto', marginTop: -4,
                boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            }} />

            {/* ── Table shadow ── */}
            <div style={{
                width: 200, height: 12,
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
                margin: '4px auto 0',
            }} />
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HappyBirthday({ onNext }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1150 40%, #1a0a2e 100%)',
            }}
        >
            {/* BG blobs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, #db277755 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, #7c3aed55 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '35%', left: '55%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, #f472b630 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%' }} />
            </div>

            <RainingConfetti />

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Card */}
                <div style={{
                    width: '100%',
                    padding: '40px 32px 44px',
                    borderRadius: 28,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                    <AnimatedCake />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
                        style={{ textAlign: 'center', marginTop: 36, marginBottom: 32 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(2.4rem, 7vw, 3.4rem)',
                            fontWeight: 800,
                            margin: '0 0 10px',
                            background: 'linear-gradient(135deg, #f9a8d4, #ec4899, #c084fc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            filter: 'drop-shadow(0 0 30px rgba(236,72,153,0.5))',
                        }}>
                            Happy Birthday
                        </h1>
                        <h2 style={{
                            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                            fontWeight: 600,
                            color: '#e9d5ff',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            margin: 0,
                        }}>
                            <Sparkles style={{ width: 20, height: 20, color: '#f472b6' }} />
                            Madam Jii
                            <Sparkles style={{ width: 20, height: 20, color: '#f472b6' }} />
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                        style={{ width: '100%', maxWidth: 300 }}
                    >
                        <motion.button
                            onClick={onNext}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                width: '100%',
                                padding: '15px 28px',
                                borderRadius: 50,
                                border: 'none',
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                                boxShadow: '0 8px 30px rgba(168,85,247,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            See Our Moments <ArrowRight size={18} strokeWidth={3} />
                        </motion.button>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    )
}
