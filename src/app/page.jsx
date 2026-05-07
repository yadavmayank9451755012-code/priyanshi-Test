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
  
  // 🎵 Audio Reference
  const audioRef = useRef(null)

  // 1. Loader pe "Continue" click karne pe (Music Starts Here)
  const handleLoaderComplete = () => {
    setShowInitialLoader(false)
    setShowFunGames(true)

    // 🎵 Continue button ke click par hi gaana chalu hoga
    if (audioRef.current) {
      audioRef.current.volume = 0.7; // Thodi decent volume
      audioRef.current.play().catch(e => {
        console.log("Audio play blocked or file missing:", e)
      })
    }
  }

  // 2. Games complete hone pe
  const handleGamesComplete = (score) => {
    setFinalGameScore(score)
    setShowFunGames(false) 
  }

  // 3. Countdown page se Next karne pe (Song Change)
  const handleCountdownComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause() 
      audioRef.current.src = "/images/song2.mp3" 
      audioRef.current.load() 
      audioRef.current.play().catch(e => console.log("Audio change error:", e)) 
    }
    setCurrentScreen(1) 
  }

  const birthdayDate = new Date("2026-05-07T11:51:00") 

  const screens = [
    <Countdown key="countdown" onNext={handleCountdownComplete} birthdayDate={birthdayDate} />,
    <Celebration key="celebration" onNext={() => setCurrentScreen(2)} finalScore={finalGameScore} />,
    <HappyBirthday key="happy" onNext={() => setCurrentScreen(3)} />,
    <PhotoGallery key="gallery" onNext={() => setCurrentScreen(4)} />,
    <Letter key="letter" onNext={() => setCurrentScreen(5)} />,
    <Wishes key="wishes" onNext={() => setCurrentScreen(6)} />,
    <MessageBoard key="messageboard" />,
  ]

  return (
    <div className="min-h-screen bg-[#162433] overflow-hidden relative">
      
      {/* 🎵 HIDDEN AUDIO PLAYER (No buttons on UI) 🎵 */}
      <audio 
        ref={audioRef} 
        src="/images/IshqBulave.mp3" 
        loop 
        preload="auto" 
        className="hidden" 
      />

      {/* Background Accents */}
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
