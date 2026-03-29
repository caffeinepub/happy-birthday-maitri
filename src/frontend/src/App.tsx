import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Countdown Gate ───────────────────────────────────────────────────────────

const PLANETS = [
  { color: "oklch(0.85 0.14 0)", size: 14, orbit: 70, duration: 7 },
  { color: "oklch(0.75 0.14 220)", size: 10, orbit: 100, duration: 11 },
  { color: "oklch(0.80 0.12 290)", size: 12, orbit: 130, duration: 15 },
  { color: "oklch(0.80 0.14 140)", size: 9, orbit: 160, duration: 20 },
  { color: "oklch(0.88 0.15 75)", size: 11, orbit: 190, duration: 26 },
];

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
    }));

    let raf: number;
    let t = 0;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      for (const s of stars) {
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const gold = Math.random() > 0.7;
        ctx.fillStyle = gold
          ? `rgba(255,220,150,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

const BIRTHDAY_TARGET = new Date("2026-03-29T00:00:00").getTime();

function calcCountdown() {
  const diff = BIRTHDAY_TARGET - Date.now();
  if (diff <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

function CountdownPage({ onUnlock }: { onUnlock: () => void }) {
  const [time, setTime] = useState(calcCountdown);

  useEffect(() => {
    if (time.done) {
      onUnlock();
      return;
    }
    const id = setInterval(() => {
      const next = calcCountdown();
      setTime(next);
      if (next.done) {
        clearInterval(id);
        onUnlock();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onUnlock, time.done]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "oklch(0.16 0.10 320)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }
        @keyframes sun-pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        @keyframes cd-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes cd-deco-float {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.85; }
          50%      { transform: translateY(-12px) rotate(6deg); opacity: 1; }
        }
      `}</style>

      {/* Stars canvas */}
      <StarCanvas />

      {/* Radial glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.45 0.20 330 / 0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Floating kawaii decorations */}
      {[
        {
          emoji: "🎈",
          top: "8%",
          left: "6%",
          size: "2rem",
          delay: 0,
          dur: 3.5,
        },
        {
          emoji: "💖",
          top: "6%",
          left: "82%",
          size: "1.8rem",
          delay: 0.6,
          dur: 3.2,
        },
        {
          emoji: "⭐",
          top: "30%",
          left: "4%",
          size: "1.6rem",
          delay: 1.2,
          dur: 4,
        },
        {
          emoji: "🌸",
          top: "35%",
          left: "90%",
          size: "1.7rem",
          delay: 0.4,
          dur: 3.8,
        },
        {
          emoji: "🎊",
          top: "70%",
          left: "5%",
          size: "2rem",
          delay: 0.8,
          dur: 4.2,
        },
        {
          emoji: "💕",
          top: "75%",
          left: "88%",
          size: "1.8rem",
          delay: 1.5,
          dur: 3.6,
        },
        {
          emoji: "✨",
          top: "14%",
          left: "50%",
          size: "1.4rem",
          delay: 0.3,
          dur: 2.8,
        },
        {
          emoji: "🎀",
          top: "55%",
          left: "2%",
          size: "1.9rem",
          delay: 1.9,
          dur: 3.9,
        },
        {
          emoji: "🌙",
          top: "18%",
          left: "18%",
          size: "1.5rem",
          delay: 0.7,
          dur: 4.4,
        },
        {
          emoji: "🎂",
          top: "20%",
          left: "76%",
          size: "1.6rem",
          delay: 1.4,
          dur: 3.3,
        },
        {
          emoji: "💫",
          top: "82%",
          left: "45%",
          size: "1.5rem",
          delay: 2.1,
          dur: 3.7,
        },
        {
          emoji: "🌺",
          top: "60%",
          left: "93%",
          size: "1.7rem",
          delay: 0.2,
          dur: 4.1,
        },
      ].map((d) => (
        <div
          key={d.emoji + d.top}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            fontSize: d.size,
            animation: `cd-deco-float ${d.dur}s ease-in-out infinite`,
            animationDelay: `${d.delay}s`,
            pointerEvents: "none",
            zIndex: 3,
            userSelect: "none",
          }}
        >
          {d.emoji}
        </div>
      ))}

      {/* Solar system */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Sun */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "oklch(0.85 0.18 30)",
            boxShadow:
              "0 0 30px oklch(0.85 0.18 30), 0 0 60px oklch(0.75 0.20 30 / 0.5), 0 0 100px oklch(0.65 0.18 30 / 0.25)",
            animation: "sun-pulse 3s ease-in-out infinite",
          }}
        />
        {/* Planets */}
        {PLANETS.map((p, i) => (
          <div
            key={p.color}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              // orbit ring (visual only)
              width: p.orbit * 2,
              height: p.orbit * 2,
              marginTop: -p.orbit,
              marginLeft: -p.orbit,
              borderRadius: "50%",
              border: "1px solid oklch(0.80 0.06 310 / 0.12)",
            }}
          >
            <div
              style={
                {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  ["--orbit-r" as string]: `${p.orbit}px`,
                  animation: `orbit ${p.duration}s linear infinite`,
                  animationDelay: `${-i * 2}s`,
                  willChange: "transform",
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>

      {/* Universe is Counting title */}
      <div
        style={{
          position: "relative",
          zIndex: 11,
          fontFamily: "'Dancing Script', cursive",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "white",
          textShadow:
            "0 0 20px oklch(0.75 0.22 330), 0 0 40px oklch(0.65 0.20 310)",
          letterSpacing: "0.05em",
          textAlign: "center",
          marginBottom: "1rem",
          opacity: 0.95,
        }}
      >
        ✨ the universe is counting ✨
      </div>

      {/* Countdown card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "oklch(1 0 0 / 0.00)",
          borderRadius: "2rem",
          padding: "2rem 1.5rem",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          border: "1px solid oklch(1 0 0 / 0.25)",
          boxShadow: "0 4px 24px oklch(0 0 0 / 0.15)",
          animation: "cd-float 4s ease-in-out infinite",
        }}
      >
        {/* Name */}
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "3.2rem",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "white",
            textShadow:
              "0 0 20px oklch(0.75 0.22 0), 0 0 40px oklch(0.65 0.20 310), 0 0 60px oklch(0.55 0.18 310)",
            marginBottom: "0.3rem",
          }}
        >
          Maitri
        </div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.95rem",
            color: "oklch(0.85 0.12 310)",
            letterSpacing: "0.12em",
            marginBottom: "1.8rem",
          }}
        >
          ✦ you are my universe ✦
        </div>

        {/* Boxes */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            justifyContent: "center",
            marginBottom: "1.6rem",
          }}
        >
          {[
            { label: "Days", val: time.days },
            { label: "Hours", val: time.hours },
            { label: "Minutes", val: time.minutes },
            { label: "Seconds", val: time.seconds },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "oklch(1 0 0 / 0.00)",
                border: "1px solid oklch(1 0 0 / 0.25)",
                borderRadius: "0.9rem",
                padding: "0.7rem 0.5rem",
                minWidth: "64px",
                flex: 1,
                boxShadow: "0 2px 8px oklch(0 0 0 / 0.20)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 700,
                  fontSize: "2.6rem",
                  color: "white",
                  lineHeight: 1,
                }}
              >
                {pad(item.val)}
              </div>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "oklch(0.95 0.05 310)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Teaser message */}
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.95rem",
            color: "oklch(0.82 0.10 310)",
            lineHeight: 1.6,
          }}
        >
          Something magical is waiting for you...
          <br />
          just a little longer 💕
        </p>

        {/* Stars emojis decoration */}
        <div style={{ marginTop: "1.2rem", fontSize: "1.3rem", opacity: 0.6 }}>
          ✨ 🌙 ⭐ 🌟 ✨
        </div>
      </div>
    </div>
  );
}

