'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Subsection 1 — Cognitive Memory Mechanisms (radial SVG diagram)   */
/* ------------------------------------------------------------------ */

/** Static layout for the 8 cognitive mechanism nodes arranged radially. */
const MECHANISM_ICONS = [
  '\u{1F504}', // Reconsolidation — rotate arrows
  '\u{1F6AB}', // RIF — prohibited
  '\u{26A1}',  // Involuntary Recall — lightning
  '\u{1F9E0}', // FOK — brain
  '\u{23F3}',  // Temporal Gist — hourglass
  '\u{1F9E9}', // Schema Encoding — puzzle
  '\u{1F50D}', // Source Confidence Decay — magnifying glass
  '\u{2764}',  // Emotion Regulation — heart
]

/** Edge pairs (indices into the 8-node array) showing relatedness. */
const MECHANISM_EDGES: [number, number][] = [
  [0, 4], // reconsolidation <-> temporal gist
  [0, 5], // reconsolidation <-> schema encoding
  [1, 4], // RIF <-> temporal gist
  [2, 7], // involuntary recall <-> emotion regulation
  [3, 6], // FOK <-> source confidence decay
  [5, 6], // schema encoding <-> source confidence
  [4, 7], // temporal gist <-> emotion regulation
  [1, 3], // RIF <-> FOK
]

function CognitiveDiagram({ mechanismNames }: { mechanismNames: string[] }) {
  const cx = 250
  const cy = 200
  const r = 145

  const nodes = mechanismNames.map((name, i) => {
    const angle = (i / 8) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      name,
      icon: MECHANISM_ICONS[i],
    }
  })

  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto max-w-2xl mx-auto" role="img" aria-label="Cognitive mechanisms diagram">
      <defs>
        <radialGradient id="cog-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
        </radialGradient>
        <filter id="cog-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient center glow */}
      <circle cx={cx} cy={cy} r="90" fill="url(#cog-center-glow)" />

      {/* Edges between related mechanisms */}
      {MECHANISM_EDGES.map(([a, b], i) => (
        <line
          key={`edge-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--color-accent-primary)"
          strokeWidth="1"
          strokeDasharray="4,6"
          opacity="0.25"
        />
      ))}

      {/* Node circles + labels */}
      {nodes.map((node, i) => (
        <g key={i}>
          {/* Outer ring */}
          <circle
            cx={node.x}
            cy={node.y}
            r="36"
            fill="var(--color-background-primary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Accent ring on hover via CSS */}
          <circle
            cx={node.x}
            cy={node.y}
            r="36"
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur={`${3 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Icon */}
          <text
            x={node.x}
            y={node.y - 4}
            textAnchor="middle"
            fontSize="18"
            dominantBaseline="central"
          >
            {node.icon}
          </text>
          {/* Label */}
          <text
            x={node.x}
            y={node.y + 18}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="8"
            fontWeight="600"
            className="select-none"
          >
            {node.name.length > 18 ? `${node.name.slice(0, 16)}...` : node.name}
          </text>
        </g>
      ))}

      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-accent-primary)" fontSize="11" fontWeight="700">
        Cognitive
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--color-accent-primary)" fontSize="11" fontWeight="700">
        Memory
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Subsection 2 — HEXACO Personality Radar (SVG)                     */
/* ------------------------------------------------------------------ */

