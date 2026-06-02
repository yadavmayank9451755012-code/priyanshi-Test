"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Heart, Hand } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

// Updated content to match the true meaning (Appreciation/Truths)
const thoughts = [
    {
        emoji: "🌸",
        title: "You Are Loved",
        text: "More than words can say, more than stars in the sky — you are surrounded by love today and always. Never forget how much you mean to the people lucky enough to have you.",
    },
    {
        emoji: "✨",
        title: "You Are Magic",
        text: "The way you smile, the way you care, the way you show up — it's all pure magic. The world is genuinely better because you exist in it, Madam Jii.",
    },
    {
        emoji: "🌟",
        title: "Your Journey",
        text: "May this year bring you everything your heart has been quietly wishing for. New adventures, deep joy, unexpected blessings, and every dream arriving right on time.",
    },
    {
        emoji: "💫",
        title: "Keep Shining",
        text: "You have this rare gift of making everyone around you feel seen and special. Keep being exactly who you are — the world needs more of your light.",
    },
    {
        emoji: "🎀",
        title: "Happy Birthday!",
        text: "Here's to cake, laughter, and celebrating YOU! You deserve every single good thing coming your way. Happy Birthday, beautiful soul — this one's all for you! 🎂🥳",
    },
]

export default function Thoughts({ onNext }) {
    const [activeIndex, setActiveIndex] = useState(0)

    // Colors matching the original theme
    const primaryColor = "#973b88"; // Bold Purple/Pink
    const textColor = "#77537e"; // Text Gray-Purple

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdf7ff] font-sans relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
        >
            {/* Elegant Original Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-100/30 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-100/30 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-100/40 blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <motion.div className="text-center mb-8 relative z-10 w-full max-w-sm" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-3xl font-black mb-2 uppercase tracking-widest drop-shadow-sm" style={{ color: primaryColor }}>
                    Little Truths
                </h1>
                
                {/* Swipe Instruction with blinking animation */}
                <motion.p 
                    className="text-[12px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 mt-4"
                    style={{ color: textColor }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Hand size={14} className="-rotate-45" /> Swipe cards left or right
                </motion.p>
            </motion.div>

            {/* Swipeable 3D Cards */}
            <div className="relative z-10 w-full max-w-[320px] mx-auto mt-4">
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards]}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="w-full h-[400px]"
                >
                    {thoughts.map((thought, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center w-full h-full">
                            <div className="w-full h-full bg-[#fdf7ff] rounded-[32px] shadow-[6px_6px_16px_rgba(151,59,136,0.15),-6px_-6px_16px_rgba(255,255,255,1)] border border-white/60 p-8 flex flex-col items-center text-center justify-center">
                                <motion.div 
                                    className="text-6xl mb-6 bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(151,59,136,0.1),inset_-4px_-4px_8px_rgba(255,255,255,1)]"
                                    animate={{ scale: index === activeIndex ? [1, 1.05, 1] : 1 }} 
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {thought.emoji}
                                </motion.div>
                                <h2 className="text-xl font-bold mb-4 uppercase tracking-widest" style={{ color: primaryColor }}>
                                    {thought.title}
                                </h2>
                                <p className="leading-relaxed text-sm font-medium" style={{ color: textColor }}>
                                    {thought.text}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-3 mt-10 relative z-10">
                {thoughts.map((_, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-300 rounded-full h-2 ${i === activeIndex ? 'w-6 shadow-md' : 'w-2 bg-[#eecfeb]'}`}
                        style={{ backgroundColor: i === activeIndex ? primaryColor : undefined }}
                    />
                ))}
            </div>

            {/* Final Continue Button - Appears only when reached the last card */}
            <div className="h-20 w-full max-w-[320px] mt-8 relative z-10 flex items-center justify-center">
                <AnimatePresence>
                    {activeIndex === thoughts.length - 1 && (
                        <motion.button 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={onNext} 
                            className="w-full px-5 py-5 rounded-[20px] font-extrabold flex items-center justify-center gap-2 uppercase tracking-widest text-[14px] transition-all
                                       bg-[#fdf7ff] shadow-[6px_6px_12px_rgba(151,59,136,0.1),-6px_-6px_12px_rgba(255,255,255,1)]
                                       hover:shadow-[4px_4px_8px_rgba(151,59,136,0.1),-4px_-4px_8px_rgba(255,255,255,1)]
                                       active:shadow-[inset_4px_4px_8px_rgba(151,59,136,0.1),inset_-4px_-4px_8px_rgba(255,255,255,1)]"
                            style={{ color: primaryColor }}
                        >
                            Continue <ArrowRight size={20} strokeWidth={3} className="ml-2" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
