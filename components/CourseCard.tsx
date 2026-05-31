"use client";

import { motion } from "framer-motion";
import type { Course } from "@/types";
import CourseIcon from "./CourseIcon";

const palette = [
  {
    hex: "#3b82f6",
    glow: "rgba(59,130,246,0.14)",
    bg: "rgba(59,130,246,0.10)",
  },
  {
    hex: "#8b5cf6",
    glow: "rgba(139,92,246,0.14)",
    bg: "rgba(139,92,246,0.10)",
  },
  { hex: "#06b6d4", glow: "rgba(6,182,212,0.14)", bg: "rgba(6,182,212,0.10)" },
  { hex: "#22c55e", glow: "rgba(34,197,94,0.14)", bg: "rgba(34,197,94,0.10)" },
];

export default function CourseCard({
  course,
  index: i,
}: {
  course: Course;
  index: number;
}) {
  const accent = palette[i % palette.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: 0.05 + i * 0.07,
      }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{
        background: "#0f111a",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: 180,
      }}
      className="grain relative col-span-1 rounded-xl p-5 flex flex-col gap-3 overflow-hidden cursor-default group isolate"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(circle at 15% 15%, ${accent.glow} 0%, transparent 58%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 0 1px ${accent.hex}55, 0 0 32px ${accent.glow}`,
        }}
      />

      <div
        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: accent.bg }}
      >
        <CourseIcon name={course.icon_name} size={17} color={accent.hex} />
      </div>

      <h3 className="relative z-10 flex-1 text-sm font-medium leading-snug text-slate-200">
        {course.title}
      </h3>

      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Progress</span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: accent.hex }}
          >
            {course.progress}%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            className="bar-fill h-full rounded-full"
            style={{ background: accent.hex }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: course.progress / 100 }}
            transition={{
              delay: 0.45 + i * 0.07,
              duration: 0.85,
              ease: [0.32, 0.72, 0, 1],
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
