import type { CSSProperties } from 'react'

/**
 * Loading placeholder for lazy-loaded page sections. Renders a title
 * bar, subtitle bars, and a content block of the supplied height so
 * users see a structured loading state instead of a blank gap while
 * the real section's JS chunk arrives.
 *
 * Tokens-driven colors keep the skeleton visually consistent across
 * themes (default + twilight-neo, light + dark).
 */
export function SectionSkeleton({
  minHeight,
  contentHeightClass,
}: {
  minHeight: number
  contentHeightClass: string
}) {
  const style: CSSProperties = { minHeight }
  return (
    <div
      role="status"
      aria-label="Loading section"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20"
      style={style}
    >
      <div className="mb-8 max-w-3xl space-y-4">
        <div className="h-10 w-3/4 max-w-xl rounded-md bg-[var(--color-background-secondary)] animate-pulse" />
        <div className="h-4 w-full rounded bg-[var(--color-background-secondary)] animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-[var(--color-background-secondary)] animate-pulse" />
      </div>
      <div
        className={`${contentHeightClass} rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] animate-pulse`}
      />
    </div>
  )
}
