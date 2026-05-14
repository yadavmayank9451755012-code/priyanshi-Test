"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle, Heart, MessageSquare } from "lucide-react"

// TG BOT DETAILS
const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN
const CHAT_ID = process.env.NEXT_PUBLIC_CHAT_ID

async function sendTextToTelegram(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `💌 *Message from Priyanshi:*\n\n"${text}"`, parse_mode: "Markdown" }),
    })
    if (!res.ok) throw new Error("Failed to send message")
}

export default function MessageBoard() {
    // Text state
    const [message, setMessage] = useState("")
    const [textSent, setTextSent] = useState(false)
    const [textLoading, setTextLoading] = useState(false)
    const [textError, setTextError] = useState("")

    const handleSendText = async () => {
        if (!message.trim()) return
        setTextLoading(true)
        setTextError("")
        try {
            await sendTextToTelegram(message.trim())
            setTextSent(true)
            setMessage("")
        } catch {
            setTextError("Oops! Couldn't send. Try again")
        } finally {
            setTextLoading(false)
        }
    }

    // Premium styles
    const cardBg = "glass-card"
    const inputBox = "neu-card-pressed p-4"
    const btnDefault = "glass-button text-[#77537e] font-bold"
    const btnPrimary = "glass-button text-[#973b88] font-bold"

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-aesthetic text-[#77537e] font-sans relative overflow-hidden">
            
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-200/30 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-[380px] mx-auto flex flex-col gap-6">

                {/* Header */}
                <motion.div className="text-center mb-2" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h1 className="text-3xl font-bold text-[#973b88] mb-2 tracking-wide drop-shadow font-heading"
                        style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>
                        Leave a Note
                    </h1>
                    <p className="text-[#77537e] text-[13px] font-bold tracking-widest uppercase font-cute">
                        I&apos;d love to hear from you ✨
                    </p>
                </motion.div>

                {/* TEXT MESSAGE CARD */}
                <motion.div className={`p-6 ${cardBg} preserve-3d`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center gap-3 mb-5">
                        <MessageSquare className="w-5 h-5 text-[#973b88]" />
                        <h2 className="font-bold text-[#973b88] text-[15px] uppercase tracking-widest font-heading">
                            Write Something
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {textSent ? (
                            <motion.div key="sent" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 py-6">
                                <CheckCircle className="w-12 h-12 text-[#973b88] mb-2" />
                                <p className="text-[#973b88] font-bold text-lg">Message sent!</p>
                                <p className="text-[#77537e] text-sm mb-4">I&apos;ll read it with a smile.</p>
                                <button onClick={() => setTextSent(false)} className="text-[12px] font-medium text-[#77537e] hover:text-[#973b88] uppercase tracking-widest transition-colors">
                                    Write another?
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your feelings here..."
                                    rows={4}
                                    className={`w-full ${inputBox} mb-5 text-[#77537e] placeholder-[#77537e]/50 focus:outline-none focus:ring-2 focus:ring-[#973b88]/30 font-cute font-bold`}
                                />
                                {textError && <p className="text-red-400 text-xs mb-3 font-medium">{textError}</p>}
                                <button
                                    onClick={handleSendText}
                                    disabled={!message.trim() || textLoading}
                                    className={`w-full py-4 text-[13px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 rounded-2xl
                                    ${!message.trim() ? 'opacity-50 cursor-not-allowed ' + btnDefault : btnPrimary}`}
                                >
                                    {textLoading ? <motion.div className="w-4 h-4 border-2 border-[#973b88]/30 border-t-[#973b88] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} /> : (
                                        <><Send size={16} strokeWidth={2.5} /> Send Message</>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <motion.div className="text-center pb-6 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <p className="text-[#77537e] text-[10px] font-bold tracking-[0.2em] uppercase font-cute">
                        Made with <Heart className="inline w-3 h-3 mx-1 text-[#973b88] fill-[#973b88]" /> just for You
                    </p>
                    <p className="text-[#77537e]/60 text-[9px] font-bold tracking-[0.3em] uppercase mt-1 font-cute">
                        Artist
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
