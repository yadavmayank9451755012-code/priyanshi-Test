"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Loader({ onComplete }) {
    const [showButton, setShowButton] = useState(false)

    // 4 second baad button dikhayenge
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen relative overflow-hidden"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="text-center relative z-10 flex flex-col items-center">
                <div className="cssload-main">
                    <div className="cssload-heart">
                        <span className="cssload-heartL"></span>
                        <span className="cssload-heartR"></span>
                        <span className="cssload-square"></span>
                    </div>
                    <div className="cssload-shadow "></div>
                </div>

                <motion.h1
                    className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mt-24 py-1.5"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    Preparing Something Special
                </motion.h1>

                {showButton ? (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase"
                    >
                        Continue ✨
                    </motion.button>
                ) : (
                    <motion.p
                        className="text-purple-300 text-lg mt-8"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Please wait...
                    </motion.p>
                )}
            </div>
        </motion.div>
    )
}
