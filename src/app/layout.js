"use client"
import "./globals.css";
import { useRef } from "react";

export const metadata = {
  title: "Happy Birthday!",
  description: "An animated birthday surprise filled with emotions, words from the heart, and a letter that types itself — just for you."
};

export default function RootLayout({ children }) {
  const audioRef = useRef(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        onClick={handleClick}  // 👈 kahin bhi click = music start
      >
        {children}

        <audio ref={audioRef} loop>
          <source src="/song.mp3" type="audio/mpeg" />
        </audio>
      </body>
    </html>
  );
}