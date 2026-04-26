"use client"

import { motion, AnimatePresence } from "motion/react"
import {
  Gift, Sparkles, Heart, Music, Star,
  PartyPopper, Cake, Balloon, Volume2, VolumeX
} from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect, useState, useRef } from "react"

export default function Celebration({ onNext }) {
  const [showSurprise, setShowSurprise] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [floatingHearts, setFloatingHearts] = useState([])
  const [screen, setScreen] = useState({ width: 0, height: 0 })

  const audioRef = useRef(null)

  const colors = ["#ff69b4", "#ff1493", "#9370db", "#00bfff", "#ffd700", "#ff4500"]

  // ✅ Fix: window safe
  useEffect(() => {
    setScreen({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  // Confetti + hearts
  useEffect(() => {
    if (screen.width === 0) return

    const duration = 4000
    const end = Date.now() + duration

    const frame = () => {
      const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

      for (let i = 0; i < 3; i++) {
        confetti({
          particleCount: 2,
          angle: i === 0 ? 55 : i === 1 ? 125 : 90,
          spread: 60,
          origin: { x: i === 0 ? 0 : i === 1 ? 1 : 0.5, y: i === 2 ? 0.2 : 0.5 },
          colors: [randomColor(), randomColor()],
        })
      }

      if (Date.now() < end) requestAnimationFrame(frame)
    }

    frame()

    const heartInterval = setInterval(() => {
      const id = Date.now() + Math.random()
      setFloatingHearts(prev => [...prev, { id, x: Math.random() * 100 }])

      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== id))
      }, 4000)
    }, 800)

    return () => clearInterval(heartInterval)
  }, [screen])

  const handleCelebrateClick = () => {
    setClickCount(prev => prev + 1)

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    })

    if (clickCount + 1 >= 3) {
      setShowSurprise(true)
      setTimeout(() => setShowSurprise(false), 3000)
    }

    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)

  // ✅ Prevent SSR crash
  if (screen.width === 0) return null

  return (
    <>
      <audio ref={audioRef} src="/celebration.mp3" preload="auto" />

      {/* Floating Hearts */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none z-50"
          style={{ left: `${heart.x}%`, bottom: 0 }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -screen.height, opacity: 0 }}
          transition={{ duration: 4 }}
        >
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </motion.div>
      ))}

      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
      >

        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * screen.width,
                y: Math.random() * screen.height,
              }}
              animate={{ y: -200, opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-white/10 p-2 rounded-full"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>

        {/* Gift */}
        <div className="mb-8 cursor-pointer" onClick={handleCelebrateClick}>
          <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <Gift className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          Time to Celebrate 🎉
        </h1>

        <button
          onClick={handleCelebrateClick}
          className="bg-pink-500 px-6 py-3 rounded-full text-white mb-4"
        >
          POP Confetti!
        </button>

        <button
          onClick={onNext}
          className="bg-white/20 px-6 py-3 rounded-full text-white"
        >
          Continue
        </button>

        <AnimatePresence>
          {showSurprise && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white p-6 rounded-xl text-center">
                🎁 Surprise!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}