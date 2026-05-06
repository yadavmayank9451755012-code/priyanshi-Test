"use client"

import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

// Import all components
import Loader from "./components/Loader"
import FunGames from "./components/FunGames"
import Countdown from "./components/Countdown"
import Celebration from "./components/Celebration"
import HappyBirthday from "./components/HappyBirthday"
import PhotoGallery from "./components/PhotoGallery"
import Letter from "./components/Letter"
import Wishes from "./components/Wishes"
import MessageBoard from "./components/MessageBoard"

export default function BirthdayApp() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [showInitialLoader, setShowInitialLoader] = useState(true)
  const [showFunGames, setShowFunGames] = useState(false)
  const [finalGameScore, setFinalGameScore] = useState(0)

  // Audio Reference Background Control
  const audioRef = useRef(null)

  // 1. Loader pe Continue click karne pe
  const handleLoaderComplete = () => {
    // Play song 1
    const audio = new Audio("/images/AkhiyanGulab.mp3")
    audio.loop = true
    audio.play().catch(e => console.log("Audio play blocked", e))
    audioRef.current = audio

    setShowInitialLoader(false)
    setShowFunGames(true)
  }

  // 2. Games complete hone pe
  const handleGamesComplete = (score) => {
    setFinalGameScore(score)
    setShowFunGames(false) // Ye seedha Countdown page (screens[0]) pe le jayega
  }

  // 3. Countdown page se Next karne pe
  const handleCountdownComplete = () => {
    // Change song to song2.mp3
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const audio2 = new Audio("/images/song2.mp3")
    audio2.loop = true
    audio2.play().catch(e => console.log("Audio play blocked", e))
    audioRef.current = audio2

    setCurrentScreen(1) // Move to celebration
  }

  // Set Birthday Date here
  const birthdayDate = new Date("2026-05-03T20:25:00") // 11 June set kiya hai as per chat

  const screens = [
    <Countdown key="countdown" onNext={handleCountdownComplete} birthdayDate={birthdayDate} />,
    <Celebration key="celebration" onNext={() => setCurrentScreen(2)} onMusicStart={() => {}} finalScore={finalGameScore} />,
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(3)} />,
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(4)} />,
    <Letter key="letter" onNext={() => setCurrentScreen(5)} />,
    <Wishes key="wishes" onNext={() => setCurrentScreen(6)} />,
    <MessageBoard key="messageboard" />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)" }} />
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)" }} />

      <AnimatePresence mode="wait">
        {showInitialLoader && <Loader key="initial-loader" onComplete={handleLoaderComplete} />}
        {showFunGames && <FunGames key="fun-games" onComplete={handleGamesComplete} />}
        {!showInitialLoader && !showFunGames && (
          <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
        )}
      </AnimatePresence>

      <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light">
        @rao.mayankkk
      </motion.div>
    </div>
  )
}
