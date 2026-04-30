'use client';

import Image from 'next/image';
import type { Post } from '@/lib/markdown';

/**
 * Blog post hero. Renders for every blog post — there are two paths:
 *
 *   1. Posts with `heroStat` + `heroLabel` in frontmatter (benchmarks,
 *      announcements with a headline number) get the *stat* layout:
 *      AgentOS logo + brand mark in the top row, big gradient figures,
 *      summary under a hairline.
 *
 *   2. Every other post gets the *brand* layout: same dark canvas with
 *      cyan + violet radial accents, AgentOS logo + brand mark in the
 *      top row, the post category as the eyebrow, the post title in
 *      gradient text, the post date as the bottom-line. Consistent
 *      branding across the index, no AI-photo-looking hero PNGs in the
 *      article body.
 *
 * The OG/social-card PNG (`post.image`) is no longer rendered as the
 * in-page hero. It still ships with the post for share previews, but
 * the in-page hero is always this component so every article carries
 * the same brand identity.
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

/**
 * Shared shell: dark canvas, cyan + violet radial accents, brand
 * row at the top with the AgentOS logo and a configurable eyebrow.
 * Both layouts (stat and brand) share this shell so the visual
 * identity is consistent across all blog post hero treatments.
 */
function HeroShell({
  eyebrow,
  rightMeta,
  children,
}: {
  eyebrow: string;
  rightMeta?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label="Article hero"
      className="relative my-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(220,28%,11%)] to-[hsl(220,32%,7%)]"
    >
      {/* Faint radial accents */}
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
        {/* Top row: AgentOS logo + brand wordmark on the left,
            optional context tag on the right (benchmark name,
            category, etc). Same on every hero. */}
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
                AgentOS
              </span>
              <span className="text-sm font-semibold text-white">{eyebrow}</span>
            </div>
          </div>
          {rightMeta && (
            <div className="hidden text-right text-[11px] font-medium uppercase tracking-[0.16em] text-white/50 sm:block">
              {rightMeta}
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const heroStat = post.heroStat as string | undefined;
  const heroLabel = post.heroLabel as string | undefined;

  // Path 1: stat layout for posts with heroStat + heroLabel.
  if (heroStat && heroLabel) {
    const stats = parseStats(heroStat, heroLabel);
    const summary = trimSummaryLabel(heroLabel);

    return (
      <HeroShell eyebrow="Benchmark Result" rightMeta="LongMemEval">
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

        {summary && (
          <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/45 sm:text-left">
            {summary}
          </div>
        )}
      </HeroShell>
    );
  }

  // Path 2: brand layout for every other post. The category from
  // frontmatter slots into the right-meta tag; the post title becomes
  // a gradient typographic mark on the same canvas. No external
  // images needed, so it works for every post regardless of whether
  // an OG card has been generated.
  const date = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <HeroShell eyebrow="Engineering Notes" rightMeta={post.category || undefined}>
      <div className="text-center sm:text-left">
        <h2
          className="bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          style={{
            backgroundImage:
              'linear-gradient(135deg, hsl(180, 95%, 62%) 0%, hsl(270, 85%, 68%) 100%)',
          }}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-cyan-100/70 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>

      {(date || post.author) && (
        <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/45 sm:text-left">
          {date}
          {post.author ? ` · ${post.author}` : ''}
        </div>
      )}
    </HeroShell>
  );
}
