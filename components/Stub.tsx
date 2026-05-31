'use client'

import { motion } from 'framer-motion'

export default function Stub({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[60vh] items-center justify-center"
    >
      <p className="text-sm text-slate-600">{title} — coming soon</p>
    </motion.div>
  )
}
