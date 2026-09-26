import { cn } from '@/lib/utils'
import type { NodeStatus } from '@/lib/skybox-data'

export function TechnicalLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

const STATUS_COLOR: Record<NodeStatus | 'online', string> = {
  healthy: 'bg-[#7fa9e3]',
  online: 'bg-[#7fa9e3]',
  syncing: 'bg-[#f6d9a8]',
  degraded: 'bg-[#f0b07a]',
  offline: 'bg-[#d6e3f5]',
}

export function StatusIndicator({
  status = 'online',
  label,
  className,
}: {
  status?: NodeStatus | 'online'
  label?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex size-2">
        {status !== 'offline' && (
          <span className={cn('led absolute inset-0 rounded-full opacity-60 blur-[3px]', STATUS_COLOR[status])} />
        )}
        <span className={cn('relative size-2 rounded-full border border-[#3b78d8]/40', STATUS_COLOR[status])} />
      </span>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">{label}</span>
      )}
    </span>
  )
}

export function Panel({
  children,
  className,
  code,
  title,
}: {
  children: React.ReactNode
  className?: string
  code?: string
  title?: string
}) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-line bg-card/80 p-4 shadow-[0_1px_0_#fff,0_8px_24px_-12px_rgba(227,167,159,0.35)] backdrop-blur-sm',
        className,
      )}
    >
      <CornerTicks />
      {(code || title) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <TechnicalLabel className="text-foreground">{title}</TechnicalLabel>}
          {code && <TechnicalLabel>{code}</TechnicalLabel>}
        </div>
      )}
      {children}
    </div>
  )
}

export function CornerTicks() {
  const base = 'pointer-events-none absolute size-2 border-rose/70'
  return (
    <>
      <span aria-hidden className={cn(base, '-left-px -top-px border-l border-t')} />
      <span aria-hidden className={cn(base, '-right-px -top-px border-r border-t')} />
      <span aria-hidden className={cn(base, '-bottom-px -left-px border-b border-l')} />
      <span aria-hidden className={cn(base, '-bottom-px -right-px border-b border-r')} />
    </>
  )
}

export function PageHeader({
  code,
  title,
  subtitle,
  children,
}: {
  code: string
  title: string
  subtitle: string
  children?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <TechnicalLabel className="rounded-sm border border-line bg-petal px-1.5 py-0.5 text-foreground">
            {code}
          </TechnicalLabel>
          <span aria-hidden className="h-px w-12 bg-rose/60" />
          <TechnicalLabel>SYS-01 / SKYBOX</TechnicalLabel>
        </div>
        <h1 className="text-balance text-3xl font-medium tracking-tight text-[#2f64b5] md:text-4xl">{title}</h1>
        <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </header>
  )
}

export function Readout({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <TechnicalLabel>{label}</TechnicalLabel>
      <span className="font-mono text-sm tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blush to-rose transition-[width] duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
