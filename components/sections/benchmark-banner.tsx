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
  // Default to VISIBLE so the banner renders on first paint instead of
  // flashing in after hydration. The `useEffect` below hides it for
  // users who previously dismissed it. The brief render-then-hide
  // flicker for dismissed users is preferable to the much longer
  // hidden-then-show flash every fresh visitor was seeing.
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(STORAGE_KEY) === 'dismissed') {
      setHidden(true)
    }
  }, [])

  if (hidden) return null

  return (
    <aside
      role="region"
      aria-label="Latest benchmark result"
      className="relative mt-[64px] w-full text-sm sm:mt-[68px]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-tertiary))',
        color: '#ffffff',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-10 py-2.5 sm:flex-row sm:justify-center sm:gap-4 sm:px-4">
        <span className="text-center text-[13px] font-semibold leading-snug text-white sm:text-sm sm:text-left">
          New benchmarks: 85.6% on LongMemEval-S, 0.4 points behind{' '}
          <a
            href="https://www.emergence.ai/blog/sota-on-longmemeval-with-rag"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white underline underline-offset-2 hover:opacity-90"
          >
            Emergence.ai
          </a>
          &apos;s 86% closed-source SaaS, +1.4 above{' '}
          <a
            href="https://mastra.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white underline underline-offset-2 hover:opacity-90"
          >
            Mastra
          </a>
          &apos;s Observational Memory at gpt-4o (84.23%). 70.2% on M.
        </span>
        <a
          href={BLOG_URL}
          className="rounded-md bg-white/15 px-3 py-1 font-bold text-white underline-offset-4 ring-1 ring-white/30 transition-colors hover:bg-white/25"
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
          className="absolute right-2 top-2 px-2 py-0.5 text-base leading-none text-white opacity-80 hover:opacity-100 sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
        >
          ×
        </button>
      </div>
    </aside>
  )
}
