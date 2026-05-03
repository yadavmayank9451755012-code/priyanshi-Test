"use client"

import { motion } from "framer-motion"
import { Camera, ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCube, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cube'

export default function PhotoGallery({ onNext }) {

    // ✅ Explicit array - 12 Images total (3.jpg removed)
    const photos = [
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

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Aesthetic Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Smooth linear continuous rotation ke liye custom CSS */}
            <style jsx global>{`
                .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>

            <motion.div
                className="text-center mb-10 z-10"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className="mb-6 inline-block"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                        <Camera className="w-10 h-10 text-pink-400" />
                    </div>
                </motion.div>

                {/* 🌟 CLASSY HEADING 🌟 */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-3">
                    Purely Her
                </h1>
                
                {/* 🌟 CLASSY SUBHEADING 🌟 */}
                <p className="text-sm md:text-base text-purple-300/80 font-medium tracking-[0.2em] uppercase italic">
                    Beauty in its simplest and most authentic form
                </p>
            </motion.div>

            {/* Infinite Smooth Cube Gallery with Glassmorphism */}
            <div className="w-full max-w-[320px] md:max-w-[400px] mx-auto z-10">
                <Swiper
                    effect={'cube'}
                    grabCursor={true}
                    loop={true}
                    speed={6000} // 👈 Ekdum Dheemi aur dreamy speed (6 seconds)
                    touchRatio={2.5} // 👈 High Sensitivity (halke se touch par react karega)
                    autoplay={{
                        delay: 0, // Continuous motion
                        disableOnInteraction: false, // Touch karne ke baad wapas slowly ghoomne lagega
                    }}
                    cubeEffect={{
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 25,
                        shadowScale: 0.9,
                    }}
                    modules={[EffectCube, Autoplay]}
                    className="mySwiper h-[320px] md:h-[400px]"
                >
                    {photos.map((photo, index) => (
                        <SwiperSlide key={photo.id}>
                            <div className="w-full h-full p-1 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                <img
                                    src={photo.src || "/placeholder.svg"}
                                    alt={`Memory ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <motion.div
                className="mt-16 flex flex-col items-center gap-6 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                {/* 🌟 MOMENTS WITH YOU 🌟 */}
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
        </motion.div>
    )
}
