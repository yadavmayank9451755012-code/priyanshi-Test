"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight, Sparkles } from "lucide-react"

// ==========================================
// 🌟 CONTINUOUS PREMIUM CONFETTI RAIN 🌟
// ==========================================
const RainingConfetti = () => {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        const colors = ['#fcd34d', '#ffffff', '#94a3b8', '#64748b', '#e2e8f0']
        const generatedPieces = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animDuration: Math.random() * 4 + 3, 
            delay: Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 6,
            isCircle: Math.random() > 0.5 
        }))
        setPieces(generatedPieces)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {pieces.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute top-[-10%]"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.isCircle ? p.size : p.size * 1.5,
                        backgroundColor: p.color,
                        borderRadius: p.isCircle ? '50%' : '2px',
                        boxShadow: `0 0 10px ${p.color}80`
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: ['0px', `${Math.random() * 50 - 25}px`, '0px'],
                        rotate: [0, Math.random() * 360 + 360],
                    }}
                    transition={{
                        duration: p.animDuration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}

export default function Loader({ onComplete }) {
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE THEME CLASSES 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3 px-10 py-4 uppercase tracking-[0.15em] text-[13px]`
    const puffyCircle = `w-24 h-24 ${cardBg} rounded-full flex items-center justify-center shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] border border-white/5 relative`

    return (
        <motion.div
            className={`flex flex-col items-center justify-center min-h-screen relative overflow-hidden ${bgBase} font-sans`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            {/* Live Raining Confetti */}
            <RainingConfetti />

            {/* 🌊 Curved Image Section (Adapted for Navy Theme) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/girl.jpg" 
                    alt="Background"
                    className="absolute bottom-0 right-0 h-[75%] object-cover opacity-60 mix-blend-luminosity"
                />

                {/* Gradient overlay for smooth blend into Navy Blue */}
                <div className={`absolute inset-0 bg-gradient-to-l from-transparent via-[${bgBase}]/60 to-[${bgBase}]`}></div>

                {/* Curve effect with 3D shadow matching the theme */}
                <div className={`absolute bottom-0 right-0 w-[80%] h-[80%] ${bgBase} rounded-tl-[120px] shadow-[-10px_-10px_30px_rgba(17,27,37,0.5)]`}></div>
            </div>

            {/* 🌟 Glowing Aura Behind Loader */}
            <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none z-0"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 🌟 Main Content */}
            <div className="text-center relative z-20 flex flex-col items-center max-w-sm px-4">

                {/* 3D Neumorphic Loader Animation */}
                <div className="relative mb-10">
                    <motion.div 
                        className="absolute inset-0 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <div className={puffyCircle}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart className="w-10 h-10 text-white fill-white/20 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                        </motion.div>
                    </div>
                </div>

                {/* Title */}
                <motion.h1
                    className="text-3xl md:text-4xl font-elegant font-black text-white tracking-wide mb-3 drop-shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Preparing Magic
                </motion.h1>

                {/* Button / Text */}
                <div className="h-20 mt-4 flex items-center justify-center w-full">
                    <AnimatePresence mode="wait">
                        {showButton ? (
                            <motion.button
                                key="btn"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onComplete}
                                className={puffyBtnPrimary}
                            >
                                Continue <ArrowRight size={18} strokeWidth={3} />
                            </motion.button>
                        ) : (
                            <motion.p
                                key="text"
                                className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Sparkles className="w-4 h-4 text-[#fcd34d]" />
                                Please wait...
                                <Sparkles className="w-4 h-4 text-[#fcd34d]" />
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
