'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Monitor, Sparkles } from 'lucide-react'

// Sample captions for demo with times (in seconds)
const demoVideoData = {
  duration: 60,
  captions: [
    { start: 0, end: 3, text: "Welcome to AgentOS", shape: 'hexagon', position: 'top-left' },
    { start: 3, end: 6, text: "Build adaptive AI systems", shape: 'rounded', position: 'bottom-right' },
    { start: 6, end: 9, text: "TypeScript-powered intelligence", shape: 'diamond', position: 'top-right' },
    { start: 9, end: 12, text: "GMI orchestration", shape: 'rounded', position: 'bottom-left' },
    { start: 12, end: 15, text: "Persistent memory systems", shape: 'hexagon', position: 'center' },
    { start: 15, end: 18, text: "Enterprise-grade security", shape: 'diamond', position: 'top-center' },
    { start: 18, end: 21, text: "Deploy anywhere", shape: 'rounded', position: 'bottom-center' },
    { start: 21, end: 24, text: "Multi-agent workflows", shape: 'hexagon', position: 'top-left' },
    { start: 24, end: 27, text: "Real-time streaming", shape: 'diamond', position: 'bottom-right' },
    { start: 27, end: 30, text: "Join thousands of developers", shape: 'rounded', position: 'center' },
    { start: 30, end: 35, text: "npm install @framersai/agentos", shape: 'hexagon', position: 'bottom-center' },
    { start: 35, end: 40, text: "Start building today", shape: 'diamond', position: 'top-center' },
    { start: 40, end: 45, text: "Production-ready runtime", shape: 'rounded', position: 'top-left' },
    { start: 45, end: 50, text: "Scale to millions", shape: 'hexagon', position: 'bottom-right' },
    { start: 50, end: 55, text: "Open source & extensible", shape: 'diamond', position: 'center' },
    { start: 55, end: 60, text: "AgentOS by Frame.dev", shape: 'rounded', position: 'bottom-center' },
  ]
}

const captionPositions = {
  'top-left': 'top-12 left-12',
  'top-center': 'top-12 left-1/2 -translate-x-1/2',
  'top-right': 'top-12 right-12',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'bottom-left': 'bottom-20 left-12',
  'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-20 right-12',
}

// Geometric shape components
const GeometricShapes = {
  hexagon: (
    <svg viewBox="0 0 300 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M30,10 L270,10 L290,50 L270,90 L30,90 L10,50 Z"
        fill="url(#hex-gradient)"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  ),
  rounded: (
    <svg viewBox="0 0 300 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="round-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect
        x="10"
        y="10"
        width="280"
        height="80"
        rx="20"
        ry="20"
        fill="url(#round-gradient)"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 300 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M150,10 L280,50 L150,90 L20,50 Z"
        fill="url(#diamond-gradient)"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  ),
}

export function VideoDemoSection() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1
        if (next >= demoVideoData.duration) return 0 // Loop
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Get current caption
  const currentCaption = demoVideoData.captions.find(
    cap => currentTime >= cap.start && currentTime < cap.end
  )

  // Hide controls after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000)
    return () => clearTimeout(timer)
  }, [showControls])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-6">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-semibold text-text-secondary">Live Demo</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Experience AgentOS</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Watch how developers are building next-generation AI applications with our adaptive runtime.
            See real examples of GMI orchestration, memory systems, and multi-agent workflows.
          </p>
        </motion.div>

        {/* Main Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          <div
            className={`relative aspect-video rounded-3xl overflow-hidden glass-morphism shadow-modern-lg ${
              isFullscreen ? 'fixed inset-4 z-50 max-w-none' : ''
            }`}
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
          >
            {/* Video Placeholder with animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
              {/* Animated mesh background */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="mesh-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    {[...Array(5)].map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={20 + i * 20}
                        cy={50}
                        r="2"
                        fill="var(--color-accent-primary)"
                        animate={{
                          cy: [50, 30, 70, 50],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 4,
                          delay: i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
              </svg>

              {/* Placeholder content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-accent-primary/30 blur-3xl animate-pulse-glow" />
                    <div className="relative w-24 h-24 mx-auto rounded-full glass-morphism flex items-center justify-center">
                      <Play className="w-12 h-12 text-accent-primary ml-1" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Interactive Demo</h3>
                  <p className="text-text-secondary">Experience the power of AgentOS</p>
                </motion.div>
              </div>
            </div>

            {/* Animated Captions with Geometric Backgrounds */}
            <AnimatePresence mode="wait">
              {currentCaption && (
                <motion.div
                  key={`${currentCaption.start}-${currentCaption.text}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className={`absolute ${captionPositions[currentCaption.position as keyof typeof captionPositions]} z-20 pointer-events-none`}
                >
                  <div className="relative">
                    {/* Geometric background */}
                    <div className="absolute inset-0 -z-10 scale-110">
                      {GeometricShapes[currentCaption.shape as keyof typeof GeometricShapes]}
                    </div>

                    {/* Caption text */}
                    <div className="relative px-8 py-4 min-w-[200px] text-center">
                      <p className="text-white font-bold text-lg drop-shadow-lg">
                        {currentCaption.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Controls */}
            <motion.div
              initial={false}
              animate={{ opacity: showControls ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-xl glass-morphism hover:bg-white/20 transition-all group"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ?
                    <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform" /> :
                    <Play className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  }
                </button>

                {/* Progress bar */}
                <div className="flex-1">
                  <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                      style={{ width: `${(currentTime / demoVideoData.duration) * 100}%` }}
                    />
                    {/* Scrubber handle */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                      style={{ left: `${(currentTime / demoVideoData.duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time display */}
                <span className="text-white text-sm font-mono min-w-[100px] text-center">
                  {Math.floor(currentTime)}s / {demoVideoData.duration}s
                </span>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-xl glass-morphism hover:bg-white/20 transition-all group"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ?
                    <VolumeX className="w-5 h-5 text-white group-hover:scale-110 transition-transform" /> :
                    <Volume2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  }
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-3 rounded-xl glass-morphism hover:bg-white/20 transition-all group"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ?
                    <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" /> :
                    <Maximize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  }
                </button>
              </div>
            </motion.div>
          </div>

          {/* Feature highlights below video */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: 'Live Development',
                desc: 'Watch real-time coding and deployment',
                icon: '⚡'
              },
              {
                title: 'Production Patterns',
                desc: 'Learn best practices from experts',
                icon: '🎯'
              },
              {
                title: 'Full Stack AI',
                desc: 'End-to-end agent development',
                icon: '🚀'
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="p-6 rounded-2xl glass-morphism hover:shadow-modern transition-all">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-text-muted">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-text-muted mb-6">Want to see more?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://youtube.com/@framersai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              YouTube Channel
            </a>
            <a
              href="https://github.com/framersai/agentos/tree/main/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Code Examples
            </a>
            <a
              href="/docs/tutorials"
              className="btn-secondary"
            >
              Interactive Tutorials
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}