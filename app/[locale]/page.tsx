'use client'

import { useEffect, useState } from 'react'
import { HeroSection } from '../../components/sections/hero-section'
import { GMISection } from '../../components/sections/gmi-section'
import { CodeExamplesSection } from '../../components/sections/code-examples-section'
import { EcosystemSection } from '../../components/sections/ecosystem-section'
import { CTASection } from '../../components/sections/cta-section'
import { SocialProofSection } from '../../components/sections/social-proof-section'
import { CoordinationPatternsSection } from '../../components/sections/coordination-patterns-section'
import dynamic from 'next/dynamic'
import { MediaShowcase } from '../../components/media/media-showcase'
import { MarketplacePreview } from '../../components/marketplace/marketplace-preview'
import { RealStats } from '../../components/real-stats'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import { LazyMotion, domAnimation, motion } from 'framer-motion'
import { Globe, Package, Database, Terminal, Users } from 'lucide-react'

const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false }
)
const FloatingElementsLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.FloatingElements),
  { ssr: false }
)

// Enhanced feature cards with better descriptions
const featureCards = [
  {
    icon: Users,
    title: 'Emergent Multi-Agent Coordination',
    body: 'Spawn researcher, analyst, critic, and executor personas from a single goal. Shared context, budgets, and approvals keep every branch in sync.',
    pill: '🆕 v0.1.0',
    gradient: 'from-violet-500 to-purple-500',
    layout: 'horizontal',
    span: 'lg:col-span-2',
    bullets: ['Deterministic routing or adaptive fan-out', 'Citations + memory stitched automatically']
  },
  {
    icon: Package,
    title: 'Tool & Guardrail Packs',
    body: 'Ship opinionated extensions for search, vision, code execution, or custom APIs with built-in permissions and retries.',
    pill: 'Extension Ecosystem',
    gradient: 'from-blue-500 to-cyan-500',
    layout: 'vertical',
    bullets: ['Manifest-driven tool registry', 'Guardrail presets + compliance tags']
  },
  {
    icon: Globe,
    title: 'Language & Translation',
    body: 'Auto-detect locale and tone per surface. Personas stay fluent across voice, chat, and docs with translation providers of your choice.',
    pill: 'Multilingual Ready',
    gradient: 'from-purple-500 to-pink-500',
    layout: 'vertical',
    bullets: ['Persona-aware tone adaptation', 'Fallback routing by locale']
  },
  {
    icon: Database,
    title: 'Storage & Deployment',
    body: 'Switch between PostgreSQL, better-sqlite3, sql.js, or your own data layers. Every agent step is synced and replayable.',
    pill: 'Deploy Anywhere',
    gradient: 'from-green-500 to-emerald-500',
    layout: 'horizontal',
    span: 'lg:col-span-2',
    bullets: ['Reference server templates', 'Snapshot + replay tooling']
  },
  {
    icon: Terminal,
    title: 'Local-First Workbench',
    body: 'Prototype entire agencies in-browser with persisted SQL, timeline scrubbers, and a built-in marketplace of personas.',
    pill: 'Offline Capable',
    gradient: 'from-orange-500 to-red-500',
    layout: 'vertical',
    bullets: ['Inspect reasoning + telemetry live', 'Sync artifacts back to the cloud', 'Export full agencies as Markdown/JSON bundles']
  }
]

// (roadmap reserved: moved to docs landing)

// (testimonials reserved: moved to marketing site)


