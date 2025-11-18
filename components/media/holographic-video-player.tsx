'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Upload, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'

interface HolographicVideoPlayerProps {
  videoUrl?: string
  placeholder?: boolean
  title?: string
  description?: string
}

type ShapeType = 'cube' | 'pyramid' | 'sphere' | 'torus'

interface HolographicShape {
  type: ShapeType
  x: number
  y: number
  z: number
  size: number
  rotationX: number
  rotationY: number
  rotationSpeed: number
  floatSpeed: number
  color: string
  opacity: number
}

export function HolographicVideoPlayer({
  videoUrl,
  placeholder = true,
  title = "AgentOS Demo",
  description = "Experience the future of multi-agent orchestration"
}: HolographicVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { resolvedTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const isDark = resolvedTheme === 'dark'

  // Holographic placeholder animation
  useEffect(() => {
    if (!placeholder || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let frame = 0
    const shapes: HolographicShape[] = []

    // Create floating holographic shapes
    for (let i = 0; i < 12; i++) {
      shapes.push({
        type: ['cube', 'pyramid', 'sphere', 'torus'][Math.floor(Math.random() * 4)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        size: 20 + Math.random() * 40,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationSpeed: 0.01 + Math.random() * 0.02,
        floatSpeed: 0.5 + Math.random() * 1,
        color: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'][Math.floor(Math.random() * 4)],
        opacity: 0.3 + Math.random() * 0.4
      })
    }

    const drawShape = (shape: HolographicShape) => {
      ctx.save()
      ctx.globalAlpha = shape.opacity * (0.8 + Math.sin(frame * 0.01 + shape.x) * 0.2)

      // Calculate 3D perspective
      const perspective = 500
      const scale = perspective / (perspective + shape.z)
      const x = canvas.width / 2 + (shape.x - canvas.width / 2) * scale
      const y = canvas.height / 2 + (shape.y - canvas.height / 2) * scale
      const size = shape.size * scale

      // Draw holographic glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      gradient.addColorStop(0, shape.color + '40')
      gradient.addColorStop(0.5, shape.color + '20')
      gradient.addColorStop(1, shape.color + '00')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw shape based on type
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2 * scale
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (shape.type === 'cube') {
        // Draw wireframe cube
        const cos = Math.cos(shape.rotationY)
        const sin = Math.sin(shape.rotationY)
        const points = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Front
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]      // Back
        ].map(([px, py, pz]) => {
          // Rotate around Y axis
          const rx = px * cos - pz * sin
          const rz = px * sin + pz * cos
          // Rotate around X axis
          const cosX = Math.cos(shape.rotationX)
          const sinX = Math.sin(shape.rotationX)
          const ry = py * cosX - rz * sinX
          const finalZ = py * sinX + rz * cosX

          return {
            x: x + rx * size,
            y: y + ry * size,
            z: finalZ
          }
        })

        // Draw edges
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // Front
          [4, 5], [5, 6], [6, 7], [7, 4], // Back
          [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting
        ]

        edges.forEach(([i, j]) => {
          ctx.beginPath()
          ctx.moveTo(points[i].x, points[i].y)
          ctx.lineTo(points[j].x, points[j].y)
          ctx.stroke()
        })
      } else if (shape.type === 'pyramid') {
        // Draw wireframe pyramid
        const apex = { x, y: y - size }
        const base = [
          { x: x - size, y: y + size },
          { x: x + size, y: y + size },
          { x: x + size * 0.5, y: y + size - size * 0.866 },
          { x: x - size * 0.5, y: y + size - size * 0.866 }
        ]

        // Draw base
        ctx.beginPath()
        base.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        })
        ctx.closePath()
        ctx.stroke()

        // Draw edges to apex
        base.forEach(point => {
          ctx.beginPath()
          ctx.moveTo(apex.x, apex.y)
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        })
      } else if (shape.type === 'sphere') {
        // Draw wireframe sphere
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.stroke()

        // Draw latitude lines
        for (let i = 1; i < 4; i++) {
          const lat = (Math.PI / 4) * i
          const r = Math.sin(lat) * size
          const h = Math.cos(lat) * size
          ctx.beginPath()
          ctx.ellipse(x, y - h, r, r * 0.3, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.ellipse(x, y + h, r, r * 0.3, 0, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw longitude lines
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i + shape.rotationY
          ctx.beginPath()
          ctx.ellipse(x, y, size, size * 0.3, angle, 0, Math.PI)
          ctx.stroke()
        }
      } else if (shape.type === 'torus') {
        // Draw wireframe torus
        const outerRadius = size
        const innerRadius = size * 0.4

        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i + shape.rotationY
          const cx = x + Math.cos(angle) * (outerRadius - innerRadius)
          const cy = y + Math.sin(angle) * (outerRadius - innerRadius) * 0.3

          ctx.beginPath()
          ctx.ellipse(cx, cy, innerRadius, innerRadius * 0.6, angle, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Draw energy particles
      for (let i = 0; i < 3; i++) {
        const particleAngle = frame * 0.02 + i * Math.PI * 2 / 3
        const px = x + Math.cos(particleAngle) * size * 1.5
        const py = y + Math.sin(particleAngle) * size * 1.5

        ctx.fillStyle = shape.color + '80'
        ctx.beginPath()
        ctx.arc(px, py, 2 * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const animate = () => {
      if (prefersReducedMotion) return

      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frame++

      // Update and draw shapes
      shapes.forEach(shape => {
        // Update rotation
        shape.rotationX += shape.rotationSpeed
        shape.rotationY += shape.rotationSpeed * 0.7

        // Float animation
        shape.y += Math.sin(frame * 0.01 * shape.floatSpeed) * 0.5
        shape.x += Math.cos(frame * 0.01 * shape.floatSpeed * 0.7) * 0.3

        // Z-axis oscillation for depth
        shape.z = 50 + Math.sin(frame * 0.01 + shape.x) * 50

        // Wrap around edges
        if (shape.x < -50) shape.x = canvas.width + 50
        if (shape.x > canvas.width + 50) shape.x = -50
        if (shape.y < -50) shape.y = canvas.height + 50
        if (shape.y > canvas.height + 50) shape.y = -50

        drawShape(shape)
      })

      // Draw scan line effect
      const scanLineY = (frame * 2) % canvas.height
      const scanGradient = ctx.createLinearGradient(0, scanLineY - 20, 0, scanLineY + 20)
      scanGradient.addColorStop(0, 'rgba(0, 255, 255, 0)')
      scanGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.2)')
      scanGradient.addColorStop(1, 'rgba(0, 255, 255, 0)')

      ctx.fillStyle = scanGradient
      ctx.fillRect(0, scanLineY - 20, canvas.width, 40)

      // Add light rays
      if (frame % 60 === 0) {
        const rayX = Math.random() * canvas.width
        const rayGradient = ctx.createLinearGradient(rayX, 0, rayX, canvas.height)
        rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
        rayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
        rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = rayGradient
        ctx.fillRect(rayX - 1, 0, 2, canvas.height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [placeholder, prefersReducedMotion, isDark])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleProgressUpdate = () => {
    if (!videoRef.current) return
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setProgress(progress)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="holographic-card rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-glass-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold gradient-text flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {title}
              </h3>
              <p className="text-sm text-muted mt-1">{description}</p>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black/5 dark:bg-black/20">
          {placeholder && !videoUrl ? (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ background: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
            />
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              onTimeUpdate={handleProgressUpdate}
              onClick={togglePlay}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <Upload className="w-16 h-16 mx-auto mb-4 text-accent-primary opacity-50" />
                <p className="text-muted">Upload a demo video to showcase AgentOS</p>
              </div>
            </div>
          )}

          {/* Holographic overlay effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/5" />
            <div className="absolute inset-0 holographic-gradient opacity-10 mix-blend-screen" />
          </div>

          {/* Play button overlay */}
          {videoUrl && !isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="neumorphic-button rounded-full p-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </button>
          )}
        </div>

        {/* Controls */}
        {videoUrl && (
          <div className="p-4 border-t border-glass-border">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="neumorphic-button rounded-full p-2"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1">
                <div className="relative h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={toggleMute}
                className="neumorphic-button rounded-full p-2"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button className="neumorphic-button rounded-full p-2">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}