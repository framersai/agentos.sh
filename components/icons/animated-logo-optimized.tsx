'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, memo, useId } from 'react'

export const AnimatedAgentOSLogoOptimized = memo(function AnimatedAgentOSLogoOptimized({
  size = 160,
  className = ""
}: {
  size?: number
  className?: string
}) {
  const [isClient, setIsClient] = useState(false)
  const gradientId = useId().replace(/:/g, "-")

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
          <linearGradient id={`logo-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id={`logo-glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 
          Original Logo Geometry (AgentOSWordmark):
          Center: (30, 40)
          Bounds: ~10-50 X, ~25-58 Y
          
          We transform it to center in 100x100 viewbox:
          Translate origin to (50, 50)
          Scale up by 2.2
          Translate center (-30, -40) back
        */}
        <g transform="translate(50 50) scale(2.2) translate(-30 -40)">
          {/* Connections */}
          <motion.g
             initial={{ opacity: 0.4 }}
             animate={{ opacity: [0.4, 0.7, 0.4] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="30" y1="40" x2="15" y2="25" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="40" x2="45" y2="25" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="40" x2="50" y2="45" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="40" x2="30" y2="58" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="40" x2="10" y2="45" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="1.5" opacity="0.6" />
            
            {/* Secondary connections */}
            <line x1="15" y1="25" x2="45" y2="25" stroke="#6366F1" strokeWidth="1" opacity="0.3" />
            <line x1="10" y1="45" x2="50" y2="45" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
          </motion.g>

          {/* Orbiting Rings */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ originX: "30px", originY: "40px" }}
          >
             <circle cx="30" cy="40" r="12" fill="none" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="0.5" opacity="0.3" />
          </motion.g>
          
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ originX: "30px", originY: "40px" }}
          >
             <circle cx="30" cy="40" r="18" fill="none" stroke={`url(#logo-gradient-${gradientId})`} strokeWidth="0.3" opacity="0.2" />
          </motion.g>

          {/* Nodes */}
          {/* Center Node */}
          <motion.circle 
            cx="30" cy="40" r="6" 
            fill={`url(#logo-gradient-${gradientId})`} 
            filter={`url(#logo-glow-${gradientId})`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Satellite Nodes */}
          {[
            { cx: 15, cy: 25, fill: "#6366F1", delay: 0 },
            { cx: 45, cy: 25, fill: "#8B5CF6", delay: 0.2 },
            { cx: 50, cy: 45, fill: "#EC4899", delay: 0.4 },
            { cx: 30, cy: 58, fill: "#06B6D4", delay: 0.6 },
            { cx: 10, cy: 45, fill: "#6366F1", delay: 0.8 },
          ].map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill={node.fill}
              opacity="0.9"
              filter={`url(#logo-glow-${gradientId})`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: node.delay 
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  )
})
