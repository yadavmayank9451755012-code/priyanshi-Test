import "./globals.css";
import FloatingHearts from "./components/FloatingHearts"; // 👈 Import karo

export const metadata = {
  title: "Happy Birthday Madam Jii!",
  description: "A special surprise...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Background ko black hi rakhna taaki neon chamke */}
      <body className="antialiased bg-black relative">
        
        {/* 🌟 Floating Hearts Background Component 🌟 */}
        <FloatingHearts />
        
        {/* Baaki saare pages content (Children) */}
        <div className="relative z-10">
            {children}
        </div>
      </body>
    </html>
  );
}
