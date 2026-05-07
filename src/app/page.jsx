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

  // 🎵 Audio Reference Setup
  const audioRef = useRef(null)

  // 1. Loader pe Continue click karne pe (First Song Play)
  const handleLoaderComplete = () => {
    setShowInitialLoader(false)
    setShowFunGames(true)

    // Hidden audio player ko direct play command dena
    if (audioRef.current) {
      audioRef.current.volume = 0.8; // Thodi volume set kar di
      audioRef.current.play().catch(e => console.log("Browser ne autoplay block kiya:", e))
    }
  }

  // 2. Games complete hone pe
  const handleGamesComplete = (score) => {
    setFinalGameScore(score)
    setShowFunGames(false) // Ye seedha Countdown page (screens[0]) pe le jayega
  }

  // 3. Countdown page se Next karne pe (Song Change)
  const handleCountdownComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause() // Pehla gaana roko
      audioRef.current.src = "/images/song2.mp3" // Dusra gaana lagao (make sure ye file public/images me ho)
      audioRef.current.load() // Naya gaana load karo
      audioRef.current.play().catch(e => console.log("Audio play blocked", e)) // Naya gaana chalao
    }

    setCurrentScreen(1) // Move to celebration
  }

  // Set Birthday Date here (11 June jaisa tumne bataya)
  const birthdayDate = new Date("2026-06-11T00:00:00") // Format fix: YYYY-MM-DD

  const screens = [
    <Countdown key="countdown" onNext={handleCountdownComplete} birthdayDate={birthdayDate} />,
    <Celebration key="celebration" onNext={() => setCurrentScreen(2)} finalScore={finalGameScore} />,
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(3)} />,
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(4)} />,
    <Letter key="letter" onNext={() => setCurrentScreen(5)} />,
    <Wishes key="wishes" onNext={() => setCurrentScreen(6)} />,
    <MessageBoard key="messageboard" />,
  ]

  // ==========================================
  // 🌟 PREMIUM NAVY BLUE THEME 🌟
  // ==========================================
  return (
    <div className="min-h-screen bg-[#162433] overflow-hidden relative">
      
      {/* 🎵 HIDDEN AUDIO PLAYER 🎵 */}
      {/* Ye tag screen pe nahi dikhega, par gaana yahin se bajega */}
      <audio 
        ref={audioRef} 
        src="/images/Song2.mp3" 
        loop 
        preload="auto" 
        className="hidden" 
      />

      {/* Elegant Background Accents */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {showInitialLoader && <Loader key="initial-loader" onComplete={handleLoaderComplete} />}
          {showFunGames && <FunGames key="fun-games" onComplete={handleGamesComplete} />}
          {!showInitialLoader && !showFunGames && (
            <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
          )}
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1, delay: 1 }} 
        className="fixed bottom-4 right-4 text-[11px] text-[#94a3b8] tracking-[0.2em] pointer-events-none z-50 font-bold uppercase"
      >
        @rao.mayankkk
      </motion.div>
    </div>
  )
}

