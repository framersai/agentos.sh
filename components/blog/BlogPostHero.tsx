'use client';

import type { Post } from '@/lib/markdown';

/**
 * BlogPostHero renders a visual metrics strip when a post's frontmatter
 * carries `heroStat` + `heroLabel` (and optionally `benchmarkBadge`).
 *
 * Visual treatment matches the OG card style: deep navy gradient
 * background, cyan→purple gradient typography for the headline metric,
 * hex-grid texture, accent corner brackets. The component takes the
 * "this post has a number to announce" signal and elevates it from
 * prose into a hero element so the headline stat is impossible to miss
 * during a scroll.
 *
 * For posts without `heroStat`, the component returns null and the
 * page skips this section entirely.
 *
 * The `heroStat` value supports a "stat-strip" pattern where multiple
 * numbers are separated by ` / ` (e.g. "85.6% / 70.2%") and rendered
 * as side-by-side cards. Single-stat posts get one card spanning the
 * width.
 */

interface BlogPostHeroProps {
  post: Post;
}

interface ParsedStat {
  value: string;
  label: string;
}

/**
 * Split `heroStat` and `heroLabel` into per-stat pairs. The convention:
 *
 *   heroStat:  "85.6% / 70.2%"
 *   heroLabel: "on LongMemEval-S and -M (matched gpt-4o reader)"
 *
 * → 2 stats, both labeled with the full heroLabel since splitting the
 *   label cleanly is harder than just repeating it.
 *
 * For single-value heroStat, returns one entry. For multi-value, the
 * label is shared across all entries.
 */
function parseStats(heroStat: string, heroLabel: string): ParsedStat[] {
  const values = heroStat.split('/').map((v) => v.trim()).filter(Boolean);
  if (values.length <= 1) {
    return [{ value: heroStat.trim(), label: heroLabel }];
  }
  // For multi-stat hero, try to split the label by " and " to give each
  // stat its own contextual label (e.g. "on S and M" → "on S", "on M").
  const labelParts = heroLabel.split(/\s+and\s+/i);
  if (labelParts.length === values.length) {
    return values.map((value, i) => ({ value, label: labelParts[i] }));
  }
  // Fallback: same label for all
  return values.map((value) => ({ value, label: heroLabel }));
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const heroStat = post.heroStat as string | undefined;
  const heroLabel = post.heroLabel as string | undefined;
  const benchmarkBadge = post.benchmarkBadge as string | undefined;

  if (!heroStat || !heroLabel) return null;

  const stats = parseStats(heroStat, heroLabel);

  return (
    <section
      aria-label="Headline metrics"
      className="relative my-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(220,28%,10%)] to-[hsl(220,30%,8%)] p-8"
    >
      {/* Hex-grid texture overlay (matches OG card design language) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><path d='M 30 0 L 60 17 L 60 35 L 30 52 L 0 35 L 0 17 Z' fill='none' stroke='hsl(180,95%,60%)' stroke-width='0.6' /></svg>\")",
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Top-left + top-right corner brackets */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2"
        style={{ borderImage: 'linear-gradient(135deg, hsl(180,95%,60%), hsl(270,85%,65%)) 1' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2"
        style={{ borderImage: 'linear-gradient(135deg, hsl(180,95%,60%), hsl(270,85%,65%)) 1' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-3 bottom-3 h-6 w-6 border-l-2 border-b-2 opacity-60"
        style={{ borderImage: 'linear-gradient(135deg, hsl(180,95%,60%), hsl(270,85%,65%)) 1' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2 opacity-60"
        style={{ borderImage: 'linear-gradient(135deg, hsl(180,95%,60%), hsl(270,85%,65%)) 1' }}
      />

      {/* Optional badge above the stats */}
      {benchmarkBadge && (
        <div className="relative mb-4 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-400/[0.06] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-cyan-300">
            {benchmarkBadge}
          </span>
        </div>
      )}

      {/* Stat grid (1 column for single stat, 2 columns for two stats) */}
      <div
        className={`relative grid gap-6 ${
          stats.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div
              className="bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%)',
                filter: 'drop-shadow(0 0 30px hsla(180, 95%, 60%, 0.25))',
              }}
            >
              {stat.value}
            </div>
            <div className="mt-3 text-sm sm:text-base text-cyan-100/70 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom gradient bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%)',
        }}
      />
    </section>
  );
}
