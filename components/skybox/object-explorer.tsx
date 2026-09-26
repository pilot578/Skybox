'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Archive, Database, FileText, Film, Image as ImageIcon, ScrollText, Search, ShieldCheck, ShieldAlert } from 'lucide-react'
import { OBJECTS, type ObjectData } from '@/lib/skybox-data'
import { CornerTicks, TechnicalLabel } from './primitives'
import { cn } from '@/lib/utils'

const ICONS = {
  document: FileText,
  image: ImageIcon,
  archive: Archive,
  dataset: Database,
  video: Film,
  log: ScrollText,
} as const

const FILTERS = ['all', 'document', 'image', 'archive', 'dataset', 'video', 'log'] as const

function ReplicaChain({ replicas }: { replicas: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {replicas.map((r, i) => (
        <div key={r} className="flex items-center gap-1">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="rounded-sm border border-rose/60 bg-petal px-1.5 py-0.5 font-mono text-[10px] text-foreground"
          >
            {r}
          </motion.span>
          {i < replicas.length - 1 && (
            <svg viewBox="0 0 30 8" className="h-2 w-7" aria-hidden>
              <line x1="0" y1="4" x2="30" y2="4" stroke="#7fa9e3" className="flow-dash" />
              <circle r="1.8" fill="#3b78d8">
                <animateMotion dur="0.9s" repeatCount="indefinite" path="M0,4 L30,4" begin={`${i * 0.2}s`} />
              </circle>
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

function ObjectModule({ obj, index }: { obj: ObjectData; index: number }) {
  const [hover, setHover] = useState(false)
  const Icon = ICONS[obj.type]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, rotateX: 20 }}
      animate={{ opacity: 1, y: [0, -4, 0], rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.04 },
        rotateX: { duration: 0.5, delay: index * 0.04 },
        y: { duration: 4 + (index % 3), repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
        layout: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow] duration-300',
        hover ? 'border-rose shadow-[0_20px_40px_-18px_rgba(217,146,138,0.6)]' : 'border-line',
      )}
    >
      <CornerTicks />
      <div className="relative flex h-24 items-center justify-center overflow-hidden border-b border-line bg-petal/60">
        <svg viewBox="0 0 200 96" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={i * 22} y1="0" x2={i * 22} y2="96" stroke="#d6e3f5" strokeWidth="0.6" />
          ))}
        </svg>
        <motion.div
          animate={{ rotateY: hover ? 180 : 0, scale: hover ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          className="relative flex size-14 items-center justify-center rounded-md border border-rose/60 bg-card shadow-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Icon className="size-6 text-[#3b78d8]" aria-hidden />
        </motion.div>
        <TechnicalLabel className="absolute left-2 top-2">{obj.id}</TechnicalLabel>
        <span className="absolute right-2 top-2">
          {obj.verified ? (
            <ShieldCheck className="size-4 text-[#3b78d8]" aria-label="Verified" />
          ) : (
            <ShieldAlert className="size-4 text-[#f0b07a]" aria-label="Pending verification" />
          )}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <h3 className="truncate font-mono text-sm text-[#2f64b5]">{obj.name}</h3>
        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <span>{obj.size}</span>
          <span>{obj.replicas.length} replicas</span>
        </div>
        <TechnicalLabel>{obj.verified ? 'SHA-256 verified' : 'SHA-256 pending'}</TechnicalLabel>
        <AnimatePresence initial={false}>
          {hover && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 border-t border-line pt-2">
                <TechnicalLabel>Replica path</TechnicalLabel>
                <ReplicaChain replicas={obj.replicas} />
                <span className="font-mono text-[10px] text-muted-foreground">HASH {obj.hash}…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export function ObjectExplorer() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

  const items = useMemo(
    () =>
      OBJECTS.filter(
        (o) =>
          (filter === 'all' || o.type === filter) &&
          (o.name.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, filter],
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-line bg-card/80 p-3 md:flex-row md:items-center">
        <label className="relative flex flex-1 items-center">
          <span className="sr-only">Search objects</span>
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search OBJ-ID or filename…"
            className="h-9 w-full rounded-md border border-line bg-cream pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-rose focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                'rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                filter === f ? 'border-rose bg-blush text-[#2f5ea8]' : 'border-line bg-cream text-muted-foreground hover:bg-petal',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TechnicalLabel>{items.length} modules in view</TechnicalLabel>
        <TechnicalLabel>INDEX 48,291 · RF 3</TechnicalLabel>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ perspective: 1000 }}>
        <AnimatePresence mode="popLayout">
          {items.map((o, i) => (
            <ObjectModule key={o.id} obj={o} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
      {items.length === 0 && (
        <p className="py-12 text-center font-mono text-sm text-muted-foreground">No modules match this query.</p>
      )}
    </div>
  )
}
