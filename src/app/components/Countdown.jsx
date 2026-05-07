"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Check } from "lucide-react"

// ==========================================
// TELEGRAM BOT SETUP
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

// ✨ PREMIUM SPARKLES DATA
const sparkles = [
  { top: "15%", left: "20%", size: 14, color: "#fcd34d", delay: 0 },
  { top: "10%", left: "80%", size: 18, color: "#f9a8d4", delay: 0.3 },
  { top: "45%", left: "8%", size: 16, color: "#fcd34d", delay: 0.2 },
  { top: "50%", left: "90%", size: 20, color: "#f9a8d4", delay: 0.8 },
  { top: "80%", left: "15%", size: 14, color: "#ffffff", delay: 1.0 },
  { top: "75%", left: "85%", size: 18, color: "#fcd34d", delay: 0.4 },
]

export default function Countdown({ onNext, birthdayDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 9999, hours: 99, minutes: 99, seconds: 99 })
    const [isTimeUp, setIsTimeUp] = useState(false)
    
    // 🚀 TIME TRAVEL / SCRAMBLING STATE
    const [isScrambling, setIsScrambling] = useState(true)

    // 🎵 Custom States
    const [skipProgress, setSkipProgress] = useState(0)
    const [canSkip, setCanSkip] = useState(false)
    const [gameState, setGameState] = useState("timer") 
    const [userMessage, setUserMessage] = useState("")

    // ==========================================
    // 1. HYPER-DRIVE SCRAMBLE EFFECT (Fast drop from 9999)
    // ==========================================
    useEffect(() => {
        if (isScrambling) {
            let currentFakeDays = 9999;
            const targetDate = new Date(birthdayDate);
            
            const scrambleInterval = setInterval(() => {
                const diff = +targetDate - +new Date();
                const realDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                currentFakeDays -= 142; // Is speed se days girenge
                
                if (currentFakeDays <= realDays) {
                    setIsScrambling(false); // Stop Scrambling!
                    clearInterval(scrambleInterval);
                } else {
                    setTimeLeft({
                        days: currentFakeDays,
                        hours: Math.floor(Math.random() * 99),
                        minutes: Math.floor(Math.random() * 99),
                        seconds: Math.floor(Math.random() * 99),
                    });
                }
            }, 30); // Har 30ms me number badlega (Super fast)

            return () => clearInterval(scrambleInterval);
        }
    }, [isScrambling, birthdayDate]);

    // ==========================================
    // 2. NORMAL TIMER LOGIC (Locks in after scramble)
    // ==========================================
    useEffect(() => {
        if (isScrambling) return; 
        
        const updateRealTime = () => {
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
            }
        }

        updateRealTime() // Ek baar turant set karo taaki jhatka na lage
        const timer = setInterval(updateRealTime, 1000)
        return () => clearInterval(timer)
    }, [isScrambling, birthdayDate])

    // ==========================================
    // 3. 10 SECOND UNLOCKING LOGIC 
    // ==========================================
    useEffect(() => {
        if (isTimeUp || gameState !== "timer" || isScrambling) return;
        
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
    }, [isTimeUp, gameState, isScrambling])

    // ==========================================
    // 4. TELEGRAM SEND LOGIC
    // ==========================================
    const handleSendMessage = async () => {
        const text = `💌 *Priyanshi Tried to Skip the Countdown!*\n\n*Her Message:* ${userMessage || "Sirf gussa karke chhod diya (No text)"}`
        try {
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
            })
        } catch (e) { }
        setGameState("timer") 
        setUserMessage("")
    }

    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (skipProgress / 100) * circumference;

    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyCard = `${cardBg} rounded-[28px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5`
    const puffyBox = `${cardBg} rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border border-white/5 flex flex-col items-center justify-center py-6 overflow-hidden`
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-2 px-6 py-4 w-full uppercase tracking-[0.15em] text-[13px]`
    const lockedBtn = `bg-[#1B2A3A] text-[#64748b] rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-extrabold flex items-center justify-center gap-3 px-6 py-4 w-full uppercase tracking-[0.15em] text-[13px] opacity-80 cursor-not-allowed`

    return (
        <motion.div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${bgBase} font-sans`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}>
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-pink-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="absolute inset-0 pointer-events-none z-0">
                {sparkles.map((s, i) => (
                <motion.div key={i} className="absolute" style={{ top: s.top, left: s.left }} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8], rotate: [0, 20, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}>
                    <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={s.color}>
                    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
                    </svg>
                </motion.div>
                ))}
            </div>

            <div className="w-full max-w-[360px] z-10 relative">
                <AnimatePresence mode="wait">
                    
                    {/* STATE 1: TIMER */}
                    {gameState === "timer" && (
                        <motion.div key="timer" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`p-6 text-center ${puffyCard}`}>
                            
                            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] border-[4px] border-[#1B2A3A] overflow-hidden bg-white">
                                <img src="/images/peach-and-goma-peach-loves-goma.gif" alt="Waiting" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                            </div>

                            <h2 className="text-[14px] font-black text-white mb-6 uppercase tracking-widest">
                                {isScrambling ? "Calculating Time..." : "Priyanshi waiting..."}
                            </h2>

                            {/* ⬛ BIG 2x2 GRID TIMER */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { l: "Days", v: timeLeft.days },
                                    { l: "Hours", v: timeLeft.hours },
                                    { l: "Mins", v: timeLeft.minutes },
                                    { l: "Secs", v: timeLeft.seconds }
                                ].map((t, idx) => (
                                    <div key={idx} className={puffyBox}>
                                        <AnimatePresence mode="popLayout">
                                            <motion.span 
                                                // Magic trick: Agar scrambling chal rahi hai toh animation mat karo, bas text badlo
                                                key={isScrambling ? "scrambling" : t.v}
                                                initial={{ y: isScrambling ? 0 : -20, opacity: isScrambling ? 1 : 0, filter: isScrambling ? "blur(0px)" : "blur(4px)" }}
                                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                                exit={{ y: isScrambling ? 0 : 20, opacity: isScrambling ? 1 : 0, filter: isScrambling ? "blur(0px)" : "blur(4px)" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={`text-4xl font-black ${isScrambling ? "text-pink-400" : "text-white"}`}
                                            >
                                                {t.v < 10 ? `0${t.v}` : t.v}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mt-2">{t.l}</span>
                                    </div>
                                ))}
                            </div>

                            {isTimeUp ? (
                                <button onClick={onNext} className={puffyBtnPrimary}>Start Celebration! 🎉</button>
                            ) : (
                                !canSkip ? (
                                    <button disabled className={lockedBtn}>
                                        <span>{isScrambling ? "Syncing..." : "Unlocking"}</span>
                                        <svg className="w-5 h-5 -rotate-90">
                                            <circle cx="10" cy="10" r={radius} fill="transparent" stroke="#334155" strokeWidth="3" />
                                            <circle cx="10" cy="10" r={radius} fill="transparent" stroke="#f472b6" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-100 ease-linear"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={() => setGameState("mocking")} className={puffyBtnPrimary}>
                                        Skip Countdown <ArrowRight size={16} strokeWidth={3} />
                                    </button>
                                )
                            )}
                        </motion.div>
                    )}

                    {/* STATE 2: MOCKING */}
                    {gameState === "mocking" && (
                        <motion.div key="mocking" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] border-[4px] border-[#1B2A3A] overflow-hidden bg-white">
                                <img src="/images/airallia-cat-chan.gif" alt="Teasing" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                            </div>
                            <h2 className="text-[16px] font-black text-pink-400 mb-2 uppercase tracking-widest mt-4">Hehehe! 😜</h2>
                            <p className="text-[#94a3b8] mb-8 text-[13px] font-bold leading-relaxed">
                                "Badi jaldi machi hai? Aise kaise aage jane du? Wait karo birthday ki date aane ka chup chaap!"
                            </p>
                            <button onClick={() => setGameState("message")} className={puffyBtnPrimary}>
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* STATE 3: MESSAGE BOX */}
                    {gameState === "message" && (
                        <motion.div key="msg" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`p-6 text-center ${puffyCard}`}>
                            <h3 className="text-[13px] font-black text-white uppercase mb-6 tracking-widest">Kuch likhna chahoge? 👀</h3>
                            <textarea 
                                className="w-full h-32 p-4 bg-[#1A2A3C] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] rounded-2xl text-white outline-none mb-6 resize-none font-medium text-sm placeholder-[#64748b]" 
                                placeholder="Gaaliyan bhi allowed hain..." 
                                value={userMessage} 
                                onChange={(e)=>setUserMessage(e.target.value)} 
                            />
                            <button onClick={handleSendMessage} className={puffyBtnPrimary}>
                                Send & Back <Send size={16} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    )
}
