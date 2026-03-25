import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Countdown Gate ──────────────────────────────────────────────────────────

const BIRTHDAY_DATE = new Date("2026-03-29T00:00:00");

const BURST_PARTICLES = [
  { id: "bp1", emoji: "🎈", tx: -120, ty: -180 },
  { id: "bp2", emoji: "🎊", tx: 130, ty: -160 },
  { emoji: "✨", tx: -80, ty: -200 },
  { emoji: "💕", tx: 90, ty: -190 },
  { emoji: "🎉", tx: -150, ty: -100 },
  { emoji: "🌟", tx: 140, ty: -110 },
  { emoji: "🎈", tx: 50, ty: -200 },
  { emoji: "💖", tx: -50, ty: -180 },
  { emoji: "🎊", tx: -130, ty: -70 },
  { emoji: "✨", tx: 120, ty: -70 },
  { emoji: "🌸", tx: -20, ty: -220 },
  { emoji: "🎂", tx: 20, ty: -215 },
];

const GATE_SPARKLES = [
  { id: "gs1", left: 6, top: 8, dur: 2.4, delay: 0 },
  { id: "gs2", left: 18, top: 22, dur: 3.1, delay: 0.4 },
  { id: "gs3", left: 32, top: 5, dur: 2.8, delay: 0.8 },
  { id: "gs4", left: 47, top: 15, dur: 3.5, delay: 0.2 },
  { id: "gs5", left: 61, top: 7, dur: 2.6, delay: 1.0 },
  { id: "gs6", left: 75, top: 20, dur: 3.2, delay: 0.6 },
  { id: "gs7", left: 88, top: 10, dur: 2.9, delay: 1.4 },
  { id: "gs8", left: 12, top: 48, dur: 3.4, delay: 0.3 },
  { id: "gs9", left: 28, top: 60, dur: 2.7, delay: 0.9 },
  { id: "gs10", left: 52, top: 52, dur: 3.0, delay: 1.2 },
  { id: "gs11", left: 70, top: 65, dur: 2.5, delay: 0.7 },
  { id: "gs12", left: 84, top: 55, dur: 3.3, delay: 0.1 },
  { id: "gs13", left: 95, top: 42, dur: 2.8, delay: 1.6 },
  { id: "gs14", left: 9, top: 78, dur: 3.1, delay: 0.5 },
  { id: "gs15", left: 38, top: 85, dur: 2.6, delay: 1.1 },
  { id: "gs16", left: 58, top: 90, dur: 3.4, delay: 0.8 },
  { id: "gs17", left: 76, top: 82, dur: 2.9, delay: 0.2 },
  { id: "gs18", left: 92, top: 75, dur: 3.0, delay: 1.3 },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diffMs = target.getTime() - now.getTime();
  const past = diffMs <= 0;
  const days = past ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = past
    ? 0
    : Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = past
    ? 0
    : Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = past ? 0 : Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, past, now };
}

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background: "oklch(0.25 0.12 310 / 0.7)",
        border: "1px solid oklch(0.45 0.18 310 / 0.5)",
        borderRadius: "1rem",
        padding: "1rem 1.5rem",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px oklch(0.45 0.18 310 / 0.3)",
        minWidth: "5rem",
        textAlign: "center",
      }}
    >
      <div
        className="font-dancing"
        style={{
          fontSize: "clamp(3rem, 10vw, 5rem)",
          color: "oklch(0.95 0.06 310)",
          lineHeight: 1,
          textShadow: "0 0 20px oklch(0.65 0.18 310 / 0.6)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className="font-nunito"
        style={{
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "oklch(0.75 0.10 310)",
          marginTop: "0.35rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CountdownGate() {
  const { days, hours, minutes, seconds } = useCountdown(BIRTHDAY_DATE);
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowParticles(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center"
      style={{
        zIndex: 9999,
        background:
          "linear-gradient(135deg, oklch(0.15 0.12 310), oklch(0.22 0.09 310), oklch(0.15 0.12 0))",
      }}
      data-ocid="countdown.panel"
    >
      {/* Background floating sparkles */}
      {GATE_SPARKLES.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full pointer-events-none animate-float-star"
          style={{
            width: "5px",
            height: "5px",
            left: `${s.left}%`,
            top: `${s.top}%`,
            background: "oklch(0.85 0.12 310)",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Particle burst on mount */}
      {showParticles &&
        BURST_PARTICLES.map((p, i) => (
          <span
            key={p.id}
            className="pop-particle"
            style={{
              // @ts-expect-error css custom props
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              animationDelay: `${i * 0.06}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}

      {/* Main card */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 py-8 max-w-xl w-full"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        {/* Animated cake */}
        <motion.div
          className="text-6xl mb-2"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
        >
          🎂
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-dancing text-center mb-1"
          style={{
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            color: "oklch(0.92 0.08 310)",
            textShadow: "0 0 30px oklch(0.65 0.18 310 / 0.5)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Maitri's 19th Birthday
        </motion.h1>

        <motion.p
          className="font-nunito text-center mb-6"
          style={{
            fontSize: "clamp(0.95rem, 3vw, 1.15rem)",
            color: "oklch(0.78 0.12 310)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Get ready for something special! 🎂
        </motion.p>

        {/* Countdown grid — 2×2 on mobile, 4 in a row on md+ */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7 w-full justify-items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <CountdownBox value={days} label="Days" />
          <CountdownBox value={hours} label="Hours" />
          <CountdownBox value={minutes} label="Minutes" />
          <CountdownBox value={seconds} label="Seconds" />
        </motion.div>

        {/* Birth details */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div
            className="inline-flex flex-col items-center gap-1 rounded-2xl px-6 py-4"
            style={{
              background: "oklch(0.22 0.10 310 / 0.6)",
              border: "1px solid oklch(0.40 0.14 310 / 0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="text-2xl">🌙</span>
            <p
              className="font-dancing"
              style={{
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                color: "oklch(0.88 0.08 310)",
              }}
            >
              Born at 11:55 PM · March 29, 2007
            </p>
            <p
              className="font-nunito"
              style={{
                fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                color: "oklch(0.68 0.10 310)",
              }}
            >
              19 years of pure magic ✨ · Aries Sun 🐏 · Spring Baby 🌸
            </p>
            <p
              className="font-nunito mt-1"
              style={{
                fontSize: "clamp(0.75rem, 2vw, 0.88rem)",
                color: "oklch(0.60 0.08 310)",
              }}
            >
              She arrived just 5 minutes before midnight — a mystery wrapped in
              starlight 💫
            </p>
          </div>
        </motion.div>

        {/* Floating emojis below */}
        <motion.div
          className="flex gap-4 mt-6 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { id: "fe-a", e: "🎈" },
            { id: "fe-b", e: "💕" },
            { id: "fe-c", e: "🌟" },
            { id: "fe-d", e: "🎊" },
            { id: "fe-e", e: "💖" },
            { id: "fe-f", e: "🎀" },
          ].map(({ id: eid, e }, i) => (
            <span
              key={eid}
              className="animate-float-up"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {e}
            </span>
          ))}
        </motion.div>
      </motion.div>
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

    pieces.current = Array.from({ length: 120 }, () => ({
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

          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            🎉
          </motion.div>

          <h2
            className="font-dancing text-4xl mb-2"
            style={{ color: "oklch(0.45 0.18 310)" }}
          >
            Surprise, Maitri!
          </h2>
          <div className="text-3xl mb-6 animate-heart-pulse">💕💕💕</div>

          <p
            className="text-base leading-relaxed mb-6 font-nunito"
            style={{ color: "oklch(0.25 0.10 310)", fontSize: "1.05rem" }}
          >
            Maitri, you are the most wonderful person in the world. Every single
            day with you is a precious gift that I treasure deeply. Today, on
            your{" "}
            <strong style={{ color: "oklch(0.45 0.18 310)" }}>
              19th birthday
            </strong>
            , I want you to know just how <em>deeply</em> you are loved. 🌸
          </p>
          <p
            className="text-base leading-relaxed mb-8 font-nunito"
            style={{ color: "oklch(0.25 0.10 310)", fontSize: "1.05rem" }}
          >
            May this year bring you endless joy, mountains of laughter, and all
            the happiness you deserve! You deserve the entire universe and more.
            Happy Birthday, my love! 🎂✨
          </p>

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

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          className="text-7xl mb-4"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
        >
          🎂
        </motion.div>

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
          March 29th, 2026 ✨
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

        <motion.div
          className="flex justify-center mb-8"
          animate={{ y: [0, -12, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <img
            src="/assets/generated/birthday-cake-transparent.dim_300x300.png"
            alt="Birthday cake"
            className="w-36 md:w-44"
          />
        </motion.div>

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
                "{m.msg}"
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

          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
          >
            🏆
          </motion.div>

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
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const { past: isBirthdayTime, now } = useCountdown(BIRTHDAY_DATE);

  // Keep `now` used so lint doesn't complain — it drives countdown re-renders
  void now;

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

  if (!isBirthdayTime) {
    return <CountdownGate />;
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
        <CAFinalistSection />
        <FunFactsSection />
        <SurpriseButtonSection onSurprise={openSurprise} />
      </main>

      <Footer />

      {surpriseOpen && <SurpriseModal onClose={closeSurprise} />}
    </div>
  );
}
