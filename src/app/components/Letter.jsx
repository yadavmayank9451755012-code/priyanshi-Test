"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Heart, Sparkles, ArrowRight, Star } from "lucide-react"
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

I really want to thank your parents for bringing you into this world, because now you’re my friend and I feel so, so blessed. I’m incredibly lucky to have you in my life buddyyy..... Today isn't just about you getting a year older—it’s a celebration of all the joy, non-stop laughter, and beautiful memories you bring to everyone around youuu.... 

You have this literal magic power to light up any room and make people smile even when things feel dark. I don’t know about anyone else, but for me, you are everything and I’m just telling you the truthhh. Your heart is pure gold and your energy is just so infectious! Also... can we talk about your voice?? It is literally supercafigtidiliciuoss! 🎶✨

I hope you realize how rare you are and how much everyone around you appreciates you. Thank you for being the wonderful, amazing, and absolutely fantastic person you are. The world is so much brighter just because you’re in ittt!

Happy Birthday to a truly beautiful soul! 🥳💕
With all my love and the warmest wishes everrr,
Forever Yoursss ✨`

    // Auto-scroll when text types
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [currentText])

    // Typing effect & Luxury Confetti
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
                    
                    // Premium Confetti Colors (Gold, White, Slate)
                    const colors = ["#fcd34d", "#ffffff", "#94a3b8"]
                    
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
            }, 30) // Smooth typing speed
            return () => clearInterval(timer)
        }
    }, [showText])

    const handleOpenLetter = () => {
        setIsOpen(true)
        setTimeout(() => setShowText(true), 800)
    }

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE THEME CLASSES 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    
    const puffyCard = `${cardBg} rounded-[32px] shadow-[12px_12px_24px_#111b25,-12px_-12px_24px_#25394f] border border-white/5`
    const puffyInputBox = `bg-[#162433] rounded-[24px] shadow-[inset_6px_6px_12px_#111b25,inset_-6px_-6px_12px_#25394f] p-6 md:p-8 border-none`
    const puffyCircleBtn = `w-20 h-20 ${bgBase} rounded-full flex items-center justify-center mx-auto shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]`
    const puffyBtnPrimary = `w-full max-w-[300px] bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3 px-8 py-5 mx-auto`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${bgBase} font-sans`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            {/* Subtle Elegant Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{ left: `${(i * 20 + 5) % 100}%`, top: `${(i * 30 + 10) % 80}%` }}
                        animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Star className="w-3 h-3 text-white/30 fill-white/30" />
                    </motion.div>
                ))}
            </div>

            <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
                
                <motion.div className="text-center mb-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h1 className="text-3xl md:text-5xl font-elegant font-black text-white mb-3 tracking-wide drop-shadow-md">
                        A Special Letter
                    </h1>
                    <motion.p className="text-[#94a3b8] text-[11px] font-bold tracking-[0.2em] uppercase" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
                        Just for you, on your special day ✨
                    </motion.p>
                </motion.div>

                <motion.div
                    className="relative w-full flex justify-center"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                    <AnimatePresence mode="wait">
                        
                        {/* 1. ENVELOPE (Closed State) */}
                        {!isOpen ? (
                            <motion.div
                                key="envelope"
                                className={`w-[280px] h-[200px] md:w-[320px] md:h-[220px] ${puffyCard} cursor-pointer flex flex-col items-center justify-center relative`}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOpenLetter}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ rotateY: 90, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={puffyCircleBtn}>
                                    <Mail className="w-8 h-8 text-white" />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-white/80 font-bold text-[11px] uppercase tracking-widest">
                                    Tap to open <Heart className="w-3 h-3 text-white fill-white/50" />
                                </div>
                            </motion.div>
                        ) : (
                            
                        /* 2. OPEN LETTER */
                            <motion.div
                                key="letter"
                                className={`w-full ${puffyCard} p-6 md:p-10 relative flex flex-col`}
                                initial={{ rotateY: -90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                            >
                                <div className="text-center mb-6">
                                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                        <Heart className="w-10 h-10 text-white mx-auto fill-white/20 drop-shadow-md" />
                                    </motion.div>
                                </div>

                                {/* Deep Inset Box for the Letter Text */}
                                <div
                                    ref={scrollRef}
                                    className={`min-h-[50vh] max-h-[50vh] md:min-h-[350px] md:max-h-[350px] overflow-y-auto ${puffyInputBox} custom-scrollbar`}
                                    style={{ scrollBehavior: "smooth" }}
                                >
                                    {/* Scrollbar hide CSS inline for absolute clean look */}
                                    <style>{`
                                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
                                    `}</style>

                                    {showText && (
