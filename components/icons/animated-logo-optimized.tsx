'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, memo } from 'react'

export const AnimatedAgentOSLogoOptimized = memo(function AnimatedAgentOSLogoOptimized({
  size = 120,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Simple static placeholder while loading
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="url(#static-gradient)" opacity="0.3" />
          <defs>
            <linearGradient id="static-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Vibrant radiant gradient */}
          <radialGradient id="core-radiant" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="20%" stopColor="#E879F9" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#A855F7" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.5" />
          </radialGradient>

          {/* Enhanced vibrant gradient */}
          <linearGradient id="vibrant-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="1">
              <animate attributeName="stop-color" values="#FF00FF;#00FFFF;#FFFF00;#FF00FF" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#00FFFF" stopOpacity="1">
              <animate attributeName="stop-color" values="#00FFFF;#FFFF00;#FF00FF;#00FFFF" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#FFFF00" stopOpacity="1">
              <animate attributeName="stop-color" values="#FFFF00;#FF00FF;#00FFFF;#FFFF00" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Intense glow filter */}
          <filter id="intense-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feFlood floodColor="#A855F7" floodOpacity="0.5" />
            <feComposite in2="coloredBlur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radiant burst effect */}
          <filter id="radiant-burst">
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix values="
              1.5 0 0 0 0
              0 1.5 0 0 0
              0 0 1.5 0 0
              0 0 0 1 0" />
          </filter>
        </defs>

        {/* Radiant background burst */}
        <g opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.line
              key={`ray-${i}`}
              x1="50"
              y1="50"
              x2={50 + Math.cos(i * Math.PI / 6) * 45}
              y2={50 + Math.sin(i * Math.PI / 6) * 45}
              stroke="url(#vibrant-gradient)"
              strokeWidth="0.5"
              opacity="0"
              animate={{
                opacity: [0, 0.8, 0],
                strokeWidth: [0.5, 2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </g>

        {/* Rotating hexagon frame - AgentOS signature shape */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <path
            d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z"
            fill="none"
            stroke="url(#vibrant-gradient)"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#intense-glow)"
          />
        </motion.g>

        {/* Inner rotating triangle - more geometric */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <path
            d="M50 35 L62 60 L38 60 Z"
            fill="none"
            stroke="url(#vibrant-gradient)"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </motion.g>

        {/* Central core with pulsing radiant effect */}
        <g filter="url(#radiant-burst)">
          <motion.circle
            cx="50"
            cy="50"
            r="12"
            fill="url(#core-radiant)"
            animate={{
              r: [12, 15, 12],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Inner bright core */}
          <motion.circle
            cx="50"
            cy="50"
            r="6"
            fill="#ffffff"
            opacity="0.9"
            animate={{
              r: [6, 8, 6],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </g>

        {/* Orbiting particles for added vibrancy */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          const radius = 25;
          return (
            <motion.circle
              key={`particle-${i}`}
              r="2"
              fill="url(#vibrant-gradient)"
              filter="url(#intense-glow)"
              initial={{
                x: 50 + Math.cos(angle) * radius,
                y: 50 + Math.sin(angle) * radius,
              }}
              animate={{
                x: 50 + Math.cos(angle + Math.PI * 2) * radius,
                y: 50 + Math.sin(angle + Math.PI * 2) * radius,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            >
              <animate
                attributeName="r"
                values="2;3;2"
                dur={`${1.5 + i * 0.1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${1.5 + i * 0.1}s`}
                repeatCount="indefinite"
              />
            </motion.circle>
          );
        })}

        {/* Letter "A" in center for AgentOS */}
        <text
          x="50"
          y="54"
          fontSize="14"
          fontWeight="bold"
          fill="url(#vibrant-gradient)"
          textAnchor="middle"
          className="select-none"
          style={{ fontFamily: 'var(--font-grotesk, sans-serif)' }}
        >
          A
        </text>
      </svg>
    </motion.div>
  );
});