"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, MessageCircle, Send, RotateCcw, Heart } from "lucide-react"

// ==========================================
// TELEGRAM BOT SETUP
// ==========================================
const BOT_TOKEN = "8673978157:AAFWiYR__xUFb79u9Tfrz-8guCB10sgruX0"
const CHAT_ID = "8745839603"

const sendTGUpdate = async (qNum, question, selected, reason) => {
    const text = `💌 *Priyanshi's Choice (Q${qNum})*\n\n*Q:* ${question}\n*Choice:* ${selected}\n*Her Reason:* ${reason || "No reason given"}`
    try {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
        })
    } catch (e) { }
}

// ==========================================
// 20 QUESTIONS DATA (Conversation Mode)
// ==========================================
const QUESTIONS = [
    {
        q: "Priyanshi jab baat cut karna chahti hai, toh aaj kal uska sabse favorite excuse kya hai?",
        options: ["Neend aa rahi hai", "Shanti se padhai karni hai bass", "Baad mein baat karti hu"],
        myThought: "Mujhe pata tha! Ye 'Shanti' wali padhai kabhi khatam nahi hoti 😂"
    },
    {
        q: "Mere phone number ke last 4 digits (1108) ka actual matlab kya hai?",
        options: ["Mera lucky number", "Random digits", "11 June aur 2008 ❤️"],
        myThought: "Acha laga dekh kar ki tumhe abhi bhi ye yaad hai. 1108 is special. ✨"
    },
    {
        q: "Hum dono mein se sabse bada 'Overthinker' kaun hai?",
        options: ["Sirf Mayank", "Sirf Priyanshi", "Dono barabar hain"],
        myThought: "Dono hi PhD level overthinkers hain, isliye toh vibe match hoti hai 😅"
    },
    {
        q: "Jab Priyanshi gusse mein hoti hai, toh usko shant karne ka best tareeka kya hai?",
        options: ["Sorry bol do", "Khana khila do", "Uski dher saari tareef kar do"],
        myThought: "Tareef sunte hi tum pighal jati ho, ye mera sabse bada secret astra hai 🪄"
    },
    {
        q: "Is poori duniya mein sabse bada 'Nakhre-baaz' kaun hai?",
        options: ["Mayank", "Priyanshi ki best friend", "Maharani Priyanshi खुद"],
        myThought: "Maharani ji, aapke nakhre toh world famous hain aur cute bhi! 👑"
    },
    {
        q: "Hamari sabse pehli baat kis topic par hui thi?",
        options: ["Teachers Day Dance 💃", "Insta story reply pe", "Notes maangne par"],
        myThought: "Wo Teachers Day wala dance... wahi se toh sab shuru hua tha! ✨"
    },
    {
        q: "Mera sabse favorite kaam kya hai?",
        options: ["Padhai karna", "Doston ke sath ghoomna", "Priyanshi ko tease karna"],
        myThought: "Tumhe pareshan karne mein jo sukoon hai, wo kisi aur cheez mein nahi 👻"
    },
    {
        q: "Tumhari wo kaunsi aadat hai jo mujhe sabse cute lagti hai?",
        options: ["Tumhara gussa", "Tumhari smile", "Jab tum galat hoti ho toh muh banana"],
        myThought: "Jab tum galti karke cute sa face banati ho na, wahi mera favorite moment hai ❤️"
    },
    {
        q: "Zyada 'Late Reply' karne ka award kisko jana chahiye?",
        options: ["Mayank ko", "Maharani Priyanshi ko", "Internet connection ko"],
        myThought: "Tumhe award dene ke liye toh stage bhi taiyaar hai! 🏆"
    },
    {
        q: "Priyanshi ki kis cheez se sabse zyada log jalte hain?",
        options: ["Photos ki aesthetic vibe", "Uske marks", "Uska attitude"],
        myThought: "Tumhari aesthetic sense ka toh main bhi fan hoon, log kyun na jaley? ✨"
    },
    {
        q: "Agar Priyanshi ek superhero hoti, toh uski power kya hoti?",
        options: ["Mind-reading", "24 ghante so paane ki power", "Ignore karne ki ninja technique"],
        myThought: "Sote-sote duniya bachaogi tum, super-sleeper! 😴"
    },
    {
        q: "Tumhare phone mein sabse zyada storage kisne gheri hai?",
        options: ["Padhai ke PDFs", "Memes", "1000+ same pose selfies"],
        myThought: "Selfies delete mat karna, wo mere liye storage nahi memories hain 📸"
    },
    {
        q: "Mujhe tumhari photos mein sabse best kya lagti hai?",
        options: ["Background", "Outfit", "Tumhari natural vibe"],
        myThought: "Cameras tumhari natural vibe ko kabhi poori tarah capture nahi kar paate 🌸"
    },
    {
        q: "Agar tumhara mood kharab ho, toh kya chahiye?",
        options: ["Chai / Coffee", "Momos / Pizza", "Shopping"],
        myThought: "Acha khana aur tumhara mood, dono ka gehra rishta hai! 🍕"
    },
    {
        q: "Jab tum kehti ho '5 minute mein ready', toh actual time?",
        options: ["Exactly 5 minute", "30 minute", "Ek ghanta minimum"],
        myThought: "5 minute matlab hamesha 'Agla janam' hota hai tumhare liye! 🕰️"
    },
    {
        q: "Priyanshi ki vibe kisse sabse zyada match karti hai?",
        options: ["Golden hour sunlight", "Raat ki shanti", "Subah ki thandi hawa"],
        myThought: "Golden hour ki tarah tum bhi thodi shant aur bohot glowing ho 🌇"
    },
    {
        q: "Faltu jokes pe Priyanshi ka response?",
        options: ["Zor se hasna", "'Kaisi baatein karte ho' 🙄", "Seen chhod dena"],
        myThought: "Ye 'Kaisi baatein karte ho' sunne ke liye hi toh main jokes maarta hoon 😂"
    },
    {
        q: "Is game ke baad tumhara reaction?",
        options: ["'Aree yrrr ab bohot ho gya 😭'", "Hmm", "Smile karke 'Pagal ho tum'"],
        myThought: "Main janta hoon tum abhi smile kar rahi ho... mission successful! 🤭"
    },
    {
        q: "Agar hamari movie banti, toh title kya hota?",
        options: ["Tom and Jerry", "The Overthinkers", "Silent Treatment"],
        myThought: "Tom and Jerry is perfect, ladna-jhagadna aur phir sath rehna! 🐱🐭"
    },
    {
        q: "Mayank ki life mein Priyanshi ki importance?",
        options: ["Dost", "Ek aadat", "The one who makes everything better ❤️"],
        myThought: "Ye sach hai. Tum mere din ko hamesha thoda behtar bana deti ho. ✨"
    }
];

