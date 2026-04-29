"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, RotateCcw, Trophy, ChevronRight, Brain, Music2, Palette, 
    Sparkles, Heart, Star, Moon, Droplet, Zap, Gem, Flame, Sun, CheckCircle, XCircle, RefreshCw
} from "lucide-react"

// Telegram Config
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

async function sendEmojiGuessToTG(emoji, expected, actual, isCorrect, points) {
    const text = `🎯 *Emoji Song Update*\n\nEmojis: ${emoji}\n*Target Song:* ${expected}\n*She Picked:* ${actual || "[No Selection]"}\n\n*Result:* ${isCorrect ? "✅ Correct" : "❌ Wrong"}\n*Points:* ${points > 0 ? "+" : ""}${points}`
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" }),
        })
    } catch { }
}

async function sendFinalScore(gameName, score) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🏆 *GAME OVER: ${gameName}*\nFinal Score: ${score} points`, parse_mode: "Markdown" }),
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
// FRIENDSHIP MEMORY MATCH GAME (3x4 Grid)
// ============================================
const FRIENDSHIP_SYMBOLS = ["🤝", "💕", "🎉", "✨", "🌟", "🎈"]

function MemoryGame({ onScore }) {
    const [cards, setCards] = useState([])
    const [flippedCards, setFlippedCards] = useState([])
    const [matchedCards, setMatchedCards] = useState([])
    const [moves, setMoves] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const [gameCompleted, setGameCompleted] = useState(false)

    const initializeGame = () => {
        const cardPairs = [...FRIENDSHIP_SYMBOLS, ...FRIENDSHIP_SYMBOLS]
        const shuffledCards = cardPairs
            .sort(() => Math.random() - 0.5)
            .map((symbol, index) => ({
                id: index,
                symbol,
                isFlipped: false,
                isMatched: false,
            }))
        setCards(shuffledCards)
        setFlippedCards([])
        setMatchedCards([])
        setMoves(0)
    }

    const startGame = () => {
        setShowInstructions(false)
        setGameStarted(true)
        initializeGame()
    }

    const flipCard = (cardId) => {
        if (flippedCards.length === 2) return
        if (flippedCards.includes(cardId)) return
        if (matchedCards.includes(cardId)) return

        sfx.flip()
        const newFlippedCards = [...flippedCards, cardId]
        setFlippedCards(newFlippedCards)

        if (newFlippedCards.length === 2) {
            setMoves((prev) => prev + 1)
            const [firstCardId, secondCardId] = newFlippedCards
            const firstCard = cards.find((card) => card.id === firstCardId)
            const secondCard = cards.find((card) => card.id === secondCardId)

            if (firstCard.symbol === secondCard.symbol) {
                sfx.match()
                setTimeout(() => {
                    setMatchedCards((prev) => [...prev, firstCardId, secondCardId])
                    setFlippedCards([])
                }, 500)
            } else {
                sfx.wrong()
                vibrate()
                setTimeout(() => {
                    setFlippedCards([])
                }, 800)
            }
        }
    }

    useEffect(() => {
        if (matchedCards.length === 12 && gameStarted && !gameCompleted) {
            const finalScore = Math.max(0, 100 - moves * 2)
            setGameCompleted(true)
            sfx.win()
            
            const message = `🎮 *Friendship Memory Game Complete!*\n🏆 *Final Score:* ${finalScore} points\n🎴 *Moves:* ${moves}`
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
            }).catch(() => {})
            
            setTimeout(() => {
                onScore(finalScore)
            }, 1500)
        }
    }, [matchedCards, gameStarted, moves, gameCompleted, onScore])

    if (showInstructions) {
        return (
            <motion.div
                className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div className="text-center max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl">🧩</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">Friendship Memory Game</h2>
                    <div className="text-purple-300 text-sm space-y-2 bg-white/5 rounded-xl p-4 mb-6">
                        <p>🤝 Find all friendship pairs</p>
                        <p>💕 Test your memory skills</p>
                        <p>✨ Fewer moves = more points!</p>
                    </div>
                    <button onClick={startGame} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full">Start Challenge ✨</button>
                </motion.div>
            </motion.div>
        )
    }

    if (gameCompleted) {
        const finalScore = Math.max(0, 100 - moves * 2)
        return (
            <div className="text-center">
                <p className="text-pink-400 text-3xl font-black">{finalScore} pts</p>
                <p className="text-purple-300 text-xs mt-1">{moves} moves</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex justify-between w-full text-xs text-purple-400">
                <span>🎴 MOVES: {moves}</span>
                <span>✓ PAIRS: {matchedCards.length/2}/6</span>
                <button onClick={initializeGame}><RotateCcw size={14} /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full max-w-[340px] mx-auto">
                {cards.map((card) => {
                    const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id)
                    return (
                        <motion.button
                            key={card.id}
                            onClick={() => flipCard(card.id)}
                            className="aspect-square rounded-xl flex items-center justify-center text-2xl"
                            style={{
                                background: isFlipped ? "linear-gradient(135deg, #ec4899, #a855f7)" : "rgba(255,255,255,0.05)",
                                border: isFlipped ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                            }}
                            whileTap={{ scale: 0.94 }}
                        >
                            <motion.div animate={{ rotateY: isFlipped ? 0 : 180 }} transition={{ duration: 0.3 }}>
                                {isFlipped ? card.symbol : "❓"}
                            </motion.div>
                        </motion.button>
                    )
                })}
            </div>
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
    { emoji: "🌊 💧 ☔", answer: "Tip Tip Barsa", options: ["Cham Cham", "Tip Tip Barsa", "Baarish", "Koi Ladki Hai"] },
    { emoji: "🦋 🌸 💜", answer: "Kesariya", options: ["Kesariya", "Tum Hi Ho", "Raataan Lambiyan", "Ranjha"] }
]

function EmojiSongGame({ onScore }) {
    const [questions] = useState(() => [...EMOJI_SONGS].sort(() => Math.random() - 0.5).slice(0, 5))
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(15)
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
        const points = isCorrect ? 20 : -10
        if (isCorrect) sfx.correct()
        else { sfx.wrong(); vibrate(); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 400) }
        setSelected(chosenName)
        const newScore = score + points
        setScore(newScore)
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
                if (prev <= 1) { stopTimer(); return 0 }
                return prev - 1
            })
        }, 1000)
    }, [])

    useEffect(() => { startTimer(); return () => stopTimer() }, [startTimer])

    if (done) {
        return (
            <div className="text-center">
                <p className="text-pink-400 text-3xl font-black">{score}</p>
                <p className="text-purple-300 text-xs mt-1">✨ Challenge Complete ✨</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}}>
            <div className="w-full flex justify-between text-xs text-purple-400">
                <span>{current + 1}/{questions.length}</span>
                <span className={timeLeft < 6 ? 'text-red-400' : ''}>{timeLeft}s</span>
                <span className="text-white font-bold">{score} pts</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500" animate={{ width: `${(timeLeft / 15) * 100}%` }} />
            </div>
            <div className="w-full rounded-2xl p-6 text-center" style={{ background: "rgba(15,5,30,0.6)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <p className="text-5xl">{questions[current].emoji}</p>
                <p className="text-purple-400 text-xs mt-2">Guess the song!</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full">
                {questions[current].options.map(opt => {
                    const isSel = selected === opt
                    const isCorrect = opt === questions[current].answer
                    let bg = "rgba(255,255,255,0.04)", border = "rgba(255,255,255,0.1)", textColor = "#aaa"
                    if (selected) {
                        if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "#4ade80"; textColor = "#4ade80" }
                        else if (isSel) { bg = "rgba(239,68,68,0.15)"; border = "#f87171"; textColor = "#f87171" }
                    }
                    return (
                        <motion.button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected || timeLeft === 0}
                            className="py-2 px-3 rounded-xl text-sm font-medium text-left flex justify-between items-center"
                            style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                            <span>{opt}</span>
                            {selected && isCorrect && <CheckCircle size={14} className="text-green-400" />}
                            {selected && isSel && !isCorrect && <XCircle size={14} className="text-red-400" />}
                        </motion.button>
                    )
                })}
            </div>
            {timeLeft === 0 && !selected && <button onClick={() => handleAnswer(null)} className="text-purple-400 text-xs">Skip →</button>}
        </motion.div>
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
    while (inkColor.name === textWord.name) inkColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
    const options = [inkColor, ...COLOR_LIST.filter(c => c.name !== inkColor.name).sort(() => Math.random() - 0.5).slice(0, 3)]
    return { text: textWord.name, textColor: inkColor.color, correctAnswer: inkColor.name, options: options.sort(() => Math.random() - 0.5) }
}

function ColorMatchGame({ onScore }) {
    const [questions] = useState(() => Array.from({ length: 6 }, generateColorQ))
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [done, setDone] = useState(false)
    const [selected, setSelected] = useState(null)
    const [wrongFlash, setWrongFlash] = useState(false)
    const timerRef = useRef(null)

    const finish = useCallback((finalScore) => { setDone(true); sfx.win(); sendFinalScore("Color Match", finalScore); onScore(finalScore) }, [onScore])

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); finish(score); return 0 }
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
            if (current + 1 >= questions.length) { clearInterval(timerRef.current); finish(newScore) }
            else { setCurrent(c => c + 1); setSelected(null); setTimeLeft(10) }
        }, 500)
    }

    if (done) {
        return (
            <div className="text-center">
                <p className="text-pink-400 text-3xl font-black">{score} pts</p>
                <p className="text-purple-300 text-xs mt-1">Focus Master!</p>
            </div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center gap-4 w-full" animate={wrongFlash ? { x: [-5, 5, -3, 3, 0] } : {}}>
            <div className="w-full flex justify-between text-xs text-purple-400">
                <span>{current + 1}/6</span>
                <span className={timeLeft < 4 ? 'text-red-400' : ''}>{timeLeft}s</span>
                <span className="text-white font-bold">{score} pts</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500" animate={{ width: `${(timeLeft / 10) * 100}%` }} />
            </div>
            <div className="w-full rounded-2xl p-8 text-center" style={{ background: "rgba(15,5,30,0.6)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <p className="text-5xl font-black" style={{ color: questions[current].textColor }}>{questions[current].text}</p>
                <p className="text-purple-500 text-[10px] mt-2">What's the INK color?</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
                {questions[current].options.map(opt => (
                    <motion.button key={opt.name} onClick={() => handleAnswer(opt.name)} disabled={!!selected}
                        className="py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/5 text-white/70" whileTap={{ scale: 0.96 }}>
                        {opt.name}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

// ============================================
// RESET BUTTON
// ============================================
function ResetButton({ onReset }) {
    const [showConfirm, setShowConfirm] = useState(false)
    if (showConfirm) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
                <div className="bg-black/80 rounded-2xl p-6 text-center border border-pink-500/50 max-w-xs mx-4">
                    <p className="text-white font-bold mb-4">Reset all game progress?</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-xl border border-white/20 text-white/60 text-sm">Cancel</button>
                        <button onClick={() => { onReset(); setShowConfirm(false); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm">Reset</button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <motion.button onClick={() => setShowConfirm(true)} className="fixed bottom-20 right-4 z-20 bg-white/5 backdrop-blur-sm p-3 rounded-full hover:bg-white/10 transition-all border border-white/10" whileTap={{ scale: 0.9 }}>
            <RefreshCw size={18} className="text-white/50" />
        </motion.button>
    )
}

// ============================================
// MAIN COMPONENT - 3 GAMES IN 3x3 GRID
// ============================================
const GAME_LIST = [
    { id: "memory", name: "Memory Match", desc: "Find the pairs", Icon: Brain, color: "#ec4899" },
    { id: "emoji", name: "Emoji Song", desc: "Guess the melody", Icon: Music2, color: "#a855f7" },
    { id: "color", name: "Focus Test", desc: "Match the ink", Icon: Palette, color: "#3b82f6" },
]

export default function FunGames({ onComplete }) {
    const [activeGame, setActiveGame] = useState(null)
    const [scores, setScores] = useState({ memory: null, emoji: null, color: null })

    useEffect(() => {
        const saved = localStorage.getItem("game_scores_v2")
        if (saved) { try { setScores(JSON.parse(saved)) } catch { } }
    }, [])

    const saveScore = (gameId, value) => {
        const updated = { ...scores, [gameId]: value }
        setScores(updated)
        localStorage.setItem("game_scores_v2", JSON.stringify(updated))
    }

    const resetAllScores = () => {
        localStorage.removeItem("game_scores_v2")
        setScores({ memory: null, emoji: null, color: null })
        setActiveGame(null)
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0)
    const allCompleted = Object.values(scores).every(v => v !== null)

    return (
        <>
            <ResetButton onReset={resetAllScores} />
            
            <motion.div 
                className="min-h-screen flex flex-col items-center pt-10 pb-12 px-4 relative overflow-hidden"
                style={{ background: "#000000" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-500/5 -top-40 -left-40 blur-[120px]" />
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 -bottom-40 -right-40 blur-[120px]" />
                </div>

                <div className="relative z-10 w-full max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-2">
                            <GlowIcon color="#ec4899" size={50}>
                                <Trophy size={20} color="#ec4899" />
                            </GlowIcon>
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            GAMING ZONE
                        </h1>
                        <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <Sparkles size={12} className="text-pink-400" />
                            <span className="text-white font-bold text-sm">{totalScore} POINTS</span>
                            <Sparkles size={12} className="text-pink-400" />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!activeGame ? (
                            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {GAME_LIST.map((game, idx) => (
                                        <motion.button
                                            key={game.id}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.08 }}
                                            onClick={() => setActiveGame(game.id)}
                                            className="group relative p-6 rounded-2xl text-center transition-all"
                                            style={{
                                                background: "rgba(10,10,10,0.8)",
                                                border: scores[game.id] !== null ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
                                            }}
                                            whileHover={{ scale: 1.02, borderColor: game.color, boxShadow: `0 0 20px ${game.color}20` }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                                                    style={{ background: `${game.color}15`, border: `1px solid ${game.color}30` }}>
                                                    <game.Icon size={22} color={game.color} />
                                                </div>
                                                <p className="text-white font-bold text-base mt-2">{game.name}</p>
                                                <p className="text-white/30 text-[10px] uppercase tracking-wide">{game.desc}</p>
                                                {scores[game.id] !== null && (
                                                    <span className="text-green-400 font-bold text-sm mt-1">{scores[game.id]}</span>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {allCompleted && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-8">
                                        <motion.button
                                            onClick={() => onComplete(totalScore)}
                                            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 mx-auto"
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            CONTINUE <ArrowRight size={16} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="game" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center gap-3">
                                <button onClick={() => setActiveGame(null)} className="self-start text-xs text-purple-400 hover:text-white mb-2">← BACK</button>
                                {activeGame === "memory" && <MemoryGame onScore={s => { saveScore("memory", s); setTimeout(() => setActiveGame(null), 1800) }} />}
                                {activeGame === "emoji" && <EmojiSongGame onScore={s => { saveScore("emoji", s); setTimeout(() => setActiveGame(null), 2000) }} />}
                                {activeGame === "color" && <ColorMatchGame onScore={s => { saveScore("color", s); setTimeout(() => setActiveGame(null), 1800) }} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    )
}