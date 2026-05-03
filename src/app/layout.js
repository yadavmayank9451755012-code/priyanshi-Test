import "./globals.css";

export const metadata = {
  title: "Happy Birthday!",
  description: "A special surprise..."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* MusicPlayer capsule removed completely */}
        {children}
      </body>
    </html>
  );
}
