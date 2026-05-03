"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ArrowRight, X } from "lucide-react"
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
    ]

    // Component load hote hi photos ko RANDOMIZE (shuffle) kar dega
    useEffect(() => {
        const shuffled = [...initialPhotos].sort(() => Math.random() - 0.5)
        setRandomPhotos(shuffled)
    }, [])

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                className="text-center mb-8 z-10"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div className="mb-4 inline-block" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                        <Camera className="w-8 h-8 text-pink-400" />
                    </div>
                </motion.div>

                {/* 🌟 CLASSY HEADING 🌟 */}
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2">
                    Purely Her
                </h1>
                <p className="text-xs md:text-sm text-purple-300/80 font-medium tracking-[0.2em] uppercase italic">
                    Tap any photo to view
                </p>
            </motion.div>

            {/* ======================================= */}
            {/* INFINITE RANDOM SLIDER (NO CUBE, NO DOTS) */}
            {/* ======================================= */}
            <div className="w-full max-w-[300px] md:max-w-[380px] mx-auto z-10">
                {randomPhotos.length > 0 && (
                    <Swiper
                        grabCursor={true}
                        loop={true} // Infinite Loop
                        spaceBetween={20} // Har photo ke beech thoda gap
                        speed={800} // Smooth slide transition speed
                        autoplay={{
                            delay: 2500, // Har 2.5 second baad next photo aayegi
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]} // Sirf Autoplay, Pagination hata di
                        className="w-full h-[400px] md:h-[500px] rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10 bg-white/5 backdrop-blur-md"
                    >
                        {randomPhotos.map((photo, index) => (
                            <SwiperSlide key={photo.id} className="w-full h-full p-2">
                                <motion.div 
                                    className="w-full h-full rounded-[1.5rem] overflow-hidden cursor-pointer"
                                    whileHover={{ scale: 0.98 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImg(photo.src)}
                                >
                                    <img
                                        src={photo.src}
                                        alt={`Memory ${index + 1}`}
                                        className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* Bottom Section */}
            <motion.div className="mt-12 flex flex-col items-center gap-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">
                    <div className="w-8 h-[1px] bg-white/20" />
                    <span>Moments with you</span>
                    <div className="w-8 h-[1px] bg-white/20" />
                </div>

                <button
                    onClick={onNext}
                    className="group relative px-10 py-4 bg-white text-black font-black rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
                >
                    <div className="flex items-center space-x-3 relative z-10">
                        <span className="text-sm tracking-tight">ONE LAST THING</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </button>
            </motion.div>

            {/* ======================================= */}
            {/* FULL SCREEN LIGHTBOX (MODAL) */}
            {/* ======================================= */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                    >
                        <button 
                            className="absolute top-6 right-6 z-50 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all active:scale-90"
                            onClick={() => setSelectedImg(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <motion.img
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImg}
                            alt="Full View"
                            className="max-w-full max-h-full object-contain rounded-[2rem] shadow-[0_0_50px_rgba(236,72,153,0.3)] border border-white/10"
                            onClick={(e) => e.stopPropagation()} // Taaki image pe click karne se band na ho
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    )
}
