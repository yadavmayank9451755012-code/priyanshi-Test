"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti" 
import { ArrowRight, Send, Check, RotateCcw, ArrowLeft } from "lucide-react"

// 🚨 QUESTIONS IMPORT 🚨
import { QUESTIONS } from "@/app/data/questions" 

const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selected, reason) => {
    const text = `💌 *Priyanshi's Choice (Q${qNum})*\n\n*Q:* ${question}\n*Choice:* ${selected}\n*Her Reply:* ${reason || "Kuch nahi boli"}`
    try {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
        })
    } catch (e) { }
}

export default function FunGames({ onComplete }) {
    const [currentQ, setCurrentQ] = useState(0)
    const [gameState, setGameState] = useState("start") 
    const [selectedOpt, setSelectedOpt] = useState(null)
    const [otherText, setOtherText] = useState("")
    const [reasonText, setReasonText] = useState("") 
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem("priyanshi_journal")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.index >= QUESTIONS.length) setGameState("finished")
            else setCurrentQ(parsed.index)
        }
    }, [])

    useEffect(() => {
        if (isMounted) localStorage.setItem("priyanshi_journal", JSON.stringify({ index: currentQ }))
    }, [currentQ, isMounted])

    if (!isMounted) return null

    const handleProceedToConfirm = () => setGameState("confirm")

    const handleLockAnswer = () => {
        // 🎉 CONFETTI BLAST
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F472B6', '#6366F1', '#FFFFFF', '#38BDF8'],
            disableForReducedMotion: true
        });
        setGameState("reply")
    }

    const handleSubmitAndNext = () => {
        const qData = QUESTIONS[currentQ]
        const choice = selectedOpt === "other" ? `Other: ${otherText}` : qData.options[selectedOpt].text
        
        sendTGUpdate(currentQ + 1, qData.q, choice, reasonText)

        setSelectedOpt(null)
        setOtherText("")
        setReasonText("")
        
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
            setGameState("playing")
        } else {
            setGameState("finished")
        }
    }

    const getMyThought = () => {
        if (selectedOpt === "other") return "Badi alag soch hai tumhari... Mujhe laga nahi tha tum ye type karogi! ✨"
        return QUESTIONS[currentQ].options[selectedOpt]?.reply || ""
    }

    const getSelectedText = () => {
        return selectedOpt === "other" ? otherText || "Something else" : QUESTIONS[currentQ].options[selectedOpt]?.text
    }

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE 3D NEUMORPHISM
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyCard = `${cardBg} rounded-[32px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5 relative mt-16`
    const puffyBtnDefault = `${cardBg} text-[#e2e8f0] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-bold border border-white/5`
    const puffyBtnSelected = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold`
    const puffyInput = `${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border-none text-white placeholder-[#64748b] focus:outline-none p-4 font-medium text-sm`
    
    // 🔥 NEW MASSIVE 3D POP-OUT GIF BOX
    const massiveGifBox = "w-40 h-40 mx-auto -mt-20 mb-6 bg-white rounded-[32px] shadow-[10px_10px_20px_#111b25] border-[6px] border-[#1B2A3A] p-2 flex items-center justify-center relative z-20 overflow-hidden"

    const currentGif = QUESTIONS[currentQ]?.gif || "/images/bubu-dudu-bubu.gif"

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgBase} text-white font-sans relative overflow-hidden`}>
            
            <div className="w-full max-w-[380px] z-10">
                <AnimatePresence mode="wait">
                    
                    {/* 1. PLAYING SCREEN (Dancing GIF) */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            
                            {/* 👈 BADA DANCING GIF */}
                            <div className={massiveGifBox}>
                                <img src="/images/bubu-dudu-bubu.gif" alt="Dancing" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>

                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                <div className={`w-20 h-1.5 ${cardBg} rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#111b25,inset_-2px_-2px_4px_#25394f]`}>
                                    <div className="h-full bg-white transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className="text-[17px] font-black mb-6 text-white leading-snug tracking-wide text-center">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-4 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button key={idx} onClick={() => setSelectedOpt(idx)} className={`w-full p-4 text-[14px] text-left flex justify-between items-center ${isSelected ? puffyBtnSelected : puffyBtnDefault}`}>
                                            {opt.text}
                                            {isSelected && <Check size={18} className="text-[#162433]" strokeWidth={3} />}
                                        </button>
                                    )
                                })}
                                
                                <button onClick={() => setSelectedOpt("other")} className={`w-full p-4 text-[14px] text-left flex justify-between items-center ${selectedOpt === "other" ? puffyBtnSelected : puffyBtnDefault}`}>
                                    Something else...
                                    {selectedOpt === "other" && <Check size={18} className="text-[#162433]" strokeWidth={3} />}
                                </button>
                            </div>

                            <AnimatePresence>
                                {selectedOpt === "other" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                                        <input 
                                            className={`w-full ${puffyInput}`}
                                            placeholder="Type your answer here..." 
                                            value={otherText} 
                                            onChange={(e) => setOtherText(e.target.value)} 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button disabled={selectedOpt === null} onClick={handleProceedToConfirm} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 ${selectedOpt !== null ? puffyBtnDefault : `${cardBg} text-[#475569] rounded-[20px] cursor-not-allowed shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-extrabold border border-transparent`}`}>
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* 2. CONFIRMATION SCREEN (8.gif - Thinking) */}
                    {gameState === "confirm" && (
                        <motion.div key="confirm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`p-8 text-center ${puffyCard}`}>
                            
                            {/* 👈 BADA THINKING GIF (8.gif) */}
                            <div className={massiveGifBox}>
                                <img src="/images/8.gif" alt="Thinking" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>

                            <h2 className="text-xl font-black text-white mb-2 mt-2">Are you sure?</h2>
                            <p className="text-[#94a3b8] mb-6 text-[12px] font-bold">You selected:</p>
                            
                            <div className={`p-4 mb-8 text-white text-[15px] font-bold ${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]`}>
                                "{getSelectedText()}"
                            </div>

                            <div className="flex flex-col gap-4">
                                <button onClick={handleLockAnswer} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                    Yes, Lock It! <Check size={16} strokeWidth={3} />
                                </button>
                                <button onClick={() => setGameState("playing")} className={`w-full py-3 text-[#94a3b8] hover:text-white uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors`}>
                                    <ArrowLeft size={14} strokeWidth={2.5} /> Wait, change answer
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. MAYANK'S REPLY + TEXTBOX SCREEN (Specific Reaction GIF) */}
                    {gameState === "reply" && (
                        <motion.div key="reply" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 text-center ${puffyCard}`}>
                            
                            {/* 👈 BADA SPECIFIC REACTION GIF (from questions.js) */}
                            <div className={massiveGifBox}>
                                <img src={currentGif} alt="Reaction" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`w-full p-5 mt-2 rounded-2xl shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] mb-6 bg-[#1A2A3C]`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-3">Mayank's Reaction</h3>
                                <p className="text-[15px] font-bold text-white italic">"{getMyThought()}"</p>
                            </motion.div>

                            <div className="mb-6 text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#94a3b8] mb-3 block">Your Reply / Thoughts (Optional)</label>
                                <textarea 
                                    className={`w-full h-24 resize-none ${puffyInput}`}
                                    placeholder="Kuch kehna hai is baare mein? 👀" 
                                    value={reasonText} 
                                    onChange={(e) => setReasonText(e.target.value)} 
                                />
                            </div>

                            <button onClick={handleSubmitAndNext} className={`w-full py-4 text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                Send & Next <Send size={16} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    )}

                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={massiveGifBox}>
                                <img src="/images/bubu-dudu-bubu.gif" alt="Start" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <h1 className="text-2xl font-black mb-2 text-white mt-4">Welcome back</h1>
                            <p className="text-[#94a3b8] mb-8 text-[13px] font-bold">Your thoughts matter. Let's understand them better. ✨</p>
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] ${puffyBtnDefault}`}>
                                Let's Begin
                            </button>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={massiveGifBox}>
                                <img src="/images/10.gif" alt="Finished" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3 mt-4">You're amazing!</h2>
                            <p className="text-[#94a3b8] mb-10 text-[13px] font-bold tracking-wide leading-relaxed">
                                One step closer to understanding each other.
                            </p>
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mb-6 text-[10px] font-black text-[#64748b] hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                                <RotateCcw size={14} strokeWidth={3}/> Restart Journey
                            </button>
                            <button onClick={() => onComplete(100)} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                Continue <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
