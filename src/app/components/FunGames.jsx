"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Check, Heart, MessageCircle, Sparkles, RotateCcw } from "lucide-react"

// 🚨 YAHAN SE QUESTIONS IMPORT HO RAHE HAIN 🚨
// Agar file path alag ho toh isko adjust kar lena (e.g., "../data/questions")
import { QUESTIONS } from "@/app/data/questions" 

// ==========================================
// TELEGRAM BOT SETUP
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selected, reason) => {
    const text = `💌 *Priyanshi's Choice (Q${qNum})*\n\n*Q:* ${question}\n*Choice:* ${selected}\n*Her Reason:* ${reason || "No reason given"}`
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
    // 🌟 3D NEUMORPHISM CLASSES (Light Theme) 🌟
    // Background: #f0f3f8 (Very light grayish blue)
    // Dark Shadow: #d1d9e6 (Grayish blue shadow)
    // Light Shadow: #ffffff (White highlight)
    // ==========================================
    
    const puffyCard = "bg-[#f0f3f8] rounded-[32px] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] border border-white/50"
    const puffyBtnDefault = "bg-[#f0f3f8] text-[#4a637c] transition-all duration-300 rounded-[20px] shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_10px_#d1d9e6,inset_-4px_-4px_10px_#ffffff]"
    const puffyBtnSelected = "bg-[#4a637c] text-white transition-all duration-300 rounded-[20px] shadow-[inset_4px_4px_8px_#3b5064,inset_-4px_-4px_8px_#597694]"
    const puffyInput = "bg-[#f0f3f8] rounded-2xl shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] border-none text-[#2d3748] placeholder-[#a0aec0] focus:outline-none"
    const puffyCircleBtn = "w-20 h-20 bg-[#f0f3f8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f3f8] text-[#2d3748] relative overflow-hidden">
            
            <div className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className={puffyCircleBtn}>
                                <Heart className="w-10 h-10 text-[#4a637c] fill-[#4a637c]/20" />
                            </div>
                            <h1 className="text-3xl font-elegant font-bold mb-3 text-[#2d3748]">Welcome back</h1>
                            <p className="text-[#718096] mb-8 text-sm font-medium">Your thoughts matter. Let's understand them better. ✨</p>
                            
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 font-bold uppercase tracking-widest ${puffyBtnDefault}`}>
                                Let's Begin
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#718096]">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                {/* 3D Inset Progress Bar */}
                                <div className="w-24 h-2 bg-[#f0f3f8] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
                                    <div className="h-full bg-[#4a637c] transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className="text-xl font-elegant font-bold mb-8 text-[#2d3748] leading-relaxed">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-4 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedOpt(idx)}
                                            className={`w-full p-4 text-left font-semibold flex justify-between items-center ${isSelected ? puffyBtnSelected : puffyBtnDefault}`}
                                        >
                                            {opt.text}
                                            {isSelected && <Check size={18} className="text-white" />}
                                        </button>
                                    )
                                })}
                                <button 
                                    onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-4 text-left font-semibold flex justify-between items-center ${selectedOpt === "other" ? puffyBtnSelected : puffyBtnDefault}`}
                                >
                                    Something else...
                                    {selectedOpt === "other" && <Check size={18} className="text-white" />}
                                </button>
                            </div>

                            {/* Custom Input */}
                            <AnimatePresence>
                                {selectedOpt === "other" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <input 
                                            className={`w-full p-4 mb-4 text-sm font-medium ${puffyInput}`}
                                            placeholder="Apna jawab type karo..." 
                                            value={otherText} 
                                            onChange={(e) => setOtherText(e.target.value)} 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Reason Box */}
                            <div className="mt-8 pt-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#718096] mb-3 block">Tell me why? (Optional)</label>
                                <textarea 
                                    className={`w-full p-4 h-24 text-sm font-medium resize-none ${puffyInput}`}
                                    placeholder="Iska koi khas reason?..." 
                                    value={reasonText} 
                                    onChange={(e) => setReasonText(e.target.value)} 
                                />
                            </div>

                            <button 
                                disabled={selectedOpt === null} 
                                onClick={handleSubmit}
                                className={`w-full py-4 mt-6 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 
                                ${selectedOpt !== null ? puffyBtnDefault : 'bg-[#f0f3f8] text-[#a0aec0] rounded-[20px] cursor-not-allowed shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]'}`}
                            >
                                Send Response <Send size={16} />
                            </button>
                        </motion.div>
                    )}

                    {/* POPUP / RESPONSE SENT SCREEN */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <Check className="w-10 h-10 text-[#4a637c]" />
                            </div>
                            <h2 className="text-2xl font-elegant font-bold text-[#2d3748] mb-2">Response sent!</h2>
                            <p className="text-[#718096] mb-8 text-sm">Thank you for being so honest. 💙</p>
                            
                            {/* Inner Cut-out for My Thought */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} 
                                className="w-full bg-[#f0f3f8] p-6 rounded-2xl shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] mb-8"
                            >
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#718096] mb-3">Mayank's Thought</h3>
                                <p className="text-[15px] font-semibold text-[#4a5568] italic">"{getMyThought()}"</p>
                            </motion.div>

                            <button onClick={nextQuestion} className={`w-full py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${puffyBtnDefault}`}>
                                Next <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className={puffyCircleBtn}>
                                <Sparkles className="w-10 h-10 text-[#4a637c]" />
                            </div>
                            
                            <h2 className="text-3xl font-elegant font-bold text-[#2d3748] mb-2">You're amazing!</h2>
                            <p className="text-[#718096] mb-10 text-sm tracking-wide leading-relaxed">Tumhare saare answers mere paas aa gaye hain. <br/>One step closer to understanding each other.</p>
                            
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mb-6 text-[10px] font-bold text-[#718096] hover:text-[#4a637c] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                                <RotateCcw size={14}/> Reset Everything
                            </button>
                            
                            <button onClick={() => onComplete(100)} className={`w-full py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${puffyBtnDefault}`}>
                                Continue <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
