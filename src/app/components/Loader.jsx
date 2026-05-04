"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight, Sparkles } from "lucide-react"

export default function Loader({ onComplete }) {
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden bg-[#f4f6f8] flex flex-col justify-center font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >

            {/* ======================================= */}
            {/* 🌊 IMAGE SECTION (FIXED - NO CUT) */}
            {/* ======================================= */}
            <div className="absolute inset-0 z-0 flex items-end justify-end">
                <img
                    src="/images/10.jpg"
                    alt="Background"
                    className="h-[85%] md:h-full object-contain opacity-70 select-none pointer-events-none"
                />

                {/* LEFT GRADIENT FOR TEXT VISIBILITY */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f4f6f8] via-[#f4f6f8]/80 to-transparent" />

                {/* BOTTOM SOFT BLEND */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f4f6f8] via-transparent to-transparent" />
            </div>

            {/* ======================================= */}
            {/* ✨ SOFT FLOATING SPARKLES */}
            {/* ======================================= */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[4px] h-[4px] rounded-full"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#fcd34d' : '#f9a8d4',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            boxShadow: '0 0 8px rgba(255,255,255,0.4)'
                        }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* ======================================= */}
            {/* 📝 CONTENT */}
            {/* ======================================= */}
            <div className="relative z-20 px-8 md:px-20 max-w-xl">

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#2d3748] mb-6">
                        Preparing<br/>
                        Something<br/>
                        Special
                    </h1>

                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mb-8"
                    >
                        <Heart className="w-6 h-6 text-pink-400 fill-pink-400 drop-shadow-md" />
                    </motion.div>

                    <div className="h-16">
                        <AnimatePresence mode="wait">
                            {showButton ? (
                                <motion.button
                                    key="btn"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onComplete}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#4a637c] rounded-full text-white font-semibold shadow-lg hover:bg-[#3b5064] transition"
                                >
                                    Continue <ArrowRight size={18} />
                                </motion.button>
                            ) : (
                                <motion.p
                                    key="text"
                                    className="text-[#718096] text-sm flex items-center gap-2"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Sparkles className="w-4 h-4 text-[#fcd34d]" />
                                    Please wait...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}