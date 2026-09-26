import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { TopNav } from '@/components/skybox/top-nav'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'SKYBOX — Fault-Tolerant Distributed Object Storage',
  description:
    'SKYBOX stores, replicates, verifies, repairs, and rebalances data across unreliable storage nodes. A mechanical control system for distributed storage.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7faff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable} bg-cream`}>
      <body className="bg-blueprint min-h-dvh antialiased">
        <TopNav />
        <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 md:px-6">{children}</main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
