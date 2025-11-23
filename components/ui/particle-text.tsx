'use client';

import { useEffect, useState, memo } from 'react';
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
  particleCount = 8, // Reduce particle count for cleaner look
  animationDuration = 0.8
}: ParticleTextProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }>>([]);
  
  useEffect(() => {
    // Generate particles for subtle accent effect (not obscuring)
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 80, // Reduced spread
      y: (Math.random() - 0.5) * 40, // Reduced vertical spread
      size: Math.random() * 4 + 2, // Smaller particles
      duration: 3 + Math.random() * 2
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
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          className="relative inline-flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationDuration }}
        >
          {/* Subtle Particles Background (behind text, not obscuring) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            {particles.map((particle) => (
              <motion.div
                key={`p-${text}-${particle.id}`}
                className="absolute rounded-full blur-sm"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: colors[particle.id % colors.length],
                  opacity: 0.3, // Much lower opacity
                }}
                initial={{
                    x: 0, 
                    y: 0,
                    scale: 0
                }}
                animate={{
                  x: [0, particle.x, particle.x * 0.5, 0],
                  y: [0, particle.y, particle.y * 0.5, 0],
                  scale: [0, 0.8, 0.6, 0],
                  opacity: [0, 0.3, 0.2, 0]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Main Text - Clear and Bold */}
          <motion.span
            className={`relative z-10 ${className}`}
            initial={{ 
                opacity: 0,
                y: 5, 
                scale: 0.95
            }}
            animate={{ 
                opacity: 1,
                y: 0, 
                scale: 1
            }}
            transition={{ 
              duration: animationDuration * 0.6, 
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {text}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});