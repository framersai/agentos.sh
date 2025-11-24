
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ParticleMorphProps {
  text: string
  className?: string
  fontSize?: number
  color?: string
  particleCount?: number
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  complete: boolean
}

export default function ParticleMorphText({
  text,
  className = '',
  fontSize = 80,
  color = 'var(--color-accent-primary)',
  particleCount = 150,
}: ParticleMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const targetsRef = useRef<Array<[number, number]>>([])
  const frameRef = useRef<number>()

  // Create target pixel map once text changes
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const sampling = 4 // pixel skip interval
    ctx.font = `bold ${fontSize}px sans-serif`
    const metrics = ctx.measureText(text)
    const w = metrics.width + 20
    const h = fontSize + 20
    canvas.width = w
    canvas.height = h
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'top'
    ctx.fillText(text, 10, 0)
    const img = ctx.getImageData(0, 0, w, h).data
    const targets: Array<[number, number]> = []
    for (let y = 0; y < h; y += sampling) {
      for (let x = 0; x < w; x += sampling) {
        const alpha = img[(y * w + x) * 4 + 3]
        if (alpha > 200) targets.push([x, y])
      }
    }
    targetsRef.current = targets

    // init particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      const [tx, ty] = targets[i % targets.length]
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        tx,
        ty,
        complete: false,
      })
    }
    particlesRef.current = particles

    // start loop
    const canvasEl = canvasRef.current!
    canvasEl.width = w
    canvasEl.height = h
    const renderCtx = canvasEl.getContext('2d')!

    const step = () => {
      renderCtx.clearRect(0, 0, w, h)
      let doneCount = 0
      particlesRef.current.forEach((p) => {
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 1) {
          p.complete = true
          doneCount++
        } else {
          const ax = dx * 0.02
          const ay = dy * 0.02
          p.vx += ax
          p.vy += ay
          p.vx *= 0.92
          p.vy *= 0.92
          p.x += p.vx
          p.y += p.vy
        }
        renderCtx.fillStyle = color
        renderCtx.beginPath()
        renderCtx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        renderCtx.fill()
      })
      frameRef.current = requestAnimationFrame(step)
    }
    step()
    return () => cancelAnimationFrame(frameRef.current!)
  }, [text, fontSize, particleCount, color])

  return (
    <motion.span className={`inline-block relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </motion.span>
  )
}
