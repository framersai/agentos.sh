'use client'

import { motion } from 'framer-motion'
import { Github, MessageCircle, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CTASection() {
  const t = useTranslations('cta')
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden section-tint">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_15%_10%,var(--color-accent-warm-soft),transparent_60%),radial-gradient(circle_at_85%_20%,hsla(260,90%,65%,0.25),transparent_70%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 backdrop-blur-sm border border-accent-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Join the AI Revolution
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            {t('description')}
          </p>
        </motion.div>

        {/* Main CTA Card (explore only) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="surface-card p-8 md:p-12">
            <div>
              <p className="text-sm text-text-primary text-center mb-6">
                Or explore AgentOS today:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="https://vca.chat"
                  className="group flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-background-glass)] backdrop-blur-xl rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-border-interactive)] transition-all duration-[var(--duration-fast)]"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="text-sm">Try Voice Chat</span>
                </a>

                <a
                  href="https://github.com/framersai/agentos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-background-glass)] backdrop-blur-xl rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-border-interactive)] transition-all duration-[var(--duration-fast)]"
                >
                  <Github className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="text-sm">Browse Code</span>
                </a>

                <a
                  href="https://marketplace.agentos.sh"
                  className="group flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-background-glass)] backdrop-blur-xl rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-border-interactive)] transition-all duration-[var(--duration-fast)]"
                >
                  <Sparkles className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="text-sm">Marketplace</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Gradient Wave Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative h-32 overflow-hidden"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4">
                  <animate attributeName="stop-color" values="rgb(168, 85, 247); rgb(236, 72, 153); rgb(192, 132, 252); rgb(168, 85, 247)" dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3">
                  <animate attributeName="stop-color" values="rgb(236, 72, 153); rgb(192, 132, 252); rgb(168, 85, 247); rgb(236, 72, 153)" dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="rgb(192, 132, 252)" stopOpacity="0.4">
                  <animate attributeName="stop-color" values="rgb(192, 132, 252); rgb(168, 85, 247); rgb(236, 72, 153); rgb(192, 132, 252)" dur="8s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            
            {/* Flowing wave paths */}
            <path
              d="M0,40 C300,80 600,0 900,40 C1050,60 1150,40 1200,40 L1200,120 L0,120 Z"
              fill="url(#wave-gradient)"
              opacity="0.5"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,40 C300,80 600,0 900,40 C1050,60 1150,40 1200,40 L1200,120 L0,120 Z;
                  M0,60 C300,20 600,80 900,30 C1050,10 1150,50 1200,30 L1200,120 L0,120 Z;
                  M0,40 C300,80 600,0 900,40 C1050,60 1150,40 1200,40 L1200,120 L0,120 Z"
              />
            </path>
            
            <path
              d="M0,60 C300,20 600,80 900,30 C1050,10 1150,50 1200,30 L1200,120 L0,120 Z"
              fill="url(#wave-gradient)"
              opacity="0.3"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M0,60 C300,20 600,80 900,30 C1050,10 1150,50 1200,30 L1200,120 L0,120 Z;
                  M0,30 C300,70 600,10 900,60 C1050,80 1150,30 1200,50 L1200,120 L0,120 Z;
                  M0,60 C300,20 600,80 900,30 C1050,10 1150,50 1200,30 L1200,120 L0,120 Z"
              />
            </path>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}