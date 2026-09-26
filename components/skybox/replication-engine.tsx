'use client'

import { useState } from 'react'
import { Gear, MechanicalRing } from './mechanical'

const EX = 450
const EY = 220
const DUR = 4.5

const PATHS = [
  { id: 'N01', label: 'REPLICA-01', d: `M${EX + 70},${EY} C640,${EY} 650,70 820,70`, end: { x: 820, y: 70 } },
  { id: 'N04', label: 'REPLICA-02', d: `M${EX + 70},${EY} L820,${EY}`, end: { x: 820, y: EY } },
  { id: 'N07', label: 'REPLICA-03', d: `M${EX + 70},${EY} C640,${EY} 650,370 820,370`, end: { x: 820, y: 370 } },
]
const INPUT = `M40,${EY} L${EX - 70},${EY}`

export function ReplicationEngine() {
  const [hover, setHover] = useState<string | null>(null)

  return (
    <svg viewBox="0 0 900 440" className="h-auto w-full" role="img" aria-label="Replication engine splitting one object into three replicas">
      <line x1={40} y1={EY} x2={EX - 70} y2={EY} stroke="#d6e3f5" strokeWidth={10} strokeLinecap="round" />
      <line x1={40} y1={EY} x2={EX - 70} y2={EY} stroke="#7fa9e3" strokeWidth={1} className="flow-dash" />
      <text x={40} y={EY - 22} fontSize={9} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        INGEST · 1 OBJECT
      </text>

      <g>
        <rect x={-14} y={-14} width={28} height={28} rx={4} fill="#e3edfc" stroke="#3b78d8" />
        <rect x={-7} y={-7} width={14} height={14} rx={2} fill="#ffffff" stroke="#7fa9e3" />
        <animateMotion dur={`${DUR}s`} repeatCount="indefinite" path={INPUT} keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="linear" />
        <animate attributeName="opacity" dur={`${DUR}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.05;0.38;0.42;1" />
      </g>

      {PATHS.map((p, i) => {
        const lit = hover === p.id
        const dim = hover && !lit
        return (
          <g
            key={p.id}
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer"
            opacity={dim ? 0.35 : 1}
            style={{ transition: 'opacity 250ms' }}
          >
            <path d={p.d} fill="none" stroke="#e8f1fd" strokeWidth={22} strokeLinecap="round" />
            <path d={p.d} fill="none" stroke={lit ? '#3b78d8' : '#d6e3f5'} strokeWidth={lit ? 8 : 6} strokeLinecap="round" />
            <path d={p.d} fill="none" stroke={lit ? '#ffffff' : '#7fa9e3'} strokeWidth={1} className="flow-dash" />
            <g>
              <rect x={-9} y={-9} width={18} height={18} rx={3} fill="#ffffff" stroke="#3b78d8" />
              <circle r={3} fill="#7fa9e3" />
              <animateMotion dur={`${DUR}s`} repeatCount="indefinite" path={p.d} keyPoints="0;0;1;1" keyTimes="0;0.5;0.9;1" calcMode="linear" />
              <animate attributeName="opacity" dur={`${DUR}s`} repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.48;0.52;0.9;1" />
            </g>

            <g transform={`translate(${p.end.x},${p.end.y})`}>
              <g className={lit ? 'spin-fast' : 'spin-slow'}>
                <MechanicalRing cx={0} cy={0} r={36} ticks={30} majorEvery={5} tickLength={4} />
              </g>
              <circle r={28} fill={lit ? '#e3edfc' : '#ffffff'} stroke="#7fa9e3" />
              <text y={-2} textAnchor="middle" fontSize={12} fontWeight={600} className="fill-[#2f64b5] font-mono">
                {p.id}
              </text>
              <text y={11} textAnchor="middle" fontSize={6.5} letterSpacing={1} className="fill-[#7d9dcc] font-mono">
                {p.label}
              </text>
              <circle cx={22} cy={-22} r={3} fill="#7fa9e3" className="led" style={{ animationDelay: `${i * 0.3}s` }} />
            </g>
          </g>
        )
      })}

      <g className="spin-slow">
        <MechanicalRing cx={EX} cy={EY} r={150} ticks={90} majorEvery={9} tickLength={10} />
      </g>
      <g className="spin-rev">
        <circle cx={EX} cy={EY} r={128} fill="none" stroke="#cfe0f8" strokeWidth={8} strokeDasharray="14 8" />
      </g>
      <g className="spin-mid">
        <MechanicalRing cx={EX} cy={EY} r={110} ticks={48} majorEvery={4} dashed />
      </g>
      <Gear cx={EX - 58} cy={EY - 62} r={24} teeth={12} className="spin-mid" />
      <Gear cx={EX + 58} cy={EY + 62} r={24} teeth={12} className="spin-rev-fast" />
      <Gear cx={EX + 62} cy={EY - 58} r={16} teeth={9} className="spin-fast" />

      <circle cx={EX} cy={EY} r={70} fill="#ffffff" stroke="#3b78d8" />
      <g className="spin-rev-fast">
        <circle cx={EX} cy={EY} r={60} fill="none" stroke="#7fa9e3" strokeDasharray="2 4" />
      </g>
      <circle cx={EX} cy={EY} r={46} fill="#e8f1fd" stroke="#7fa9e3" />
      <circle cx={EX} cy={EY} r={46} fill="none" stroke="#3b78d8" strokeWidth={2}>
        <animate attributeName="r" dur={`${DUR}s`} repeatCount="indefinite" values="46;46;54;46;46" keyTimes="0;0.4;0.47;0.55;1" />
        <animate attributeName="stroke-opacity" dur={`${DUR}s`} repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.4;0.47;0.55;1" />
      </circle>
      <text x={EX} y={EY - 4} textAnchor="middle" fontSize={20} fontWeight={600} className="fill-[#2f64b5] font-mono">
        ×3
      </text>
      <text x={EX} y={EY + 14} textAnchor="middle" fontSize={7} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        SPLITTER
      </text>
      <text x={EX} y={EY + 186} textAnchor="middle" fontSize={9} letterSpacing={2} className="fill-[#7d9dcc] font-mono">
        1 OBJECT → 3 REPLICAS
      </text>
    </svg>
  )
}
