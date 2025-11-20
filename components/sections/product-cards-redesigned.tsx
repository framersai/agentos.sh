'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Brain,
  Layers,
  Database,
  Zap,
  Code,
  Cpu,
  Server,
  Globe
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
  techStack: Array<{ name: string, icon?: React.ElementType }>
}

// Build card definitions with translated strings so we can easily swap locale
function getProductCards(t: ReturnType<typeof useTranslations>): ProductCard[] {
  return [
    {
      id: 'adaptive-intelligence',
      title: t('cards.adaptive.title'),
      description: t('cards.adaptive.description'),
      icon: Brain,
      stats: [
        { label: 'Context Window', value: '128k', trend: 0 },
        { label: 'Inference Latency', value: '< 40ms' },
        { label: 'Active Personas', value: 14, live: true }
      ],
      features: ['Real-time learning', 'Context retention', 'Behavioral adaptation'],
      bgAnimation: 'neural',
      accentColor: '#FF00FF',
      techStack: [
        { name: 'PyTorch', icon: Cpu },
        { name: 'TensorFlow', icon: Brain },
        { name: 'CUDA', icon: Zap }
      ]
    },
    {
      id: 'distributed-cognition',
      title: t('cards.distributed.title'),
      description: t('cards.distributed.description'),
      icon: Layers,
      stats: [
        { label: 'Parallel Tasks', value: 512, live: true },
        { label: 'Task Throughput', value: '50k/s', trend: 18 },
        { label: 'Orchestration Overhead', value: '< 2ms' }
      ],
      features: ['Load balancing', 'Auto-scaling', 'Fault tolerance'],
      bgAnimation: 'flow',
      accentColor: '#00FFFF',
      techStack: [
        { name: 'Kubernetes', icon: Server },
        { name: 'RabbitMQ', icon: Layers },
        { name: 'Redis', icon: Database }
      ]
    },
    {
      id: 'persistent-memory',
      title: t('cards.memory.title'),
      description: t('cards.memory.description'),
      icon: Database,
      stats: [
        { label: 'Vector Capacity', value: '1B+', trend: 0 },
        { label: 'Retrieval Speed', value: '< 5ms' },
        { label: 'Compression Ratio', value: '100:1' }
      ],
      features: ['Vector embeddings', 'Semantic search', 'Version control'],
      bgAnimation: 'grid',
      accentColor: '#FFFF00',
      techStack: [
        { name: 'Pinecone', icon: Database },
        { name: 'Postgres', icon: Database },
        { name: 'LangChain', icon: Code }
      ]
    },
    {
      id: 'real-time-streaming',
      title: t('cards.streaming.title'),
      description: t('cards.streaming.description'),
      icon: Zap,
      stats: [
        { label: 'End-to-End Latency', value: '< 100ms', trend: -8 },
        { label: 'Stream Bandwidth', value: '10 Gbps' },
        { label: 'Connection Stability', value: '99.99%', live: true }
      ],
      features: ['WebSocket support', 'Event-driven', 'Buffering'],
      bgAnimation: 'pulse',
      accentColor: '#00FF00',
      techStack: [
        { name: 'WebSocket', icon: Globe },
        { name: 'gRPC', icon: Zap },
        { name: 'Node.js', icon: Server }
      ]
    }
  ]
}

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
  const t = useTranslations('productCards')
  const [liveData, setLiveData] = useState<Record<string, string | number>>({})

  const productCards = useMemo(() => getProductCards(t), [t])

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
    <section className="py-20 px-4 sm:px-6 lg:px-8 perspective-1000">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards.map((card, index) => (
            <div key={card.id} className="relative group h-[420px] cursor-pointer perspective-1000">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180"
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                   <div className="holographic-card h-full p-6 flex flex-col border-2 border-white/10 group-hover:border-accent-primary/50 transition-colors shadow-xl">
                    {/* Background Animation */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-40">
                      <AnimatedSVGBackground type={card.bgAnimation} color={card.accentColor} />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md"
                          style={{
                            background: `linear-gradient(135deg, ${card.accentColor}20, ${card.accentColor}10)`,
                            boxShadow: `0 4px 20px ${card.accentColor}20`,
                            border: `1px solid ${card.accentColor}40`
                          }}
                        >
                          <card.icon className="w-7 h-7" style={{ color: card.accentColor }} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{card.title}</h3>
                      <p className="text-sm text-muted mb-6 leading-relaxed">{card.description}</p>

                      {/* Stats */}
                      <div className="space-y-3 mt-auto">
                        {card.stats.map((stat, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-muted">{stat.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold tracking-tight">
                                {stat.live && liveData[stat.label.toLowerCase().replace(' ', '-')]
                                  ? liveData[stat.label.toLowerCase().replace(' ', '-')]
                                  : stat.value}
                              </span>
                              {stat.trend && (
                                <span className={`text-xs font-semibold ${stat.trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                                </span>
                              )}
                              {stat.live && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Tech Stack) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden"
                >
                  <div className="holographic-card h-full p-8 flex flex-col items-center justify-center text-center border-2 border-accent-primary/30 bg-black/80 backdrop-blur-xl">
                    <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center" />
                    
                    <h4 className="text-lg font-bold mb-6 relative z-10">Powered By</h4>
                    
                    <div className="grid grid-cols-1 gap-4 w-full relative z-10">
                      {card.techStack.map((tech, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          {tech.icon && <tech.icon className="w-5 h-5 text-accent-primary" />}
                          <span className="font-mono text-sm font-semibold">{tech.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 relative z-10">
                      <div className="text-xs text-muted uppercase tracking-wider mb-2">Capabilities</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {card.features.map((feature, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-1 rounded-full font-medium"
                            style={{
                              background: `${card.accentColor}15`,
                              border: `1px solid ${card.accentColor}30`,
                              color: card.accentColor
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
