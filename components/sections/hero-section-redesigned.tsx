'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatedAgentOSLogo } from '../icons/animated-logo';
import { Toast } from '../ui/toast';
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { useTheme } from 'next-themes';

export function HeroSectionRedesigned() {
  const t = useTranslations('hero');
  const locale = useLocale();
  // i18n morphing words arrays
  const cycleWords = t.raw('cycleWords') as string[];
  const cycleWordsTail = t.raw('cycleWordsTail') as string[];
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [headIdxA, setHeadIdxA] = useState(0);
  const [headIdxB, setHeadIdxB] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const isDark = resolvedTheme === 'dark';

  // Apply visual theme based on current theme selection - now runs immediately to prevent flash
  useEffect(() => {
    const themeMap = {
      'sakura-sunset': 'sakura-sunset',
      'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak',
      'warm-embrace': 'warm-embrace',
      'retro-terminus': 'retro-terminus'
    };
    const mappedTheme = themeMap[currentTheme as keyof typeof themeMap] || 'aurora-daybreak';
    applyVisualTheme(mappedTheme, isDark);
  }, [currentTheme, isDark]);

  // Show skeleton while waiting for client-side hydration if needed
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Live stats with GitHub data only
  const productStats = useMemo(() => {
    return [
      {
        label: t('stats.githubStars'),
        value: githubStars ?? '—',
        live: true,
        icon: Star
      },
      {
        label: t('stats.forks'),
        value: githubForks ?? '—',
        live: true,
        icon: GitBranch
      }
    ];
  }, [githubStars, githubForks, t]);

  // Fetch GitHub repo metrics
  useEffect(() => {
    fetch('https://api.github.com/repos/framersai/agentos')
      .then(res => res.json())
      .then(data => {
        if (typeof data.stargazers_count === 'number') setGithubStars(data.stargazers_count);
        if (typeof data.forks_count === 'number') setGithubForks(data.forks_count);
      })
      .catch(() => {
        setGithubStars(null);
        setGithubForks(null);
      });
  }, []);

  // Liquid morph text switching - coordinated to avoid duplicates
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setHeadIdxA(prev => {
        const next = (prev + 1) % Math.max(1, cycleWords.length);
        // Avoid collision with current B if words are identical
        if (cycleWords[next] === cycleWordsTail[headIdxB]) {
           return (next + 1) % Math.max(1, cycleWords.length);
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, cycleWords.length, cycleWordsTail, headIdxB, cycleWords]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Offset timing for B
    const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setHeadIdxB(prev => {
            const next = (prev + 1) % Math.max(1, cycleWordsTail.length);
             // Avoid collision with current A
            if (cycleWordsTail[next] === cycleWords[headIdxA]) {
               return (next + 1) % Math.max(1, cycleWordsTail.length);
            }
            return next;
          });
        }, 4000);
        return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [prefersReducedMotion, cycleWordsTail.length, cycleWords, headIdxA, cycleWordsTail]);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText('npm install agentos');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Auto-hide toast
  }, []);

  const technicalHighlights = [
    { title: 'Streaming-first runtime', detail: 'Token-level delivery across personas, guardrails, and channels.' },
    { title: 'Deterministic orchestration', detail: 'Parallel GMIs with auditable routing, approvals, and budgets.' },
    { title: 'Zero-copy memory fabric', detail: 'Vector, episodic, and working memory stitched together for recall.' },
    { title: 'Portable intelligence capsules', detail: 'Export full AgentOS instances as Markdown or JSON and ingest anywhere.' }
  ];

  return (
    <section className="hero-critical relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--color-background-primary)]">
      {/* Clean gradient background - subtle and professional */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: isDark
              ? `radial-gradient(ellipse at top, 
                  hsl(250 100% 10%) 0%, 
                  hsl(240 50% 4%) 50%, 
                  hsl(240 30% 2%) 100%)`
              : `radial-gradient(ellipse at top, 
                  hsl(250 60% 98%) 0%, 
                  hsl(240 40% 97%) 50%, 
                  hsl(0 0% 100%) 100%)`
          }}
        />
        {/* Subtle accent overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 20%, 
              var(--color-accent-primary)/8 0%, 
              transparent 50%),
              radial-gradient(circle at 70% 80%, 
              var(--color-accent-secondary)/6 0%, 
              transparent 50%)`
          }}
        />
        {/* Large translucent logo - adjusted for responsiveness */}
        <div className="pointer-events-none absolute right-0 sm:right-[-5%] top-[65%] sm:top-[60%] -translate-y-1/2 opacity-20 sm:opacity-30 z-0 mix-blend-screen overflow-hidden sm:overflow-visible">
          <div className="w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] animate-slow-spin scale-[1.2] origin-center translate-x-1/3 sm:translate-x-0">
            <AnimatedAgentOSLogo />
          </div>
        </div>
      </div>

      {/* Minimal particle system - elegant and performant */}
      <div className="absolute inset-0 pointer-events-none">
        {!prefersReducedMotion && !isMobile && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `var(--color-accent-primary)`,
                  boxShadow: `0 0 8px var(--color-accent-primary)`,
                  left: `${18 + (i % 3) * 24}%`,
                  top: `${28 + Math.floor(i / 3) * 28}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 10 + i * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Left-aligned layout */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_0.6fr] items-start gap-10 mb-12">
            {/* Headline block */}
            <div className="order-1">
              
              {/* Smooth word-swap headline */}
              <div className="relative overflow-hidden">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-left"
                style={{ fontFamily: 'var(--font-grotesk)' }}
              >
                {/* Morphing first word */}
                <span className="inline-block relative align-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`head-a-${headIdxA}`}
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent"
                    >
                      {cycleWords[headIdxA]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {' intelligence for '}
                {/* Morphing last word */}
                <span className="inline-block relative align-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`head-b-${headIdxB}`}
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                      className="bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent"
                    >
                      {cycleWordsTail[headIdxB]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {' agents'}
              </h1>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl text-muted max-w-3xl mb-8 text-left"
          >
            {t('subtitle')}
          </motion.p>

          {/* Product Stats Card - Top positioned */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block mb-12"
          >
            <div className="holographic-card p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                {productStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-accent-primary mr-2" />
                      {stat.live && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
        </motion.div>

        {/* Removed centered duplicate logo; background mark now on the left */}

        {/* Technical Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {technicalHighlights.map((highlight, i) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="holographic-card p-4 sm:p-6 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -top-1 -left-1 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="font-semibold mb-2 text-sm sm:text-base gradient-text">
                  {highlight.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  {highlight.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons - Redesigned with proper components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-start gap-4 mb-12"
        >
          <LinkButton
            href={`/${locale === 'en' ? '' : locale + '/'}docs`}
            variant="primary"
            size="lg"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </LinkButton>

          <a
            href="https://github.com/framersai/agentos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-[var(--color-border-interactive)] bg-transparent text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-accent-primary)]/10 transition-all duration-[var(--duration-fast)]"
          >
            <Github className="w-5 h-5" />
            <span>{t('viewOnGithub')}</span>
          </a>
        </motion.div>

        {/* Installation Command */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="flex"
        >
          <Button
            onClick={copyCommand}
            variant="secondary"
            size="lg"
            className="gap-3 group"
            aria-label="Copy installation command"
          >
            <Terminal className="w-5 h-5 text-[var(--color-accent-primary)]" />
            <code className="font-mono text-sm">npm install agentos</code>
            <span className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
              Click to copy
            </span>
          </Button>
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-8 text-left"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {t('compliance.gdpr')}
            </span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1">
              {t('compliance.soc2')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Feedback Toast */}
      <Toast
        message={t('copiedToClipboard')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
}
