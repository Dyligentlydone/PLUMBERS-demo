'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type NavItem = {
  label: string
  href: string
}

const COMPACT_BREAKPOINT = 1024

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT}px)`)
    const apply = () => {
      setIsCompact(mq.matches)
      // Only auto-collapse on mobile/tablet
      if (mq.matches) setCollapsed(true)
    }
    apply()
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    } else {
      mq.addListener(apply)
      return () => mq.removeListener(apply)
    }
  }, [])

  const items: NavItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Customers', href: '/customers' },
    { label: 'Settings', href: '/settings' },
  ]

  const overlayOpen = isCompact && !collapsed
  const sidebarWidth = collapsed ? 72 : 280

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <div className="relative flex min-h-screen">
        {overlayOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/60"
            onClick={() => setCollapsed(true)}
            aria-hidden="true"
          />
        ) : null}

        <aside
          className={
            'border-r border-white/10 bg-black/95 backdrop-blur ' +
            (isCompact
              ? 'fixed inset-y-0 left-0 z-40 transition-transform duration-200 ' +
                (collapsed ? '-translate-x-full' : 'translate-x-0')
              : 'relative')
          }
          style={{ width: isCompact ? 280 : sidebarWidth }}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <Link className="flex items-center" href="/">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-lg">🔧</span>
                </div>
                {!collapsed && (
                  <span className="text-lg font-bold whitespace-nowrap" style={{ color: '#d7b73f' }}>
                    Plumber Pro
                  </span>
                )}
              </div>
            </Link>
            {!isCompact && (
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="rounded-full border border-[#d7b73f]/30 bg-[#d7b73f]/10 px-3 py-1 text-xs font-semibold flex-shrink-0"
                style={{ color: '#d7b73f' }}
                aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
              >
                {collapsed ? '>' : '<'}
              </button>
            )}
          </div>

          <nav className="relative z-20 px-2 pb-4">
            {items.map((item) => {
              const active = pathname === item.href
              const showFull = !collapsed || isCompact
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    'flex items-center justify-between rounded-full px-3 py-2 text-sm font-medium transition ' +
                    (active
                      ? 'bg-[#d7b73f]/15'
                      : 'hover:bg-[#d7b73f]/10 active:bg-[#d7b73f]/15')
                  }
                  style={{ color: '#d7b73f' }}
                  title={!showFull ? item.label : undefined}
                  onClick={() => {
                    if (isCompact) setCollapsed(true)
                  }}
                >
                  <span className={showFull ? 'truncate' : 'sr-only'}>{item.label}</span>
                  {!showFull ? <span className="mx-auto">•</span> : null}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="relative z-0 min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 flex items-center justify-between gap-2">
              {isCompact ? (
                <button
                  type="button"
                  className="rounded-full border border-[#d7b73f]/30 bg-[#d7b73f]/10 px-3 py-2 text-xs font-semibold"
                  style={{ color: '#d7b73f' }}
                  onClick={() => setCollapsed(false)}
                  aria-label="Open menu"
                >
                  ☰ Menu
                </button>
              ) : (
                <div />
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
