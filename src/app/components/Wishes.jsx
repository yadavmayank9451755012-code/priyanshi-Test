"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Sparkles, MousePointerClick, Disc } from "lucide-react"

// 🎵 WISHES DATA + AUDIO FILES
const wishes = [
    {
        emoji: "🌸",
        title: "You Are Loved",
        text: "More than words can say, more than stars in the sky — you are surrounded by love today and always. Never forget how much you mean to the people lucky enough to have you.",
        audioSrc: "/images/wish1.mp3" // 👈 Apna edit wala gaana yahan daalna
    },
    {
        emoji: "✨",
        title: "You Are Magic",
        text: "The way you smile, the way you care, the way you show up — it's all pure magic. The world is genuinely better because you exist in it, Madam Jii.",
        audioSrc: "/images/wish2.mp3"
    },
    {
        emoji: "🌟",
        title: "Your Year Ahead",
        text: "May this year bring you everything your heart has been quietly wishing for. New adventures, deep joy, unexpected blessings, and every dream arriving right on time.",
        audioSrc: "/images/wish3.mp3"
    },
    {
        emoji: "💫",
        title: "Keep Shining",
        text: "You have this rare gift of making everyone around you feel seen and special. Keep being exactly who you are — the world needs more of your light.",
        audioSrc: "/images/wish4.mp3"
    },
    {
        emoji: "🎀",
        title: "Happy Birthday!",
        text: "Here's to cake, laughter, and celebrating YOU! You deserve every single good thing coming your way. Happy Birthday, beautiful soul — this one's all for you! 🎂🥳",
        audioSrc: "/images/wish5.mp3"
    },
]

