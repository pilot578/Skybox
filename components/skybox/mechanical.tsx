'use client'

import { motion } from 'motion/react'
import { polar } from '@/lib/skybox-data'
import { cn } from '@/lib/utils'

export function MechanicalRing({
  cx,
  cy,
  r,
  ticks = 60,
  majorEvery = 5,
  className,
  tickLength = 6,
  dashed = false,
}: {
  cx: number
  cy: number
  r: number
  ticks?: number
  majorEvery?: number
  className?: string
  tickLength?: number
  dashed?: boolean
}) {
  return (
    <g className={className}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#7fa9e3"
        strokeOpacity={0.55}
        strokeWidth={1}
        strokeDasharray={dashed ? '2 5' : undefined}
      />
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (360 / ticks) * i
        const major = i % majorEvery === 0
        const len = major ? tickLength : tickLength / 2
        const a = polar(cx, cy, r, angle)
        const b = polar(cx, cy, r - len, angle)
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#3b78d8"
            strokeOpacity={major ? 0.8 : 0.4}
            strokeWidth={major ? 1 : 0.6}
          />
        )
      })}
    </g>
  )
}

export function Gear({
  cx,
  cy,
  r,
  teeth = 16,
  className,
  fill = '#e8f1fd',
}: {
  cx: number
  cy: number
  r: number
  teeth?: number
  className?: string
  fill?: string
}) {
  const inner = r * 0.82
  const pts: string[] = []
  const step = 360 / (teeth * 2)
  for (let i = 0; i < teeth * 2; i++) {
    const rr = i % 2 === 0 ? r : inner
    const a1 = polar(cx, cy, rr, i * step - step * 0.35)
    const a2 = polar(cx, cy, rr, i * step + step * 0.35)
    pts.push(`${a1.x},${a1.y}`, `${a2.x},${a2.y}`)
  }
  return (
    <g className={className}>
      <polygon points={pts.join(' ')} fill={fill} stroke="#7fa9e3" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#ffffff" stroke="#7fa9e3" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#cfe0f8" stroke="#3b78d8" strokeWidth={0.8} />
      {[0, 90, 180, 270].map((a) => {
        const p = polar(cx, cy, r * 0.3, a)
        return <circle key={a} cx={p.x} cy={p.y} r={r * 0.05} fill="#7fa9e3" />
      })}
    </g>
  )
}

export function FlowParticle({
  path,
  duration = 2.4,
  delay = 0,
  r = 2.5,
  color = '#3b78d8',
}: {
  path: string
  duration?: number
  delay?: number
  r?: number
  color?: string
}) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  )
}

export function MechanicalGauge({
  value,
  max = 100,
  label,
  display,
  sub,
  size = 150,
  className,
}: {
  value: number
  max?: number
  label: string
  display: string
  sub?: string
  size?: number
  className?: string
}) {
  const c = 60
  const r = 46
  const sweep = 270
  const start = -135
  const pct = Math.min(1, Math.max(0, value / max))
  const needleAngle = start + sweep * pct

  return (
    <div className={cn('group flex flex-col items-center', className)} style={{ width: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${label}: ${display}`}>
        <circle cx={c} cy={c} r={56} fill="#ffffff" stroke="#d6e3f5" />
        <g className="spin-rev origin-center transition-transform">
          <circle cx={c} cy={c} r={53} fill="none" stroke="#cfe0f8" strokeDasharray="1 3" />
        </g>
        {Array.from({ length: 28 }).map((_, i) => {
          const a = start + (sweep / 27) * i
          const p1 = polar(c, c, 52, a)
          const p2 = polar(c, c, i % 3 === 0 ? 46 : 49, a)
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3b78d8" strokeOpacity={i % 3 === 0 ? 0.8 : 0.35} strokeWidth={0.8} />
          )
        })}
        <circle
          cx={c}
          cy={c}
          r={r - 6}
          fill="none"
          stroke="#f0f5fc"
          strokeWidth={5}
          strokeDasharray={`${(sweep / 360) * 2 * Math.PI * (r - 6)} 999`}
          transform={`rotate(${start - 90 + 360} ${c} ${c})`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={c}
          cy={c}
          r={r - 6}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={5}
          strokeLinecap="round"
          transform={`rotate(${start - 90 + 360} ${c} ${c})`}
          initial={{ strokeDasharray: `0 999` }}
          animate={{ strokeDasharray: `${pct * (sweep / 360) * 2 * Math.PI * (r - 6)} 999` }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.g
          initial={{ rotate: start }}
          animate={{ rotate: needleAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 9 }}
          style={{ transformOrigin: '60px 60px', transformBox: 'view-box' }}
        >
          <line x1={c} y1={c} x2={c} y2={c - 34} stroke="#3b78d8" strokeWidth={1.4} strokeLinecap="round" />
        </motion.g>
        <circle cx={c} cy={c} r={4} fill="#cfe0f8" stroke="#3b78d8" />
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cfe0f8" />
            <stop offset="100%" stopColor="#7fa9e3" />
          </linearGradient>
        </defs>
        <text x={c} y={c + 24} textAnchor="middle" className="fill-[#2f64b5] font-mono" fontSize={11} fontWeight={500}>
          {display}
        </text>
        {sub && (
          <text x={c} y={c + 35} textAnchor="middle" className="fill-[#7d9dcc] font-mono" fontSize={5.5} letterSpacing={1}>
            {sub}
          </text>
        )}
      </svg>
      <span className="-mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  )
}
