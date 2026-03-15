import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Brain, FileText, Puzzle, Mic2, Trophy,
  Sparkles, ArrowRight, GraduationCap, Zap
} from "lucide-react";

// ── Design tokens matched to app's index.css ────────────────────────────
const C = {
  bg:       "#F8F7FF",          // near-white with subtle purple tint
  bgCard:   "rgba(255,255,255,0.72)",
  primary:  "#6366F1",          // indigo-500, matches hsl(234 89% 60%)
  primaryDark: "#4F46E5",       // indigo-600
  purple:   "#7C3AED",          // violet-600
  muted:    "#8B8FA8",
  border:   "rgba(99,102,241,0.15)",
  glow:     "rgba(99,102,241,0.25)",
};

// ── Milestone definitions ────────────────────────────────────────────────
const MILESTONES = [
  { icon: Brain,    label: "Learn Skills",    sub: "DSA & Core Subjects"  },
  { icon: FileText, label: "Build Resume",    sub: "AI-Powered Analyzer"  },
  { icon: Puzzle,   label: "Practice Tests",  sub: "Aptitude & Reasoning" },
  { icon: Mic2,     label: "Mock Interviews", sub: "Real Company Style"   },
  { icon: Trophy,   label: "Get Placed",      sub: "Your Dream Company"   },
];

