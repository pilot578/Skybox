'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Power, RotateCcw } from 'lucide-react'
import { polar } from '@/lib/skybox-data'
import { FlowParticle, MechanicalRing } from './mechanical'
import { Panel, Readout, StatusIndicator, TechnicalLabel } from './primitives'
import { cn } from '@/lib/utils'

type Phase = 'healthy' | 'failure' | 'reroute' | 'replace' | 'recovering' | 'restored'

const PHASE_LABEL: Record<Phase, string> = {
  healthy: 'All Systems Nominal',
  failure: 'Node Failure',
  reroute: 'Rerouting Data Paths',
  replace: 'Replacement Node Entering',
  recovering: 'Recovery In Progress',
  restored: 'Replica Restored',
}

const C = 260
const R = 170
const IDS = ['N01', 'N02', 'N03', 'N04', 'N05', 'N06']
const POS = IDS.map((id, i) => ({ id, ...polar(C, C, R, i * 60) }))
const FAIL = 3
const REPL = { id: 'N13', ...polar(C, C, R + 60, FAIL * 60 + 18) }
const SOURCES = [2, 4]

function RecoveryGauge({ progress, phase }: { progress: number; phase: Phase }) {
  const r = 80
  const circ = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[240px]" role="img" aria-label={`Recovery ${Math.round(progress)} percent`}>
      <g className={phase === 'recovering' ? 'spin-fast' : 'spin-slow'}>
        <MechanicalRing cx={100} cy={100} r={96} ticks={100} majorEvery={10} tickLength={8} />
      </g>
      <circle cx={100} cy={100} r={r} fill="#ffffff" stroke="#f0f5fc" strokeWidth={12} />
      <circle
        cx={100}
        cy={100}
        r={r}
        fill="none"
        stroke="url(#rec-grad)"
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={`${(progress / 100) * circ} ${circ}`}
        transform="rotate(-90 100 100)"
        style={{ transition: 'stroke-dasharray 120ms linear' }}
      />
      <defs>
        <linearGradient id="rec-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#cfe0f8" />
          <stop offset="100%" stopColor="#3b78d8" />
        </linearGradient>
      </defs>
      <text x={100} y={104} textAnchor="middle" fontSize={34} className="fill-[#2f64b5] font-mono tabular-nums">
        {Math.round(progress)}%
      </text>
      <text x={100} y={124} textAnchor="middle" fontSize={8} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        {phase === 'restored' ? 'RESTORED' : 'RECOVERY'}
      </text>
    </svg>
  )
}

