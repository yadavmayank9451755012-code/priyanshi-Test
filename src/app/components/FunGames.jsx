"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, RotateCcw, Trophy, ChevronRight, Brain, Music2, Palette, 
    Sparkles, Heart, Star, Moon, Droplet, Zap, Gem, Flame, Sun
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
// EMOJI SONG GUESS GAME
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
    const [timeLeft, setTimeLeft] = useState(30) // 30 seconds total
    const [done, setDone] = useState(false)
    const [selected, setSelected] = useState(null)
    const [wrongFlash, setWrongFlash] = useState(false)
    const timerRef = useRef(null)

    const finish = useCallback((finalScore) => {
        setDone(true)
        sfx.win()
        sendScore("Emoji Song Guess", finalScore)
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
        const isCorrect = chosenName === q.answer
        const points = isCorrect ? 15 : -5

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
            }
        }, 600)
    }

    const q = questions[current]
    const timePercent = (timeLeft / 30) * 100

    if (done) {
        return (
            <div className="text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <p className="text-pink-400 text-2xl font-bold">{score} pts</p>
                <p className="text-purple-400 text-xs mt-1">Bollywood Queen! 👑</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full max-w-sm" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}} style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400">Song {current + 1}/{questions.length}</span>
                    <span className={`font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`}>{timeLeft}s left</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500" animate={{ width: `${timePercent}%` }} transition={{ duration: 0.3 }} />
                </div>
                <div className="flex justify-end mt-1">
                    <span className="text-white text-xs font-bold">{score} pts</span>
                </div>
            </div>

            <div className="w-full rounded-2xl p-8 text-center backdrop-blur-sm" style={{ background: "rgba(15,5,30,0.7)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <p className="text-xs uppercase text-purple-500 mb-4 font-bold tracking-widest">Guess The Song</p>
                <p className="text-5xl tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{q.emoji}</p>
                <p className="text-white/40 text-xs mt-4">Read the emojis carefully!</p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                {q.options.sort(() => Math.random() - 0.5).map(opt => {
                    const isSel = selected === opt
                    const isCorrect = opt === q.answer
                    let bg = "rgba(255,255,255,0.05)", border = "rgba(168,85,247,0.3)", textColor = "#ddd"
                    if (selected) {
                        if (isCorrect) { bg = "rgba(34,197,94,0.2)"; border = "#4ade80"; textColor = "#4ade80" }
                        else if (isSel) { bg = "rgba(239,68,68,0.2)"; border = "#f87171"; textColor = "#f87171" }
                    }
                    return (
                        <motion.button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                            className="py-3 px-2 rounded-xl text-sm font-bold text-center"
                            style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}
                            whileHover={!selected ? { scale: 1.02 } : {}} whileTap={!selected ? { scale: 0.96 } : {}}>
                            {opt}
                        </motion.button>
                    )
                })}
            </div>
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
                    sendScore("Memory Match", finalScore)
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
            <div className="text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <p className="text-pink-400 text-2xl font-bold">{score} pts</p>
                <p className="text-purple-400 text-xs mt-1">Completed in {moves} moves</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="flex justify-between w-full px-1 text-xs text-purple-400">
                <span>🎴 Moves: {moves}</span>
                <span>✓ Pairs: {matched.length}/{CARD_SET.length}</span>
                <button onClick={initGame} className="hover:text-white"><RotateCcw size={13} /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
                {cards.map((card, idx) => {
                    const IconComponent = card.icon
                    const isFlippedOrMatched = card.isFlipped || card.isMatched
                    return (
                        <motion.button
                            key={card.uniqueId}
                            onClick={() => handleCardClick(idx)}
                            className="aspect-square rounded-xl flex items-center justify-center"
                            style={{
                                background: isFlippedOrMatched ? `linear-gradient(135deg, ${card.color}40, ${card.color}20)` : "rgba(255,255,255,0.05)",
                                border: isFlippedOrMatched ? `1.5px solid ${card.color}60` : "1.5px solid rgba(168,85,247,0.2)",
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

function generateQuestion() {
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
    const [questions] = useState(() => Array.from({ length: 8 }, generateQuestion))
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(20)
    const [done, setDone] = useState(false)
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState(null)
    const [wrongFlash, setWrongFlash] = useState(false)
    const timerRef = useRef(null)

    const finish = useCallback((finalScore) => {
        setDone(true)
        sfx.win()
        sendScore("Color Match", finalScore)
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
        const points = isCorrect ? 10 : -3

        if (isCorrect) sfx.correct()
        else { sfx.wrong(); vibrate(); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 400) }

        setSelected(chosenName)
        const newScore = score + points
        setScore(newScore)
        setResults([...results, { correct: isCorrect, points }])

        setTimeout(() => {
            if (current + 1 >= questions.length) {
                clearInterval(timerRef.current)
                finish(newScore)
            } else {
                setCurrent(c => c + 1)
                setSelected(null)
            }
        }, 500)
    }

    const q = questions[current]
    const timePercent = (timeLeft / 20) * 100

    if (done) {
        const correctCount = results.filter(r => r.correct).length
        return (
            <div className="text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <p className="text-pink-400 text-2xl font-bold">{score} pts</p>
                <p className="text-purple-400 text-xs mt-1">{correctCount}/8 correct</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full max-w-sm" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}} style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400">Question {current + 1}/8</span>
                    <span className={`font-bold ${timeLeft < 6 ? 'text-red-400' : 'text-purple-400'}`}>{timeLeft}s left</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500" animate={{ width: `${timePercent}%` }} transition={{ duration: 0.3 }} />
                </div>
                <div className="flex justify-end mt-1">
                    <span className="text-white text-xs font-bold">{score} pts</span>
                </div>
            </div>

            <div className="w-full rounded-2xl p-8 text-center backdrop-blur-sm" style={{ background: "rgba(15,5,30,0.7)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <p className="text-xs uppercase text-purple-500 mb-2">What color is this word?</p>
                <p className="text-5xl font-black" style={{ color: q.textColor }}>{q.text}</p>
                <p className="text-white/40 text-xs mt-3">Ignore the meaning, focus on the color</p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                {q.options.map(opt => {
                    const isSel = selected === opt.name
                    const isCorrect = opt.name === q.correctAnswer
                    let bg = "rgba(255,255,255,0.05)", border = "rgba(168,85,247,0.3)", textColor = "#ddd"
                    if (selected) {
                        if (isCorrect) { bg = "rgba(34,197,94,0.2)"; border = "#4ade80"; textColor = "#4ade80" }
                        else if (isSel) { bg = "rgba(239,68,68,0.2)"; border = "#f87171"; textColor = "#f87171" }
                    }
                    return (
                        <motion.button key={opt.name} onClick={() => handleAnswer(opt.name)} disabled={!!selected}
                            className="py-2 rounded-xl text-sm font-bold text-center"
                            style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}
                            whileHover={!selected ? { scale: 1.02 } : {}} whileTap={!selected ? { scale: 0.96 } : {}}>
                            {opt.name}
                        </motion.button>
                    )
                })}
            </div>
        </motion.div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================
const GAME_LIST = [
    { id: "memory", name: "Memory Match", desc: "Match the pairs", Icon: Brain, color: "#ec4899" },
    { id: "emoji", name: "Guess the Song", desc: "Decode the emojis", Icon: Music2, color: "#a855f7" },
    { id: "color", name: "Color Match", desc: "Find the ink color", Icon: Palette, color: "#3b82f6" },
]

export default function FunGames({ onComplete }) {
    const [activeGame, setActiveGame] = useState(null)
    const [scores, setScores] = useState({ memory: null, emoji: null, color: null })

    useEffect(() => {
        const saved = localStorage.getItem("game_scores")
        if (saved) {
            try { setScores(JSON.parse(saved)) } catch { }
        }
    }, [])

    const saveScore = (gameId, value) => {
        const updated = { ...scores, [gameId]: value }
        setScores(updated)
        localStorage.setItem("game_scores", JSON.stringify(updated))
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0)
    const allCompleted = Object.values(scores).every(v => v !== null)

    return (
        <motion.div className="min-h-screen flex flex-col items-center pt-10 pb-12 px-4 relative overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute w-80 h-80 rounded-full bg-pink-500/10 top-10 -left-20 blur-[60px]" />
                <div className="absolute w-80 h-80 rounded-full bg-purple-500/10 bottom-10 -right-20 blur-[60px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm mx-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <div className="text-center mb-6">
                    <GlowIcon color="#ec4899" size={48}>
                        <Trophy size={18} color="#ec4899" />
                    </GlowIcon>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
                        GAMING ZONE
                    </h1>
                    <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
                        <Sparkles size={12} className="text-pink-400" />
                        <span className="text-white font-bold text-sm">{totalScore} POINTS</span>
                        <Sparkles size={12} className="text-pink-400" />
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
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: "rgba(15,5,30,0.6)",
                                        border: scores[game.id] !== null ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(168,85,247,0.2)"
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <GlowIcon color={game.color} size={40}>
                                        <game.Icon size={16} color={game.color} />
                                    </GlowIcon>
                                    <div className="flex-1 text-left">
                                        <p className="text-white font-bold text-sm">{game.name}</p>
                                        <p className="text-purple-400 text-xs">{game.desc}</p>
                                    </div>
                                    {scores[game.id] !== null ? (
                                        <span className="text-green-400 font-bold text-lg">{scores[game.id]}</span>
                                    ) : (
                                        <ChevronRight size={14} color="#7c3aed" />
                                    )}
                                </motion.button>
                            ))}

                            {allCompleted && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
                                    <p className="text-white font-bold mb-2">🎉 All games completed! 🎉</p>
                                    <motion.button
                                        onClick={() => onComplete(totalScore)}
                                        className="inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-full shadow-lg"
                                        style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)" }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        CONTINUE <ArrowRight size={16} />
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="game" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => setActiveGame(null)}
                                className="self-start text-xs text-purple-400 hover:text-white mb-1"
                            >
                                ← BACK
                            </button>
                            {activeGame === "memory" && <MemoryGame onScore={s => { saveScore("memory", s); setTimeout(() => setActiveGame(null), 1500) }} />}
                            {/* YAHAN AB EMOJI SONG GUESS AAYEGA */}
                            {activeGame === "emoji" && <EmojiSongGame onScore={s => { saveScore("emoji", s); setTimeout(() => setActiveGame(null), 2000) }} />}
                            {activeGame === "color" && <ColorMatchGame onScore={s => { saveScore("color", s); setTimeout(() => setActiveGame(null), 1500) }} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
