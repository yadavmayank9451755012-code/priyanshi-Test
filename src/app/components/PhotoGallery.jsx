"use client"

import { useState } from "react"
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion"
import { Camera, ArrowRight, X } from "lucide-react"

export default function PhotoGallery({ onNext }) {
    const [selectedImg, setSelectedImg] = useState(null)
    
    // 12 Images Array (3.jpg removed)
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

    // ==========================================
    // 3D CONTINUOUS ROTATION LOGIC
    // ==========================================
    const rotation = useMotionValue(0)
    const [isDragging, setIsDragging] = useState(false)

    // Ye apne aap dheere dheere ghumayega
    useAnimationFrame((t, delta) => {
        if (!isDragging && !selectedImg) { // Agar image open nahi hai aur drag nahi ho raha
            rotation.set(rotation.get() - delta * 0.015) // Speed ekdum slow aur smooth
        }
    })

    // Drag (swipe) karne ka logic with High Sensitivity
    const handleDragStart = () => setIsDragging(true)
    const handleDragEnd = () => setIsDragging(false)
    const handleDrag = (_, info) => {
        rotation.set(rotation.get() + info.delta.x * 0.5) // 0.5 multiplier for good sensitivity
    }

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
                className="text-center mb-8 z-10 mt-4"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <motion.div className="mb-4 inline-block" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                        <Camera className="w-8 h-8 text-pink-400" />
                    </div>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2">
                    Purely Her
                </h1>
                <p className="text-xs md:text-sm text-purple-300/80 font-medium tracking-[0.2em] uppercase italic">
                    Tap any photo to view
                </p>
            </motion.div>

            {/* ======================================= */}
            {/* 12-SIDED 3D CAROUSEL (The Magic) */}
            {/* ======================================= */}
            <div className="w-full h-[350px] md:h-[450px] flex items-center justify-center relative z-10 [perspective:1200px] overflow-visible">
                <motion.div
                    className="relative w-[140px] h-[220px] md:w-[180px] md:h-[280px] [transform-style:preserve-3d] cursor-grab active:cursor-grabbing"
                    style={{ rotateY: rotation }}
                    drag="x"
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrag={handleDrag}
                >
                    {photos.map((photo, i) => {
                        const angle = i * 30 // 360 degrees / 12 photos = 30 degrees per photo
                        return (
                            <motion.div
                                key={photo.id}
                                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-white/10 backdrop-blur-sm"
                                style={{
                                    // 260px is the radius (distance from COM). Math: width/2 / tan(15deg)
                                    transform: `rotateY(${angle}deg) translateZ(260px)`,
                                    WebkitTransform: `rotateY(${angle}deg) translateZ(260px)`, // For iOS Safari
                                }}
                                onClick={() => setSelectedImg(photo.src)}
                            >
                                <img
                                    src={photo.src || "/placeholder.svg"}
                                    alt="Memory"
                                    className="w-full h-full object-cover pointer-events-none grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div className="mt-16 flex flex-col items-center gap-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
