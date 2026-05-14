"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ArrowRight, X, Sparkles } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { GALLERY_PHOTOS } from "../data/content"

export default function PhotoGallery({ onNext }) {
    const [selectedImg, setSelectedImg] = useState(null)
    const [randomPhotos, setRandomPhotos] = useState([])

    useEffect(() => {
        const shuffled = [...GALLERY_PHOTOS].sort(() => Math.random() - 0.5)
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

            <motion.div
                className="text-center mb-10 z-10"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
            >
                <motion.div variants={{ hidden: { scale: 0, rotate: -180 }, visible: { scale: 1, rotate: 0 } }} className="neu-card w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-10 h-10 text-[#973b88]" />
                </motion.div>
                <motion.h1 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-5xl md:text-7xl font-bold text-[#973b88] mb-3 tracking-wide drop-shadow font-heading"
                    style={{ filter: "drop-shadow(0 0 20px rgba(151,59,136,0.4))" }}>
                    Purely Her
                </motion.h1>
                <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#77537e] text-[14px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 font-cute">
                    <Sparkles className="w-4 h-4 text-[#973b88]" /> Tap any photo to view
                </motion.p>
            </motion.div>

            {/* 3D CARDS SLIDER */}
            <div className="w-full max-w-[300px] md:max-w-[500px] lg:max-w-[600px] mx-auto z-10 perspective-1000">
                {randomPhotos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Swiper
                            effect={'cards'}
                            grabCursor={true}
                            loop={true}
                            speed={800}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            modules={[Autoplay, EffectCards]}
                            className="w-full h-[400px] md:h-[600px] lg:h-[700px]"
                        >
                            {randomPhotos.map((photo, index) => (
                                <SwiperSlide key={photo.id} className="rounded-[2rem] overflow-hidden shadow-2xl">
                                    <div
                                        className="w-full h-full cursor-pointer relative group"
                                        onClick={() => setSelectedImg(photo.src)}
                                    >
                                        <img
                                            src={photo.src}
                                            alt="Memory"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                            <Sparkles className="text-white w-8 h-8" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                )}
            </div>

            {/* Bottom Section */}
            <motion.div className="mt-14 flex flex-col items-center z-10 w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                <button onClick={onNext} className="glass-button text-[#973b88] px-10 py-5 font-bold flex items-center justify-center gap-3 uppercase tracking-[0.12em] text-[14px] rounded-2xl">
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
