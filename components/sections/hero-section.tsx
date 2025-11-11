'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Book, Sparkles, Terminal, Layers, Cpu, GitBranch } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Minimal gradient background - much cleaner */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary/30 to-background-primary" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* New Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 backdrop-blur-sm border border-accent-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Adaptive Emergent Intelligence with Agencies
            </span>
          </motion.div>

          {/* Animated AgentOS Logo SVG */}
          <div className="mb-8 flex justify-center">
            <svg
              width="300"
              height="120"
              viewBox="0 0 300 120"
              className="w-48 sm:w-64 md:w-72 lg:w-80"
            >
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-primary)">
                    <animate attributeName="stop-color" values="var(--color-accent-primary);var(--color-accent-secondary);var(--color-accent-primary)" dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="var(--color-accent-secondary)">
                    <animate attributeName="stop-color" values="var(--color-accent-secondary);var(--color-accent-primary);var(--color-accent-secondary)" dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>

              {/* Living dots animation around logo */}
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={i}
                  r="2"
                  fill="url(#logo-gradient)"
                  opacity="0.6"
                  initial={{ cx: 50 + i * 40, cy: 60 }}
                  animate={{
                    cx: [50 + i * 40, 50 + i * 40 + 10, 50 + i * 40],
                    cy: [60, 50, 60],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* AgentOS Text */}
              <text x="150" y="65" textAnchor="middle" className="text-5xl font-bold">
                <tspan fill="var(--color-text-primary)">Agent</tspan>
                <tspan fill="url(#logo-gradient)">OS</tspan>
              </text>
            </svg>
          </div>

          {/* Subtitle */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 text-text-secondary">
            TypeScript Runtime for AI Agents
          </h2>

          {/* Better Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-text-muted mb-8">
            Build autonomous AI systems with memory, tools, and agency.
            <span className="block mt-2 text-accent-primary">
              The open-source foundation for adaptive multi-agent intelligence.
            </span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: Layers, label: 'GMI Roles', color: 'text-blue-500' },
              { icon: Cpu, label: 'Agency AI', color: 'text-purple-500' },
              { icon: Terminal, label: 'TypeScript', color: 'text-green-500' },
              { icon: GitBranch, label: 'Open Source', color: 'text-orange-500' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-glass backdrop-blur-md border border-border-subtle"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons - Better visibility */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="https://vca.chat"
              className="group px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <Sparkles className="w-5 h-5" />
              <span className="relative z-10">Try Voice Chat Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>

            <Link
              href="https://github.com/framersai/agentos"
              className="group px-8 py-4 bg-background-glass backdrop-blur-md rounded-xl font-semibold border-2 border-accent-primary hover:bg-accent-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              View on GitHub
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/docs"
              className="group px-8 py-4 bg-background-glass backdrop-blur-md rounded-xl font-semibold border-2 border-border-interactive hover:border-accent-primary transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Book className="w-5 h-5" />
              Documentation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* NPM Install Command */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-background-tertiary/50 backdrop-blur-sm border border-border-subtle">
              <Terminal className="w-5 h-5 text-accent-primary" />
              <code className="text-sm font-mono text-text-primary select-all">
                npm install @framersai/agentos
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('npm install @framersai/agentos')
                  // Optional: Add toast notification here
                }}
                className="p-2 rounded-lg hover:bg-background-primary/50 transition-colors"
                aria-label="Copy command"
              >
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Quick Links to Repos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8 border-t border-border-subtle"
          >
            <p className="text-sm text-text-muted mb-4">Explore the AgentOS Ecosystem</p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'AgentOS Core', href: 'https://github.com/framersai/agentos', icon: '🧠' },
                { name: 'Extensions', href: 'https://github.com/framersai/agentos-extensions', icon: '🔌' },
                { name: 'Client', href: 'https://github.com/framersai/agentos-client', icon: '💻' },
                { name: 'Guardrails', href: 'https://github.com/framersai/agentos-guardrails', icon: '🛡️' },
                { name: 'VCA Marketplace', href: 'https://github.com/framersai/voice-chat-assistants', icon: '🎙️' },
              ].map((repo) => (
                <a
                  key={repo.name}
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <span className="text-lg">{repo.icon}</span>
                  <span className="underline-offset-2 hover:underline">{repo.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}