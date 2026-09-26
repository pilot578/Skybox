'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { RotateCcw, Scale } from 'lucide-react'
import { FlowParticle, Gear } from './mechanical'
import { Panel, Readout, StatusIndicator, TechnicalLabel } from './primitives'

const IDS = ['N01', 'N02', 'N03', 'N04', 'N05', 'N06', 'N07', 'N08']
const INITIAL = [92, 38, 71, 24, 85, 46, 60, 30]
const COL_W = 64
const GAP = 34
const BASE = 380
const MAX_H = 220

function colX(i: number) {
  return 60 + i * (COL_W + GAP)
}

export function RebalanceSystem() {
  const [levels, setLevels] = useState(INITIAL)
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const avg = levels.reduce((a, b) => a + b, 0) / levels.length
  const variance = Math.sqrt(levels.reduce((a, b) => a + (b - avg) ** 2, 0) / levels.length)
  const tilt = Math.max(-14, Math.min(14, ((levels.slice(0, 4).reduce((a, b) => a + b, 0) - levels.slice(4).reduce((a, b) => a + b, 0)) / 4) * 0.6))

  const transfers = useMemo(() => {
    const target = INITIAL.reduce((a, b) => a + b, 0) / INITIAL.length
    const heavy = INITIAL.map((v, i) => ({ i, d: v - target })).filter((x) => x.d > 5).sort((a, b) => b.d - a.d)
    const light = INITIAL.map((v, i) => ({ i, d: target - v })).filter((x) => x.d > 5).sort((a, b) => b.d - a.d)
    return heavy.map((h, k) => [h.i, light[k % light.length].i] as const)
  }, [])

  useEffect(() => {
    if (!running) return
    const start = levels
    const target = start.reduce((a, b) => a + b, 0) / start.length
    let step = 0
    const steps = 56
    const id = setInterval(() => {
      step++
      const t = step / steps
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      setLevels(start.map((v) => v + (target - v) * e))
      if (step >= steps) {
        clearInterval(id)
        setRunning(false)
      }
    }, 50)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  function rebalance() {
    setRunning(true)
  }

  function reset() {
    if (timer.current) clearTimeout(timer.current)
    setRunning(false)
    setLevels(INITIAL)
  }

  const balanced = variance < 1

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Panel title="Load Distribution" code="RBL-01" className="p-5">
        <svg viewBox="0 0 880 440" className="h-auto w-full" role="img" aria-label="Storage load across nodes">
          <g transform="translate(440 70)">
            <Gear cx={0} cy={0} r={22} teeth={12} className={running ? 'spin-fast' : 'spin-slow'} />
            <motion.g animate={{ rotate: balanced ? 0 : tilt }} transition={{ type: 'spring', stiffness: 40, damping: 10 }}>
              <rect x={-360} y={-3} width={720} height={6} rx={3} fill="#cfe0f8" stroke="#7fa9e3" />
              {[-340, 340].map((x) => (
                <g key={x}>
                  <line x1={x} y1={0} x2={x} y2={30} stroke="#7fa9e3" />
                  <path d={`M${x - 30},30 L${x + 30},30 L${x + 22},42 L${x - 22},42 Z`} fill="#ffffff" stroke="#7fa9e3" />
                </g>
              ))}
            </motion.g>
            <text y={48} textAnchor="middle" fontSize={8} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
              {balanced ? 'EQUILIBRIUM' : `IMBALANCE σ ${variance.toFixed(1)}`}
            </text>
          </g>

          <line x1={40} y1={BASE} x2={840} y2={BASE} stroke="#7fa9e3" />
          <line x1={40} y1={BASE - MAX_H * (avg / 100)} x2={840} y2={BASE - MAX_H * (avg / 100)} stroke="#3b78d8" strokeDasharray="4 4" />
          <text x={842} y={BASE - MAX_H * (avg / 100) - 6} textAnchor="end" fontSize={8} letterSpacing={1.5} className="fill-[#3b78d8] font-mono">
            AVG {avg.toFixed(0)}%
          </text>

          {running &&
            transfers.map(([from, to], k) => {
              const x1 = colX(from) + COL_W / 2
              const x2 = colX(to) + COL_W / 2
              const d = `M${x1},${BASE - MAX_H * 0.9} Q${(x1 + x2) / 2},${BASE - MAX_H - 40} ${x2},${BASE - MAX_H * 0.4}`
              return (
                <g key={`${from}-${to}`}>
                  <path d={d} fill="none" stroke="#7fa9e3" strokeDasharray="3 4" className="flow-dash" />
                  <FlowParticle path={d} duration={1} delay={k * 0.15} r={4} />
                  <FlowParticle path={d} duration={1} delay={k * 0.15 + 0.5} r={3} color="#7fa9e3" />
                </g>
              )
            })}

          {levels.map((lv, i) => {
            const x = colX(i)
            const h = MAX_H * (lv / 100)
            const blocks = Math.round(lv / 10)
            return (
              <g key={IDS[i]}>
                <rect x={x} y={BASE - MAX_H} width={COL_W} height={MAX_H} rx={6} fill="#ffffff" stroke="#d6e3f5" />
                <motion.rect
                  x={x + 4}
                  width={COL_W - 8}
                  rx={4}
                  fill="#cfe0f8"
                  initial={false}
                  animate={{ y: BASE - h, height: h }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                {Array.from({ length: blocks }).map((_, b) => (
                  <motion.line
                    key={b}
                    x1={x + 8}
                    x2={x + COL_W - 8}
                    stroke="#ffffff"
                    initial={false}
                    animate={{ y1: BASE - (b + 1) * (MAX_H / 10), y2: BASE - (b + 1) * (MAX_H / 10) }}
                  />
                ))}
                <text x={x + COL_W / 2} y={BASE + 18} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-[#2f64b5] font-mono">
                  {IDS[i]}
                </text>
                <text x={x + COL_W / 2} y={BASE + 32} textAnchor="middle" fontSize={9} className="fill-[#7d9dcc] font-mono tabular-nums">
                  {Math.round(lv)}%
                </text>
                <circle cx={x + COL_W - 10} cy={BASE - MAX_H + 10} r={2.5} fill={lv > 80 ? '#f0b07a' : '#7fa9e3'} className="led" />
              </g>
            )
          })}
        </svg>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Balancer" code="CTL">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={rebalance}
              disabled={running || balanced}
              className="flex items-center justify-center gap-2 rounded-md border border-rose bg-blush px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#2f5ea8] transition hover:bg-rose hover:text-card disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Scale className="size-4" aria-hidden />
              {running ? 'Rebalancing…' : 'Run Rebalance'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-cream px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:bg-petal"
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset Load
            </button>
          </div>
        </Panel>
        <Panel title="State" code="ST">
          <div className="mb-3 flex items-center gap-2">
            <StatusIndicator status={running ? 'syncing' : balanced ? 'healthy' : 'degraded'} />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#2f64b5]">
              {running ? 'Migrating' : balanced ? 'Balanced' : 'Skewed'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
            <Readout label="Std Dev" value={`${variance.toFixed(1)}%`} />
            <Readout label="Target" value={`${avg.toFixed(0)}%`} />
            <Readout label="Moves" value={String(transfers.length)} />
            <Readout label="Hot Nodes" value={String(levels.filter((l) => l > 80).length)} />
          </div>
        </Panel>
        <Panel title="Strategy" code="STR">
          <TechnicalLabel className="leading-relaxed">
            Consistent hashing · virtual nodes 256 · move cap 5% per cycle
          </TechnicalLabel>
        </Panel>
      </div>
    </div>
  )
}
