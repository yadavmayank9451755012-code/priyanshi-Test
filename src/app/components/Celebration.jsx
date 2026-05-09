"use client"

import { motion } from "framer-motion"
import { Gift, Sparkles, Heart, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function Celebration({ onNext }) {
    
    // Premium Confetti Colors (Pink, Purple, Gold)
    const colors = ["#f472b6", "#a855f7", "#fcd34d", "#ffffff"]
    
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

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdf7ff] text-[#77537e] font-sans relative overflow-hidden bg-polka-dots"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-200/30 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
                
                {/* Premium Card Container */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#fff8fc] p-8 md:p-10 rounded-[60px] shadow-[0_25px_50px_-12px_rgba(151,59,136,0.25)] w-full max-w-[420px]"
                >
                    {/* Gift Icon with Animation */}
                    <motion.div
                        animate={{
                            rotate: [0, 8, -8, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-b from-white/80 to-pink-200 shadow-inner"
                    >
                        <Gift className="w-14 h-14 text-[#973b88]" strokeWidth={1.5} />
                    </motion.div>

                    {/* Celebration Text */}
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-[#973b88] mb-4 drop-shadow"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))",
                        }}
                    >
                        Time to Celebrate
                    </motion.h1>

                    <motion.p
                        className="text-[14px] font-medium text-[#77537e] tracking-[0.15em] uppercase mb-8 flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Sparkles className="w-4 h-4 text-[#f472b6]" />
                        The countdown is over
                        <Sparkles className="w-4 h-4 text-[#f472b6]" />
                    </motion.p>

                    {/* Final Button */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    >
                        <button
                            onClick={onNext}
                            className="bg-[#f1caeb] text-[#973b88] transition-all duration-300 rounded-[24px] px-8 py-4 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#f5d4f0] active:scale-95 w-full uppercase tracking-[0.12em] text-[13px]"
                        >
                            Let's Celebrate <Heart className="w-5 h-5 ml-1 text-[#973b88] fill-[#973b88]/30" /> <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </motion.div>

                <motion.p
                    className="mt-8 text-[#77537e]/60 text-[11px] font-medium uppercase tracking-[0.2em]"
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
