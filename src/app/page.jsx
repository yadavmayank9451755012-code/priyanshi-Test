// src/app/page.jsx
"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import Loader from "./components/Loader"
import FunGames from "./components/FunGames"
import Celebration from "./components/Celebration"
import { motion } from "framer-motion"

export default function BirthdayApp() {
  const [showLoader, setShowLoader] = useState(true)
  const [showGames, setShowGames] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">
      
      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
      }} />

      <div className="fixed inset-0 z-0 blur-[120px] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
      }} />

      <AnimatePresence mode="wait">
        {showLoader && (
          <Loader key="loader" onComplete={() => {
            setShowLoader(false)
            setShowGames(true)
          }} />
        )}
        
        {showGames && (
          <FunGames key="games" onComplete={(score) => {
            setFinalScore(score)
            setShowGames(false)
            setShowCelebration(true)
          }} />
        )}
        
        {showCelebration && (
          <Celebration key="celebration" score={finalScore} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light">
        @rao.mayankkk
      </motion.div>
    </div>
  )
}