'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { StorageNodeData } from '@/lib/skybox-data'
import { CornerTicks, Readout, StatusIndicator, TechnicalLabel } from './primitives'
import { cn } from '@/lib/utils'

function CapacityDial({ value, active }: { value: number; active: boolean }) {
  const r = 26
  const circ = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="size-16 shrink-0" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="#d6e3f5" />
      <g className={active ? 'spin-fast' : 'spin-slow'}>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#7fa9e3" strokeDasharray="1 4" />
      </g>
      <circle cx="32" cy="32" r={r} fill="none" stroke="#f0f5fc" strokeWidth="5" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="#7fa9e3"
        strokeWidth="5"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${(value / 100) * circ} ${circ}` }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="32" y="35" textAnchor="middle" fontSize="11" className="fill-[#2f64b5] font-mono">
        {value}%
      </text>
    </svg>
  )
}

export function StorageNode({
  node,
  active,
  onActivate,
  onDeactivate,
}: {
  node: StorageNodeData
  active: boolean
  onActivate: () => void
  onDeactivate: () => void
}) {
  const usedTb = +(node.capacityTb * (node.storageUsed / 100)).toFixed(2)
  const freeTb = +(node.capacityTb - usedTb).toFixed(2)

  return (
    <motion.div
      layout
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      tabIndex={0}
      animate={{ scale: active ? 1.04 : 1, y: active ? -4 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'relative z-10 flex flex-col gap-3 rounded-lg border bg-card p-3 outline-none transition-shadow',
        active ? 'z-20 border-rose shadow-[0_18px_40px_-16px_rgba(217,146,138,0.55)]' : 'border-line',
      )}
    >
      <CornerTicks />
      <div className="flex items-center gap-3">
        <CapacityDial value={node.storageUsed} active={active} />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-base font-semibold tracking-[0.2em] text-[#2f64b5]">{node.id}</span>
          <TechnicalLabel>{node.zone}</TechnicalLabel>
          <StatusIndicator status={node.status} label={node.status} />
        </div>
      </div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn('h-3 flex-1 rounded-[2px] transition-colors', i < Math.round(node.storageUsed / 10) ? 'bg-blush' : 'bg-muted', active && i < Math.round(node.storageUsed / 10) && 'bg-rose')}
            style={{ transitionDelay: `${i * 30}ms` }}
          />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-x-3 gap-y-2 border-t border-line pt-3">
              <Readout label="Storage" value={`${node.capacityTb} TB`} />
              <Readout label="Objects" value={node.objects.toLocaleString()} />
              <Readout label="Capacity" value={`${node.storageUsed}%`} />
              <Readout label="Used" value={`${usedTb} TB`} />
              <Readout label="Free" value={`${freeTb} TB`} />
              <Readout label="I/O" value={`${node.io}MB/s`} />
              <Readout label="Latency" value={`${node.latency}ms`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
