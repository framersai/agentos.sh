'use client'

import { motion } from 'framer-motion'
import { Brain, Layers, Network, Database, Shield, Zap, GitBranch } from 'lucide-react'

export function GMISection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative overflow-hidden">
      {/* Minimal gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-secondary/50 to-background-primary/50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Adaptive Emergent Intelligence
            </span>
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            AgentOS implements Generalised Mind Instances (GMI) with specialized roles and agencies,
            enabling true adaptive intelligence through emergent behaviors and collaborative agent systems.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-background-glass backdrop-blur-md rounded-3xl p-8 border border-border-subtle shadow-neumorphic">
            {/* Improved GMI Architecture Diagram */}
            <svg viewBox="0 0 800 500" className="w-full h-auto">
              <defs>
                <linearGradient id="gmi-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="gmi-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.6" />
                </linearGradient>
                <filter id="gmi-glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Core Layers */}
              <g transform="translate(400, 250)">
                {/* GMI Core Layer */}
                <rect x="-100" y="-150" width="200" height="80" fill="url(#gmi-gradient-1)" opacity="0.1" rx="10" />
                <text x="0" y="-100" textAnchor="middle" className="fill-text-primary font-bold text-sm">
                  GMI Core Layer
                </text>

                {/* Working Memory */}
                <rect x="-80" y="-50" width="60" height="40" fill="var(--color-background-glass)" stroke="var(--color-accent-primary)" strokeWidth="1.5" rx="5" />
                <text x="-50" y="-25" textAnchor="middle" className="fill-text-secondary text-xs">
                  Working
                </text>
                <text x="-50" y="-10" textAnchor="middle" className="fill-text-secondary text-xs">
                  Memory
                </text>

                {/* Context Manager */}
                <rect x="-10" y="-50" width="60" height="40" fill="var(--color-background-glass)" stroke="var(--color-accent-primary)" strokeWidth="1.5" rx="5" />
                <text x="20" y="-25" textAnchor="middle" className="fill-text-secondary text-xs">
                  Context
                </text>
                <text x="20" y="-10" textAnchor="middle" className="fill-text-secondary text-xs">
                  Manager
                </text>

                {/* Agency Core */}
                <circle r="50" fill="url(#gmi-gradient-2)" opacity="0.15" />
                <circle r="45" fill="none" stroke="url(#gmi-gradient-1)" strokeWidth="2" />
                <text y="5" textAnchor="middle" className="fill-text-primary font-semibold text-sm">
                  Multi-Agent
                </text>
                <text y="20" textAnchor="middle" className="fill-text-primary font-semibold text-sm">
                  Coordinator
                </text>
              </g>

              {/* GMI Agent Instances */}
              {[
                { x: 150, y: 100, label: 'Researcher', role: 'Discovery', color: '#3B82F6' },
                { x: 650, y: 100, label: 'Analyst', role: 'Processing', color: '#8B5CF6' },
                { x: 150, y: 400, label: 'Creator', role: 'Generation', color: '#EC4899' },
                { x: 650, y: 400, label: 'Executor', role: 'Action', color: '#10B981' },
                { x: 400, y: 50, label: 'Orchestrator', role: 'Coordination', color: '#F59E0B' },
              ].map((gmi, i) => (
                <g key={i} transform={`translate(${gmi.x}, ${gmi.y})`}>
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    <rect
                      x="-45"
                      y="-30"
                      width="90"
                      height="60"
                      fill="var(--color-background-glass)"
                      stroke={gmi.color}
                      strokeWidth="2"
                      rx="8"
                      opacity="0.9"
                    />
                    <text y="-5" textAnchor="middle" className="fill-text-primary font-semibold text-xs">
                      {gmi.label}
                    </text>
                    <text y="10" textAnchor="middle" className="fill-text-muted text-xs">
                      {gmi.role}
                    </text>
                  </motion.g>

                  {/* Connection lines to center */}
                  <motion.line
                    x1="0"
                    y1="0"
                    x2={400 - gmi.x}
                    y2={250 - gmi.y}
                    stroke={gmi.color}
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                    opacity="0"
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: i * 0.15 + 0.5, duration: 0.5 }}
                  />
                </g>
              ))}

              {/* Data Flow Animation */}
              <motion.circle
                r="4"
                fill="var(--color-accent-primary)"
                filter="url(#gmi-glow)"
                animate={{
                  x: [150, 400, 650, 400, 150],
                  y: [100, 250, 100, 50, 100]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Labels */}
              <text x="400" y="480" textAnchor="middle" className="fill-text-muted text-xs">
                Adaptive Multi-Agent Intelligence with Emergent Behaviors
              </text>
            </svg>
          </div>
        </motion.div>

        {/* GMI Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: 'Cognitive Agents',
              description: 'Autonomous reasoning with persistent memory, context awareness, and adaptive learning capabilities.',
              features: ['Long-term memory', 'Context switching', 'Self-improvement']
            },
            {
              icon: Network,
              title: 'Multi-Agent Orchestration',
              description: 'Coordinate multiple specialized agents working together on complex tasks.',
              features: ['Task delegation', 'Parallel processing', 'Consensus building']
            },
            {
              icon: Layers,
              title: 'Role-Based Architecture',
              description: 'Define specialized roles with specific capabilities, constraints, and behaviors.',
              features: ['Custom roles', 'Permission systems', 'Resource limits']
            },
            {
              icon: Database,
              title: 'Shared Knowledge Base',
              description: 'Distributed memory system allowing agents to share insights and learnings.',
              features: ['Vector storage', 'Semantic search', 'Knowledge graphs']
            },
            {
              icon: Shield,
              title: 'Safety Guardrails',
              description: 'Built-in safety measures ensuring responsible and controlled agent behavior.',
              features: ['Content filtering', 'Rate limiting', 'Audit logging']
            },
            {
              icon: Zap,
              title: 'Real-time Adaptation',
              description: 'Agents that evolve and improve their responses based on interaction patterns.',
              features: ['Online learning', 'Performance metrics', 'A/B testing']
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-background-glass backdrop-blur-md rounded-2xl p-6 border border-border-subtle hover:border-accent-primary transition-all duration-300 group hover:shadow-neumorphic-hover"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 group-hover:from-accent-primary/20 group-hover:to-accent-secondary/20 transition-all">
                  <feature.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted mb-3">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.features.map((item) => (
                      <li key={item} className="text-xs text-text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agency Implementation Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 rounded-3xl p-8 border border-accent-primary/20"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">
                Agency-Driven Intelligence
              </h3>
              <p className="text-text-secondary mb-6">
                AgentOS enables the creation of sophisticated AI agencies where multiple GMI instances
                collaborate, share knowledge, and evolve together. Each agent maintains its own context
                while contributing to collective intelligence.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Define Agent Roles</h4>
                    <p className="text-xs text-text-muted">Create specialized agents with unique capabilities</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-500">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Establish Workflows</h4>
                    <p className="text-xs text-text-muted">Design interaction patterns and data flows</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Enable Emergence</h4>
                    <p className="text-xs text-text-muted">Let agents evolve and optimize autonomously</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-background-primary rounded-2xl p-6 border border-border-subtle shadow-neumorphic">
                <pre className="text-xs overflow-x-auto">
                  <code className="language-typescript">{`// Create an intelligent agency
const researchAgency = new Agency({
  name: 'ResearchTeam',
  agents: [
    { role: 'DataCollector', model: 'fast' },
    { role: 'Analyst', model: 'reasoning' },
    { role: 'Writer', model: 'creative' }
  ],
  workflow: 'collaborative',
  sharedMemory: true,
  emergentBehavior: 'enabled'
})

// Execute complex research task
const result = await researchAgency.execute({
  task: 'Analyze market trends',
  depth: 'comprehensive'
})`}</code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="https://docs.agentos.sh/concepts/gmi"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <GitBranch className="w-5 h-5" />
            Learn More About GMI Architecture
          </a>
        </motion.div>
      </div>
    </section>
  )
}