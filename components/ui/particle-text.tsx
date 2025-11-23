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
  particleCount = 15, // Reduced slightly for better performance with filter
  animationDuration = 0.8
}: ParticleTextProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }>>([]);
  
  // Create a unique ID for the filter to avoid conflicts if multiple instances exist
  const filterId = useId().replace(/:/g, "-");

  useEffect(() => {
    // Generate particles for liquid effect
    // We create them centered and move them outward/around
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100, // Relative % position
      y: (Math.random() - 0.5) * 60,
      size: Math.random() * 12 + 6, // Larger particles for gooey effect
      duration: 2 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [text, particleCount]);

  const colors = [
    'var(--color-accent-primary)',
    'var(--color-accent-secondary)',
    'var(--color-accent-tertiary)'
  ];

  return (
    <div className="relative inline-block">
      {/* SVG Filter for Gooey/Liquid Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id={`goo-${filterId}`}>
            {/* Blur to merge elements */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            {/* Contrast to sharpen edges and create liquid connection */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          className="relative inline-flex items-center justify-center"
          style={{ filter: `url(#goo-${filterId})` }} // Apply the gooey filter
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: animationDuration }}
        >
          {/* Liquid Particles Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            {particles.map((particle) => (
              <motion.div
                key={`p-${text}-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: colors[particle.id % colors.length],
                  opacity: 0.7,
                }}
                initial={{
                    x: 0, 
                    y: 0,
                    scale: 0
                }}
                animate={{
                  x: [0, particle.x, particle.x * 0.5, 0],
                  y: [0, particle.y, particle.y * 0.5, 0],
                  scale: [0, 1, 0.8, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 1
                }}
              />
            ))}
          </div>

          {/* Main Text */}
          <motion.span
            className={`relative z-10 ${className}`}
            initial={{ 
                y: 10, 
                filter: 'blur(8px)',
                scale: 0.9
            }}
            animate={{ 
                y: 0, 
                filter: 'blur(0px)',
                scale: 1
            }}
            transition={{ 
              duration: animationDuration, 
              type: "spring", 
              bounce: 0.3 
            }}
          >
            {text}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
