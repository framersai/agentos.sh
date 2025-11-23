'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, memo, useId } from 'react'
import { useTheme } from 'next-themes'

export const AnimatedAgentOSLogoOptimized = memo(function AnimatedAgentOSLogoOptimized({
  size = 160,
  className = ""
}: {
  size?: number
  className?: string
}) {
  const [isClient, setIsClient] = useState(false)
  const { resolvedTheme } = useTheme()
  const gradientId = useId().replace(/:/g, "-")

  useEffect(() => setIsClient(true), [])

  // Theme-aware color palettes matching globals.css
  const lightThemeColors = [
    '#6366f1', // Indigo (Primary)
    '#d946ef', // Fuchsia/Pink (Secondary/Tertiary mix)
    '#06b6d4', // Cyan
    '#6366f1'  // Back to Primary
  ]

  const darkThemeColors = [
    '#818cf8', // Light Indigo
    '#e879f9', // Light Fuchsia
    '#22d3ee', // Light Cyan
    '#818cf8'  // Back to Indigo
  ]

  const colors = resolvedTheme === 'dark' ? darkThemeColors : lightThemeColors

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
            <motion.stop
              offset="0%" 
              animate={{
                stopColor: colors
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.stop 
              offset="50%" 
              animate={{
                stopColor: [colors[1], colors[2], colors[3], colors[0]]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.stop 
              offset="100%" 
              animate={{
                stopColor: [colors[2], colors[3], colors[0], colors[1]]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </linearGradient>
          <filter id={`logo-glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
            <line x1="15" y1="25" x2="45" y2="25" stroke={colors[0]} strokeWidth="1" opacity="0.3" />
            <line x1="10" y1="45" x2="50" y2="45" stroke={colors[1]} strokeWidth="1" opacity="0.3" />
          </motion.g>

          {/* Orbiting Rings - Hypnotic Pattern */}
          {[12, 18, 24, 30].map((radius, i) => (
             <motion.g
               key={i}
               animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
               transition={{ 
                 duration: 15 + i * 5, 
                 repeat: Infinity, 
                 ease: "linear" 
               }}
               style={{ originX: "30px", originY: "40px" }}
             >
                <motion.circle 
                  cx="30" 
                  cy="40" 
                  r={radius} 
                  fill="none" 
                  stroke={`url(#logo-gradient-${gradientId})`} 
                  strokeWidth={0.5 - (i * 0.05)} 
                  strokeDasharray={i % 2 === 0 ? "4 4" : "none"}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, delay: i, repeat: Infinity, ease: "easeInOut" }}
                />
             </motion.g>
          ))}

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
            { cx: 15, cy: 25, fill: colors[0], delay: 0 },
            { cx: 45, cy: 25, fill: colors[1], delay: 0.2 },
            { cx: 50, cy: 45, fill: colors[2], delay: 0.4 },
            { cx: 30, cy: 58, fill: colors[2], delay: 0.6 },
            { cx: 10, cy: 45, fill: colors[0], delay: 0.8 },
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
                opacity: [0.8, 1, 0.8],
                fill: [node.fill, colors[(i + 1) % 3], node.fill]
              }}
              transition={{ 
                duration: 4, 
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
