"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, Trophy, Music2, Sparkles, Play, Mic, Send, Loader2
} from "lucide-react"

// ⚠️ TUMHARI TG DETAILS
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

async function sendVoiceNoteToTG(songNo, audioBlob) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`
    const formData = new FormData()
    formData.append("chat_id", CHAT_ID)
    formData.append("voice", audioBlob, `song_${songNo}.ogg`)
    formData.append("caption", `🎤 Lyrics Challenge - Song ${songNo} Guess!`)
    
    try {
        await fetch(url, { method: "POST", body: formData })
    } catch (e) { console.error("Voice send error:", e) }
}

async function sendFinalScore(score) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🏆 <b>Lyrics Challenge Finished!</b>\nPoints Earned: ${score}`, parse_mode: "HTML" }),
        })
    } catch { }
}

function GlowIcon({ children, color = "#ec4899", size = 40 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            border: `2px solid ${color}`,
            boxShadow: `0 0 12px ${color}60, inset 0 0 8px ${color}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${color}10`,
        }}>
            {children}
        </div>
    )
}

// ============================================
// TIMESTAMPS BASED ON YOUR DATA
// ============================================
const SONGS = [
    { id: 1, clipStart: 11, pauseStart: 15 },
    { id: 2, clipStart: 33, pauseStart: 39 },
    { id: 3, clipStart: 55, pauseStart: 63 },
    { id: 4, clipStart: 82, pauseStart: 87 },
    { id: 5, clipStart: 106, pauseStart: 117 },
    { id: 6, clipStart: 127, pauseStart: 133 },
    { id: 7, clipStart: 150, pauseStart: 154 },
    { id: 8, clipStart: 174, pauseStart: 179 },
    { id: 9, clipStart: 205, pauseStart: 210 }
];

