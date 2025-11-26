'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useEffect, useState, memo, useId, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'

export const AnimatedAgentOSLogoOptimized = memo(function AnimatedAgentOSLogoOptimized({
  size = 160,
  className = "",
  intensity = 1
}: {
  size?: number
  className?: string
  intensity?: number
}) {
  const [isClient, setIsClient] = useState(false)
  const { resolvedTheme } = useTheme()
  const gradientId = useId().replace(/:/g, "-")
  const timeRef = useRef(0)
  const [hue, setHue] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => setIsClient(true), [])

  // Animate hue rotation for liquid gradient effect
  useAnimationFrame((t) => {
    timeRef.current = t
    setHue((t / 50) % 360)
  })

  // Theme-aware color palettes - more vibrant and saturated
  const isDark = resolvedTheme === 'dark'
  
  const getGradientColors = useCallback(() => {
    const baseHue = hue
    if (isDark) {
      return [
        `hsl(${baseHue}, 100%, 70%)`,
        `hsl(${(baseHue + 60) % 360}, 100%, 65%)`,
        `hsl(${(baseHue + 120) % 360}, 100%, 75%)`,
        `hsl(${(baseHue + 180) % 360}, 100%, 70%)`,
        `hsl(${(baseHue + 240) % 360}, 100%, 65%)`,
      ]
    }
    return [
      `hsl(${baseHue}, 90%, 55%)`,
      `hsl(${(baseHue + 60) % 360}, 85%, 50%)`,
      `hsl(${(baseHue + 120) % 360}, 95%, 55%)`,
      `hsl(${(baseHue + 180) % 360}, 90%, 50%)`,
      `hsl(${(baseHue + 240) % 360}, 85%, 55%)`,
    ]
  }, [hue, isDark])

  const colors = getGradientColors()

  // Liquid blob animation using canvas for performance
  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    let animationId: number
    let time = 0

    const drawLiquidBlob = () => {
      ctx.clearRect(0, 0, size, size)
      time += 0.02 * intensity

      const centerX = size / 2
      const centerY = size / 2
      const baseRadius = size * 0.35

      // Create multiple overlapping liquid blobs
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.5
        const layerScale = 1 - layer * 0.15
        
        ctx.save()
        ctx.globalAlpha = 0.4 - layer * 0.1
        
        // Create morphing blob path
        ctx.beginPath()
        const points = 64
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2
          
          // Multiple frequency noise for organic liquid feel
          const noise1 = Math.sin(angle * 3 + time + layerOffset) * 0.15
          const noise2 = Math.sin(angle * 5 - time * 1.3 + layerOffset) * 0.1
          const noise3 = Math.cos(angle * 7 + time * 0.7 + layerOffset) * 0.08
          const noise4 = Math.sin(angle * 2 - time * 0.5) * 0.12
          
          const radius = baseRadius * layerScale * (1 + noise1 + noise2 + noise3 + noise4)
          
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()

        // Radiant gradient fill
        const gradient = ctx.createRadialGradient(
          centerX - size * 0.1,
          centerY - size * 0.1,
          0,
          centerX,
          centerY,
          baseRadius * 1.5
        )
        
        const colorIndex = Math.floor(time * 0.5) % colors.length
        gradient.addColorStop(0, colors[colorIndex])
        gradient.addColorStop(0.3, colors[(colorIndex + 1) % colors.length].replace(')', ', 0.8)').replace('hsl(', 'hsla('))
        gradient.addColorStop(0.6, colors[(colorIndex + 2) % colors.length].replace(')', ', 0.6)').replace('hsl(', 'hsla('))
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fill()
        
        // Add glow effect
        ctx.shadowColor = colors[colorIndex]
        ctx.shadowBlur = 20 * intensity
        ctx.fill()
        
        ctx.restore()
      }

      // Draw inner energy core
      ctx.save()
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, baseRadius * 0.4
      )
      coreGradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      coreGradient.addColorStop(0.3, colors[0].replace(')', ', 0.8)').replace('hsl(', 'hsla('))
      coreGradient.addColorStop(0.7, colors[1].replace(')', ', 0.4)').replace('hsl(', 'hsla('))
      coreGradient.addColorStop(1, 'transparent')
      
      ctx.globalAlpha = 0.8
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 0.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Draw orbiting particles
      for (let i = 0; i < 8; i++) {
        const particleAngle = (i / 8) * Math.PI * 2 + time * (0.5 + i * 0.1)
        const orbitRadius = baseRadius * (0.6 + Math.sin(time + i) * 0.2)
        const px = centerX + Math.cos(particleAngle) * orbitRadius
        const py = centerY + Math.sin(particleAngle) * orbitRadius
        const particleSize = 3 + Math.sin(time * 2 + i) * 2

        const particleGradient = ctx.createRadialGradient(px, py, 0, px, py, particleSize * 3)
        particleGradient.addColorStop(0, colors[i % colors.length])
        particleGradient.addColorStop(0.5, colors[i % colors.length].replace(')', ', 0.4)').replace('hsl(', 'hsla('))
        particleGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = particleGradient
        ctx.beginPath()
        ctx.arc(px, py, particleSize * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(drawLiquidBlob)
    }

    drawLiquidBlob()

    return () => cancelAnimationFrame(animationId)
  }, [isClient, size, colors, intensity])

  if (!isClient) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Liquid morphing canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: `blur(${isDark ? 1 : 0.5}px)` }}
      />
      
      {/* SVG overlay with network nodes */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`logo-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="25%" stopColor={colors[1]} />
            <stop offset="50%" stopColor={colors[2]} />
            <stop offset="75%" stopColor={colors[3]} />
            <stop offset="100%" stopColor={colors[4]} />
          </linearGradient>
          
          <filter id={`logo-glow-${gradientId}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feFlood floodColor={colors[0]} floodOpacity="0.5" result="glowColor"/>
            <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow"/>
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`logo-blur-${gradientId}`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <g transform="translate(50 50) scale(1.8) translate(-30 -40)">
          {/* Pulsing energy rings */}
          {[16, 22, 28].map((radius, i) => (
            <motion.circle
              key={`ring-${i}`}
              cx="30"
              cy="40"
              r={radius}
              fill="none"
              stroke={`url(#logo-gradient-${gradientId})`}
              strokeWidth={1.5 - i * 0.3}
              strokeDasharray={i % 2 === 0 ? "8 4" : "4 8"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                rotate: i % 2 === 0 ? 360 : -360,
                scale: 1
              }}
              transition={{
                opacity: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.8, delay: i * 0.2 }
              }}
              style={{ transformOrigin: "30px 40px" }}
            />
          ))}

          {/* Neural connections with animated stroke */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              { x1: 30, y1: 40, x2: 15, y2: 25 },
              { x1: 30, y1: 40, x2: 45, y2: 25 },
              { x1: 30, y1: 40, x2: 50, y2: 45 },
              { x1: 30, y1: 40, x2: 30, y2: 58 },
              { x1: 30, y1: 40, x2: 10, y2: 45 },
              { x1: 15, y1: 25, x2: 45, y2: 25 },
              { x1: 10, y1: 45, x2: 50, y2: 45 },
            ].map((line, i) => (
              <motion.line
                key={`connection-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={`url(#logo-gradient-${gradientId})`}
                strokeWidth={i < 5 ? 2 : 1}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{
                  pathLength: { duration: 1, delay: i * 0.1 },
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                }}
              />
            ))}
          </motion.g>

          {/* Central core node - the brain */}
          <motion.circle
            cx="30"
            cy="40"
            r="8"
            fill={`url(#logo-gradient-${gradientId})`}
            filter={`url(#logo-glow-${gradientId})`}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          {/* Inner core highlight */}
          <motion.circle
            cx="28"
            cy="38"
            r="3"
            fill="rgba(255,255,255,0.8)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Satellite nodes */}
          {[
            { cx: 15, cy: 25, delay: 0 },
            { cx: 45, cy: 25, delay: 0.15 },
            { cx: 50, cy: 45, delay: 0.3 },
            { cx: 30, cy: 58, delay: 0.45 },
            { cx: 10, cy: 45, delay: 0.6 },
          ].map((node, i) => (
            <motion.g key={`node-${i}`}>
              {/* Glow halo */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="7"
                fill={colors[i % colors.length]}
                filter={`url(#logo-blur-${gradientId})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay
                }}
              />
              {/* Core */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="5"
                fill={`url(#logo-gradient-${gradientId})`}
                filter={`url(#logo-glow-${gradientId})`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay
                }}
              />
              {/* Highlight */}
              <motion.circle
                cx={node.cx - 1.5}
                cy={node.cy - 1.5}
                r="1.5"
                fill="rgba(255,255,255,0.7)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: node.delay }}
              />
            </motion.g>
          ))}

          {/* Floating particles around the logo */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const radius = 32 + (i % 3) * 4
            return (
              <motion.circle
                key={`particle-${i}`}
                cx={30 + Math.cos(angle) * radius}
                cy={40 + Math.sin(angle) * radius}
                r={1 + (i % 2)}
                fill={colors[i % colors.length]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  cx: [
                    30 + Math.cos(angle) * radius,
                    30 + Math.cos(angle + 0.5) * (radius + 5),
                    30 + Math.cos(angle + 1) * radius
                  ],
                  cy: [
                    40 + Math.sin(angle) * radius,
                    40 + Math.sin(angle + 0.5) * (radius + 5),
                    40 + Math.sin(angle + 1) * radius
                  ]
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25
                }}
              />
            )
          })}
        </g>
      </svg>

      {/* Outer radiant glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[0]}40 0%, ${colors[2]}20 40%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
})
