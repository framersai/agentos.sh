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

  // Word sets that create meaningful combinations and avoid repetition
  const primaryWords = useMemo(() => [
    'Adaptive', 'Emergent', 'Autonomous', 'Resilient', 'Cognitive', 'Dynamic'
  ], []);
  
  const secondaryWords = useMemo(() => [
    'emergent', 'adaptive', 'scalable', 'distributed', 'intelligent', 'modular'
  ], []);

  if (!isContentReady) return <PageSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-background-primary)]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)'
          }}
        />
        {/* Secondary ambient gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(6,182,212,0.08) 0%, transparent 50%)'
              : 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 50%)'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column - Content */}
          <div className="max-w-2xl">
            {/* Headline with particle morphing text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="block mb-2">
                  <ParticleMorphText
                    words={primaryWords}
                    interval={4500}
                    fontSize={56}
                    gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                    gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                    className="align-middle"
                  />
                  {' '}
                  <span className="text-[var(--color-text-primary)]">intelligence</span>
                </span>
                <span className="block">
                  <span className="text-[var(--color-text-secondary)]">for </span>
                  <ParticleMorphText
                    words={secondaryWords}
                    interval={4500}
                    fontSize={56}
                    gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                    gradientTo={isDark ? '#818cf8' : '#6366f1'}
                    className="align-middle"
                  />
                  {' '}
                  <span className="text-[var(--color-text-primary)]">agents</span>
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-[var(--color-text-primary)] font-semibold shadow-sm hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all duration-200"
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
              className="mb-10"
            >
              <Button
                onClick={copyCommand}
                variant="secondary"
                className="gap-2 group"
              >
                <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <code className="font-mono text-sm">npm install agentos</code>
                <span className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  copy
                </span>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-6 mb-12"
            >
              {productStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="font-semibold text-[var(--color-text-primary)]">{stat.value}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Highlights grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.05 }}
                  className="p-4 rounded-lg bg-[var(--color-background-secondary)]/50 border border-[var(--color-border-subtle)]/50 hover:border-[var(--color-accent-primary)]/30 transition-colors"
                >
                  <h3 className="font-medium text-sm text-[var(--color-text-primary)] mb-1">{h.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{h.detail}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Compliance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-10 flex items-center gap-4 text-xs text-[var(--color-text-muted)]"
            >
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {t('compliance.gdpr')}
              </span>
              <span>•</span>
              <span>{t('compliance.soc2')}</span>
            </motion.div>
          </div>

          {/* Right column - Neural Constellation */}
          <motion.div 
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <NeuralConstellation 
              size={480} 
              className="opacity-90"
            />
          </motion.div>
        </div>

        {/* Mobile neural visualization */}
        <div className="lg:hidden flex justify-center mt-12">
          <NeuralConstellation size={280} className="opacity-80" />
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