export default function Wishes({ onNext, onBack }) {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)
    
    // 🎵 MAGIC STATES
    const [isFlipped, setIsFlipped] = useState(false) 
    const [progress, setProgress] = useState(0)
    const [isAudioFinished, setIsAudioFinished] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    
    const wishAudioRef = useRef(null)

    // ==========================================
    // 🎵 AUDIO CONTROL LOGIC
    // ==========================================
    const handleCardTap = () => {
        if (!isFlipped) {
            // FONT SE BACK (REVEAL)
            setIsFlipped(true)
            setIsAudioFinished(false)
            setProgress(0)
            
            const mainBGM = document.querySelector('audio.hidden')
            if (mainBGM) mainBGM.pause() // Main gaana chup!

            if (wishAudioRef.current) {
                wishAudioRef.current.src = wishes[current].audioSrc
                wishAudioRef.current.play().then(() => {
                    setIsPlaying(true)
                }).catch(e => console.log("Play failed", e))
            }
        }
    }

    const handleTimeUpdate = () => {
        if (wishAudioRef.current) {
            const current = wishAudioRef.current.currentTime
            const total = wishAudioRef.current.duration
            if (total) setProgress((current / total) * 100)
        }
    }

    const handleAudioEnd = () => {
        setIsPlaying(false)
        setIsAudioFinished(true)
        setProgress(100)
        
        // Gaana khatam hote hi Main BGM wapas chal jayega
        const mainBGM = document.querySelector('audio.hidden')
        if (mainBGM) mainBGM.play().catch(()=>{})
    }

    // Clean up if component unmounts
    useEffect(() => {
        return () => {
            const mainBGM = document.querySelector('audio.hidden')
            if (mainBGM && mainBGM.paused) mainBGM.play().catch(()=>{})
        }
    }, [])

    // ==========================================
    // NAVIGATION
    // ==========================================
    const goNext = () => {
        if (isFlipped && !isAudioFinished) return // Gaana khatam hone tak lock!
        
        if (current < wishes.length - 1) {
            setIsFlipped(false)
            setDirection(1)
            setTimeout(() => {
                setCurrent(c => c + 1)
                setProgress(0)
                setIsAudioFinished(false)
            }, 300) // Flip back animation delay
        }
    }

    const goPrev = () => {
        if (isFlipped && !isAudioFinished) return // Back jana bhi lock!
        
        if (current > 0) {
            setIsFlipped(false)
            setDirection(-1)
            setTimeout(() => {
                setCurrent(c => c - 1)
                setProgress(0)
                setIsAudioFinished(false)
            }, 300)
        }
    }

    const w = wishes[current]
    
    // Circle Math for SVG Progress Bar
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE THEME 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-2 px-6 py-3`
    const lockedBtn = `bg-[#1B2A3A] text-[#64748b] transition-all duration-300 rounded-[20px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] font-extrabold flex items-center justify-center gap-2 px-6 py-3 opacity-70 cursor-not-allowed`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${bgBase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* HIDDEN AUDIO PLAYER FOR WISHES */}
            <audio 
                ref={wishAudioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnd}
                preload="auto"
                className="hidden"
            />

            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-500/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <motion.div className="text-center mb-8 relative z-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-3xl md:text-5xl font-elegant font-black text-white mb-2 tracking-wide">
                    Secret Wishes
                </h1>
                <p className="text-[#94a3b8] text-[12px] font-bold tracking-[0.2em] uppercase">
                    Tap the card & feel the vibe 🎧
                </p>
            </motion.div>

            {/* 3D Flip Card */}
            <div className="relative z-10 w-full max-w-sm mx-auto [perspective:1000px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        initial={{ x: direction * 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction * -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full h-[400px]"
                    >
                        <motion.div
                            className="w-full h-full relative [transform-style:preserve-3d]"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* FRONT OF CARD (Hidden State) */}
                            <div 
                                onClick={handleCardTap}
                                className={`absolute w-full h-full rounded-3xl ${cardBg} shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#25394f] border border-white/10 p-8 flex flex-col items-center justify-center [backface-visibility:hidden] cursor-pointer`}
                            >
                                <div className="w-20 h-20 bg-[#162433] rounded-full flex items-center justify-center mb-6 shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]">
                                    <Sparkles className="w-8 h-8 text-[#94a3b8]" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Wish {current + 1}</h3>
                                <p className="text-[#64748b] text-[11px] font-bold flex items-center gap-2">
                                    <MousePointerClick size={14} /> Tap to unlock
                                </p>
                            </div>

                            {/* BACK OF CARD (Revealed State with DJ Progress) */}
                            <div className={`absolute w-full h-full rounded-3xl bg-white shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden]`} style={{ transform: 'rotateY(180deg)' }}>
                                
                                {/* 🎵 DJ CIRCULAR PROGRESS BAR 🎵 */}
                                <div className="relative flex items-center justify-center mb-6">
                                    {/* Glowing outer beat effect when playing */}
                                    {isPlaying && (
                                        <motion.div 
                                            className="absolute w-24 h-24 rounded-full border border-pink-400 opacity-50"
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {/* SVG Progress Circle */}
                                    <svg className="w-24 h-24 -rotate-90 transform drop-shadow-md">
                                        <circle cx="48" cy="48" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                                        <motion.circle 
                                            cx="48" cy="48" r={radius} 
                                            fill="transparent" 
                                            stroke="url(#gradient)" 
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            animate={{ strokeDashoffset }}
                                            transition={{ duration: 0.1, ease: "linear" }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ec4899" />
                                                <stop offset="100%" stopColor="#6366f1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Emoji inside the circle */}
                                    <div className="absolute text-4xl drop-shadow-sm">
                                        {w.emoji}
                                    </div>
                                </div>

                                <h2 className="text-xl font-black text-[#162433] mb-4 uppercase tracking-widest">
                                    {w.title}
                                </h2>
                                <p className="text-[#475569] leading-relaxed text-[13px] font-bold">
                                    {w.text}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="flex justify-center gap-3 mt-8">
                    {wishes.map((_, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-300 rounded-full h-2 ${i === current ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-[#475569]'}`}
                        />
                    ))}
                </div>

                {/* Nav buttons */}
                <div className="flex justify-between items-center mt-8 gap-3">
                    <button
                        onClick={goPrev}
                        disabled={current === 0 || (isFlipped && !isAudioFinished)}
                        className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/10 text-white disabled:opacity-30 transition-all hover:bg-white/5 active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={3} />
                    </button>

                    {current < wishes.length - 1 ? (
                        <button 
                            onClick={goNext} 
                            disabled={isFlipped && !isAudioFinished}
                            className={`flex-1 text-[13px] uppercase tracking-[0.15em] ${(isFlipped && !isAudioFinished) ? lockedBtn : puffyBtnPrimary}`}
                        >
                            {isFlipped && !isAudioFinished ? (
                                <>Listen... <Disc className="w-4 h-4 animate-spin text-pink-400" /></>
                            ) : (
                                <>Next Wish <ArrowRight size={16} strokeWidth={3} /></>
                            )}
                        </button>
                    ) : (
                        <button 
                            onClick={onNext} 
                            disabled={isFlipped && !isAudioFinished}
                            className={`flex-1 text-[13px] uppercase tracking-[0.15em] ${(isFlipped && !isAudioFinished) ? lockedBtn : puffyBtnPrimary}`}
                        >
                            {isFlipped && !isAudioFinished ? (
                                <>Listen... <Disc className="w-4 h-4 animate-spin text-pink-400" /></>
                            ) : (
                                <>Continue <ArrowRight size={16} strokeWidth={3} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
