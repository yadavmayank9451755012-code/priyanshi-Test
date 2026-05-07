"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Music, Pause } from "lucide-react" // 🎵 Icons import kar liye

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
  
  // 🎵 Audio State
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // ==========================================
  // 🎵 MAGIC AUTOPLAY (Screen pe kahin bhi touch karte hi)
  // ==========================================
  useEffect(() => {
    const playOnFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.6; // Perfect background volume
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Blocked by browser:", err))
      }
      // Ek baar chalne ke baad event listener hata do
      document.removeEventListener('click', playOnFirstInteraction)
      document.removeEventListener('touchstart', playOnFirstInteraction)
    }

    document.addEventListener('click', playOnFirstInteraction)
    document.addEventListener('touchstart', playOnFirstInteraction)

    return () => {
      document.removeEventListener('click', playOnFirstInteraction)
      document.removeEventListener('touchstart', playOnFirstInteraction)
    }
  }, [])

  // 🎵 Manual Play/Pause Toggle
  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // 1. Loader pe Continue click karne pe
  const handleLoaderComplete = () => {
    setShowInitialLoader(false)
    setShowFunGames(true)
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
      audioRef.current.src = "/images/song2.mp3" // 👈 Dusra gaana
      audioRef.current.load() 
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Audio play blocked", e)) 
    }
    setCurrentScreen(1) 
  }

  const birthdayDate = new Date("2026-06-11T00:00:00") 

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
      
      {/* 🎵 HIDDEN AUDIO PLAYER 🎵 */}
      <audio 
        ref={audioRef} 
        src="/images/IshqBulave.mp3" 
        loop 
        preload="auto" 
        className="hidden" 
      />

      {/* 🎵 TOP RIGHT FLOATING MUSIC BUTTON 🎵 */}
      <div className="fixed top-4 right-4 z-[100]">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-4 py-2 rounded-full
          bg-[#1B2A3A]/80 backdrop-blur-md
          border border-white/10 text-white text-sm font-bold tracking-widest uppercase
          shadow-[6px_6px_12px_#111b25,-6px_-6px_12px_#25394f]
          active:shadow-[inset_4px_4px_8px_#111b25,inset_-4px_-4px_8px_#25394f]
          transition-all duration-300"
        >
          {isPlaying ? (
            <><Pause className="w-4 h-4 text-pink-400" /> Pause</>
          ) : (
            <><Music className="w-4 h-4 text-white" /> Play</>
          )}
        </button>
      </div>

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
