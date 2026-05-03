"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "motion/react"
import { motion } from "framer-motion"

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
  // Main flow states
  const [currentScreen, setCurrentScreen] = useState(0)
  const [showInitialLoader, setShowInitialLoader] = useState(true)
  const [showFunGames, setShowFunGames] = useState(false)
  const [finalGameScore, setFinalGameScore] = useState(0)
  
  // Birthday logic
  const birthdayDate = new Date("2026-04-11T00:00:00")
  const [isBirthdayOver, setIsBirthdayOver] = useState(new Date().getTime() >= birthdayDate.getTime())
  const [musicStarted, setMusicStarted] = useState(false)

  // Auto close Loader after 4 seconds (original behavior)
  useEffect(() => {
    if (showInitialLoader) {
      const timer = setTimeout(() => {
        setShowInitialLoader(false)
        setShowFunGames(true)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showInitialLoader])

  // Handle FunGames completion
  const handleGamesComplete = (score) => {
    setFinalGameScore(score)
    setShowFunGames(false)
    // Move to celebration or countdown based on birthday
    setCurrentScreen(0)
  }

  // Screens sequence after games/loader
  const screens = [
    !isBirthdayOver
      ? <Countdown key="countdown" onComplete={() => setIsBirthdayOver(true)} birthdayDate={birthdayDate} />
      : <Celebration key="celebration" onNext={() => setCurrentScreen(1)} onMusicStart={() => setMusicStarted(true)} finalScore={finalGameScore} />,
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(2)} />,
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(3)} />,
    <Letter key="letter" onNext={() => setCurrentScreen(4)} />,
    <Wishes key="wishes" onNext={() => setCurrentScreen(5)} />,
    <MessageBoard key="messageboard" />,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">

      {/* Background radial gradients */}
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
      }} />

      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
      }} />

      <div className="fixed inset-0 z-0 blur-[160px] opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(228, 193, 255, 0.4), transparent 40%)",
      }} />

      <AnimatePresence mode="wait">
        {/* Initial Loader (4 sec) */}
        {showInitialLoader && <Loader key="initial-loader" onComplete={() => {}} />}
        
        {/* Fun Games (Memory + Song + Color Match) */}
        {showFunGames && <FunGames key="fun-games" onComplete={handleGamesComplete} />}
        
        {/* Main Birthday Screens Sequence */}
        {!showInitialLoader && !showFunGames && (
          <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light"
      >
        @rao.mayankkk
      </motion.div>
    </div>
  )
}
