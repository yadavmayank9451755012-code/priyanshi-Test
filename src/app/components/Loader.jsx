"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"

// Premium Sparkles Data
const sparkles = [
  { top: "10%", left: "15%", size: 14, color: "#fcd34d", delay: 0 },
  { top: "8%", left: "80%", size: 18, color: "#f9a8d4", delay: 0.3 },
  { top: "25%", left: "88%", size: 12, color: "#ffffff", delay: 0.6 },
  { top: "40%", left: "8%", size: 16, color: "#fcd34d", delay: 0.2 },
  { top: "45%", left: "90%", size: 20, color: "#f9a8d4", delay: 0.8 },
  { top: "60%", left: "10%", size: 12, color: "#ffffff", delay: 1.0 },
  { top: "70%", left: "85%", size: 18, color: "#fcd34d", delay: 0.4 },
  { top: "85%", left: "20%", size: 14, color: "#f9a8d4", delay: 1.2 },
  { top: "30%", left: "75%", size: 10, color: "#ffffff", delay: 0.5 },
]

export default function Loader({ onComplete }) {
  const [showButton, setShowButton] = useState(false)
  const [progress, setProgress] = useState(0)

  // 4 Second Progress & Button Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 1
      })
    }, 40) // 40ms * 100 = 4000ms (4 seconds)

    const timer = setTimeout(() => {
      setShowButton(true)
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  // ==========================================
  // 🌟 PREMIUM NAVY BLUE 3D THEME 🌟
  // ==========================================
  const bgBase = "bg-[#162433]"
  const cardBg = "bg-[#1B2A3A]"
  
  // 3D Neumorphism Shadows
  const puffyOut = "shadow-[12px_12px_24px_#111b25,-12px_-12px_24px_#25394f]"
  const puffyBtn = `bg-white text-[#162433] transition-all duration-300 rounded-[24px] shadow-[8px_8px_16px_#111b25,-8px_-8px_16px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3 px-10 py-4 uppercase tracking-[0.15em] text-[14px]`

  return (
    <div className={`min-h-screen relative w-full flex flex-col items-center overflow-hidden ${bgBase} font-sans pt-12 pb-8`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      `}</style>

      {/* Elegant Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] bg-pink-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Animated Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8], rotate: [0, 20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={s.color}>
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ======================================= */}
      {/* 1. TOP SECTION (Heart & Text) */}
      {/* ======================================= */}
      <div className="relative z-20 flex flex-col items-center text-center w-full px-6">
        <motion.div animate={{ scale: [1, 1.2, 0.95, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="mb-4">
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
            className="font-elegant font-black text-4xl md:text-5xl text-white leading-tight tracking-tight drop-shadow-md">
            Preparing
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
            className="font-elegant font-black text-4xl md:text-5xl text-white leading-tight tracking-tight drop-shadow-md">
            Something
        </motion.h1>
        
        {/* Cursive Special Text */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-1">
          <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-5xl md:text-6xl text-pink-300 tracking-wide drop-shadow-lg">
            Special
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "40px" }} transition={{ delay: 0.6 }} 
            className="h-[2px] bg-white/20 rounded-full mt-6 mb-4" />
      </div>

      {/* ======================================= */}
      {/* 2. CENTER SECTION (3D Photo Blob) */}
      {/* ======================================= */}
      <motion.div 
        className="relative z-20 w-full flex justify-center mt-6 flex-1 max-h-[400px]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        <motion.div 
            // 👈 3D NEUMORPHIC SHADOW ADDED TO BLOB
            className={`w-[260px] h-[320px] md:w-[300px] md:h-[360px] border-[6px] border-[#1B2A3A] overflow-hidden ${puffyOut}`}
            animate={{ 
                borderRadius: [
                    "60% 40% 55% 45% / 50% 55% 45% 50%", 
                    "40% 60% 45% 55% / 45% 50% 55% 50%", 
                    "60% 40% 55% 45% / 50% 55% 45% 50%"
                ],
                y: [0, -12, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/images/10.jpg" // 👈 Fixed Photo
            alt="Special person"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* ======================================= */}
      {/* 3. BOTTOM SECTION (Progress / Button) */}
      {/* ======================================= */}
      <div className="relative z-20 w-full flex flex-col items-center mt-8 px-6 min-h-[80px]">
        <AnimatePresence mode="wait">
          {!showButton ? (
            <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-[260px] flex flex-col items-center"
            >
              {/* Wait text */}
              <div className="flex items-center gap-2 text-[#94a3b8] text-[13px] font-bold tracking-[0.15em] uppercase mb-4">
                Please wait
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}>.</motion.span>
              </div>

              {/* 3D Progress Bar */}
              <div className="w-full h-2 bg-[#1B2A3A] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#111b25,inset_-2px_-2px_4px_#25394f]">
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-indigo-400"
                    style={{ width: `${progress}%`, transition: "width 0.1s linear" }} 
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
                key="button"
                initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full flex justify-center"
            >
              {/* 👈 3D PREMIUM REDIRECTION BUTTON */}
              <button 
                onClick={onComplete} 
                className={puffyBtn}
              >
                <span>Continue</span>
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
