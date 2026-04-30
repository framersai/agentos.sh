'use client';

import { useEffect, useMemo, useState } from 'react';
import { ListTree } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Slug logic mirrors components/markdown-renderer.tsx exactly so the
 * TOC anchor hrefs match the heading ids react-markdown injects:
 *
 *   const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
 *
 * Any drift between the two slug functions silently breaks every link
 * in the TOC, so the implementation is duplicated rather than imported
 * to keep the contract obvious in both call sites.
 */
function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Parse markdown source for H2 + H3 headings. Skips headings inside
 * fenced code blocks (lines between ```...```), since those are
 * sample code, not real article structure.
 */
function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split('\n');
  let inCodeFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '');
    items.push({ id: slugify(text), text, level });
  }

  return items;
}

/**
 * Variants:
 *   - `mobile` renders a collapsible details element. Suitable inside
 *     the article column above the markdown body. Shown on screens
 *     under the lg breakpoint and `lg:hidden` past it.
 *   - `desktop` renders a sticky aside intended for the right sidebar
 *     in the lg+ grid layout. Hidden under lg.
 *
 * Splitting into variants (rather than rendering both at once) keeps
 * the consumer in control of where each variant mounts in the DOM.
 */
export function TableOfContents({
  content,
  variant = 'mobile',
}: {
  content: string;
  variant?: 'mobile' | 'desktop';
}) {
  const items = useMemo(() => extractToc(content), [content]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Highlight the heading whose section is currently in view. The
   * IntersectionObserver callback fires whenever any tracked heading
   * crosses the top-30% / bottom-70% band, and we pick the topmost
   * intersecting heading. With pure rootMargin: '-30% 0% -70% 0%'
   * scrolling fast enough to skip the band leaves no heading active;
   * the fallback (intersecting headings sorted by document position)
   * keeps the active state stable in that case.
   */
  useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (intersecting.length > 0) {
          // Pick the heading closest to the top of the viewport
          const ordered = items
            .map((item) => item.id)
            .filter((id) => intersecting.includes(id));
          if (ordered.length > 0) setActiveId(ordered[0]);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: [0, 1],
      },
    );

    for (const el of headingElements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  // Always-static rendering: no collapse, no sticky, no scroll
  // following. The TOC sits in normal document flow (`position:
  // static`, the default) and is fully expanded on every viewport.
  // Visitors get a permanent, predictable list of section links
  // anchored to the article structure.

  if (variant === 'mobile') {
    return (
      <nav
        aria-label="Table of contents"
        className="my-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-4 lg:hidden"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
          <ListTree className="h-4 w-4" aria-hidden />
          Table of Contents
        </div>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-sm transition-colors ${
                  item.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === item.id
                    ? 'font-semibold text-[var(--color-accent-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <aside
      aria-label="Table of contents"
      className="hidden lg:block pl-6 pr-2 py-2"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        <ListTree className="h-3.5 w-3.5" aria-hidden />
        On this page
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block leading-snug transition-colors ${
                item.level === 3 ? 'pl-4 text-xs' : ''
              } ${
                activeId === item.id
                  ? 'font-semibold text-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
