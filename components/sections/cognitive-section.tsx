'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '../ui/section-label'

/* ------------------------------------------------------------------ */
/*  Custom SVG icon components (stroke-based line art, 24x24 viewBox)  */
/* ------------------------------------------------------------------ */

/**
 * Reconsolidation icon: two circular arrows forming a continuous loop,
 * representing the rewriting of memories upon recall.
 */
function IconReconsolidation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 7.07 2.93" />
      <path d="M19.07 4.93l-2.12.5.5-2.12" />
      <path d="M22 12a10 10 0 0 1-2.93 7.07" />
      <path d="M19.07 19.07l-.5-2.12 2.12.5" />
      <path d="M12 22a10 10 0 0 1-7.07-2.93" />
      <path d="M4.93 19.07l2.12-.5-.5 2.12" />
      <path d="M2 12A10 10 0 0 1 4.93 4.93" />
      <path d="M4.93 4.93l.5 2.12-2.12-.5" />
    </svg>
  )
}

/**
 * Retrieval-Induced Forgetting icon: a funnel shape with items
 * dropping out through the bottom, representing suppression
 * of competing memories during retrieval.
 */
function IconRIF({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16l-5 7v5l-2 3v-8L8 4" />
      <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="18" cy="19" r="0.8" fill="currentColor" stroke="none" opacity="0.35" />
      <circle cx="14.5" cy="18.5" r="0.6" fill="currentColor" stroke="none" opacity="0.2" />
      <line x1="15" y1="14" x2="17" y2="15" opacity="0.4" />
      <line x1="16.5" y1="16.5" x2="18.5" y2="18" opacity="0.3" />
    </svg>
  )
}

/**
 * Involuntary Recall icon: a lightning bolt striking a thought bubble,
 * representing spontaneous memory activation by contextual cues.
 */
function IconInvoluntaryRecall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h-4l-1 5h3l-2 7 6-8h-3.5L15 3z" />
      <path d="M6 14c-2.5 0-4 1.5-4 3.5S3.5 21 6 21h2c1 0 1.5-.5 1.5-.5" />
      <circle cx="4.5" cy="12.5" r="1" />
      <circle cx="3" cy="11" r="0.6" />
    </svg>
  )
}

/**
 * Feeling of Knowing icon: a question mark with a subtle glow/halo,
 * representing the metacognitive sense of a retrievable answer.
 */
function IconFOK({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" opacity="0.2" strokeDasharray="2,3" />
      <circle cx="12" cy="12" r="6" opacity="0.12" strokeDasharray="1.5,2" />
      <path d="M9.5 9a3 3 0 0 1 5.2-1.5c.8 1 .6 2.3-.3 3.2L12 12.5v1.5" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Temporal Gist icon: an hourglass with content dissolving from sharp
 * particles at top into abstract blurred shapes at bottom, representing
 * how specific details fade while meaning is preserved.
 */
function IconTemporalGist({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2h10M7 22h10" />
      <path d="M8 2v4c0 2 4 4 4 4s4-2 4-4V2" />
      <path d="M8 22v-4c0-2 4-4 4-4s4 2 4 4v4" />
      {/* Sharp detail particles at top */}
      <rect x="10" y="4" width="1" height="1" fill="currentColor" stroke="none" opacity="0.6" />
      <rect x="12.5" y="4.5" width="0.8" height="0.8" fill="currentColor" stroke="none" opacity="0.5" />
      {/* Fuzzy blobs at bottom — gist preserved */}
      <circle cx="11" cy="19" r="1.2" fill="currentColor" stroke="none" opacity="0.15" />
      <circle cx="13" cy="18.5" r="1" fill="currentColor" stroke="none" opacity="0.12" />
    </svg>
  )
}

/**
 * Schema Encoding icon: a grid/lattice structure with a highlighted
 * new node being integrated, representing how new information is
 * encoded relative to existing knowledge structures.
 */
function IconSchemaEncoding({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Lattice edges */}
      <line x1="6" y1="6" x2="12" y2="4" />
      <line x1="12" y1="4" x2="18" y2="6" />
      <line x1="6" y1="6" x2="6" y2="14" />
      <line x1="18" y1="6" x2="18" y2="14" />
      <line x1="6" y1="14" x2="12" y2="16" />
      <line x1="12" y1="16" x2="18" y2="14" />
      <line x1="12" y1="4" x2="12" y2="16" />
      {/* Existing lattice nodes */}
      <circle cx="6" cy="6" r="2" fill="var(--color-background-primary)" />
      <circle cx="18" cy="6" r="2" fill="var(--color-background-primary)" />
      <circle cx="6" cy="14" r="2" fill="var(--color-background-primary)" />
      <circle cx="18" cy="14" r="2" fill="var(--color-background-primary)" />
      <circle cx="12" cy="4" r="2" fill="var(--color-background-primary)" />
      <circle cx="12" cy="16" r="2" fill="var(--color-background-primary)" />
      {/* New node being integrated — highlighted */}
      <line x1="12" y1="16" x2="12" y2="21" strokeDasharray="2,2" opacity="0.5" />
      <circle cx="12" cy="21" r="2" fill="currentColor" opacity="0.25" strokeWidth="2" />
    </svg>
  )
}

/**
 * Source Confidence Decay icon: a document with a fading stamp/seal,
 * representing how certainty about information provenance decays
 * faster than the information itself.
 */
function IconSourceConfidence({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Document */}
      <path d="M6 3h8l4 4v14H6V3z" />
      <path d="M14 3v4h4" />
      {/* Text lines */}
      <line x1="8" y1="10" x2="16" y2="10" opacity="0.4" />
      <line x1="8" y1="13" x2="14" y2="13" opacity="0.4" />
      {/* Fading circular seal/stamp */}
      <circle cx="14" cy="17" r="3" opacity="0.3" strokeDasharray="1.5,1.5" />
      <path d="M13 17l1 1 2-2" opacity="0.25" />
    </svg>
  )
}

