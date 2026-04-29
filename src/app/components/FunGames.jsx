"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, RotateCcw, Trophy, ChevronRight, Brain, Music2, Palette, 
    Sparkles, Heart, Star, Moon, Droplet, Zap, Gem, Flame, Sun, Send, CheckCircle, XCircle
} from "lucide-react"

// ⚠️ TUMHARI DETAILS
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

// Telegram Update Function
async function sendEmojiGuessToTG(emoji, expected, actual, isCorrect, points) {
    const text = `🎯 <b>Emoji Song Update</b>\n\nEmojis: ${emoji}\n<b>Target Song:</b> ${expected}\n<b>She Picked:</b> ${actual || "[No Selection]"}\n\n<b>Result:</b> ${isCorrect ? "✅ Correct" : "❌ Wrong"}\n<b>Points:</b> ${points > 0 ? "+" : ""}${points}`
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
        })
    } catch (e) { console.error(e) }
}

async function sendFinalScore(gameName, score) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🏆 <b>GAME OVER: ${gameName}</b>\nFinal Total Score: ${score} points`, parse_mode: "HTML" }),
        })
    } catch { }
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
// EMOJI SONG GUESS GAME (FIXED)
// ============================================
const EMOJI_SONGS = [
    { emoji: "☀️ ⛅ 🌑", answer: "Suraj Hua Maddham", options: ["Suraj Hua Maddham", "Chand Chhupa", "Tum Hi Ho", "Kesariya"] },
    { emoji: "👁️ 👁️ 🔫", answer: "Aankh Marey", options: ["Naina", "Aankh Marey", "Kala Chashma", "Goggle"] },
    { emoji: "🌙 🌌 💑", answer: "Raataan Lambiyan", options: ["Channa Mereya", "Raataan Lambiyan", "Tera Ban Jaunga", "Zaalima"] },
    { emoji: "🧵 ❤️", answer: "Moh Moh Ke Dhaage", options: ["Lal Ishq", "Moh Moh Ke Dhaage", "Dhaaga", "Tere Sang Yaara"] },
    { emoji: "💃 🕺 🍷", answer: "Badtameez Dil", options: ["Ghungroo", "Dilliwali Girlfriend", "Badtameez Dil", "Saturday Saturday"] },
    { emoji: "👓 🕶️ 😎", answer: "Kala Chashma", options: ["Swag Se Swagat", "Kala Chashma", "Kar Gayi Chull", "DJ Waley Babu"] },
    { emoji: "🌺 🌹 🌷", answer: "Baharon Phool", options: ["Genda Phool", "Phoolon Ka Taaron Ka", "Baharon Phool", "Gulabi Aankhen"] },
    { emoji: "🌧️ 💃 ☔", answer: "Tip Tip Barsa", options: ["Cham Cham", "Tip Tip Barsa", "Baarish", "Koi Ladki Hai"] }
]

function EmojiSongGame({ onScore }) {
    const [questions] = useState(() => [...EMOJI_SONGS].sort(() => Math.random() - 0.5))
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(15) // 15 seconds per song
    const [done, setDone] = useState(false)
    const [selected, setSelected] = useState(null)
    const [wrongFlash, setWrongFlash] = useState(false)
    const timerRef = useRef(null)

    const stopTimer = () => { if(timerRef.current) clearInterval(timerRef.current) }

    const handleAnswer = async (chosenName) => {
        if (selected || timeLeft === 0) return
        stopTimer()
        
        const q = questions[current]
        const isCorrect = chosenName === q.answer
        const points = isCorrect ? 20 : -10 // +20 for correct, -10 for wrong

        if (isCorrect) sfx.correct()
        else { sfx.wrong(); vibrate(); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 400) }

        setSelected(chosenName)
        const newScore = score + points
        setScore(newScore)

        // Telegram Update
        await sendEmojiGuessToTG(q.emoji, q.answer, chosenName, isCorrect, points)

        setTimeout(() => {
            if (current + 1 >= questions.length) {
                setDone(true)
                sfx.win()
                sendFinalScore("Emoji Song Guess", newScore)
                onScore(newScore)
            } else {
                setCurrent(c => c + 1)
                setSelected(null)
                setTimeLeft(15)
                startTimer()
            }
        }, 1200)
    }

    const startTimer = useCallback(() => {
        stopTimer()
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopTimer()
                    // Time Up handling - No score but move forward or wait
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [])

    useEffect(() => {
        startTimer()
        return () => stopTimer()
    }, [startTimer])

    const q = questions[current]
    const timePercent = (timeLeft / 15) * 100

    if (done) {
        return (
            <div className="text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <p className="text-pink-400 text-3xl font-black">{score} pts</p>
                <p className="text-purple-300 text-sm mt-2">Challenge Finished! 👑</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full max-w-sm" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}} style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="w-full">
                <div className="flex justify-between text-[10px] mb-1 font-bold tracking-widest text-purple-400/60">
                    <span>SONG {current + 1}/{questions.length}</span>
                    <span className={timeLeft < 6 ? 'text-red-400' : ''}>{timeLeft}s REMAINING</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
                    <motion.div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500" animate={{ width: `${timePercent}%` }} transition={{ duration: 1, ease: "linear" }} />
                </div>
                <div className="flex justify-between mt-2">
                     <span className="text-white text-xs font-bold bg-white/10 px-3 py-1 rounded-full">{score} PTS</span>
                     {timeLeft === 0 && <span className="text-red-400 text-xs font-black animate-pulse uppercase">Time's Up!</span>}
                </div>
            </div>

            <div className="w-full rounded-3xl p-8 text-center backdrop-blur-xl relative overflow-hidden" 
                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[10px] uppercase text-pink-400 mb-4 font-black tracking-widest">Identify the melody</p>
                <p className="text-5xl drop-shadow-[0_0_20px_rgba(236,72,153,0.4)] mb-2">{q.emoji}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full">
                {q.options.map(opt => {
                    const isSel = selected === opt
                    const isCorrect = opt === q.answer
                    let bg = "rgba(255,255,255,0.05)", border = "rgba(255,255,255,0.1)", textColor = "rgba(255,255,255,0.6)"
                    
                    if (selected) {
                        if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "rgba(34,197,94,0.5)"; textColor = "#4ade80" }
                        else if (isSel) { bg = "rgba(239,68,68,0.15)"; border = "rgba(239,68,68,0.5)"; textColor = "#f87171" }
                    }

                    return (
                        <motion.button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected || timeLeft === 0}
                            className="py-3 px-4 rounded-2xl text-sm font-bold text-left flex justify-between items-center transition-all border"
                            style={{ background: bg, borderColor: border, color: textColor }}
                            whileHover={!selected && timeLeft > 0 ? { scale: 1.02, background: "rgba(255,255,255,0.08)" } : {}}>
                            {opt}
                            {selected && isCorrect && <CheckCircle size={14} />}
                            {selected && isSel && !isCorrect && <XCircle size={14} />}
                        </motion.button>
                    )
                })}
            </div>

            {timeLeft === 0 && !selected && (
                <button onClick={() => handleAnswer(null)} className="mt-2 text-purple-400 text-xs font-bold underline">Skip to Next</button>
            )}
        </motion.div>
    )
}

// ============================================
// MEMORY MATCH GAME
// ============================================
const CARD_SET = [
    { id: "heart", icon: Heart, color: "#ec4899" },
    { id: "star", icon: Star, color: "#f59e0b" },
    { id: "moon", icon: Moon, color: "#818cf8" },
    { id: "droplet", icon: Droplet, color: "#34d399" },
    { id: "zap", icon: Zap, color: "#60a5fa" },
    { id: "gem", icon: Gem, color: "#a78bfa" },
    { id: "flame", icon: Flame, color: "#f97316" },
    { id: "sun", icon: Sun, color: "#fbbf24" },
]

function MemoryGame({ onScore }) {
    const [cards, setCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [moves, setMoves] = useState(0)
    const [matched, setMatched] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [done, setDone] = useState(false)
    const [score, setScore] = useState(0)

    const initGame = () => {
        const shuffled = [...CARD_SET, ...CARD_SET]
            .sort(() => Math.random() - 0.5)
            .map((card, idx) => ({ ...card, uniqueId: idx, isFlipped: false, isMatched: false }))
        setCards(shuffled)
        setFlipped([])
        setMoves(0)
        setMatched([])
        setDisabled(false)
        setDone(false)
        setScore(0)
    }

    useEffect(() => { initGame() }, [])

    const handleCardClick = (idx) => {
        if (disabled || flipped.length === 2) return
        const card = cards[idx]
        if (card.isFlipped || card.isMatched) return

        sfx.flip()
        const newCards = [...cards]
        newCards[idx].isFlipped = true
        setCards(newCards)

        const newFlipped = [...flipped, idx]
        setFlipped(newFlipped)

        if (newFlipped.length === 2) {
            setDisabled(true)
            setMoves(prev => prev + 1)

            const [first, second] = newFlipped
            if (cards[first].id === cards[second].id) {
                sfx.match()
                newCards[first].isMatched = true
                newCards[second].isMatched = true
                setCards(newCards)
                setFlipped([])
                setDisabled(false)
                setMatched(prev => [...prev, cards[first].id])

                if (matched.length + 1 === CARD_SET.length) {
                    const finalScore = Math.max(0, 100 - (moves + 1) * 2)
                    setScore(finalScore)
                    setDone(true)
                    sfx.win()
                    sendFinalScore("Memory Match", finalScore)
                    onScore(finalScore)
                }
            } else {
                sfx.wrong()
                vibrate()
                setTimeout(() => {
                    const resetCards = [...cards]
                    resetCards[first].isFlipped = false
                    resetCards[second].isFlipped = false
                    setCards(resetCards)
                    setFlipped([])
                    setDisabled(false)
                }, 800)
            }
        }
    }

    if (done) {
        return (
            <div className="text-center">
                <p className="text-pink-400 text-3xl font-black">{score} pts</p>
                <p className="text-purple-400 text-xs mt-1">Found all pairs in {moves} moves!</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex justify-between w-full px-1 text-[10px] font-bold text-purple-400/60 tracking-widest uppercase">
                <span>MOVES: {moves}</span>
                <span>PAIRS: {matched.length}/{CARD_SET.length}</span>
                <button onClick={initGame} className="hover:text-white"><RotateCcw size={12} /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
                {cards.map((card, idx) => {
                    const IconComponent = card.icon
                    const isFlippedOrMatched = card.isFlipped || card.isMatched
                    return (
                        <motion.button
                            key={card.uniqueId}
                            onClick={() => handleCardClick(idx)}
                            className="aspect-square rounded-2xl flex items-center justify-center border"
                            style={{
                                background: isFlippedOrMatched ? `linear-gradient(135deg, ${card.color}20, ${card.color}10)` : "rgba(255,255,255,0.03)",
                                borderColor: isFlippedOrMatched ? `${card.color}40` : "rgba(255,255,255,0.1)",
                            }}
                            whileTap={{ scale: 0.94 }}
                        >
                            {isFlippedOrMatched && <IconComponent size={24} color={card.color} />}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

// ============================================
// COLOR MATCH GAME
// ============================================
const COLOR_LIST = [
    { name: "RED", color: "#ef4444" },
    { name: "BLUE", color: "#3b82f6" },
    { name: "GREEN", color: "#22c55e" },
    { name: "YELLOW", color: "#eab308" },
    { name: "PINK", color: "#ec4899" },
    { name: "PURPLE", color: "#a855f7" },
]

function generateColorQ() {
    const textWord = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
    let inkColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
    while (inkColor.name === textWord.name) {
        inkColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
    }
    const options = [inkColor, ...COLOR_LIST.filter(c => c.name !== inkColor.name).sort(() => Math.random() - 0.5).slice(0, 3)]
    return {
        text: textWord.name,
        textColor: inkColor.color,
        correctAnswer: inkColor.name,
        options: options.sort(() => Math.random() - 0.5)
    }
}

function ColorMatchGame({ onScore }) {
    const [questions] = useState(() => Array.from({ length: 8 }, generateColorQ))
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [done, setDone] = useState(false)
    const [selected, setSelected] = useState(null)
    const [wrongFlash, setWrongFlash] = useState(false)
    const timerRef = useRef(null)

    const finish = useCallback((finalScore) => {
        setDone(true)
        sfx.win()
        sendFinalScore("Color Match", finalScore)
        onScore(finalScore)
    }, [onScore])

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    finish(score)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [score, finish])

    const handleAnswer = (chosenName) => {
        if (selected || done) return
        const q = questions[current]
        const isCorrect = chosenName === q.correctAnswer
        const points = isCorrect ? 20 : -10

        if (isCorrect) sfx.correct()
        else { sfx.wrong(); vibrate(); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 400) }

        setSelected(chosenName)
        const newScore = score + points
        setScore(newScore)

        setTimeout(() => {
            if (current + 1 >= questions.length) {
                clearInterval(timerRef.current)
                finish(newScore)
            } else {
                setCurrent(c => c + 1)
                setSelected(null)
                setTimeLeft(10)
            }
        }, 500)
    }

    const q = questions[current]
    if (done) {
        return (
            <div className="text-center">
                <p className="text-pink-400 text-3xl font-black">{score} pts</p>
                <p className="text-purple-400 text-xs mt-1">Mind-blowing focus!</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full max-w-sm" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}}>
            <div className="w-full">
                <div className="flex justify-between text-[10px] font-bold text-purple-400/60 tracking-widest mb-1">
                    <span>STAGE {current + 1}/8</span>
                    <span>{timeLeft}s LEFT</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
                    <motion.div className="h-full bg-pink-500" animate={{ width: `${(timeLeft / 10) * 100}%` }} />
                </div>
            </div>

            <div className="w-full rounded-3xl p-10 text-center backdrop-blur-xl border border-white/10 bg-white/5">
                <p className="text-5xl font-black" style={{ color: q.textColor }}>{q.text}</p>
                <p className="text-white/20 text-[9px] uppercase tracking-tighter mt-4">Pick the Ink Color, not the Word</p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                {q.options.map(opt => (
                    <motion.button key={opt.name} onClick={() => handleAnswer(opt.name)} disabled={!!selected}
                        className="py-3 rounded-2xl text-xs font-black border border-white/10 bg-white/5 text-white/60"
                        whileTap={{ scale: 0.96 }}>
                        {opt.name}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================
const GAME_LIST = [
    { id: "memory", name: "Memory Match", desc: "Find the pairs", Icon: Brain, color: "#ec4899" },
    { id: "emoji", name: "Emoji Song", desc: "Guess the melody", Icon: Music2, color: "#a855f7" },
    { id: "color", name: "Focus Test", desc: "Ink color match", Icon: Palette, color: "#3b82f6" },
]

export default function FunGames({ onComplete }) {
    const [activeGame, setActiveGame] = useState(null)
    const [scores, setScores] = useState({ memory: null, emoji: null, color: null })

    useEffect(() => {
        const saved = localStorage.getItem("game_scores")
        if (saved) { try { setScores(JSON.parse(saved)) } catch { } }
    }, [])

    const saveScore = (gameId, value) => {
        const updated = { ...scores, [gameId]: value }
        setScores(updated)
        localStorage.setItem("game_scores", JSON.stringify(updated))
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0)
    const allCompleted = Object.values(scores).every(v => v !== null)

    return (
        <motion.div className="min-h-screen flex flex-col items-center pt-10 pb-12 px-4 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-500/20 -top-20 -left-20 blur-[120px]" />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/20 -bottom-20 -right-20 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm mx-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-2">
                        <GlowIcon color="#ec4899" size={56}>
                            <Trophy size={24} color="#ec4899" />
                        </GlowIcon>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic tracking-tighter">
                        GAMING ARCADE
                    </h1>
                    <div className="inline-flex items-center gap-2 mt-3 px-6 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="text-white/80 font-black text-[10px] tracking-widest uppercase">{totalScore} TOTAL POINTS</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!activeGame ? (
                        <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                            {GAME_LIST.map((game, idx) => (
                                <motion.button
                                    key={game.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setActiveGame(game.id)}
                                    className="w-full flex items-center gap-4 p-5 rounded-[24px] backdrop-blur-xl border border-white/10 bg-white/5"
                                    whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <GlowIcon color={game.color} size={44}>
                                        <game.Icon size={18} color={game.color} />
                                    </GlowIcon>
                                    <div className="flex-1 text-left">
                                        <p className="text-white font-black text-sm tracking-tight">{game.name}</p>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{game.desc}</p>
                                    </div>
                                    {scores[game.id] !== null ? (
                                        <span className="text-green-400 font-black text-lg">{scores[game.id]}</span>
                                    ) : (
                                        <ChevronRight size={16} className="text-white/20" />
                                    )}
                                </motion.button>
                            ))}

                            {allCompleted && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-8">
                                    <motion.button
                                        onClick={() => onComplete(totalScore)}
                                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-black rounded-[20px] shadow-2xl shadow-pink-500/20 tracking-tighter text-lg"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        CONTINUE ADVENTURE <ArrowRight size={20} className="inline ml-1" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="game" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center gap-4">
                            <button onClick={() => setActiveGame(null)} className="self-start text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest mb-2 flex items-center gap-1">
                                <ArrowRight size={10} className="rotate-180" /> Back to Arcade
                            </button>
                            
                            {activeGame === "memory" && <MemoryGame onScore={s => { saveScore("memory", s); setTimeout(() => setActiveGame(null), 2000) }} />}
                            {activeGame === "emoji" && <EmojiSongGame onScore={s => { saveScore("emoji", s); setTimeout(() => setActiveGame(null), 2000) }} />}
                            {activeGame === "color" && <ColorMatchGame onScore={s => { saveScore("color", s); setTimeout(() => setActiveGame(null), 2000) }} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
