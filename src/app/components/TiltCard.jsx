"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function TiltCard({ className = "", children, ...props }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    setTilt({ x: (0.5 - py) * 10, y: (px - 0.5) * 12 })
  }

  const { style, animate, ...rest } = props;

  return (
    <motion.div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{
        ...animate,
        rotateX: tilt.x,
        rotateY: tilt.y
      }}
      transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.5 }}
      style={{ ...style, transformStyle: "preserve-3d" }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
