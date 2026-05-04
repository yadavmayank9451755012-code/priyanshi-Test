"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageCircle, Send, RotateCcw, Heart } from "lucide-react"

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
// 20 QUESTIONS DATA (With Individual Replies)
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
        const saved = localStorage.getItem("priyanshi_conversation")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.index >= QUESTIONS.length) setGameState("finished")
            else setCurrentQ(parsed.index)
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("priyanshi_conversation", JSON.stringify({ index: currentQ }))
        }
    }, [currentQ, isMounted])

    if (!isMounted) return null

    const handleOptionSelect = (idx) => setSelectedOpt(idx)

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

    // ==========================================
    // BENJAMIN MOORE COLOR PALETTE & NEUMORPHISM
    // ==========================================
    // BM 2129-30 Blue Note (Background/Cards) : #212c3b
    // BM OC-17 White Dove (Text)              : #f0efe7
    // BM HC-146 Wedgewood Gray (Accent/Unsel.): #7b8f9c
    // BM HC-50 Georgian Brick (Highlight/Pink): #9e5043
    
    // Shadows for 3D Puffy effect on Dark Background
    const puffyCard = "bg-[#212c3b] rounded-[32px] shadow-[6px_6px_14px_#171f29,-6px_-6px_14px_#2b394d] border border-[#303e52]"
    const puffyBtn = "transition-all duration-300 rounded-[20px] shadow-[4px_4px_10px_#171f29,-4px_-4px_10px_#2b394d] active:shadow-[inset_4px_4px_10px_#171f29,inset_-4px_-4px_10px_#2b394d] border border-[#2a384a]"
    const puffyInput = "bg-[#1d2633] rounded-2xl shadow-[inset_4px_4px_8px_#131a23,inset_-4px_-4px_8px_#29384b] border border-[#2a384a]"

    // Determine the reply to show in Popup
    const getMyThought = () => {
        if (selectedOpt === "other") return "Badi alag soch hai tumhari... Mujhe laga nahi tha tum ye type karogi! ✨"
        return QUESTIONS[currentQ].options[selectedOpt]?.reply || ""
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#212c3b] text-[#f0efe7] font-['Nunito'] relative overflow-hidden">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap');`}</style>

            {/* Subtle background glow for extra aesthetic */}
            <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#7b8f9c]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[20%] w-64 h-64 bg-[#9e5043]/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">
                    
                    {/* START SCREEN */}
                    {gameState === "start" && (
                        <motion.div key="start" className={`p-8 text-center ${puffyCard}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-20 h-20 bg-[#212c3b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_4px_4px_8px_#171f29,inset_-4px_-4px_8px_#2b394d] border border-[#303e52]">
                                <Heart className="w-10 h-10 text-[#9e5043] fill-[#9e5043]/50" />
                            </div>
                            <h1 className="text-3xl font-extrabold mb-3 text-[#f0efe7] tracking-tighter italic">Conversation Mode</h1>
                            <p className="text-[#7b8f9c] mb-8 text-sm">Priyanshi, isme koi sahi ya galat jawab nahi hai. Bas wo choose karna jo tumhe sach feel ho. ✨</p>
                            <button onClick={() => setGameState("playing")} className={`w-full py-4 text-[#f0efe7] font-extrabold uppercase tracking-widest ${puffyBtn} hover:text-[#9e5043]`}>
                                Chalo Shuru Karein
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === "playing" && (
                        <motion.div key="playing" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-6 ${puffyCard}`}>
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7b8f9c]">Step {currentQ + 1} / {QUESTIONS.length}</span>
                                <div className="w-24 h-1.5 bg-[#171f29] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_#0e1319]">
                                    <div className="h-full bg-[#9e5043] transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className="text-lg font-bold mb-6 text-[#f0efe7] leading-relaxed">{QUESTIONS[currentQ].q}</h2>

                            <div className="space-y-4 mb-6">
                                {QUESTIONS[currentQ].options.map((opt, idx) => {
                                    const isSelected = selectedOpt === idx;
                                    return (
                                        <button key={idx} onClick={() => handleOptionSelect(idx)}
                                            className={`w-full p-4 text-left font-semibold ${puffyBtn} ${isSelected ? 'text-[#9e5043] shadow-[inset_4px_4px_10px_#171f29,inset_-4px_-4px_10px_#2b394d] border-[#9e5043]/50' : 'text-[#f0efe7]/90'}`}>
                                            {opt.text}
                                        </button>
                                    )
                                })}
                                <button onClick={() => setSelectedOpt("other")}
                                    className={`w-full p-4 text-left font-semibold ${puffyBtn} ${selectedOpt === "other" ? 'text-[#9e5043] shadow-[inset_4px_4px_10px_#171f29,inset_-4px_-4px_10px_#2b394d] border-[#9e5043]/50' : 'text-[#f0efe7]/70'}`}>
                                    Something else...
                                </button>
                            </div>

                            {selectedOpt === "other" && (
                                <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`w-full p-4 mb-4 outline-none text-sm text-[#f0efe7] placeholder-[#7b8f9c] ${puffyInput}`}
                                    placeholder="Apna jawab likho yahan..." value={otherText} onChange={(e) => setOtherText(e.target.value)} />
                            )}

                            <div className="mt-8 border-t border-[#303e52] pt-6">
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#7b8f9c] mb-3 block">Tell me why? (Optional)</label>
                                <textarea className={`w-full p-4 h-24 outline-none text-sm resize-none text-[#f0efe7] placeholder-[#7b8f9c] ${puffyInput}`}
                                    placeholder="Iska koi khas reason?..." value={reasonText} onChange={(e) => setReasonText(e.target.value)} />
                            </div>

                            <button disabled={selectedOpt === null} onClick={handleSubmit}
                                className={`w-full py-4 mt-6 font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedOpt !== null ? `${puffyBtn} text-[#f0efe7] hover:text-[#9e5043]` : 'bg-[#171f29] text-[#7b8f9c]/50 rounded-[20px] cursor-not-allowed border border-[#212c3b]'}`}>
                                Send Response <Send className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* MAYANK'S REPLY POPUP */}
                    {gameState === "popup" && (
                        <motion.div key="popup" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className="w-16 h-16 bg-[#212c3b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_4px_4px_8px_#171f29,inset_-4px_-4px_8px_#2b394d] border border-[#303e52]">
                                <MessageCircle className="w-8 h-8 text-[#7b8f9c]" />
                            </div>
                            <h3 className="text-xs font-extrabold uppercase text-[#7b8f9c] mb-4 tracking-widest">My Thought</h3>
                            <p className="text-lg font-semibold text-[#f0efe7] italic mb-10 leading-relaxed">"{getMyThought()}"</p>
                            <button onClick={nextQuestion} className={`w-full py-4 text-[#f0efe7] font-extrabold uppercase tracking-widest ${puffyBtn} hover:text-[#7b8f9c]`}>
                                Next Question
                            </button>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === "finished" && (
                        <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-8 text-center ${puffyCard}`}>
                            <div className="w-20 h-20 bg-[#212c3b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_4px_4px_8px_#171f29,inset_-4px_-4px_8px_#2b394d] border border-[#303e52]">
                                <Sparkles className="w-10 h-10 text-[#9e5043]" />
                            </div>
                            <h2 className="text-2xl font-extrabold mb-3 text-[#f0efe7] tracking-tighter">Sab Mil Gaya! ✨</h2>
                            <p className="text-[#7b8f9c] mb-10 text-sm leading-relaxed">Tumhare saare answers mere paas pahunch gaye hain. Acha laga ye jaan kar ki tum kya sochti ho.</p>
                            
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mb-6 text-[10px] font-extrabold text-[#7b8f9c] hover:text-[#f0efe7] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
                                <RotateCcw size={12}/> Reset Everything
                            </button>
                            
                            <button onClick={() => onComplete(100)} className={`w-full py-4 text-[#f0efe7] font-extrabold uppercase tracking-widest ${puffyBtn} hover:text-[#9e5043]`}>
                                Proceed to Surprise
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
