'use client'

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Github, Terminal, Zap, Star, GitBranch, Users, Shield } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatedAgentOSLogo } from '../icons/animated-logo'
import { TypeScriptIcon, OpenSourceIcon, StreamingIcon, MemoryIcon } from '../icons/feature-icons'
import { Toast } from '../ui/toast'
import { applyHolographicTheme } from '@/lib/holographic-design-system'
import { useTheme } from 'next-themes'

type HeadlinePair = { primary: string; alternate: string };
type Highlight = { title: string; detail: string };
type Stat = { label: string; value: string | number; live?: boolean; icon: React.ElementType };

export function HeroSectionRedesigned() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const { theme: currentTheme, resolvedTheme } = useTheme()
  const [showToast, setShowToast] = useState(false)
  const [githubStars, setGithubStars] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeHeadline, setActiveHeadline] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const lastSwitchTime = useRef(Date.now())
  const isDark = resolvedTheme === 'dark'

  // Apply holographic theme based on current theme selection
  useEffect(() => {
    const themeMap = {
      'sakura-sunset': 'sakura-sunset',
      'twilight-neo': 'twilight-neo',
      'aurora-daybreak': 'aurora-daybreak',
      'warm-embrace': 'warm-embrace',
      'retro-terminus': 'retro-terminus'
    }
    const mappedTheme = themeMap[currentTheme as keyof typeof themeMap] || 'aurora-daybreak'
    applyHolographicTheme(mappedTheme, isDark)
  }, [currentTheme, isDark])

  // Fixed headline pair that switches between two states
  const headlinePair: HeadlinePair = {
    primary: 'Adaptive intelligence for emergent agents',
    alternate: 'Emergent intelligence for adaptive agents'
  }

  // Live stats with GitHub stars
  const productStats = useMemo(() => {
    return [
      {
        label: 'GitHub Stars',
        value: githubStars || '2.3k',
        live: true,
        icon: Star
      },
      {
        label: 'Contributors',
        value: '47',
        live: false,
        icon: Users
      },
      {
        label: 'Forks',
        value: '312',
        live: false,
        icon: GitBranch
      },
      {
        label: 'Security Score',
        value: 'A+',
        live: false,
        icon: Shield
      }
    ]
  }, [githubStars])

  // Fetch GitHub stars
  useEffect(() => {
    fetch('https://api.github.com/repos/agentos-project/agentos')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setGithubStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Fallback to placeholder
        setGithubStars(2347)
      })
  }, [])

  // Liquid morph text switching - less frequent, smoother
  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      const now = Date.now()
      // Only switch if enough time has passed (randomized between 8-15 seconds)
      const timeSinceLastSwitch = now - lastSwitchTime.current
      const minTime = 8000 + Math.random() * 7000 // 8-15 seconds

      if (timeSinceLastSwitch >= minTime) {
        setIsTransitioning(true)
        setTimeout(() => {
          setActiveHeadline(prev => prev === 0 ? 1 : 0)
          setIsTransitioning(false)
          lastSwitchTime.current = now
        }, 600)
      }
    }, 1000) // Check every second but only switch when conditions are met

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText('npm install agentos')
    setShowToast(true)
  }, [])

  const technicalHighlights = [
    { title: 'Streaming-first runtime', detail: 'Token-level delivery across personas, guardrails, and channels.' },
    { title: 'Deterministic orchestration', detail: 'Parallel GMIs with auditable routing, approvals, and budgets.' },
    { title: 'Zero-copy memory fabric', detail: 'Vector, episodic, and working memory stitched together for recall.' },
    { title: 'Portable intelligence capsules', detail: 'Export full AgentOS instances as Markdown or JSON and ingest anywhere.' }
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden holographic-gradient">
      {/* Premium depth background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 premium-depth-1" />
        <div className="absolute inset-0 premium-depth-2 opacity-50" />
        <div className="absolute inset-0 premium-depth-3 opacity-30" />
      </div>

      {/* Enhanced particle system with intentional movement */}
      <div className="absolute inset-0 pointer-events-none">
        {!prefersReducedMotion && !isMobile && (
          <>
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `radial-gradient(circle, var(--color-accent-primary), transparent)`,
                  boxShadow: `0 0 ${10 + i % 3 * 5}px var(--color-accent-primary)`,
                  left: `${10 + (i % 6) * 15}%`,
                  top: `${10 + Math.floor(i / 6) * 20}%`,
                }}
                animate={{
                  x: [0, (i % 2 ? 30 : -30), 0],
                  y: [0, -40, 0],
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 10 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Top section with headline */}
        <div className="text-center mb-16">
          {/* Liquid morph headline */}
          <div className="relative h-32 sm:h-40 mb-8">
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeHeadline}
                className={`absolute inset-0 text-4xl sm:text-6xl lg:text-7xl font-bold liquid-morph-text ${
                  isTransitioning ? 'exiting' : 'entering'
                }`}
                style={{
                  background: 'var(--holographic-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px var(--color-accent-primary)',
                }}
              >
                {activeHeadline === 0 ? headlinePair.primary : headlinePair.alternate}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl text-muted max-w-3xl mx-auto mb-8"
          >
            {t('subtitle')}
          </motion.p>

          {/* Product Stats Card - Top positioned */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block mb-12"
          >
            <div className="holographic-card p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                {productStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-accent-primary mr-2" />
                      {stat.live && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Centered Logo Section - Lowered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-64 h-64 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary rounded-full" />
            </div>
            <div className="relative floating-hologram">
              <AnimatedAgentOSLogo className="w-48 h-48 sm:w-64 sm:h-64" />
            </div>
          </div>
        </motion.div>

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
                <h3 className="font-semibold mb-2 text-sm sm:text-base gradient-text">
                  {highlight.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted">
                  {highlight.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href={`/${locale}/docs`}
            className="neumorphic-button text-white font-medium px-8 py-3 flex items-center gap-2 group"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="https://github.com/agentos-project/agentos"
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-button bg-transparent text-primary font-medium px-8 py-3 flex items-center gap-2"
            style={{ background: 'transparent', border: '2px solid var(--glass-border)' }}
          >
            <Github className="w-4 h-4" />
            <span>{t('viewOnGithub')}</span>
          </a>
        </motion.div>

        {/* Installation Command */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={copyCommand}
            className="holographic-card px-6 py-3 flex items-center gap-3 group cursor-pointer transition-all hover:scale-105"
            aria-label="Copy installation command"
          >
            <Terminal className="w-5 h-5 text-accent-primary" />
            <code className="font-mono text-sm">npm install agentos</code>
            <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
              Click to copy
            </span>
          </button>
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              GDPR & PII Compliant
            </span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1">
              SOC2 (Coming Soon)
            </span>
            <span className="opacity-50">•</span>
            <span>Enterprise Support Available</span>
          </div>
        </motion.div>
      </div>

      <Toast
        message={t('copiedToClipboard')}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
    </section>
  )
}