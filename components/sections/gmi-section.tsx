'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Network, GitBranch, Cpu, Activity, Code, ArrowRight } from 'lucide-react'

// (removed layered list data)

export function GMISection() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [detailPos, setDetailPos] = useState<{ x: number; y: number } | null>(null)
  const hoverTimerRef = useRef<number | undefined>(undefined)

  const agents = [
    { id: 'researcher', name: 'Researcher', icon: Brain, description: 'Discovers and analyzes information',
      examples: ['Web search and source ranking', 'Literature survey (PDFs, arXiv)', 'Fact extraction to memory'],
      tools: ['WebBrowser', 'PDFReader', 'Search API'], persona: 'curious, precise' },
    { id: 'analyst', name: 'Analyst', icon: Activity, description: 'Processes and interprets data',
      examples: ['Summarize and compare sources', 'Quant/qual trend analysis', 'Sanity checks and flags'],
      tools: ['DataFrame', 'Calculator', 'Validator'], persona: 'skeptical, methodical' },
    { id: 'creator', name: 'Creator', icon: Code, description: 'Generates content and solutions',
      examples: ['Drafts and revisions', 'Artifact generation (docs, code)', 'Style adaptation'],
      tools: ['Writer', 'Formatter', 'TemplateKit'], persona: 'clear, persuasive' },
    { id: 'executor', name: 'Executor', icon: Cpu, description: 'Takes actions and implements',
      examples: ['Call external APIs', 'Create issues/PRs', 'Schedule tasks'],
      tools: ['HTTP', 'GitHub', 'Scheduler'], persona: 'reliable, action-oriented' },
    { id: 'orchestrator', name: 'Orchestrator', icon: Network, description: 'Coordinates multi-agent tasks',
      examples: ['Route tasks to roles', 'Resolve conflicts', 'Approve/reject gates'],
      tools: ['Router', 'Guardrails', 'PolicyEngine'], persona: 'balanced, gatekeeper' }
  ]

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveNode(null)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const architectureNodes = [
    {
      id: 'ui',
      label: 'User Interfaces',
      subtitle: 'Voice • Web • CLI',
      x: 20, y: 40, w: 160, h: 80,
      details: 'Entrypoints where users speak, type, and automate tasks.',
      example: 'Capture a voice prompt for a real‑time, fact‑checked briefing.'
    },
    {
      id: 'gateway',
      label: 'API Gateway',
      subtitle: 'Auth • Rate‑limit',
      x: 210, y: 40, w: 160, h: 80,
      details: 'Front door for requests; applies auth, quotas, and routing.',
      example: 'Throttle bursty inputs; attach tenant identity to requests.'
    },
    {
      id: 'orchestrator',
      label: 'GMI Orchestrator',
      subtitle: 'Routing • Guardrails',
      x: 390, y: 30, w: 190, h: 100,
      details: 'Coordinates agent roles, tools, and safety policies.',
      example: 'Parallelize research, analysis, creation, and critique.'
    },
    {
      id: 'agents',
      label: 'Agent Pool',
      subtitle: 'Researcher • Analyst • Creator • Critic • Executor',
      x: 600, y: 10, w: 270, h: 140,
      details: 'Specialized GMIs stream outputs; orchestrator merges.',
      example: 'Researcher fetches sources while Analyst verifies claims.'
    },
    {
      id: 'memory',
      label: 'Memory System',
      subtitle: 'Vector DB • Knowledge Graph',
      x: 390, y: 160, w: 200, h: 90,
      details: 'Long‑term memory stores facts, embeddings, and relations.',
      example: 'Semantic search recalls prior decisions and context.'
    },
    {
      id: 'events',
      label: 'Event Stream',
      subtitle: 'Monitoring • Analytics',
      x: 610, y: 170, w: 180, h: 80,
      details: 'Observability and compliance pipeline for every step.',
      example: 'Emit spans for audits; alert on policy violations.'
    }
  ] as const

  function InteractiveArchitecture() {
    return (
      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 900 280" className="min-w-[800px] w-full h-auto">
          <defs>
            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" />
            </linearGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent-primary)" />
            </marker>
          </defs>

          {/* Ambient blobs */}
          <g opacity="0.25" filter="url(#soft-glow)">
            <circle cx="140" cy="30" r="80" fill="var(--color-accent-primary)" />
            <circle cx="760" cy="260" r="90" fill="var(--color-accent-secondary)" />
          </g>

          {/* Flows (bezier) */}
          <g stroke="url(#flow-gradient)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.9">
            <path d="M180,80 C195,80 205,80 210,80" />
            <path d="M370,80 C380,60 385,60 390,80" />
            <path d="M580,70 C590,40 595,40 600,70" />
            <path d="M485,130 C485,145 490,150 490,160" />
            <path d="M590,205 C600,205 606,205 610,205" />
            <path d="M780,150 C820,150 820,180 790,170" />
          </g>

          {/* Streaming dots */}
          {[
            { x: [180, 210], y: [80, 80], delay: 0 },
            { x: [370, 390], y: [70, 80], delay: 0.4 },
            { x: [580, 600], y: [65, 70], delay: 0.8 },
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
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: seg.delay }}
            />
          ))}

          {/* Nodes with interactive tooltips (click to open detail card) */}
          {architectureNodes.map((n) => (
            <g key={n.id}>
              {/* glow plate */}
              <rect x={n.x - 6} y={n.y - 6} width={n.w + 12} height={n.h + 12} rx="20"
                    fill="var(--color-accent-primary)" opacity="0.05" />
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx="16"
                fill="var(--color-background-primary)"
                stroke="var(--color-border-primary)"
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  // debounce hover reveal; center tooltip
                  if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current)
                  hoverTimerRef.current = window.setTimeout(() => {
                    setActiveNode(n.id)
                    const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement)
                    const svgRect = svg.getBoundingClientRect()
                    const rect = (e.currentTarget as Element).getBoundingClientRect()
                    const tooltipWidth = 240
                    const left = rect.left - svgRect.left + rect.width / 2 - tooltipWidth / 2
                    const top = rect.top - svgRect.top - 16
                    setTooltipPos({ x: Math.max(8, left), y: Math.max(8, top) })
                  }, 250)
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current)
                  setActiveNode((prev) => (prev === n.id ? null : prev))
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // map node to agent if possible, else orchestrator
                  const agentId =
                    n.id === 'ui' ? 'researcher' :
                    n.id === 'gateway' ? 'orchestrator' :
                    n.id === 'orchestrator' ? 'orchestrator' :
                    n.id === 'agents' ? 'creator' :
                    n.id === 'memory' ? 'analyst' :
                    n.id === 'events' ? 'executor' : 'orchestrator'
                  setSelectedAgent(agentId)
                  const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement)
                  const pt = svg.createSVGPoint()
                  pt.x = n.x + n.w + 20; pt.y = n.y + 20
                  const ctm = (e.currentTarget as SVGRectElement).getCTM()
                  if (ctm) {
                    const screen = pt.matrixTransform(ctm)
                    setDetailPos({ x: screen.x, y: screen.y })
                  } else {
                    setDetailPos({ x: n.x + n.w + 20, y: n.y + 20 })
                  }
                }}
                tabIndex={0}
                role="button"
                aria-describedby={`tt-${n.id}`}
              />
              <text x={n.x + n.w / 2} y={n.y + 40} textAnchor="middle" className="fill-text-primary font-semibold">
                {n.label}
              </text>
              <text x={n.x + n.w / 2} y={n.y + 60} textAnchor="middle" className="fill-text-muted text-xs">
                {n.subtitle}
              </text>
            </g>
          ))}
        </svg>

        {/* Portal-like tooltip (positioned absolute over SVG container) */}
        <AnimatePresence>
          {activeNode && (() => {
            const n = architectureNodes.find((x) => x.id === activeNode)!
            const pos = tooltipPos ?? { x: n.x + n.w + 8, y: n.y + 8 }
            return (
              <motion.div
                key={`tt-${n.id}`}
                id={`tt-${n.id}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="diagram-tooltip"
                style={{ left: pos.x, top: pos.y }}
                role="tooltip"
              >
                <div className="text-xs uppercase tracking-wide text-text-muted mb-1">{n.label}</div>
                <div className="text-sm text-text-primary font-semibold">{n.details}</div>
                <div className="text-xs text-text-secondary mt-2">
                  <span className="font-semibold text-accent-primary">Example:</span> {n.example}
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>
    )
  }
  return (
    <section id="gmis" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme section-gradient" aria-labelledby="gmi-heading">
      {/* Subtle organic gradient */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 id="gmi-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Parallel Agency</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Build sophisticated AI systems with adaptive personas and <span className="font-semibold text-accent-primary">emergent, dynamic behaviors</span>,
            coordinated through multi‑agent collaboration. <a href="/" className="font-semibold text-accent-primary hover:underline">AgentOS</a> GMIs
            enable autonomous agents that learn, adapt, and evolve.
          </p>
                    </div>

        {/* (Removed) layered architecture list; keeping custom SVG diagrams only */}

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
                ].map((agent, i) => {
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
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAgent(agent.id)
                          // place detail near node using DOM rects (relative to svg container)
                          const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement)
                          const svgRect = svg.getBoundingClientRect()
                          const nodeRect = (e.currentTarget as Element).getBoundingClientRect()
                          setDetailPos({
                            x: nodeRect.left - svgRect.left + 20,
                            y: nodeRect.top - svgRect.top + 20
                          })
                        }}
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

              {/* Click-to-reveal detail card */}
              <AnimatePresence>
                {selectedAgent && (() => {
                  const agent = agents.find((a) => a.id === selectedAgent)!
                  const cardStyle: React.CSSProperties = detailPos
                    ? { left: Math.max(16, Math.min(detailPos.x, 500 - 280)), top: Math.max(16, Math.min(detailPos.y, 500 - 220)) }
                    : { left: 24, top: 24 }
                  return (
                  <motion.div
                      key={`detail-${agent.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-30 w-72 surface-card p-4 border border-border-subtle rounded-2xl shadow-modern"
                      style={cardStyle}
                      role="dialog"
                      aria-label={`${agent.name} details`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-text-primary">{agent.name}</div>
                        <button
                          className="text-text-muted hover:text-accent-primary transition-colors"
                          onClick={() => setSelectedAgent(null)}
                          aria-label="Close details"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-xs text-text-secondary mb-2">{agent.description}</div>
                      <div className="mb-2">
                        <div className="text-xs font-semibold text-text-muted mb-1">Persona</div>
                        <div className="text-xs text-text-secondary">{agent.persona}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-xs font-semibold text-text-muted mb-1">Sample actions</div>
                        <ul className="list-disc pl-5 text-xs text-text-secondary space-y-1">
                          {agent.examples.map((ex) => <li key={ex}>{ex}</li>)}
                        </ul>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-text-muted mb-1">Extensions / Tools</div>
                        <div className="flex flex-wrap gap-1">
                          {agent.tools.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-lg bg-accent-primary/10 text-accent-primary text-[10px] font-semibold">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href="https://docs.agentos.sh/api"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border-subtle text-xs text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                        >
                          API
                        </a>
                        <a
                          href="https://playground.agentos.sh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary text-white text-xs hover:bg-accent-hover transition-colors"
                        >
                          Try
                        </a>
                      </div>
                    </motion.div>
                        )
                      })()}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Custom Architecture Diagram (SVG) with interactive tooltips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass-morphism rounded-3xl p-8 shadow-modern-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">AgentOS Architecture (streaming)</h3>
            <InteractiveArchitecture />
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
              <div className="h-full p-6 surface-card">
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