"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

export default function BackgroundEffects() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 3,
        delay: Math.random() * 4,
        duration: Math.random() * 6 + 8,
      })),
    []
  )

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 premium-bg" />
      <motion.div className="gradient-orb orb-one" animate={{ x: [0, 30, -10, 0], y: [0, -20, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="gradient-orb orb-two" animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="gradient-orb orb-three" animate={{ x: [0, 25, -15, 0], y: [0, -15, 15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="particle-dot"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}
