'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedAgentOSLogo() {
  const [neurons, setNeurons] = useState<Array<{ id: number, pulseDelay: number, connectionDelay: number }>>([])

  useEffect(() => {
    // Initialize neurons with different pulse delays for organic animation
    setNeurons(
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        pulseDelay: Math.random() * 2,
        connectionDelay: Math.random() * 1.5
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
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Animated gradient for neural connections */}
          <linearGradient id="neuron-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="1">
              <animate attributeName="stop-color" values="#6366F1;#8B5CF6;#EC4899;#6366F1" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1">
              <animate attributeName="stop-color" values="#8B5CF6;#EC4899;#6366F1;#8B5CF6" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#EC4899" stopOpacity="1">
              <animate attributeName="stop-color" values="#EC4899;#6366F1;#8B5CF6;#EC4899" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <radialGradient id="center-glow">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
          </radialGradient>
          <filter id="neuron-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pulse-glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer rings with gradient animation */}
        <motion.circle
          cx="100"
          cy="100"
          r="75"
          fill="none"
          stroke="url(#neuron-gradient)"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="3 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#neuron-gradient)"
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray="2 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Neural network connections - animated synapses */}
        {neurons.length > 0 && (
          <>
            {/* Connections from center to outer neurons */}
            <path d="M 100 100 L 100 40" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[0]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>
            <path d="M 100 100 L 140 65" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[1]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>
            <path d="M 100 100 L 140 135" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[2]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>
            <path d="M 100 100 L 100 160" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[3]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>
            <path d="M 100 100 L 60 135" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[4]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>
            <path d="M 100 100 L 60 65" stroke="url(#neuron-gradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-width" values="2;3;2" dur={`${2 + neurons[5]?.connectionDelay}s`} repeatCount="indefinite" />
            </path>

            {/* Outer neurons with pulsing animation */}
            <circle cx="100" cy="40" r="15" fill="#6366F1" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[0]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[0]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="65" r="15" fill="#8B5CF6" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[1]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[1]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="135" r="15" fill="#EC4899" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[2]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[2]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="160" r="15" fill="#06B6D4" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[3]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[3]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="135" r="15" fill="#8B5CF6" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[4]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[4]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="65" r="15" fill="#6366F1" opacity="0.9" filter="url(#neuron-glow)">
              <animate attributeName="r" values="15;18;15" dur={`${2 + neurons[5]?.pulseDelay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + neurons[5]?.pulseDelay}s`} repeatCount="indefinite" />
            </circle>

            {/* Signal pulses traveling along connections */}
            {neurons.map((n, i) => {
              const positions = [
                { x1: 100, y1: 100, x2: 100, y2: 40 },
                { x1: 100, y1: 100, x2: 140, y2: 65 },
                { x1: 100, y1: 100, x2: 140, y2: 135 },
                { x1: 100, y1: 100, x2: 100, y2: 160 },
                { x1: 100, y1: 100, x2: 60, y2: 135 },
                { x1: 100, y1: 100, x2: 60, y2: 65 }
              ]
              const pos = positions[i % 6]
              return (
                <circle key={`pulse-${i}`} r="3" fill="#FFF" filter="url(#pulse-glow)">
                  <animateMotion
                    dur={`${3 + n.connectionDelay}s`}
                    repeatCount="indefinite"
                    path={`M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`}
                  />
                  <animate attributeName="opacity" values="0;1;0" dur={`${3 + n.connectionDelay}s`} repeatCount="indefinite" />
                </circle>
              )
            })}
          </>
        )}

        {/* Central core neuron with enhanced glow */}
        <circle cx="100" cy="100" r="25" fill="url(#center-glow)" filter="url(#pulse-glow)">
          <animate
            attributeName="r"
            values="25;30;25"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Inner core with brain pattern */}
        <g transform="translate(100, 100)">
          {/* Hexagonal brain structure */}
          <motion.path
            d="M0 -20 L17 -10 L17 10 L0 20 L-17 10 L-17 -10 Z"
            fill="none"
            stroke="url(#neuron-gradient)"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#neuron-glow)"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '0px 0px' }}
          />
          
          {/* Central brain icon simplified */}
          <circle cx="0" cy="0" r="8" fill="#FFF" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

      </svg>
    </motion.div>
  )
}
