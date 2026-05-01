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
      className="relative mt-[64px] w-full border-b text-sm sm:mt-[68px]"
      style={{
        borderColor: 'color-mix(in oklab, var(--color-accent-primary) 22%, transparent)',
        background:
          'linear-gradient(90deg, color-mix(in oklab, var(--color-background-primary) 92%, transparent), color-mix(in oklab, var(--color-accent-primary) 8%, transparent) 50%, color-mix(in oklab, var(--color-background-primary) 92%, transparent))',
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-10 py-2.5 sm:flex-row sm:justify-center sm:gap-4 sm:px-4">
        <span className="text-center text-[13px] font-medium leading-snug sm:text-sm sm:text-left">
          New benchmarks: 85.6% on LongMemEval-S (+1.4 above{' '}
          <a
            href="https://mastra.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            Mastra
          </a>
          's Observational Memory at gpt-4o) and 70.2% on LongMemEval-M.
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
          className="absolute right-2 top-2 px-2 py-0.5 text-base leading-none opacity-60 hover:opacity-100 sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ×
        </button>
      </div>
    </aside>
  )
}
