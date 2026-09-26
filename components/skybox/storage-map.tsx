'use client'

import { useState } from 'react'
import { NODES } from '@/lib/skybox-data'
import { StorageNode } from './storage-node'
import { Gear, MechanicalRing } from './mechanical'
import { TechnicalLabel } from './primitives'

const TOP = NODES.slice(0, 4)
const BOTTOM = NODES.slice(4, 8)
const COL_X = [12.5, 37.5, 62.5, 87.5]

export function StorageMap() {
  const [active, setActive] = useState<string | null>(null)

  const linkActive = (id: string) => active === id

  return (
    <div className="relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {COL_X.map((x, i) => (
          <g key={`t-${i}`}>
            <path
              d={`M${x},20 C${x},40 50,38 50,50`}
              fill="none"
              stroke={linkActive(TOP[i].id) ? '#3b78d8' : '#d6e3f5'}
              strokeWidth={linkActive(TOP[i].id) ? 2 : 1}
              vectorEffect="non-scaling-stroke"
              className={linkActive(TOP[i].id) ? 'flow-dash' : undefined}
            />
            <path
              d={`M${x},80 C${x},60 50,62 50,50`}
              fill="none"
              stroke={linkActive(BOTTOM[i].id) ? '#3b78d8' : '#d6e3f5'}
              strokeWidth={linkActive(BOTTOM[i].id) ? 2 : 1}
              vectorEffect="non-scaling-stroke"
              className={linkActive(BOTTOM[i].id) ? 'flow-dash' : undefined}
            />
          </g>
        ))}
      </svg>

      <div className="relative grid gap-4 md:grid-cols-4">
        {TOP.map((n) => (
          <StorageNode key={n.id} node={n} active={active === n.id} onActivate={() => setActive(n.id)} onDeactivate={() => setActive(null)} />
        ))}
      </div>

      <div className="relative my-10 flex justify-center">
        <div className="relative">
          <svg viewBox="0 0 260 180" className="h-auto w-[260px]" role="img" aria-label="SKYBOX storage core">
            <g className="spin-mid">
              <Gear cx={40} cy={90} r={30} teeth={14} />
            </g>
            <g className="spin-rev">
              <Gear cx={220} cy={90} r={30} teeth={14} />
            </g>
            <rect x={60} y={40} width={140} height={100} rx={8} fill="#ffffff" stroke="#7fa9e3" />
            <rect x={68} y={48} width={124} height={84} rx={5} fill="#e8f1fd" stroke="#d6e3f5" />
            <g className="spin-slow">
              <MechanicalRing cx={130} cy={90} r={36} ticks={40} majorEvery={5} />
            </g>
            <text x={130} y={88} textAnchor="middle" fontSize={13} fontWeight={600} letterSpacing={3} className="fill-[#2f64b5] font-mono">
              SKYBOX
            </text>
            <text x={130} y={102} textAnchor="middle" fontSize={7} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
              STORAGE CORE
            </text>
            {[76, 84, 92].map((x) => (
              <circle key={x} cx={x} cy={124} r={2} fill="#7fa9e3" className="led" />
            ))}
          </svg>
          <TechnicalLabel className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">4.8 TB · 8 UNITS · RF 3</TechnicalLabel>
        </div>
      </div>

      <div className="relative grid gap-4 md:grid-cols-4">
        {BOTTOM.map((n) => (
          <StorageNode key={n.id} node={n} active={active === n.id} onActivate={() => setActive(n.id)} onDeactivate={() => setActive(null)} />
        ))}
      </div>
    </div>
  )
}