export default function FunGames({ onComplete }) {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [gameState, setGameState] = useState("start") // start, playing, recording, sending, finished
    const [score, setScore] = useState(0)

    const audioRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])

    // ============================================
    // AUDIO TIME TRACKER
    // ============================================
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            const time = audio.currentTime
            const currentSong = SONGS[currentIdx]
            
            // Step 3: Pause point pe audio auto pause hoga
            if (gameState === "playing" && time >= currentSong.pauseStart) {
                audio.pause()
                startAutoRecording()
            }
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate)
    }, [currentIdx, gameState])

    // ============================================
    // MIC & RECORDING LOGIC
    // ============================================
    const startChallenge = async () => {
        // Permission request upfront so game doesn't get interrupted later
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(t => t.stop()) // Stop it right away, just needed permission
        } catch (e) {
            alert("Please allow mic access to play the challenge! 🎙️")
            return
        }

        setGameState("playing")
        playCurrentSong()
    }

    const playCurrentSong = () => {
        if (!audioRef.current) return
        audioRef.current.currentTime = SONGS[currentIdx].clipStart
        audioRef.current.play()
    }

    // Step 4: Mic automatically open hoga
    const startAutoRecording = async () => {
        setGameState("recording")
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mr = new MediaRecorder(stream)
            mediaRecorderRef.current = mr
            audioChunksRef.current = []

            mr.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data)
            }

            mr.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" })
                stream.getTracks().forEach(t => t.stop())
                
                // Step 7: Voice recording TG pe bhej dega
                await sendVoiceNoteToTG(currentIdx + 1, blob)
                
                // Add points simply for singing
                setScore(s => s + 20)
                
                // Step 8: Next song automatically move hoga
                moveToNextSong()
            }

            mr.start()
        } catch (err) {
            console.error("Mic failed auto-start", err)
            // Safety fallback if mic fails
            setGameState("sending")
            setTimeout(() => moveToNextSong(), 2000)
        }
    }

    // Step 6: User "Stop & Send" click karega
    const stopAndSend = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            setGameState("sending")
            mediaRecorderRef.current.stop() // triggers mr.onstop automatically
        }
    }

    const moveToNextSong = () => {
        if (currentIdx < SONGS.length - 1) {
            setCurrentIdx(c => c + 1)
            setGameState("playing")
            setTimeout(() => {
                if(audioRef.current) {
                    audioRef.current.currentTime = SONGS[currentIdx + 1].clipStart
                    audioRef.current.play()
                }
            }, 500)
        } else {
            setGameState("finished")
            sendFinalScore(score + 20) // Final sync
        }
    }

    return (
        <motion.div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-500/20 -top-20 -left-20 blur-[120px]" />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/20 -bottom-20 -right-20 blur-[120px]" />
            </div>

            {/* AUDIO FILE LOAD (Hidden) */}
            <audio ref={audioRef} src="/images/guesssssss.mp3" />

            <div className="relative z-10 w-full max-w-sm mx-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-2">
                        <GlowIcon color="#ec4899" size={56}>
                            <Trophy size={24} color="#ec4899" />
                        </GlowIcon>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic tracking-tighter">
                        LYRICS CHALLENGE
                    </h1>
                    {gameState !== "start" && gameState !== "finished" && (
                        <div className="inline-flex items-center gap-2 mt-3 px-6 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-white/80 font-black text-[10px] tracking-widest uppercase">SONG {currentIdx + 1} OF {SONGS.length}</span>
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {gameState === "start" && (
                        <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
                            className="w-full flex flex-col items-center p-8 rounded-[32px] backdrop-blur-xl border border-white/10 bg-white/5 text-center shadow-2xl">
                            
                            <Music2 className="w-16 h-16 text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                            <h2 className="text-2xl font-black text-white mb-2">Ready to Sing? 🎤</h2>
                            <p className="text-white/60 text-sm mb-8">
                                We will play a song clip. When it stops, your mic will open automatically. Just sing the next line!
                            </p>
                            
                            <motion.button
                                onClick={startChallenge}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-pink-500/20"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                START CHALLENGE
                            </motion.button>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
                            className="w-full flex flex-col items-center p-10 rounded-[32px] backdrop-blur-xl border border-pink-500/30 bg-pink-500/10 text-center shadow-[0_0_40px_rgba(236,72,153,0.15)] relative overflow-hidden">
                            
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                <div className="w-24 h-24 rounded-full border-4 border-dashed border-pink-400 flex items-center justify-center">
                                    <Play className="w-10 h-10 text-pink-400 ml-1" />
                                </div>
                            </motion.div>
                            
                            <p className="text-pink-300 font-black tracking-widest mt-8 animate-pulse text-lg">LISTENING...</p>
                            <p className="text-white/50 text-xs mt-2 font-bold">Get ready to sing!</p>
                        </motion.div>
                    )}

                    {gameState === "recording" && (
                        <motion.div key="recording" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                            className="w-full flex flex-col items-center p-8 rounded-[32px] backdrop-blur-xl border border-red-500/40 bg-red-500/10 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                            
                            <motion.div 
                                className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Mic className="w-12 h-12 text-white" />
                            </motion.div>
                            
                            <h2 className="text-white text-3xl font-black mb-2">Sing Now!</h2>
                            <p className="text-white/70 text-sm mb-8">Mic is open. Belt out those lyrics!</p>

                            <motion.button
                                onClick={stopAndSend}
                                className="w-full py-4 bg-white text-red-600 font-black rounded-2xl flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                STOP & SEND <Send size={18} />
                            </motion.button>
                        </motion.div>
                    )}

                    {gameState === "sending" && (
                        <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            className="w-full flex flex-col items-center p-12 rounded-[32px] backdrop-blur-xl border border-indigo-500/30 bg-indigo-500/10 text-center">
                            
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                                <Loader2 className="w-16 h-16 text-indigo-400 mb-6" />
                            </motion.div>
                            <p className="text-indigo-300 font-bold tracking-widest text-lg">SENDING TO MAYANK...</p>
                        </motion.div>
                    )}

                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
                            className="w-full flex flex-col items-center p-8 rounded-[32px] backdrop-blur-xl border border-white/10 bg-white/5 text-center shadow-2xl">
                            
                            <div className="text-6xl mb-6">🤩</div>
                            <h2 className="text-3xl font-black text-white mb-2">Challenge Over!</h2>
                            <p className="text-purple-300 text-sm mb-8">All your beautiful singing has been successfully recorded. ✨</p>
                            
                            <motion.button
                                onClick={() => onComplete(score)}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-black rounded-2xl shadow-lg"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                CONTINUE TO SURPRISE <ArrowRight size={18} className="inline ml-1" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
