'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Github, Terminal, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AnimatedAgentOSLogo } from '../icons/animated-logo'
import { TypeScriptIcon, OpenSourceIcon, StreamingIcon, MemoryIcon } from '../icons/feature-icons'
import { Toast } from '../ui/toast'

export function HeroSection() {
  const t = useTranslations('hero')
  const [showToast, setShowToast] = useState(false)
  const [stars, setStars] = useState<number | null>(null)
  const [converge, setConverge] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const headlinePairs = [
    { top: 'Adaptive Intelligence', bottom: 'for Autonomous Agents' },
    { top: 'Emergent Intelligence', bottom: 'for Enterprise Orchestration' },
    { top: 'Adaptive Intelligence', bottom: 'for Safety-Critical Workflows' },
    { top: 'Emergent Intelligence', bottom: 'for Parallel AI Teams' }
  ] as const
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const activePair = headlinePairs[headlineIndex]
  const technicalHighlights = [
    { title: 'Streaming-first runtime', detail: 'Token-level delivery across personas, guardrails, and channels.' },
    { title: 'Deterministic orchestration', detail: 'Parallel GMIs with auditable routing, approvals, and budgets.' },
    { title: 'Zero-copy memory fabric', detail: 'Vector, episodic, and working memory stitched together for recall.' },
    { title: 'Portable intelligence capsules', detail: 'Export full AgentOS instances as Markdown or JSON and ingest anywhere.' }
  ] as const

  const heroVisualStats = [
    { label: 'Agencies live', value: '128' },
    { label: 'Approval SLA', value: '3.2 min' },
    { label: 'Guardrail coverage', value: '98%' }
  ] as const

  // Lightweight resize listener to toggle mobile optimisations
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  const handleCopy = () => {
    navigator.clipboard.writeText('npm install @framers/agentos')
    setShowToast(true)
    
  }
  
  // Fetch GitHub stars (framersai/agentos)
  useEffect(() => {
    let cancelled = false
    const fetchStars = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/framersai/agentos', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setStars(typeof data.stargazers_count === 'number' ? data.stargazers_count : 0)
        } else {
          if (!cancelled) setStars(0)
        }
      } catch {
        if (!cancelled) setStars(0)
      }
    }
    fetchStars()
    return () => { cancelled = true }
  }, [])
  
  // Smooth headline cycle tied to background motion
  useEffect(() => {
    let shimmerTimeout: number | undefined
    const advanceHeadline = () => {
      setHeadlineIndex((prev) => (prev + 1) % headlinePairs.length)
      setConverge(true)
      shimmerTimeout = window.setTimeout(() => setConverge(false), 1400)
    }
    const intervalId = window.setInterval(advanceHeadline, 6500)
    return () => {
      window.clearInterval(intervalId)
      if (shimmerTimeout) window.clearTimeout(shimmerTimeout)
    }
  }, [headlinePairs.length])
  
  return (
    <>
      <Toast 
        message="Copied to clipboard!" 
        type="success" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden transition-theme section-gradient">
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient" />
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary/92 via-background-secondary/55 to-background-primary/92" />
      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_20%,var(--color-accent-warm-soft),transparent_55%),radial-gradient(circle_at_80%_0%,hsla(260,90%,65%,0.25),transparent_65%)]" />

      {/* Floating particles with emergence/convergence (synced to headline morphs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Reduce animated particle count on mobile and respect reduced motion */}
        {[...Array(prefersReducedMotion ? 0 : isMobile ? 6 : 16)].map((_, i) => {
          const baseX = Math.random() * 100
          const baseY = Math.random() * 100
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent-primary rounded-full"
              style={{
                left: `${baseX}%`,
                top: `${baseY}%`,
              }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.35 }
                  : converge
                    ? {
                        x: (50 - baseX) * 0.45,
                        y: (50 - baseY) * 0.45,
                        opacity: 0.85,
                        scale: 1.5,
                      }
                    : {
                        x: [0, Math.random() * 28 - 14, 0],
                        y: [0, -22, 0],
                        opacity: [0.15, 0.6, 0.15],
                        scale: [1, 1.12, 1],
                      }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : converge ? 1.4 : 14 + Math.random() * 8,
                repeat: converge ? 0 : Infinity,
                delay: converge ? i * 0.015 : Math.random() * 6,
                ease: [0.45, 0.05, 0.55, 0.95]
              }}
            />
          )
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex justify-center lg:justify-start">
            <AnimatedAgentOSLogo />
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
            <div className="text-center lg:text-left space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-[-0.02em] overflow-visible font-[family-name:var(--font-grotesk)]"
              >
                <span className="gradient-text inline-block py-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activePair.top}
                      initial={{ opacity: 0, y: 12, clipPath: 'inset(0% 0% 100% 0%)' }}
                      animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                      exit={{ opacity: 0, y: -12, clipPath: 'inset(0% 0% 100% 0%)' }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block"
                    >
                      {activePair.top}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <br />
                <span className="text-text-primary inline-block py-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activePair.bottom}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block"
                    >
                      {activePair.bottom}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto lg:mx-0"
              >
                {t('subtitle')}
              </motion.p>

              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {technicalHighlights.map((item) => (
                  <motion.li
                    key={item.title}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                    className="rounded-2xl border border-border-subtle/70 bg-white/85 dark:bg-white/5 dark:border-white/10 p-4 shadow-sm dark:shadow-none backdrop-blur text-left"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                      <span className="h-2 w-8 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" />
                      {item.title}
                    </span>
                    <p className="text-sm text-text-muted leading-relaxed">{item.detail}</p>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="https://vca.chat"
                  className="group relative btn-primary overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-secondary via-accent-tertiary to-[color:var(--color-accent-warm)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Try Voice Chat Assistant
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link
                  href="https://github.com/framersai/agentos"
                  className="btn-secondary group"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Github className="w-5 h-5" />
                    Star on GitHub
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold">
                      {stars ?? '—'}
                    </span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <span className="text-sm text-text-muted">
                  Need curated agents?{' '}
                  <Link
                    href="https://app.vca.chat/marketplace"
                    className="inline-flex items-center gap-1 font-semibold text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    Marketplace coming soon
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl glass-morphism shadow-modern">
                  <Terminal className="w-5 h-5 text-accent-primary animate-pulse-glow" />
                  <code className="text-sm font-mono text-text-primary select-all">
                    npm install @framers/agentos
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-accent-primary/10 transition-colors group"
                    aria-label="Copy command"
                  >
                    <svg className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {[
                  { icon: TypeScriptIcon, label: 'TypeScript Native', value: 'Type-Safe' },
                  { icon: OpenSourceIcon, label: 'Open Source', value: 'Apache 2.0' },
                  { icon: StreamingIcon, label: 'Real-time Streaming', value: 'Async Ready' },
                  { icon: MemoryIcon, label: 'Persistent Memory', value: 'Built-in' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="mb-2 inline-flex p-3 rounded-xl glass-morphism group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-xs text-text-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <HeroVisual stats={heroVisualStats} />
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

function HeroVisual({ stats }: { stats: ReadonlyArray<{ label: string; value: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.9 }}
      className="hero-visual-shell"
    >
      <div className="rounded-[32px] p-1 hero-visual-glow">
        <div className="relative h-full w-full rounded-[28px] bg-white/92 dark:bg-slate-950/70 border border-border-subtle/80 dark:border-white/10 shadow-modern-lg overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-r from-accent-primary/40 via-accent-tertiary/40 to-[color:var(--color-accent-warm-soft)] opacity-70 blur-2xl" />
          <div className="relative p-4 sm:p-6 space-y-4">
            <div className="rounded-2xl border border-border-subtle/80 overflow-hidden bg-background-primary/95 dark:bg-black/40 shadow-inner">
              <Image
                src="/og-image.png"
                alt="AgentOS orchestration workspace preview"
                width={880}
                height={506}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border-subtle/70 bg-white/85 dark:bg-white/5 dark:border-white/10 p-3 text-left shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-text-muted mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}