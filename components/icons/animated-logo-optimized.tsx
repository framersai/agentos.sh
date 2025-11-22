'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, memo } from 'react'

const orbitLayers = [
  { rx: 30, ry: 20, duration: 16, tilt: 0, electronColor: '#7C3AED' },
  { rx: 36, ry: 24, duration: 18, tilt: 26, electronColor: '#EC4899' },
  { rx: 24, ry: 16, duration: 12, tilt: -26, electronColor: '#22D3EE' }
]

export const AnimatedAgentOSLogoOptimized = memo(function AnimatedAgentOSLogoOptimized({
  size = 160,
  className = ""
}: {
  size?: number
  className?: string
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  if (!isClient) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="agentos-core" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#B0A8FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B1F8D" stopOpacity="0.4" />
          </radialGradient>
          <linearGradient id="agentos-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <filter id="agentos-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* soft backdrop */}
        <circle cx="50" cy="50" r="40" fill="url(#agentos-core)" opacity="0.35" />

        {/* central nucleus */}
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#agentos-core)"
          filter="url(#agentos-glow)"
          animate={{ r: [11, 13, 11], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* stylized A glyph */}
        <motion.path
          d="M50 34 L63 66 H57 L53.5 58 H46.5 L43 66 H37 L50 34 Z M52 52 L50 46 L48 52 Z"
          fill="none"
          stroke="url(#agentos-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#agentos-glow)"
          animate={{ pathLength: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* electron orbits */}
        {orbitLayers.map((orbit, index) => (
          <motion.g
            key={`orbit-${index}`}
            animate={{ rotate: 360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <g transform={`rotate(${orbit.tilt} 50 50)`}>
              <ellipse
                cx="50"
                cy="50"
                rx={orbit.rx}
                ry={orbit.ry}
                fill="none"
                stroke="url(#agentos-stroke)"
                strokeWidth="0.8"
                opacity="0.5"
                strokeDasharray="4 6"
              />

              <motion.circle
                cx="50"
                cy={50 - orbit.ry}
                r="2.5"
                fill={orbit.electronColor}
                filter="url(#agentos-glow)"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
              />
            </g>
          </motion.g>
        ))}

        {/* spark bursts */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.circle
            key={`spark-${i}`}
            cx="50"
            cy="50"
            r="1"
            fill="url(#agentos-stroke)"
            animate={{
              r: [1, 14, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </svg>
    </motion.div>
  )
})