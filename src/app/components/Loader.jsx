"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight, Sparkles } from "lucide-react" // 👈 Sparkles import key to avoid previous build errors

export default function Loader({ onComplete }) {
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    // Pre-defined data for sparkles to avoid prerender issues with Math.random()
    const sparkleData = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        // Mix of gold and soft pink for minimalist aesthetic
        color: i % 2 === 0 ? '#fcd34d' : '#f9a8d4',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        boxShadow: i % 2 === 0 ? '0 0 6px 1px rgba(252, 211, 77, 0.5)' : '0 0 6px 1px rgba(249, 168, 212, 0.5)',
        animDuration: 2 + Math.random() * 2,
        delay: Math.random() * 2
    }))

    return (
        <motion.div
            // 👇 Shift to New Minimalist Light Background theme
            className="min-h-screen relative overflow-hidden bg-[#f4f6f8] flex flex-col justify-center font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
        >
            {/* ======================================= */}
            {/* 🌊 IMAGE & BLENDING OVERLAY 🌊 */}
            {/* ======================================= */}
            <div className="absolute inset-0 z-0">
                {/* Photo: Positioned and styled like image_3.png */}
                <img
                    src="/images/10.jpg" // 👈 Your confirmed image path
                    alt="Background"
                    // 👇 Mix-blend-mode to integrate into off-white background elegantly
                    className="absolute right-0 top-0 h-full w-[80%] object-cover object-[70%_20%] opacity-50 mix-blend-multiply"
                />
                
                {/* Soft fade from LEFT to off-white so text is easily readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f4f6f8] via-[#f4f6f8]/90 to-transparent w-full md:w-[70%]" />
                
                {/* Soft fade from BOTTOM to off-white */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f4f6f8] via-[#f4f6f8]/40 to-transparent" />

                {/* SVG Curve - Switched to match new background color for "perfect blending" */}
                <svg 
                    className="absolute bottom-0 w-full h-[20vh] md:h-[30vh] text-[#f4f6f8]" 
                    preserveAspectRatio="none" 
                    viewBox="0 0 1440 320"
                    fill="currentColor"
                >
                    <path d="M0,256L80,245.3C160,235,320,213,480,213.3C640,213,800,235,960,229.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>

            {/* ======================================= */}
            {/* ✨ RETAINED SPARKLES (Softened Colors) ✨ */}
            {/* ======================================= */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {sparkleData.map((s) => (
                    <motion.div
                        key={s.id}
                        className="absolute w-[3px] h-[3px] rounded-full"
                        style={{
                            backgroundColor: s.color,
                            left: s.left,
                            top: s.top,
                            boxShadow: s.boxShadow
                        }}
                        animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
                        transition={{ duration: s.animDuration, repeat: Infinity, delay: s.delay }}
                    />
                ))}
            </div>

            {/* ======================================= */}
            {/* 📝 LEFT-ALIGNED CONTENT 📝 */}
            {/* ======================================= */}
            <div className="relative z-20 px-8 md:px-20 w-full max-w-xl flex flex-col items-start mt-[-10vh]">
                
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex flex-col items-start w-full"
                >
                    {/* 👇 RETAINED H1 content, in New Elegant Style (Dark text, elegant font) */}
                    <h1 className="text-4xl md:text-5xl font-elegant font-bold leading-[1.2] tracking-tight text-[#2d3748] mb-5">
                        Preparing<br/>
                        Something<br/>
                        Special
                    </h1>
                    
                    {/* 👇 RETAINED Beating Heart (Softened Pink) */}
                    <motion.div 
                        animate={{ scale: [1, 1.15, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mb-8 ml-1"
                    >
                        <Heart className="w-5 h-5 text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_rgba(249,168,212,0.6)]" />
                    </motion.div>

                    {/* Status Text / Button Layer */}
                    <div className="h-16 w-full ml-1 mt-1">
                        <AnimatePresence mode="wait">
                            {showButton ? (
                                <motion.button
                                    key="btn"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onComplete}
                                    // 👇 NAYA PREMIUM BUTTON STYLE (Solid Slate Blue, centrally aligned bottom in image_3.png)
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#4a637c] rounded-full text-white font-semibold tracking-wide shadow-md hover:bg-[#3b5064] transition-all duration-300 text-sm md:text-base"
                                >
                                    Continue <ArrowRight size={18} strokeWidth={2.5} />
                                </motion.button>
                            ) : (
                                <motion.p
                                    key="text"
                                    // 👇 Softened "Please wait" text color, left-aligned standardmobile standard
                                    className="text-[#718096] text-sm md:text-base font-medium tracking-wide flex items-center gap-2"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    {/* Small gold sparkle flanked "Please wait..." for extra detail from image_3.png context */}
                                    <Sparkles className="w-3 h-3 text-[#fcd34d]" /> Please wait... <Sparkles className="w-3 h-3 text-[#fcd34d]" />
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
