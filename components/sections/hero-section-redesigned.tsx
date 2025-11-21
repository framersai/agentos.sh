'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatedAgentOSLogoOptimized } from '../icons/animated-logo-optimized';
import { ParticleText } from '../ui/particle-text';
import { PageSkeleton } from '../ui/page-skeleton';
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
  const headIdxARef = useRef(0);
  const headIdxBRef = useRef(1);
  const [isContentReady, setIsContentReady] = useState(false);
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

  // Progressive loading - show skeleton first, then content
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    // Delay content display slightly to ensure smooth loading
    const timer = setTimeout(() => setIsContentReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    headIdxARef.current = headIdxA;
  }, [headIdxA]);

  useEffect(() => {
    headIdxBRef.current = headIdxB;
  }, [headIdxB]);

  // Live stats with GitHub data + additional metrics
  const productStats = useMemo(() => {
    return [
      {
        label: t('stats.githubStars'),
        value: githubStars ?? '—',
        live: true,
        icon: Star,
        bgGradient: 'from-yellow-400 via-orange-400 to-amber-500'
      },
      {
        label: t('stats.forks'),
        value: githubForks ?? '—',
        live: true,
        icon: GitBranch,
        bgGradient: 'from-purple-400 via-violet-400 to-indigo-500'
      },
      {
        label: t('stats.contributors'),
        value: '47',
        live: false,
        icon: Shield,
        bgGradient: 'from-green-400 via-emerald-400 to-teal-500'
      },
      {
        label: t('stats.securityScore'),
        value: 'A+',
        live: false,
        icon: Shield,
        bgGradient: 'from-blue-400 via-cyan-400 to-sky-500'
      }
    ];
  }, [githubStars, githubForks, t]);

  // Fetch GitHub repo metrics - defer until after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 1000); // Delay API call to prioritize initial render
    
    return () => clearTimeout(timer);
  }, []);

  // Continuous word switching - always alternating between words
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Initial setup - ensure they start different
    if (headIdxA === headIdxB) {
      setHeadIdxB(headIdxA === 0 ? 1 : 0);
    }

    const interval = setInterval(() => {
      // Always keep them alternating - if A is 0, B should be 1, and vice versa
      setHeadIdxA(prev => {
        const next = prev === 0 ? 1 : 0;
        headIdxARef.current = next;
        return next;
      });
      
      // Stagger B change for visual effect
      setTimeout(() => {
        setHeadIdxB(prev => {
          const next = prev === 0 ? 1 : 0;
          headIdxBRef.current = next;
          return next;
        });
      }, 1500);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [prefersReducedMotion, headIdxA, headIdxB]);

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

  // Show skeleton during initial load for better perceived performance
  if (!isContentReady) {
    return <PageSkeleton />;
  }

  return (
    <section className="hero-critical relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--color-background-primary)]">
      {/* Clean gradient background - subtle and professional */}
      <div className="absolute inset-0">
        {isMounted && (
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
        )}
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
        {/* Optimized logo - visible position */}
        <div className="pointer-events-none absolute right-[10%] top-[25%] sm:top-[20%] z-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <AnimatedAgentOSLogoOptimized size={isMobile ? 250 : 400} className="opacity-70" />
            {/* Additional glow effect */}
            <div className="absolute inset-0 blur-xl">
              <AnimatedAgentOSLogoOptimized size={isMobile ? 250 : 400} className="opacity-40" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Minimal particle system - CSS optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isMounted && !prefersReducedMotion && (
          <>
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: i % 2 === 0 ? '3px' : '5px',
                  height: i % 2 === 0 ? '3px' : '5px',
                  background: 'var(--color-accent-primary)',
                  boxShadow: '0 0 8px var(--color-accent-primary)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.25 + Math.random() * 0.25,
                  animationDuration: `${12 + Math.random() * 18}s`,
                  animationDelay: `-${Math.random() * 10}s`,
                  willChange: 'transform'
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
                className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight text-left"
                style={{ fontFamily: 'var(--font-grotesk)' }}
              >
                {/* Particle effect first word */}
                <span className="inline-block relative align-baseline">
                  {isMounted ? (
                    <ParticleText
                      text={cycleWords[headIdxA]}
                      className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent"
                      particleCount={25}
                      animationDuration={0.8}
                    />
                  ) : (
                    <span className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
                       {cycleWords[0]}
                    </span>
                  )}
                </span>
                <span className="text-[var(--color-text-primary)]"> intelligence for </span>
                {/* Particle effect last word */}
                <span className="inline-block relative align-baseline">
                  {isMounted ? (
                    <ParticleText
                      text={cycleWordsTail[headIdxB]}
                      className="bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent"
                      particleCount={25}
                      animationDuration={0.8}
                    />
                  ) : (
                     <span className="bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
                        {cycleWordsTail[0]}
                     </span>
                  )}
                </span>
                <span className="text-[var(--color-text-primary)]"> agents</span>
              </h1>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] max-w-3xl mb-6 sm:mb-8 text-left px-2 sm:px-0"
          >
            {t('subtitle')}
          </motion.p>

          {/* Product Stats Card - Top positioned */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block mb-8 sm:mb-12 w-full sm:w-auto"
          >
            <div className="holographic-card p-6 sm:p-8 bg-[var(--color-background-primary)]/80 backdrop-blur-xl border border-[var(--color-border-subtle)]/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {productStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="relative group"
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative text-center p-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        {stat.live && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                          </span>
                        )}
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
                        {stat.label}
                      </div>
                    </div>
                    
                    {/* Subtle animated border */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.bgGradient} p-[1px]`}>
                        <div className="h-full w-full rounded-xl bg-[var(--color-background-primary)]" />
                      </div>
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
          className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 mb-8 sm:mb-12 px-2 sm:px-0"
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
