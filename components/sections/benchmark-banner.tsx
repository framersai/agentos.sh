'use client'

import { useEffect, useState } from 'react'

/**
 * Top-of-page benchmark announcement banner.
 * Surfaces the latest LongMemEval-M result with a CTA to the canonical
 * blog post on docs.agentos.sh. Dismissible per visit; the localStorage
 * key is dated so future banners ship independently.
 */
const STORAGE_KEY = 'agentos-banner-2026-04-29'
const BLOG_URL =
  'https://docs.agentos.sh/blog/2026/04/29/longmemeval-m-70-with-topk5'

export function BenchmarkBanner() {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setHidden(window.localStorage.getItem(STORAGE_KEY) === 'dismissed')
  }, [])

  if (hidden) return null

  return (
    <aside
      role="region"
      aria-label="Latest benchmark result"
      className="relative w-full border-b text-sm"
      style={{
        borderColor: 'color-mix(in oklab, var(--color-accent-primary) 22%, transparent)',
        background:
          'linear-gradient(90deg, color-mix(in oklab, var(--color-background-primary) 92%, transparent), color-mix(in oklab, var(--color-accent-primary) 8%, transparent) 50%, color-mix(in oklab, var(--color-background-primary) 92%, transparent))',
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-2.5 sm:flex-row sm:justify-center sm:gap-4">
        <span className="text-center font-medium sm:text-left">
          New: 70.2% on LongMemEval-M (66.0%–74.0% bootstrap CI), $0.0078 per
          correct.
        </span>
        <a
          href={BLOG_URL}
          className="font-semibold underline-offset-4 hover:underline"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          Read the post →
        </a>
        <button
          type="button"
          aria-label="Dismiss benchmark banner"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, 'dismissed')
            setHidden(true)
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-base leading-none opacity-60 hover:opacity-100"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ×
        </button>
      </div>
    </aside>
  )
}
