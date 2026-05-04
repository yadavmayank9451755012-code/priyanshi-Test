"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Send, Check, Heart } from "lucide-react"

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
// 20 QUESTIONS DATA (Minimalist Edition)
// ==========================================
const QUESTIONS = [
    {
        q: "Priyanshi jab baat cut karna chahti hai, toh aaj kal uska sabse favorite excuse kya hai?",
        options: [
            { text: "Neend aa rahi hai", reply: "Sote rehna bas duniya bhar ka! 😂" },
            { text: "Shanti se padhai karni hai bass", reply: "Mujhe pata tha! Ye 'Shanti' wali padhai kabhi khatam nahi hoti 😂" },
            { text: "Baad mein baat karti hu", reply: "Wo 'baad mein' hamesha agle din aata hai, mujhe pata hai." }
        ]
    },
    {
        q: "Mere phone number ke last 4 digits (1108) ka actual matlab kya hai?",
        options: [
            { text: "Mera lucky number", reply: "Nahi baba, kuch aur hi reason tha iske piche." },
            { text: "Random digits", reply: "Itna random bhi nahi hai, soch ke liya tha." },
            { text: "11 June aur 2008 ❤️", reply: "Acha laga dekh kar ki tumhe abhi bhi ye yaad hai. 1108 is special. ✨" }
        ]
    },
    {
        q: "Hum dono mein se sabse bada 'Overthinker' kaun hai?",
        options: [
            { text: "Sirf Mayank", reply: "Acha ji? Saara blame mere upar? 😂" },
            { text: "Sirf Priyanshi", reply: "Sahi pakda! Tumhare dimaag mein 24/7 ek movie chalti rehti hai." },
            { text: "Dono barabar hain", reply: "Dono hi PhD level overthinkers hain, isliye toh vibe match hoti hai 😅" }
        ]
    },
    {
        q: "Jab Priyanshi gusse mein hoti hai, toh usko shant karne ka best tareeka kya hai?",
        options: [
            { text: "Sorry bol do", reply: "Sirf sorry se kahan maanti ho tum aaj kal." },
            { text: "Khana khila do", reply: "Food is the ultimate cheat code for you! 🍕" },
            { text: "Uski dher saari tareef kar do", reply: "Tareef sunte hi tum pighal jati ho, ye mera sabse bada secret astra hai 🪄" }
        ]
    },
    {
        q: "Is poori duniya mein sabse bada 'Nakhre-baaz' kaun hai?",
        options: [
            { text: "Mayank", reply: "Main toh kitna seedha hoon yaar! 😇" },
            { text: "Priyanshi ki best friend", reply: "Uski best friend ka toh pata nahi, par uski dost usse kam nakhre wali hai." },
            { text: "Maharani Priyanshi खुद", reply: "Maharani ji, aapke nakhre toh world famous hain aur cute bhi! 👑" }
        ]
    },
    {
        q: "Hamari sabse pehli baat kis topic par hui thi?",
        options: [
            { text: "Teachers Day Dance 💃", reply: "Wo Teachers Day wala dance... wahi se toh sab shuru hua tha! ✨" },
            { text: "Insta story reply pe", reply: "Nahi, dhyan se yaad karo. Story se pehle bhi baat hui thi." },
            { text: "Notes maangne par", reply: "Padhakku lagti ho par notes wali baat nahi thi." }
        ]
    },
    {
        q: "Mera sabse favorite kaam kya hai?",
        options: [
            { text: "Padhai karna", reply: "Bohot padhta hoon main, par sabse favorite nahi hai." },
            { text: "Doston ke sath ghoomna", reply: "Doston ke sath maza aata hai, but there is something better." },
            { text: "Priyanshi ko tease karna", reply: "Tumhe pareshan karne mein jo sukoon hai, wo kisi aur cheez mein nahi 👻" }
        ]
    },
    {
        q: "Tumhari wo kaunsi aadat hai jo mujhe sabse cute lagti hai?",
        options: [
            { text: "Tumhara gussa", reply: "Gusse mein laal tamatar toh lagti ho, but it's not the cutest." },
            { text: "Tumhari smile", reply: "Smile toh achi hai hi, par ek aur cheez bohot pyari hai." },
            { text: "Jab tum galat hoti ho toh muh banana", reply: "Jab tum galti karke cute sa face banati ho na, wahi mera favorite moment hai ❤️" }
        ]
    },
    {
        q: "Zyada 'Late Reply' karne ka award kisko jana chahiye?",
        options: [
            { text: "Mayank ko", reply: "Arey main toh kitna fast reply karta hoon!" },
            { text: "Maharani Priyanshi ko", reply: "Tumhe award dene ke liye toh stage bhi taiyaar hai! 🏆" },
            { text: "Internet connection ko", reply: "Jio ko blame mat karo, sachai dono ko pata hai 😂" }
        ]
    },
    {
        q: "Priyanshi ki kis cheez se sabse zyada log jalte hain?",
        options: [
            { text: "Photos ki aesthetic vibe", reply: "Tumhari aesthetic sense ka toh main bhi fan hoon, log kyun na jaley? ✨" },
            { text: "Uske marks", reply: "Marks toh ache aate hi hain, par vibe ka jalwa alag hai." },
            { text: "Uska attitude", reply: "Attitude nahi hai, wo bas tumhara style hai." }
        ]
    },
    {
        q: "Agar Priyanshi ek superhero hoti, toh uski power kya hoti?",
        options: [
            { text: "Mind-reading", reply: "Dusro ka dimaag padhogi toh aur overthink karogi!" },
            { text: "24 ghante so paane ki power", reply: "Sote-sote duniya bachaogi tum, super-sleeper! 😴" },
            { text: "Ignore karne ki ninja technique", reply: "Ye technique toh already hai tumhare paas ninja ji." }
        ]
    },
    {
        q: "Tumhare phone mein sabse zyada storage kisne gheri hai?",
        options: [
            { text: "Padhai ke PDFs", reply: "Tum aur PDFs ki storage? Jhoot! 😂" },
            { text: "Memes", reply: "Memes hain, but sabse zyada nahi." },
            { text: "1000+ same pose selfies", reply: "Selfies delete mat karna, wo mere liye storage nahi memories hain 📸" }
        ]
    },
    {
        q: "Mujhe tumhari photos mein sabse best kya lagti hai?",
        options: [
            { text: "Background", reply: "Tumhe dekhu ya background ko?" },
            { text: "Outfit", reply: "Kapde ache hote hain, par usse bhi acha kuch hai." },
            { text: "Tumhari natural vibe", reply: "Cameras tumhari natural vibe ko kabhi poori tarah capture nahi kar paate 🌸" }
        ]
    },
    {
        q: "Agar tumhara mood kharab ho, toh kya chahiye?",
        options: [
            { text: "Chai / Coffee", reply: "Beverages se mood thoda theek hota hai, bas thoda." },
            { text: "Momos / Pizza", reply: "Acha khana aur tumhara mood, dono ka gehra rishta hai! 🍕" },
            { text: "Shopping", reply: "Shopping theek hai, par food is supreme for you." }
        ]
    },
    {
        q: "Jab tum kehti ho '5 minute mein ready', toh actual time?",
        options: [
            { text: "Exactly 5 minute", reply: "Ye toh tumne zindagi ka sabse bada jhoot bola hai 😂" },
            { text: "30 minute", reply: "Thoda aur zyada time lagta hai shayad." },
            { text: "Ek ghanta minimum", reply: "5 minute matlab hamesha 'Agla janam' hota hai tumhare liye! 🕰️" }
        ]
    },
    {
        q: "Priyanshi ki vibe kisse sabse zyada match karti hai?",
        options: [
            { text: "Golden hour sunlight", reply: "Golden hour ki tarah tum bhi thodi shant aur bohot glowing ho 🌇" },
            { text: "Raat ki shanti", reply: "Raat ki shanti nahi, thodi sunshine jaisi ho tum." },
            { text: "Subah ki thandi hawa", reply: "Subah jaldi uth ke thandi hawa khaane walo mein se toh tum nahi ho 😂" }
        ]
    },
    {
        q: "Faltu jokes pe Priyanshi ka response?",
        options: [
            { text: "Zor se hasna", reply: "Andar se hasi aati hai par dikhati nahi ho." },
            { text: "'Kaisi baatein karte ho' 🙄", reply: "Ye 'Kaisi baatein karte ho' sunne ke liye hi toh main jokes maarta hoon 😂" },
            { text: "Seen chhod dena", reply: "Seen pe chhodna toh aadat si ban gayi hai na?" }
        ]
    },
    {
        q: "Is game ke baad tumhara reaction?",
        options: [
            { text: "'Aree yrrr ab bohot ho gya 😭'", reply: "Abhi nahi hua hai bohot! Thoda aur baaki hai." },
            { text: "Hmm", reply: "Sirf 'Hmm'? Itna dry reply mat do yaar." },
            { text: "Smile karke 'Pagal ho tum'", reply: "Main janta hoon tum abhi smile kar rahi ho... mission successful! 🤭" }
        ]
    },
    {
        q: "Agar hamari movie banti, toh title kya hota?",
        options: [
            { text: "Tom and Jerry", reply: "Tom and Jerry is perfect, ladna-jhagadna aur phir sath rehna! 🐱🐭" },
            { text: "The Overthinkers", reply: "Overthinkers toh hain, par title boring ho jata." },
            { text: "Silent Treatment", reply: "Kabhi kabhi silent treatment chalta hai, par poori movie nahi." }
        ]
    },
    {
        q: "Mayank ki life mein Priyanshi ki importance?",
        options: [
            { text: "Dost", reply: "Dost se bhi kuch zyada ho tum." },
            { text: "Ek aadat", reply: "Aadat toh ho gayi hai tumhari, that's true." },
            { text: "The one who makes everything better ❤️", reply: "Ye sach hai. Tum mere din ko hamesha thoda behtar bana deti ho. ✨" }
        ]
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
        const saved = localStorage.getItem("priyanshi_journal")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.index >= QUESTIONS.length) setGameState("finished")
            else setCurrentQ(parsed.index)
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("priyanshi_journal", JSON.stringify({ index: currentQ }))
        }
    }, [currentQ, isMounted])

    if (!isMounted) return null

    const handleSubmit = () => {
        const qData = QUESTIONS[currentQ]
        const choice = selectedOpt === "other" ? `Other: ${otherText}` : qData.options[selectedOpt].text
        setGameState("popup")
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

    const getMyThought = () => {
        if (selectedOpt === "other") return "Badi alag soch hai tumhari... Mujhe laga nahi tha tum ye type karogi! ✨"
        return QUESTIONS[currentQ].options[selectedOpt]?.reply || ""
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f4f6f8] text-[#2d3748] relative overflow-hidden">
            
            <div className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className="h-[80vh] flex flex-col items-center justify-center text-center px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <h1 className="text-4xl font-elegant font-semibold text-[#2d3748] mb-2">Welcome back <Heart className="inline w-5 h-5 text-[#4a637c] fill-[#4a637c]" /></h1>
                            <p className="text-[#718096] mb-12 text-sm tracking-wide">Your thoughts matter.<br/>Let's understand them better.</p>
                            
                            <button onClick={() => setGameState("playing")} className="w-full sm:w-[80%] bg-[#4a637c] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-semibold tracking-wide transition-all hover:bg-[#3b5064] shadow-md hover:shadow-lg active:scale-95">
                                Let's Begin <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN (The exact UI from screenshot) */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full py-8 px-4">
                            
                            {/* Header Progress */}
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[11px] font-bold tracking-[0.15em] text-[#718096] uppercase">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                <div className="w-32 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[#4a637c]" 
                                        initial={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
                                        animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} 
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-elegant font-semibold mb-8 text-[#2d3748] leading-tight">{QUESTIONS[currentQ].q}</h2>

                            {/* Options */}
                            <div className="space-y-3 mb-8">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedOpt(idx)}
                                            className={`w-full p-4 rounded-xl text-left font-medium text-[15px] transition-all flex justify-between items-center ${isSelected ? 'bg-[#4a637c] text-white shadow-md' : 'bg-white text-[#4a5568] border border-[#e2e8f0] hover:bg-[#f8fafc]'}`}
                                        >
                                            {opt.text}
                                            {isSelected && <Check size={18} className="text-white" />}
                                        </button>
                                    )
                                })}
                                <button 
                                    onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-4 rounded-xl text-left font-medium text-[15px] transition-all flex justify-between items-center ${selectedOpt === "other" ? 'bg-[#4a637c] text-white shadow-md' : 'bg-white text-[#4a5568] border border-[#e2e8f0] hover:bg-[#f8fafc]'}`}
                                >
                                    Something else...
                                    {selectedOpt === "other" && <Check size={18} className="text-white" />}
                                </button>
                            </div>

                            {/* Custom Input if 'Other' selected */}
                            <AnimatePresence>
                                {selectedOpt === "other" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <input 
                                            className="w-full p-4 mb-6 rounded-xl bg-white border border-[#e2e8f0] outline-none text-[#2d3748] placeholder-[#a0aec0] shadow-sm text-sm"
                                            placeholder="Apna jawab yahan type karo..." 
                                            value={otherText} 
                                            onChange={(e) => setOtherText(e.target.value)} 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Optional Reason Box */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold tracking-[0.15em] text-[#718096] uppercase mb-2 block">Tell me why? (Optional)</label>
                                <textarea 
                                    className="w-full p-4 h-24 rounded-xl bg-white border border-[#e2e8f0] outline-none text-sm resize-none text-[#2d3748] placeholder-[#a0aec0] shadow-sm transition-all focus:border-[#4a637c]"
                                    placeholder="Iska koi khas reason?..." 
                                    value={reasonText} 
                                    onChange={(e) => setReasonText(e.target.value)} 
                                />
                            </div>

                            {/* Submit Button */}
                            <button 
                                disabled={selectedOpt === null} 
                                onClick={handleSubmit}
                                className={`w-full py-4 rounded-xl font-semibold tracking-wide transition-all flex justify-center items-center gap-2 
                                ${selectedOpt !== null ? 'bg-[#4a637c] text-white shadow-md hover:shadow-lg active:scale-95' : 'bg-[#e2e8f0] text-[#a0aec0] cursor-not-allowed'}`}
                            >
                                SEND RESPONSE <Send size={16} />
                            </button>
                        </motion.div>
                    )}

                    {/* POPUP / RESPONSE SENT SCREEN */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
                            
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                className="w-24 h-24 bg-[#4a637c] rounded-full flex items-center justify-center mb-8 shadow-xl"
                            >
                                <Check className="w-12 h-12 text-white" />
                            </motion.div>
                            
                            <h2 className="text-2xl font-elegant font-semibold text-[#2d3748] mb-2">Response sent!</h2>
                            <p className="text-[#718096] mb-8 text-sm">Thank you for being so honest.<br/> <Heart className="inline w-3 h-3 text-[#4a637c] fill-[#4a637c] mt-2" /></p>
                            
                            {/* Mayank's Thought Card */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="w-full bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm mb-10">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#718096] mb-3">Mayank's Thought</h3>
                                <p className="text-[15px] font-medium text-[#4a5568] italic">"{getMyThought()}"</p>
                            </motion.div>

                            <button onClick={nextQuestion} className="w-full sm:w-[80%] bg-[#4a637c] text-white py-4 rounded-xl flex justify-center items-center gap-2 font-semibold tracking-wide hover:bg-[#3b5064] shadow-md transition-all active:scale-95">
                                NEXT <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
                            
                            <div className="w-48 h-48 rounded-full border-[6px] border-[#4a637c]/20 flex items-center justify-center relative mb-8">
                                <div className="absolute inset-0 rounded-full border-[6px] border-[#4a637c] border-t-transparent -rotate-45" />
                                <div className="text-center">
                                    <span className="text-4xl font-elegant font-semibold text-[#2d3748]">{QUESTIONS.length}</span>
                                    <p className="text-[10px] font-bold tracking-[0.1em] text-[#718096] uppercase mt-1">Steps<br/>Completed</p>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl font-elegant font-semibold text-[#2d3748] mb-2">You're amazing!</h2>
                            <p className="text-[#718096] mb-12 text-sm tracking-wide">One step closer to<br/>understanding each other.</p>
                            
                            <button onClick={() => onComplete(100)} className="w-full sm:w-[80%] bg-[#4a637c] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-semibold tracking-wide transition-all hover:bg-[#3b5064] shadow-md hover:shadow-lg active:scale-95">
                                CONTINUE <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
