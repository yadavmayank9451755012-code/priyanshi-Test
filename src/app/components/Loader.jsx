"use client";

import { motion } from "framer-motion";

export default function Loader() { return ( <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0b1220] to-[#0f1e3a] overflow-hidden"> <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-between py-10 px-6">

{/* Top Text */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="text-3xl font-semibold text-white leading-tight">
        Preparing Something
      </h1>
      <h2 className="text-3xl italic text-pink-300">
        Special
      </h2>
      <p className="text-sm text-gray-300 mt-2">
        Please wait...
      </p>
    </motion.div>

    {/* Image Section */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full flex justify-center items-end"
    >
      <div className="absolute w-[120%] h-[120%] bg-blue-500/20 blur-3xl rounded-full bottom-0"></div>

      <img
        src="/images/girl.png" // replace with your image
        alt="girl"
        className="relative z-10 h-[60vh] object-contain"
      />
    </motion.div>

    {/* Button */}
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg"
    >
      Continue →
    </motion.button>

  </div>
</div>

); }