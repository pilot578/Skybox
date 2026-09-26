'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/skybox-data'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const item = NAV_ITEMS.find((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href))) ?? NAV_ITEMS[0]

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-cream"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
      >
        <motion.div
          className="relative flex size-72 items-center justify-center"
          initial={{ scale: 0.6, rotate: -90 }}
          animate={{ scale: 2.4, rotate: 90 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0">
            <circle cx="100" cy="100" r="96" fill="none" stroke="#7fa9e3" strokeOpacity="0.6" />
            <circle cx="100" cy="100" r="84" fill="none" stroke="#cfe0f8" strokeWidth="6" strokeDasharray="3 5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#7fa9e3" strokeDasharray="1 3" />
            {Array.from({ length: 36 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="4"
                x2="100"
                y2={i % 3 === 0 ? 14 : 9}
                stroke="#3b78d8"
                strokeOpacity={i % 3 === 0 ? 0.8 : 0.4}
                transform={`rotate(${i * 10} 100 100)`}
              />
            ))}
          </svg>
        </motion.div>
        <motion.div
          className="absolute flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 1, 1, 0], y: 0 }}
          transition={{ duration: 0.9, times: [0, 0.25, 0.7, 1] }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">{item.code}</span>
          <span className="font-mono text-sm tracking-[0.35em] text-[#2f64b5]">{item.module}</span>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.985, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
