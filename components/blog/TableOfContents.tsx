'use client';

import { useEffect, useMemo, useState } from 'react';

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
 * Drift between the two slug functions silently breaks every link in
 * the TOC, so the implementation is duplicated here rather than
 * imported to keep the contract obvious in both call sites.
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
 * Two placements:
 *
 *   - `placement="sidebar"` (default) renders a sticky right-rail
 *     TOC at lg+ breakpoints. Hidden under lg.
 *   - `placement="inline"` renders a plain block above the article
 *     body, visible only under lg, so phones and small tablets still
 *     get a TOC when the sidebar isn't on the page.
 *
 * The active-item highlight uses IntersectionObserver and is shared
 * across both placements.
 */
export function TableOfContents({
  content,
  placement = 'sidebar',
}: {
  content: string;
  placement?: 'sidebar' | 'inline';
}) {
  const items = useMemo(() => extractToc(content), [content]);
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * Highlight the heading whose section is currently in view.
   *
   * `rootMargin: '-80px 0px -70% 0px'` gives a band that starts 80px
   * below the top of the viewport (the rough height of any sticky
   * site header) and ends 30% from the top, which keeps the active
   * indicator anchored to whatever section is currently being read.
   *
   * When multiple headings sit inside the band at once we pick the
   * one that appears earliest in document order (matches the
   * top-of-band behavior most readers intuit).
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
          const ordered = items
            .map((item) => item.id)
            .filter((id) => intersecting.includes(id));
          if (ordered.length > 0) setActiveId(ordered[0]);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    );

    for (const el of headingElements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const list = (
    <ul className="space-y-px border-l border-[var(--color-border-subtle)]">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id} className="relative">
            {isActive && (
              <span
                aria-hidden
                className="absolute -left-px top-0 bottom-0 w-[2px] rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, hsl(180, 95%, 60%), hsl(270, 85%, 65%))',
                }}
              />
            )}
            <a
              href={`#${item.id}`}
              className={`block py-1.5 text-[13px] leading-snug transition-colors ${
                item.level === 3 ? 'pl-7 text-[12px]' : 'pl-4'
              } ${
                isActive
                  ? 'font-semibold text-[var(--color-text-link)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-link)]'
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const header = (
    <div className="mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
      <div
        aria-hidden
        className="mb-2 h-[2px] w-10 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, hsl(180, 95%, 60%), hsl(270, 85%, 65%))',
        }}
      />
      <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
        Table of Contents
      </h2>
    </div>
  );

  if (placement === 'inline') {
    return (
      <nav
        aria-label="Table of contents"
        className="my-8 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-5 lg:hidden"
      >
        {header}
        {list}
      </nav>
    );
  }

  return (
    <aside aria-label="Table of contents" className="hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
        {header}
        {list}
      </div>
    </aside>
  );
}
