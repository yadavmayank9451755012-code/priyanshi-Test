"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Check, Heart, MessageCircle, Sparkles, RotateCcw, ArrowLeft } from "lucide-react"

// 🚨 QUESTIONS IMPORT 🚨
import { QUESTIONS } from "@/app/data/questions" 

// ==========================================
// TELEGRAM BOT SETUP
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
    // 🌟 PREMIUM NAVY BLUE 3D NEUMORPHISM 🌟
    // Background: #162433 (Deep Navy)
    // Card/Buttons: #1B2A3A (Slightly lighter Navy)
    // Selected: #FFFFFF (White)
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    // Card Shadow
    const puffyCard = `${cardBg} rounded-[28px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5`
    
    // Default Button (Ubhra hua / Pop-out / Blue)
    const puffyBtnDefault = `${cardBg} text-[#e2e8f0] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-bold border border-white/5`
    
    // Selected Button (Andar daba hua / White)
    const puffyBtnSelected = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold`
    
    // Inputs (Andar daba hua)
    const puffyInput = `${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border-none text-white placeholder-[#64748b] focus:outline-none p-4 font-medium text-sm`
    
    // Small Circle Icons
    const puffyCircleBtn = `w-16 h-16 ${cardBg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f]`

    return (
        // Wrapper with specific font constraint to fix huge texts
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgBase} text-white font-sans relative overflow-hidden`}>
            
            <div className="w-full max-w-[380px] z-10">
                <AnimatePresence mode="wait">
                    
                    {/* 1. PLAYING SCREEN (Options Only) */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                {/* 3D Inset Progress Bar */}
                                <div className={`w-20 h-1.5 ${cardBg} rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#111b25,inset_-2px_-2px_4px_#25394f]`}>
                                    <div className="h-full bg-white transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            {/* Question Size Reduced for Mobile Fit */}
                            <h2 className="text-[17px] font-black mb-6 text-white leading-snug tracking-wide">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-4 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedOpt(idx)}
                                            // Padding reduced to p-4, text to 14px
                                            className={`w-full p-4 text-[14px] text-left flex justify-between items-center ${isSelected ? puffyBtnSelected : puffyBtnDefault}`}
                                        >
                                            {opt.text}
                                            {isSelected && <Check size={18} className="text-[#162433]" strokeWidth={3} />}
                                        </button>
                                    )
                                })}
                                <button 
                                    onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-4 text-[14px] text-left flex justify-between items-center ${selectedOpt === "other" ? puffyBtnSelected : puffyBtnDefault}`}
                                >
                                    Something else...
                                    {selectedOpt === "other" && <Check size={18} className="text-[#162433]" strokeWidth={3} />}
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
                                className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 
                                ${selectedOpt !== null ? puffyBtnDefault : `${cardBg} text-[#475569] rounded-[20px] cursor-not-allowed shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-extrabold border border-transparent`}`}
                            >
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* 2. REASONING SCREEN (Tell me why) */}
                    {gameState === "reasoning" && (
                        <motion.div key="reasoning" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            
                            <h2 className="text-[15px] font-black mb-2 text-[#94a3b8] uppercase tracking-wide">You chose:</h2>
                            <div className={`p-4 mb-6 text-white text-[15px] font-bold ${cardBg} rounded-[16px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]`}>
                                "{selectedOpt === "other" ? otherText || "Something else" : QUESTIONS[currentQ].options[selectedOpt].text}"
                            </div>

                            <div className="mb-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#94a3b8] mb-3 block">Why did you choose this? (Optional)</label>
                                <textarea 
                                    className={`w-full h-28 resize-none ${puffyInput}`}
                                    placeholder="Type your thoughts here..." 
                                    value={reasonText} 
                                    onChange={(e) => setReasonText(e.target.value)} 
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button onClick={handleSubmit} className={`w-full py-4 text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 ${puffyBtnSelected}`}>
                                    Send <Send size={16} strokeWidth={2.5} />
                                </button>
                                
                                {/* Change Answer Button */}
                                <button onClick={() => setGameState("playing")} className={`w-full py-3 text-[#94a3b8] hover:text-white uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors`}>
                                    <ArrowLeft size={14} strokeWidth={2.5} /> Wait, let me change
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. MAYANK'S REPLY POPUP */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            
                            {/* Inner Cut-out for My Thought */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
                                className={`w-full p-5 rounded-2xl shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] mb-8 bg-[#1A2A3C]`}
                            >
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-3">Mayank's Thought</h3>
                                <p className="text-[15px] font-bold text-white italic">"{getMyThought()}"</p>
                            </motion.div>

                            <button onClick={nextQuestion} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${puffyBtnDefault}`}>
                                Next <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}

                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={puffyCircleBtn}>
                                <Heart className="w-8 h-8 text-white fill-white/20" />
                            </div>
                            <h1 className="text-2xl font-black mb-2 text-white">Welcome back</h1>
                            <p className="text-[#94a3b8] mb-8 text-[13px] font-bold">Your thoughts matter. Let's understand them better. ✨</p>
                            
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 text-[13px] uppercase tracking-[0.15em] ${puffyBtnDefault}`}>
                                Let's Begin
                            </button>
                        </motion.div>
                    )}

                    {/* 4. FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white mb-3">You're amazing!</h2>
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