export default function LandingPage() {
  return (
    <LazyMotion features={domAnimation}>
      {/* Animated Background (mount after idle) */}
      <DeferredAnimatedBackground />

      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section with new design */}
        <HeroSection />

        {/* GMI Section with architecture diagrams */}
        <GMISection />

        {/* Features Grid */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 section-tint relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl mb-6 section-title">Enterprise‑Ready Features</h2>
              <p className="text-lg text-text-muted max-w-3xl mx-auto">
                Production-grade infrastructure for building, deploying, and scaling AI agents
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
              {featureCards.map((card, index) => {
                const Icon = card.icon
                const isHorizontal = card.layout === 'horizontal'
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`group surface-card h-full ${card.span ?? ''} ${isHorizontal ? 'p-8 md:flex md:items-center md:gap-6' : 'p-8 flex flex-col gap-4'}`}
                  >
                    <div className={`flex ${isHorizontal ? 'items-center gap-6 w-full' : 'items-start gap-4'}`}>
                      <div className={`shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                        <Icon className="w-7 h-7 drop-shadow" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 text-xs font-semibold text-accent-primary">
                          {card.pill}
                        </span>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {card.body}
                        </p>
                        {card.bullets && (
                          <ul className="space-y-1.5 text-sm text-text-secondary">
                            {card.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>


        <SocialProofSection />

        {/* Coordination Patterns Section */}
        <CoordinationPatternsSection />

        {/* Code Examples Section */}
        <CodeExamplesSection />


        {/* Marketplace Preview - Coming Soon */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 backdrop-blur-md bg-background-primary/60 z-10 flex items-center justify-center rounded-3xl">
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl section-title">Agent Marketplace Coming Soon</h3>
                <p className="text-lg text-gray-700 dark:text-text-secondary max-w-2xl mx-auto">
                  Share, buy, and sell your AgentOS agencies. We&#39;ll handle CI/CD, infrastructure, payouts, and compliance so you can focus on adaptive, emergent, permanent intelligence.
                </p>
              </div>
            </div>
            <div className="blur-sm opacity-30">
              <MarketplacePreview />
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <EcosystemSection />

        {/* Case Studies - Coming Soon */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 backdrop-blur-sm bg-background-primary/50 z-10 flex items-center justify-center rounded-3xl">
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl section-title">Case Studies Coming Soon</h3>
                <p className="text-lg text-gray-700 dark:text-text-secondary">
                  Real-world AgentOS implementations and production deployments
                </p>
              </div>
            </div>
            <div className="blur-md opacity-20">
              <MediaShowcase />
            </div>
          </div>
        </section>

        {/* Real Stats Section */}
        <RealStats />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <footer className="bg-background-tertiary py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-text-primary">AgentOS</h3>
                <p className="text-sm text-text-muted">
                  TypeScript runtime for adaptive AI agent intelligence.
                </p>
                <div className="mt-3 text-xs text-text-muted">
                  <p>Core: Apache 2.0</p>
                  <p>Extensions & Guardrails: MIT</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-text-primary">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://docs.agentos.sh" className="text-text-secondary hover:text-accent-primary">Documentation</a></li>
                  <li><a href="https://github.com/framersai/agentos" className="text-text-secondary hover:text-accent-primary">GitHub</a></li>
                  <li><a href="https://discord.gg/framersai" className="text-text-secondary hover:text-accent-primary">Discord</a></li>
                  <li><a href="https://vca.chat" className="text-text-secondary hover:text-accent-primary">Marketplace</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-text-primary">FramersAI</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://github.com/framersai" className="text-text-secondary hover:text-accent-primary">GitHub Org</a></li>
                  <li><a href="https://twitter.com/framersai" className="text-text-secondary hover:text-accent-primary">Twitter</a></li>
                  <li><a href="https://www.linkedin.com/company/framersai" className="text-text-secondary hover:text-accent-primary">LinkedIn</a></li>
                  <li><a href="mailto:hello@frame.dev" className="text-text-secondary hover:text-accent-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-text-primary">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/legal/privacy" className="text-text-secondary hover:text-accent-primary">Privacy Policy</a></li>
                  <li><a href="/legal/terms" className="text-text-secondary hover:text-accent-primary">Terms of Service</a></li>
                  <li><a href="https://github.com/framersai/agentos/blob/main/LICENSE" className="text-text-secondary hover:text-accent-primary">License</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border-subtle text-center">
              <p className="text-sm text-text-muted">
                © 2024 FramersAI / Frame.dev. All rights reserved. Built with AgentOS.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </LazyMotion>
  )
}

function DeferredAnimatedBackground() {
  const [showBg, setShowBg] = useState(false)
  useEffect(() => {
    const mount = () => setShowBg(true)
    if ('requestIdleCallback' in window) {
      const w = window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }
      w.requestIdleCallback(mount, { timeout: 1200 })
    } else {
      const t = setTimeout(mount, 600)
      return () => clearTimeout(t)
    }
  }, [])
  if (!showBg) return null
  return (
    <>
      <AnimatedBackgroundLazy />
      <FloatingElementsLazy />
    </>
  )
}