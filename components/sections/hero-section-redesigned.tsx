'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { NeuralConstellation } from '../hero/neural-constellation';
import { ParticleMorphText } from '../hero/particle-morph-text';
import { PageSkeleton } from '../ui/page-skeleton';
import { Toast } from '../ui/toast';
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { useTheme } from 'next-themes';

export function HeroSectionRedesigned() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  const isDark = resolvedTheme === 'dark';

  // Apply visual theme
  useEffect(() => {
    const themeMap: Record<string, string> = {
      'sakura-sunset': 'sakura-sunset',
      'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak',
      'warm-embrace': 'warm-embrace',
      'retro-terminus': 'retro-terminus'
    };
    applyVisualTheme(themeMap[currentTheme || ''] || 'aurora-daybreak', isDark);
  }, [currentTheme, isDark]);

  useEffect(() => {
    const timer = setTimeout(() => setIsContentReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', icon: GitBranch }
  ], [githubStars, githubForks, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('https://api.github.com/repos/framersai/agentos')
        .then(res => res.json())
        .then(data => {
          if (typeof data.stargazers_count === 'number') setGithubStars(data.stargazers_count);
          if (typeof data.forks_count === 'number') setGithubForks(data.forks_count);
        })
        .catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText('npm install agentos');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const highlights = [
    { title: 'Streaming-first', detail: 'Token-level delivery with guardrails' },
    { title: 'Deterministic', detail: 'Auditable routing and approvals' },
    { title: 'Zero-copy memory', detail: 'Unified vector and episodic recall' },
    { title: 'Portable', detail: 'Export as Markdown or JSON' }
  ];

  // Only two words: Adaptive and Emergent - coordinated so they're always opposite
  const morphingWords: [string, string] = ['Adaptive', 'Emergent'];

  if (!isContentReady) return <PageSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden">
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)'
          }}
        />
      </div>

      {/* Single Neural Constellation - bottom right, responsive */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{
          right: '-5%',
          bottom: '5%',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isDark ? 0.5 : 0.4, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Responsive sizing: smaller on mobile, larger on desktop */}
        <div className="block sm:hidden">
          <NeuralConstellation size={200} />
        </div>
        <div className="hidden sm:block md:hidden">
          <NeuralConstellation size={300} />
        </div>
        <div className="hidden md:block lg:hidden">
          <NeuralConstellation size={400} />
        </div>
        <div className="hidden lg:block">
          <NeuralConstellation size={500} />
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Main content - left aligned */}
        <div className="max-w-3xl">
          {/* Headline with particle morphing text - responsive font sizes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="font-bold leading-[1.15] tracking-tight">
              {/* Line 1 - responsive */}
              <span className="flex items-baseline flex-wrap gap-x-2 sm:gap-x-3">
                {/* Mobile: 32px, SM: 40px, LG: 48px */}
                <span className="block sm:hidden">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={32}
                    gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                    gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                    startIndex={0}
                  />
                </span>
                <span className="hidden sm:block lg:hidden">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={40}
                    gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                    gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                    startIndex={0}
                  />
                </span>
                <span className="hidden lg:block">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={48}
                    gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                    gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                    startIndex={0}
                  />
                </span>
                <span className="text-[var(--color-text-primary)] text-3xl sm:text-4xl lg:text-5xl">intelligence</span>
              </span>
              {/* Line 2 - responsive */}
              <span className="flex items-baseline flex-wrap gap-x-2 sm:gap-x-3 mt-1">
                <span className="text-[var(--color-text-secondary)] text-3xl sm:text-4xl lg:text-5xl">for</span>
                <span className="block sm:hidden">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={32}
                    gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                    gradientTo={isDark ? '#818cf8' : '#6366f1'}
                    startIndex={1}
                  />
                </span>
                <span className="hidden sm:block lg:hidden">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={40}
                    gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                    gradientTo={isDark ? '#818cf8' : '#6366f1'}
                    startIndex={1}
                  />
                </span>
                <span className="hidden lg:block">
                  <ParticleMorphText
                    words={morphingWords}
                    interval={3500}
                    fontSize={48}
                    gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                    gradientTo={isDark ? '#818cf8' : '#6366f1'}
                    startIndex={1}
                  />
                </span>
                <span className="text-[var(--color-text-primary)] text-3xl sm:text-4xl lg:text-5xl">agents</span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-6 sm:mb-8 max-w-xl"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-6 sm:mb-8"
          >
            <LinkButton
              href={`/${locale === 'en' ? '' : locale + '/'}docs`}
              variant="primary"
              size="lg"
              className="group"
            >
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </LinkButton>

            <a
              href="https://github.com/framersai/agentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-[var(--color-text-primary)] font-semibold text-sm sm:text-base shadow-sm hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              {t('viewOnGithub')}
            </a>
          </motion.div>

          {/* Install command */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 sm:mb-10"
          >
            <Button
              onClick={copyCommand}
              variant="secondary"
              className="gap-2 group text-sm sm:text-base"
            >
              <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" />
              <code className="font-mono text-xs sm:text-sm">npm install agentos</code>
              <span className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2 hidden sm:inline">
                copy
              </span>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {productStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2">
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent-primary)]" />
                <span className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.05 }}
                className="p-3 sm:p-4 rounded-lg bg-[var(--color-background-secondary)]/50 border border-[var(--color-border-subtle)]/50 hover:border-[var(--color-accent-primary)]/30 transition-colors backdrop-blur-sm"
              >
                <h3 className="font-medium text-xs sm:text-sm text-[var(--color-text-primary)] mb-0.5 sm:mb-1">{h.title}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] leading-tight">{h.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-[var(--color-text-muted)]"
          >
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {t('compliance.gdpr')}
            </span>
            <span>•</span>
            <span>{t('compliance.soc2')}</span>
          </motion.div>
        </div>
      </div>

      <Toast
        message={t('copiedToClipboard')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
}
