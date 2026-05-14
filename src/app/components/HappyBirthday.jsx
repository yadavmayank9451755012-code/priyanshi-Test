"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import TiltCard from "./TiltCard"
import { BIRTHDAY_INFO } from "../data/content"

// Raining Confetti - Pink/Purple/Gold Theme
const RainingConfetti = () => {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        const colors = ['#f472b6', '#a855f7', '#fcd34d', '#ffffff']
        
        const generatedPieces = Array.from({ length: 80 }).map((_, i) => ({
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
                        boxShadow: `0 0 10px ${p.color}80`
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

// Elegant CSS Cake with Flickering Flame
const AnimatedCake = () => (
    <motion.div
        className="relative z-10 mt-8 mx-auto"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
        {/* Soft Back Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-300/20 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="cake">
            <div className="plate"></div>
            
            {/* Candle with Flickering Flame */}
            <div className="candle">
                <div className="flame"></div>
            </div>
            
            {/* Top Layer */}
            <div className="layer layer-top">
                <div className="icing"></div>
                <div className="drip drip1"></div>
                <div className="drip drip2"></div>
                <div className="drip drip3"></div>
            </div>
            
            {/* Middle Layer */}
            <div className="layer layer-middle"></div>
            
            {/* Bottom Layer */}
            <div className="layer layer-bottom"></div>
        </div>
    </motion.div>
)

export default function HappyBirthday({ onNext }) {
    const reveal = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-aesthetic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-200/30 blur-[100px] rounded-full" />
            </div>

            {/* Live Raining Confetti */}
            <RainingConfetti />

            <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
                
                {/* 3D Neumorphism Card Container */}
                <TiltCard className="glass-card p-8 md:p-12 w-full flex flex-col items-center">
                    <motion.div variants={reveal} initial="hidden" animate="show" className="w-full flex flex-col items-center">
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}>
                        <AnimatedCake />
                    </motion.div>

                    <div
                        className="text-center mt-10 mb-10"
                    >
                        <motion.h1
                            variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } }}
                            className="text-5xl md:text-7xl font-bold text-[#973b88] mb-3 tracking-wide drop-shadow-lg font-heading"
                            style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>
                            Happy Birthday
                        </motion.h1>
                        
                        <motion.h2
                            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                            className="text-2xl md:text-3xl font-bold text-[#77537e] tracking-[0.15em] uppercase flex items-center justify-center gap-2 font-cute"
                        >
                            <Sparkles className="w-6 h-6 text-[#f472b6]" />
                            {BIRTHDAY_INFO.name}
                            <Sparkles className="w-6 h-6 text-[#f472b6]" />
                        </motion.h2>
                    </div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                        className="w-full max-w-[320px]"
                    >
                        <button
                            onClick={onNext}
                            className="glass-button text-[#973b88] px-8 py-4 font-bold flex items-center justify-center gap-3 w-full uppercase tracking-[0.12em] text-[14px] rounded-2xl"
                        >
                            See Our Moments <ArrowRight size={18} strokeWidth={3} />
                        </button>
                    </motion.div>
                    </motion.div>
                </TiltCard>

            </div>
        </motion.div>
    )
}
