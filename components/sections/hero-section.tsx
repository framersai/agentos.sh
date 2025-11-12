'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Book, Terminal, Layers, Cpu, GitBranch, Zap, Brain, Workflow, Database, Shield, Globe } from 'lucide-react'
import { AnimatedAgentOSLogo } from '../icons/animated-logo'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          {/* Enhanced Tagline Pills */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {[
              { icon: Brain, label: 'Adaptive Personas', color: 'from-purple-500 to-pink-500' },
              { icon: Workflow, label: 'GMI Workflows', color: 'from-blue-500 to-cyan-500' },
              { icon: Database, label: 'Memory Systems', color: 'from-green-500 to-emerald-500' },
              { icon: Zap, label: 'Memergence', color: 'from-orange-500 to-red-500' },
            ].map((tag, i) => (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism"
              >
                <div className={`p-1 rounded-full bg-gradient-to-r ${tag.color}`}>
                  <tag.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-text-secondary">
                  {tag.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated AgentOS Logo */}
          <div className="mb-8 flex justify-center">
            <AnimatedAgentOSLogo />
          </div>

          {/* Powerful Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Adaptive Intelligence</span>
            <br />
            <span className="text-text-primary">for Autonomous Agents</span>
          </motion.h1>

          {/* Better Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl mx-auto text-xl text-text-secondary mb-12 leading-relaxed"
          >
            Build production-ready AI systems with <span className="font-semibold text-accent-primary">TypeScript</span>.
            Featuring adaptive personas, GMI orchestration, persistent memory,
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
                  2.3k
                </span>
              </span>
            </Link>

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
                npm install @framersai/agentos
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('npm install @framersai/agentos')
                  // Add toast notification
                }}
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
              { icon: Shield, label: 'Enterprise Ready', value: '99.9% SLA' },
              { icon: Layers, label: 'GMI Agents', value: '50+ Built-in' },
              { icon: GitBranch, label: 'Open Source', value: 'Apache 2.0' },
              { icon: Globe, label: 'Global Scale', value: '10M+ Requests' },
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
  )
}