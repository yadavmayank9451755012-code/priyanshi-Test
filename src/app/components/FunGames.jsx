"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti" // 🎉 IMPORT CONFETTI
import { ArrowRight, Send, Check, Heart, Sparkles, RotateCcw, ArrowLeft, Lock } from "lucide-react"
import { QUESTIONS } from "@/app/data/questions" 

const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selected, reason) => {
    const text = `💌 *Priyanshi's Choice (Q${qNum})*\n\n*Q:* ${question}\n*Choice:* ${selected}\n*Her Reply:* ${reason || "Kuch nahi boli"}`
    try {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" }),
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
        // 🎉 CONFETTI BLAST FUNCTION
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F472B6', '#6366F1', '#FFFFFF', '#38BDF8']
        });
        
        setGameState("reply")
    }

    const handleSubmitAndNext = () => {
        const qData = QUESTIONS[currentQ]
        const choice = selectedOpt === "other" ? `Other: ${otherText}` : qData.options[selectedOpt].text
        sendTGUpdate(currentQ + 1, qData.q, choice, reasonText)

        setSelectedOpt(null); setOtherText(""); setReasonText("")
        
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
            setGameState("playing")
        } else {
            setGameState("finished")
        }
    }

    const getMyThought = () => selectedOpt === "other" ? "Badi alag soch hai tumhari... ✨" : QUESTIONS[currentQ].options[selectedOpt]?.reply || ""
    const getSelectedText = () => selectedOpt === "other" ? otherText || "Something else" : QUESTIONS[currentQ].options[selectedOpt]?.text
    const currentGif = QUESTIONS[currentQ]?.gif || "/images/bubu-dudu-bubu.gif"

    const bgBase = "bg-[#162433]"; const cardBg = "bg-[#1B2A3A]"
    const puffyCard = `${cardBg} rounded-[28px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5`
    const puffyBtnDefault = `${cardBg} text-[#e2e8f0] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-bold border border-white/5`
    const puffyBtnSelected = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold`
    const puffyInput = `${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border-none text-white placeholder-[#64748b] focus:outline-none p-4 font-medium text-sm`
    const puffyImageCircle = `w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] border-[4px] border-[#1B2A3A] overflow-hidden bg-white`

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgBase} text-white font-sans relative overflow-hidden`}>
            
            {/* 🐱 PERMANENT BUBU-DUDU EMOJI ON TOP */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[4px_4px_10px_#111b25] border-2 border-[#1B2A3A] z-50 overflow-hidden">
                <img src="/images/bubu-dudu-bubu.gif" alt="Bubu" className="w-full h-full object-contain p-1 mix-blend-multiply" />
            </div>

            <div className="w-full max-w-[380px] z-10 mt-16">
                <AnimatePresence mode="wait">
                    
                    {/* PLAYING SCREEN */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            <h2 className="text-[17px] font-black mb-6 text-white leading-snug tracking-wide text-center">{QUESTIONS[currentQ].q}</h2>
                            <div className="space-y-4 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => (
                                    <button key={idx} onClick={() => setSelectedOpt(idx)} className={`w-full p-4 text-[14px] text-left flex justify-between items-center ${selectedOpt === idx ? puffyBtnSelected : puffyBtnDefault}`}>
                                        {opt.text} {selectedOpt === idx && <Check size={18} className="text-[#162433]" strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                            <button disabled={selectedOpt === null} onClick={handleProceedToConfirm} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 ${selectedOpt !== null ? puffyBtnDefault : 'opacity-50 cursor-not-allowed'}`}>
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* CONFIRMATION SCREEN */}
                    {gameState === "confirm" && (
                        <motion.div key="confirm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`p-8 text-center ${puffyCard}`}>
                            <h2 className="text-xl font-black text-white mb-2">Are you sure?</h2>
                            <div className={`p-4 mb-8 text-white text-[15px] font-bold ${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25]`}>
                                "{getSelectedText()}"
                            </div>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleLockAnswer} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                    Yes, Lock It! <Check size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* MAYANK'S REPLY + TEXTBOX + GIF SCREEN */}
                    {gameState === "reply" && (
                        <motion.div key="reply" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 text-center ${puffyCard}`}>
                            
                            {/* Question Specific GIF */}
                            <div className={puffyImageCircle}>
                                <img src={currentGif} alt="Reaction" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                            </div>
                            
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`w-full p-5 rounded-2xl shadow-[inset_4px_4px_8px_#111b25] mb-6 bg-[#1A2A3C]`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-3">Mayank's Reaction</h3>
                                <p className="text-[15px] font-bold text-white italic">"{getMyThought()}"</p>
                            </motion.div>

                            <textarea className={`w-full h-24 resize-none ${puffyInput} mb-6`} placeholder="Kuch kehna hai is baare mein? 👀" value={reasonText} onChange={(e) => setReasonText(e.target.value)} />

                            <button onClick={handleSubmitAndNext} className={`w-full py-4 text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                Send & Next <Send size={16} strokeWidth={2.5} />
                            </button>
                        </motion.div>
                    )}
                    
                    {/* Start / Finish screens logic remains same as before... */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <h1 className="text-2xl font-black mb-8 text-white mt-4">Welcome back ✨</h1>
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] ${puffyBtnDefault}`}>Let's Begin</button>
                        </motion.div>
                    )}
                    {gameState === "finished" && (
                        <motion.div key="finished" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <h2 className="text-2xl font-black text-white mb-8 mt-4">You're amazing!</h2>
                            <button onClick={() => onComplete(100)} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${puffyBtnSelected}`}>Continue <ArrowRight size={16} strokeWidth={3} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
