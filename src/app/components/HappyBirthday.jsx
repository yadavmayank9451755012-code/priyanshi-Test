"use client"

import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function HappyBirthday({ onNext }) {
    const [balloonCount, setBalloonCount] = useState(5);

    useEffect(() => {
        const updateBalloonCount = () => {
            setBalloonCount(window.innerWidth >= 768 ? 20 : 8);
        };

        updateBalloonCount();
        window.addEventListener('resize', updateBalloonCount);

        return () => window.removeEventListener('resize', updateBalloonCount);
    }, []);

    // Floating stars background
    const FloatingStars = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/30 select-none"
                    style={{
                        left: `${(i * 41) % 100}%`,
                        top: `${(i * 67) % 100}%`,
                        fontSize: `${10 + (i % 4) * 6}px`,
                    }}
                    animate={{
                        opacity: [0.1, 0.5, 0.1],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                    }}
                >
                    {["✦", "✧", "⋆", "·"][i % 4]}
                </motion.div>
            ))}
        </div>
    )

    // Balloon Component
    const Balloon = ({ color, delay = 0, x = 0 }) => (
        <motion.div
            className="absolute pointer-events-none"
            style={{
                left: `${x}%`,
                bottom: "-2.5%",
                zIndex: 5,
            }}
            animate={{
                y: [0, -18, 0],
                x: [0, 6, -6, 0],
                rotate: [0, 4, -4, 0],
            }}
            transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
            }}
        >
            <div className="relative w-[70px] h-[80px]">
                {/* Balloon glow */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-b ${color} blur-md opacity-40 rounded-full`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay }}
                />
                {/* Balloon shape */}
                <div
                    className={`w-full h-full bg-gradient-to-b ${color} relative shadow-lg`}
                    style={{
                        borderRadius: "75% 75% 80% 80% / 75% 75% 80% 80%",
                    }}
                >
                    {/* Highlight 1 */}
                    <div className="absolute top-2 left-2 w-3 h-5 bg-white/50 rounded-full blur-[1px]" />
                    {/* Highlight 2 */}
                    <div className="absolute bottom-2 left-3 w-2 h-1 bg-white/30 rounded-full blur-[0.5px]" />
                </div>

                {/* Tie */}
                <div
                    className={`absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[12px] h-[12px] bg-gradient-to-b ${color}`}
                    style={{
                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    }}
                />

                {/* String */}
                <svg
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ top: "90px" }}
                    width="2"
                    height="40"
                    viewBox="0 0 2 40"
                >
                    <motion.path
                        d="M1 0 Q 4 20 1 40"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                        fill="none"
                        animate={{ d: ["M1 0 Q 4 20 1 40", "M1 0 Q -3 20 1 40", "M1 0 Q 4 20 1 40"] }}
                        transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
                    />
                </svg>
            </div>
        </motion.div>
    )

    // Cake
    const AnimatedCake = () => (
        <motion.div
            className="relative z-10"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Cake glow */}
            <motion.div
                className="absolute inset-0 blur-2xl rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.35) 0%, transparent 70%)", zIndex: -1 }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex flex-col items-center">

                {/* Candles */}
                <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-[50px] flex justify-between">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="relative">
                            <motion.div
                                className="relative mx-auto"
                                animate={{
                                    scaleY: [1, 1.3, 1],
                                    scaleX: [1, 0.8, 1],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            >
                                <div className="w-2 h-3 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full mx-auto" />
                                <motion.div
                                    className="w-4 h-4 bg-yellow-300/60 rounded-full absolute -top-1 -left-1 blur-sm"
                                    animate={{
                                        scale: [0.8, 1.3, 0.8],
                                        opacity: [0.3, 0.8, 0.3],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                    }}
                                />
                            </motion.div>
                            <div className="w-1.5 h-8 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-sm mx-auto shadow-sm" />
                        </div>
                    ))}
                </div>

                {/* Top layer */}
                <div className="w-20 h-10 bg-gradient-to-b from-purple-200 to-purple-400 rounded-xl relative mx-auto -mt-1 shadow-lg">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-300 to-indigo-400 rounded-t-xl" />
                    {/* Frosting drips */}
                    {[20, 50, 75].map((left, i) => (
                        <div key={i} className="absolute -top-1 w-2 h-3 bg-white/70 rounded-b-full" style={{ left: `${left}%` }} />
                    ))}
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-3 w-1.5 h-1.5 bg-pink-100 rounded-full"
                            style={{ left: `${35 + i * 15}%` }}
                        />
                    ))}
                </div>

                {/* Middle layer */}
                <div className="w-28 h-12 bg-gradient-to-b from-pink-200 to-pink-400 rounded-xl relative mx-auto -mt-2 shadow-lg">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-300 to-purple-400 rounded-t-xl" />
                    {/* Frosting drips */}
                    {[15, 38, 62, 82].map((left, i) => (
                        <div key={i} className="absolute -top-1 w-2 h-3 bg-white/70 rounded-b-full" style={{ left: `${left}%` }} />
                    ))}
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-3 w-1.5 h-1.5 bg-white rounded-full"
                            style={{ left: `${20 + i * 15}%` }}
                        />
                    ))}
                </div>

                {/* Bottom layer */}
                <div className="w-36 h-14 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-xl relative mx-auto -mt-1 shadow-lg">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-300 to-pink-400 rounded-t-xl" />
                    {/* Frosting drips */}
                    {[10, 25, 42, 58, 74, 88].map((left, i) => (
                        <div key={i} className="absolute -top-1 w-2 h-4 bg-white/70 rounded-b-full" style={{ left: `${left}%` }} />
                    ))}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-4 w-2 h-2 bg-red-400 rounded-full shadow-sm"
                            style={{ left: `${15 + i * 12}%` }}
                        />
                    ))}
                </div>

                {/* Cake plate */}
                <div className="w-40 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-lg" />
                {/* Plate shadow */}
                <div className="w-36 h-1.5 bg-black/10 rounded-full blur-sm mt-0.5" />
            </div>
        </motion.div>
    )

    const balloonColors = [
        "from-red-400 to-red-500",
        "from-blue-400 to-blue-500",
        "from-green-400 to-green-600",
        "from-yellow-400 to-yellow-600",
        "from-purple-400 to-purple-600",
        "from-pink-400 to-pink-600",
    ]

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Subtle radial bg glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(168,85,247,0.18) 0%, transparent 70%)",
                }}
            />

            <FloatingStars />

            {/* Balloons at bottom */}
            {Array.from({ length: balloonCount }, (_, i) => {
                const colorIndex = i % balloonColors.length;
                const xPosition = (100 / balloonCount) * i;

                return (
                    <Balloon
                        key={`balloon-${i}`}
                        color={balloonColors[colorIndex]}
                        delay={i * 0.2}
                        x={xPosition}
                    />
                );
            })}

            <motion.div
                className="text-center mb-8 relative z-10"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                }}
            >
                <div className="mb-8">
                    <AnimatedCake />
                </div>

                <motion.h1
                    className="text-5xl md:text-7xl py-1.5 md:py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 relative z-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    style={{ filter: "drop-shadow(0 0 24px rgba(168,85,247,0.4))" }}
                >
                    Happy Birthday
                </motion.h1>

                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                >
                    Madam Jii<span className="text-white">💕</span>
                </motion.h2>

                <motion.div
                    className="text-xl md:text-2xl text-purple-300 mb-8 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ textShadow: "0 0 10px rgba(0,0,0,0.8)" }}
                >
                    <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block mr-2"
                    >
                        🎉
                    </motion.span>
                    It's your special day!
                    <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                        className="inline-block ml-2"
                    >
                        🎉
                    </motion.span>
                </motion.div>
            </motion.div>

            <motion.div
                className="relative z-20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            >
                {/* Button glow */}
                <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ background: "linear-gradient(to right, #ec4899, #a855f7, #6366f1)", opacity: 0.5 }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <button
                    onClick={onNext}
                    className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white text-xl px-8 py-4 rounded-full shadow-xl border-2 border-white/70 transition-all duration-300 hover:scale-[103%]"
                >
                    <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
                        <span>See Our Moments</span>
                        <ArrowRight className="w-6 h-6" />
                    </motion.div>
                </button>
            </motion.div>
        </motion.div>
    )
}
