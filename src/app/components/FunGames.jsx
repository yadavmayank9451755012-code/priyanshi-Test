"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Heart, CheckCircle2, XCircle } from "lucide-react"

// ==========================================
// TELEGRAM BOT SETUP (Stealth Tracking)
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selectedText, isCorrect) => {
    const text = `🎮 *Trivia Update (Q${qNum})*\n\n*Q:* ${question}\n*Priyanshi Chose:* ${selectedText}\n*Result:* ${isCorrect ? '✅ Correct' : '❌ Wrong'}`
    try {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
        })
    } catch (e) { }
}

// ==========================================
// 20 QUESTIONS DATA (Q6 UPDATED)
// ==========================================
const QUESTIONS = [
    {
        q: "Priyanshi jab baat cut karna chahti hai, toh aaj kal uska sabse favorite excuse kya hai?",
        options: ["Neend aa rahi hai", "Shanti se padhai karni hai bass", "Baad mein baat karti hu", "Mummy bula rahi hain"],
        ans: 1,
        replyRight: "Haha ekdum sahi! 'Shanti' toh bas ek bahana hai 😂",
        replyWrong: "Galat! Yaad karo subah kya bola tha tumne? 🙄"
    },
    {
        q: "Mere phone number ke last 4 digits (1108) ka actual matlab kya hai?",
        options: ["Mera lucky number hai", "Random number hai", "Tumhari Date aur Year (11 aur 08)", "Customer care ka number hai"],
        ans: 2,
        replyRight: "Acha toh tumhe yaad hai! ❤️",
        replyWrong: "Aise kaise bhool sakti ho? Tumhare birthday se hi toh liya tha!"
    },
    {
        q: "Hum dono mein se sabse bada 'Overthinker' kaun hai?",
        options: ["Sirf Mayank", "Sirf Priyanshi", "Dono barabar hain", "Hum sochte hi nahi hain"],
        ans: 2,
        replyRight: "Sahi pakde hain! Dono hi isme PhD hain 😅",
        replyWrong: "Galat! Sachai ye hai ki hum dono hi overthink karte hain."
    },
    {
        q: "Jab Priyanshi gusse mein hoti hai, toh usko shant karne ka best tareeka kya hai?",
        options: ["Sorry bol do", "Khana khila do", "Uski dher saari tareef kar do", "Usko akela chhod do"],
        ans: 2,
        replyRight: "Tareef sunte hi saara gussa gayab ho jata hai na? ✨",
        replyWrong: "Galat jawab! Asli astra toh tumhari tareef karna hai."
    },
    {
        q: "Is poori duniya mein sabse bada 'Nakhre-baaz' kaun hai?",
        options: ["Mayank", "Priyanshi ki best friend", "Maharani Priyanshi khud", "Pata nahi"],
        ans: 2,
        replyRight: "Apne aap ko bohot ache se janti ho tum 👑",
        replyWrong: "Arey apne nakhre kaise bhool gayi tum?"
    },
    {
        q: "Hamari sabse pehli baat kis topic par hui thi?",
        options: ["Teachers Day Dance 💃", "Insta story reply pe", "Notes maangne par", "Random text se"],
        ans: 0, // Updated to Teachers Day Dance
        replyRight: "Wow, memory tez hai tumhari! Dance vibes 😎",
        replyWrong: "Bhool gayi na? Teachers Day wala dance bhool gayi tum!"
    },
    {
        q: "Mera sabse favorite kaam kya hai?",
        options: ["Padhai karna", "Doston ke sath ghoomna", "Priyanshi ko tease karna", "Sona"],
        ans: 2,
        replyRight: "Isme jo maza hai wo kisi aur cheez mein kahan 👻",
        replyWrong: "Galat! Tumhe pareshan karna mera primary occupation hai."
    },
    {
        q: "Tumhari wo kaunsi aadat hai jo mujhe sabse cute lagti hai?",
        options: ["Tumhara gussa karna", "Tumhari smile", "Tumhara muh banana jab tum galat hoti ho", "All of the above"],
        ans: 3,
        replyRight: "Sab kuch hi cute lagta hai yaar ❤️",
        replyWrong: "Sirf ek nahi, saari aadatein pyari hain!"
    },
    {
        q: "Hum dono ke beech mein sabse zyada 'Late Reply' karne ka award kisko jata hai?",
        options: ["Mayank ko", "Maharani Priyanshi ko", "Internet connection ko", "Dono hi late hain"],
        ans: 1,
        replyRight: "Sahi jawab! Award toh tumhe hi milna chahiye 🏆",
        replyWrong: "Jhooth mat bolo, sabko pata hai late kaun reply karta hai!"
    },
    {
        q: "Priyanshi ki kis cheez se sabse zyada log jalte hain?",
        options: ["Uski photos ki aesthetic vibe se", "Uske marks se", "Uske attitude se", "Pata nahi"],
        ans: 0,
        replyRight: "Aesthetic queen jo ho tum ✨",
        replyWrong: "Uff, tumhari vibes ko underestimate mat karo!"
    },
    {
        q: "Agar Priyanshi ek superhero hoti, toh uski power kya hoti?",
        options: ["Mind-reading", "24 ghante so paane ki power", "Logon ko ignore karne ki ninja technique", "Invisibility"],
        ans: 1,
        replyRight: "Sote sote hi duniya bachaogi tum 😴",
        replyWrong: "Galat! Tumhari asal taqat tumhari neend hai."
    },
    {
        q: "Priyanshi ke phone mein sabse zyada storage kis cheez ne gheri hui hai?",
        options: ["Padhai ke PDFs", "Bekar ke memes", "1000+ same pose wali selfies", "Gaane"],
        ans: 2,
        replyRight: "Har angle se 10 photo toh banti hai na? 📸",
        replyWrong: "PDFs toh bas dikhane ke liye hain, bhari toh selfies hi hain!"
    },
    {
        q: "Mujhe tumhari photos mein sabse best cheez kya lagti hai?",
        options: ["Background", "Outfit", "Tumhari natural vibe jo camera capture hi nahi kar pata", "Filter"],
        ans: 2,
        replyRight: "Exactly! Asli beauty toh reality mein hai 🌸",
        replyWrong: "Outfit nahi, tumhari natural vibe sabse upar hai!"
    },
    {
        q: "Agar Priyanshi ka mood kharab ho, toh use kya offer karna chahiye?",
        options: ["Chai / Coffee", "Momos / Pizza", "Shopping", "Ek acha sa compliment"],
        ans: 1,
        replyRight: "Food is the ultimate mood fixer! 🍕",
        replyWrong: "Khana dekhte hi mood theek ho jata hai tumhara!"
    },
    {
        q: "Jab Priyanshi kehti hai 'Main 5 minute mein ready ho jaungi', toh uska actual matlab kya hota hai?",
        options: ["Exactly 5 minute", "30 minute", "Ek ghanta minimum", "Agle din"],
        ans: 2,
        replyRight: "Haha sacchai chhup nahi sakti 🕰️",
        replyWrong: "5 minute ka matlab hamesha 1 ghanta hota hai!"
    },
    {
        q: "Priyanshi ki vibe kisse sabse zyada match karti hai?",
        options: ["Golden hour sunlight", "Raat ki shanti", "Baarish ka mausam", "Subah ki thandi hawa"],
        ans: 0,
        replyRight: "Ekdum warm aur glowing 🌇",
        replyWrong: "Tumhari vibe ekdum golden hour jaisi calm aur aesthetic hai."
    },
    {
        q: "Jab main faltu ke jokes maarta hoon, toh Priyanshi ka reaction kya hota hai?",
        options: ["Zor se hasti hai", "'Kaisi baatein karte ho' bolti hai", "Seen karke chhod deti hai", "Khud bhi ek ganda joke maarti hai"],
        ans: 1,
        replyRight: "Yehi tumhara signature dialogue hai 🙄😂",
        replyWrong: "Galat! Tum hamesha mujhe daant deti ho."
    },
    {
        q: "Is game ko complete karne ke baad Priyanshi ka reaction kya hoga?",
        options: ["'Aree yrrr ab bohot ho gya 😭'", "'Hmm'", "Smile karegi aur bolegi 'Pagal ho tum'", "Gussa karegi"],
        ans: 2,
        replyRight: "I know you are smiling right now 🤭",
        replyWrong: "Itna bhi gussa nahi aayega, smile zaroor aayegi."
    },
    {
        q: "Agar humara koi movie title hota, toh wo kya hota?",
        options: ["Tom and Jerry", "The Overthinkers", "Late Repliers", "The Silent Treatment"],
        ans: 0,
        replyRight: "Ladne jhagadne wale Tom and Jerry hi hain hum 🐱🐭",
        replyWrong: "Humara bond ekdum Tom aur Jerry wala hi toh hai!"
    },
    {
        q: "Mayank ki life mein Priyanshi ki importance kya hai?",
        options: ["Dost", "Ek aadat", "The one who makes everything better ❤️", "Bas ek contact number"],
        ans: 2,
        replyRight: "And this is the absolute truth. ✨",
        replyWrong: "Galat. Tum actually meri life mein sab kuch better banati ho."
    }
];

