'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Menu, X, Globe, Sparkles, ArrowRight } from 'lucide-react';
import AgentOSWordmark from './branding/AgentOSWordmark';
import { ModeToggle } from './mode-toggle';
import { ThemeSelector } from './theme-selector';
import { motion } from 'framer-motion';

const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/#features', label: 'Features' },
  { href: '/#code', label: 'Examples' },
  { href: 'https://docs.agentos.sh', label: 'Docs' }, // external docs
  { href: '/about', label: 'About' },
  { href: '/#cta', label: 'Get Started' },
];

/**
 * Enhanced SiteHeader with modern design and marketplace link
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // No scroll-based styling needed; header uses persistent glass gradient

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full transition-all duration-300 transition-theme"
    >
      {/* Glass panel with distinct gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-50/60 to-pink-50/50 dark:from-black/90 dark:via-purple-950/80 dark:to-pink-950/70 backdrop-blur-xl border-b border-purple-200/30 dark:border-purple-500/20 shadow-lg" />
      
      <div className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="group flex items-center gap-3 transition-all hover:scale-105" onClick={closeMenu}>
          <div className="relative">
            <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full animate-pulse-glow" />
            <AgentOSWordmark className="h-10 relative z-10" size="md" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:gap-8 text-sm font-medium lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isExternalOrAnchor = link.href.startsWith('http') || link.href.includes('#');
            if (isExternalOrAnchor) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-gray-700 hover:text-purple-600 dark:text-white/90 dark:hover:text-white transition-all duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-600 after:to-pink-600 after:transition-all after:duration-300 hover:after:w-full font-semibold"
                >
                  {link.label}
                </a>
              );
            }
            // Internal typed route(s)
            if (link.href === '/about') {
              return (
                <Link
                  key={link.href}
                  href={'/about' as Route}
                  className="relative text-gray-700 hover:text-purple-600 dark:text-white/90 dark:hover:text-white transition-all duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-600 after:to-pink-600 after:transition-all after:duration-300 hover:after:w-full font-semibold"
                >
                  {link.label}
                </Link>
              );
            }
            return null;
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Marketplace button */}
          <a
            href="https://app.vca.chat/marketplace"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-morphism text-sm font-semibold text-accent-primary hover:bg-accent-primary/10 transition-all duration-300 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-4 h-4" />
            Marketplace
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Frame.dev CTA - Better styled with high contrast */}
          <a
            href="https://frame.dev"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group border border-purple-500/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Sparkles className="w-4 h-4" />
            Frame.dev
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Theme controls */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <ThemeSelector />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center p-2 rounded-xl glass-morphism hover:bg-accent-primary/10 transition-all lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`lg:hidden ${menuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="mx-4 mb-4 mt-2 rounded-2xl glass-morphism shadow-modern overflow-hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isExternalOrAnchor = link.href.startsWith('http') || link.href.includes('#');
              if (isExternalOrAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-semibold text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-all"
                  >
                    {link.label}
                  </a>
                );
              }
              if (link.href === '/about') {
                return (
                  <Link
                    key={link.href}
                    href={'/about' as Route}
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-semibold text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-all"
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}
            <a
              href="https://app.vca.chat/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-semibold text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Marketplace
            </a>
            <a
              href="https://frame.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mx-4 my-3 px-4 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-semibold text-center hover:shadow-modern transition-all"
            >
              Visit Frame.dev
            </a>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
}