// ─── Existing site ────────────────────────────────────────────────────────────

const DECORATIONS = [
  {
    emoji: "🎈",
    left: "5%",
    top: "15%",
    size: "2.2rem",
    delay: 0,
    duration: 3.5,
  },
  {
    emoji: "🎊",
    left: "92%",
    top: "20%",
    size: "2rem",
    delay: 0.5,
    duration: 4,
  },
  {
    emoji: "💕",
    left: "10%",
    top: "50%",
    size: "1.8rem",
    delay: 1,
    duration: 3,
  },
  {
    emoji: "⭐",
    left: "88%",
    top: "55%",
    size: "1.6rem",
    delay: 1.5,
    duration: 4.5,
  },
  {
    emoji: "🎀",
    left: "3%",
    top: "75%",
    size: "2rem",
    delay: 0.8,
    duration: 3.8,
  },
  {
    emoji: "🎁",
    left: "95%",
    top: "70%",
    size: "1.8rem",
    delay: 2,
    duration: 4.2,
  },
  {
    emoji: "✨",
    left: "50%",
    top: "5%",
    size: "1.5rem",
    delay: 0.3,
    duration: 2.8,
  },
  {
    emoji: "🎂",
    left: "78%",
    top: "10%",
    size: "1.6rem",
    delay: 1.2,
    duration: 3.6,
  },
  {
    emoji: "💖",
    left: "22%",
    top: "8%",
    size: "1.5rem",
    delay: 0.6,
    duration: 3.2,
  },
  {
    emoji: "🌸",
    left: "60%",
    top: "88%",
    size: "1.8rem",
    delay: 1.8,
    duration: 4.1,
  },
  {
    emoji: "🦋",
    left: "35%",
    top: "92%",
    size: "1.6rem",
    delay: 0.9,
    duration: 3.4,
  },
  {
    emoji: "🎵",
    left: "15%",
    top: "35%",
    size: "1.4rem",
    delay: 2.2,
    duration: 4.8,
  },
  {
    emoji: "🧸",
    left: "12%",
    top: "55%",
    size: "1.7rem",
    delay: 1.3,
    duration: 9,
  },
  {
    emoji: "🌷",
    left: "82%",
    top: "30%",
    size: "1.4rem",
    delay: 0.7,
    duration: 7.5,
  },
  {
    emoji: "🍭",
    left: "5%",
    top: "80%",
    size: "1.5rem",
    delay: 1.6,
    duration: 8,
  },
  {
    emoji: "🌈",
    left: "90%",
    top: "75%",
    size: "1.6rem",
    delay: 2.4,
    duration: 10,
  },
  {
    emoji: "🎠",
    left: "45%",
    top: "15%",
    size: "1.3rem",
    delay: 0.4,
    duration: 6.5,
  },
  {
    emoji: "🧁",
    left: "70%",
    top: "60%",
    size: "1.4rem",
    delay: 1.9,
    duration: 8.5,
  },
];

const SPARKLES = [
  { id: "sp1", left: 8, top: 12, bg: 0 },
  { id: "sp2", left: 22, top: 5, bg: 1 },
  { id: "sp3", left: 37, top: 18, bg: 2 },
  { id: "sp4", left: 51, top: 9, bg: 0 },
  { id: "sp5", left: 66, top: 22, bg: 1 },
  { id: "sp6", left: 79, top: 6, bg: 2 },
  { id: "sp7", left: 91, top: 15, bg: 0 },
  { id: "sp8", left: 14, top: 32, bg: 1 },
  { id: "sp9", left: 44, top: 40, bg: 2 },
  { id: "sp10", left: 73, top: 35, bg: 0 },
  { id: "sp11", left: 6, top: 58, bg: 1 },
  { id: "sp12", left: 29, top: 65, bg: 2 },
  { id: "sp13", left: 57, top: 70, bg: 0 },
  { id: "sp14", left: 84, top: 62, bg: 1 },
  { id: "sp15", left: 95, top: 45, bg: 2 },
  { id: "sp16", left: 18, top: 82, bg: 0 },
  { id: "sp17", left: 40, top: 88, bg: 1 },
  { id: "sp18", left: 62, top: 92, bg: 2 },
  { id: "sp19", left: 75, top: 80, bg: 0 },
  { id: "sp20", left: 88, top: 85, bg: 1 },
];

const MODAL_HEARTS = [
  { emoji: "💕", id: "mh1" },
  { emoji: "💖", id: "mh2" },
  { emoji: "✨", id: "mh3" },
  { emoji: "🌟", id: "mh4" },
  { emoji: "💗", id: "mh5" },
  { emoji: "⭐", id: "mh6" },
];

const HERO_HEARTS = [
  { h: "💕", id: "hh1" },
  { h: "💖", id: "hh2" },
  { h: "💗", id: "hh3" },
  { h: "💝", id: "hh4" },
  { h: "💓", id: "hh5" },
];

