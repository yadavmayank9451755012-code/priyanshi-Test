"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function HappyBirthday({ onNext }) {
    const [balloonCount, setBalloonCount] = useState(5)
    const [confettiBursts, setConfettiBursts] = useState([])

    useEffect(() => {
        const updateBalloonCount = () => {
            setBalloonCount(window.innerWidth >= 768 ? 15 : 8)
        }
        updateBalloonCount()
        window.addEventListener('resize', updateBalloonCount)
        return () => window.removeEventListener('resize', updateBalloonCount)
    }, [])

    // ==========================================
    // INTERACTIVE CONFETTI ON CLICK
    // ==========================================
    const handleScreenTap = (e) => {
        const id = Date.now()
        // Record X and Y coordinates of the click
        const newBurst = { id, x: e.clientX, y: e.clientY }
        setConfettiBursts(prev => [...prev, newBurst])

        // Remove burst from DOM after animation completes (2 seconds)
        setTimeout(() => {
            setConfettiBursts(prev => prev.filter(b => b.id !== id))
        }, 2000)
    }

    const ConfettiExplosion = ({ x, y }) => {
        const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#f43f5e', '#facc15']
        return (
            <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180)
                    const radius = Math.random() * 80 + 40
                    return (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[i % colors.length] }}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ 
                                x: Math.cos(angle) * radius, 
                                y: Math.sin(angle) * radius + 50, // Slight gravity effect
                                scale: [0, 1.5, 0], 
                                opacity: [1, 1, 0] 
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                    )
                })}
            </div>
        )
    }

    // ==========================================
    // PREMIUM GLASSMORPHISM CAKE
    // ==========================================
    const AnimatedCake = () => (
        <motion.div
            className="relative z-10 mt-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Massive Back Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex flex-col items-center">
                {/* Candles & Flames */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[60px] flex justify-between z-20">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="relative flex flex-col items-center">
                            <motion.div
                                className="relative w-3 h-5"
                                animate={{ scaleY: [1, 1.2, 1], scaleX: [1, 0.9, 1], y: [0, -2, 0] }}
                                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-full blur-[1px]" />
                                <div className="absolute inset-0 bg-yellow-400/50 blur-md scale-150" />
                            </motion.div>
                            <div className="w-1.5 h-8 bg-gradient-to-b from-white/80 to-white/20 backdrop-blur-md border border-white/40 rounded-sm shadow-sm mt-1" />
                        </div>
                    ))}
                </div>

                {/* Top layer (Glassmorphism) */}
                <div className="w-24 h-12 bg-white/10 backdrop-blur-md border-t border-white/40 border-l border-white/20 rounded-xl relative mx-auto shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-300/20 to-transparent" />
                    {/* Glowing drips */}
                    {[20, 50, 80].map((left, i) => (
                        <div key={i} className="absolute top-0 w-3 h-5 bg-white/40 backdrop-blur-lg rounded-b-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ left: `${left}%` }} />
                    ))}
                </div>

                {/* Middle layer */}
                <div className="w-32 h-14 bg-white/5 backdrop-blur-lg border-t border-white/30 border-l border-white/10 rounded-xl relative mx-auto -mt-2 shadow-[0_0_30px_rgba(236,72,153,0.15)] overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-400/10 to-transparent" />
                    {[15, 40, 65, 85].map((left, i) => (
                        <div key={i} className="absolute top-0 w-3 h-6 bg-pink-200/50 backdrop-blur-xl rounded-b-full shadow-[0_0_15px_rgba(236,72,153,0.4)]" style={{ left: `${left}%` }} />
                    ))}
                </div>

                {/* Bottom layer */}
                <div className="w-44 h-16 bg-white/5 backdrop-blur-xl border-t border-white/20 border-l border-white/5 rounded-xl relative mx-auto -mt-2 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden z-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/10 to-transparent" />
                    {[10, 25, 45, 60, 75, 90].map((left, i) => (
                        <div key={i} className="absolute top-0 w-3 h-7 bg-white/30 backdrop-blur-md rounded-b-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ left: `${left}%` }} />
                    ))}
                </div>

                {/* Aesthetic Plate */}
                <div className="w-52 h-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[100%] shadow-[0_10px_30px_rgba(0,0,0,0.5)] -mt-2 z-30 relative">
                    <div className="absolute inset-x-4 top-1 h-1 bg-white/20 rounded-full blur-[1px]" />
                </div>
            </div>
        </motion.div>
    )

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#050505] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            onClick={handleScreenTap} // 👈 TAP KAHIN BHI KARO, CONFETTI UDEGA
        >
            {/* Background Vibe */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.15) 0%, transparent 60%)" }} />
            
            <p className="absolute top-10 text-white/20 text-xs tracking-[0.3em] uppercase font-bold animate-pulse pointer-events-none">
                Tap anywhere to celebrate ✨
            </p>

            {/* Render Confetti Bursts */}
            {confettiBursts.map(burst => (
                <ConfettiExplosion key={burst.id} x={burst.x} y={burst.y} />
            ))}

            <motion.div
                className="text-center mb-8 relative z-10 pointer-events-none" // pointer-events-none taaki click niche screen pe jaye
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
                <div className="mb-12">
                    <AnimatedCake />
                </div>

                <motion.h1
                    className="text-6xl md:text-8xl py-2 font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500 mb-2 relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    style={{ filter: "drop-shadow(0 10px 20px rgba(236,72,153,0.3))" }}
                >
                    Happy Birthday
                </motion.h1>

                <motion.h2
                    className="text-3xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                >
                    Madam Jii 💕
                </motion.h2>
            </motion.div>

            <motion.div
                className="relative z-20 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
                {/* Button glow */}
                <motion.div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{ background: "linear-gradient(to right, #ec4899, #a855f7, #6366f1)", opacity: 0.4 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // 👈 Prevent screen tap from firing twice here
                        handleScreenTap(e);  // Trigger burst specifically on button
                        setTimeout(onNext, 500); // Thoda ruk ke next page taaki burst dikhe
                    }}
                    className="relative group bg-white/5 backdrop-blur-xl border border-white/20 text-white text-lg px-10 py-5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] active:scale-95"
                >
                    <motion.div className="flex items-center space-x-3 font-bold tracking-widest uppercase text-sm">
                        <span>See Our Moments</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </motion.div>
                </button>
            </motion.div>
        </motion.div>
    )
}
