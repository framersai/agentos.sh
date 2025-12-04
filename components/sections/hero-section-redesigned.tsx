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
    setIsContentReady(true);
  }, []);

  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', icon: GitBranch }
  ], [githubStars, githubForks, t]);

  useEffect(() => {
    fetch('https://api.github.com/repos/framersai/agentos')
      .then(res => res.json())
      .then(data => {
        if (typeof data.stargazers_count === 'number') setGithubStars(data.stargazers_count);
        if (typeof data.forks_count === 'number') setGithubForks(data.forks_count);
      })
      .catch(() => {});
  }, []);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText('npm install agentos');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  const highlights = [
    { title: 'Streaming-first', detail: 'Token-level delivery' },
    { title: 'Deterministic', detail: 'Auditable routing' },
    { title: 'Zero-copy memory', detail: 'Unified recall' },
    { title: 'Portable', detail: 'Export anywhere' }
  ];

  const morphingWords: [string, string] = ['Adaptive', 'Emergent'];

  if (!isContentReady) return <PageSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.15) 0%, transparent 50%)'
              : 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.08) 0%, transparent 50%)'
          }}
        />
      </div>

      {/* Neural Constellation - Large, prominent, centered in right half */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-end">
        <motion.div
          className="relative"
          style={{ marginRight: '-10%' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Mobile */}
          <div className="block sm:hidden">
            <NeuralConstellation size={300} />
          </div>
          {/* Tablet */}
          <div className="hidden sm:block lg:hidden">
            <NeuralConstellation size={450} />
          </div>
          {/* Desktop */}
          <div className="hidden lg:block xl:hidden">
            <NeuralConstellation size={600} />
          </div>
          {/* Large desktop */}
          <div className="hidden xl:block">
            <NeuralConstellation size={750} />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-bold tracking-tight mb-4"
          >
            <span className="flex items-center flex-wrap text-[26px] sm:text-[34px] lg:text-[44px] leading-[1.15]">
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={26}
                gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                startIndex={0}
                className="sm:hidden"
              />
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={34}
                gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                startIndex={0}
                className="hidden sm:inline-flex lg:hidden"
              />
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={44}
                gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                startIndex={0}
                className="hidden lg:inline-flex"
              />
              <span className="text-[var(--color-text-primary)] ml-2">intelligence</span>
            </span>
            <span className="flex items-center flex-wrap text-[26px] sm:text-[34px] lg:text-[44px] leading-[1.15] mt-0.5">
              <span className="text-[var(--color-text-secondary)] mr-2">for</span>
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={26}
                gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                gradientTo={isDark ? '#818cf8' : '#6366f1'}
                startIndex={1}
                className="sm:hidden"
              />
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={34}
                gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                gradientTo={isDark ? '#818cf8' : '#6366f1'}
                startIndex={1}
                className="hidden sm:inline-flex lg:hidden"
              />
              <ParticleMorphText
                words={morphingWords}
                interval={2000}
                fontSize={44}
                gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                gradientTo={isDark ? '#818cf8' : '#6366f1'}
                startIndex={1}
                className="hidden lg:inline-flex"
              />
              <span className="text-[var(--color-text-primary)] ml-2">agents</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4 max-w-lg"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <LinkButton
              href={`/${locale === 'en' ? '' : locale + '/'}docs`}
              variant="primary"
              size="lg"
              className="group text-sm"
            >
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </LinkButton>
            <a
              href="https://github.com/framersai/agentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-[var(--color-text-primary)] font-medium text-sm hover:border-[var(--color-accent-primary)] transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </motion.div>

          {/* Install */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-5"
          >
            <Button onClick={copyCommand} variant="secondary" className="gap-2 text-xs sm:text-sm">
              <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" />
              <code className="font-mono">npm install agentos</code>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-4 mb-6"
          >
            {productStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 text-sm">
                <stat.icon className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <span className="font-semibold text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {highlights.map((h) => (
              <div
                key={h.title}
                className="p-2 rounded-md bg-[var(--color-background-secondary)]/40 border border-[var(--color-border-subtle)]/30"
              >
                <div className="text-xs font-medium text-[var(--color-text-primary)]">{h.title}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{h.detail}</div>
              </div>
            ))}
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-5 flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]"
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

      <Toast message={t('copiedToClipboard')} isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
}
