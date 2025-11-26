'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Github, Terminal, Star, GitBranch, Shield, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatedAgentOSLogoOptimized } from '../icons/animated-logo-optimized';
import { PageSkeleton } from '../ui/page-skeleton';
import { Toast } from '../ui/toast';
import { LinkButton } from '../ui/LinkButton';
import { Button } from '../ui/Button';
import { applyVisualTheme } from '@/lib/visual-design-system';
import { useTheme } from 'next-themes';

// Liquid morphing text component
function LiquidMorphText({ 
  words, 
  className = '',
  interval = 4000 
}: { 
  words: string[]
  className?: string
  interval?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 400)
    }, interval)

    return () => clearInterval(timer)
  }, [words.length, interval])

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ 
          opacity: isAnimating ? 0 : 1, 
          y: isAnimating ? -20 : 0,
          filter: isAnimating ? 'blur(10px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="inline-block"
      >
        {words[currentIndex]}
      </motion.span>
    </span>
  )
}

// Particle field background
function ParticleField({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      hue: number
      alpha: number
      pulse: number
    }

    const particles: Particle[] = []
    const particleCount = Math.min(150, Math.floor(window.innerWidth / 10))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 3,
        hue: 250 + Math.random() * 60,
        alpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw connections first
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            gradient.addColorStop(0, `hsla(${particles[i].hue}, 100%, ${isDark ? 70 : 50}%, ${alpha})`)
            gradient.addColorStop(1, `hsla(${particles[j].hue}, 100%, ${isDark ? 70 : 50}%, ${alpha})`)
            ctx.strokeStyle = gradient
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02

        // Wrap around
        if (p.x < 0) p.x = window.innerWidth
        if (p.x > window.innerWidth) p.x = 0
        if (p.y < 0) p.y = window.innerHeight
        if (p.y > window.innerHeight) p.y = 0

        const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.3)
        const pulseAlpha = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3)

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 4)
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, ${isDark ? 70 : 55}%, ${pulseAlpha})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, ${isDark ? 60 : 45}%, ${pulseAlpha * 0.3})`)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${isDark ? 85 : 60}%, ${pulseAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: isDark ? 0.6 : 0.4 }}
    />
  )
}

export function HeroSectionRedesigned() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [githubForks, setGithubForks] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isDark = resolvedTheme === 'dark';
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 500], [0, 150]);
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const logoOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Animated words for the headline
  const animatedWords = {
    first: ['Adaptive', 'Emergent', 'Intelligent', 'Autonomous'],
    second: ['intelligence', 'agents', 'systems', 'networks'],
    third: ['emergent', 'adaptive', 'scalable', 'portable'],
    fourth: ['agents', 'intelligence', 'workflows', 'reasoning']
  };

  // Apply visual theme
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

  // Progressive loading
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsContentReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Live stats
  const productStats = useMemo(() => [
    { label: t('stats.githubStars'), value: githubStars ?? '—', live: true, icon: Star },
    { label: t('stats.forks'), value: githubForks ?? '—', live: true, icon: GitBranch }
  ], [githubStars, githubForks, t]);

  // Fetch GitHub metrics
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('https://api.github.com/repos/framersai/agentos')
        .then(res => res.json())
        .then(data => {
          if (typeof data.stargazers_count === 'number') setGithubStars(data.stargazers_count);
          if (typeof data.forks_count === 'number') setGithubForks(data.forks_count);
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const technicalHighlights = [
    { title: 'Streaming-first runtime', detail: 'Token-level delivery across personas, guardrails, and channels.' },
    { title: 'Deterministic orchestration', detail: 'Parallel GMIs with auditable routing, approvals, and budgets.' },
    { title: 'Zero-copy memory fabric', detail: 'Vector, episodic, and working memory stitched together for recall.' },
    { title: 'Portable intelligence capsules', detail: 'Export full AgentOS instances as Markdown or JSON and ingest anywhere.' }
  ];

  if (!isContentReady) {
    return <PageSkeleton />;
  }

  return (
    <section 
      ref={heroRef}
      className="hero-critical relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: `var(--color-background-primary)` }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isDark
              ? [
                  'radial-gradient(ellipse 150% 100% at 50% 0%, hsl(270 100% 15%) 0%, hsl(250 50% 5%) 50%, hsl(240 30% 2%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 30% 20%, hsl(280 100% 12%) 0%, hsl(260 50% 5%) 50%, hsl(240 30% 2%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 70% 10%, hsl(260 100% 15%) 0%, hsl(250 50% 5%) 50%, hsl(240 30% 2%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 50% 0%, hsl(270 100% 15%) 0%, hsl(250 50% 5%) 50%, hsl(240 30% 2%) 100%)',
                ]
              : [
                  'radial-gradient(ellipse 150% 100% at 50% 0%, hsl(270 80% 95%) 0%, hsl(250 60% 98%) 50%, hsl(0 0% 100%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 30% 20%, hsl(280 80% 94%) 0%, hsl(260 60% 98%) 50%, hsl(0 0% 100%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 70% 10%, hsl(260 80% 95%) 0%, hsl(250 60% 98%) 50%, hsl(0 0% 100%) 100%)',
                  'radial-gradient(ellipse 150% 100% at 50% 0%, hsl(270 80% 95%) 0%, hsl(250 60% 98%) 50%, hsl(0 0% 100%) 100%)',
                ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Particle field */}
        {isMounted && !prefersReducedMotion && <ParticleField isDark={isDark} />}

        {/* Accent orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, var(--color-accent-primary)/20 0%, transparent 70%)`,
            filter: 'blur(60px)',
            left: '10%',
            top: '20%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, var(--color-accent-secondary)/15 0%, transparent 70%)`,
            filter: 'blur(50px)',
            right: '15%',
            bottom: '30%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left column - Text content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Open Source AI Agent Runtime
              </span>
            </motion.div>

            {/* Main headline with liquid morphing text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-grotesk)' }}
            >
              <LiquidMorphText 
                words={animatedWords.first}
                className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              />
              {' '}
              <LiquidMorphText 
                words={animatedWords.second}
                className="text-[var(--color-text-primary)]"
                interval={4500}
              />
              <br />
              <span className="text-[var(--color-text-secondary)]">for </span>
              <LiquidMorphText 
                words={animatedWords.third}
                className="bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] bg-clip-text text-transparent"
                interval={5000}
              />
              {' '}
              <LiquidMorphText 
                words={animatedWords.fourth}
                className="text-[var(--color-text-primary)]"
                interval={4200}
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mb-8"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <LinkButton
                href={`/${locale === 'en' ? '' : locale + '/'}docs`}
                variant="primary"
                size="lg"
                className="group"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </LinkButton>

              <a
                href="https://github.com/framersai/agentos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border-interactive)] bg-transparent text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-accent-primary)]/10 transition-all duration-300 group"
              >
                <Github className="w-5 h-5" />
                <span>{t('viewOnGithub')}</span>
              </a>
            </motion.div>

            {/* Installation Command */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
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
          </div>

          {/* Right column - Animated Logo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              style={{ y: logoY, scale: logoScale, opacity: logoOpacity }}
              className="relative"
            >
              {/* Main animated logo - much larger and more prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.2 
                }}
                className="relative"
              >
                <AnimatedAgentOSLogoOptimized 
                  size={isMobile ? 280 : 420} 
                  className="drop-shadow-2xl"
                  intensity={1.2}
                />
                
                {/* Radiant glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, var(--color-accent-primary)/30 0%, transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-[-20%] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, var(--color-accent-secondary)/20 0%, transparent 50%)',
                    filter: 'blur(60px)',
                  }}
                  animate={{
                    scale: [1.1, 1.4, 1.1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 sm:mt-20"
        >
          <div className="holographic-card p-6 sm:p-8 inline-flex gap-8 sm:gap-12">
            {productStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-accent-primary" />
                  {stat.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {technicalHighlights.map((highlight, i) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="holographic-card p-5 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -top-1 -left-1 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="font-semibold mb-2 text-sm gradient-text">{highlight.title}</h2>
                <p className="text-xs text-muted">{highlight.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {t('compliance.gdpr')}
            </span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1">{t('compliance.soc2')}</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-[var(--color-border-subtle)] flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], height: ['20%', '40%', '20%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 bg-[var(--color-accent-primary)] rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Toast */}
      <Toast
        message={t('copiedToClipboard')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
}
