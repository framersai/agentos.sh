'use client';

import Image from 'next/image';
import type { Post } from '@/lib/markdown';

/**
 * Blog post hero. Renders for posts whose frontmatter carries
 * `heroStat` + `heroLabel`. Posts without a hero stat skip this
 * component entirely.
 *
 * Layout (mobile and desktop):
 *
 *   ┌──────────────────────────────────────────┐
 *   │ [logo] AgentOS Memory       Benchmark    │
 *   │                                           │
 *   │     85.6%             70.2%               │
 *   │     S variant         M variant           │
 *   │                                           │
 *   │ matched gpt-4o reader · agentos-bench     │
 *   └──────────────────────────────────────────┘
 *
 * The `heroStat` value supports a "stat-strip" pattern where two
 * numbers are separated by ` / ` (e.g. "85.6% / 70.2%") and rendered
 * side-by-side. Single-stat posts get one centred figure.
 *
 * `heroLabel` is the line under the figures. When it includes the
 * substring " and " between two parts, the hero splits the label so
 * each figure gets its own mini-label (e.g. "S variant" / "M variant").
 *
 * `benchmarkBadge` from frontmatter is no longer rendered. The
 * methodology disclosure line (judge model, bootstrap CIs, sample
 * size) lives in the body of the post where it can be read in
 * context, not in chrome above the fold.
 */
interface BlogPostHeroProps {
  post: Post;
}

interface ParsedStat {
  value: string;
  label: string;
}

function parseStats(heroStat: string, heroLabel: string): ParsedStat[] {
  const values = heroStat.split('/').map((v) => v.trim()).filter(Boolean);
  if (values.length <= 1) {
    return [{ value: heroStat.trim(), label: '' }];
  }
  // Try to split the label on " and " to give each figure its own
  // mini-label. Fall back to no per-figure label when the shape
  // doesn't fit so the figures don't get duplicate noisy labels.
  const labelParts = heroLabel.split(/\s+and\s+/i);
  if (labelParts.length === values.length) {
    return values.map((value, i) => ({ value, label: labelParts[i].trim() }));
  }
  return values.map((value) => ({ value, label: '' }));
}

/**
 * Strip the redundant "on " prefix from per-figure labels. Authors
 * write "on LongMemEval-S and -M" so the natural split produces
 * "on LongMemEval-S" / "-M". The leading "on" reads awkwardly under
 * a single figure so we trim it for the inline mini-label only.
 */
function trimMiniLabel(label: string): string {
  return label.replace(/^on\s+/i, '').trim();
}

/**
 * Reduce the heroLabel to a short post-figures summary. Drops the
 * variant list (everything before " (" or before " and ") since the
 * mini-labels under each figure already say which variant. What
 * remains is the parenthetical methodology hint, e.g. "(matched
 * gpt-4o reader)" → "matched gpt-4o reader".
 */
function trimSummaryLabel(heroLabel: string): string {
  const paren = heroLabel.match(/\(([^)]+)\)/);
  if (paren) return paren[1].trim();
  return heroLabel.trim();
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const heroStat = post.heroStat as string | undefined;
  const heroLabel = post.heroLabel as string | undefined;

  if (!heroStat || !heroLabel) return null;

  const stats = parseStats(heroStat, heroLabel);
  const summary = trimSummaryLabel(heroLabel);

  return (
    <section
      aria-label="Headline metrics"
      className="relative my-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(220,28%,11%)] to-[hsl(220,32%,7%)]"
    >
      {/* Faint radial accent in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsla(180, 95%, 60%, 0.45), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, hsla(270, 85%, 65%, 0.45), transparent 60%)',
        }}
      />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        {/* Top row: brand on the left, benchmark name on the right */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/agentos-icon.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
              aria-hidden
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/60">
                AgentOS Memory
              </span>
              <span className="text-sm font-semibold text-white">Benchmark Result</span>
            </div>
          </div>
          <div className="hidden text-right text-[11px] font-medium uppercase tracking-[0.16em] text-white/50 sm:block">
            LongMemEval
          </div>
        </div>

        {/* Stat grid */}
        <div
          className={`grid items-end ${
            stats.length === 1
              ? 'grid-cols-1'
              : 'grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-12'
          }`}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <div
                className="bg-clip-text text-transparent text-6xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-none"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, hsl(180, 95%, 62%) 0%, hsl(270, 85%, 68%) 100%)',
                }}
              >
                {stat.value}
              </div>
              {stat.label && (
                <div className="mt-3 text-sm font-medium text-cyan-100/70">
                  {trimMiniLabel(stat.label)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary line under the figures */}
        {summary && (
          <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/45 sm:text-left">
            {summary}
          </div>
        )}
      </div>
    </section>
  );
}