// ── Canvas particle background ───────────────────────────────────────────
const ParticleCanvas = ({ progress }: { progress: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    type P = { x:number; y:number; vx:number; vy:number; r:number; alpha:number; phase:number };
    const particles: P[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pulse = Math.sin(t + p.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha * pulse})`;
        ctx.fill();
      });

      // soft connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist/110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

// ── Main Booting Animation ───────────────────────────────────────────────
const BootingAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress]     = useState(0);
  const [textIdx, setTextIdx]       = useState(0);
  const [showFinal, setShowFinal]   = useState(false);

  const texts = [
    { line: "Every journey starts", sub: "with a single step." },
    { line: "Building your skills,",  sub: "laying the foundation." },
    { line: "Crafting your story,",   sub: "your resume speaks first." },
    { line: "Sharpening your mind,",  sub: "practice makes perfect." },
    { line: "You're ready.",          sub: "Your dream company awaits. 🎓" },
  ];

  useEffect(() => {
    const obj = { p: 0 };
    const tl = gsap.timeline({
      onUpdate() {
        const p = Math.min(obj.p, 1);
        setProgress(p);
        const idx = Math.min(Math.floor(p * texts.length), texts.length - 1);
        setTextIdx(idx);
        if (p >= 0.99) setShowFinal(true);
      },
      onComplete() {
        setTimeout(onComplete, 1100);
      },
    });
    tl.to(obj, { p: 1, duration: 4.5, ease: "power1.inOut" });
    return () => { tl.kill(); };
  }, [onComplete]);

  const pct = Math.round(progress * 100);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        background: `linear-gradient(145deg, #F5F3FF 0%, #FAFAFF 40%, #EEF2FF 100%)`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)" }}
        />
      </div>

      {/* Particle canvas */}
      <ParticleCanvas progress={progress} />

      {/* UI Layer */}
      <div className="relative z-10 flex flex-col h-full px-8 py-8 md:px-14 md:py-10 max-w-7xl mx-auto">

        {/* ── Top nav ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.purple})` }}
            >
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-base tracking-tight">PlacePrep</span>
            <span
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: C.primary,
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              AI-Powered
            </span>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 text-xs font-semibold opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: C.primaryDark }}
          >
            Skip Intro <ArrowRight size={12} />
          </button>
        </motion.div>

        {/* ── Center hero ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">

          {/* Sparkle icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 18 }}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.18)",
                color: C.primary,
              }}
            >
              <Sparkles size={14} />
              Smart Placement Preparation
            </motion.div>
          </motion.div>

          {/* Dynamic text */}
          <div className="text-center max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={textIdx}
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1,  y: 0,  filter: "blur(0px)" }}
                exit={   { opacity: 0,  y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.4,0,0.2,1] }}
              >
                <h1
                  className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-2"
                  style={{
                    background: `linear-gradient(135deg, #3730A3 0%, ${C.primary} 45%, ${C.purple} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {texts[textIdx].line}
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium">
                  {texts[textIdx].sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Milestone cards ──────────────────────────────── */}
          <div className="w-full max-w-3xl">
            {/* Connecting line */}
            <div className="relative mb-4">
              <div
                className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2"
                style={{ background: "rgba(99,102,241,0.1)" }}
              />
              <motion.div
                className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${C.primary}, ${C.purple})`,
                  boxShadow: `0 0 8px ${C.glow}`,
                }}
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {MILESTONES.map((m, i) => {
                const threshold = (i + 1) / MILESTONES.length;
                const done = progress >= threshold;
                const active = progress >= threshold - 0.19 && !done;
                const Icon = m.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: [0.4,0,0.2,1] }}
                    className="flex flex-col items-center gap-2.5"
                  >
                    {/* Node */}
                    <motion.div
                      animate={done ? {
                        scale: [1, 1.18, 1],
                        boxShadow: [
                          `0 0 0 0 rgba(99,102,241,0)`,
                          `0 0 0 8px rgba(99,102,241,0.15)`,
                          `0 0 0 0 rgba(99,102,241,0)`,
                        ],
                      } : {}}
                      transition={{ duration: 0.6, repeat: done ? Infinity : 0, repeatDelay: 2 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500"
                      style={{
                        background: done
                          ? `linear-gradient(135deg, ${C.primary}, ${C.purple})`
                          : active
                          ? "rgba(99,102,241,0.12)"
                          : "rgba(255,255,255,0.7)",
                        border: done
                          ? "none"
                          : active
                          ? `1.5px solid ${C.primary}`
                          : "1.5px solid rgba(99,102,241,0.15)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Icon
                        size={20}
                        style={{
                          color: done ? "#fff" : active ? C.primary : "#C4C6D8",
                          transition: "color 0.4s",
                        }}
                      />
                    </motion.div>
                    {/* Label */}
                    <div className="text-center">
                      <p
                        className="text-[11px] font-semibold leading-tight"
                        style={{ color: done ? C.primaryDark : active ? C.primary : "#B0B4CC" }}
                      >
                        {m.label}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5 leading-tight hidden md:block">
                        {m.sub}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Final celebration */}
          <AnimatePresence>
            {showFinal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
                style={{
                  background: "linear-gradient(145deg, rgba(245,243,255,0.95) 0%, rgba(238,242,255,0.97) 100%)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, delay: 0.3, repeat: 2 }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary} 0%, ${C.purple} 100%)`,
                    boxShadow: `0 24px 64px rgba(99,102,241,0.45)`,
                  }}
                >
                  <Trophy size={44} className="text-white" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-5xl md:text-6xl font-black tracking-tight text-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, #3730A3, ${C.primary}, ${C.purple})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Track Your Readiness
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 text-lg font-medium text-center max-w-md"
                >
                  with Intelligence
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65, type: "spring" }}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.purple})` }}
                >
                  <Zap size={14} />
                  Launching PlacePrep...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom progress ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between items-center mb-1">
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] flex items-center gap-1.5"
              style={{ color: C.primary }}
            >
              <Sparkles size={9} />
              Syncing Your Journey
            </span>
            <span
              className={`text-[10px] font-mono font-semibold tracking-widest uppercase transition-colors duration-500`}
              style={{ color: pct >= 100 ? C.purple : C.muted }}
            >
              {pct}%
            </span>
          </div>

          {/* Track */}
          <div
            className="w-full rounded-full overflow-hidden relative"
            style={{ height: "3px", background: "rgba(99,102,241,0.1)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${C.primary}, ${C.purple})`,
                boxShadow: `0 0 16px rgba(99,102,241,0.45)`,
              }}
            />
            {/* shimmer */}
            {pct < 100 && (
              <motion.div
                animate={{ left: [`${Math.max(0, pct - 12)}%`, `${pct}%`] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 w-12 rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BootingAnimation;
