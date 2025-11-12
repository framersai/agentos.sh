'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Network, Database, Shield, Zap, GitBranch, Cpu, Activity, Cloud, Code, ArrowRight } from 'lucide-react'
import { MermaidDiagram } from '../ui/mermaid-diagram'

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
    <section id="gmis" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme" aria-labelledby="gmi-heading">
      {/* Subtle organic gradient */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-6">
            <Brain className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-semibold text-text-secondary">GMI Architecture</span>
          </div>

          <h2 id="gmi-heading" className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Generalised Mind Instances</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Build sophisticated AI systems with adaptive personas, emergent behaviors, and true multi-agent collaboration.
            GMIs enable autonomous agents that learn, adapt, and evolve.
          </p>
        </motion.div>

        {/* Interactive Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">
              Interactive System Architecture
            </h3>

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

        {/* Interactive Agent Network Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">
              Multi-Agent Collaboration Network
            </h3>

            <div className="relative aspect-square max-w-2xl mx-auto">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <defs>
                  <radialGradient id="agent-gradient">
                    <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.1" />
                  </radialGradient>
                </defs>

                {/* Central hub */}
                <motion.circle
                  cx="250"
                  cy="250"
                  r="60"
                  fill="url(#agent-gradient)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <text x="250" y="250" textAnchor="middle" className="fill-text-primary font-bold text-sm" dy="5">
                  Agency Core
                </text>

                {/* Agent nodes */}
                {agents.map((agent, i) => {
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
                        stroke="var(--color-accent-primary)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        opacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />

                      {/* Agent node */}
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
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
                          duration: 3,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Agent details */}
              <AnimatePresence>
                {selectedAgent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-4 left-4 p-4 rounded-xl glass-morphism max-w-xs"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const agent = agents.find(a => a.id === selectedAgent)
                        const Icon = agent?.icon || Brain
                        return (
                          <>
                            <Icon className="w-5 h-5 text-accent-primary" />
                            <h4 className="font-bold text-text-primary">{agent?.name}</h4>
                          </>
                        )
                      })()}
                    </div>
                    <p className="text-sm text-text-secondary">
                      {agents.find(a => a.id === selectedAgent)?.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Mermaid Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl font-bold text-center mb-8 text-text-primary">
              GMI Workflow Architecture
            </h3>
            <div className="bg-background-primary rounded-2xl p-6 overflow-x-auto">
              <MermaidDiagram 
                diagram={`graph TB
    subgraph "User Interface"
        A[Voice Chat] --> B[API Gateway]
        C[Web App] --> B
        D[CLI] --> B
    end

    subgraph "AgentOS Core"
        B --> E[Request Router]
        E --> F[GMI Orchestrator]

        F --> G[Agent Pool]
        G --> H[Researcher GMI]
        G --> I[Analyst GMI]
        G --> J[Creator GMI]
        G --> K[Executor GMI]

        H --> L[Memory System]
        I --> L
        J --> L
        K --> L

        L --> M[Vector DB]
        L --> N[Knowledge Graph]
    end

    subgraph "Infrastructure"
        F --> O[Event Stream]
        O --> P[Monitoring]
        O --> Q[Analytics]
        M --> R[Persistent Storage]
        N --> R
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#bbf,stroke:#333,stroke-width:4px
    style L fill:#bfb,stroke:#333,stroke-width:2px`}
              />
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: 'Adaptive Intelligence',
              description: 'Agents that learn and evolve from interactions, improving performance over time.',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: Network,
              title: 'Distributed Cognition',
              description: 'Multiple agents working in parallel, sharing insights and coordinating actions.',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Database,
              title: 'Persistent Memory',
              description: 'Long-term memory storage with semantic search and context retrieval.',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: Shield,
              title: 'Safety Guardrails',
              description: 'Built-in protection against harmful outputs with customizable safety policies.',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: Zap,
              title: 'Real-time Streaming',
              description: 'Stream responses as they generate for instant user feedback.',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Cloud,
              title: 'Scalable Infrastructure',
              description: 'Deploy anywhere from edge devices to cloud-scale distributed systems.',
              gradient: 'from-indigo-500 to-purple-500'
            }
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
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
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