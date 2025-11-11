'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Book, Code2, Sparkles, Terminal, Layers, Cpu, Box, GitBranch } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.4">
                <animate attributeName="stop-color" values="var(--color-accent-primary);var(--color-accent-secondary);var(--color-accent-primary)" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.2">
                <animate attributeName="stop-color" values="var(--color-accent-secondary);var(--color-accent-primary);var(--color-accent-secondary)" dur="8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          {/* Neural Network Nodes */}
          {[...Array(15)].map((_, i) => {
            const x = Math.random() * 1200
            const y = Math.random() * 800
            const delay = Math.random() * 5
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="url(#neural-gradient)">
                  <animate attributeName="r" values="4;8;4" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
                </circle>
                {/* Connection lines */}
                {i > 0 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={Math.random() * 1200}
                    y2={Math.random() * 800}
                    stroke="url(#neural-gradient)"
                    strokeWidth="0.5"
                    opacity="0.3"
                  >
                    <animate attributeName="opacity" values="0;0.5;0" dur="4s" begin={`${delay}s`} repeatCount="indefinite" />
                  </line>
                )}
              </g>
            )
          })}
        </svg>
      </div>

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

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              AgentOS
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-text-secondary">
              TypeScript Runtime for AI Agents
            </span>
          </h1>

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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="https://vca.chat"
              className="group px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Box className="w-5 h-5" />
              Try Voice Chat Assistant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 backdrop-blur-md" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-reverse">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-accent-secondary/20 to-accent-primary/20 backdrop-blur-md" />
      </div>
    </section>
  )
}