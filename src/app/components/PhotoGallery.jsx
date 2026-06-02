"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ArrowRight, X } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function PhotoGallery({ onNext }) {
    const [selectedImg, setSelectedImg] = useState(null)
    const [randomPhotos, setRandomPhotos] = useState([])
    const swiperRef = useRef(null)

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
        { id: 16, src: "/images/3.jpg" },
    ]

    useEffect(() => {
        const shuffled = [...initialPhotos].sort(() => Math.random() - 0.5)
        setRandomPhotos(shuffled)
    }, [])

    // Slider pause/play logic
    const handleImageClick = (src) => {
        setSelectedImg(src)
        if (swiperRef.current) swiperRef.current.autoplay.stop()
    }

    const handleCloseModal = () => {
        setSelectedImg(null)
        if (swiperRef.current) swiperRef.current.autoplay.start()
    }

    // Dark Premium Theme Classes
    const puffyCard = "bg-[#1B2A3A] rounded-[32px] shadow-[10px_10px_20px_#111b25,-10px_-10px_20px_#213345] border border-white/5"
    const imageFrame = "bg-[#162433] rounded-[24px] shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f] border border-white/5 p-3"
    const btnPrimary = "bg-white text-[#162433] transition-all duration-300 rounded-[20px] shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f] active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] font-extrabold flex items-center justify-center p-5 uppercase tracking-widest text-[14px]"

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center p-4 relative font-sans text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-300/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-300/10 blur-[120px] rounded-full" />
            </div>

            <motion.div className="text-center mb-8 z-10 w-full max-w-[380px]" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className={`${puffyCard} w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
                    <Camera className="w-10 h-10 text-pink-400" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-widest uppercase">
                    Memories
                </h1>
            </motion.div>

            {/* INFINITE RANDOM SLIDER */}
            <div className="w-full max-w-[340px] md:max-w-[400px] mx-auto z-10">
                {randomPhotos.length > 0 && (
                    <div className={imageFrame}>
                        <Swiper
                            onSwiper={(swiper) => { swiperRef.current = swiper }}
                            grabCursor={true}
                            loop={true}
                            spaceBetween={16}
                            speed={800}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            modules={[Autoplay]}
                            className="w-full aspect-[4/5] rounded-[16px]"
                        >
                            {randomPhotos.map((photo) => (
                                <SwiperSlide key={photo.id} className="w-full h-full">
                                    <motion.div 
                                        className="w-full h-full rounded-[16px] overflow-hidden cursor-pointer"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleImageClick(photo.src)}
                                    >
                                        <img
                                            src={photo.src}
                                            alt="Memory"
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <motion.div className="mt-10 flex flex-col items-center z-10 w-full max-w-[340px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <button onClick={onNext} className={`w-full ${btnPrimary}`}>
                    One Last Thing <ArrowRight size={20} strokeWidth={3} className="ml-2" />
                </button>
            </motion.div>

            {/* FULL SCREEN LIGHTBOX (Image Viewer) */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-xl p-4"
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 z-50 text-white bg-[#1e293b] p-4 rounded-full shadow-lg transition-all active:scale-90 border border-white/10"
                            onClick={handleCloseModal}
                        >
                            <X className="w-6 h-6" strokeWidth={3} />
                        </button>
                        
                        {/* Enlarged Image without cropping */}
                        <motion.img
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImg}
                            alt="Full View"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()} // Click on image won't close it
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
