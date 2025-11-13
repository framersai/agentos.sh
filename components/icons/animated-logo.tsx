'use client'

import { motion } from 'framer-motion'

export function AnimatedAgentOSLogo() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <svg
        width="400"
        height="140"
        viewBox="0 0 400 140"
        className="w-64 sm:w-80 md:w-96"
      >
        <defs>
          {/* Animated gradient */}
          <linearGradient id="logo-gradient-animated" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-primary)">
              <animate
                attributeName="stop-color"
                values="var(--color-accent-primary);var(--color-accent-secondary);var(--color-accent-tertiary);var(--color-accent-primary)"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="var(--color-accent-secondary)">
              <animate
                attributeName="stop-color"
                values="var(--color-accent-secondary);var(--color-accent-tertiary);var(--color-accent-primary);var(--color-accent-secondary)"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="var(--color-accent-tertiary)">
              <animate
                attributeName="stop-color"
                values="var(--color-accent-tertiary);var(--color-accent-primary);var(--color-accent-secondary);var(--color-accent-tertiary)"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Glow filter */}
          <filter id="logo-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Circuit pattern mask */}
          <pattern id="circuit-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="url(#logo-gradient-animated)" opacity="0.3">
              <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="35" r="1" fill="url(#logo-gradient-animated)" opacity="0.3">
              <animate attributeName="r" values="1;2;1" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <path d="M5,5 L35,5 L35,35" stroke="url(#logo-gradient-animated)" strokeWidth="0.5" fill="none" opacity="0.2" />
          </pattern>
        </defs>

        {/* Background neural network animation */}
        <g opacity="0.3">
          {/* Neural connections */}
          {[...Array(8)].map((_, i) => {
            const x1 = 50 + Math.random() * 300
            const y1 = 20 + Math.random() * 100
            const x2 = 50 + Math.random() * 300
            const y2 = 20 + Math.random() * 100
            return (
              <motion.line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#logo-gradient-animated)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.5, 0.5, 0]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )
          })}

          {/* Neural nodes */}
          {[...Array(12)].map((_, i) => {
            const cx = 50 + Math.random() * 300
            const cy = 20 + Math.random() * 100
            return (
              <motion.circle
                key={`node-${i}`}
                cx={cx}
                cy={cy}
                r="2"
                fill="url(#logo-gradient-animated)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 1, 0],
                  opacity: [0, 0.8, 0.8, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )
          })}
        </g>

        {/* Main logo group */}
        <g transform="translate(200, 70)">
          {/* Hexagon shape background */}
          <motion.path
            d="M-60,0 L-30,-52 L30,-52 L60,0 L30,52 L-30,52 Z"
            fill="none"
            stroke="url(#logo-gradient-animated)"
            strokeWidth="2"
            opacity="0.3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner hexagon */}
          <motion.path
            d="M-40,0 L-20,-35 L20,-35 L40,0 L20,35 L-20,35 Z"
            fill="url(#circuit-pattern)"
            stroke="url(#logo-gradient-animated)"
            strokeWidth="1"
            opacity="0.5"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Central AI brain icon */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          >
            {/* Brain outline */}
            <path
              d="M-20,-15 Q-25,-25 -15,-30 Q-5,-32 0,-28 Q5,-32 15,-30 Q25,-25 20,-15 Q18,-5 10,0 Q5,5 0,8 Q-5,5 -10,0 Q-18,-5 -20,-15 Z"
              fill="none"
              stroke="url(#logo-gradient-animated)"
              strokeWidth="2"
              filter="url(#logo-glow)"
            />

            {/* Neural pathways inside brain */}
            <motion.path
              d="M-10,-20 Q0,-15 10,-20 M-10,-10 Q0,-5 10,-10 M-10,0 Q0,5 10,0"
              stroke="url(#logo-gradient-animated)"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>

          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.circle
              key={`orbit-${i}`}
              r="3"
              fill="url(#logo-gradient-animated)"
              filter="url(#logo-glow)"
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [0, 50 * Math.cos(i * 2.094), 0, -50 * Math.cos(i * 2.094), 0],
                y: [0, 50 * Math.sin(i * 2.094), 0, -50 * Math.sin(i * 2.094), 0],
              }}
              transition={{
                duration: 6,
                delay: i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </g>

        {/* AgentOS Text (use viewBox units so it scales on mobile) */}
        <motion.text
          x="200"
          y="75"
          textAnchor="middle"
          fontFamily="'Space Grotesk', var(--font-inter)"
          fontSize="40" /* px in SVG space – scales with viewBox */
          fontWeight="700"
          className="select-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <tspan fill="var(--color-text-primary)">Agent</tspan>
          <tspan fill="url(#logo-gradient-animated)" filter="url(#logo-glow)">OS</tspan>
        </motion.text>

        {/* Tagline */}
        <motion.text
          x="200"
          y="125"
          textAnchor="middle"
          className="text-sm font-medium"
          fill="var(--color-text-muted)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Adaptive AI Runtime
        </motion.text>
      </svg>
    </motion.div>
  )
}