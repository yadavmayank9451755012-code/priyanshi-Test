"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Sparkles } from "lucide-react"

export default function Countdown({ onNext, birthdayDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isTimeUp, setIsTimeUp] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = +new Date(birthdayDate) - +new Date()
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
            } else {
                setIsTimeUp(true)
                clearInterval(timer)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [birthdayDate])

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE 3D NEUMORPHISM 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    const puffyCard = `${cardBg} rounded-[28px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5`
    const puffyBox = `${cardBg} rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border border-white/5 flex flex-col items-center justify-center py-4`
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-2 px-6 py-4 w-full uppercase tracking-[0.15em] text-[13px]`

    // 👇 FIXED: Added bg-white so the square white GIF blends perfectly
    const puffyImageCircle = `w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] border-[4px] border-[#1B2A3A] overflow-hidden bg-white`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${bgBase} font-sans`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-pink-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-[360px] z-10">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className={`p-6 text-center ${puffyCard}`}
                >
                    {/* 👈 FIXED GIF CONTAINER */}
                    <div className={puffyImageCircle}>
                        {/* object-contain aur p-2 lagaya hai taaki GIF border ke bahar na nikle aur white bg me mix ho jaye */}
                        <img src="/images/peach-and-goma-peach-loves-goma.gif" alt="Waiting..." className="w-full h-full object-contain p-2 mix-blend-multiply" />
                    </div>

                    <h2 className="text-[14px] font-black text-white mb-1 uppercase tracking-widest mt-4">Priyanshi waiting...</h2>
                    <p className="text-[#94a3b8] mb-8 text-[12px] font-bold">"Yaar aur kitna lamba wait karna padega? 🙄"</p>

                    {/* TIMER GRID */}
                    <div className="grid grid-cols-4 gap-3 mb-8">
                        <div className={puffyBox}>
                            <span className="text-2xl font-black text-white">{timeLeft.days}</span>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Days</span>
                        </div>
                        <div className={puffyBox}>
                            <span className="text-2xl font-black text-white">{timeLeft.hours}</span>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Hrs</span>
                        </div>
                        <div className={puffyBox}>
                            <span className="text-2xl font-black text-white">{timeLeft.minutes}</span>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Mins</span>
                        </div>
                        <div className={puffyBox}>
                            <motion.span 
                                key={timeLeft.seconds}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl font-black text-pink-400"
                            >
                                {timeLeft.seconds}
                            </motion.span>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Secs</span>
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    {isTimeUp ? (
                        <button onClick={onNext} className={puffyBtnPrimary}>
                            <Sparkles size={18} className="text-pink-500" /> Start Celebration!
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-[#64748b] text-[10px] uppercase tracking-widest font-bold mb-2">
                                <Clock size={12} className="inline mr-1" /> Time is ticking...
                            </p>
                            <button onClick={onNext} className={puffyBtnPrimary}>
                                I Can't Wait! (Skip) <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}
