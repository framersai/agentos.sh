'use client'

import { motion } from 'framer-motion'
import { Code2, type LucideIcon } from 'lucide-react'
import { CodePopover } from '../ui/code-popover'

interface FeatureCard {
  icon: LucideIcon
  title: string
  body: string
  pill: string
  gradient: string
  layout: string
  span?: string
  bullets?: string[]
  codeExample: {
    title: string
    language: string
    code: string
  }
}

interface FeaturesGridClientProps {
  featureCards: FeatureCard[]
}

export default function FeaturesGridClient({ featureCards }: FeaturesGridClientProps) {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 holographic-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl mb-6 font-bold gradient-text">
            Developer-First Platform
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Building blocks that seamlessly connect to create your AI ecosystem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon
            const isHorizontal = card.layout === 'horizontal'
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group relative h-full ${card.span ?? ''} ${
                  isHorizontal ? 'md:col-span-2' : ''
                }`}
                style={{ willChange: 'transform' }}
              >
                {/* Puzzle piece card with notch design */}
                <div 
                  className={`holographic-card h-full p-8 flex flex-col gap-4 relative overflow-visible
                    before:absolute before:top-[20%] before:-right-[2px] before:w-[20px] before:h-[40px]
                    before:bg-transparent before:rounded-l-full
                    before:shadow-[-8px_0_0_0_var(--glass-surface)]
                    after:absolute after:top-[20%] after:-left-[2px] after:w-[20px] after:h-[40px]
                    after:bg-[var(--color-background-primary)] after:rounded-r-full
                    after:shadow-[8px_0_0_0_var(--glass-surface)]
                    ${isHorizontal ? 'md:col-span-2' : ''}
                  `}
                  style={{
                    clipPath: index % 2 === 0 
                      ? 'polygon(0 0, calc(100% - 15px) 0, 100% 20%, 100% 100%, 0 100%)'
                      : 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 20%)'
                  }}
                >
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-7 h-7 drop-shadow" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-primary)]/10 text-xs font-semibold text-[var(--color-accent-primary)]">
                          {card.pill}
                        </span>
                        <CodePopover
                          examples={[card.codeExample]}
                          trigger={
                            <button 
                              className="p-1 rounded-lg hover:bg-[var(--color-accent-primary)]/10 transition-colors"
                              aria-label={`View code example for ${card.title}`}
                            >
                              <Code2 className="w-4 h-4 text-[var(--color-accent-primary)]" />
                            </button>
                          }
                          position="bottom"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] text-sm">
                        {card.body}
                      </p>
                      {card.bullets && (
                        <ul className="space-y-1.5 text-sm">
                          {card.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2 text-[var(--color-text-primary)]">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-primary)]" aria-hidden="true" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

