'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { NAV_ITEMS } from '@/lib/skybox-data'
import { StatusIndicator } from './primitives'
import { cn } from '@/lib/utils'

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#7fa9e3" />
      <g className="spin-mid">
        <circle cx="16" cy="16" r="10.5" fill="none" stroke="#3b78d8" strokeDasharray="2 3" />
      </g>
      <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#cfe0f8" stroke="#3b78d8" />
      <circle cx="16" cy="16" r="2" fill="#3b78d8" />
    </svg>
  )
}

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="SKYBOX home">
          <Logo />
          <span className="font-mono text-sm font-semibold tracking-[0.3em] text-[#2f64b5]">SKYBOX</span>
        </Link>

        <span aria-hidden className="hidden h-6 w-px bg-line lg:block" />

        <nav aria-label="Modules" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
                      active ? 'text-[#2f64b5]' : 'text-muted-foreground hover:bg-petal hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-md border border-rose/50 bg-petal"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {active && (
                        <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden>
                          <g className="spin-fast">
                            <circle cx="5" cy="5" r="4" fill="none" stroke="#3b78d8" strokeDasharray="1.5 1.2" />
                          </g>
                          <circle cx="5" cy="5" r="1.5" fill="#3b78d8" />
                        </svg>
                      )}
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3 py-1 md:flex">
          <StatusIndicator label="System Online" />
        </div>
      </div>
    </header>
  )
}
