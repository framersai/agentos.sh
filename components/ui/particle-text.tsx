'use client';

import { useEffect, useState, memo, useId } from 'react';
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
  particleCount = 20, // More particles for liquid effect
  animationDuration = 0.8
}: ParticleTextProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
  }>>([]);
  
  // Create a unique ID for the SVG filter
  const filterId = useId().replace(/:/g, "-");

  useEffect(() => {
    // Generate particles for liquid morphing effect
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 50,
      size: Math.random() * 12 + 8, // Larger for gooey effect
      delay: Math.random() * 0.3
    }));
    setParticles(newParticles);
  }, [text, particleCount]);

  return (
    <div className="relative inline-block">
      {/* SVG Filter for Liquid/Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={`liquid-${filterId}`}>
            {/* Gaussian blur to merge particles */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            {/* Color matrix for sharp edges (liquid effect) */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
              result="gooey" 
            />
            {/* Composite for final output */}
            <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
          </filter>
        </defs>
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          className="relative inline-flex items-center justify-center"
          style={{ filter: `url(#liquid-${filterId})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: animationDuration }}
        >
          {/* Liquid Morphing Particles */}
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
                    var(--color-accent-secondary) 50%,
                    transparent 70%)`,
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 20px var(--color-accent-primary)',
                }}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: [particle.x, 0, -particle.x * 0.5, 0],
                  y: [particle.y, 0, -particle.y * 0.5, 0],
                  scale: [0, 1.5, 1, 0],
                  opacity: [0, 0.8, 0.6, 0]
                }}
                transition={{
                  duration: animationDuration,
                  delay: particle.delay,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              />
            ))}
          </div>

          {/* Liquid morphing text letters */}
          <motion.span
            className={`relative z-10 inline-flex ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: animationDuration }}
          >
            {text.split('').map((letter, index) => (
              <motion.span
                key={`${text}-letter-${index}`}
                className="inline-block"
                style={{ transformOrigin: 'center' }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotateZ: (Math.random() - 0.5) * 180,
                  filter: 'blur(10px)'
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateZ: 0,
                  filter: 'blur(0px)'
                }}
                transition={{
                  duration: animationDuration * 0.8,
                  delay: index * 0.02,
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.span>

          {/* Trailing liquid effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: animationDuration * 1.5,
              ease: "easeInOut"
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={`trail-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: 'var(--color-accent-secondary)',
                  left: `${20 + i * 10}%`,
                  top: '50%',
                  filter: 'blur(4px)',
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 50, 0],
                  y: [0, (Math.random() - 0.5) * 30, 0],
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: animationDuration * 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});