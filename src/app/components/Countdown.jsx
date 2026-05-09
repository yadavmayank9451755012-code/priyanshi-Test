"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send } from "lucide-react"

// TELEGRAM BOT SETUP
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

// Sparkles Data
const sparkles = [
  { top: "15%", left: "20%", size: 14, color: "#f472b6", delay: 0 },
  { top: "10%", left: "80%", size: 18, color: "#a855f7", delay: 0.3 },
  { top: "45%", left: "8%", size: 16, color: "#f472b6", delay: 0.2 },
  { top: "50%", left: "90%", size: 20, color: "#a855f7", delay: 0.8 },
  { top: "80%", left: "15%", size: 14, color: "#ffffff", delay: 1.0 },
  { top: "75%", left: "85%", size: 18, color: "#f472b6", delay: 0.4 },
]

export default function Countdown({ onNext, birthdayDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 9999, hours: 99, minutes: 99, seconds: 99 })
    const [isTimeUp, setIsTimeUp] = useState(false)
    
    const [isScrambling, setIsScrambling] = useState(true)
    const [skipProgress, setSkipProgress] = useState(0)
    const [canSkip, setCanSkip] = useState(false)
    const [gameState, setGameState] = useState("timer") 
    const [userMessage, setUserMessage] = useState("")

    // Hyper-drive scramble effect
    useEffect(() => {
        if (isScrambling) {
            let currentFakeDays = 9999;
            const targetDate = new Date(birthdayDate);
            
            const scrambleInterval = setInterval(() => {
                const diff = +targetDate - +new Date();
                const realDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                currentFakeDays -= 142;
                
                if (currentFakeDays <= realDays) {
                    setIsScrambling(false);
                    clearInterval(scrambleInterval);
                } else {
                    setTimeLeft({
                        days: currentFakeDays,
                        hours: Math.floor(Math.random() * 99),
                        minutes: Math.floor(Math.random() * 99),
                        seconds: Math.floor(Math.random() * 99),
                    });
                }
            }, 30);

            return () => clearInterval(scrambleInterval);
        }
    }, [isScrambling, birthdayDate]);

    // Normal Timer Logic
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

        updateRealTime()
        const timer = setInterval(updateRealTime, 1000)
        return () => clearInterval(timer)
    }, [isScrambling, birthdayDate])

    // Skip unlock timer
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

    // Premium Card Styles
    const premiumCard = "bg-[#fff8fc] rounded-[32px] shadow-[0_25px_50px_-12px_rgba(151,59,136,0.25)] border border-white/50"
    const timerBox = "bg-[#fff] rounded-[20px] shadow-inner flex flex-col items-center justify-center py-5 overflow-hidden"
    const btnPrimary = "bg-[#f1caeb] text-[#973b88] transition-all duration-300 rounded-[20px] px-6 py-4 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:bg-[#f5d4f0] active:scale-95 w-full uppercase tracking-[0.12em] text-[13px]"
    const lockedBtn = "bg-[#fff8fc] text-[#77537e]/60 rounded-[20px] shadow-inner font-bold flex items-center justify-center gap-3 px-6 py-4 w-full uppercase tracking-[0.12em] text-[13px] opacity-80 cursor-not-allowed"

    return (
        <motion.div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#fdf7ff] font-sans bg-polka-dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}>
            
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-pink-300/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-300/20 blur-[100px] rounded-full" />
            </div>

            {/* Animated Sparkles */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {sparkles.map((s, i) => (
                <motion.div key={i} className="absolute" style={{ top: s.top, left: s.left }} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8], rotate: [0, 20, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}>
                    <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={s.color}>
                    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
                    </svg>
                </motion.div>
                ))}
            </div>

            <div className="w-full max-w-[380px] z-10 relative">
                <AnimatePresence mode="wait">
                    
                    {/* STATE 1: TIMER */}
                    {gameState === "timer" && (
                        <motion.div key="timer" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`p-6 text-center ${premiumCard}`}>
                                
                            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-b from-white/80 to-pink-200 shadow-inner overflow-hidden">
                                <img src="/images/peach-and-goma-peach-loves-goma.gif" alt="Waiting" className="w-full h-full object-contain p-2" />
                            </div>

                            <h2 className="text-[15px] font-bold text-[#973b88] mb-6 uppercase tracking-widest">
                                {isScrambling ? "Calculating Time..." : "Priyanshi waiting..."}
                            </h2>

                            {/* Timer Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { l: "Days", v: timeLeft.days },
                                    { l: "Hours", v: timeLeft.hours },
                                    { l: "Mins", v: timeLeft.minutes },
                                    { l: "Secs", v: timeLeft.seconds }
                                ].map((t, idx) => (
                                    <div key={idx} className={timerBox}>
                                        <AnimatePresence mode="popLayout">
                                            <motion.span 
                                                key={isScrambling ? "scrambling" : t.v}
                                                initial={{ y: isScrambling ? 0 : -20, opacity: isScrambling ? 1 : 0, filter: isScrambling ? "blur(0px)" : "blur(4px)" }}
                                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                                exit={{ y: isScrambling ? 0 : 20, opacity: isScrambling ? 1 : 0, filter: isScrambling ? "blur(0px)" : "blur(4px)" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={`text-4xl font-bold ${isScrambling ? "text-[#973b88]" : "text-[#77537e]"}`}
                                            >
                                                {t.v < 10 ? `0${t.v}` : t.v}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-[10px] uppercase tracking-widest text-[#77537e]/70 font-medium mt-2">{t.l}</span>
                                    </div>
                                ))}
                            </div>

                            {isTimeUp ? (
                                <button onClick={onNext} className={btnPrimary}>Start Celebration!</button>
                            ) : (
                                !canSkip ? (
                                    <button disabled className={lockedBtn}>
                                        <span>{isScrambling ? "Syncing..." : "Unlocking"}</span>
                                        <svg className="w-5 h-5 -rotate-90">
                                            <circle cx="10" cy="10" r={radius} fill="transparent" stroke="#eecfeb" strokeWidth="3" />
                                            <circle cx="10" cy="10" r={radius} fill="transparent" stroke="#973b88" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-100 ease-linear"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={() => setGameState("mocking")} className={btnPrimary}>
                                        Skip Countdown <ArrowRight size={16} strokeWidth={3} />
                                    </button>
                                )
                            )}
                        </motion.div>
                    )}

                    {/* STATE 2: MOCKING */}
                    {gameState === "mocking" && (
                        <motion.div key="mocking" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className={`p-8 text-center ${premiumCard}`}>
                            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-b from-white/80 to-pink-200 shadow-inner overflow-hidden">
                                <img src="/images/airallia-cat-chan.gif" alt="Teasing" className="w-full h-full object-contain p-2" />
                            </div>
                            <h2 className="text-[18px] font-bold text-[#973b88] mb-2 uppercase tracking-widest mt-4">Hehehe!</h2>
                            <p className="text-[#77537e] mb-8 text-[14px] font-medium leading-relaxed">
                                &quot;Badi jaldi machi hai? Aise kaise aage jane du? Wait karo birthday ki date aane ka chup chaap!&quot;
                            </p>
                            <button onClick={() => setGameState("message")} className={btnPrimary}>
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* STATE 3: MESSAGE BOX */}
                    {gameState === "message" && (
                        <motion.div key="msg" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`p-6 text-center ${premiumCard}`}>
                            <h3 className="text-[14px] font-bold text-[#973b88] uppercase mb-6 tracking-widest">Kuch likhna chahoge?</h3>
                            <textarea 
                                className="w-full h-32 p-4 bg-[#fff] shadow-inner rounded-2xl text-[#77537e] outline-none mb-6 resize-none font-medium text-sm placeholder-[#77537e]/50 border border-pink-100" 
                                placeholder="Gaaliyan bhi allowed hain..." 
                                value={userMessage} 
                                onChange={(e)=>setUserMessage(e.target.value)} 
                            />
                            <button onClick={handleSendMessage} className={btnPrimary}>
                                Send & Back <Send size={16} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    )
}
