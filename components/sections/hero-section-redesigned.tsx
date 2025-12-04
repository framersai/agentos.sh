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
    const timer = setTimeout(() => setIsContentReady(true), 150);
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

  const morphingWords: [string, string] = ['Adaptive', 'Emergent'];

  if (!isContentReady) return <PageSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden">
      {/* Gradient overlays */}
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

      {/* Neural Constellation - prominent background, centered right */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{
          right: '0%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isDark ? 0.6 : 0.5, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Responsive: larger sizes */}
        <div className="block sm:hidden">
          <NeuralConstellation size={280} />
        </div>
        <div className="hidden sm:block md:hidden">
          <NeuralConstellation size={400} />
        </div>
        <div className="hidden md:block lg:hidden">
          <NeuralConstellation size={520} />
        </div>
        <div className="hidden lg:block xl:hidden">
          <NeuralConstellation size={600} />
        </div>
        <div className="hidden xl:block">
          <NeuralConstellation size={700} />
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Headline - perfectly aligned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5"
          >
            <h1 className="font-bold tracking-tight">
              {/* Line 1 */}
              <span className="flex items-center flex-wrap text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1]">
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={28}
                  gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                  gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                  startIndex={0}
                  className="sm:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={36}
                  gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                  gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                  startIndex={0}
                  className="hidden sm:inline-flex md:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={42}
                  gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                  gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                  startIndex={0}
                  className="hidden md:inline-flex lg:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={48}
                  gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'}
                  gradientTo={isDark ? '#67e8f9' : '#06b6d4'}
                  startIndex={0}
                  className="hidden lg:inline-flex"
                />
                <span className="text-[var(--color-text-primary)] ml-2 sm:ml-3">intelligence</span>
              </span>
              {/* Line 2 */}
              <span className="flex items-center flex-wrap text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] mt-1">
                <span className="text-[var(--color-text-secondary)] mr-2 sm:mr-3">for</span>
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={28}
                  gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                  gradientTo={isDark ? '#818cf8' : '#6366f1'}
                  startIndex={1}
                  className="sm:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={36}
                  gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                  gradientTo={isDark ? '#818cf8' : '#6366f1'}
                  startIndex={1}
                  className="hidden sm:inline-flex md:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={42}
                  gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                  gradientTo={isDark ? '#818cf8' : '#6366f1'}
                  startIndex={1}
                  className="hidden md:inline-flex lg:hidden"
                />
                <ParticleMorphText
                  words={morphingWords}
                  interval={2500}
                  fontSize={48}
                  gradientFrom={isDark ? '#f472b6' : '#ec4899'}
                  gradientTo={isDark ? '#818cf8' : '#6366f1'}
                  startIndex={1}
                  className="hidden lg:inline-flex"
                />
                <span className="text-[var(--color-text-primary)] ml-2 sm:ml-3">agents</span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-base lg:text-lg text-[var(--color-text-secondary)] mb-5 sm:mb-6 max-w-xl"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6"
          >
            <LinkButton
              href={`/${locale === 'en' ? '' : locale + '/'}docs`}
              variant="primary"
              size="lg"
              className="group text-sm sm:text-base"
            >
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </LinkButton>

            <a
              href="https://github.com/framersai/agentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 border-[var(--color-border-primary)] bg-[var(--color-background-card)] text-[var(--color-text-primary)] font-semibold text-sm shadow-sm hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">{t('viewOnGithub')}</span>
              <span className="sm:hidden">GitHub</span>
            </a>
          </motion.div>

          {/* Install command */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-6 sm:mb-8"
          >
            <Button
              onClick={copyCommand}
              variant="secondary"
              className="gap-2 group text-xs sm:text-sm"
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent-primary)]" />
              <code className="font-mono">npm install agentos</code>
              <span className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-1 hidden sm:inline">
                copy
              </span>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 sm:gap-6 mb-6 sm:mb-10"
          >
            {productStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent-primary)]" />
                <span className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="p-2.5 sm:p-3 rounded-lg bg-[var(--color-background-secondary)]/50 border border-[var(--color-border-subtle)]/50 hover:border-[var(--color-accent-primary)]/30 transition-colors backdrop-blur-sm"
              >
                <h3 className="font-medium text-[11px] sm:text-xs text-[var(--color-text-primary)] mb-0.5">{h.title}</h3>
                <p className="text-[9px] sm:text-[10px] text-[var(--color-text-muted)] leading-tight">{h.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 sm:mt-8 flex items-center gap-3 text-[10px] sm:text-xs text-[var(--color-text-muted)]"
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
