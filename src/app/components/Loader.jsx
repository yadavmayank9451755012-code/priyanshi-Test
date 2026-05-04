"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"

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
            className="min-h-screen relative overflow-hidden bg-[#050505] flex flex-col justify-center font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            {/* ======================================= */}
            {/* 🌊 IMAGE & PERFECT CURVE OVERLAY 🌊 */}
            {/* ======================================= */}
            <div className="absolute inset-0 z-0">
                {/* Photo: Right align and cover */}
                <img
                    src="/girl.jpg"
                    alt="Background"
                    className="w-full h-full object-cover object-[70%_20%] opacity-80"
                />
                
                {/* Dark fade from LEFT so text is easily readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full md:w-[70%]" />
                
                {/* Dark fade from BOTTOM */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                {/* Smooth Wavy Curve matching Option 4 */}
                <svg 
                    className="absolute bottom-0 w-full h-[25vh] md:h-[35vh] text-[#050505]" 
                    preserveAspectRatio="none" 
                    viewBox="0 0 1440 320"
                    fill="currentColor"
                >
                    <path d="M0,256L80,245.3C160,235,320,213,480,213.3C640,213,800,235,960,229.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>

            {/* ======================================= */}
            {/* ✨ FLOATING SPARKLES (Like Option 4) ✨ */}
            {/* ======================================= */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[3px] h-[3px] bg-pink-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            boxShadow: '0 0 8px 2px rgba(236, 72, 153, 0.6)'
                        }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>

            {/* ======================================= */}
            {/* 📝 LEFT-ALIGNED TEXT CONTENT 📝 */}
            {/* ======================================= */}
            <div className="relative z-20 px-8 md:px-16 w-full max-w-lg mt-10 md:mt-20">
                
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex flex-col items-start"
                >
                    {/* Heading matching option 4 */}
                    <h1 className="text-4xl md:text-5xl font-black leading-[1.15] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 mb-5 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        Preparing<br/>
                        Something<br/>
                        Special
                    </h1>
                    
                    {/* Beating Heart */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mb-4 ml-1"
                    >
                        <Heart className="w-5 h-5 text-pink-500 fill-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                    </motion.div>

                    {/* Status Text / Button Layer */}
                    <div className="h-16 ml-1 mt-1">
                        <AnimatePresence mode="wait">
                            {showButton ? (
                                <motion.button
                                    key="btn"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onComplete}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase text-xs md:text-sm"
                                >
                                    Continue <ArrowRight size={16} />
                                </motion.button>
                            ) : (
                                <motion.p
                                    key="text"
                                    className="text-gray-400 text-sm md:text-base font-medium tracking-wide"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
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
