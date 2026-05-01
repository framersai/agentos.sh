'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Calendar, ArrowRight, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Minimal post shape used by the blog index. Mirrors the fields actually
 * rendered here; the upstream `getAllPosts()` returns more, but anything
 * beyond this is wasted prop weight on the client island.
 */
export type PaginatedPost = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  category?: string;
};

const DEFAULT_PAGE_SIZE = 10;

const categoryColors: Record<string, string> = {
  Engineering: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Announcements: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Comparison: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Tutorial: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

interface PaginatedPostsProps {
  posts: PaginatedPost[];
  locale: string;
  pageSize?: number;
}

/**
 * Client-side pagination for the blog index.
 *
 * Renders one page (default 10) of post cards plus a Previous / page
 * numbers / Next control row. The page state lives in the URL hash
 * (`#page=2`) so refreshes and shared links land on the same page
 * without requiring per-page routes (this site uses `output: 'export'`,
 * which makes server-side `?page=N` rewrites awkward; hash state
 * keeps it static-friendly).
 *
 * On first render the component shows page 1 to avoid SSR/CSR markup
 * mismatch — then a `useEffect` reads `window.location.hash` and
 * clamps to the correct page. That brief one-frame flicker on direct
 * `#page=N` loads is preferable to a hydration warning.
 */
export function PaginatedPosts({ posts, locale, pageSize = DEFAULT_PAGE_SIZE }: PaginatedPostsProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));

  // Sync from URL hash on mount + when user uses browser back/forward.
  useEffect(() => {
    const readHash = () => {
      const m = window.location.hash.match(/page=(\d+)/);
      if (m) {
        const n = Math.min(Math.max(1, Number(m[1])), totalPages);
        setPage(n);
      } else {
        setPage(1);
      }
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, [totalPages]);

  const visiblePosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, page, pageSize]);

  const goTo = (nextPage: number) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === page) return;
    setPage(clamped);
    // Push the new hash so back-button works; clear the hash for page 1.
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = clamped === 1 ? '' : `page=${clamped}`;
      window.history.pushState({}, '', url.toString());
      // Scroll back to the top of the post list so users see the new
      // page from the top, not partway down where they were.
      const list = document.getElementById('blog-list-top');
      if (list) {
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Build the visible page-number window: always show 1 + last + a few
  // around current. Avoids 50+ buttons for 500-post archives.
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  return (
    <>
      <div id="blog-list-top" className="space-y-6 max-w-4xl mx-auto scroll-mt-24">
        {visiblePosts.map((post) => {
          const href = `/${locale}/blog/${post.slug}`;
          const colorClass = categoryColors[post.category || ''] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
          return (
            <article key={post.slug} className="group">
              <Link
                href={href as Route}
                className="block rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card,var(--color-background-elevated))] p-6 transition-all hover:border-[var(--color-text-link)]/40 hover:shadow-lg sm:p-8"
              >
                <div className="mb-3 flex items-center gap-3 text-sm">
                  {post.category && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-text-link)] sm:text-2xl">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mb-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {post.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-text-link)] transition-all group-hover:gap-2">
                  Read article
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-link)] hover:text-[var(--color-text-link)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border-subtle)] disabled:hover:text-[var(--color-text-secondary)]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          {pageNumbers.map((n, i) =>
            n === '…' ? (
              <span
                key={`ellipsis-${i}`}
                aria-hidden="true"
                className="inline-flex h-10 min-w-[2rem] items-center justify-center text-sm text-[var(--color-text-muted)]"
              >
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => goTo(n as number)}
                aria-label={`Go to page ${n}`}
                aria-current={n === page ? 'page' : undefined}
                className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all ${
                  n === page
                    ? 'border border-[var(--color-text-link)] bg-[var(--color-text-link)]/10 text-[var(--color-text-link)]'
                    : 'border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-link)] hover:text-[var(--color-text-link)]'
                }`}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-link)] hover:text-[var(--color-text-link)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border-subtle)] disabled:hover:text-[var(--color-text-secondary)]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </>
  );
}

/**
 * Build a compact pagination window: always include first and last
 * pages plus a 1-page neighbourhood around the current page, with
 * `…` placeholders for elided ranges.
 *
 * Examples (current shown in brackets):
 *   total=3,  page=1: [1] 2 3
 *   total=10, page=1: [1] 2 3 … 10
 *   total=10, page=5: 1 … 4 [5] 6 … 10
 *   total=10, page=10: 1 … 8 9 [10]
 */
function buildPageNumbers(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: Array<number | '…'> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) result.push('…');
  for (let n = left; n <= right; n++) result.push(n);
  if (right < total - 1) result.push('…');
  result.push(total);
  return result;
}
