"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FloatingHearts() {
    const [hearts, setHearts] = useState([])

    // Neon colors ka array (Pink, Purple, Blue vibes)
    const neonColors = [
        "rgba(236, 72, 153, 0.6)", // Pink
        "rgba(168, 85, 247, 0.6)", // Purple
        "rgba(99, 102, 241, 0.6)", // Indigo
    ]

    useEffect(() => {
        // Generate random properties for 20 hearts
        const generatedHearts = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            size: Math.random() * 15 + 10, // Size between 10px and 25px
            left: Math.random() * 100, // Random horizontal position (%)
            delay: Math.random() * 5, // Random start delay
            duration: Math.random() * 10 + 10, // Duration between 10s and 20s
            color: neonColors[Math.random() > 0.5 ? 0 : 1] // Select Pink or Purple mainly
        }))
        setHearts(generatedHearts)
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute"
                    style={{
                        width: heart.size,
                        height: heart.size,
                        left: `${heart.left}%`,
                        color: heart.color,
                        filter: `drop-shadow(0 0 5px ${heart.color})` // 🌟 Neon Glow Effect
                    }}
                    initial={{ y: "110vh", opacity: 0 }}
                    animate={{
                        y: "-10vh", // Float up past the top
                        opacity: [0, 1, 1, 0], // Fade in, stay, fade out near top
                        x: [0, Math.random() * 50 - 25, 0] // Slight wobble
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* SVG Heart icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    )
}
