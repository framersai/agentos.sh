'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * MorphingText - Animated text that morphs between words using particle-like
 * letter animations with smooth timing and coordination
 */
export function MorphingText({
  words,
  className = '',
  interval = 3500,
  gradientFrom = 'var(--color-accent-primary)',
  gradientTo = 'var(--color-accent-secondary)',
}: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 600); // Duration of exit animation
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[currentIndex];

  // Letter animation variants
  const letterVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 20,
      scale: 0.8,
      filter: 'blur(8px)',
      transition: {
        duration: 0.3,
        delay: i * 0.03,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        delay: i * 0.04,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -15,
      scale: 0.9,
      filter: 'blur(6px)',
      transition: {
        duration: 0.25,
        delay: i * 0.02,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  return (
    <span
      className={`inline-flex relative ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="inline-flex"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentWord.split('').map((letter, i) => (
            <motion.span
              key={`${currentWord}-${i}`}
              custom={i}
              variants={letterVariants}
              style={{ display: 'inline-block' }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * ParticleMorphText - More advanced morphing with particle scatter effect
 */
interface ParticleMorphTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function ParticleMorphText({
  words,
  className = '',
  interval = 4000,
}: ParticleMorphTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; char: string }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Create scatter particles before changing word
      const chars = words[currentIndex].split('');
      const newParticles = chars.map((char) => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
        char,
      }));
      setParticles(newParticles);

      // Clear particles and change word
      setTimeout(() => {
        setParticles([]);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [words, currentIndex, interval]);

  const currentWord = words[currentIndex];

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Scattered particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={`particle-${particle.char}-${particle.x}`}
            className="absolute pointer-events-none"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: particle.x,
              y: particle.y,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              left: `${(particles.indexOf(particle) / particles.length) * 100}%`,
              background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {particle.char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Main word */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default MorphingText;

