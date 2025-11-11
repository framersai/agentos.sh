'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle system for subtle animated background
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      color: string
    }> = []

    const colors = [
      'rgba(14, 165, 233, 0.1)', // primary blue
      'rgba(217, 70, 239, 0.1)', // accent purple
      'rgba(16, 185, 129, 0.1)', // success green
    ]

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Neural network connection lines
    const connections: Array<{
      from: number
      to: number
      progress: number
      active: boolean
    }> = []

    // Create random connections
    for (let i = 0; i < 20; i++) {
      connections.push({
        from: Math.floor(Math.random() * particles.length),
        to: Math.floor(Math.random() * particles.length),
        progress: 0,
        active: Math.random() > 0.7,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections
      connections.forEach((connection) => {
        const fromParticle = particles[connection.from]
        const toParticle = particles[connection.to]

        if (connection.active) {
          connection.progress += 0.02
          if (connection.progress > 1) {
            connection.progress = 0
            connection.active = Math.random() > 0.5
          }

          // Draw connection line
          const distance = Math.sqrt(
            Math.pow(toParticle.x - fromParticle.x, 2) +
            Math.pow(toParticle.y - fromParticle.y, 2)
          )

          if (distance < 200) {
            ctx.beginPath()
            ctx.moveTo(fromParticle.x, fromParticle.y)
            ctx.lineTo(toParticle.x, toParticle.y)
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - distance / 200)})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Draw signal pulse
            if (connection.progress > 0 && connection.progress < 1) {
              const signalX = fromParticle.x + (toParticle.x - fromParticle.x) * connection.progress
              const signalY = fromParticle.y + (toParticle.y - fromParticle.y) * connection.progress

              ctx.beginPath()
              ctx.arc(signalX, signalY, 2, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(217, 70, 239, 0.8)'
              ctx.fill()
            }
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

// Floating SVG elements for additional depth
export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Floating neural network nodes */}
      <svg
        className="absolute top-1/4 left-1/4 w-64 h-64 animate-float"
        viewBox="0 0 200 200"
        fill="none"
        style={{ animation: 'float 20s ease-in-out infinite' }}
      >
        <circle cx="50" cy="50" r="4" fill="url(#gradient1)" opacity="0.2" />
        <circle cx="150" cy="50" r="4" fill="url(#gradient1)" opacity="0.2" />
        <circle cx="100" cy="100" r="6" fill="url(#gradient2)" opacity="0.3" />
        <circle cx="50" cy="150" r="4" fill="url(#gradient1)" opacity="0.2" />
        <circle cx="150" cy="150" r="4" fill="url(#gradient1)" opacity="0.2" />

        <line x1="50" y1="50" x2="100" y2="100" stroke="url(#gradient3)" strokeWidth="1" opacity="0.2" />
        <line x1="150" y1="50" x2="100" y2="100" stroke="url(#gradient3)" strokeWidth="1" opacity="0.2" />
        <line x1="50" y1="150" x2="100" y2="100" stroke="url(#gradient3)" strokeWidth="1" opacity="0.2" />
        <line x1="150" y1="150" x2="100" y2="100" stroke="url(#gradient3)" strokeWidth="1" opacity="0.2" />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating circuit pattern */}
      <svg
        className="absolute bottom-1/4 right-1/4 w-96 h-96 animate-float-reverse"
        viewBox="0 0 300 300"
        fill="none"
        style={{ animation: 'float-reverse 25s ease-in-out infinite' }}
      >
        <path
          d="M50 50 L100 50 L100 100 L150 100 L150 50 L200 50 L200 100 L250 100"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.1"
        />
        <path
          d="M50 150 L100 150 L100 200 L150 200 L150 150 L200 150 L200 200 L250 200"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.1"
        />

        <circle cx="50" cy="50" r="3" fill="#0ea5e9" opacity="0.3" />
        <circle cx="100" cy="100" r="3" fill="#d946ef" opacity="0.3" />
        <circle cx="150" cy="50" r="3" fill="#10b981" opacity="0.3" />
        <circle cx="200" cy="100" r="3" fill="#0ea5e9" opacity="0.3" />
        <circle cx="250" cy="100" r="3" fill="#d946ef" opacity="0.3" />

        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(20px) rotate(-5deg);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(20px) rotate(-5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  )
}