export function RecoveryEngine() {
  const [phase, setPhase] = useState<Phase>('healthy')
  const [progress, setProgress] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (phase !== 'recovering') return
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 1.2)
        if (next >= 100) {
          clearInterval(id)
          setPhase('restored')
        }
        return next
      })
    }, 50)
    return () => clearInterval(id)
  }, [phase])

  function simulate() {
    timers.current.forEach(clearTimeout)
    setProgress(0)
    setPhase('failure')
    timers.current = [
      setTimeout(() => setPhase('reroute'), 1600),
      setTimeout(() => setPhase('replace'), 3200),
      setTimeout(() => setPhase('recovering'), 4600),
    ]
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    setProgress(0)
    setPhase('healthy')
  }

  const failed = phase !== 'healthy'
  const replacementIn = phase === 'replace' || phase === 'recovering' || phase === 'restored'
  const rerouted = phase !== 'healthy' && phase !== 'failure'

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Panel title="Self-Healing Network" code="HEAL-01" className="p-5">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 top-0 z-10 flex items-center gap-2"
            >
              <StatusIndicator status={phase === 'failure' ? 'degraded' : phase === 'recovering' ? 'syncing' : 'healthy'} />
              <span className="font-mono text-sm uppercase tracking-[0.25em] text-[#2f64b5]">{PHASE_LABEL[phase]}</span>
            </motion.div>
          </AnimatePresence>

          <svg viewBox="0 0 540 560" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label="Recovery network">
            <g className="spin-slow">
              <MechanicalRing cx={C} cy={C} r={236} ticks={120} majorEvery={10} tickLength={8} />
            </g>

            {POS.map((a, i) => {
              const b = POS[(i + 1) % POS.length]
              const touchesFailed = i === FAIL || (i + 1) % POS.length === FAIL
              const broken = failed && touchesFailed
              return (
                <line
                  key={`ring-${a.id}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={broken ? '#cfe0f8' : '#7fa9e3'}
                  strokeWidth={broken ? 1 : 1.5}
                  strokeDasharray={broken ? '3 8' : undefined}
                  opacity={broken ? 0.6 : 1}
                  style={{ transition: 'all 400ms' }}
                />
              )
            })}
            {POS.map((p, i) => {
              const broken = failed && i === FAIL
              return (
                <g key={`spoke-${p.id}`}>
                  <line x1={C} y1={C} x2={p.x} y2={p.y} stroke={broken ? '#f0f5fc' : '#d6e3f5'} strokeDasharray={broken ? '2 8' : undefined} />
                  {!broken && <FlowParticle path={`M${C},${C} L${p.x},${p.y}`} duration={2.6} delay={i * 0.3} r={2} color="#7fa9e3" />}
                </g>
              )
            })}

            {rerouted && (
              <motion.path
                d={`M${POS[2].x},${POS[2].y} Q${C + 40},${C + 60} ${POS[4].x},${POS[4].y}`}
                fill="none"
                stroke="#3b78d8"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9 }}
                className="flow-dash"
              />
            )}

            {replacementIn &&
              SOURCES.map((s) => {
                const d = `M${POS[s].x},${POS[s].y} L${REPL.x},${REPL.y}`
                return (
                  <g key={`src-${s}`}>
                    <motion.path d={d} stroke="#3b78d8" strokeWidth={1.5} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
                    {phase === 'recovering' && (
                      <>
                        <FlowParticle path={d} duration={0.9} r={3.5} />
                        <FlowParticle path={d} duration={0.9} delay={0.3} r={2.5} color="#7fa9e3" />
                        <FlowParticle path={d} duration={0.9} delay={0.6} r={2} />
                      </>
                    )}
                  </g>
                )
              })}

            {POS.map((p, i) => {
              const isFail = i === FAIL && failed
              const isSource = replacementIn && SOURCES.includes(i)
              return (
                <motion.g
                  key={p.id}
                  animate={isFail ? { x: [0, -2, 2, -1, 1, 0], opacity: 0.55 } : { x: 0, opacity: 1 }}
                  transition={isFail ? { duration: 0.5 } : { duration: 0.3 }}
                >
                  <g className={isSource ? 'spin-fast' : isFail ? undefined : 'spin-slow'}>
                    <MechanicalRing cx={p.x} cy={p.y} r={34} ticks={24} majorEvery={6} tickLength={4} />
                  </g>
                  <circle cx={p.x} cy={p.y} r={26} fill={isFail ? '#f0f5fc' : isSource ? '#e3edfc' : '#ffffff'} stroke={isFail ? '#d6e3f5' : '#7fa9e3'} />
                  {isFail && (
                    <g stroke="#7fa9e3" strokeWidth={1.5}>
                      <line x1={p.x - 8} y1={p.y - 8} x2={p.x + 8} y2={p.y + 8} />
                      <line x1={p.x + 8} y1={p.y - 8} x2={p.x - 8} y2={p.y + 8} />
                    </g>
                  )}
                  {!isFail && (
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-[#2f64b5] font-mono">
                      {p.id}
                    </text>
                  )}
                  <text x={p.x} y={p.y + 50} textAnchor="middle" fontSize={7} letterSpacing={1.5} className="fill-[#7d9dcc] font-mono">
                    {isFail ? 'OFFLINE' : isSource ? 'SOURCE REPLICA' : 'HEALTHY'}
                  </text>
                </motion.g>
              )
            })}

            <AnimatePresence>
              {replacementIn && (
                <motion.g
                  initial={{ opacity: 0, x: 80, scale: 0.6 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                  style={{ transformOrigin: `${REPL.x}px ${REPL.y}px` }}
                >
                  <g className="spin-fast">
                    <MechanicalRing cx={REPL.x} cy={REPL.y} r={36} ticks={24} majorEvery={3} tickLength={5} />
                  </g>
                  <circle cx={REPL.x} cy={REPL.y} r={28} fill={phase === 'restored' ? '#e3edfc' : '#ffffff'} stroke="#3b78d8" strokeWidth={1.5} />
                  <text x={REPL.x} y={REPL.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-[#2f64b5] font-mono">
                    {REPL.id}
                  </text>
                  <text x={REPL.x} y={REPL.y + 52} textAnchor="middle" fontSize={7} letterSpacing={1.5} className="fill-[#3b78d8] font-mono">
                    {phase === 'restored' ? 'REPLICA RESTORED' : 'REPLACEMENT'}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            <circle cx={C} cy={C} r={40} fill="#e8f1fd" stroke="#3b78d8" />
            <g className="spin-rev-fast">
              <circle cx={C} cy={C} r={32} fill="none" stroke="#7fa9e3" strokeDasharray="3 3" />
            </g>
            <text x={C} y={C + 3} textAnchor="middle" fontSize={9} letterSpacing={2} className="fill-[#2f64b5] font-mono">
              CORE
            </text>
          </svg>
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Recovery Gauge" code="REC-01">
          <div className="flex flex-col items-center">
          <RecoveryGauge progress={progress} phase={phase} />
          <AnimatePresence>
            {phase === 'restored' && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 rounded-md border border-rose bg-blush px-3 py-1 font-mono text-xs uppercase tracking-[0.25em] text-[#2f5ea8]"
              >
                Replica Restored
              </motion.p>
            )}
          </AnimatePresence>
          </div>
        </Panel>
        <Panel title="Controls" code="CTL">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={simulate}
              disabled={phase !== 'healthy' && phase !== 'restored'}
              className="flex items-center justify-center gap-2 rounded-md border border-rose bg-blush px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#2f5ea8] transition hover:bg-rose hover:text-card disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Power className="size-4" aria-hidden />
              Simulate N04 Failure
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-cream px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:bg-petal"
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </button>
          </div>
        </Panel>
        <Panel title="Sequence" code="SEQ">
          <ol className="flex flex-col gap-2">
            {(['failure', 'reroute', 'replace', 'recovering', 'restored'] as Phase[]).map((p, i, arr) => {
              const idx = arr.indexOf(phase as Phase)
              const done = idx >= i
              return (
                <li key={p} className="flex items-center gap-3">
                  <span className={cn('flex size-5 items-center justify-center rounded-full border font-mono text-[9px]', done ? 'border-rose bg-blush text-[#2f5ea8]' : 'border-line text-muted-foreground')}>
                    {i + 1}
                  </span>
                  <TechnicalLabel className={done ? 'text-foreground' : undefined}>{PHASE_LABEL[p]}</TechnicalLabel>
                </li>
              )
            })}
          </ol>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
            <Readout label="MTTR" value="6.4s" />
            <Readout label="Bytes Moved" value={`${Math.round(progress * 3.9)} GB`} />
          </div>
        </Panel>
      </div>
    </div>
  )
}