/**
 * Emotion Regulation icon: a wave/oscillation being dampened,
 * representing how emotional valence of memories is modulated
 * and smoothed over time.
 */
function IconEmotionRegulation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* High-amplitude wave (raw emotion) */}
      <path d="M2 12c1-4 2.5-8 4-8s2.5 8 4 8 2.5-8 4-8" opacity="0.3" />
      {/* Dampened wave (regulated) */}
      <path d="M14 12c1-2 2-4 3-4s2 4 3 4 1.5-2 2-2" strokeWidth="2" />
      {/* Dampening arrow */}
      <line x1="11" y1="6" x2="14" y2="9" opacity="0.5" />
      <path d="M13 6l1 3-3-1" opacity="0.5" fill="none" />
    </svg>
  )
}

/** Map mechanism index to its custom SVG icon component. */
const MECHANISM_ICONS = [
  IconReconsolidation,
  IconRIF,
  IconInvoluntaryRecall,
  IconFOK,
  IconTemporalGist,
  IconSchemaEncoding,
  IconSourceConfidence,
  IconEmotionRegulation,
]

/** Translation keys for each mechanism (order matches MECHANISM_ICONS). */
const MECHANISM_KEYS = [
  'reconsolidation',
  'rif',
  'involuntaryRecall',
  'fok',
  'temporalGist',
  'schemaEncoding',
  'sourceConfidence',
  'emotionRegulation',
] as const

/* ------------------------------------------------------------------ */
/*  Ebbinghaus Forgetting Curve — animated SVG                         */
/* ------------------------------------------------------------------ */

/**
 * Classic Ebbinghaus forgetting curve rendered as an animated SVG.
 * Uses stroke-dashoffset for a line-drawing reveal effect on mount.
 * X-axis = time (1h, 1d, 1w, 1mo), Y-axis = retention %.
 */
