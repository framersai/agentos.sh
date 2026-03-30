'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  pulsePhase: number
  connectionStrength: number
  layer: number
}

interface Connection {
  from: number
  to: number
  strength: number
  pulseOffset: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const isVisibleRef = useRef(true)
  const isPausedRef = useRef(false)
  const prefersReducedMotion = useRef(false)
  const { theme: currentTheme, resolvedTheme } = useTheme()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const themeMap = useMemo(
    () => ({
      'sakura-sunset': ['#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB'],
      'twilight-neo': ['#00FFFF', '#8A2BE2', '#00BFFF', '#9370DB'],
      'aurora-daybreak': ['#FF0096', '#64C8FF', '#FF64C8', '#9664FF'],
      'warm-embrace': ['#FFD700', '#FF8C00', '#FFA500', '#FFC107'],
      'retro-terminus': ['#00FF00', '#32CD32', '#00FF00', '#7CFC00']
    }),
    []
  )

  const getThemeColors = useCallback(
    () => themeMap[currentTheme as keyof typeof themeMap] || themeMap['aurora-daybreak'],
    [currentTheme, themeMap]
  )

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // IntersectionObserver to pause animation when not visible
  useEffect(() => {
    if (!canvasRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )

    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [])

  // Pause/resume when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const colors = getThemeColors()
    const isDark = resolvedTheme === 'dark'

    // Skip animation entirely if user prefers reduced motion
    if (prefersReducedMotion.current) {
      return
    }

    // Reduced particle count: 40 desktop, 15 mobile (was 80/30)
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const particleCount = isMobile ? 15 : 40
    // Clear stale connections immediately so the render loop doesn't
    // access particle indices from the old (possibly larger) array.
    connectionsRef.current = []

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: 0.1 + Math.random() * 0.5,
      radius: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulsePhase: Math.random() * Math.PI * 2,
      connectionStrength: 0.3 + Math.random() * 0.7,
      layer: Math.floor(Math.random() * 3)
    }))

    // Pre-parse particle color hex values to avoid string ops per frame
    const particleRgb = particlesRef.current.map(p => {
      const hex = p.color.replace('#', '')
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      }
    })

    // Connection recalculation helper (called every N frames, not every frame)
    const updateConnections = () => {
      connectionsRef.current = []
      const maxDistance = 150
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distSq = dx * dx + dy * dy
          const maxDistSq = maxDistance * maxDistance

          if (distSq < maxDistSq) {
            connectionsRef.current.push({
              from: i,
              to: j,
              strength: 1 - (Math.sqrt(distSq) / maxDistance),
              pulseOffset: Math.random() * Math.PI * 2
            })
          }
        }
      }
    }

    // Throttled mousemove — update at most every 50ms
    let lastMouseUpdate = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMouseUpdate < 50) return
      lastMouseUpdate = now
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Pre-create the background gradient (reused every frame)
    const bgGradient = ctx.createRadialGradient(
      dimensions.width / 2,
      dimensions.height / 2,
      0,
      dimensions.width / 2,
      dimensions.height / 2,
      dimensions.width / 2
    )
    if (isDark) {
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      bgGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.02)')
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)')
    } else {
      bgGradient.addColorStop(0, 'rgba(250, 250, 255, 0.1)')
      bgGradient.addColorStop(0.5, 'rgba(245, 245, 255, 0.15)')
      bgGradient.addColorStop(1, 'rgba(240, 240, 255, 0.2)')
    }

    // Pre-compute color0 for connection midpoints
    const color0Hex = colors[0].replace('#', '')
    const color0Rgb = {
      r: parseInt(color0Hex.substring(0, 2), 16),
      g: parseInt(color0Hex.substring(2, 4), 16),
      b: parseInt(color0Hex.substring(4, 6), 16),
    }

    let frame = 0
    const animate = () => {
      // Skip frame if tab hidden or canvas not in viewport
      if (isPausedRef.current || !isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Reuse pre-created background gradient
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      frame++
      const time = frame * 0.01

      // Update and render particles by layer — use solid colors + globalAlpha
      // instead of creating radial gradients per particle
      const particles = particlesRef.current
      for (let idx = 0; idx < particles.length; idx++) {
        const particle = particles[idx]

        // Update position
        particle.x += particle.vx * (1 + particle.layer * 0.3)
        particle.y += particle.vy * (1 + particle.layer * 0.3)
        particle.x += Math.sin(time + idx) * 0.2
        particle.y += Math.cos(time + idx * 0.7) * 0.2

        // Mouse interaction
        const mdx = particle.x - mouseRef.current.x
        const mdy = particle.y - mouseRef.current.y
        const mouseDistSq = mdx * mdx + mdy * mdy

        if (mouseDistSq < 22500) { // 150^2
          const mouseDist = Math.sqrt(mouseDistSq)
          const angle = Math.atan2(mdy, mdx)
          const force = (150 - mouseDist) / 150
          particle.x += Math.cos(angle) * force * 2
          particle.y += Math.sin(angle) * force * 2
        }

        // Boundary wrap
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
        if (particle.y > dimensions.height) particle.y = 0

        particle.pulsePhase += 0.02

        const pulseSize = 1 + Math.sin(particle.pulsePhase) * 0.3
        const baseOpacity = isDark ? 0.2 : 0.35
        const opacity = baseOpacity + particle.layer * 0.1 + Math.sin(particle.pulsePhase) * 0.1
        const rgb = particleRgb[idx]

        // Outer glow — use solid fill + globalAlpha instead of per-particle gradient
        const glowRadius = particle.radius * pulseSize * 4
        ctx.globalAlpha = 0.08
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.globalAlpha = opacity
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * pulseSize, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1.0

      // Recalculate connections every 4 frames instead of every frame
      if (frame % 4 === 0) {
        updateConnections()
      }

      // Render cached connections
      connectionsRef.current.forEach(connection => {
        const p1 = particles[connection.from]
        const p2 = particles[connection.to]

        // Guard against stale connection indices after resize (particle
        // count can shrink from 40 to 15 on mobile, but connections are
        // only recalculated every 4th frame).
        if (!p1 || !p2) return

        const pulse = Math.sin(time * 2 + connection.pulseOffset) * 0.5 + 0.5
        const baseConnectionOpacity = isDark ? 0.1 : 0.15
        const connOpacity = connection.strength * baseConnectionOpacity * pulse
        const alpha = Math.floor(connOpacity * 255)
        if (alpha < 2) return // skip nearly invisible lines

        const rgb1 = particleRgb[connection.from]
        const rgb2 = particleRgb[connection.to]

        // Use simple linear gradient for connections (reuses pre-parsed RGB)
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        gradient.addColorStop(0, `rgba(${rgb1.r},${rgb1.g},${rgb1.b},${connOpacity})`)
        gradient.addColorStop(0.5, `rgba(${color0Rgb.r},${color0Rgb.g},${color0Rgb.b},${connOpacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${rgb2.r},${rgb2.g},${rgb2.b},${connOpacity})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.5 + pulse * 0.5
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)

        const midX = (p1.x + p2.x) / 2 + Math.sin(time + connection.pulseOffset) * 20
        const midY = (p1.y + p2.y) / 2 + Math.cos(time + connection.pulseOffset) * 20
        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y)
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, resolvedTheme, getThemeColors])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: resolvedTheme === 'dark' ? 0.6 : 0.4,
        mixBlendMode: resolvedTheme === 'dark' ? 'screen' : 'multiply'
      }}
    />
  )
}
