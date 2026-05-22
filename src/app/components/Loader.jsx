"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"

// Premium Sparkles Data
const sparkles = [
  { top: "10%", left: "15%", size: 14, color: "#f472b6", delay: 0 },
  { top: "8%", left: "80%", size: 18, color: "#a855f7", delay: 0.3 },
  { top: "25%", left: "88%", size: 12, color: "#ffffff", delay: 0.6 },
  { top: "40%", left: "8%", size: 16, color: "#f472b6", delay: 0.2 },
  { top: "45%", left: "90%", size: 20, color: "#a855f7", delay: 0.8 },
  { top: "60%", left: "10%", size: 12, color: "#ffffff", delay: 1.0 },
  { top: "70%", left: "85%", size: 18, color: "#f472b6", delay: 0.4 },
  { top: "85%", left: "20%", size: 14, color: "#a855f7", delay: 1.2 },
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

  return (
    <div className="min-h-screen relative w-full flex flex-col items-center overflow-hidden bg-aesthetic font-sans pt-12 pb-8">
      
      {/* Elegant Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] bg-pink-300/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] left-[20%] w-[40%] h-[30%] bg-purple-300/15 blur-[80px] rounded-full" />
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

      {/* Premium Card Container */}
      <div className="relative z-20 flex flex-col items-center text-center w-full px-6">
        <motion.div animate={{ scale: [1, 1.2, 0.95, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="mb-4">
          <Heart className="w-8 h-8 text-[#973b88] fill-[#973b88] drop-shadow-[0_0_10px_rgba(151,59,136,0.6)]" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
            className="text-4xl md:text-5xl text-[#973b88] leading-tight tracking-tight drop-shadow-md font-bold">
            Preparing
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
            className="text-4xl md:text-5xl text-[#973b88] leading-tight tracking-tight drop-shadow-md font-bold">
            Something
        </motion.h1>
        
        {/* Cursive Special Text */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-1">
          <span className="text-5xl md:text-6xl text-[#973b88] tracking-wide drop-shadow-lg font-bold italic">
            Special
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "40px" }} transition={{ delay: 0.6 }} 
            className="h-[2px] bg-[#973b88]/20 rounded-full mt-6 mb-4" />
      </div>

      {/* Center Section (Premium Photo Frame) */}
      <motion.div 
        className="relative z-20 w-full flex justify-center mt-6 flex-1 max-h-[400px]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        {/* Glowing Outer Ring */}
        <motion.div 
          className="absolute w-[320px] h-[400px] md:w-[380px] md:h-[460px] rounded-[30px]"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)",
            filter: "blur(25px)"
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Premium Frame Container */}
        <div className="relative w-[280px] h-[360px] md:w-[340px] md:h-[420px]">
          {/* Gradient Border Background */}
          <motion.div 
            className="absolute inset-0 rounded-[25px] p-1"
            style={{
              background: "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #f472b6 100%)",
              boxShadow: "0 0 40px rgba(244,114,182,0.4), 0 0 60px rgba(168,85,247,0.3)"
            }}
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            {/* Inner white container for image */}
            <div className="relative w-full h-full bg-white/95 rounded-[24px] overflow-hidden backdrop-blur-sm">
              {/* Image */}
              <img
                src="/images/10.jpg"
                alt="Special person"
                className="w-full h-full object-cover object-center"
              />
              {/* Elegant overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Decorative Corner Accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-pink-400/40 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400/40 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400/40 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-pink-400/40 rounded-br-lg" />
            </div>
          </motion.div>
          
          {/* Floating Accent Orbs */}
          <motion.div 
            className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-60"
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-tr from-purple-300 to-purple-400 rounded-full opacity-60"
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Bottom Section (Progress / Button) */}
      <div className="relative z-20 w-full flex flex-col items-center mt-8 px-6 min-h-[80px]">
        <AnimatePresence mode="wait">
          {!showButton ? (
            <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-[260px] flex flex-col items-center"
            >
              {/* Wait text */}
              <div className="flex items-center gap-2 text-[#77537e] text-[13px] font-bold tracking-[0.15em] uppercase mb-4">
                Please wait
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}>.</motion.span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#fff]/50 rounded-full overflow-hidden shadow-inner">
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
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
              {/* Premium Continue Button */}
              <button 
                onClick={onComplete} 
                className="neu-button text-[#973b88] px-10 py-4 font-bold flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-[14px]"
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
