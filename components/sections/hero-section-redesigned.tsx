'use client';

import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { PageSkeleton } from '../ui/page-skeleton';
import { Toast } from '../ui/toast';
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { useTheme } from 'next-themes';

// Lazy load heavy animation components
const NeuralConstellation = dynamic(() => import('../hero/neural-constellation').then(m => ({ default: m.NeuralConstellation })), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500/10 to-cyan-500/10 animate-pulse" />
});

const ParticleMorphText = dynamic(() => import('../hero/particle-morph-text').then(m => ({ default: m.ParticleMorphText })), {
  ssr: false,
});

const HeroSectionInner = memo(function HeroSectionInner() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const themeMap: Record<string, string> = {
      'sakura-sunset': 'sakura-sunset', 'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak', 'warm-embrace': 'warm-embrace', 'retro-terminus': 'retro-terminus'
    };
    applyVisualTheme(themeMap[currentTheme || ''] || 'aurora-daybreak', isDark);
  }, [currentTheme, isDark]);

  useEffect(() => { setIsReady(true); }, []);

  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', icon: GitBranch }
  ], [githubStars, githubForks, t]);

  useEffect(() => {
    fetch('https://api.github.com/repos/framersai/agentos')
      .then(r => r.json())
      .then(d => { if (typeof d.stargazers_count === 'number') setGithubStars(d.stargazers_count); if (typeof d.forks_count === 'number') setGithubForks(d.forks_count); })
      .catch(() => {});
  }, []);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText('npm install @framers/agentos');
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

  if (!isReady) return <PageSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden" itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="name" content="AgentOS" />
      <meta itemProp="applicationCategory" content="AI Framework" />
      <meta itemProp="operatingSystem" content="Any" />
      
      {/* Background gradient - CSS only */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.12) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 100% 80% at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 50%)'
        }}
        aria-hidden="true"
      />

      {/* Neural Constellation - right side, responsive visibility */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 sm:opacity-50 lg:opacity-70" 
        style={{ marginLeft: 'calc(15% + 40px)', marginTop: '-8%' }} 
        aria-hidden="true"
      >
        {/* Mobile: smaller, more transparent, pushed back */}
        <div className="block sm:hidden -z-10"><NeuralConstellation size={250} /></div>
        {/* Tablet */}
        <div className="hidden sm:block lg:hidden"><NeuralConstellation size={450} /></div>
        {/* Desktop */}
        <div className="hidden lg:block xl:hidden"><NeuralConstellation size={600} /></div>
        {/* Large desktop */}
        <div className="hidden xl:block"><NeuralConstellation size={750} /></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <article className="max-w-2xl">
          {/* SEO-optimized headline with proper h1 */}
          <h1 className="font-bold tracking-tight mb-4" itemProp="description">
            <div className="text-[22px] sm:text-[30px] lg:text-[40px] leading-normal flex items-center overflow-visible">
              <span className="inline-block min-w-[120px] sm:min-w-[160px] lg:min-w-[220px] pr-1">
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={22} gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'} gradientTo={isDark ? '#67e8f9' : '#06b6d4'} startIndex={0} className="sm:hidden" />
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={30} gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'} gradientTo={isDark ? '#67e8f9' : '#06b6d4'} startIndex={0} className="hidden sm:inline-block lg:hidden" />
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={40} gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'} gradientTo={isDark ? '#67e8f9' : '#06b6d4'} startIndex={0} className="hidden lg:inline-block" />
              </span>
              <span className="text-[var(--color-text-primary)]">intelligence</span>
            </div>
            <div className="text-[22px] sm:text-[30px] lg:text-[40px] leading-normal flex items-center overflow-visible">
              <span className="text-[var(--color-text-secondary)]">for&nbsp;</span>
              <span className="inline-block min-w-[120px] sm:min-w-[160px] lg:min-w-[220px] pr-1">
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={22} gradientFrom={isDark ? '#f472b6' : '#ec4899'} gradientTo={isDark ? '#818cf8' : '#6366f1'} startIndex={1} className="sm:hidden" />
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={30} gradientFrom={isDark ? '#f472b6' : '#ec4899'} gradientTo={isDark ? '#818cf8' : '#6366f1'} startIndex={1} className="hidden sm:inline-block lg:hidden" />
                <ParticleMorphText words={morphingWords} interval={2500} fontSize={40} gradientFrom={isDark ? '#f472b6' : '#ec4899'} gradientTo={isDark ? '#818cf8' : '#6366f1'} startIndex={1} className="hidden lg:inline-block" />
              </span>
              <span className="text-[var(--color-text-primary)]">agents</span>
            </div>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4 max-w-lg" itemProp="abstract">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <nav className="flex flex-wrap gap-2 mb-4" aria-label="Primary actions">
            <LinkButton href={`/${locale === 'en' ? '' : locale + '/'}docs`} variant="primary" size="lg" className="group text-sm">
              {t('getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </LinkButton>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] dark:text-white font-medium text-sm hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-background-elevated)] transition-all"
               itemProp="codeRepository">
              <Github className="w-4 h-4 text-[var(--color-text-primary)]" aria-hidden="true" />
              <span className="text-[var(--color-text-primary)]">View on GitHub</span>
            </a>
          </nav>

          {/* Install command */}
          <div className="mb-4">
            <Button onClick={copyCommand} variant="secondary" className="gap-2 text-xs sm:text-sm" aria-label="Copy install command">
              <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" aria-hidden="true" />
              <code className="font-mono">npm install @framers/agentos</code>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-3" aria-label="GitHub statistics">
            {productStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 text-sm">
                <stat.icon className="w-4 h-4 text-[var(--color-accent-primary)]" aria-hidden="true" />
                <span className="font-semibold text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5" aria-label="Package badges">
            <a href="https://www.npmjs.com/package/@framers/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://img.shields.io/badge/npm-v0.1.0-cb3837?logo=npm" alt="npm version" className="h-5" />
            </a>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://img.shields.io/badge/coverage-67%25-green" alt="test coverage" className="h-5" />
            </a>
            <a href="https://github.com/framersai/agentos/actions" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="CI status" className="h-5" />
            </a>
            <span className="hover:opacity-80 transition-opacity">
              <img src="https://img.shields.io/badge/TypeScript-5.4+-3178c6?logo=typescript&logoColor=white" alt="TypeScript" className="h-5" />
            </span>
          </div>

          {/* Features */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 list-none p-0" aria-label="Key features">
            {highlights.map((h) => (
              <li key={h.title} className="p-2 rounded-md bg-[var(--color-background-secondary)]/40 border border-[var(--color-border-subtle)]/30">
                <div className="text-xs font-medium text-[var(--color-text-primary)]">{h.title}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{h.detail}</div>
              </li>
            ))}
          </ul>

          {/* Compliance badges */}
          <div className="mt-4 flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" aria-hidden="true" />{t('compliance.gdpr')}</span>
            <span aria-hidden="true">•</span>
            <span>{t('compliance.soc2')}</span>
          </div>
        </article>
      </div>

      <Toast message={t('copiedToClipboard')} isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
});

export function HeroSectionRedesigned() {
  return <HeroSectionInner />;
}
