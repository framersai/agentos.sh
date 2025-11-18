'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Key,
  UserCheck,
  FileCheck,
  ServerCog,
  Activity,
  AlertTriangle,
  CheckCircle,
  Building,
  Cpu,
  Database,
  Globe
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface BuildingFeature {
  id: string
  title: string
  height: number // 1-10 scale
  position: number // 0-100 percentage
  icon: React.ElementType
  features: string[]
  status: 'foundation' | 'building' | 'complete'
  glow: string
}

const enterpriseFeatures: BuildingFeature[] = [
  {
    id: 'security',
    title: 'Security Foundation',
    height: 3,
    position: 10,
    icon: Shield,
    features: ['AES-256 Encryption', 'Zero-Trust Architecture', 'End-to-End Security'],
    status: 'complete',
    glow: '#00FF00'
  },
  {
    id: 'compliance',
    title: 'Compliance & Privacy',
    height: 5,
    position: 25,
    icon: FileCheck,
    features: ['GDPR Compliant', 'PII Redaction', 'Data Residency Controls'],
    status: 'complete',
    glow: '#00FFFF'
  },
  {
    id: 'auth',
    title: 'Authentication',
    height: 4,
    position: 40,
    icon: Key,
    features: ['SSO/SAML 2.0', 'OAuth 2.0', 'MFA Support'],
    status: 'complete',
    glow: '#FF00FF'
  },
  {
    id: 'audit',
    title: 'Audit & Monitoring',
    height: 6,
    position: 55,
    icon: Activity,
    features: ['Real-time Monitoring', 'Audit Logs', 'Anomaly Detection'],
    status: 'complete',
    glow: '#FFFF00'
  },
  {
    id: 'soc2',
    title: 'SOC2 Compliance',
    height: 7,
    position: 70,
    icon: UserCheck,
    features: ['Type II (In Progress)', 'Annual Audits', 'Continuous Compliance'],
    status: 'building',
    glow: '#FF8800'
  },
  {
    id: 'scale',
    title: 'Enterprise Scale',
    height: 9,
    position: 85,
    icon: ServerCog,
    features: ['Auto-scaling', '99.99% SLA', 'Global CDN'],
    status: 'complete',
    glow: '#8800FF'
  }
]