function EbbinghausCurve({ annotation }: { annotation: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div className="mt-16">
      <svg
        ref={ref}
        viewBox="0 0 500 220"
        className="w-full h-auto max-w-2xl mx-auto"
        role="img"
        aria-label="Ebbinghaus forgetting curve"
      >
        <defs>
          <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" />
          </linearGradient>
          <linearGradient id="curve-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = 190 - (pct / 100) * 160
          return (
            <g key={`grid-${pct}`}>
              <line
                x1="60" y1={y} x2="470" y2={y}
                stroke="var(--color-border-primary)" strokeWidth="0.5" opacity="0.3"
              />
              <text
                x="52" y={y + 4}
                textAnchor="end" fill="var(--color-text-muted)"
                fontSize="9" fontFamily="inherit"
              >
                {pct}%
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {[
          { x: 80, label: '1h' },
          { x: 180, label: '1d' },
          { x: 320, label: '1w' },
          { x: 450, label: '1mo' },
        ].map(({ x, label }) => (
          <text
            key={label} x={x} y={208}
            textAnchor="middle" fill="var(--color-text-muted)"
            fontSize="9" fontFamily="inherit"
          >
            {label}
          </text>
        ))}

        {/* Axis lines */}
        <line x1="60" y1="30" x2="60" y2="190" stroke="var(--color-border-primary)" strokeWidth="1" />
        <line x1="60" y1="190" x2="470" y2="190" stroke="var(--color-border-primary)" strokeWidth="1" />

        {/* Filled area under curve */}
        <path
          d="M80,38 C100,70 130,130 180,150 C230,162 280,170 320,175 C380,180 430,183 450,184 L450,190 L80,190 Z"
          fill="url(#curve-fill)"
          opacity={isInView ? 1 : 0}
          style={{ transition: 'opacity 1s ease-out 0.5s' }}
        />

        {/* Main forgetting curve */}
        <path
          d="M80,38 C100,70 130,130 180,150 C230,162 280,170 320,175 C380,180 430,183 450,184"
          fill="none"
          stroke="url(#curve-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="600"
          strokeDashoffset={isInView ? 0 : 600}
          style={{ transition: 'stroke-dashoffset 1.8s ease-out' }}
        />

        {/* Key data points */}
        {[
          { x: 80, y: 38, label: '100%' },
          { x: 180, y: 150, label: '20%' },
          { x: 320, y: 175, label: '~12%' },
          { x: 450, y: 184, label: '~8%' },
        ].map(({ x, y, label }, i) => (
          <g key={`pt-${i}`} opacity={isInView ? 1 : 0} style={{ transition: `opacity 0.4s ease-out ${0.8 + i * 0.3}s` }}>
            <circle cx={x} cy={y} r="4" fill="var(--color-accent-primary)" />
            <circle cx={x} cy={y} r="7" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1" opacity="0.3" />
            <text
              x={x} y={y - 12}
              textAnchor="middle" fill="var(--color-accent-primary)"
              fontSize="9" fontWeight="600" fontFamily="inherit"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text x="260" y="220" textAnchor="middle" fill="var(--color-text-muted)" fontSize="10" fontFamily="inherit">
          Time
        </text>
        <text
          x="14" y="110"
          textAnchor="middle" fill="var(--color-text-muted)"
          fontSize="10" fontFamily="inherit"
          transform="rotate(-90,14,110)"
        >
          Retention
        </text>
      </svg>

      {/* Annotation text */}
      <p
        className="text-sm text-center max-w-2xl mx-auto mt-4 leading-relaxed"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {annotation}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */

/**
 * **Cognitive Memory Section**
 *
 * Showcases the 8 neuroscience-backed memory mechanisms built into AgentOS,
 * each modulated by HEXACO personality traits. Features:
 *
 * - Badge + title/subtitle header
 * - 4x2 grid of mechanism cards with custom SVG line-art icons
 * - HEXACO modulator badges on each card
 * - Expandable cards revealing research basis and APA citations
 * - Animated Ebbinghaus forgetting curve with retention annotations
 * - Full theme-aware styling using CSS custom properties
 */
export function CognitiveSection() {
  const t = useTranslations('cognitive')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  /** Toggle a card's expanded state. */
  const toggleCard = (index: number) => {
    setExpandedCard((prev) => (prev === index ? null : index))
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.07 },
    }),
  }

  return (
    <section
      ref={sectionRef}
      id="cognitive"
      className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme section-gradient"
      aria-labelledby="cognitive-heading"
    >
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ---- Header ---- */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <SectionLabel icon={
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M7 1a6 6 0 1 1 0 12A6 6 0 0 1 7 1" />
              <path d="M4.5 7c.5-2 1.5-3 2.5-3s2 1 2.5 3-1 3-2.5 3S4 9 4.5 7" />
            </svg>
          }>
            {t('badge')}
          </SectionLabel>
          <h2
            id="cognitive-heading"
            className="text-4xl sm:text-5xl font-extrabold mt-4 mb-4"
          >
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ---- 4x2 Mechanism Cards Grid ---- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MECHANISM_KEYS.map((key, i) => {
            const Icon = MECHANISM_ICONS[i]
            const isExpanded = expandedCard === i

            return (
              <motion.div
                key={key}
                custom={i}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                <button
                  onClick={() => toggleCard(i)}
                  className="w-full text-left rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
                  style={{
                    background: isExpanded
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-primary) 8%, var(--color-background-secondary)), var(--color-background-secondary))'
                      : 'var(--color-background-secondary)',
                    border: `1px solid ${isExpanded ? 'color-mix(in srgb, var(--color-accent-primary) 30%, transparent)' : 'var(--color-border-primary)'}`,
                    boxShadow: isExpanded ? '0 4px 20px color-mix(in srgb, var(--color-accent-primary) 10%, transparent)' : 'none',
                  }}
                  aria-expanded={isExpanded}
                >
                  {/* Icon + Title row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-primary) 15%, transparent), color-mix(in srgb, var(--color-accent-secondary) 8%, transparent))',
                        border: '1px solid color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' } as React.CSSProperties} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-bold leading-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {t(`mechanisms.${key}`)}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t(`mechanismDescriptions.${key}`)}
                  </p>

                  {/* HEXACO modulator badge */}
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      background: 'color-mix(in srgb, var(--color-accent-primary) 10%, transparent)',
                      color: 'var(--color-accent-primary)',
                      border: '1px solid color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
                    }}
                  >
                    <svg viewBox="0 0 10 10" fill="currentColor" className="w-2 h-2" aria-hidden="true">
                      <polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8,10 5,8.5 2,10 2.5,6.5 0,4 3.5,3.5" />
                    </svg>
                    {t(`modulators.${key}`)}
                  </span>

                  {/* Expanded detail (research basis + citation) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 pt-3"
                          style={{ borderTop: '1px solid var(--color-border-primary)' }}
                        >
                          <p
                            className="text-xs leading-relaxed mb-2"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {t(`research.${key}`)}
                          </p>
                          <p
                            className="text-[10px] italic"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {t(`citations.${key}`)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* ---- Ebbinghaus Forgetting Curve ---- */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.4 } } }}
        >
          <EbbinghausCurve annotation={t('ebbinghausAnnotation')} />
        </motion.div>

        {/* ---- CTA ---- */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.55 } } }}
          className="text-center mt-10"
        >
          <a
            href="https://docs.agentos.sh/features/cognitive-memory"
            className="btn-primary inline-flex items-center gap-2"
          >
            {t('ctaLearnMore')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  )
}
