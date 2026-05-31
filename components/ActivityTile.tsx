"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

// seeded rng so the grid doesn't shift on every render
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKS = 16;
const DAYS = 7;

const cellColor = (lvl: number) =>
  [
    "rgba(255,255,255,0.04)",
    "rgba(59,130,246,0.22)",
    "rgba(59,130,246,0.44)",
    "rgba(59,130,246,0.66)",
    "rgba(59,130,246,0.88)",
  ][lvl];

export default function ActivityTile() {
  const grid = useMemo(() => {
    const rng = mulberry32(0xc0ffee42);
    return Array.from({ length: WEEKS }, () =>
      Array.from({ length: DAYS }, () => {
        const v = rng();
        if (v < 0.42) return 0;
        if (v < 0.62) return 1;
        if (v < 0.78) return 2;
        if (v < 0.91) return 3;
        return 4;
      }),
    );
  }, []);

  const filled = grid.flat().filter((v) => v > 0).length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.08 }}
      whileHover={{
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="grain relative rounded-xl p-5 md:p-6 flex flex-col gap-5 overflow-hidden isolate"
      style={{
        background: "#0f111a",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: 200,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(6,182,212,0.08) 0%, transparent 55%)",
        }}
      />

      <header className="relative z-10">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-500" />
          <h2 className="text-sm font-medium text-slate-200">
            Learning Activity
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-600">
          {filled} active days this quarter
        </p>
      </header>

      <div className="relative z-10 flex gap-[3px]">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] flex-1 min-w-0">
            {week.map((lvl, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.18 + wi * 0.018 + di * 0.006,
                  duration: 0.22,
                  ease: "easeOut",
                }}
                className="rounded-[2px] w-full aspect-square"
                style={{ background: cellColor(lvl) }}
              />
            ))}
          </div>
        ))}
      </div>

      <footer className="relative z-10 flex items-center gap-1.5 mt-auto">
        <span className="text-[10px] text-slate-700">Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div
            key={l}
            className="rounded-[2px]"
            style={{ width: 10, height: 10, background: cellColor(l) }}
          />
        ))}
        <span className="text-[10px] text-slate-700">More</span>
      </footer>
    </motion.article>
  );
}
