'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleTextProps {
  text: string;
  className?: string;
  particleCount?: number;
  animationDuration?: number;
}

export const ParticleText = memo(function ParticleText({
  text,
  className = "",
  particleCount = 30,
  animationDuration = 0.8
}: ParticleTextProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate particles when text changes
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 50,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 0.3
    }));
    setParticles(newParticles);
  }, [text, particleCount]);

  return (
  <div className={`relative inline-block`} ref={containerRef}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationDuration }}
        >
          {/* Particle explosion effect on entry */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={`${text}-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: `radial-gradient(circle,
                    var(--color-accent-primary) 0%,
                    transparent 70%)`,
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 4px var(--color-accent-primary)',
                }}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: [0, 1.5, 1],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: animationDuration,
                  delay: particle.delay,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              />
            ))}
          </div>

          {/* Main text with particle formation animation */}
          <motion.span
            className={`relative ${className}`}
            initial={{
              filter: 'blur(20px)',
              opacity: 0
            }}
            animate={{
              filter: 'blur(0px)',
              opacity: 1
            }}
            transition={{
              duration: animationDuration * 0.7,
              ease: "easeOut"
            }}
          >
            {/* Letter-by-letter particle formation */}
            {text.split('').map((letter, index) => (
              <motion.span
                key={`${text}-letter-${index}`}
                className="inline-block"
                style={{
                  transformOrigin: 'center',
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotateZ: (Math.random() - 0.5) * 90,
                  y: (Math.random() - 0.5) * 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateZ: 0,
                  y: 0,
                }}
                transition={{
                  duration: animationDuration * 0.6,
                  delay: index * 0.03,
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.span>

          {/* Trailing particle effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: animationDuration * 1.5,
              ease: "easeInOut"
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={`trail-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 2,
                  height: 2,
                  background: 'var(--color-accent-secondary)',
                  left: `${10 + i * 10}%`,
                  top: '50%',
                  filter: 'blur(1px)',
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 30, 0],
                  y: [0, (Math.random() - 0.5) * 20, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: animationDuration * 1.2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.span>
      </AnimatePresence>
    </div>
  );
});