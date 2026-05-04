"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, ArrowRight, Sparkles } from "lucide-react"

export default function Countdown({ birthdayDate, onNext }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isAnimatingFast, setIsAnimatingFast] = useState(true)
    const [isFinished, setIsFinished] = useState(false)

    // Helper: ms convertor
    const msToTime = (distance) => ({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
    })

    // 1. FAST-FORWARD REWIND EFFECT
    useEffect(() => {
        const targetMs = Math.max(0, birthdayDate.getTime() - new Date().getTime())
        const startMs = 5 * 365 * 24 * 60 * 60 * 1000 // Start from 5 years fake time
        const duration = 3500 // 3.5 seconds
        const startTime = performance.now()
        let animFrame

        const animateTimer = (time) => {
            const elapsed = time - startTime
            const p = Math.min(elapsed / duration, 1)
            
            // easeOutExpo for dramatic break effect
            const easeOutExpo = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
            const currentMs = startMs - (startMs - targetMs) * easeOutExpo

            setTimeLeft(msToTime(currentMs))

            if (p < 1) {
                animFrame = requestAnimationFrame(animateTimer)
            } else {
                setIsAnimatingFast(false)
                if (targetMs <= 0) setIsFinished(true)
            }
        }
        animFrame = requestAnimationFrame(animateTimer)
        return () => cancelAnimationFrame(animFrame)
    }, [birthdayDate])

    // 2. REAL TIMER
    useEffect(() => {
        if (isAnimatingFast || isFinished) return

        const timer = setInterval(() => {
            const distance = birthdayDate.getTime() - new Date().getTime()
            if (distance <= 0) {
                clearInterval(timer)
                setTimeLeft(msToTime(0))
                setIsFinished(true)
            } else {
                setTimeLeft(msToTime(distance))
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [isAnimatingFast, isFinished, birthdayDate])

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ]

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE & WHITE THEME 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    // UI Classes
    // 👈 YAHAN CHANGES KIYE HAIN: White Dabbe with subtle 3D shadow
    const puffyWhiteBox = `bg-[#f8fafc] rounded-[24px] shadow-[8px_8px_16px_#111b25,-4px_-4px_12px_rgba(255,255,255,0.05)] border border-white flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden`
    const puffyBtnPrimary = `w-full bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-2`
    const puffyCircleBtn = `w-20 h-20 ${cardBg} rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f]`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgBase} text-white font-sans relative overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
                
                {/* Header */}
                <motion.div className="text-center mb-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <motion.div 
                        className={puffyCircleBtn} 
                        animate={{ rotate: [0, 5, -5, 0] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Cake className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h1 className="text-3xl md:text-5xl font-elegant font-black text-white mb-3 tracking-wide">
                        {isFinished ? "The Wait is Over" : "Countdown Begins"}
                    </h1>
                    <p className="text-[#94a3b8] text-[11px] md:text-[13px] font-bold tracking-[0.2em] uppercase">
                        {isFinished ? "The moment has arrived ✨" : "A magical moment approaches..."}
                    </p>
                </motion.div>

                {/* 3D Countdown Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 w-full px-2">
                    {timeUnits.map((unit) => (
                        <motion.div key={unit.label} className="text-center w-full">
                            <div className={puffyWhiteBox}>
                                {/* Numbers (Ab Deep Navy Blue hain) */}
                                <div className="text-4xl md:text-6xl font-black text-[#162433] mb-2 mt-2 drop-shadow-sm">
                                    {unit.value.toString().padStart(2, "0")}
                                </div>
                                {/* Labels (Ab Slate Gray hain) */}
                                <div className="text-[#64748b] text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                                    {unit.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Final Surprise Button */}
                <AnimatePresence>
                    {isFinished && !isAnimatingFast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-14 text-center w-full max-w-[320px]"
                        >
                            <p className="text-[#94a3b8] text-[10px] mb-6 uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3 text-white" />
                                A special surprise is waiting
                                <Sparkles className="w-3 h-3 text-white" />
                            </p>
                            
                            <button
                                onClick={onNext}
                                className={`py-5 text-[13px] uppercase tracking-[0.15em] ${puffyBtnPrimary}`}
                            >
                                Open the Celebration <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
