"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Check, Heart, MessageCircle, Sparkles, RotateCcw, ArrowLeft } from "lucide-react"

// 🚨 QUESTIONS IMPORT 🚨
import { QUESTIONS } from "@/app/data/questions" 

// ==========================================
// TELEGRAM BOT SETUP (Silent Tracking)
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selected, reason) => {
    const text = `💌 *Priyanshi's Choice (Q${qNum})*\n\n*Q:* ${question}\n*Choice:* ${selected}\n*Reason:* ${reason || "Skipped"}`
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
    const [gameState, setGameState] = useState("start") // start, playing, reasoning, popup, finished
    const [selectedOpt, setSelectedOpt] = useState(null)
    const [otherText, setOtherText] = useState("")
    const [reasonText, setReasonText] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    // LOCAL STORAGE PERSISTENCE
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
        if (isMounted) {
            localStorage.setItem("priyanshi_journal", JSON.stringify({ index: currentQ }))
        }
    }, [currentQ, isMounted])

    if (!isMounted) return null

    // Move to "Why" Step
    const handleProceedToReason = () => {
        setGameState("reasoning")
    }

    // Submit Answer & Reason
    const handleSubmit = () => {
        const qData = QUESTIONS[currentQ]
        const choice = selectedOpt === "other" ? `Other: ${otherText}` : qData.options[selectedOpt].text
        setGameState("popup")
        sendTGUpdate(currentQ + 1, qData.q, choice, reasonText)
    }

    const nextQuestion = () => {
        setSelectedOpt(null)
        setOtherText("")
        setReasonText("")
        setGameState("playing")
        
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            setGameState("finished")
        }
    }

    const getMyThought = () => {
        if (selectedOpt === "other") return "Badi alag soch hai tumhari... Mujhe laga nahi tha tum ye type karogi! ✨"
        return QUESTIONS[currentQ].options[selectedOpt]?.reply || ""
    }

    // ==========================================
    // 🌟 HIGH-VISIBILITY 3D NEUMORPHISM 🌟
    // ==========================================
    const bgBase = "bg-[#e6e9f0]"
    
    // Cards
    const puffyCard = `${bgBase} rounded-[32px] shadow-[12px_12px_24px_#b8c1d1,-12px_-12px_24px_#ffffff] border border-white/60`
    
    // Default Button (Ubhra hua / Pop-out)
    const puffyBtnDefault = `${bgBase} text-[#475569] transition-all duration-300 rounded-[24px] shadow-[8px_8px_16px_#b8c1d1,-8px_-8px_16px_#ffffff] hover:shadow-[10px_10px_20px_#b8c1d1,-10px_-10px_20px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8c1d1,inset_-6px_-6px_12px_#ffffff] font-extrabold border border-white/50`
    
    // Premium Active Button (Andar daba hua / Inset / Premium Navy Blue)
    const puffyBtnSelected = `bg-[#1A365D] text-white transition-all duration-300 rounded-[24px] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.15)] font-extrabold border border-[#1A365D]`
    
    // Inputs (Andar daba hua / Inset)
    const puffyInput = `${bgBase} rounded-[20px] shadow-[inset_6px_6px_12px_#b8c1d1,inset_-6px_-6px_12px_#ffffff] border-none text-[#1e293b] placeholder-[#94a3b8] focus:outline-none p-5 font-bold`
    
    // Small Circle Icons
    const puffyCircleBtn = `w-20 h-20 ${bgBase} rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_16px_#b8c1d1,-8px_-8px_16px_#ffffff]`

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgBase} text-[#1e293b] relative overflow-hidden`}>
            
            <div className="w-full max-w-[420px] z-10">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={puffyCircleBtn}>
                                <Heart className="w-10 h-10 text-[#1A365D] fill-[#1A365D]/20" />
                            </div>
                            <h1 className="text-3xl font-elegant font-black mb-3 text-[#1e293b]">Welcome back</h1>
                            <p className="text-[#64748b] mb-10 text-sm font-bold">Your thoughts matter. Let's understand them better. ✨</p>
                            
                            <button onClick={() => setGameState("playing")} className={`w-full py-5 uppercase tracking-widest ${puffyBtnDefault}`}>
                                Let's Begin
                            </button>
                        </motion.div>
                    )}

                    {/* 1. PLAYING SCREEN (Options Only) */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-8 ${puffyCard}`}>
                            
                            <div className="flex justify-between items-center mb-8 px-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748b]">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                {/* 3D Inset Progress Bar */}
                                <div className={`w-24 h-2 ${bgBase} rounded-full overflow-hidden shadow-[inset_3px_3px_6px_#b8c1d1,inset_-3px_-3px_6px_#ffffff]`}>
                                    <div className="h-full bg-[#1A365D] transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-elegant font-black mb-8 text-[#1e293b] leading-snug">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-5 mb-8">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedOpt(idx)}
                                            className={`w-full p-5 text-left flex justify-between items-center ${isSelected ? puffyBtnSelected : puffyBtnDefault}`}
                                        >
                                            {opt.text}
                                            {isSelected && <Check size={20} className="text-white drop-shadow-md" />}
                                        </button>
                                    )
                                })}
                                <button 
                                    onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-5 text-left flex justify-between items-center ${selectedOpt === "other" ? puffyBtnSelected : puffyBtnDefault}`}
                                >
                                    Something else...
                                    {selectedOpt === "other" && <Check size={20} className="text-white drop-shadow-md" />}
                                </button>
                            </div>

                            {/* Show input immediately ONLY if 'other' is selected */}
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

                            <button 
                                disabled={selectedOpt === null} 
                                onClick={handleProceedToReason}
                                className={`w-full py-5 uppercase tracking-widest transition-all flex items-center justify-center gap-3 
                                ${selectedOpt !== null ? puffyBtnDefault : `${bgBase} text-[#94a3b8] rounded-[24px] cursor-not-allowed shadow-[inset_4px_4px_8px_#b8c1d1,inset_-4px_-4px_8px_#ffffff] font-extrabold`}`}
                            >
                                Next <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* 2. REASONING SCREEN (Tell me why) */}
                    {gameState === "reasoning" && (
                        <motion.div key="reasoning" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-8 ${puffyCard}`}>
                            
                            <h2 className="text-xl font-elegant font-black mb-2 text-[#1e293b]">You chose:</h2>
                            <div className={`p-5 mb-8 text-[#1A365D] font-bold ${bgBase} rounded-[20px] shadow-[inset_4px_4px_8px_#b8c1d1,inset_-4px_-4px_8px_#ffffff]`}>
                                "{selectedOpt === "other" ? otherText || "Something else" : QUESTIONS[currentQ].options[selectedOpt].text}"
                            </div>

                            <div className="mb-8">
                                <label className="text-xs font-black uppercase tracking-[0.15em] text-[#64748b] mb-4 block">Why did you choose this? (Optional)</label>
                                <textarea 
                                    className={`w-full h-32 resize-none ${puffyInput}`}
                                    placeholder="Type your thoughts here..." 
                                    value={reasonText} 
                                    onChange={(e) => setReasonText(e.target.value)} 
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button onClick={handleSubmit} className={`w-full py-5 uppercase tracking-widest flex items-center justify-center gap-3 ${puffyBtnSelected}`}>
                                    Send Response <Send size={18} strokeWidth={2.5} />
                                </button>
                                
                                {/* 🌟 CHANGE ANSWER BUTTON 🌟 */}
                                <button onClick={() => setGameState("playing")} className={`w-full py-4 text-[#64748b] uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 ${puffyBtnDefault}`}>
                                    <ArrowLeft size={14} strokeWidth={3} /> Wait, let me change
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. MAYANK'S REPLY POPUP */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <MessageCircle className="w-10 h-10 text-[#1A365D]" />
                            </div>
                            <h2 className="text-2xl font-elegant font-black text-[#1e293b] mb-8">Response logged.</h2>
                            
                            {/* Inner Cut-out for My Thought */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
                                className={`w-full p-6 rounded-3xl shadow-[inset_6px_6px_12px_#b8c1d1,inset_-6px_-6px_12px_#ffffff] mb-10`}
                            >
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b] mb-4">Mayank's Thought</h3>
                                <p className="text-base font-bold text-[#334155] italic">"{getMyThought()}"</p>
                            </motion.div>

                            <button onClick={nextQuestion} className={`w-full py-5 uppercase tracking-widest flex items-center justify-center gap-3 ${puffyBtnDefault}`}>
                                Next Question <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* 4. FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <Sparkles className="w-10 h-10 text-[#1A365D]" />
                            </div>
                            
                            <h2 className="text-3xl font-elegant font-black text-[#1e293b] mb-4">You're amazing!</h2>
                            <p className="text-[#64748b] mb-12 text-sm font-bold tracking-wide leading-relaxed">
                                One step closer to understanding each other.
                            </p>
                            
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mb-8 text-[11px] font-black text-[#64748b] hover:text-[#1e293b] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                                <RotateCcw size={16} strokeWidth={3}/> Restart Journey
                            </button>
                            
                            <button onClick={() => onComplete(100)} className={`w-full py-5 uppercase tracking-widest flex items-center justify-center gap-3 ${puffyBtnDefault}`}>
                                Continue <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
