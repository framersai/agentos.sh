'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Layers,
  Database,
  Zap
} from 'lucide-react'

interface ProductCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  stats: Array<{
    label: string
    value: string | number
    trend?: number
    live?: boolean
  }>
  features: string[]
  bgAnimation: 'neural' | 'flow' | 'pulse' | 'grid'
  accentColor: string
}

const productCards: ProductCard[] = [
  {
    id: 'adaptive-intelligence',
    title: 'Adaptive Intelligence',
    description: 'Self-evolving agent systems that learn from interactions',
    icon: Brain,
    stats: [
      { label: 'Response Time', value: '< 100ms', trend: -15 },
      { label: 'Accuracy', value: '99.2%', trend: 2.3 },
      { label: 'Active Models', value: 14, live: true }
    ],
    features: ['Real-time learning', 'Context retention', 'Behavioral adaptation'],
    bgAnimation: 'neural',
    accentColor: '#FF00FF'
  },
  {
    id: 'distributed-cognition',
    title: 'Distributed Cognition',
    description: 'Parallel processing across multiple specialized agents',
    icon: Layers,
    stats: [
      { label: 'Concurrent Tasks', value: 128, live: true },
      { label: 'Throughput', value: '10k/sec', trend: 18 },
      { label: 'Efficiency', value: '94%' }
    ],
    features: ['Load balancing', 'Auto-scaling', 'Fault tolerance'],
    bgAnimation: 'flow',
    accentColor: '#00FFFF'
  },
  {
    id: 'persistent-memory',
    title: 'Persistent Memory',
    description: 'Long-term knowledge retention and instant recall',
    icon: Database,
    stats: [
      { label: 'Storage', value: '∞ TB', trend: 0 },
      { label: 'Recall Speed', value: '< 5ms' },
      { label: 'Retention', value: '100%' }
    ],
    features: ['Vector embeddings', 'Semantic search', 'Version control'],
    bgAnimation: 'grid',
    accentColor: '#FFFF00'
  },
  {
    id: 'real-time-streaming',
    title: 'Real-time Streaming',
    description: 'Token-level streaming with sub-second latency',
    icon: Zap,
    stats: [
      { label: 'Latency', value: '< 50ms', trend: -8 },
      { label: 'Bandwidth', value: '1 Gbps' },
      { label: 'Uptime', value: '99.99%', live: true }
    ],
    features: ['WebSocket support', 'Event-driven', 'Buffering'],
    bgAnimation: 'pulse',
    accentColor: '#00FF00'
  }
]

function AnimatedSVGBackground({ type, color }: { type: string; color: string }) {
  if (type === 'neural') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Neural network nodes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <circle
              cx={50 + (i % 4) * 100}
              cy={50 + Math.floor(i / 4) * 100}
              r="8"
              fill={color}
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="8;12;8"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Connections */}
            {i < 7 && (
              <line
                x1={50 + (i % 4) * 100}
                y1={50 + Math.floor(i / 4) * 100}
                x2={50 + ((i + 1) % 4) * 100}
                y2={50 + Math.floor((i + 1) / 4) * 100}
                stroke={color}
                strokeWidth="1"
                opacity="0.3"
              >
                <animate
                  attributeName="stroke-width"
                  values="1;2;1"
                  dur={`${3 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </line>
            )}
          </g>
        ))}
      </svg>
    )
  } else if (type === 'flow') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        {/* Flow lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M 0,${60 + i * 40} Q 100,${40 + i * 40} 200,${60 + i * 40} T 400,${60 + i * 40}`}
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </svg>
    )
  } else if (type === 'pulse') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
        {/* Pulse circles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={i}
            cx="200"
            cy="150"
            r="50"
            stroke={color}
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="r"
              values="50;120;50"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              begin={`${i}s`}
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              begin={`${i}s`}
            />
          </circle>
        ))}
      </svg>
    )
  } else {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
        <defs>
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
            <circle cx="0" cy="0" r="2" fill={color} opacity="0.5">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="0" r="2" fill={color} opacity="0.5">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="0" cy="40" r="2" fill={color} opacity="0.5">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="40" cy="40" r="2" fill={color} opacity="0.5">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1.5s" />
            </circle>
          </pattern>
        </defs>
        <rect x="0" y="0" width="400" height="300" fill="url(#grid)" />
      </svg>
    )
  }
}

export function ProductCardsRedesigned() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [liveData, setLiveData] = useState<Record<string, string | number>>({})

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        'active-models': 12 + Math.floor(Math.random() * 5),
        'concurrent-tasks': 120 + Math.floor(Math.random() * 20),
        'uptime': '99.' + (95 + Math.floor(Math.random() * 4)) + '%'
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Core Capabilities
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Enterprise-grade AI orchestration with real-time performance metrics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className="holographic-card h-full p-6 flex flex-col">
                {/* Background Animation */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <AnimatedSVGBackground type={card.bgAnimation} color={card.accentColor} />
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${card.accentColor}20, ${card.accentColor}40)`,
                        boxShadow: `0 0 20px ${card.accentColor}30`
                      }}
                    >
                      <card.icon className="w-6 h-6" style={{ color: card.accentColor }} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted mb-4">{card.description}</p>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    {card.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-muted">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {stat.live && liveData[stat.label.toLowerCase().replace(' ', '-')]
                              ? liveData[stat.label.toLowerCase().replace(' ', '-')]
                              : stat.value}
                          </span>
                          {stat.trend && (
                            <span className={`text-xs ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                            </span>
                          )}
                          {stat.live && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mt-auto pt-4 border-t border-glass-border">
                    <div className="flex flex-wrap gap-2">
                      {card.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: `${card.accentColor}15`,
                            border: `1px solid ${card.accentColor}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <AnimatePresence>
                  {hoveredCard === card.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${card.accentColor}10, transparent)`,
                        boxShadow: `inset 0 0 30px ${card.accentColor}20`
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}