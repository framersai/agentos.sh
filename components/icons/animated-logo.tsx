'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedAgentOSLogo() {
  const [electrons, setElectrons] = useState<Array<{ angle: number, speed: number, radius: number }>>([])

  useEffect(() => {
    setElectrons(
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i * 360) / 6,
        speed: 0.5 + Math.random() * 0.5,
        radius: 120 + Math.random() * 20
      }))
    )
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" />
          </linearGradient>
          <filter id="glow-blur">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbital Rings */}
        {[100, 140, 180].map((r, i) => (
          <motion.circle
            key={`ring-${i}`}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            opacity="0.4"
            initial={{ rotate: i * 30 }}
            animate={{ rotate: 360 + i * 30 }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '200px 200px' }}
          />
        ))}

        {/* Electrons */}
        {electrons.map((e, i) => (
          <motion.g
            key={`electron-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 4 / e.speed, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '200px 200px' }}
          >
            <circle
              cx={200 + e.radius}
              cy="200"
              r="4"
              fill="var(--color-accent-secondary)"
              filter="url(#glow-blur)"
            >
              <animate
                attributeName="r"
                values="4;6;4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Trail */}
            <path
              d={`M ${200 + e.radius - 10} 200 Q ${200 + e.radius} 200 ${200 + e.radius} 200`}
              stroke="var(--color-accent-secondary)"
              strokeWidth="2"
              opacity="0.5"
            />
          </motion.g>
        ))}

        {/* Central Core Hexagon */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <path
            d="M200 140 L252 170 L252 230 L200 260 L148 230 L148 170 Z"
            fill="none"
            stroke="url(#circuit-gradient)"
            strokeWidth="2"
            filter="url(#glow-blur)"
          />
           {/* Inner Circuit Lines */}
           <path
            d="M200 140 L200 170 M252 170 L226 185 M252 230 L226 215 M200 260 L200 230 M148 230 L174 215 M148 170 L174 185"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            opacity="0.6"
          />
        </motion.g>

        {/* Core Pulse */}
        <circle cx="200" cy="200" r="40" fill="url(#core-glow)">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="40;50;40"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Brain Icon in Center */}
        <g transform="translate(176, 176) scale(1)">
           <path
              d="M12 4C10.8 4 9.8 4.9 9.8 6L9.8 8C9.8 9.1 8.9 10 7.8 10C6.7 10 5.8 10.9 5.8 12L5.8 14C5.8 15.1 4.9 16 3.8 16C2.7 16 1.8 16.9 1.8 18L1.8 30C1.8 31.1 2.7 32 3.8 32C4.9 32 5.8 32.9 5.8 34L5.8 36C5.8 37.1 6.7 38 7.8 38C8.9 38 9.8 38.9 9.8 40L9.8 42C9.8 43.1 10.7 44 11.8 44L23.8 44C24.9 44 25.8 43.1 25.8 42L25.8 40C25.8 38.9 26.7 38 27.8 38C28.9 38 29.8 37.1 29.8 36L29.8 34C29.8 32.9 30.7 32 31.8 32C32.9 32 33.8 31.1 33.8 30L33.8 18C33.8 16.9 32.9 16 31.8 16C30.7 16 29.8 15.1 29.8 14L29.8 12C29.8 10.9 28.9 10 27.8 10C26.7 10 25.8 9.1 25.8 8L25.8 6C25.8 4.9 24.9 4 23.8 4L12 4Z"
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="2"
              filter="url(#glow-blur)"
            />
            {/* Synapses */}
            <circle cx="12" cy="16" r="2" fill="white" opacity="0.8">
                 <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="24" cy="12" r="2" fill="white" opacity="0.8">
                 <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="20" cy="28" r="2" fill="white" opacity="0.8">
                 <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
            </circle>
        </g>

      </svg>
    </motion.div>
  )
}
