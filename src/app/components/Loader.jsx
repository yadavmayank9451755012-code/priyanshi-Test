import { useState, useEffect } from "react";

const sparkles = [
  { top: "8%", left: "12%", size: 14, color: "#f9a8d4", delay: 0 },
  { top: "6%", left: "50%", size: 18, color: "#f43f5e", delay: 0.3 },
  { top: "14%", left: "88%", size: 12, color: "#f9a8d4", delay: 0.6 },
  { top: "35%", left: "5%", size: 16, color: "#fde68a", delay: 0.2 },
  { top: "42%", left: "92%", size: 20, color: "#fde68a", delay: 0.8 },
  { top: "55%", left: "8%", size: 12, color: "#f9a8d4", delay: 1.0 },
  { top: "60%", left: "85%", size: 18, color: "#fde68a", delay: 0.4 },
  { top: "75%", left: "15%", size: 14, color: "#fde68a", delay: 1.2 },
  { top: "28%", left: "75%", size: 10, color: "#f9a8d4", delay: 0.5 },
  { top: "50%", left: "50%", size: 8, color: "#fde68a", delay: 0.9 },
];

function SparkleIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 24 22" fill="#f43f5e">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </svg>
  );
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.wrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400&family=Great+Vibes&display=swap');

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(20deg); }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes fadeSlideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.25); }
          60% { transform: scale(0.95); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes imageReveal {
          0% { opacity: 0; transform: scale(0.92) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 30px rgba(71,85,115,0.25); }
          50% { box-shadow: 0 4px 40px rgba(71,85,115,0.45); }
        }
        .sparkle-item {
          animation: sparkleAnim 2.5s ease-in-out infinite;
        }
        .heart-icon {
          animation: heartBeat 1.6s ease-in-out infinite;
        }
        .title-line1 {
          animation: fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) 0.1s both;
        }
        .title-line2 {
          animation: fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) 0.25s both;
        }
        .title-script {
          animation: fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) 0.4s both;
        }
        .divider {
          animation: fadeSlideDown 0.6s ease 0.55s both;
        }
        .wait-text {
          animation: fadeSlideDown 0.6s ease 0.65s both;
        }
        .photo-blob {
          animation: imageReveal 1s cubic-bezier(.22,1,.36,1) 0.5s both, blobFloat 6s ease-in-out 1.5s infinite;
        }
        .continue-btn {
          animation: floatUp 0.8s cubic-bezier(.22,1,.36,1) 0.9s both, btnPulse 3s ease-in-out 2s infinite;
        }
        .continue-btn:hover {
          transform: scale(1.04);
          transition: transform 0.2s ease;
        }
        .leaf-deco {
          animation: fadeSlideDown 1.2s ease 1.2s both;
        }
      `}</style>

      {/* Background */}
      <div style={styles.background} />

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="sparkle-item"
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            animationDelay: `${s.delay}s`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <SparkleIcon size={s.size} color={s.color} />
        </div>
      ))}

      {/* Leaf decoration bottom-left */}
      <div className="leaf-deco" style={styles.leafDeco}>
        <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
          <path d="M10 80 Q20 40 60 10 Q40 50 10 80Z" fill="rgba(180,195,210,0.18)" />
          <path d="M5 85 Q30 50 70 20 Q45 58 5 85Z" fill="rgba(180,195,210,0.12)" />
        </svg>
      </div>

      {/* Top: Heart + Title */}
      <div style={styles.topSection}>
        <div className="heart-icon" style={{ marginBottom: 8 }}>
          <HeartIcon />
        </div>

        <h1 className="title-line1" style={styles.titleLine1}>Preparing</h1>
        <h1 className="title-line2" style={styles.titleLine2}>Something</h1>
        <div className="title-script" style={styles.scriptWrap}>
          <span style={styles.scriptText}>Special</span>
        </div>

        <div className="divider" style={styles.divider} />

        {/* Wait text with animated dots */}
        <div className="wait-text" style={styles.waitRow}>
          <SparkleIcon size={10} color="#f9c74f" />
          <span style={styles.waitText}>Please wait</span>
          {[0, 0.2, 0.4].map((d, i) => (
            <span
              key={i}
              style={{
                ...styles.dot,
                animationDelay: `${d}s`,
                animation: `dotBlink 1.4s ease-in-out ${d}s infinite`,
              }}
            >.</span>
          ))}
          <SparkleIcon size={10} color="#f9c74f" />
        </div>
      </div>

      {/* Center: Blob + Photo */}
      <div className="photo-blob" style={styles.blobContainer}>
        <div style={styles.blobShape}>
          <img
            src="images/10.jpg"
            alt="Special person"
            style={styles.photo}
            onError={(e) => {
              // Fallback gradient if image not found
              e.target.style.display = "none";
              e.target.parentNode.style.background =
                "linear-gradient(135deg, #c9d6e3 0%, #e8ecf0 100%)";
            }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressWrap}>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div style={styles.btnWrap}>
        <button className="continue-btn" style={styles.continueBtn}>
          <span style={styles.btnText}>Continue</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    minHeight: "100vh",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    background: "#eef1f6",
    fontFamily: "'DM Sans', sans-serif",
    userSelect: "none",
  },
  background: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(170deg, #dde3ed 0%, #eaecf3 40%, #f0f2f7 100%)",
    zIndex: 0,
  },
  topSection: {
    position: "relative",
    zIndex: 3,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 0,
  },
  titleLine1: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: 42,
    color: "#1e2a3a",
    margin: "0",
    lineHeight: 1.1,
    letterSpacing: "-0.5px",
  },
  titleLine2: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: 42,
    color: "#1e2a3a",
    margin: "0",
    lineHeight: 1.1,
    letterSpacing: "-0.5px",
  },
  scriptWrap: {
    marginTop: 2,
  },
  scriptText: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: 52,
    color: "#f06292",
    lineHeight: 1.1,
    display: "block",
    letterSpacing: "1px",
  },
  divider: {
    width: 40,
    height: 2,
    background: "rgba(120,140,170,0.35)",
    borderRadius: 2,
    margin: "12px auto 10px",
  },
  waitRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#8a96a8",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: "0.3px",
  },
  waitText: {
    color: "#8a96a8",
    fontSize: 14,
    letterSpacing: "0.5px",
  },
  dot: {
    color: "#8a96a8",
    fontSize: 18,
    lineHeight: 1,
    display: "inline-block",
  },
  blobContainer: {
    position: "relative",
    zIndex: 3,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  blobShape: {
    width: 320,
    height: 380,
    borderRadius: "60% 40% 55% 45% / 50% 55% 45% 50%",
    overflow: "hidden",
    background: "linear-gradient(135deg, #c9d6e3 0%, #dce4ef 100%)",
    boxShadow: "0 20px 60px rgba(100,120,160,0.18), 0 4px 20px rgba(100,120,160,0.12)",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
    display: "block",
  },
  progressWrap: {
    position: "relative",
    zIndex: 3,
    width: "75%",
    marginTop: 16,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    background: "rgba(150,170,200,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #f9a8d4, #f43f5e, #f9a8d4)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s linear infinite",
    borderRadius: 4,
  },
  btnWrap: {
    position: "relative",
    zIndex: 3,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingBottom: 40,
    marginTop: 20,
  },
  continueBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "linear-gradient(135deg, #4a5a72 0%, #374560 100%)",
    color: "white",
    border: "none",
    borderRadius: 50,
    paddingLeft: 36,
    paddingRight: 28,
    paddingTop: 17,
    paddingBottom: 17,
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    letterSpacing: "0.5px",
    cursor: "pointer",
    outline: "none",
    width: "72%",
    justifyContent: "center",
  },
  btnText: {
    flex: 1,
    textAlign: "center",
  },
  leafDeco: {
    position: "absolute",
    bottom: 60,
    left: -10,
    zIndex: 2,
    opacity: 0.7,
    pointerEvents: "none",
  },
};
