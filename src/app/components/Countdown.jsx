"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Clock, Sparkles, Send, Check } from "lucide-react"

// ==========================================
// TELEGRAM BOT SETUP
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

export default function Countdown({ onNext, birthdayDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isTimeUp, setIsTimeUp] = useState(false)
    
    // 🎵 Custom States
    const [skipProgress, setSkipProgress] = useState(0)
    const [canSkip, setCanSkip] = useState(false)
    const [showMocking, setShowMocking] = useState(false)
    
    // 📩 Message States
    const [userMessage, setUserMessage] = useState("")
    const [isSent, setIsSent] = useState(false)

    // 1. Timer Logic
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

    // 2. 10 Second Unlocking Circle Logic (Only runs if timer is not up)
    useEffect(() => {
        if (isTimeUp || showMocking) return;
        
        const interval = setInterval(() => {
            setSkipProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setCanSkip(true)
                    return 100
                }
                return prev + 1 
            })
        }, 100) 

        return () => clearInterval(interval)
    }, [isTimeUp, showMocking])

    // Telegram Send Logic
    const handleSendMessage = async () => {
        setIsSent(true)
        const text = `💌 *Priyanshi Tried to Skip the Countdown!*\n\n*Her Message:* ${userMessage || "Sirf gussa karke chhod diya (No text)"}`
        try {
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
            })
        } catch (e) { }
    }

    // Circle Math
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (skipProgress / 100) * circumference;

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE 3D NEUMORPHISM 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    const puffyCard = `${cardBg} rounded-[28px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5`
    const puffyBox = `${cardBg} rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border border-white/5 flex flex-col items-center justify-center py-5`
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-2 px-6 py-4 w-full uppercase tracking-[0.15em] text-[13px]`
    const lockedBtn = `bg-[#1B2A3A] text-[#64748b] rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-extrabold flex items-center justify-center gap-3 px-6 py-4 w-full uppercase tracking-[0.15em] text-[13px] opacity-80 cursor-not-allowed`
    const puffyInput = `${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border-none text-white placeholder-[#64748b] focus:outline-none p-4 font-medium text-sm w-full resize-none h-24 mb-4`

    const puffyImageCircle = `w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] border-[4px] border-[#1B2A3A] overflow-hidden bg-white`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${bgBase} font-sans`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-pink-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-[360px] z-10 relative">
                <AnimatePresence mode="wait">
                    
                    {/* ======================================= */}
                    {/* 🎭 STATE 1: MOCKING (CHIDHANE WALI SCREEN) */}
                    {/* ======================================= */}
                    {showMocking && !isTimeUp ? (
                        <motion.div 
                            key="mocking"
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            className={`p-6 text-center ${puffyCard}`}
                        >
                            <div className={puffyImageCircle}>
                                {/* JEEBH DIKHANE WALA GIF */}
                                <img src="/images/airallia-cat-chan.gif" alt="Teasing" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                            </div>

                            <h2 className="text-[15px] font-black text-pink-400 mb-1 uppercase tracking-widest mt-4">
                                Hehehe! 😜
                            </h2>
                            <p className="text-[#94a3b8] mb-6 text-[13px] font-bold leading-relaxed">
                                "Aise kaise aage jane du? Wait karo birthday ki date aane ka chup chaap!"
                            </p>

                            {!isSent ? (
                                <>
                                    <div className="text-left w-full">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#94a3b8] mb-2 block">Kuch likhna chahoge? (Optional)</label>
                                        <textarea 
                                            className={puffyInput}
                                            placeholder="Gaaliyan bhi allowed hain... 🤐" 
                                            value={userMessage} 
                                            onChange={(e) => setUserMessage(e.target.value)} 
                                        />
                                    </div>
                                    <button onClick={handleSendMessage} className={puffyBtnPrimary}>
                                        Send Message <Send size={16} strokeWidth={2.5} />
                                    </button>
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 mt-2 text-white text-[13px] font-bold ${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]`}>
                                    <Check className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                                    Message delivered successfully! Ab wapas timer dekho.
                                </motion.div>
                            )}

                            <button onClick={() => setShowMocking(false)} className={`w-full py-4 mt-4 text-[#94a3b8] hover:text-white uppercase tracking-widest text-[11px] font-bold transition-colors`}>
                                Back to Timer
                            </button>
                        </motion.div>
                    ) : (

                    /* ======================================= */
                    /* ⏳ STATE 2: NORMAL COUNTDOWN SCREEN       */
                    /* ======================================= */
                        <motion.div 
                            key="timer"
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`p-6 text-center ${puffyCard}`}
                        >
                            {/* WAITING GIF */}
                            <div className={puffyImageCircle}>
                                <img src="/images/peach-and-goma-peach-loves-goma.gif" alt="Waiting..." className="w-full h-full object-contain p-2 mix-blend-multiply" />
                            </div>

                            <h2 className="text-[14px] font-black text-white mb-1 uppercase tracking-widest mt-4">Priyanshi waiting...</h2>
                            <p className="text-[#94a3b8] mb-8 text-[12px] font-bold">"Yaar aur kitna lamba wait karna padega? 🙄"</p>

                            {/* ⬛ CLEAN BADA TIMER GRID */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                <div className={puffyBox}>
                                    <span className="text-3xl font-black text-white">{timeLeft.days}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Days</span>
                                </div>
                                <div className={puffyBox}>
                                    <span className="text-3xl font-black text-white">{timeLeft.hours}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Hrs</span>
                                </div>
                                <div className={puffyBox}>
                                    <span className="text-3xl font-black text-white">{timeLeft.minutes}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-[#64748b] font-bold mt-1">Mins</span>
                                </div>
                                <div className={puffyBox}>
                                    <motion.span 
                                        key={timeLeft.seconds}
                                        initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        className="text-3xl font-black text-pink-400" // Sirf seconds pink rakha hai taaki thodi movement dikhe
                                    >
                                        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
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
                                    {!canSkip ? (
                                        <button disabled className={lockedBtn}>
                                            <span>Unlocking</span>
                                            <svg className="w-5 h-5 -rotate-90">
                                                <circle cx="10" cy="10" r={radius} fill="transparent" stroke="#334155" strokeWidth="3" />
                                                <circle 
                                                    cx="10" cy="10" r={radius} 
                                                    fill="transparent" 
                                                    stroke="#f472b6" 
                                                    strokeWidth="3"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-100 ease-linear"
                                                />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button onClick={() => setShowMocking(true)} className={puffyBtnPrimary}>
                                            I Can't Wait! (Skip) <ArrowRight size={16} strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
