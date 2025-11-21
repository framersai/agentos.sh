'use client';

import { motion } from 'framer-motion';

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top,
              hsl(250 60% 95%) 0%,
              hsl(240 40% 97%) 50%,
              hsl(0 0% 100%) 100%)`
          }}
        />
      </div>

      {/* Skeleton content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Logo skeleton pulse */}
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 mb-8"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Title skeleton */}
        <div className="space-y-4 mb-8">
          <motion.div
            className="h-12 sm:h-16 w-full max-w-2xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-transparent rounded-lg"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          <motion.div
            className="h-8 sm:h-10 w-full max-w-xl bg-gradient-to-r from-[var(--color-accent-secondary)]/10 to-transparent rounded-lg"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </div>

        {/* Subtitle skeleton */}
        <div className="space-y-2 mb-12">
          <motion.div
            className="h-4 w-full max-w-lg bg-[var(--color-text-muted)]/10 rounded"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
          <motion.div
            className="h-4 w-full max-w-md bg-[var(--color-text-muted)]/10 rounded"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </div>

        {/* Button skeletons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <motion.div
            className="h-12 w-40 bg-[var(--color-accent-primary)]/20 rounded-lg"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="h-12 w-40 bg-[var(--color-border-interactive)]/20 rounded-lg"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          />
        </div>

        {/* Feature cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-32 bg-[var(--color-background-secondary)]/50 rounded-lg border border-[var(--color-border-subtle)]/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7 + i * 0.1
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">Loading AgentOS...</span>
      </div>
    </div>
  );
}