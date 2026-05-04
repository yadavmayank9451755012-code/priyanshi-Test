"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

// ==========================================
// 🌟 CONTINUOUS PREMIUM CONFETTI RAIN 🌟
// ==========================================
const RainingConfetti = () => {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        // Luxury Aesthetic Colors: Soft Gold, Pure White, Slate Blue, Silver
        const colors = ['#fcd34d', '#ffffff', '#94a3b8', '#64748b', '#e2e8f0']
        
        // 80 pieces for "Bohot Jyada" feel
        const generatedPieces = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animDuration: Math.random() * 4 + 3, // 3 to 7 seconds falling speed
            delay: Math.random() * 5, // Random start delays for continuous feel
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 6, // 6px to 14px size
            isCircle: Math.random() > 0.5 // Mix of circles and rectangles
        }))
        setPieces(generatedPieces)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
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
                        boxShadow: `0 0 10px ${p.color}80` // Subtle glow
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: ['0px', `${Math.random() * 100 - 50}px`, '0px'],
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

// ==========================================
// 🌟 ELEGANT 3D CAKE (Navy & White Theme) 🌟
// ==========================================
const AnimatedCake = () => (
    <motion.div
        className="relative z-10 mt-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
        {/* Soft Back Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none" />

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
                            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500 via-yellow-200 to-white rounded-full blur-[1px]" />
                            <div className="absolute inset-0 bg-yellow-400/40 blur-md scale-150" />
                        </motion.div>
                        <div className="w-1.5 h-8 bg-white/80 border border-white/20 rounded-sm shadow-sm mt-1" />
                    </div>
                ))}
            </div>

            {/* Top layer */}
            <div className="w-24 h-12 bg-white/20 backdrop-blur-md border-t border-white/40 border-l border-white/20 rounded-xl relative mx-auto shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                {[20, 50, 80].map((left, i) => (
                    <div key={i} className="absolute top-0 w-3 h-5 bg-white/60 backdrop-blur-lg rounded-b-full shadow-[0_2px_5px_rgba(0,0,0,0.1)]" style={{ left: `${left}%` }} />
                ))}
            </div>

            {/* Middle layer */}
            <div className="w-32 h-14 bg-[#1B2A3A] border border-white/10 rounded-xl relative mx-auto -mt-2 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                {[15, 40, 65, 85].map((left, i) => (
                    <div key={i} className="absolute top-0 w-3 h-6 bg-white/20 backdrop-blur-xl rounded-b-full" style={{ left: `${left}%` }} />
                ))}
            </div>

            {/* Bottom layer */}
            <div className="w-44 h-16 bg-[#162433] border border-white/5 rounded-xl relative mx-auto -mt-2 shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] overflow-hidden z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                {[10, 25, 45, 60, 75, 90].map((left, i) => (
                    <div key={i} className="absolute top-0 w-3 h-7 bg-[#1B2A3A] shadow-md rounded-b-full" style={{ left: `${left}%` }} />
                ))}
            </div>

            {/* Aesthetic Plate */}
            <div className="w-52 h-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[100%] shadow-[0_10px_20px_rgba(0,0,0,0.5)] -mt-2 z-30 relative">
                <div className="absolute inset-x-4 top-1 h-1 bg-white/20 rounded-full blur-[1px]" />
            </div>
        </div>
    </motion.div>
)

export default function HappyBirthday({ onNext }) {
    
    // Premium Navy Theme Classes
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden ${bgBase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            {/* Live Raining Confetti */}
            <RainingConfetti />

            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
                
                <AnimatedCake />

                <motion.div
                    className="text-center mt-8 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                >
                    <h1 className="text-4xl md:text-6xl font-elegant font-black text-white mb-3 tracking-wide drop-shadow-lg">
                        Happy Birthday
                    </h1>
                    
                    <h2 className="text-xl md:text-2xl font-bold text-[#94a3b8] tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#fcd34d]" />
                        Madam Jii
                        <Sparkles className="w-5 h-5 text-[#fcd34d]" />
                    </h2>
                </motion.div>

                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                >
                    <button
                        onClick={onNext}
                        className={`w-full py-5 text-[14px] uppercase tracking-[0.15em] ${puffyBtnPrimary}`}
                    >
                        See Our Moments <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </motion.div>

            </div>
        </motion.div>
    )
}