export function EnterpriseSkyline() {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null)
  const [animatedWindows, setAnimatedWindows] = useState<Record<string, boolean[]>>({})
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Animate building windows
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedWindows(prev => {
        const next = { ...prev }
        enterpriseFeatures.forEach(feature => {
          if (!next[feature.id]) {
            next[feature.id] = Array(feature.height * 3).fill(false).map(() => Math.random() > 0.3)
          } else {
            // Randomly toggle some windows
            next[feature.id] = next[feature.id].map(state =>
              Math.random() > 0.95 ? !state : state
            )
          }
        })
        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #000033 0%, #000066 50%, #000099 100%)'
              : 'linear-gradient(to bottom, #E6F3FF 0%, #CCE7FF 50%, #99CFFF 100%)'
          }}
        />
        {/* Stars/Particles in background */}
        {isDark && (
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 'px',
                  height: Math.random() * 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 50 + '%',
                  opacity: Math.random() * 0.8,
                  animation: `twinkle ${3 + Math.random() * 4}s infinite`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Enterprise Ready Features
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Building blocks of enterprise-grade infrastructure, each layer adding security and scale
          </p>
        </motion.div>

        {/* Skyline Visualization */}
        <div className="relative h-[500px] mb-12">
          {/* Ground/Base */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />

          {/* Buildings */}
          {enterpriseFeatures.map((feature, index) => {
            const buildingHeight = (feature.height / 10) * 400 // Max 400px height
            const buildingWidth = 120
            const leftPosition = `${feature.position}%`

            return (
              <motion.div
                key={feature.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: buildingHeight,
                  opacity: 1
                }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="absolute bottom-0"
                style={{
                  left: leftPosition,
                  width: buildingWidth,
                  transform: 'translateX(-50%)'
                }}
                onMouseEnter={() => setHoveredBuilding(feature.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
              >
                {/* Building Structure */}
                <div
                  className="relative w-full h-full cursor-pointer group"
                  style={{
                    background: isDark
                      ? `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7))`
                      : `linear-gradient(to top, rgba(100,100,150,0.9), rgba(150,150,200,0.7))`,
                    boxShadow: hoveredBuilding === feature.id
                      ? `0 0 40px ${feature.glow}, inset 0 0 20px ${feature.glow}40`
                      : `0 0 20px rgba(0,0,0,0.3)`,
                    border: `1px solid ${feature.glow}40`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Windows Grid */}
                  <div className="absolute inset-2 grid grid-cols-3 gap-1">
                    {animatedWindows[feature.id]?.map((lit, i) => (
                      <div
                        key={i}
                        className="bg-yellow-300/20"
                        style={{
                          background: lit
                            ? `radial-gradient(circle, ${feature.glow}60, transparent)`
                            : 'rgba(0,0,0,0.3)',
                          boxShadow: lit ? `0 0 10px ${feature.glow}40` : 'none',
                          transition: 'all 0.5s ease'
                        }}
                      />
                    ))}
                  </div>

                  {/* Building Label */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <feature.icon
                      className="w-6 h-6 mx-auto mb-1"
                      style={{ color: feature.glow }}
                    />
                  </div>

                  {/* Status Indicator */}
                  {feature.status === 'building' && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-500">WIP</span>
                      </div>
                    </div>
                  )}

                  {/* Antenna/Spire for tallest buildings */}
                  {feature.height >= 7 && (
                    <div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1"
                      style={{
                        height: '32px',
                        background: `linear-gradient(to top, ${feature.glow}60, transparent)`
                      }}
                    >
                      <div
                        className="absolute -top-1 -left-1 w-3 h-3 rounded-full animate-pulse"
                        style={{
                          background: feature.glow,
                          boxShadow: `0 0 10px ${feature.glow}`
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Hover Details */}
                <AnimatePresence>
                  {hoveredBuilding === feature.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 z-20"
                      style={{ minWidth: '200px' }}
                    >
                      <div className="holographic-card p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <feature.icon className="w-4 h-4" style={{ color: feature.glow }} />
                          {feature.title}
                        </h4>
                        <ul className="space-y-1">
                          {feature.features.map((item, i) => (
                            <li key={i} className="text-xs flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {feature.status === 'building' && (
                          <div className="mt-2 pt-2 border-t border-glass-border">
                            <p className="text-xs text-orange-500">
                              🚧 Currently in development
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Reflection Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom, rgba(0,0,50,0.3), transparent)'
                  : 'linear-gradient(to bottom, rgba(150,200,255,0.2), transparent)',
                transform: 'scaleY(-1)',
                transformOrigin: 'bottom',
                opacity: 0.3
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="holographic-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-8 h-8 text-green-500" />
              <h3 className="font-semibold">Fully Implemented</h3>
            </div>
            <p className="text-sm text-muted">
              GDPR compliance, PII redaction, and core security features are production-ready
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="holographic-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-8 h-8 text-orange-500" />
              <h3 className="font-semibold">In Progress</h3>
            </div>
            <p className="text-sm text-muted">
              SOC2 Type II certification underway, expected completion Q2 2024
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9 }}
            className="holographic-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-8 h-8 text-blue-500" />
              <h3 className="font-semibold">Enterprise Support</h3>
            </div>
            <p className="text-sm text-muted">
              24/7 support with vca.chat integration and dedicated success managers
            </p>
          </motion.div>
        </div>

        {/* Trust Badges Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted mb-4">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-32 h-12 rounded-lg bg-glass-surface flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, var(--glass-surface), transparent)`,
                  border: '1px solid var(--glass-border)'
                }}
              >
                <Building className="w-6 h-6 opacity-30" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  )
}