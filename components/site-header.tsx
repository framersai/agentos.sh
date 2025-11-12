'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Sparkles, ArrowRight } from 'lucide-react';
import AgentOSWordmark from './branding/AgentOSWordmark';
import { ModeToggle } from './mode-toggle';
import { ThemeSelector } from './theme-selector';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { href: '/#gmis' as const, label: 'GMIs' },
  { href: '/#architecture' as const, label: 'Architecture' },
  { href: '/#features' as const, label: 'Features' },
  { href: '/docs' as const, label: 'Docs' },
  { href: '/#cta' as const, label: 'Get Started' },
] as const;

/**
 * Enhanced SiteHeader with modern design and marketplace link
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-morphism shadow-modern border-b border-border-subtle'
          : 'bg-background-primary/50 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="group flex items-center gap-3 transition-all hover:scale-105" onClick={closeMenu}>
          <div className="relative">
            <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full animate-pulse-glow" />
            <AgentOSWordmark className="h-10 relative z-10" size="md" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:gap-8 text-sm font-medium lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              className="relative text-text-secondary hover:text-accent-primary transition-all duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:transition-all after:duration-300 hover:after:w-full"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Marketplace button */}
          <Link
            href="https://app.vca.chat/marketplace"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-morphism text-sm font-semibold text-accent-primary hover:bg-accent-primary/10 transition-all duration-300 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-4 h-4" />
            Marketplace
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Frame.dev CTA - Better styled */}
          <Link
            href="https://frame.dev"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-semibold hover:shadow-modern transition-all duration-300 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Sparkles className="w-4 h-4" />
            Frame.dev
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Theme controls */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <ThemeSelector />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center p-2 rounded-xl glass-morphism hover:bg-accent-primary/10 transition-all lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`lg:hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <div className="mx-4 mb-4 mt-2 rounded-2xl glass-morphism shadow-modern overflow-hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-6 py-4 text-sm font-semibold text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://app.vca.chat/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-semibold text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Marketplace
            </Link>
            <Link
              href="https://frame.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mx-4 my-3 px-4 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-semibold text-center hover:shadow-modern transition-all"
            >
              Visit Frame.dev
            </Link>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
}
