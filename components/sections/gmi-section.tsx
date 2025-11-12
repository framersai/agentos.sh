'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Network, GitBranch, Cpu, Activity, Code, ArrowRight } from 'lucide-react'

// Interactive diagram data
const architectureLayers = [
  {
    id: 'application',
    name: 'Application Layer',
    components: ['Voice Chat', 'Web Interface', 'API Endpoints', 'Webhooks'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'orchestration',
    name: 'Orchestration Layer',
    components: ['Agency Manager', 'Workflow Engine', 'Task Scheduler', 'Load Balancer'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'gmi',
    name: 'GMI Core Layer',
    components: ['Agent Runtime', 'Memory System', 'Context Manager', 'Role Engine'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure Layer',
    components: ['Vector DB', 'Event Stream', 'Storage', 'Compute'],
    color: 'from-orange-500 to-red-500'
  }
]

export function GMISection() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const agents = [
    { id: 'researcher', name: 'Researcher', icon: Brain, description: 'Discovers and analyzes information' },
    { id: 'analyst', name: 'Analyst', icon: Activity, description: 'Processes and interprets data' },
    { id: 'creator', name: 'Creator', icon: Code, description: 'Generates content and solutions' },
    { id: 'executor', name: 'Executor', icon: Cpu, description: 'Takes actions and implements' },
    { id: 'orchestrator', name: 'Orchestrator', icon: Network, description: 'Coordinates multi-agent tasks' }
  ]

  return (
    <section id="gmis" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme section-gradient" aria-labelledby="gmi-heading">
      {/* Subtle organic gradient */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 id="gmi-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Parallel Agency</span>
          </h2>
          <p className="text-sm uppercase tracking-wide text-text-muted mb-3">Use case: Real‑time fact‑checked briefing</p>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Build sophisticated AI systems with adaptive personas, emergent behaviors, and true multi-agent collaboration.
            GMIs enable autonomous agents that learn, adapt, and evolve.
          </p>
        </div>

        {/* Interactive Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            {/* Removed section header to reduce noise */}

            {/* Layered Architecture Visualization */}
            <div className="relative">
              {architectureLayers.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <div
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      activeLayer === layer.id
                        ? 'border-accent-primary shadow-modern scale-105'
                        : 'border-border-subtle hover:border-accent-primary/50'
                    }`}
                    onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${layer.color}`} />
                        <h4 className="text-lg font-bold text-text-primary">{layer.name}</h4>
                      </div>
                      <motion.div
                        animate={{ rotate: activeLayer === layer.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 text-text-muted" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {activeLayer === layer.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border-subtle overflow-hidden"
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {layer.components.map((component, i) => (
                              <motion.div
                                key={component}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-2 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 text-sm text-text-secondary text-center"
                              >
                                {component}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Connection lines */}
                  {index < architectureLayers.length - 1 && (
                    <div className="flex justify-center my-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 20 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="w-0.5 bg-gradient-to-b from-accent-primary/50 to-accent-secondary/50"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Agent Network Diagram (slower, more detailed, visible popovers) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-text-primary">Multi‑Agent Collaboration Network</h3>
            <p className="text-center text-text-muted mb-8">Researcher, Analyst, Creator, Critic, Executor stream insights in parallel; Orchestrator routes, memory persists.</p>

            <div className="relative aspect-square max-w-2xl mx-auto">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <defs>
                  <radialGradient id="agent-gradient">
                    <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.1" />
                  </radialGradient>
                  <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-accent-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent-secondary)" />
                  </linearGradient>
                </defs>

                {/* Central hub */}
                <motion.circle
                  cx="250"
                  cy="250"
                  r="60"
                  fill="url(#agent-gradient)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <text x="250" y="250" textAnchor="middle" className="fill-text-primary font-bold text-sm" dy="5">
                  Agency Core
                </text>

                {/* Agent nodes */}
                {[
                  ...agents,
                  { id: 'critic', name: 'Critic', icon: Activity, description: 'Reviews outputs and flags issues' },
                ].map((agent, i, arr) => {
                  const angle = (i / agents.length) * 2 * Math.PI
                  const x = 250 + 150 * Math.cos(angle)
                  const y = 250 + 150 * Math.sin(angle)

                  return (
                    <g key={agent.id}>
                      {/* Connection lines */}
                      <motion.line
                        x1="250"
                        y1="250"
                        x2={x}
                        y2={y}
                        stroke="url(#flow-gradient)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        opacity="0.35"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.2, delay: i * 0.05 }}
                      />

                      {/* Agent node */}
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        className="cursor-pointer"
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r="40"
                          fill="var(--color-background-primary)"
                          stroke={selectedAgent === agent.id ? "var(--color-accent-primary)" : "var(--color-border-primary)"}
                          strokeWidth="2"
                        />
                        <text x={x} y={y - 5} textAnchor="middle" className="fill-text-primary font-semibold text-xs">
                          {agent.name}
                        </text>
                        <text x={x} y={y + 10} textAnchor="middle" className="fill-text-muted text-xs">
                          GMI
                        </text>
                      </motion.g>

                      {/* Data flow animation */}
                      <motion.circle
                        r="3"
                        fill="var(--color-accent-primary)"
                        initial={{ x: 250, y: 250 }}
                        animate={{
                          x: [250, x, 250],
                          y: [250, y, 250]
                        }}
                        transition={{
                          duration: 8,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Parallel popovers for all nodes (static for mobile visibility) */}
              <div className="pointer-events-none absolute inset-0">
                {[
                  ...agents,
                  { id: 'critic', name: 'Critic', icon: Activity, description: 'Reviews outputs and flags issues' },
                ].map((agent, i) => {
                  const angle = (i / agents.length) * 2 * Math.PI
                  const x = 250 + 150 * Math.cos(angle)
                  const y = 250 + 150 * Math.sin(angle)
                  const left = `calc(${(x / 500) * 100}% - 80px)`
                  const top = `calc(${(y / 500) * 100}% - 70px)`
                  return (
                    <div
                      key={`popover-${agent.id}`}
                      className="absolute w-40 rounded-xl glass-morphism p-2 shadow-modern text-xs"
                      style={{ left, top }}
                      role="note"
                      aria-label={`${agent.name} role`}
                    >
                      <div className="font-semibold text-text-primary">{agent.name}</div>
                      <div className="text-text-muted">{agent.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Architecture Diagram (SVG) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">AgentOS Architecture (streaming)</h3>
            <div className="relative w-full overflow-x-auto">
              <svg viewBox="0 0 900 280" className="min-w-[800px] w-full h-auto">
                {/* Boxes */}
                <g id="ui">
                  <rect x="20" y="40" width="160" height="80" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="100" y="85" textAnchor="middle" className="fill-text-primary font-semibold">User Interfaces</text>
                  <text x="100" y="105" textAnchor="middle" className="fill-text-muted text-xs">Voice, Web, CLI</text>
                </g>
                <g id="gateway">
                  <rect x="210" y="40" width="160" height="80" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="290" y="80" textAnchor="middle" className="fill-text-primary font-semibold">API Gateway</text>
                  <text x="290" y="100" textAnchor="middle" className="fill-text-muted text-xs">Auth, Rate‑limit</text>
                </g>
                <g id="orchestrator">
                  <rect x="390" y="30" width="190" height="100" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="485" y="70" textAnchor="middle" className="fill-text-primary font-semibold">GMI Orchestrator</text>
                  <text x="485" y="92" textAnchor="middle" className="fill-text-muted text-xs">Routing, Tooling, Guardrails</text>
                </g>
                <g id="agents">
                  <rect x="600" y="10" width="270" height="140" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="735" y="35" textAnchor="middle" className="fill-text-primary font-semibold">Agent Pool</text>
                  <text x="735" y="55" textAnchor="middle" className="fill-text-muted text-xs">Researcher • Analyst • Creator • Critic • Executor</text>
                </g>
                <g id="memory">
                  <rect x="390" y="160" width="200" height="90" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="490" y="198" textAnchor="middle" className="fill-text-primary font-semibold">Memory System</text>
                  <text x="490" y="220" textAnchor="middle" className="fill-text-muted text-xs">Vector DB • Knowledge Graph</text>
                </g>
                <g id="events">
                  <rect x="610" y="170" width="180" height="80" rx="16" fill="var(--color-background-primary)" stroke="var(--color-border-primary)" />
                  <text x="700" y="206" textAnchor="middle" className="fill-text-primary font-semibold">Event Stream</text>
                  <text x="700" y="228" textAnchor="middle" className="fill-text-muted text-xs">Monitoring • Analytics</text>
                </g>

                {/* Flows */}
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-primary)" />
                  </marker>
                </defs>
                <g stroke="url(#flow-gradient)" strokeWidth="2" fill="none" markerEnd="url(#arrow)">
                  <path d="M180,80 C195,80 205,80 210,80" />
                  <path d="M370,80 C380,80 385,80 390,80" />
                  <path d="M580,70 C590,70 595,70 600,70" />
                  <path d="M485,130 C485,145 490,150 490,160" />
                  <path d="M590,205 C600,205 606,205 610,205" />
                  <path d="M780,150 C790,155 795,160 790,170" />
                </g>

                {/* Streaming sparkle dots along flows */}
                {[
                  { x: [180, 210], y: [80, 80], delay: 0 },
                  { x: [370, 390], y: [80, 80], delay: 0.4 },
                  { x: [580, 600], y: [70, 70], delay: 0.8 },
                  { x: [485, 490], y: [130, 160], delay: 1.2 },
                  { x: [590, 610], y: [205, 205], delay: 1.6 },
                  { x: [780, 790], y: [150, 170], delay: 2.0 },
                ].map((seg, i) => (
                  <motion.circle
                    key={`spark-${i}`}
                    r="3"
                    fill="var(--color-accent-primary)"
                    initial={{ cx: seg.x[0], cy: seg.y[0] }}
                    animate={{ cx: seg.x[1], cy: seg.y[1] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: seg.delay }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Adaptive Intelligence', description: 'Agents that learn and evolve from interactions, improving performance over time.', gradient: 'from-purple-500 to-pink-500' },
            { title: 'Distributed Cognition', description: 'Multiple agents working in parallel, sharing insights and coordinating actions.', gradient: 'from-blue-500 to-cyan-500' },
            { title: 'Persistent Memory', description: 'Long-term memory storage with semantic search and context retrieval.', gradient: 'from-green-500 to-emerald-500' },
            { title: 'Safety Guardrails', description: 'Built-in protection against harmful outputs with customizable safety policies.', gradient: 'from-orange-500 to-red-500' },
            { title: 'Real-time Streaming', description: 'Stream responses as they generate for instant user feedback.', gradient: 'from-yellow-500 to-orange-500' },
            { title: 'Scalable Infrastructure', description: 'Deploy anywhere from edge devices to cloud-scale distributed systems.', gradient: 'from-indigo-500 to-purple-500' }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="h-full p-6 rounded-2xl glass-morphism hover:shadow-modern transition-all">
                {/* Silhouette blob instead of icon */}
                <div className={`relative mb-4 h-12 w-12 rounded-xl overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
                  <svg viewBox="0 0 100 100" className="relative h-full w-full">
                    <path d="M50 10c18 0 36 14 36 32s-11 26-24 32-28 8-36-2-12-24-6-36 12-26 30-26z" fill="rgba(255,255,255,0.18)"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://docs.agentos.sh/concepts/gmi"
            className="btn-primary inline-flex items-center gap-2"
          >
            <GitBranch className="w-5 h-5" />
            Explore GMI Documentation
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}