const FOOTER_EMOJIS = [
  { e: "🎈", id: "fe1" },
  { e: "🎊", id: "fe2" },
  { e: "💕", id: "fe3" },
  { e: "🎂", id: "fe4" },
  { e: "⭐", id: "fe5" },
  { e: "🎀", id: "fe6" },
];

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Birthday Journey", id: "birthday-journey" },
  { label: "Message Wall", id: "message-wall" },
  { label: "Surprise! 🎁", id: "surprise" },
];

const CONFETTI_COLORS = [
  "oklch(0.75 0.22 0)",
  "oklch(0.82 0.15 75)",
  "oklch(0.70 0.18 140)",
  "oklch(0.65 0.20 220)",
  "oklch(0.72 0.18 310)",
  "oklch(0.85 0.12 60)",
];

const SPARKLE_BACKGROUNDS = [
  "oklch(0.82 0.15 75)",
  "white",
  "oklch(0.85 0.12 0)",
];

const MAITRI_ACROSTIC = [
  {
    id: "ma-m",
    letter: "M",
    meaning: "Magical smile that melts my heart",
    emoji: "✨",
  },
  {
    id: "ma-a",
    letter: "A",
    meaning: "Angelic presence in my life",
    emoji: "💕",
  },
  {
    id: "ma-i1",
    letter: "I",
    meaning: "Inspiration for my every dream",
    emoji: "🌟",
  },
  {
    id: "ma-t",
    letter: "T",
    meaning: "Thoughtful, tender, and true",
    emoji: "💖",
  },
  {
    id: "ma-r",
    letter: "R",
    meaning: "Rare gem I'm lucky to hold",
    emoji: "💎",
  },
  {
    id: "ma-i2",
    letter: "I",
    meaning: "Irreplaceable and lovely 19-year-old",
    emoji: "🌸",
  },
];

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      rotation: number;
      vr: number;
      size: number;
    }[]
  >([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    pieces.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 1,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 10 + 5,
    }));

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces.current) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.vy += 0.05;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 3 + 1;
        }
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}

function SurpriseModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[1000] p-4"
        style={{
          background: "oklch(0.10 0.08 310 / 0.85)",
          backdropFilter: "blur(6px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-ocid="surprise.modal"
      >
        <motion.div
          className="relative max-w-lg w-full rounded-4xl p-8 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.04 5), oklch(0.93 0.06 310))",
            boxShadow:
              "0 30px 80px oklch(0.25 0.10 310 / 0.5), 0 0 60px oklch(0.72 0.18 0 / 0.3)",
          }}
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          {MODAL_HEARTS.map((item, idx) => (
            <span
              key={item.id}
              className="absolute pointer-events-none text-2xl animate-float-up"
              style={{
                left: `${10 + idx * 14}%`,
                top: "10%",
                animationDelay: `${idx * 0.4}s`,
                animationDuration: `${2.5 + idx * 0.3}s`,
                opacity: 0.7,
              }}
            >
              {item.emoji}
            </span>
          ))}

          <div className="text-6xl mb-4 animate-float-up">🎉</div>

          <h2
            className="font-dancing text-4xl mb-2"
            style={{ color: "oklch(0.45 0.18 310)" }}
          >
            Surprise, Maitri!
          </h2>
          <div className="text-3xl mb-6 animate-heart-pulse">💕💕💕</div>

          <div
            className="text-base leading-relaxed mb-8 font-nunito"
            style={{ color: "oklch(0.25 0.10 310)", fontSize: "1.05rem" }}
          >
            <p>Good morning, my favourite person in the whole universe! ☀️🌸</p>
            <br />
            <p>
              Wake up, wake up — today is YOUR day! 🎉 Happy 19th Birthday,
              Maitri! Nineteen years ago, the universe decided to gift this
              world the most magical, adorable, and wonderful soul — and
              somehow, I got lucky enough to have you in my life. 🌙✨
            </p>
            <br />
            <p>
              You will always be that small, cute, and endlessly adorable girl
              to me — no matter how many birthdays pass. Every single day with
              you feels like a little celebration, and today the whole universe
              celebrates just for you. 💫
            </p>
            <br />
            <p>
              I am so deeply grateful for your smile, your laughter, your warmth
              — everything you bring into my world without even trying. Thank
              you for being you, Maitri. I promise to cherish you, celebrate
              you, and be grateful for you — every single day. 🌷
            </p>
            <br />
            <p>
              I hope this morning feels as beautiful as you are, and that this
              year becomes the most magical chapter of your life yet. You
              deserve every bit of happiness this world holds. 💖
            </p>
            <br />
            <p>
              Good morning, birthday girl. The sun rose a little brighter today
              — just for you. 🌅💕
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-surprise text-white font-bold px-8 py-3 rounded-full text-lg shadow-party cursor-pointer"
            data-ocid="surprise.close_button"
          >
            Thank you 💕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CountdownBanner() {
  const birthday = new Date("2026-03-29T00:00:00");
  const now = new Date();
  const diffMs = birthday.getTime() - now.getTime();
  const isPast = diffMs <= 0;

  if (isPast) {
    const daysSince = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return (
      <div
        className="text-center py-2 px-4 text-sm font-bold font-nunito"
        style={{
          background: "oklch(0.82 0.15 75)",
          color: "oklch(0.22 0.05 75)",
        }}
      >
        🎉 The birthday celebration is here!{" "}
        {daysSince > 0
          ? `${daysSince} days of being 19!`
          : "TODAY IS THE BIG DAY!"}{" "}
        🎉
      </div>
    );
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div
      className="text-center py-2 px-4 text-sm font-bold font-nunito"
      style={{ background: "oklch(0.45 0.18 310)", color: "white" }}
    >
      ⏰ Countdown to Maitri's Birthday:{" "}
      <span className="text-yellow-200">
        {days}d {hours}h {minutes}m
      </span>{" "}
      remaining! 🎈
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="hero-gradient relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20"
    >
      {SPARKLES.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full pointer-events-none animate-twinkle"
          style={{
            width: "6px",
            height: "6px",
            left: `${s.left}%`,
            top: `${s.top}%`,
            background: SPARKLE_BACKGROUNDS[s.bg],
            animationDelay: `${s.left * 0.05}s`,
            animationDuration: `${2 + (s.top % 3) * 0.8}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Balloon image - left */}
      <motion.div
        className="absolute left-0 bottom-10 hidden md:block"
        animate={{ y: [0, -20, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3.5,
          ease: "easeInOut",
        }}
      >
        <img
          src="/assets/generated/balloons-transparent.dim_250x350.png"
          alt="Birthday balloons"
          className="w-44 lg:w-56 opacity-90"
        />
      </motion.div>

      {/* Teddy bear - right */}
      <motion.div
        className="absolute right-4 bottom-10 hidden md:block"
        animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <img
          src="/assets/generated/teddy-bear-transparent.dim_300x300.png"
          alt="Cute teddy bear"
          className="w-40 lg:w-52 opacity-95"
        />
      </motion.div>

      {/* Mobile kawaii - teddy left */}
      <div
        className="absolute bottom-4 left-2 animate-float-bob flex items-center justify-center rounded-full"
        style={{
          width: "40px",
          height: "40px",
          background: "oklch(0.90 0.10 0 / 0.5)",
          boxShadow: "0 0 12px oklch(0.70 0.15 0 / 0.4)",
        }}
      >
        <span className="text-2xl">🧸</span>
      </div>

      {/* Mobile kawaii - bow right */}
      <div
        className="absolute bottom-4 right-2 animate-float-bob flex items-center justify-center rounded-full"
        style={{
          width: "40px",
          height: "40px",
          background: "oklch(0.88 0.08 310 / 0.5)",
          boxShadow: "0 0 12px oklch(0.65 0.14 310 / 0.4)",
          animationDelay: "0.8s",
        }}
      >
        <span className="text-2xl">🎀</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p
            className="font-dancing font-bold"
            style={{
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              color: "oklch(0.30 0.14 30)",
              textShadow:
                "0 2px 16px oklch(0.65 0.20 60 / 0.6), 0 0 30px oklch(0.80 0.18 60 / 0.4)",
              letterSpacing: "0.02em",
            }}
          >
            🌅 Good Morning,
          </p>
          <p
            className="font-dancing font-bold"
            style={{
              fontSize: "clamp(2.5rem, 9vw, 5.5rem)",
              color: "oklch(0.45 0.22 15)",
              textShadow:
                "0 2px 20px oklch(0.70 0.25 15 / 0.7), 0 0 40px oklch(0.85 0.20 15 / 0.5)",
              letterSpacing: "0.02em",
            }}
          >
            Birthday Girl! 🎀
          </p>
        </motion.div>
        <div className="text-7xl mb-4 animate-float-up">🎂</div>

        <motion.h1
          className="font-dancing leading-tight mb-4"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "oklch(0.25 0.10 310)",
            textShadow: "2px 4px 8px oklch(0.45 0.18 310 / 0.25)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Happy 19th
          <br />
          <span style={{ color: "oklch(0.45 0.18 310)" }}>Birthday,</span>
          <br />
          Maitri! 🎂
        </motion.h1>

        <motion.p
          className="text-xl font-nunito mb-2 font-semibold"
          style={{ color: "oklch(0.35 0.12 310)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          March 29th, 2026 · Born at 11:55 PM ✨
        </motion.p>

        <motion.p
          className="text-lg font-nunito mb-8"
          style={{ color: "oklch(0.40 0.10 310)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🎉 19 years of pure magic, joy, and wonder! 🎉
        </motion.p>

        <div className="flex justify-center mb-8 animate-float-bob">
          <img
            src="/assets/generated/birthday-cake-transparent.dim_300x300.png"
            alt="Birthday cake"
            className="w-36 md:w-44"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {HERO_HEARTS.map((item, idx) => (
            <span
              key={item.id}
              className="absolute text-2xl animate-heart-pulse"
              style={{
                left: `${15 + idx * 18}%`,
                top: `${70 + (idx % 2) * 15}%`,
                animationDelay: `${idx * 0.4}s`,
                opacity: 0.7,
              }}
            >
              {item.h}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const timelineItems = [
  {
    id: "tl1",
    emoji: "👶",
    year: "2007",
    age: "Born",
    title: "A Star Was Born!",
    desc: "On a beautiful day, the world became infinitely better when Maitri arrived. A tiny miracle that would change everything. 🌟",
  },
  {
    id: "tl2",
    emoji: "🌸",
    year: "2012",
    age: "Age 5",
    title: "First Adventures Begin",
    desc: "Curiosity sparkled in her eyes as she began exploring the world, one little adventure at a time. The world was her playground! 🌈",
  },
  {
    id: "tl3",
    emoji: "📚",
    year: "2017",
    age: "Age 10",
    title: "Halfway to 20!",
    desc: "A decade of pure awesomeness! Half the journey to 20, full of laughter, dreams, and growing into something extraordinary. ✨",
  },
  {
    id: "tl4",
    emoji: "🦋",
    year: "2023",
    age: "Age 16",
    title: "Wings Start to Spread",
    desc: "The butterfly phase — discovering herself, her passions, her dreams. Every day more beautiful than the last! 🌷",
  },
  {
    id: "tl5",
    emoji: "🎓",
    year: "2025",
    age: "Age 18",
    title: "Official Adult!",
    desc: "The world officially recognized what everyone already knew — Maitri is an incredible, wonderful human being! Welcome to adulthood! 🎉",
  },
  {
    id: "tl6",
    emoji: "🌟",
    year: "2026",
    age: "Age 19",
    title: "Absolutely Amazing You!",
    desc: "19 years of being perfectly, wonderfully, beautifully YOU. The best chapter yet begins today! The adventure continues! 💫",
  },
];

function TimelineSection() {
  return (
    <section id="birthday-journey" className="section-pink py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-3">🌟</div>
          <h2
            className="font-dancing text-4xl md:text-5xl mb-3"
            style={{ color: "oklch(0.25 0.10 310)" }}
          >
            Maitri's 19 Wonderful Years
          </h2>
          <p
            className="text-lg font-nunito"
            style={{ color: "oklch(0.45 0.10 310)" }}
          >
            A journey of love, laughter, and magic ✨
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -ml-px"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.75 0.15 0), oklch(0.45 0.18 310), oklch(0.82 0.15 75))",
            }}
          />

          <div className="space-y-10">
            {timelineItems.map((item, i) => (
              <motion.div
                key={item.id}
                className={`relative flex items-start gap-6 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`timeline.item.${i + 1}`}
              >
                <div
                  className="absolute left-6 md:left-1/2 w-5 h-5 rounded-full border-4 -translate-x-1/2 z-10 flex-shrink-0"
                  style={{
                    background: "oklch(0.45 0.18 310)",
                    borderColor: "oklch(0.95 0.03 310)",
                    boxShadow: "0 0 12px oklch(0.45 0.18 310 / 0.5)",
                  }}
                />
                <div className="hidden md:block w-1/2" />
                <div
                  className="timeline-card ml-14 md:ml-0 md:w-1/2 bg-white rounded-2xl p-5 border shadow-party"
                  style={{ borderColor: "oklch(0.88 0.06 310)" }}
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.65 0.14 310)" }}
                  >
                    {item.year} · {item.age}
                  </div>
                  <h3
                    className="font-nunito font-bold text-lg mb-2"
                    style={{ color: "oklch(0.25 0.10 310)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.40 0.08 310)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const messages = [
  {
    id: "msg1",
    from: "Your Love 💕",
    avatar: "💕",
    msg: "You make every single day worth celebrating. The way you smile, the way you laugh, the way you exist in this world — it's all absolutely magical. I love you more than words could ever say, Maitri. Happy birthday, my heart! 🌹",
    color: "oklch(0.88 0.08 0)",
    border: "oklch(0.75 0.15 0)",
  },
  {
    id: "msg2",
    from: "The Stars ⭐",
    avatar: "⭐",
    msg: "Even the stars shine a little brighter tonight because it's Maitri's birthday! We've been waiting 19 years to celebrate this incredible human. The whole galaxy is throwing a party in your honor. You are truly stardust turned into something extraordinary! ✨",
    color: "oklch(0.94 0.06 75)",
    border: "oklch(0.82 0.15 75)",
  },
  {
    id: "msg3",
    from: "The Universe 🌙",
    avatar: "🌙",
    msg: "The universe smiled 19 years ago when you were born. Every flower bloomed a little brighter, every river sang a little sweeter. You are a cosmic miracle, Maitri — one of the universe's greatest masterpieces. Happy birthday, beautiful soul! 🌌💫",
    color: "oklch(0.91 0.07 310)",
    border: "oklch(0.55 0.16 310)",
  },
];

function MessageWallSection() {
  return (
    <section id="message-wall" className="section-lavender py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-3">💌</div>
          <h2
            className="font-dancing text-4xl md:text-5xl mb-3"
            style={{ color: "oklch(0.25 0.10 310)" }}
          >
            Birthday Messages
          </h2>
          <p
            className="text-lg font-nunito"
            style={{ color: "oklch(0.45 0.10 310)" }}
          >
            Messages straight from the heart 💕
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              className="message-card rounded-3xl p-6 border-2"
              style={{ background: m.color, borderColor: m.border }}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              data-ocid={`messages.item.${i + 1}`}
            >
              <div className="text-5xl mb-4 text-center">{m.avatar}</div>
              <p
                className="text-sm leading-relaxed mb-4 font-nunito"
                style={{ color: "oklch(0.22 0.08 310)" }}
              >
                &quot;{m.msg}&quot;
              </p>
              <div
                className="text-sm font-bold text-right"
                style={{ color: "oklch(0.40 0.12 310)" }}
              >
                — {m.from}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MAITRISection() {
  return (
    <section
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.93 0.06 310), oklch(0.95 0.05 0), oklch(0.93 0.07 290))",
      }}
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-3">💝</div>
          <h2
            className="font-dancing text-4xl md:text-5xl mb-3"
            style={{ color: "oklch(0.25 0.10 310)" }}
          >
            What MAITRI Means
          </h2>
          <p
            className="text-lg font-nunito"
            style={{ color: "oklch(0.42 0.10 310)" }}
          >
            Every letter tells your story 🌸
          </p>
        </motion.div>

        <div className="space-y-4">
          {MAITRI_ACROSTIC.map((row, i) => (
            <motion.div
              key={row.id}
              className="flex items-center gap-5 rounded-2xl px-6 py-4 border"
              style={{
                background: "oklch(1 0 0 / 0.7)",
                borderColor: "oklch(0.80 0.12 310 / 0.4)",
                boxShadow: "0 4px 16px oklch(0.45 0.18 310 / 0.10)",
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`maitri.item.${i + 1}`}
            >
              {/* Big letter */}
              <span
                className="font-dancing font-bold flex-shrink-0 leading-none"
                style={{
                  fontSize: "3.5rem",
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.22 0), oklch(0.45 0.18 310))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  minWidth: "2.8rem",
                  textAlign: "center",
                }}
              >
                {row.letter}
              </span>
              {/* Meaning */}
              <p
                className="font-nunito font-semibold text-base leading-snug flex-1"
                style={{ color: "oklch(0.28 0.10 310)" }}
              >
                {row.meaning}
              </p>
              {/* Emoji accent */}
              <span className="text-2xl flex-shrink-0 animate-heart-pulse">
                {row.emoji}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CAFinalistSection() {
  return (
    <section
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.96 0.06 75), oklch(0.93 0.05 50))",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="relative rounded-3xl p-8 md:p-12 text-center overflow-hidden border-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.98 0.04 75), oklch(0.95 0.08 55))",
            borderColor: "oklch(0.75 0.18 65)",
            boxShadow:
              "0 20px 60px oklch(0.65 0.20 65 / 0.25), 0 0 40px oklch(0.82 0.15 75 / 0.3)",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          data-ocid="ca-finalist.card"
        >
          <span className="absolute top-4 left-4 text-3xl opacity-40">🏆</span>
          <span className="absolute top-4 right-4 text-3xl opacity-40">🏆</span>
          <span className="absolute bottom-4 left-4 text-2xl opacity-30">
            ✨
          </span>
          <span className="absolute bottom-4 right-4 text-2xl opacity-30">
            ✨
          </span>

          <div className="text-6xl mb-4 animate-float-up">🏆</div>

          <motion.div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold font-nunito mb-4 uppercase tracking-widest"
            style={{
              background: "oklch(0.72 0.18 65)",
              color: "white",
              boxShadow: "0 4px 14px oklch(0.65 0.20 65 / 0.4)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            ⭐ Special Achievement ⭐
          </motion.div>

          <motion.h2
            className="font-dancing mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.30 0.14 55)",
              textShadow: "1px 2px 6px oklch(0.72 0.18 65 / 0.3)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Congratulations, CA Finalist! 🎓
          </motion.h2>

          <motion.p
            className="text-lg font-nunito font-semibold mb-4"
            style={{ color: "oklch(0.42 0.14 60)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Maitri, you did it! Becoming a CA Finalist is an extraordinary
            achievement! 🌟
          </motion.p>

          <motion.p
            className="text-base leading-relaxed font-nunito max-w-xl mx-auto mb-6"
            style={{ color: "oklch(0.35 0.10 55)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            All those late nights studying, every sacrifice, every ounce of
            determination — it all led to this incredible moment. You have
            proven that your hard work, brilliance, and perseverance can conquer
            anything. We are SO incredibly proud of you! This is just the
            beginning of your amazing journey. 💛✨
          </motion.p>

          <motion.div
            className="flex justify-center gap-3 text-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            {["🏆", "🎓", "✨", "💛", "🌟", "🎉", "💪"].map((emoji, i) => (
              <span
                key={emoji}
                className="animate-float-up"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const funFacts = [
  {
    id: "ff1",
    emoji: "📅",
    fact: "You've been alive for approximately 6,940 wonderful days! Each one a blessing!",
  },
  {
    id: "ff2",
    emoji: "💨",
    fact: "You've taken roughly 178,000,000 breaths in your life — and each one is precious! 🌬️",
  },
  {
    id: "ff3",
    emoji: "💤",
    fact: "You've slept for about 55,000 hours — sweet dreams, you deserved every one! 😴",
  },
  {
    id: "ff4",
    emoji: "😄",
    fact: "You are officially the most awesome 19-year-old on the entire planet! (It's a fact!)",
  },
  {
    id: "ff5",
    emoji: "🧠",
    fact: "Your brain has made approximately 100 trillion synaptic connections — you're literally a genius! ✨",
  },
  {
    id: "ff6",
    emoji: "❤️",
    fact: "Your heart has beaten over 745 million times — every beat full of love and life! 💓",
  },
  {
    id: "ff7",
    emoji: "🌟",
    fact: "You are 1 in 8 billion — completely unique, completely irreplaceable, completely wonderful!",
  },
  {
    id: "ff8",
    emoji: "🎊",
    fact: "At 19, you're old enough to be amazing and young enough to conquer the world! Go get it!",
  },
];

function FunFactsSection() {
  return (
    <section id="fun-facts" className="section-pink py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-3">🤩</div>
          <h2
            className="font-dancing text-4xl md:text-5xl mb-3"
            style={{ color: "oklch(0.25 0.10 310)" }}
          >
            Fun Facts About Turning 19
          </h2>
          <p
            className="text-lg font-nunito"
            style={{ color: "oklch(0.45 0.10 310)" }}
          >
            Because 19 is an absolutely magical number! 🎉
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {funFacts.map((f, i) => (
            <motion.div
              key={f.id}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 border shadow-xs"
              style={{ borderColor: "oklch(0.88 0.06 310)" }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              data-ocid={`facts.item.${i + 1}`}
            >
              <span className="text-3xl flex-shrink-0">{f.emoji}</span>
              <p
                className="text-sm leading-relaxed font-nunito font-medium"
                style={{ color: "oklch(0.30 0.08 310)" }}
              >
                {f.fact}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonsSection() {
  const reasons = [
    { n: 1, emoji: "🌸", text: "Your smile lights up any room" },
    { n: 2, emoji: "💫", text: "You chase dreams without fear" },
    { n: 3, emoji: "🎓", text: "You earned your CA Finalist badge" },
    { n: 4, emoji: "💖", text: "You love deeply and genuinely" },
    { n: 5, emoji: "🌙", text: "You make the ordinary magical" },
    { n: 6, emoji: "✨", text: "Your laugh is pure medicine" },
    { n: 7, emoji: "🦋", text: "You grow more beautiful every year" },
    { n: 8, emoji: "🎵", text: "You fill life with music and joy" },
    { n: 9, emoji: "💡", text: "You are brilliantly smart" },
    { n: 10, emoji: "🌺", text: "You bloom even in hard times" },
    { n: 11, emoji: "🤗", text: "Your hugs feel like home" },
    { n: 12, emoji: "💪", text: "You are stronger than you know" },
    { n: 13, emoji: "🌈", text: "You bring color to every day" },
    { n: 14, emoji: "🎀", text: "You have the most adorable heart" },
    { n: 15, emoji: "🍰", text: "You make every celebration sweeter" },
    { n: 16, emoji: "🌟", text: "You inspire everyone around you" },
    { n: 17, emoji: "💌", text: "You give the most thoughtful love" },
    { n: 18, emoji: "🪐", text: "You are literally out of this world" },
    { n: 19, emoji: "🎂", text: "You turn 19 and still perfect!" },
  ];

  return (
    <section
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.94 0.05 310), oklch(0.96 0.04 0), oklch(0.94 0.06 290))",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="text-5xl mb-3">🌟</div>
          <h2
            className="font-dancing mb-2"
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              color: "oklch(0.30 0.14 310)",
              textShadow: "1px 2px 6px oklch(0.50 0.15 310 / 0.2)",
            }}
          >
            19 Reasons You're Amazing
          </h2>
          <p
            className="font-nunito text-base"
            style={{ color: "oklch(0.45 0.10 310)" }}
          >
            Because 19 is your magic number ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl p-3 flex flex-col items-start gap-1 shadow-party"
              style={{
                background: "oklch(1.0 0.0 0 / 0.72)",
                backdropFilter: "blur(6px)",
                border: "1px solid oklch(0.88 0.06 310 / 0.4)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full flex items-center justify-center text-xs font-bold font-nunito"
                  style={{
                    minWidth: "22px",
                    height: "22px",
                    background:
                      "linear-gradient(135deg, oklch(0.70 0.18 310), oklch(0.65 0.20 0))",
                    color: "white",
                    padding: "0 4px",
                  }}
                >
                  {r.n}
                </span>
                <span className="text-xl">{r.emoji}</span>
              </div>
              <p
                className="font-nunito text-xs leading-snug"
                style={{ color: "oklch(0.30 0.10 310)" }}
              >
                {r.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Universe Was Waiting Section ────────────────────────────────────────────
const UNIVERSE_PLANETS = [
  { color: "#c084fc", size: 14, orbit: 80, duration: 8 },
  { color: "#60a5fa", size: 10, orbit: 115, duration: 13 },
  { color: "#f9a8d4", size: 13, orbit: 150, duration: 18 },
  { color: "#86efac", size: 9, orbit: 185, duration: 24 },
  { color: "#fde68a", size: 11, orbit: 218, duration: 31 },
];

function UniverseWaitingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = Array.from({ length: 150 }, () => {
      const palette = ["#ffffff", "#fffde7", "#fce4ec", "#e8eaf6", "#f3e5f5"];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });

    let raf: number;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1) s.speed = -Math.abs(s.speed);
        if (s.alpha < 0) s.speed = Math.abs(s.speed);
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{
        minHeight: 500,
        background:
          "linear-gradient(180deg, oklch(0.08 0.06 280), oklch(0.12 0.10 310), oklch(0.08 0.06 280))",
      }}
    >
      <style>{`
        @keyframes universeOrbit {
          from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }
      `}</style>

      {/* Starfield */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Central glowing star */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #fff9c4 0%, #fbbf24 60%, transparent 100%)",
          boxShadow:
            "0 0 40px 18px rgba(251,191,36,0.45), 0 0 80px 36px rgba(251,191,36,0.18)",
          zIndex: 2,
        }}
      />

      {/* Orbiting planets */}
      {UNIVERSE_PLANETS.map((p) => (
        <div
          key={`planet-${p.orbit}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 10px 4px ${p.color}88`,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            // @ts-expect-error CSS variable
            "--orbit-r": `${p.orbit}px`,
            animation: `universeOrbit ${p.duration}s linear infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Orbit rings */}
      {UNIVERSE_PLANETS.map((p) => (
        <div
          key={`ring-${p.orbit}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: p.orbit * 2,
            height: p.orbit * 2,
            marginLeft: -p.orbit,
            marginTop: -p.orbit,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            zIndex: 1,
          }}
        />
      ))}

      {/* Text content */}
      <div
        className="relative text-center max-w-2xl mx-auto"
        style={{ zIndex: 10, paddingTop: "280px" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "#fff",
            textShadow:
              "0 0 30px rgba(240,180,255,0.9), 0 0 60px rgba(200,130,255,0.5)",
            marginBottom: "0.75rem",
          }}
        >
          ✦ The Universe Was Waiting ✦
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "1rem",
            color: "oklch(0.78 0.08 280)",
            marginBottom: "2rem",
          }}
        >
          Every star aligned, every planet held its breath...
        </motion.p>

        {/* Planet cards */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {[
            { icon: "🪐", text: "Every planet paused in its orbit" },
            { icon: "⭐", text: "Every star saved its brightest light" },
            { icon: "🌙", text: "The universe whispered her name" },
          ].map((card) => (
            <motion.div
              key={card.icon}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(200,150,255,0.35)",
                borderRadius: "1rem",
                padding: "1rem 1.25rem",
                boxShadow: "0 0 20px rgba(180,100,255,0.2)",
                flex: 1,
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
                {card.icon}
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "Nunito,sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(1.1rem, 3.5vw, 1.35rem)",
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 0 20px rgba(255,220,255,0.5)",
            fontStyle: "italic",
            lineHeight: 1.7,
            marginBottom: "1.25rem",
          }}
        >
          "On March 29th, 2007 — at 11:55 PM, when the night was nearly over —
          the universe finally exhaled. Maitri had arrived."
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.9rem",
            color: "oklch(0.72 0.06 280)",
          }}
        >
          The stars had been counting down to 11:55 PM their whole lives. 🌌
        </motion.p>
      </div>
    </section>
  );
}

function PoemSection() {
  return (
    <section className="py-20 px-4">
      <div
        className="max-w-lg mx-auto rounded-3xl p-8 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.25 0.12 310), oklch(0.20 0.10 290))",
          boxShadow: "0 0 60px oklch(0.55 0.18 310 / 0.4)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-4xl mb-4">✨</div>
          <p
            className="font-dancing mb-4 leading-relaxed"
            style={{ fontSize: "1.5rem", color: "oklch(0.96 0.02 310)" }}
          >
            Like the moon needs the stars,
            <br />
            Like the sun needs the sky,
            <br />I needed someone like you
            <br />
            to remind me how to fly.
          </p>
          <p
            className="font-dancing leading-relaxed"
            style={{ fontSize: "1.5rem", color: "oklch(0.96 0.02 310)" }}
          >
            Happy 19th Birthday,
            <br />
            you beautiful soul —
            <br />
            the universe planted you here
            <br />
            to make every heart whole.
          </p>
          <div className="text-3xl mt-4">💕</div>
        </motion.div>
      </div>
    </section>
  );
}

function SurpriseButtonSection({ onSurprise }: { onSurprise: () => void }) {
  return (
    <section
      className="py-20 px-4 text-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.93 0.06 310), oklch(0.90 0.08 0), oklch(0.93 0.06 310))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-5xl mb-4">🎁</div>
        <h2
          className="font-dancing text-3xl md:text-4xl mb-3"
          style={{ color: "oklch(0.25 0.10 310)" }}
        >
          One More Special Surprise!
        </h2>
        <p
          className="text-lg font-nunito mb-8"
          style={{ color: "oklch(0.40 0.10 310)" }}
        >
          A little something extra, just for you ✨
        </p>
        <motion.button
          type="button"
          onClick={onSurprise}
          className="btn-surprise text-white font-bold px-10 py-4 rounded-full text-xl shadow-party cursor-pointer"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
          data-ocid="surprise.primary_button"
        >
          🎁 Open Your Surprise!
        </motion.button>
      </motion.div>
    </section>
  );
}

function Header({ onNavClick }: { onNavClick: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.95 0.04 5 / 0.95)"
          : "oklch(0.95 0.04 5 / 0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: scrolled ? "0 2px 20px oklch(0.45 0.18 310 / 0.15)" : "none",
        borderBottom: "1px solid oklch(0.85 0.06 310 / 0.5)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="font-dancing text-xl md:text-2xl font-bold"
          style={{ color: "oklch(0.45 0.18 310)" }}
        >
          Happy 19th Maitri! ✨
        </div>
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold font-nunito transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ color: "oklch(0.35 0.14 310)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "oklch(0.45 0.18 310)";
                (e.target as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
                (e.target as HTMLButtonElement).style.color =
                  "oklch(0.35 0.14 310)";
              }}
              data-ocid={`nav.${item.id}.link`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ─── End of Day Section ───────────────────────────────────────────────────────
function EndOfDaySection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
    }));

    let raf: number;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1) s.speed = -Math.abs(s.speed);
        if (s.alpha < 0) s.speed = Math.abs(s.speed);
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.fillStyle = "#e8d5ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.08 290), oklch(0.10 0.06 270), oklch(0.16 0.10 310))",
        minHeight: 480,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div
        className="relative text-center max-w-xl mx-auto"
        style={{ zIndex: 10 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            textShadow: "0 0 40px rgba(200,180,255,0.8)",
            display: "inline-block",
          }}
        >
          🌙
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            color: "rgba(255,240,255,0.95)",
            textShadow: "0 0 24px rgba(220,180,255,0.7)",
            marginBottom: "2rem",
          }}
        >
          As this beautiful day ends...
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
            color: "rgba(225,210,255,0.9)",
            lineHeight: 1.85,
            textAlign: "left",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(200,160,255,0.2)",
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 0 50px rgba(160,100,255,0.15)",
          }}
        >
          <p style={{ marginBottom: "1.1rem" }}>
            <strong style={{ color: "rgba(255,220,255,0.95)" }}>Maitri,</strong>
          </p>
          <p style={{ marginBottom: "1.1rem" }}>
            Somewhere between midnight and morning on March 29th — at exactly{" "}
            <em>11:55 PM</em> — the world became a little more magical when you
            entered it.
          </p>
          <p style={{ marginBottom: "1.1rem" }}>
            Today, 19 years later, we've laughed, celebrated, wished, and
            marveled at everything you are. And now, as the stars come out and
            this beautiful birthday day fades into night...
          </p>
          <p style={{ marginBottom: "1.1rem" }}>
            I want you to know —{" "}
            <em>you are loved beyond what words can hold.</em>
            <br />
            Not just today. Every day. Every quiet night. Every ordinary
            morning.
          </p>
          <p style={{ marginBottom: "1.1rem" }}>
            Sleep well, birthday girl. The universe smiles every time you close
            your eyes. 🌙💕
          </p>
          <p
            style={{
              marginTop: "1.5rem",
              color: "rgba(255,220,200,0.8)",
              fontStyle: "italic",
            }}
          >
            — Always yours 🌟
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          style={{
            marginTop: "2rem",
            fontSize: "2rem",
            letterSpacing: "0.5rem",
          }}
        >
          {["✨", "🌙", "⭐", "💫"].map((em) => (
            <span
              key={em}
              style={{
                display: "inline-block",
                animation: "pulse 2s ease-in-out infinite alternate",
              }}
            >
              {em}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.09 310), oklch(0.35 0.14 310))",
      }}
    >
      <div className="text-5xl mb-4 animate-heart-pulse">💕</div>
      <h3
        className="font-dancing text-3xl mb-3"
        style={{ color: "oklch(0.92 0.06 310)" }}
      >
        Happy 19th Birthday, Maitri!
      </h3>
      <p
        className="text-lg mb-2 font-nunito font-medium"
        style={{ color: "oklch(0.85 0.08 310)" }}
      >
        🎉 Made with all the love in the universe, just for you! 🎉
      </p>
      <p
        className="text-sm mb-6 font-nunito"
        style={{ color: "oklch(0.72 0.08 310)" }}
      >
        March 29th, 2026 · A day the world became even more beautiful ✨
      </p>
      <div className="flex justify-center gap-4 text-3xl mb-6">
        {FOOTER_EMOJIS.map((item, i) => (
          <span
            key={item.id}
            className="animate-float-up"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {item.e}
          </span>
        ))}
      </div>
      <p
        className="text-xs font-nunito"
        style={{ color: "oklch(0.60 0.06 310)" }}
      >
        © {year}. Built with{" "}
        <span className="animate-heart-pulse inline-block">❤️</span> using{" "}
        <a
          href={caffeineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.72 0.12 310)" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => new Date() >= new Date("2026-03-29T00:00:00"),
  );
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  }

  function openSurprise() {
    setSurpriseOpen(true);
    setConfettiActive(true);
  }

  function closeSurprise() {
    setSurpriseOpen(false);
    setConfettiActive(false);
  }

  function scrollToSection(id: string) {
    if (id === "surprise") {
      openSurprise();
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!unlocked) {
    return <CountdownPage onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="relative min-h-screen">
      {DECORATIONS.map((d) => (
        <span
          key={d.emoji}
          className="floating-deco"
          style={{
            left: d.left,
            top: d.top,
            fontSize: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: 0.6,
          }}
        >
          {d.emoji}
        </span>
      ))}

      <ConfettiCanvas active={confettiActive} />

      <div className="fixed top-0 left-0 right-0 z-40">
        <CountdownBanner />
      </div>

      <div className="fixed left-0 right-0 z-50" style={{ top: "2rem" }}>
        <Header onNavClick={scrollToSection} />
      </div>

      <main style={{ paddingTop: "7rem" }}>
        <HeroSection />
        <TimelineSection />
        <MessageWallSection />
        <MAITRISection />
        <ReasonsSection />
        <UniverseWaitingSection />
        <CAFinalistSection />
        <FunFactsSection />
        <PoemSection />
        <SurpriseButtonSection onSurprise={openSurprise} />
        <EndOfDaySection />
      </main>

      <Footer />

      {surpriseOpen && <SurpriseModal onClose={closeSurprise} />}

      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/assets/tum_hi_ho_aashiqui_2_arijit_singh_instrumental_with_lyrics_hd_heart_touching_-_320_kbps-019d307b-eeaa-7329-8fc1-614cb8d38bc7.mp3"
        loop
        preload="auto"
      >
        <track kind="captions" />
      </audio>

      {/* Music Toggle Button */}
      <button
        type="button"
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          background: "linear-gradient(135deg, #ff6eb4, #c77dff)",
          border: "none",
          borderRadius: "50%",
          width: "3.2rem",
          height: "3.2rem",
          fontSize: "1.4rem",
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(255,110,180,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={musicPlaying ? "Pause Music" : "Play Music"}
      >
        {musicPlaying ? "🎵" : "🔇"}
      </button>
    </div>
  );
}
