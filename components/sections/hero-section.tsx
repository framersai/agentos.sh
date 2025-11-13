'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Terminal, Zap, Globe, Play } from 'lucide-react'
import { AnimatedAgentOSLogo } from '../icons/animated-logo'
import { TypeScriptIcon, OpenSourceIcon, StreamingIcon, MemoryIcon } from '../icons/feature-icons'
import { Toast } from '../ui/toast'

export function HeroSection() {
  const [showToast, setShowToast] = useState(false)
  const [stars, setStars] = useState<number | null>(null)
  const [altTop, setAltTop] = useState(false)
  const [altBottom, setAltBottom] = useState(false)
  
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
  
  // Alternation of headline words (exclusive "Emergent" across lines; 6-12s cycles)
  useEffect(() => {
    let mounted = true
    let t1: number | undefined
    let t2: number | undefined
    const scheduleTop = (delay: number) => {
      t1 = window.setTimeout(() => {
        if (!mounted) return
        setAltTop((curr) => {
          const next = !curr
          if (next) setAltBottom(false)
          return next
        })
        scheduleTop(6000 + Math.floor(Math.random() * 6000))
      }, delay)
    }
    const scheduleBottom = (delay: number) => {
      t2 = window.setTimeout(() => {
        if (!mounted) return
        setAltBottom((curr) => {
          const next = !curr
          if (next) setAltTop(false)
          return next
        })
        scheduleBottom(8000 + Math.floor(Math.random() * 4000))
      }, delay)
    }
    scheduleTop(4000)
    scheduleBottom(7000)
    return () => {
      mounted = false
      if (t1) window.clearTimeout(t1)
      if (t2) window.clearTimeout(t2)
    }
  }, [])
  
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
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary/90 via-background-secondary/50 to-background-primary/90" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Tagline pills removed per request */}

          {/* Animated AgentOS Logo */}
          <div className="mb-8 flex justify-center">
            <AnimatedAgentOSLogo />
          </div>

          {/* Powerful Headline with word-stagger morph (mobile-friendly) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.3] overflow-visible pb-2 px-2"
          >
            <span className="gradient-text inline-block py-2">
              {(altTop ? 'Emergent Intelligence' : 'Adaptive Intelligence').split(' ').map((word, wi) => (
                <span key={`top-word-${wi}`} className="inline-block mr-3">
                  {word.split('').map((char, ci) => (
                    <motion.span
                      key={`top-${altTop ? 'emergent' : 'adaptive'}-${wi}-${ci}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: (wi * 5 + ci) * 0.03 }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
            <br />
            <span className="text-text-primary inline-block py-2">
              {(altBottom ? 'for Emergent Agents' : 'for Autonomous Agents').split(' ').map((word, wi) => (
                <span key={`bottom-word-${wi}`} className="inline-block mr-3">
                  {word.split('').map((char, ci) => (
                    <motion.span
                      key={`bottom-${altBottom ? 'emergent' : 'autonomous'}-${wi}-${ci}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: (wi * 5 + ci) * 0.03 }}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </motion.h1>

          {/* Better Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl mx-auto text-xl text-text-secondary mb-12 leading-relaxed"
          >
            Build production-ready AI systems with <span className="font-semibold text-accent-primary">TypeScript</span>.
            Featuring adaptive personas, <a href="/#gmis" className="font-semibold text-accent-primary underline-offset-4 hover:underline">GMI orchestration</a>, persistent memory,
            and enterprise-grade guardrails for scalable multi-agent intelligence.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="https://vca.chat"
              className="group relative btn-primary overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

            <a
              href="#demo"
              className="btn-secondary group"
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                See demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <Link
              href="https://app.vca.chat/marketplace"
              className="btn-secondary group"
            >
              <span className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          {/* Quick Install */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
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

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
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
        </motion.div>
      </div>
    </section>
    </>
  )
}