'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatedAgentOSLogoOptimized } from '../icons/animated-logo-optimized';
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
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
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Logo - subtle, positioned top right on desktop */}
        <div className="absolute top-20 right-8 hidden lg:block opacity-60">
          <AnimatedAgentOSLogoOptimized size={140} />
        </div>

        {/* Main content */}
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              Open Source AI Agent Runtime
            </span>
          </motion.div>

          {/* Headline - simple, no morphing */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
              Adaptive
            </span>
            {' '}
            <span className="text-[var(--color-text-primary)]">intelligence</span>
            <br />
            <span className="text-[var(--color-text-secondary)]">for </span>
            <span className="bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
              emergent
            </span>
            {' '}
            <span className="text-[var(--color-text-primary)]">agents</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-accent-primary)]/5 transition-colors"
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
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

        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mt-12">
          <AnimatedAgentOSLogoOptimized size={100} className="opacity-50" />
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