export default function FunGames({ onComplete }) {
    const [currentQ, setCurrentQ] = useState(0)
    const [gameState, setGameState] = useState("start") // start, playing, popup, finished
    const [selectedOpt, setSelectedOpt] = useState(null)
    const [otherText, setOtherText] = useState("")
    const [reasonText, setReasonText] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    // LOCAL STORAGE PERSISTENCE
    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem("priyanshi_progress")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.index >= QUESTIONS.length) setGameState("finished")
            else setCurrentQ(parsed.index)
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("priyanshi_progress", JSON.stringify({ index: currentQ }))
        }
    }, [currentQ, isMounted])

    if (!isMounted) return null

    const handleOptionSelect = (idx) => setSelectedOpt(idx)

    const handleSubmit = () => {
        const qData = QUESTIONS[currentQ]
        const choice = selectedOpt === "other" ? `Other: ${otherText}` : qData.options[selectedOpt]
        
        // Show Mayank's Reply
        setGameState("popup")

        // Send to TG
        sendTGUpdate(currentQ + 1, qData.q, choice, reasonText)
    }

    const nextQuestion = () => {
        setSelectedOpt(null)
        setOtherText("")
        setReasonText("")
        setGameState("playing")
        
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            setGameState("finished")
        }
    }

    // Samsung-Style Puffy Class
    const puffyCard = "bg-[#f0f3f9] rounded-[32px] shadow-[8px_8px_16px_#d1d9e6,-8px,-8px_16px_#ffffff] border border-white/40"
    const puffyBtn = "transition-all duration-300 rounded-[20px] shadow-[4px_4px_8px_#d1d9e6,-4px,-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f3f9] text-[#4a5568] font-['Nunito'] relative overflow-hidden">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
            .fabric-bg {
                background-image: url("https://www.transparenttextures.com/patterns/pinstriped-suit.png");
                opacity: 0.05;
            }`}</style>

            <div className="absolute inset-0 fabric-bg pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Heart className="w-10 h-10 text-pink-400 fill-pink-400" />
                            </div>
                            <h1 className="text-3xl font-black mb-3 text-[#2d3748] tracking-tighter italic">Conversation Mode</h1>
                            <p className="text-gray-500 mb-8 text-sm">Priyanshi, isme koi sahi ya galat jawab nahi hai. Bas wo choose karna jo tumhe feel ho. ✨</p>
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 bg-pink-400 text-white font-black uppercase tracking-widest ${puffyBtn}`}>Chalo Shuru Karein</button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-400" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className="text-lg font-bold mb-6 text-[#2d3748] leading-tight">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-3 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => (
                                    <button key={idx} onClick={() => handleOptionSelect(idx)}
                                        className={`w-full p-4 text-left font-semibold ${puffyBtn} ${selectedOpt === idx ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-white/80'}`}>
                                        {opt}
                                    </button>
                                ))}
                                <button onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-4 text-left font-semibold ${puffyBtn} ${selectedOpt === "other" ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-white/80'}`}>
                                    Something else...
                                </button>
                            </div>

                            {selectedOpt === "other" && (
                                <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="w-full p-4 mb-4 rounded-2xl bg-white border-none shadow-inner outline-none text-sm"
                                    placeholder="Apna jawab likho yahan..." value={otherText} onChange={(e) => setOtherText(e.target.value)} />
                            )}

                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tell me why? (Optional)</label>
                                <textarea className="w-full p-4 h-24 rounded-2xl bg-white border-none shadow-inner outline-none text-sm resize-none"
                                    placeholder="Iska koi khas reason?..." value={reasonText} onChange={(e) => setReasonText(e.target.value)} />
                            </div>

                            <button disabled={selectedOpt === null} onClick={handleSubmit}
                                className={`w-full py-4 mt-6 font-black uppercase tracking-widest rounded-2xl transition-all ${selectedOpt !== null ? 'bg-indigo-400 text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                Send Response <Send className="inline ml-2 w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* MAYANK'S REPLY POPUP */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xs font-black uppercase text-indigo-400 mb-4 tracking-widest">Mayank's Thought</h3>
                            <p className="text-lg font-medium text-[#2d3748] italic mb-10 leading-relaxed">"{QUESTIONS[currentQ].myThought}"</p>
                            <button onClick={nextQuestion} className={`w-full py-4 bg-indigo-400 text-white font-black uppercase tracking-widest ${puffyBtn}`}>Next Question</button>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Sparkles className="w-10 h-10 text-pink-400" />
                            </div>
                            <h2 className="text-2xl font-black mb-2 text-[#2d3748] tracking-tighter">Sab Mil Gaya! ✨</h2>
                            <p className="text-gray-500 mb-10 text-sm">Tumhare saare answers mere paas pahunch gaye hain. Acha laga ye jaan kar ki tum kya sochti ho.</p>
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"><RotateCcw size={14}/> Reset Everything</button>
                            <button onClick={() => onComplete(100)} className={`w-full py-4 bg-indigo-400 text-white font-black uppercase tracking-widest ${puffyBtn}`}>Proceed to Surprise</button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
