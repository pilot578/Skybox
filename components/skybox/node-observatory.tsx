'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { NODES, type StorageNodeData } from '@/lib/skybox-data'
import { FlowParticle, MechanicalGauge, MechanicalRing } from './mechanical'
import { Bar, CornerTicks, Panel, Readout, StatusIndicator, TechnicalLabel } from './primitives'
import { cn } from '@/lib/utils'

const POS = NODES.map((n, i) => ({
  id: n.id,
  x: 70 + (i % 6) * 152,
  y: i < 6 ? 60 : 170,
}))

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
  [0, 7], [2, 9], [4, 11], [1, 8], [3, 10],
]

function NetworkStrip({ active, setActive }: { active: string | null; setActive: (id: string | null) => void }) {
  return (
    <svg viewBox="0 0 900 230" className="h-auto w-full" role="img" aria-label="Node interconnect network">
      {LINKS.map(([a, b]) => {
        const A = POS[a]
        const B = POS[b]
        const lit = active === A.id || active === B.id
        const d = `M${A.x},${A.y} L${B.x},${B.y}`
        return (
          <g key={`${a}-${b}`}>
            <path d={d} stroke={lit ? '#3b78d8' : '#d6e3f5'} strokeWidth={lit ? 2 : 1} className={lit ? 'flow-dash' : undefined} fill="none" />
            {lit && (
              <>
                <FlowParticle path={active === A.id ? d : `M${B.x},${B.y} L${A.x},${A.y}`} duration={1.4} r={3} />
                <FlowParticle path={active === A.id ? d : `M${B.x},${B.y} L${A.x},${A.y}`} duration={1.4} delay={0.7} r={2} color="#7fa9e3" />
              </>
            )}
          </g>
        )
      })}
      {POS.map((p, i) => {
        const lit = active === p.id
        return (
          <g key={p.id} onMouseEnter={() => setActive(p.id)} onMouseLeave={() => setActive(null)} className="cursor-pointer">
            <g className={lit ? 'spin-fast' : 'spin-slow'}>
              <MechanicalRing cx={p.x} cy={p.y} r={lit ? 34 : 28} ticks={24} majorEvery={6} tickLength={4} />
            </g>
            <circle cx={p.x} cy={p.y} r={lit ? 24 : 20} fill={lit ? '#e3edfc' : '#ffffff'} stroke="#7fa9e3" style={{ transition: 'all 250ms' }} />
            <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-[#2f64b5] font-mono">
              {p.id}
            </text>
            <circle cx={p.x + 18} cy={p.y - 18} r={2.5} fill={NODES[i].status === 'degraded' ? '#f0b07a' : '#7fa9e3'} className="led" />
          </g>
        )
      })}
    </svg>
  )
}

function HealthRing({ value, spinning }: { value: number; spinning: boolean }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 90 90" className="size-24" aria-hidden>
      <g className={spinning ? 'spin-fast' : 'spin-slow'}>
        <MechanicalRing cx={45} cy={45} r={43} ticks={36} majorEvery={3} tickLength={4} />
      </g>
      <circle cx="45" cy="45" r={r} fill="none" stroke="#f0f5fc" strokeWidth="6" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#7fa9e3" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 45 45)" />
      <text x="45" y="44" textAnchor="middle" fontSize="12" className="fill-[#2f64b5] font-mono">
        {value}
      </text>
      <text x="45" y="55" textAnchor="middle" fontSize="6" letterSpacing="1" className="fill-[#7d9dcc] font-mono">
        HEALTH
      </text>
    </svg>
  )
}

function NodeModule({
  node,
  active,
  onHover,
  onOpen,
}: {
  node: StorageNodeData
  active: boolean
  onHover: (id: string | null) => void
  onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={onOpen}
      animate={{ y: active ? -6 : 0, scale: active ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'relative flex flex-col gap-3 rounded-lg border bg-card p-4 text-left outline-none',
        active ? 'border-rose shadow-[0_20px_40px_-18px_rgba(217,146,138,0.6)]' : 'border-line',
      )}
      aria-label={`Open ${node.id} details`}
    >
      <CornerTicks />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-lg font-semibold tracking-[0.2em] text-[#2f64b5]">NODE-{node.id.slice(1)}</span>
          <TechnicalLabel>{node.zone}</TechnicalLabel>
        </div>
        <StatusIndicator status={node.status} label={node.status} />
      </div>
      <div className="flex items-center gap-4">
        <HealthRing value={node.health} spinning={active} />
        <div className="flex flex-1 flex-col gap-2">
          {[
            ['CPU', node.cpu],
            ['MEM', node.memory],
            ['DISK', node.storageUsed],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <TechnicalLabel>{k}</TechnicalLabel>
                <span className="font-mono text-[10px] tabular-nums text-foreground">{v}%</span>
              </div>
              <Bar value={v as number} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 border-t border-line pt-3">
        <Readout label="Net" value={`${node.network}`} />
        <Readout label="Lat" value={`${node.latency}ms`} />
        <Readout label="Obj" value={`${(node.objects / 1000).toFixed(1)}k`} />
        <Readout label="Rep" value={`${(node.replicas / 1000).toFixed(1)}k`} />
      </div>
    </motion.button>
  )
}

function NodeDetail({ node, onClose }: { node: StorageNodeData; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${node.id} detail`}
        initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl"
      >
        <Panel title={`NODE-${node.id.slice(1)} · Detailed Telemetry`} code={node.zone} className="bg-card p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md border border-line bg-petal p-1.5 text-foreground hover:bg-blush"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <div className="grid grid-cols-2 place-items-center gap-4 md:grid-cols-4">
            <MechanicalGauge label="Health" value={node.health} display={`${node.health}%`} size={130} />
            <MechanicalGauge label="CPU" value={node.cpu} display={`${node.cpu}%`} size={130} />
            <MechanicalGauge label="Memory" value={node.memory} display={`${node.memory}%`} size={130} />
            <MechanicalGauge label="Storage" value={node.storageUsed} display={`${node.storageUsed}%`} size={130} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 md:grid-cols-6">
            <Readout label="Network" value={`${node.network} Mb/s`} />
            <Readout label="Latency" value={`${node.latency}ms`} />
            <Readout label="I/O" value={`${node.io}MB/s`} />
            <Readout label="Objects" value={node.objects.toLocaleString()} />
            <Readout label="Replicas" value={node.replicas.toLocaleString()} />
            <Readout label="Capacity" value={`${node.capacityTb} TB`} />
          </div>
        </Panel>
      </motion.div>
    </motion.div>
  )
}

export function NodeObservatory() {
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState<StorageNodeData | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Interconnect" code="MESH-21" className="p-5">
        <NetworkStrip active={active} setActive={setActive} />
      </Panel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {NODES.map((n) => (
          <NodeModule key={n.id} node={n} active={active === n.id} onHover={setActive} onOpen={() => setOpen(n)} />
        ))}
      </div>
      <AnimatePresence>{open && <NodeDetail node={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  )
}
