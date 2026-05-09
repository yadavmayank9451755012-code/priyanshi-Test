"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Heart, Sparkles, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

export default function Letter({ onNext }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showText, setShowText] = useState(false)
    const [currentText, setCurrentText] = useState("")
    const [showCursor, setShowCursor] = useState(true)
    const [done, setDone] = useState(false)
    const scrollRef = useRef(null)

    const letterText = `My Dearest Madam Jii,

Happy Birthday to the most amazing person!! 🎂✨ Honestly, on this super special day, a real life angel was born... and her name is Priyanshiii! 🤍

I really want to thank your parents for bringing you into this world, because now you're my friend and I feel so, so blessed. I'm incredibly lucky to have you in my life buddyyy..... Today isn't just about you getting a year older—it's a celebration of all the joy, non-stop laughter, and beautiful memories you bring to everyone around youuu.... 

You have this literal magic power to light up any room and make people smile even when things feel dark. I don't know about anyone else, but for me, you are everything and I'm just telling you the truthhh. Your heart is pure gold and your energy is just so infectious! Also... can we talk about your voice?? It is literally supercafigtidiliciuoss! 🎶✨

I hope you realize how rare you are and how much everyone around you appreciates you. Thank you for being the wonderful, amazing, and absolutely fantastic person you are. The world is so much brighter just because you're in ittt!

Happy Birthday to a truly beautiful soul! 🥳💕
With all my love and the warmest wishes everrr,
Forever Yoursss ✨`

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [currentText])

    useEffect(() => {
        if (showText) {
            let index = 0
            const timer = setInterval(() => {
                if (index < letterText.length) {
                    setCurrentText(letterText.slice(0, index + 1))
                    index++
                } else {
                    clearInterval(timer)
                    setShowCursor(false)
                    setDone(true)
                    
                    const colors = ["#f472b6", "#a855f7", "#fcd34d"]
                    
                    confetti({
                        particleCount: 80,
                        spread: 90,
                        origin: { y: 0.5 },
                        colors: colors,
                        zIndex: 100
                    })
                    setTimeout(() => {
                        confetti({ particleCount: 50, spread: 60, origin: { x: 0.1, y: 0.6 }, colors: colors, zIndex: 100 })
                        confetti({ particleCount: 50, spread: 60, origin: { x: 0.9, y: 0.6 }, colors: colors, zIndex: 100 })
                    }, 400)
                }
            }, 30)
            return () => clearInterval(timer)
        }
    }, [showText])

    const handleOpenLetter = () => {
        setIsOpen(true)
        setTimeout(() => setShowText(true), 800)
    }

    // Premium styles
    const premiumCard = "bg-[#fff8fc] rounded-[32px] shadow-[0_25px_50px_-12px_rgba(151,59,136,0.25)] border border-white/50"
    const inputBox = "bg-[#fff] rounded-[24px] shadow-inner p-6 md:p-8 border border-pink-100"
    const btnPrimary = "bg-[#f1caeb] text-[#973b88] transition-all duration-300 rounded-[20px] px-8 py-4 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#f5d4f0] active:scale-95 w-full max-w-[300px] uppercase tracking-[0.12em] text-[13px]"

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#fdf7ff] bg-polka-dots font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-300/20 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
                <motion.div className="text-center mb-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#973b88] mb-3 tracking-wide drop-shadow-md"
                        style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>A Special Letter</h1>
                    <motion.p className="text-[#77537e] text-[13px] font-medium tracking-[0.15em] uppercase" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>Just for you, on your special day ✨</motion.p>
                </motion.div>

                <motion.div className="relative w-full flex justify-center" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>
                    <AnimatePresence mode="wait">
                        {!isOpen ? (
                            <motion.div
                                key="envelope"
                                className={`w-[280px] h-[200px] md:w-[320px] md:h-[220px] ${premiumCard} cursor-pointer flex flex-col items-center justify-center relative`}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOpenLetter}
                                exit={{ rotateY: 90, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="w-20 h-20 bg-gradient-to-b from-white/80 to-pink-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <Mail className="w-8 h-8 text-[#973b88]" />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-[#973b88] font-bold text-[12px] uppercase tracking-widest">Tap to open <Heart className="w-3 h-3 text-[#973b88] fill-[#973b88]/50" /></div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="letter"
                                className={`w-full ${premiumCard} p-6 md:p-10 relative flex flex-col`}
                                initial={{ rotateY: -90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                            >
                                <div className="text-center mb-6">
                                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                        <Heart className="w-10 h-10 text-[#973b88] mx-auto fill-[#973b88]/20" />
                                    </motion.div>
                                </div>

                                <div ref={scrollRef} className={`min-h-[50vh] max-h-[50vh] md:min-h-[350px] md:max-h-[350px] overflow-y-auto ${inputBox} scrollbar-hide`}>
                                    {showText && (
                                        <div className="whitespace-pre-wrap text-[#77537e] text-[15px] md:text-[16px] font-medium leading-[1.9] tracking-wide">
                                            {currentText}
                                            {showCursor && <motion.span className="inline-block w-[3px] h-[18px] bg-[#973b88] ml-1 align-middle rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />}
                                        </div>
                                    )}
                                </div>

                                {done && onNext && (
                                    <motion.div className="mt-8 relative z-20 w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }}>
                                        <button onClick={onNext} className={btnPrimary}>See what&apos;s next <ArrowRight size={18} strokeWidth={3} /></button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}
