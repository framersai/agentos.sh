'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AgentOSWordmark from './branding/AgentOSWordmark';
import { ModeToggle } from './mode-toggle';
import { ThemeSelector } from './theme-selector';

const NAV_LINKS = [
  { href: '/#gmis', label: 'GMIs' },
  { href: '/#architecture', label: 'Architecture' },
  { href: '/#features', label: 'Features' },
  { href: '/docs', label: 'Docs' },
  { href: '/#cta', label: 'Get AgentOS' },
];

/**
 * SiteHeader renders the marketing navigation bar with desktop and mobile variants.
 * It centralises the theme controls, Frame.dev link, and body scroll locking for the mobile menu.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b theme-header theme-header-gradient backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col gap-1 transition-opacity hover:opacity-95" onClick={closeMenu}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-slate-400/80 dark:text-slate-500/75">
            Presented by<span className="ml-1 text-brand"> Frame.dev</span>
          </span>
          <AgentOSWordmark className="h-10" size="md" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex theme-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} className="theme-nav-link" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <ThemeSelector />
          <Link
            href="https://frame.dev"
            className="hidden rounded-full border px-4 py-2 text-sm font-semibold transition md:inline-flex theme-frame-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Frame.dev
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/80 p-2 text-slate-700 shadow-sm transition hover:bg-white hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-200`}
      >
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
          <nav className="flex flex-col divide-y divide-slate-200 dark:divide-slate-700" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://frame.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
            >
              Frame.dev
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
