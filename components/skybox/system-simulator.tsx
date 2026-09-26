'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, Power, RotateCcw, Upload, Zap } from 'lucide-react'
import { polar } from '@/lib/skybox-data'
import { FlowParticle, MechanicalGauge, MechanicalRing } from './mechanical'
import { Panel, Readout, TechnicalLabel } from './primitives'
import { cn } from '@/lib/utils'

type SimNode = { id: string; online: boolean; load: number; healing: boolean }
type LogEntry = { id: number; t: string; msg: string }

const C = 250
const R = 180

function initialNodes(): SimNode[] {
  return Array.from({ length: 8 }).map((_, i) => ({ id: `N${String(i + 1).padStart(2, '0')}`, online: true, load: 40 + ((i * 17) % 40), healing: false }))
}

function stamp(n: number) {
  const s = 14 * 3600 + 2 * 60 + n * 3
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export function SystemSimulator() {
  const [nodes, setNodes] = useState<SimNode[]>(initialNodes)
  const [log, setLog] = useState<LogEntry[]>([{ id: 0, t: stamp(0), msg: 'Simulator armed · 8 nodes · RF 3' }])
  const [uploads, setUploads] = useState<number[]>([])
  const counter = useRef(1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function push(msg: string) {
    const id = counter.current++
    setLog((l) => [{ id, t: stamp(id), msg }, ...l].slice(0, 10))
  }

  function toggle(id: string) {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    if (node.online) {
      setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, online: false } : n)))
      push(`${id} offline · rerouting replicas`)
      setNodes((ns) => ns.map((n) => (n.online && n.id !== id ? { ...n, healing: true } : n)))
      timers.current.push(
        setTimeout(() => {
          setNodes((ns) => ns.map((n) => ({ ...n, healing: false })))
          push(`Redundancy restored after ${id} loss`)
        }, 2400),
      )
    } else {
      setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, online: true } : n)))
      push(`${id} back online · resyncing`)
    }
  }

  function addNode() {
    if (nodes.length >= 12) return
    const id = `N${String(nodes.length + 1).padStart(2, '0')}`
    setNodes((ns) => [...ns, { id, online: true, load: 8, healing: false }])
    push(`${id} commissioned · joining ring`)
  }

  function upload() {
    const id = counter.current
    setUploads((u) => [...u, id])
    push(`OBJ-${String(50000 + id)} ingested · 3 replicas`)
    setNodes((ns) => ns.map((n) => (n.online ? { ...n, load: Math.min(99, n.load + 2) } : n)))
    timers.current.push(setTimeout(() => setUploads((u) => u.filter((x) => x !== id)), 1800))
  }

  function spike() {
    setNodes((ns) => ns.map((n, i) => (n.online && i % 3 === 0 ? { ...n, load: Math.min(99, n.load + 25) } : n)))
    push('Traffic spike injected on hot partition')
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    setNodes(initialNodes())
    setUploads([])
    setLog([{ id: 0, t: stamp(0), msg: 'Simulator reset' }])
  }

  const online = nodes.filter((n) => n.online)
  const health = Math.round((online.length / nodes.length) * 100)
  const avgLoad = online.length ? Math.round(online.reduce((a, n) => a + n.load, 0) / online.length) : 0
  const redundancy = Math.min(3, online.length)
  const pos = nodes.map((n, i) => ({ ...n, ...polar(C, C, R, (360 / nodes.length) * i) }))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Panel title="Live Simulation" code="SIM-01" className="p-5">
        <TechnicalLabel className="mb-2 block">Click a node to toggle power</TechnicalLabel>
        <svg viewBox="0 0 500 500" className="mx-auto h-auto w-full max-w-[560px]" role="group" aria-label="Simulated cluster">
          <g className="spin-slow">
            <MechanicalRing cx={C} cy={C} r={238} ticks={120} majorEvery={10} tickLength={8} />
          </g>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#d6e3f5" />

          {pos.map((p, i) => {
            const d = `M${C},${C} L${p.x},${p.y}`
            return (
              <g key={`l-${p.id}`}>
                <line x1={C} y1={C} x2={p.x} y2={p.y} stroke={p.online ? (p.healing ? '#3b78d8' : '#d6e3f5') : '#f0f5fc'} strokeDasharray={p.online ? undefined : '2 6'} className={p.healing ? 'flow-dash' : undefined} />
                {p.online && <FlowParticle path={d} duration={p.healing ? 0.9 : 2.4} delay={i * 0.2} r={2} color="#7fa9e3" />}
              </g>
            )
          })}

          {uploads.map((u) =>
            online.slice(0, 3).map((n, k) => {
              const p = pos.find((x) => x.id === n.id)!
              return <FlowParticle key={`${u}-${n.id}`} path={`M${C},${C} L${p.x},${p.y}`} duration={0.8} delay={k * 0.1} r={4.5} />
            }),
          )}

          <AnimatePresence>
            {pos.map((p) => (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: p.online ? 1 : 0.5, scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 16 }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.id} ${p.online ? 'online' : 'offline'}, toggle power`}
                  aria-pressed={p.online}
                  onClick={() => toggle(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggle(p.id)
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <g className={p.online ? (p.healing ? 'spin-fast' : 'spin-slow') : undefined}>
                    <MechanicalRing cx={p.x} cy={p.y} r={30} ticks={20} majorEvery={5} tickLength={4} />
                  </g>
                  <circle cx={p.x} cy={p.y} r={23} fill={p.online ? '#ffffff' : '#f0f5fc'} stroke={p.online ? '#7fa9e3' : '#d6e3f5'} />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={19}
                    fill="none"
                    stroke={p.load > 80 ? '#f0b07a' : '#cfe0f8'}
                    strokeWidth={3}
                    strokeDasharray={`${(p.load / 100) * 2 * Math.PI * 19} 999`}
                    transform={`rotate(-90 ${p.x} ${p.y})`}
                    style={{ transition: 'stroke-dasharray 500ms' }}
                  />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-[#2f64b5] font-mono">
                    {p.id}
                  </text>
                  <text x={p.x} y={p.y + 44} textAnchor="middle" fontSize={7} letterSpacing={1} className="fill-[#7d9dcc] font-mono">
                    {p.online ? `${p.load}%` : 'OFF'}
                  </text>
                </g>
              </motion.g>
            ))}
          </AnimatePresence>

          <circle cx={C} cy={C} r={46} fill="#e8f1fd" stroke="#3b78d8" />
          <g className="spin-rev-fast">
            <circle cx={C} cy={C} r={38} fill="none" stroke="#7fa9e3" strokeDasharray="3 3" />
          </g>
          <text x={C} y={C} textAnchor="middle" fontSize={11} fontWeight={600} letterSpacing={2} className="fill-[#2f64b5] font-mono">
            SKYBOX
          </text>
          <text x={C} y={C + 13} textAnchor="middle" fontSize={7} letterSpacing={1.5} className="fill-[#7d9dcc] font-mono">
            {online.length}/{nodes.length} LIVE
          </text>
        </svg>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Controls" code="CTL">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Upload', icon: Upload, onClick: upload },
              { label: 'Add Node', icon: Plus, onClick: addNode, disabled: nodes.length >= 12 },
              { label: 'Spike', icon: Zap, onClick: spike },
              { label: 'Kill Random', icon: Power, onClick: () => { const alive = nodes.filter((n) => n.online); if (alive.length) toggle(alive[(counter.current * 7) % alive.length].id) } },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={b.onClick}
                disabled={b.disabled}
                className="flex items-center justify-center gap-1.5 rounded-md border border-rose/60 bg-petal px-2 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#2f5ea8] transition hover:bg-blush disabled:opacity-50"
              >
                <b.icon className="size-3.5" aria-hidden />
                {b.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-cream px-2 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:bg-petal"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </button>
        </Panel>
        <Panel title="Telemetry" code="TLM">
          <div className="grid grid-cols-2 place-items-center gap-2">
            <MechanicalGauge label="Health" value={health} display={`${health}%`} size={120} />
            <MechanicalGauge label="Load" value={avgLoad} display={`${avgLoad}%`} size={120} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
            <Readout label="Redundancy" value={`${redundancy} / 3`} />
            <Readout label="Nodes" value={`${online.length} / ${nodes.length}`} />
          </div>
        </Panel>
        <Panel title="Event Log" code="LOG">
          <ul className="flex max-h-56 flex-col gap-1 overflow-hidden" aria-live="polite">
            <AnimatePresence initial={false}>
              {log.map((e, i) => (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn('flex gap-2 font-mono text-[11px]', i === 0 ? 'text-foreground' : 'text-muted-foreground')}
                >
                  <span className="tabular-nums">{e.t}</span>
                  <span className="truncate">{e.msg}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Panel>
      </div>
    </div>
  )
}
