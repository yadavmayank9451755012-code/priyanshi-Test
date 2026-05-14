"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Sparkles, Heart, MousePointerClick } from "lucide-react"
import { WISHES } from "../data/content"

export default function Wishes({ onNext, onBack }) {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isFlipped, setIsFlipped] = useState(false)

    const wishes = WISHES

    const goNext = () => {
        if (current < wishes.length - 1) {
            setIsFlipped(false)
            setDirection(1)
            setCurrent(c => c + 1)
        }
    }

    const goPrev = () => {
        if (current > 0) {
            setIsFlipped(false)
            setDirection(-1)
            setCurrent(c => c - 1)
        }
    }

    const w = wishes[current]

    // Premium styles
    const cardBg = "glass-card"
    const btnPrimary = "glass-button text-[#973b88] font-bold flex items-center justify-center gap-2 px-6 py-3 rounded-xl"

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-aesthetic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-200/30 blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <motion.div className="text-center mb-8 relative z-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-3xl md:text-5xl font-bold text-[#973b88] mb-2 tracking-wide drop-shadow font-heading"
                    style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>
                    Secret Wishes
                </h1>
                <p className="text-[#77537e] text-[13px] font-bold tracking-[0.15em] uppercase font-cute">
                    Tap the card to reveal 💌
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
                        className="w-full h-[380px] cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            className="w-full h-full relative [transform-style:preserve-3d]"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* FRONT OF CARD (Hidden State) */}
                            <div className={`absolute w-full h-full rounded-3xl ${cardBg} p-8 flex flex-col items-center justify-center [backface-visibility:hidden]`}>
                                <div className="neu-image-frame w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                                    <Sparkles className="w-8 h-8 text-[#973b88]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#973b88] uppercase tracking-widest mb-2 font-heading">Wish {current + 1}</h3>
                                <p className="text-[#77537e] text-[12px] font-bold flex items-center gap-2 font-cute">
                                    <MousePointerClick size={14} /> Tap to open
                                </p>
                            </div>

                            {/* BACK OF CARD (Revealed State) */}
                            <div className={`absolute w-full h-full rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center text-center [backface-visibility:hidden] border border-white/50`} style={{ transform: 'rotateY(180deg)' }}>
                                <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                    {w.emoji}
                                </motion.div>
                                <h2 className="text-xl font-bold text-[#973b88] mb-4 uppercase tracking-widest font-heading">
                                    {w.title}
                                </h2>
                                <p className="text-[#77537e] leading-relaxed text-sm font-bold font-cute">
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
                            className={`transition-all duration-300 rounded-full h-2 ${i === current ? 'w-6 bg-[#973b88] shadow-[0_0_10px_rgba(151,59,136,0.5)]' : 'w-2 bg-[#eecfeb]'}`}
                        />
                    ))}
                </div>

                {/* Nav buttons */}
                <div className="flex justify-between items-center mt-8 gap-3">
                    <button
                        onClick={goPrev}
                        disabled={current === 0}
                        className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#973b88]/20 text-[#973b88] disabled:opacity-30 transition-all hover:bg-[#973b88]/10 active:scale-95 glass-button"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={3} />
                    </button>

                    {current < wishes.length - 1 ? (
                        <button onClick={goNext} className={`flex-1 ${btnPrimary} text-[13px] uppercase tracking-[0.12em]`}>
                            Next Wish <ArrowRight size={16} strokeWidth={3} />
                        </button>
                    ) : (
                        <button onClick={onNext} className={`flex-1 ${btnPrimary} text-[13px] uppercase tracking-[0.12em]`}>
                            Continue <ArrowRight size={16} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
