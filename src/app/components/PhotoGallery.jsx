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

    // 12 Images Array
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
        { id: 14, src: "/images/14.jpg" },
        { id: 15, src: "/images/15.jpg" },
        { id: 16, src: "/images/3.jpg" },
    ]

    useEffect(() => {
        const shuffled = [...initialPhotos].sort(() => Math.random() - 0.5)
        setRandomPhotos(shuffled)
    }, [])

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-aesthetic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-300/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-300/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-rose-200/30 blur-[100px] rounded-full" />
            </div>

            <motion.div className="text-center mb-10 z-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="neu-card w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-10 h-10 text-[#973b88]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-[#973b88] mb-3 tracking-wide drop-shadow"
                    style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>
                    Purely Her
                </h1>
                <p className="text-[#77537e] text-[14px] font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#973b88]" /> Tap any photo to view
                </p>
            </motion.div>

            {/* INFINITE RANDOM SLIDER - Enlarged & Neumorphism */}
            <div className="w-full max-w-[340px] md:max-w-[460px] mx-auto z-10">
                {randomPhotos.length > 0 && (
                    <div className="neu-image-frame">
                        <Swiper
                            grabCursor={true}
                            loop={true}
                            spaceBetween={16}
                            speed={800}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            modules={[Autoplay]}
                            className="w-full h-[480px] md:h-[580px] rounded-[1.5rem] bg-gradient-to-b from-white/60 to-pink-100/40"
                        >
                            {randomPhotos.map((photo, index) => (
                                <SwiperSlide key={photo.id} className="w-full h-full p-2">
                                    <motion.div 
                                        className="w-full h-full rounded-[1.25rem] overflow-hidden cursor-pointer neu-card-pressed"
                                        whileHover={{ scale: 0.98 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImg(photo.src)}
                                    >
                                        <img
                                            src={photo.src}
                                            alt="Memory"
                                            className="w-full h-full object-cover hover:grayscale-0 transition-all duration-500"
                                        />
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <motion.div className="mt-14 flex flex-col items-center z-10 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <button onClick={onNext} className="neu-button text-[#973b88] px-10 py-5 font-bold flex items-center justify-center gap-3 uppercase tracking-[0.12em] text-[14px]">
                    One Last Thing <ArrowRight size={20} strokeWidth={3} />
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#fdf7ff]/95 backdrop-blur-xl p-4 md:p-8"
                    >
                        <button 
                            className="absolute top-6 right-6 z-50 text-[#77537e] bg-white/80 hover:bg-white p-4 rounded-full shadow-lg transition-all active:scale-90"
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
                            className="max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(151,59,136,0.3)]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
