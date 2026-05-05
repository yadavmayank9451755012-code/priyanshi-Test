"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ArrowRight, X, Sparkles } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function PhotoGallery({ onNext }) {
    const [selectedImg, setSelectedImg] = useState(null)
    const [randomPhotos, setRandomPhotos] = useState([])

    // 12 Images Array (3.jpg removed)
    const initialPhotos = [
        { id: 1, src: "/images/1.jpg" },
        { id: 2, src: "/images/2.jpg" },
        { id: 4, src: "/images/4.jpg" },
        { id: 5, src: "/images/5.jpg" },
        { id: 6, src: "/images/6.jpg" },
        { id: 7, src: "/images/7.jpg" },
        { id: 8, src: "/images/8.jpg" },
        { id: 9, src: "/images/9.jpg" },
        { id: 10, src: "/images/10.jpg" },
        { id: 11, src: "/images/11.jpg" },
        { id: 12, src: "/images/12.jpg" },
        { id: 13, src: "/images/13.jpg" },
        { id: 13, src: "/images/14.jpg"},
        { id: 13, src: "/images/15.jpg"},
        { id: 12, src: "/images/3.jpg" },
    ]

    useEffect(() => {
        const shuffled = [...initialPhotos].sort(() => Math.random() - 0.5)
        setRandomPhotos(shuffled)
    }, [])

    // ==========================================
    // 🌟 PREMIUM NAVY BLUE THEME 🌟
    // ==========================================
    const bgBase = "bg-[#162433]"
    const cardBg = "bg-[#1B2A3A]"
    const puffyBtnPrimary = `bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center gap-3 px-10 py-5`

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden ${bgBase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <motion.div className="text-center mb-8 z-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className={`w-16 h-16 ${cardBg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f]`}>
                    <Camera className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-elegant font-black text-white mb-2 tracking-wide">
                    Purely Her
                </h1>
                <p className="text-[#94a3b8] text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-white" /> Tap any photo to view
                </p>
            </motion.div>

            {/* INFINITE RANDOM SLIDER */}
            <div className="w-full max-w-[300px] md:max-w-[380px] mx-auto z-10">
                {randomPhotos.length > 0 && (
                    <Swiper
                        grabCursor={true}
                        loop={true}
                        spaceBetween={20}
                        speed={800}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className={`w-full h-[400px] md:h-[480px] rounded-[2rem] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#25394f] border border-white/5 ${cardBg} p-2`}
                    >
                        {randomPhotos.map((photo, index) => (
                            <SwiperSlide key={photo.id} className="w-full h-full">
                                <motion.div 
                                    className="w-full h-full rounded-[1.5rem] overflow-hidden cursor-pointer"
                                    whileHover={{ scale: 0.98 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImg(photo.src)}
                                >
                                    <img
                                        src={photo.src}
                                        alt={`Memory`}
                                        className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* Bottom Section */}
            <motion.div className="mt-12 flex flex-col items-center z-10 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <button onClick={onNext} className={`w-full max-w-[300px] text-[13px] uppercase tracking-[0.15em] ${puffyBtnPrimary}`}>
                    One Last Thing <ArrowRight size={18} strokeWidth={3} />
                </button>
            </motion.div>

            {/* FULL SCREEN LIGHTBOX */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#162433]/95 backdrop-blur-xl p-4 md:p-8"
                    >
                        <button 
                            className="absolute top-6 right-6 z-50 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all active:scale-90"
                            onClick={() => setSelectedImg(null)}
                        >
                            <X className="w-6 h-6" strokeWidth={3} />
                        </button>
                        
                        <motion.img
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImg}
                            alt="Full View"
                            className="max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
