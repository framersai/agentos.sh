
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParticleMorphProps {
  text: string
  className?: string
  fontSize?: number
  particleCount?: number
  animationDuration?: number
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  size: number
  color: string
  delay: number
}

export default function ParticleMorphText({
  text,
  className = '',
  fontSize = 60,
  particleCount = 100,
  animationDuration = 0.8
}: ParticleMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setShowText(false)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // Measure and draw text to get pixel data
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
    const metrics = ctx.measureText(text)
    const w = Math.ceil(metrics.width) + 40
    const h = fontSize * 1.5
    canvas.width = w
    canvas.height = h
    
    // Draw text to extract pixel positions
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(text, w/2, h/2)
    
    const imageData = ctx.getImageData(0, 0, w, h)
    const pixels = imageData.data
    const targets: Array<[number, number]> = []
    
    // Sample text pixels more densely
    const sampling = 2
    for (let y = 0; y < h; y += sampling) {
      for (let x = 0; x < w; x += sampling) {
        const i = (y * w + x) * 4
        if (pixels[i + 3] > 128) {
          targets.push([x, y])
        }
      }
    }
    
    // Create particles that will form the text
    const particles: Particle[] = []
    const colors = [
      'var(--color-accent-primary)',
      'var(--color-accent-secondary)',
      'var(--color-accent-tertiary)'
    ]
    
    for (let i = 0; i < Math.min(particleCount, targets.length); i++) {
      const [tx, ty] = targets[Math.floor(i * targets.length / particleCount)]
      
      // Start particles from random positions around the text area
      const angle = Math.random() * Math.PI * 2
      const distance = 100 + Math.random() * 200
      
      particles.push({
        x: tx + Math.cos(angle) * distance,
        y: ty + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        tx,
        ty,
        size: 3 + Math.random() * 5,
        color: colors[i % colors.length],
        delay: Math.random() * 200
      })
    }
    
    particlesRef.current = particles
    
    // Setup canvas
    const displayCanvas = canvasRef.current
    if (!displayCanvas) return
    
    displayCanvas.width = w
    displayCanvas.height = h
    const renderCtx = displayCanvas.getContext('2d')!
    
    startTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      renderCtx.clearRect(0, 0, w, h)
      
      // Apply gooey filter effect
      renderCtx.filter = 'blur(2px) contrast(10)'
      
      let completedCount = 0
      
      particlesRef.current.forEach((p) => {
        if (elapsed < p.delay) return
        
        const progress = Math.min((elapsed - p.delay) / (animationDuration * 1000), 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        
        // Morph particles toward their targets
        p.x = p.x + (p.tx - p.x) * easeProgress * 0.08
        p.y = p.y + (p.ty - p.y) * easeProgress * 0.08
        
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        const dist = Math.hypot(dx, dy)
        
        if (dist < 2) {
          completedCount++
        }
        
        // Draw particle with gradient
        const gradient = renderCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, 'transparent')
        
        renderCtx.fillStyle = gradient
        renderCtx.globalAlpha = 0.8 * (1 - progress * 0.3)
        renderCtx.beginPath()
        renderCtx.arc(p.x, p.y, p.size * (1 + progress * 0.5), 0, Math.PI * 2)
        renderCtx.fill()
      })
      
      renderCtx.filter = 'none'
      renderCtx.globalAlpha = 1
      
      // Show text when particles are mostly in place
      if (completedCount > particleCount * 0.7 && !showText) {
        setTimeout(() => setShowText(true), 100)
      }
      
      if (elapsed < animationDuration * 1500) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [text, fontSize, particleCount, animationDuration])

  return (
    <span className="inline-block relative">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          filter: 'url(#liquid-morph)',
          transform: 'translate(-20px, -25%)'
        }} 
      />
      
      {/* SVG filter for liquid effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-morph">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" 
            />
          </filter>
        </defs>
      </svg>
      
      {/* Actual text that fades in */}
      <AnimatePresence>
        {showText && (
          <motion.span
            className={className}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