function HexacoRadar({ traitNames, traitDescriptions }: { traitNames: string[]; traitDescriptions: string[] }) {
  const cx = 200
  const cy = 200
  const maxR = 140
  const levels = 4

  // Default demo values (0..1)
  const values = [0.72, 0.55, 0.81, 0.63, 0.88, 0.76]

  const pointAt = (i: number, radius: number) => {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  }

  const polygonPoints = values.map((v, i) => {
    const p = pointAt(i, v * maxR)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="HEXACO radar chart">
      <defs>
        <linearGradient id="hexaco-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Grid rings */}
      {Array.from({ length: levels }).map((_, lvl) => {
        const r = ((lvl + 1) / levels) * maxR
        const pts = Array.from({ length: 6 }).map((_, i) => {
          const p = pointAt(i, r)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon
            key={lvl}
            points={pts}
            fill="none"
            stroke="var(--color-border-primary)"
            strokeWidth="0.75"
            opacity={0.3 + lvl * 0.1}
          />
        )
      })}

      {/* Axis spokes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = pointAt(i, maxR)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-border-primary)"
            strokeWidth="0.75"
            opacity="0.3"
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#hexaco-fill)"
        stroke="var(--color-accent-primary)"
        strokeWidth="2"
        opacity="0.9"
      />

      {/* Data points */}
      {values.map((v, i) => {
        const p = pointAt(i, v * maxR)
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--color-accent-primary)"
            stroke="var(--color-background-primary)"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="4;6;4"
              dur={`${2.5 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        )
      })}

      {/* Trait labels */}
      {traitNames.map((name, i) => {
        const labelR = maxR + 28
        const p = pointAt(i, labelR)
        return (
          <g key={i}>
            <text
              x={p.x}
              y={p.y - 6}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="10"
              fontWeight="700"
            >
              {name}
            </text>
            <text
              x={p.x}
              y={p.y + 6}
              textAnchor="middle"
              fill="var(--color-text-muted)"
              fontSize="7"
              className="hidden sm:inline"
            >
              {traitDescriptions[i].length > 30
                ? `${traitDescriptions[i].slice(0, 28)}...`
                : traitDescriptions[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Subsection 3 — Multimodal RAG Pipeline                            */
/* ------------------------------------------------------------------ */

const VECTOR_BACKENDS = [
  'SQLite',
  'HNSW',
  'Postgres + pgvector',
  'Qdrant',
  'Pinecone',
  'In-Memory',
  'Neo4j',
]

function RAGPipeline({ stageNames }: { stageNames: string[] }) {
  return (
    <div className="space-y-8">
      {/* Horizontal pipeline flow */}
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center gap-0 min-w-[700px] mx-auto justify-center">
          {stageNames.map((stage, i) => (
            <div key={i} className="flex items-center">
              {/* Stage node */}
              <div
                className="flex flex-col items-center justify-center px-3 py-3 rounded-xl text-center min-w-[90px]"
                style={{
                  background: 'var(--color-background-glass)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-xs font-semibold mt-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {stage}
                </span>
              </div>
              {/* Arrow connector */}
              {i < stageNames.length - 1 && (
                <svg width="28" height="20" viewBox="0 0 28 20" className="shrink-0 mx-0.5">
                  <line x1="2" y1="10" x2="22" y2="10" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <polygon points="20,5 28,10 20,15" fill="var(--color-accent-primary)" opacity="0.7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vector store backend cards */}
      <div className="flex flex-wrap justify-center gap-2">
        {VECTOR_BACKENDS.map((backend) => (
          <span
            key={backend}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border-primary)',
              color: 'var(--color-text-primary)',
            }}
          >
            {backend}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                         */
/* ------------------------------------------------------------------ */

export function CognitiveSection() {
  const t = useTranslations('cognitive')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const mechanismNames = useMemo(() => [
    t('mechanisms.reconsolidation'),
    t('mechanisms.rif'),
    t('mechanisms.involuntaryRecall'),
    t('mechanisms.fok'),
    t('mechanisms.temporalGist'),
    t('mechanisms.schemaEncoding'),
    t('mechanisms.sourceConfidence'),
    t('mechanisms.emotionRegulation'),
  ], [t])

  const mechanismDescriptions = useMemo(() => [
    t('mechanismDescriptions.reconsolidation'),
    t('mechanismDescriptions.rif'),
    t('mechanismDescriptions.involuntaryRecall'),
    t('mechanismDescriptions.fok'),
    t('mechanismDescriptions.temporalGist'),
    t('mechanismDescriptions.schemaEncoding'),
    t('mechanismDescriptions.sourceConfidence'),
    t('mechanismDescriptions.emotionRegulation'),
  ], [t])

  const traitNames = useMemo(() => [
    t('traits.honesty'),
    t('traits.emotionality'),
    t('traits.extraversion'),
    t('traits.agreeableness'),
    t('traits.conscientiousness'),
    t('traits.openness'),
  ], [t])

  const traitDescriptions = useMemo(() => [
    t('traitDescriptions.honesty'),
    t('traitDescriptions.emotionality'),
    t('traitDescriptions.extraversion'),
    t('traitDescriptions.agreeableness'),
    t('traitDescriptions.conscientiousness'),
    t('traitDescriptions.openness'),
  ], [t])

  const pipelineStages = useMemo(() => [
    t('pipeline.ingest'),
    t('pipeline.chunk'),
    t('pipeline.embed'),
    t('pipeline.store'),
    t('pipeline.hyde'),
    t('pipeline.rerank'),
    t('pipeline.context'),
  ], [t])

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  return (
    <section
      ref={sectionRef}
      id="cognitive"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'var(--color-background-secondary)' }}
      aria-labelledby="cognitive-heading"
    >
      {/* Subtle ambient blurs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--color-accent-primary)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--color-accent-secondary)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ——— Subsection 1: Cognitive Memory Mechanisms ——— */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 id="cognitive-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="gradient-text">{t('memoryTitle')}</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {t('memorySubtitle')}
            </p>
          </div>

          <div
            className="rounded-3xl p-6 sm:p-8 shadow-sm"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            <CognitiveDiagram mechanismNames={mechanismNames} />

            {/* Mechanism description cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
              {mechanismNames.map((name, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3"
                  style={{
                    background: 'var(--color-background-glass)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                >
                  <span className="text-lg mr-2">{MECHANISM_ICONS[i]}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {name}
                  </span>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {mechanismDescriptions[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ——— Subsection 2: HEXACO Personality ——— */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t('hexacoTitle')}</span>
            </h3>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {t('hexacoSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Radar visualization */}
            <div
              className="rounded-3xl p-6 shadow-sm"
              style={{
                border: '1px solid var(--color-border-primary)',
                background: 'var(--color-background-primary)',
              }}
            >
              <HexacoRadar traitNames={traitNames} traitDescriptions={traitDescriptions} />
            </div>

            {/* Trait → Mechanism mapping */}
            <div className="space-y-3">
              {traitNames.map((name, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{
                    background: 'var(--color-background-glass)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                >
                  <div
                    className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-primary) 20%, transparent), color-mix(in srgb, var(--color-accent-secondary) 10%, transparent))',
                      color: 'var(--color-accent-primary)',
                      border: '1px solid color-mix(in srgb, var(--color-accent-primary) 30%, transparent)',
                    }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {traitDescriptions[i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ——— Subsection 3: Multimodal RAG Pipeline ——— */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.3 } } }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              <span className="gradient-text">{t('ragTitle')}</span>
            </h3>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {t('ragSubtitle')}
            </p>
          </div>

          <div
            className="rounded-3xl p-6 sm:p-8 shadow-sm"
            style={{
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-background-primary)',
            }}
          >
            <RAGPipeline stageNames={pipelineStages} />
          </div>

          {/* CTA link */}
          <div className="text-center mt-8">
            <a
              href="https://docs.agentos.sh/features/cognitive-memory"
              className="btn-primary inline-flex items-center gap-2"
            >
              {t('ctaLearnMore')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
