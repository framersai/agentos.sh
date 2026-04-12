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

const ParticleMorphText = dynamic(() => import('../hero/particle-morph-text').then(m => ({ default: m.ParticleMorphText })), {
  ssr: false,
  loading: () => null
});

const HeroSectionInner = memo(function HeroSectionInner() {
  const t = useTranslations('hero');
  const _locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const { copied: showToast, copy: copyToClipboard } = useCopyToClipboard();
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [morphFontSize, setMorphFontSize] = useState(40);
  const isDark = resolvedTheme === 'dark';

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Match ParticleMorphText font size to the CSS clamp breakpoints
  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const w = window.innerWidth;
      // Match CSS text sizes exactly — canvas fills the invisible text box
      setMorphFontSize(w >= 1024 ? 48 : w >= 640 ? 36 : 28);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted]);

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
    { title: '37 Channels', detail: 'Discord, Slack, WhatsApp' },
    { title: '21 LLM Providers', detail: 'OpenAI, Anthropic, Ollama' },
    { title: 'Multimodal RAG', detail: 'Text, image, audio, video' },
    { title: 'Built-in Safety', detail: 'PII redaction, injection defense' }
  ];


  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background-primary)] overflow-hidden" itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="name" content="AgentOS" />
      <meta itemProp="applicationCategory" content="AI Framework" />
      <meta itemProp="operatingSystem" content="Any" />
      
      {/* Skeleton overlay removed — hero text renders immediately for faster LCP */}
      
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <article className="max-w-2xl">
          <h1 className="font-bold tracking-tight mb-3 text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.2]" itemProp="name">
            <ParticleMorphText words={['Emergent', 'Adaptive']} interval={4000} fontSize={morphFontSize} gradientFrom={isDark ? '#a78bfa' : '#8b5cf6'} gradientTo={isDark ? '#67e8f9' : '#06b6d4'} startIndex={0} />
            <span className="text-[var(--color-text-primary)]">intelligence</span>
            <br />
            <span className="text-[var(--color-text-secondary)]">for </span>
            <ParticleMorphText words={['adaptive', 'emergent']} interval={5200} fontSize={morphFontSize} gradientFrom={isDark ? '#f472b6' : '#ec4899'} gradientTo={isDark ? '#818cf8' : '#6366f1'} startIndex={0} />
            <span className="text-[var(--color-text-primary)]">agents</span>
          </h1>

          <p className="sr-only">
            AgentOS is an open-source TypeScript AI agent framework for building production-ready autonomous agents with multi-agent orchestration, cognitive memory, multimodal RAG, AI guardrails, voice pipelines, and 21 LLM providers. A type-safe alternative to LangGraph, CrewAI, Mastra, and AutoGen.
          </p>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4 max-w-lg" itemProp="abstract">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <nav className="flex flex-wrap gap-2 mb-4" aria-label="Primary actions">
            <LinkButton href="https://docs.agentos.sh/getting-started" variant="primary" size="lg" className="group text-sm">
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
            <a href="#code"
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

          {/* Badges - hidden on mobile to reduce external requests, explicit dimensions to prevent CLS */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-5" aria-label="Package badges">
            <a href="https://www.npmjs.com/package/@framers/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/npm/v/@framers/agentos?logo=npm&color=cb3837" alt="npm version" width={106} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://codecov.io/gh/framersai/agentos" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/codecov/c/github/framersai/agentos?logo=codecov" alt="test coverage" width={120} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?logo=github" alt="CI status" width={100} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <a href="https://github.com/framersai/agentos/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/tests-3%2C866%2B_passed-2ea043?logo=vitest&logoColor=white" alt="tests" width={134} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
            <span className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/TypeScript-5.4+-3178c6?logo=typescript&logoColor=white" alt="TypeScript" width={120} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </span>
            <a href="https://github.com/framersai/agentos/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/License-Apache_2.0-blue?logo=apache&logoColor=white" alt="Apache 2.0 License" width={128} height={20} className="h-5 w-auto" loading="lazy" decoding="async" />
            </a>
          </div>

          {/* Features — click scrolls to Core Capabilities */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2" role="group" aria-label="Key features">
            {highlights.map((h) => (
              <button key={h.title}
                  type="button"
                  onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="p-2 rounded-md bg-[var(--color-background-secondary)]/40 border border-[var(--color-border-subtle)]/30 cursor-pointer hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-accent-primary)]/5 transition-all text-left">
                <div className="text-xs font-medium text-[var(--color-text-primary)]">{h.title}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{h.detail}</div>
              </button>
            ))}
          </div>

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
