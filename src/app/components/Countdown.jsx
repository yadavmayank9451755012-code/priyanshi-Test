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

    // 2. REAL TIMER (Chalu hoga fast-forward khatam hone k baad)
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
        { label: "Days", value: timeLeft.days, color: "from-pink-500 to-rose-500" },
        { label: "Hours", value: timeLeft.hours, color: "from-purple-500 to-pink-500" },
        { label: "Minutes", value: timeLeft.minutes, color: "from-indigo-500 to-purple-500" },
        { label: "Seconds", value: timeLeft.seconds, color: "from-blue-500 to-indigo-500" },
    ]

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div className="text-center mb-12" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <motion.div className="mb-6" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                    <Cake className="w-16 h-16 text-pink-400 mx-auto" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
                    {isFinished ? "The Wait is Over!" : "Birthday Countdown"}
                </h1>
                <p className="text-lg text-purple-300">
                    {isFinished ? "The moment has finally arrived 💖" : "The magical moment approaches..."}
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl w-full">
                {timeUnits.map((unit) => (
                    <motion.div key={unit.label} className="text-center">
                        <div className={`relative bg-gradient-to-br ${unit.color} rounded-2xl p-6 md:p-8 shadow-xl border border-white/10`} style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(236, 72, 153, 0.2)" }}>
                            <div className="text-3xl md:text-5xl font-bold text-white mb-2 mt-2">
                                {unit.value.toString().padStart(2, "0")}
                            </div>
                            <div className="text-white/90 text-sm md:text-base font-medium uppercase tracking-wider">
                                {unit.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isFinished && !isAnimatingFast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-pink-300 text-sm mb-6 uppercase tracking-[0.3em] font-bold">
                            <Sparkles className="inline w-4 h-4 mr-2" />
                            A special surprise is waiting
                            <Sparkles className="inline w-4 h-4 ml-2" />
                        </p>
                        
                        <motion.button
                            onClick={onNext}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-white/50 flex items-center justify-center gap-3 font-bold tracking-wider mx-auto"
                        >
                            Open the Celebration <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
