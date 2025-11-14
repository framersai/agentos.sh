'use client'

import { useEffect, useState } from 'react'
import { HeroSection } from '../components/sections/hero-section'
import { GMISection } from '../components/sections/gmi-section'
import { CodeExamplesSection } from '../components/sections/code-examples-section'
import { EcosystemSection } from '../components/sections/ecosystem-section'
import { CTASection } from '../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { MediaShowcase } from '../components/media/media-showcase'
import { MarketplacePreview } from '../components/marketplace/marketplace-preview'
import { RealStats } from '../components/real-stats'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { LazyMotion, domAnimation, motion } from 'framer-motion'
import { Globe, Package, Database, Terminal, Users } from 'lucide-react'

const AnimatedBackgroundLazy = dynamic(
  () => import('../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false }
)
const FloatingElementsLazy = dynamic(
  () => import('../components/ui/animated-background').then(m => m.FloatingElements),
  { ssr: false }
)

// Enhanced feature cards with better descriptions
const featureCards = [
  {
    icon: Users,
    title: 'Emergent Multi-Agent Coordination',
    body: 'Agents autonomously decompose complex goals into subtasks, spawn adaptive roles, and coordinate through shared context. Choose emergent (adaptive) or static (deterministic) strategies for optimal control.',
    pill: '🆕 v0.1.0',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    icon: Package,
    title: 'Tool & Guardrail Packs',
    body: 'Register tools, guardrails, and workflows through extension manifests. Built-in permission tags, rate budgets, and automatic retries ensure reliable agent operations. Verified extensions program included.',
    pill: 'Extension Ecosystem',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: 'Language & Translation',
    body: 'Auto language detection, persona-aware responses, and pluggable translation providers keep GMIs fluent across every surface and locale.',
    pill: 'Multilingual Ready',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Database,
    title: 'Storage & Deployment',
    body: 'Swap between PostgreSQL, better-sqlite3, sql.js, or custom stores. Full state persistence for agency executions, seat progress, and emergent metadata. Deploy anywhere with our reference server template.',
    pill: 'Deploy Anywhere',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Terminal,
    title: 'Local-First Workbench',
    body: 'Run the full AgentOS runtime in-browser with SQL persistence, workflow telemetry, agency history view, and marketplace personas for offline prototyping. Browse emergent behavior insights in real-time.',
    pill: 'Offline Capable',
    gradient: 'from-orange-500 to-red-500'
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
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background-primary relative">
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

            <div className="grid md:grid-cols-2 gap-6">
              {featureCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group surface-card p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}>
                      <card.icon className="w-8 h-8 text-accent-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-accent-primary/10 text-xs font-semibold text-accent-primary mb-3">
                        {card.pill}
                      </span>
                      <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-text-muted">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Code Examples Section */}
        <CodeExamplesSection />


        {/* Marketplace Preview - Coming Soon */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 backdrop-blur-md bg-background-primary/60 z-10 flex items-center justify-center rounded-3xl">
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl section-title">Agent Marketplace Coming Soon</h3>
                <p className="text-lg text-gray-700 dark:text-text-secondary max-w-2xl mx-auto">
                  Share, sell, and distribute your AgentOS agents. We&#39;ll handle CI/CD, infrastructure, and payments with a small commission.
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
      ;(window as any).requestIdleCallback(mount, { timeout: 1200 })
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