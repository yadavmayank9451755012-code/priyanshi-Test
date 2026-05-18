"use client"

import { motion } from "framer-motion"
import { Gift, Sparkles, Heart, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import TiltCard from "./TiltCard"
import { useEffect } from "react"

export default function Celebration({ onNext, finalScore }) {
    
    // Premium Confetti Colors (Blue, Sky, Gold)
    const colors = ["#60a5fa", "#3b82f6", "#fcd34d", "#ffffff"]
    
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-aesthetic text-[#334155] font-sans relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-sky-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-200/30 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
                
                {/* Premium Card Container */}
                <TiltCard
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="glass-card p-10 md:p-12 w-full max-w-[460px] preserve-3d"
                >
                    {/* Gift Icon with Animation */}
                    <motion.div
                        variants={itemVariants}
                        animate={{
                            rotateY: [0, 180, 360],
                            y: [0, -10, 0],
                        }}
                        transition={{
                            rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="neu-image-frame w-28 h-28 flex items-center justify-center mx-auto mb-8 shadow-[0_15px_35px_rgba(151,59,136,0.2)]"
                    >
                        <Gift className="w-14 h-14 text-[#2563eb]" strokeWidth={1.5} />
                    </motion.div>

                    {/* Celebration Text */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-bold text-[#2563eb] mb-4 drop-shadow font-heading"
                        style={{
                            filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))",
                        }}
                    >
                        Time to Celebrate
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-[14px] font-bold text-[#334155] tracking-[0.15em] uppercase mb-8 flex items-center justify-center gap-2 font-cute"
                    >
                        <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                        The countdown is over
                        <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                    </motion.p>

                    {finalScore !== undefined && (
                        <motion.p
                            variants={itemVariants}
                            className="text-[18px] font-bold text-[#334155] tracking-[0.15em] uppercase mb-8 flex items-center justify-center gap-2 font-cute"
                        >
                            Score: {finalScore}/100
                        </motion.p>
                    )}

                    {/* Final Button */}
                    <motion.div
                        variants={itemVariants}
                    >
                        <button
                            onClick={onNext}
                            className="glass-button text-[#2563eb] px-8 py-4 font-bold flex items-center justify-center gap-3 w-full uppercase tracking-[0.12em] text-[14px] rounded-2xl"
                        >
                            Let's Celebrate <Heart className="w-5 h-5 ml-1 text-[#2563eb] fill-[#2563eb]/30" /> <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </TiltCard>

                <motion.p
                    className="mt-8 text-[#334155]/60 text-[11px] font-medium uppercase tracking-[0.2em]"
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
