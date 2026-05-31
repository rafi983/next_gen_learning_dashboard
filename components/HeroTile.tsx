"use client";

import { motion } from "framer-motion";
import { Flame, CalendarDays, TrendingUp } from "lucide-react";

// hardcoded for now, swap out once auth is wired up
const STREAK = 14;
const NAME = "Alex";

export default function HeroTile() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      whileHover={{
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="grain relative rounded-xl p-6 md:p-8 flex flex-col justify-between overflow-hidden isolate"
      style={{
        background: "linear-gradient(145deg, #0d0f1c 0%, #111426 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: 200,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(59,130,246,0.11) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.08) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={12} className="text-slate-600" />
          <span className="text-xs text-slate-600 tracking-wide">{today}</span>
        </div>
        <h1 className="text-2xl md:text-[1.75rem] font-semibold leading-tight text-slate-100">
          Welcome back, {NAME} 👋
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
          You&apos;re {STREAK} days in a row — keep momentum and hit your weekly
          goal.
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{
            background: "rgba(251,146,60,0.10)",
            border: "1px solid rgba(251,146,60,0.22)",
          }}
        >
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-medium text-orange-300">
            {STREAK}-day streak
          </span>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.18)",
          }}
        >
          <TrendingUp size={13} className="text-green-400" />
          <span className="text-xs font-medium text-green-400">
            On track this week
          </span>
        </div>
      </div>
    </motion.article>
  );
}
