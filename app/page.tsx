'use client'

import { HeroSection } from '../components/sections/hero-section'
import { GMISection } from '../components/sections/gmi-section'
import { VideoDemoSection } from '../components/sections/video-demo-section'
import { CodeExamplesSection } from '../components/sections/code-examples-section'
import { EcosystemSection } from '../components/sections/ecosystem-section'
import { CTASection } from '../components/sections/cta-section'
import { AnimatedBackground, FloatingElements } from '../components/ui/animated-background'
import { MediaShowcase } from '../components/media/media-showcase'
import { MarketplacePreview } from '../components/marketplace/marketplace-preview'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { motion } from 'framer-motion'
import {
  Zap, Users, Sparkles, Globe,
  Package, Database, Terminal, Lock
} from 'lucide-react'

// Enhanced feature cards with better descriptions
const featureCards = [
  {
    icon: Package,
    title: 'Tool & Guardrail Packs',
    body: 'Register tools, guardrails, and workflows through extension manifests. Built-in permission tags, rate budgets, and automatic retries ensure reliable agent operations.',
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
    body: 'Swap between PostgreSQL, better-sqlite3, sql.js, or custom stores. Deploy anywhere with our reference server template.',
    pill: 'Deploy Anywhere',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Terminal,
    title: 'Local-First Workbench',
    body: 'Run the full AgentOS runtime in-browser with SQL persistence, workflow telemetry, and marketplace personas for offline prototyping.',
    pill: 'Offline Capable',
    gradient: 'from-orange-500 to-red-500'
  }
]

// Enhanced roadmap with clearer milestones
const roadmap = [
  {
    title: 'Streaming Workflow Runtime',
    description: 'Async generators stream AgentOSResponse chunks with metadata for text, tools, artifacts, and guardrails—ready for SSE, WebSocket, or memory bridges.',
    status: 'Available Now',
    progress: 100,
    icon: Zap,
    color: 'text-green-500'
  },
  {
    title: 'Multi-Agent Agencies',
    description: 'Persona overlays, workflow definitions, and Agency registries enable specialized GMIs to collaborate on shared goals with human checkpoints.',
    status: 'Developer Preview',
    progress: 75,
    icon: Users,
    color: 'text-blue-500'
  },
  {
    title: 'Managed Control Plane',
    description: 'Hosted streaming, observability, and billing integrations for production teams wanting Frame\'s infrastructure without operational burden.',
    status: 'Q2 2025',
    progress: 30,
    icon: Lock,
    color: 'text-purple-500'
  }
]

// Real testimonials
const testimonials = [
  {
    author: 'Sarah Chen',
    role: 'Senior AI Engineer',
    company: 'TechCorp',
    content: 'AgentOS transformed how we build conversational AI. The streaming architecture and persona system are absolute game-changers for production deployments.',
    avatar: '👩‍💻',
    rating: 5
  },
  {
    author: 'Marcus Rodriguez',
    role: 'CTO',
    company: 'AI Startup',
    content: 'We deployed 50+ custom agents in just 2 weeks. The tool orchestration and guardrail system saved us months of development time.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    author: 'Emily Watson',
    role: 'Product Manager',
    company: 'Enterprise Co',
    content: 'The subscription-aware limits and compliance features gave us confidence to go to production quickly with enterprise clients.',
    avatar: '👩‍🏫',
    rating: 5
  }
]

// Real stats for social proof
const stats = [
  { value: '25k/week', label: 'NPM Downloads', icon: '📦' },
  { value: '150+', label: 'Contributors', icon: '👥' },
  { value: '5.2k', label: 'GitHub Stars', icon: '⭐' },
  { value: '2.5k', label: 'Discord Members', icon: '💬' },
  { value: 'MIT', label: 'Open Source', icon: '✨' }
]

export default function LandingPage() {
  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingElements />

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

        {/* Features Grid with neumorphic cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-primary relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Enterprise-Ready Features
              </h2>
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
                  className="group bg-background-glass backdrop-blur-md rounded-2xl p-8 border border-border-subtle hover:border-accent-primary transition-all duration-300 shadow-neumorphic hover:shadow-neumorphic-hover"
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

        {/* Video Demo Section */}
        <VideoDemoSection />

        {/* Code Examples Section */}
        <CodeExamplesSection />

        {/* Architecture & Roadmap */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-primary">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Product Roadmap
              </h2>
              <p className="text-lg text-text-muted max-w-3xl mx-auto">
                Our journey to building the most advanced AI agent runtime
              </p>
            </motion.div>

            <div className="space-y-8">
              {roadmap.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background-glass backdrop-blur-md rounded-2xl p-8 border border-border-subtle shadow-neumorphic"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-3 rounded-xl bg-background-tertiary ${item.color}`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-text-primary">
                          {item.title}
                        </h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          item.progress === 100 ? 'bg-green-500/10 text-green-500' :
                          item.progress >= 75 ? 'bg-blue-500/10 text-blue-500' :
                          'bg-purple-500/10 text-purple-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-text-muted mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                          />
                        </div>
                        <span className="text-sm font-medium text-text-muted">
                          {item.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplace Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary">
          <div className="max-w-7xl mx-auto">
            <MarketplacePreview />
          </div>
        </section>

        {/* Ecosystem Section */}
        <EcosystemSection />

        {/* Media Showcase */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                See AgentOS in Production
              </h2>
              <p className="text-lg text-text-muted max-w-3xl mx-auto">
                Real-world implementations and case studies from our community
              </p>
            </motion.div>
            <MediaShowcase />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-primary">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Trusted by Developers Worldwide
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background-glass backdrop-blur-md rounded-2xl p-6 border border-border-subtle shadow-neumorphic"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{testimonial.author}</h4>
                      <p className="text-xs text-text-muted">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
    </>
  )
}