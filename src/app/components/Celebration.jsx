"use client"

import { motion } from "framer-motion"
import { Gift, Sparkles, Heart } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function Celebration({ onNext }) {
    
    // 🌟 PREMIUM CONFETTI COLORS (Gold, White, Slate Blue) 🌟
    const colors = ["#fcd34d", "#ffffff", "#94a3b8", "#e2e8f0"]
    
    useEffect(() => {
        const duration = 2500
        const end = Date.now() + duration

        const frame = () => {
            const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

            for (let i = 0; i < 2; i++) {
                confetti({
                    particleCount: 2,
                    angle: i === 0 ? 60 : 120,
                    spread: 60,
                    origin: { x: i === 0 ? -0.1 : 1.1 },
                    colors: [randomColor()],
                    zIndex: 100
                })
            }

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }

        frame()
    }, [])

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE 3D NEUMORPHISM 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    // UI Classes
    const puffyCircleBtn = `w-32 h-32 ${cardBg} rounded-full flex items-center justify-center mx-auto mb-8 shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#25394f] border border-white/5 relative overflow-hidden`
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3 px-10 py-5`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgBase} text-white font-sans relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center">
                
                {/* 3D Gift Icon */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 8, -8, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className={puffyCircleBtn}>
                            {/* Inner Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            />
                            <Gift className="w-14 h-14 text-white relative z-10" strokeWidth={1.5} />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Celebration Text */}
                <motion.h1
                    className="text-4xl md:text-5xl font-elegant font-black text-white mb-4 tracking-wide"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Time to Celebrate
                </motion.h1>

                <motion.p
                    className="text-[13px] font-bold text-[#94a3b8] tracking-[0.2em] uppercase mb-12 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Sparkles className="w-4 h-4 text-[#fcd34d]" />
                    The countdown is over
                    <Sparkles className="w-4 h-4 text-[#fcd34d]" />
                </motion.p>

                {/* Final Button */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="w-full"
                >
                    <button
                        onClick={onNext}
                        className={`w-full text-[14px] uppercase tracking-[0.15em] ${puffyBtnPrimary}`}
                    >
                        Let's Celebrate! <Heart className="w-5 h-5 ml-1 text-[#162433] fill-[#162433]/20" />
                    </button>
                </motion.div>

                <motion.p
                    className="mt-8 text-[#64748b] text-[10px] font-bold uppercase tracking-[0.2em]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    Click to start the magic
                </motion.p>
            </div>
        </motion.div>
    )
}
