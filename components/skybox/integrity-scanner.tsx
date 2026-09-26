'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { polar } from '@/lib/skybox-data'
import { MechanicalRing } from './mechanical'
import { Bar, Panel, Readout, StatusIndicator, TechnicalLabel } from './primitives'

const SWEEP = 6
const C = 220
const HEX = '0123456789abcdef'

function seededHash(seed: number) {
  let s = seed
  let out = ''
  for (let i = 0; i < 16; i++) {
    s = (s * 9301 + 49297) % 233280
    out += HEX[Math.floor((s / 233280) * 16)]
  }
  return out
}

const RINGS = [
  { r: 80, count: 18 },
  { r: 110, count: 26 },
  { r: 140, count: 34 },
  { r: 170, count: 42 },
]

function arcPath(r: number, a0: number, a1: number, w: number) {
  const p0 = polar(C, C, r, a0)
  const p1 = polar(C, C, r, a1)
  const q0 = polar(C, C, r - w, a1)
  const q1 = polar(C, C, r - w, a0)
  return `M${p0.x},${p0.y} A${r},${r} 0 0 1 ${p1.x},${p1.y} L${q0.x},${q0.y} A${r - w},${r - w} 0 0 0 ${q1.x},${q1.y} Z`
}

function ScanDisk() {
  const beam = `M${C},${C} L${polar(C, C, 190, -14).x},${polar(C, C, 190, -14).y} A190,190 0 0 1 ${polar(C, C, 190, 0).x},${polar(C, C, 190, 0).y} Z`
  return (
    <svg viewBox="0 0 440 440" className="h-auto w-full max-w-[520px]" role="img" aria-label="Integrity scanning disk">
      <defs>
        <linearGradient id="beam" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#cfe0f8" stopOpacity="0" />
          <stop offset="100%" stopColor="#7fa9e3" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g className="spin-rev">
        <MechanicalRing cx={C} cy={C} r={212} ticks={180} majorEvery={15} tickLength={10} />
      </g>
      <circle cx={C} cy={C} r={190} fill="#ffffff" stroke="#7fa9e3" />

      {RINGS.map((ring, ri) =>
        Array.from({ length: ring.count }).map((_, i) => {
          const step = 360 / ring.count
          const a0 = i * step + 1.2
          const a1 = (i + 1) * step - 1.2
          const mid = (a0 + a1) / 2
          const flagged = ri === 2 && i === 11
          return (
            <path key={`${ri}-${i}`} d={arcPath(ring.r + 12, a0, a1, 18)} fill={flagged ? '#f6d9a8' : '#f0f5fc'} stroke="#d6e3f5" strokeWidth={0.5}>
              <animate
                attributeName="fill"
                values={flagged ? '#f6d9a8;#7fa9e3;#f6d9a8;#f6d9a8' : '#f0f5fc;#7fa9e3;#cfe0f8;#f0f5fc'}
                keyTimes="0;0.02;0.25;1"
                dur={`${SWEEP}s`}
                begin={`${(mid / 360) * SWEEP}s`}
                repeatCount="indefinite"
              />
            </path>
          )
        }),
      )}

      <g style={{ animation: `spin-cw ${SWEEP}s linear infinite`, transformOrigin: `${C}px ${C}px` }}>
        <path d={beam} fill="url(#beam)" />
        <line x1={C} y1={C} x2={C} y2={C - 190} stroke="#3b78d8" strokeWidth={1.5} />
        <circle cx={C} cy={C - 186} r={3} fill="#3b78d8" />
      </g>

      <circle cx={C} cy={C} r={54} fill="#e8f1fd" stroke="#3b78d8" />
      <g className="spin-fast">
        <circle cx={C} cy={C} r={46} fill="none" stroke="#7fa9e3" strokeDasharray="2 3" />
      </g>
      <text x={C} y={C - 2} textAnchor="middle" fontSize={12} fontWeight={600} letterSpacing={2} className="fill-[#2f64b5] font-mono">
        SHA-256
      </text>
      <text x={C} y={C + 13} textAnchor="middle" fontSize={7} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        SCANNING
      </text>
    </svg>
  )
}

function ChecksumWheel() {
  return (
    <svg viewBox="0 0 160 160" className="size-40" aria-hidden>
      <g className="spin-mid">
        {Array.from({ length: 16 }).map((_, i) => {
          const p = polar(80, 80, 62, i * 22.5)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={10} className="fill-[#7d9dcc] font-mono">
              {HEX[i]}
            </text>
          )
        })}
      </g>
      <g className="spin-rev-fast">
        <MechanicalRing cx={80} cy={80} r={48} ticks={32} majorEvery={4} dashed />
      </g>
      <circle cx={80} cy={80} r={34} fill="#e8f1fd" stroke="#7fa9e3" />
      <text x={80} y={84} textAnchor="middle" fontSize={11} className="fill-[#2f64b5] font-mono">
        0x7F
      </text>
    </svg>
  )
}

export function IntegrityScanner() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 700)
    return () => clearInterval(id)
  }, [])

  const hashes = Array.from({ length: 8 }).map((_, i) => {
    const n = tick + 8 - i
    return { n, id: `OBJ-${String(10000 + (n * 37) % 48291).padStart(5, '0')}`, hash: seededHash(n * 131 + 7), flagged: n % 23 === 0 }
  })

  const verifiedPct = 72 + ((tick * 0.4) % 28)
  const verified = Math.floor(48291 * (verifiedPct / 100))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Panel title="Scanning Disk" code="SCN-01" className="p-5">
        <div className="flex flex-col items-center">
          <ScanDisk />
          <div className="mt-4 w-full max-w-md">
            <div className="mb-1.5 flex justify-between">
              <TechnicalLabel>Verification Progress</TechnicalLabel>
              <span className="font-mono text-xs tabular-nums text-foreground">{verifiedPct.toFixed(1)}%</span>
            </div>
            <Bar value={verifiedPct} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Hash Stream" code="HSH">
          <ul className="flex h-64 flex-col gap-1 overflow-hidden" aria-live="off">
            <AnimatePresence initial={false}>
              {hashes.map((h) => (
                <motion.li
                  key={h.n}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-sm border border-line bg-cream px-2 py-1 font-mono text-[11px]"
                >
                  <StatusIndicator status={h.flagged ? 'degraded' : 'healthy'} />
                  <span className="text-muted-foreground">{h.id}</span>
                  <span className="flex-1 truncate text-right text-foreground">{h.hash}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Panel>
        <Panel title="Checksum Wheel" code="CKW">
          <div className="flex items-center gap-4">
            <ChecksumWheel />
            <div className="flex flex-col gap-3">
              <Readout label="Verified" value={verified.toLocaleString()} />
              <Readout label="Corrupt" value="1" />
              <Readout label="Repaired" value="1" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
