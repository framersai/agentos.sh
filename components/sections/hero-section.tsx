'use client';

import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield, Check, Code2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
// Toast removed — copy feedback is inline (icon swap + text change)
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { useTheme } from 'next-themes';

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// Lazy load heavy animation components - deferred for better LCP
const ResponsiveNeuralConstellation = dynamic(() => import('../hero/neural-constellation').then(m => ({ default: m.ResponsiveNeuralConstellation })), {
  ssr: false,
  loading: () => null
});

const HeroSectionInner = memo(function HeroSectionInner() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const { copied: showToast, copy: copyToClipboard } = useCopyToClipboard();
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const isDark = resolvedTheme === 'dark';

  // Mark as mounted after hydration, then trigger content ready
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setContentReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const themeMap: Record<string, string> = {
      'sakura-sunset': 'sakura-sunset', 'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak', 'warm-embrace': 'warm-embrace', 'retro-terminus': 'retro-terminus'
    };
    applyVisualTheme(themeMap[currentTheme || ''] || 'aurora-daybreak', isDark);
  }, [currentTheme, isDark, mounted]);

  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', icon: GitBranch }
  ], [githubStars, githubForks, t]);

  // Fetch GitHub stats with cache
  useEffect(() => {
    const cached = sessionStorage.getItem('github-stats');
    const parsed = cached ? safeJsonParse<{ stars: number; forks: number; ts: number }>(cached) : null;
    if (parsed && Date.now() - parsed.ts < 300000) { // 5 min cache
      setGithubStars(parsed.stars);
      setGithubForks(parsed.forks);
      return;
    }
    fetch('https://api.github.com/repos/framersai/agentos')
      .then(r => r.json())
      .then(d => {
        if (typeof d.stargazers_count === 'number') {
          setGithubStars(d.stargazers_count);
          setGithubForks(d.forks_count);
          sessionStorage.setItem('github-stats', JSON.stringify({ stars: d.stargazers_count, forks: d.forks_count, ts: Date.now() }));
        }
      })
      .catch(() => {});
  }, []);

  const copyCommand = useCallback(() => {
    copyToClipboard('npm install @framers/agentos');
  }, [copyToClipboard]);

  const highlights = [
    { title: '37 Channels', detail: 'Multiplatform delivery' },
    { title: '21 LLM Providers', detail: 'Any model, anywhere' },
    { title: 'Multimodal RAG', detail: 'Cognitive memory' },
    { title: '5-Tier Guardrails', detail: 'Production-ready' }
  ];


  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden" itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="name" content="AgentOS" />
      <meta itemProp="applicationCategory" content="AI Framework" />
      <meta itemProp="operatingSystem" content="Any" />
      
      {/* Loading skeleton overlay - fades out when content ready */}
      <div 
        className={`absolute inset-0 z-20 bg-[var(--color-background-primary)] transition-opacity duration-300 pointer-events-none ${contentReady ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 mt-16">
          <div className="max-w-2xl space-y-4">
            <div className="h-10 w-64 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded animate-pulse" />
            <div className="h-10 w-48 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 rounded animate-pulse" />
            <div className="h-4 w-96 bg-[var(--color-background-secondary)] rounded animate-pulse mt-4" />
            <div className="flex gap-2 mt-4">
              <div className="h-10 w-32 bg-violet-500/20 rounded-lg animate-pulse" />
              <div className="h-10 w-36 bg-[var(--color-background-secondary)] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
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

      {/* Neural Constellation - right side, single responsive instance */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 sm:opacity-50 lg:opacity-70" 
        style={{ marginLeft: 'calc(15% + 40px)', marginTop: '-8%' }} 
        aria-hidden="true"
      >
        <ResponsiveNeuralConstellation />
      </div>

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 transition-opacity duration-500 ${contentReady ? 'opacity-100' : 'opacity-0'}`}>
        <article className="max-w-2xl">
          <h1 className="font-bold tracking-tight mb-2 leading-[1.15]" style={{ fontSize: 'clamp(22px, 5vw, 40px)' }} itemProp="name">
            <span className="inline-block relative overflow-hidden" style={{ height: '1.15em', width: 'auto', verticalAlign: 'top' }}>
              <span className="flex flex-col animate-[heroMorph_6s_ease-in-out_infinite]" style={{ lineHeight: '1.15' }}>
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ height: '1.15em' }}>Emergent</span>
                <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent" style={{ height: '1.15em' }}>Adaptive</span>
              </span>
            </span>{' '}
            <span className="text-[var(--color-text-primary)]">intelligence</span>
            <br />
            <span className="text-[var(--color-text-secondary)]">for </span>
            <span className="inline-block relative overflow-hidden" style={{ height: '1.15em', width: 'auto', verticalAlign: 'top' }}>
              <span className="flex flex-col animate-[heroMorph_6s_ease-in-out_infinite]" style={{ animationDelay: '3s', lineHeight: '1.15' }}>
                <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent" style={{ height: '1.15em' }}>adaptive</span>
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ height: '1.15em' }}>emergent</span>
              </span>
            </span>{' '}
            <span className="text-[var(--color-text-primary)]">agents</span>
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

          {/* Install command + scroll CTA */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button type="button" onClick={copyCommand} variant="secondary" className="gap-2 text-xs sm:text-sm" aria-label="Copy install command">
              {showToast ? (
                <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
              ) : (
                <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" aria-hidden="true" />
              )}
              <code className="font-mono">{showToast ? 'Copied!' : 'npm install @framers/agentos'}</code>
            </Button>
            <a href="#code" onClick={(e) => { e.preventDefault(); const scroll = () => document.getElementById('code')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); scroll(); setTimeout(scroll, 300); setTimeout(scroll, 800); setTimeout(scroll, 1500); }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/20 transition-all cursor-pointer group">
              <Code2 className="w-4 h-4" aria-hidden="true" />
              See code examples
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
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

          {/* Badges - dynamic shields.io images */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="flex flex-wrap gap-2 mb-5" aria-label="Package badges">
            <a href="https://www.npmjs.com/package/@framers/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/npm/v/@framers/agentos?logo=npm&color=cb3837" alt="npm version" className="h-5" />
            </a>
            <a href="https://codecov.io/gh/framersai/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/codecov/c/github/framersai/agentos?logo=codecov" alt="test coverage" className="h-5" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?logo=github" alt="CI status" className="h-5" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/tests-3%2C866%2B_passed-2ea043?logo=vitest&logoColor=white" alt="tests" className="h-5" />
            </a>
            <span className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/TypeScript-5.4+-3178c6?logo=typescript&logoColor=white" alt="TypeScript" className="h-5" />
            </span>
            <a href="https://github.com/framersai/agentos/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/License-Apache_2.0-blue?logo=apache&logoColor=white" alt="Apache 2.0 License" className="h-5" />
            </a>
          </div>

          {/* Features — click scrolls to Core Capabilities */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 list-none p-0" aria-label="Key features">
            {highlights.map((h) => (
              <li key={h.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="p-2 rounded-md bg-[var(--color-background-secondary)]/40 border border-[var(--color-border-subtle)]/30 cursor-pointer hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-accent-primary)]/5 transition-all">
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

      {/* No toast — copy feedback is inline via icon swap in the button */}
    </section>
  );
});

export function HeroSection() {
  return <HeroSectionInner />;
}
