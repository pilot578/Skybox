'use client'

import { useState } from 'react'
import { NODES, polar } from '@/lib/skybox-data'
import { FlowParticle, Gear, MechanicalRing } from './mechanical'

const C = 300
const ORBIT = 218

export function OrbitSystem() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full max-w-[640px]" role="img" aria-label="SKYBOX core with 12 orbiting storage nodes">
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="#e3edfc" />
          <stop offset="100%" stopColor="#f7faff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={290} fill="url(#core-glow)" />

      <g className="spin-slow">
        <MechanicalRing cx={C} cy={C} r={288} ticks={120} majorEvery={10} tickLength={10} />
      </g>
      <g className="spin-rev">
        <MechanicalRing cx={C} cy={C} r={262} ticks={72} majorEvery={6} dashed />
      </g>

      {[0, 90, 180, 270].map((a) => {
        const p = polar(C, C, 276, a)
        return (
          <text key={a} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={8} className="fill-[#7d9dcc] font-mono" letterSpacing={1.5}>
            {String(a).padStart(3, '0')}°
          </text>
        )
      })}

      <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="#d6e3f5" />

      <g style={{ animation: 'spin-cw 120s linear infinite', transformOrigin: `${C}px ${C}px` }}>
        {NODES.map((n, i) => {
          const angle = (360 / NODES.length) * i
          const p = polar(C, C, ORBIT, angle)
          const path = `M${C},${C} L${p.x},${p.y}`
          const active = hovered === n.id
          return (
            <g key={`link-${n.id}`}>
              <line
                x1={C}
                y1={C}
                x2={p.x}
                y2={p.y}
                stroke={active ? '#3b78d8' : '#d6e3f5'}
                strokeWidth={active ? 1.5 : 1}
                className={active ? 'flow-dash' : undefined}
              />
              <FlowParticle path={path} duration={2.2 + (i % 4) * 0.5} delay={i * 0.3} r={active ? 3 : 2} />
            </g>
          )
        })}

        {NODES.map((n, i) => {
          const next = NODES[(i + 3) % NODES.length]
          const a = polar(C, C, ORBIT, (360 / NODES.length) * i)
          const b = polar(C, C, ORBIT, (360 / NODES.length) * ((i + 3) % NODES.length))
          const path = `M${a.x},${a.y} Q${C},${C} ${b.x},${b.y}`
          return (
            <g key={`arc-${n.id}-${next.id}`}>
              <path d={path} fill="none" stroke="#cfe0f8" strokeWidth={0.6} strokeDasharray="2 4" />
              {i % 2 === 0 && <FlowParticle path={path} duration={4} delay={i * 0.5} r={1.6} color="#7fa9e3" />}
            </g>
          )
        })}

        {NODES.map((n, i) => {
          const angle = (360 / NODES.length) * i
          const p = polar(C, C, ORBIT, angle)
          const active = hovered === n.id
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <g style={{ animation: 'spin-ccw 120s linear infinite', transformOrigin: `${p.x}px ${p.y}px` }}>
                <circle cx={p.x} cy={p.y} r={active ? 30 : 24} fill="#ffffff" stroke={active ? '#3b78d8' : '#7fa9e3'} strokeWidth={active ? 1.5 : 1} style={{ transition: 'r 300ms' }} />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 25 : 19}
                  fill="none"
                  stroke="#cfe0f8"
                  strokeWidth={3}
                  strokeDasharray={`${(n.health / 100) * 2 * Math.PI * 19} 999`}
                  style={{ transition: 'r 300ms' }}
                />
                <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} className="fill-[#2f64b5] font-mono">
                  {n.id}
                </text>
                <circle cx={p.x + 16} cy={p.y - 16} r={2.5} fill={n.status === 'degraded' ? '#f0b07a' : n.status === 'syncing' ? '#f6d9a8' : '#7fa9e3'} className="led" />
                {active && (
                  <g>
                    <rect x={p.x - 42} y={p.y + 34} width={84} height={30} rx={4} fill="#ffffff" stroke="#7fa9e3" />
                    <text x={p.x} y={p.y + 46} textAnchor="middle" fontSize={7} className="fill-[#6b8fc4] font-mono" letterSpacing={1}>
                      {n.zone} · {n.latency}ms
                    </text>
                    <text x={p.x} y={p.y + 57} textAnchor="middle" fontSize={7} className="fill-[#2f5ea8] font-mono" letterSpacing={1}>
                      {n.objects.toLocaleString()} OBJ
                    </text>
                  </g>
                )}
              </g>
            </g>
          )
        })}
      </g>

      <circle cx={C} cy={C} r={110} fill="none" stroke="#d6e3f5" strokeDasharray="1 4" />
      <Gear cx={C - 70} cy={C - 58} r={26} teeth={12} className="spin-mid" />
      <Gear cx={C + 72} cy={C + 54} r={22} teeth={10} className="spin-rev-fast" />

      <g className="spin-rev-fast">
        <MechanicalRing cx={C} cy={C} r={84} ticks={48} majorEvery={4} />
      </g>
      <circle cx={C} cy={C} r={70} fill="#ffffff" stroke="#7fa9e3" />
      <g className="spin-mid">
        <circle cx={C} cy={C} r={62} fill="none" stroke="#cfe0f8" strokeWidth={6} strokeDasharray="10 6" />
      </g>
      <circle cx={C} cy={C} r={48} fill="#e8f1fd" stroke="#3b78d8" />
      <text x={C} y={C - 6} textAnchor="middle" fontSize={14} fontWeight={600} letterSpacing={4} className="fill-[#2f64b5] font-mono">
        SKYBOX
      </text>
      <text x={C} y={C + 10} textAnchor="middle" fontSize={7} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        CORE · SYS-01
      </text>
      <text x={C} y={C + 22} textAnchor="middle" fontSize={7} letterSpacing={2} className="fill-[#3b78d8] font-mono">
        SYNC 100%
      </text>
    </svg>
  )
}