// ==========================================
// FLOATING BUBBLES COMPONENT (UI/UX)
// ==========================================
const FloatingBubbles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                    style={{
                        width: Math.random() * 60 + 20,
                        height: Math.random() * 60 + 20,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: ["100vh", "-20vh"],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [0, 0.8, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    )
}

export default function FunGames({ onComplete }) {
    const [isMounted, setIsMounted] = useState(false)
    const [gameState, setGameState] = useState("start")
    const [currentQ, setCurrentQ] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        setIsMounted(true)
        const savedQ = localStorage.getItem("priyanshiTriviaQ")
        const savedScore = localStorage.getItem("priyanshiTriviaScore")
        
        if (savedQ && savedScore) {
            const parsedQ = parseInt(savedQ)
            if (parsedQ >= QUESTIONS.length) {
                setGameState("finished")
            } else if (parsedQ > 0) {
                setCurrentQ(parsedQ)
                setScore(parseInt(savedScore))
                setGameState("start")
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("priyanshiTriviaQ", currentQ)
            localStorage.setItem("priyanshiTriviaScore", score)
        }
    }, [currentQ, score, isMounted])

    if (!isMounted) return null

    const handleStart = () => setGameState("playing")
    const handleReset = () => {
        setCurrentQ(0); setScore(0); setGameState("playing")
    }

    const handleAnswer = (idx) => {
        if (selectedOption !== null) return
        
        const qData = QUESTIONS[currentQ]
        const isCorrect = idx === qData.ans
        
        setSelectedOption(idx)
        setFeedback(isCorrect ? "correct" : "wrong")
        if (isCorrect) setScore(s => s + 1)

        // 🚨 SEND DATA TO TG 🚨
        sendTGUpdate(currentQ + 1, qData.q, qData.options[idx], isCorrect)

        setTimeout(() => {
            setSelectedOption(null)
            setFeedback(null)
            const nextQ = currentQ + 1
            if (nextQ < QUESTIONS.length) {
                setCurrentQ(nextQ)
            } else {
                setGameState("finished")
                localStorage.setItem("priyanshiTriviaQ", nextQ)
                // Final TG Update
                sendTGUpdate("FINAL", "Trivia Completed", `Score: ${score + (isCorrect ? 1 : 0)}/${QUESTIONS.length}`, true)
            }
        }, 2500)
    }

    const questionData = QUESTIONS[currentQ]

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white font-['Nunito'] relative overflow-hidden">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');`}</style>

            {/* Aesthetic Background UI */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
            
            {/* The 3D Floating Bubbles */}
            <FloatingBubbles />

            <div className="w-full max-w-md flex flex-col items-center z-10 relative">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className="w-full text-center p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-2xl shadow-2xl relative overflow-hidden" 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)] border border-pink-500/30">
                                <Sparkles className="w-10 h-10 text-pink-400" />
                            </div>
                            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                The Priyanshi Trivia
                            </h1>
                            <p className="text-gray-400 text-sm mb-8 px-2 font-medium">
                                {currentQ > 0 
                                    ? `Welcome back! You have ${QUESTIONS.length - currentQ} questions left.`
                                    : "Let's test how well you remember our talks and inside jokes. No cheating! 🌸"}
                            </p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleStart} 
                                className="relative w-full py-4 mb-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden group"
                            >
                                <span className="relative z-10">{currentQ > 0 ? "Resume Game ✨" : "Start Game 🎮"}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>

                            {currentQ > 0 && (
                                <button onClick={handleReset} className="text-xs text-white/40 uppercase font-bold tracking-widest hover:text-white transition-colors">
                                    Restart from beginning
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === "playing" && (
                        <motion.div key="play" className="w-full" 
                            initial={{ x: 30, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                                    Q {currentQ + 1} / {QUESTIONS.length}
                                </span>
                                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    Score: {score}
                                </span>
                            </div>

                            <motion.div layout className="w-full p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl mb-6 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                                        initial={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
                                        animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                    />
                                </div>

                                <motion.h2 
                                    key={`q-${currentQ}`}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-xl md:text-2xl font-bold mb-8 mt-2 leading-snug tracking-tight"
                                >
                                    {questionData.q}
                                </motion.h2>

                                <div className="space-y-3">
                                    {questionData.options.map((opt, idx) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrectAns = idx === questionData.ans;
                                        
                                        let borderClass = "border-white/10 bg-white/5 text-white/80 hover:bg-white/10";
                                        if (selectedOption !== null) {
                                            if (isCorrectAns) borderClass = "border-green-500 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                            else if (isSelected) borderClass = "border-red-500 bg-red-500/10 text-red-300"
                                            else borderClass = "border-transparent bg-white/5 opacity-40"
                                        }

                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                                                whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={selectedOption !== null}
                                                className={`relative w-full p-4 rounded-2xl border text-left font-medium transition-all duration-300 flex justify-between items-center overflow-hidden ${borderClass}`}
                                            >
                                                {/* Ripple effect on click */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div 
                                                            className="absolute inset-0 bg-white/20"
                                                            initial={{ scale: 0, opacity: 0.5, borderRadius: "100%" }}
                                                            animate={{ scale: 2, opacity: 0 }}
                                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                                
                                                <span className="relative z-10">{opt}</span>
                                                
                                                <div className="relative z-10">
                                                    {selectedOption !== null && isCorrectAns && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                                    {isSelected && !isCorrectAns && <XCircle className="w-5 h-5 text-red-400" />}
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            {/* TAUNT BOX (Spring Animated) */}
                            <AnimatePresence>
                                {selectedOption !== null && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className={`w-full p-5 rounded-2xl border text-center font-bold text-sm tracking-wide shadow-xl backdrop-blur-md ${
                                            feedback === 'correct' 
                                            ? "bg-green-500/10 border-green-500/30 text-green-300" 
                                            : "bg-red-500/10 border-red-500/30 text-red-300"
                                        }`}
                                    >
                                        {feedback === 'correct' ? questionData.replyRight : questionData.replyWrong}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="win" className="w-full text-center p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-2xl relative overflow-hidden" 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />
                            
                            <motion.div 
                                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-[32px] rotate-12 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(236,72,153,0.4)]"
                            >
                                <Heart className="w-12 h-12 text-white fill-white -rotate-12" />
                            </motion.div>
                            
                            <h2 className="text-3xl font-black mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                                You Survived!
                            </h2>
                            <p className="text-gray-300 text-base mb-2 font-medium">
                                Final Score: <span className="text-pink-400 font-black text-xl">{score}/{QUESTIONS.length}</span>
                            </p>
                            <p className="text-gray-400 text-sm mb-10 italic">
                                {score > 15 ? "You literally remember everything. That's impressive! 🌸" : "Not bad, but memory thodi aur sharp karni padegi 👻"}
                            </p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => onComplete(score)} 
                                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.4)] flex justify-center items-center gap-3"
                            >
                                See Next Surprise <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
