'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ProductCardsRedesigned } from '../../components/sections/product-cards-redesigned'
import { SkylineSection } from '../../components/sections/skyline-section'
import { CodePopover } from '../../components/ui/code-popover'
import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { HolographicVideoPlayer } from '../../components/media/holographic-video-player'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import { LazyMotion, domAnimation, motion } from 'framer-motion'
import {
  Globe,
  Package,
  Database,
  Terminal,
  Users,
  Code2
} from 'lucide-react'

// Lazy load the animated background with improved loading
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  {
    ssr: false,
    loading: () => null // No loading placeholder for background
  }
)

// Import PageSkeleton for loading state
const PageSkeletonLazy = dynamic(
  () => import('../../components/ui/page-skeleton').then(m => m.PageSkeleton),
  { ssr: false }
)

const HeroSectionRedesignedLazy = dynamic(
  () => import('../../components/sections/hero-section-redesigned').then(m => m.HeroSectionRedesigned),
  {
    loading: () => <PageSkeletonLazy />,
    ssr: false // Disable SSR for faster interaction
  }
)

// const MultiAgentCollaborationSection = dynamic(
//   () =>
//     import('../../components/sections/multi-agent-collaboration').then((m) => ({
//       default: m.MultiAgentCollaboration
//     })),
//   { loading: () => <SectionSkeleton heightClass="h-[520px]" /> }
// )

const GMISectionLazy = dynamic(
  () =>
    import('../../components/sections/gmi-section').then((m) => ({
      default: m.GMISection
    })),
  { loading: () => <SectionSkeleton heightClass="h-[620px]" /> }
)

const CodeExamplesSectionLazy = dynamic(
  () =>
    import('../../components/sections/code-examples-section').then((m) => ({
      default: m.CodeExamplesSection
    })),
  { loading: () => <SectionSkeleton heightClass="h-[540px]" /> }
)

const EcosystemSectionLazy = dynamic(
  () =>
    import('../../components/sections/ecosystem-section').then((m) => ({
      default: m.EcosystemSection
    })),
  { loading: () => <SectionSkeleton heightClass="h-[480px]" /> }
)

const SocialProofSectionLazy = dynamic(
  () =>
    import('../../components/sections/social-proof-section').then((m) => ({
      default: m.SocialProofSection
    })),
  { loading: () => <SectionSkeleton heightClass="h-[420px]" /> }
)

export default function LandingPageRedesigned() {
  const t = useTranslations('features')
  const tCommon = useTranslations()

  // Enhanced feature cards with code popovers
  const featureCards = [
    {
      icon: Users,
      title: t('multiAgent.title'),
      body: t('multiAgent.description'),
      pill: t('multiAgent.pill'),
      gradient: 'from-violet-500 to-purple-500',
      layout: 'horizontal',
      span: 'lg:col-span-2',
      bullets: [t('multiAgent.bullet1'), t('multiAgent.bullet2')],
      codeExample: {
        title: 'Multi-Agent Setup',
        language: 'typescript',
        code: `const agency = new AgentOS.Agency({
  agents: [
    { role: 'researcher', model: 'gpt-4' },
    { role: 'analyst', model: 'claude-3' },
    { role: 'executor', model: 'llama-3' }
  ],
  orchestration: 'parallel'
});`
      }
    },
    {
      icon: Package,
      title: t('toolPacks.title'),
      body: t('toolPacks.description'),
      pill: t('toolPacks.pill'),
      gradient: 'from-blue-500 to-cyan-500',
      layout: 'vertical',
      bullets: [t('toolPacks.bullet1'), t('toolPacks.bullet2')],
      codeExample: {
        title: 'Tool Pack Integration',
        language: 'typescript',
        code: `import { WebScraper, DataAnalyzer } from '@agentos/tools';

agent.use(WebScraper, {
  timeout: 5000,
  maxRetries: 3
});`
      }
    },
    {
      icon: Globe,
      title: t('language.title'),
      body: t('language.description'),
      pill: t('language.pill'),
      gradient: 'from-purple-500 to-pink-500',
      layout: 'vertical',
      bullets: [t('language.bullet1'), t('language.bullet2')],
      codeExample: {
        title: 'Language Support',
        language: 'typescript',
        code: `// Supports 50+ languages
const response = await agent.chat({
  message: userInput,
  language: 'ja', // Japanese
  context: { cultural: true }
});`
      }
    },
    {
      icon: Database,
      title: t('storage.title'),
      body: t('storage.description'),
      pill: t('storage.pill'),
      gradient: 'from-green-500 to-emerald-500',
      layout: 'horizontal',
      span: 'lg:col-span-2',
      bullets: [t('storage.bullet1'), t('storage.bullet2')],
      codeExample: {
        title: 'Memory Fabric',
        language: 'typescript',
        code: `const memory = new MemoryFabric({
  vector: PineconeDB,
  episodic: Redis,
  working: InMemory,
  sync: true
});`
      }
    },
    {
      icon: Terminal,
      title: t('workbench.title'),
      body: t('workbench.description'),
      pill: t('workbench.pill'),
      gradient: 'from-orange-500 to-red-500',
      layout: 'vertical',
      bullets: [t('workbench.bullet1'), t('workbench.bullet2'), t('workbench.bullet3')],
      codeExample: {
        title: 'Dev Workbench',
        language: 'bash',
        code: `# Start development environment
agentos dev --port 3000

# Deploy to production
agentos deploy --env production`
      }
    }
  ]

  return (
    <LazyMotion features={domAnimation}>
      {/* Animated Background */}
      <DeferredAnimatedBackground />

      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        {tCommon('skipToMain')}
      </a>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section with Redesigned Components */}
        <HeroSectionRedesignedLazy />

      {/* Product Demo Video */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
              Product Demo
            </h2>
            <p className="text-sm text-muted max-w-2xl mx-auto">
              See AgentOS orchestrate complex workflows in real-time.
            </p>
          </motion.div>
          <HolographicVideoPlayer 
            placeholder={true}
            title="AgentOS Architecture Demo"
            description="Visualizing high-throughput multi-agent coordination."
          />
        </div>
      </section>

        {/* Product Cards Section */}
        <ProductCardsRedesigned />

        {/* Multi-Agent Collaboration Section (Commented out as per request) */}
        {/* <MultiAgentCollaborationSection /> */}

        {/* GMI Section with architecture diagrams */}
        <GMISectionLazy />

        {/* Enhanced Features Grid with Code Popovers - Puzzle Piece Design */}
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
                    initial={{ 
                      opacity: 0, 
                      y: -50, 
                      rotate: Math.random() * 20 - 10,
                      scale: 0.8
                    }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      rotate: 0,
                      scale: 1
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      delay: index * 0.15,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{
                      scale: 1.05,
                      zIndex: 10,
                      transition: { duration: 0.2 }
                    }}
                    className={`group relative h-full ${card.span ?? ''} ${
                      isHorizontal ? 'md:col-span-2' : ''
                    }`}
                    style={{
                      perspective: '1000px'
                    }}
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
                                <button className="p-1 rounded-lg hover:bg-[var(--color-accent-primary)]/10 transition-colors">
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

        {/* Skyline Section */}
        <SkylineSection />

        {/* Code Examples Section */}
        <CodeExamplesSectionLazy />

        {/* Social Proof Section */}
        <SocialProofSectionLazy />

        {/* Ecosystem Section */}
        <EcosystemSectionLazy />

        {/* Enterprise Edition Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto holographic-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                  AgentOS Enterprise Edition
                </h3>
                <p className="text-sm text-muted">
                  Additional robustness for CI/CD and automated deployments, self‑hosting, advanced PII/anon controls,
                  evaluations/telemetry, and first‑class local model hosting. Contact{' '}
                  <a className="underline hover:text-accent-primary" href="mailto:team@frame.dev">team@frame.dev</a> or visit{' '}
                  <a className="underline hover:text-accent-primary" href="https://frame.dev" target="_blank" rel="noreferrer">Frame.dev</a>.
                </p>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li>• Automated self‑hosted deployments with CI/CD pipelines</li>
                  <li>• Enhanced PII handling, anonymization plugins, audit trails</li>
                  <li>• Advanced evaluation and telemetry for production workloads</li>
                  <li>• Optimized on‑prem/local model serving with GPU orchestration</li>
                  <li>• SDKs and integrations for fine‑tuning and model ingestion</li>
                  <li>• SSO/Auth and subscriptions/payments integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </LazyMotion>
  )
}

function DeferredAnimatedBackground() {
  const [showBg, setShowBg] = useState(false)

  useEffect(() => {
    // Load background immediately after first paint
    const mount = () => setShowBg(true)

    // Use requestAnimationFrame for immediate loading after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(mount) // Double RAF ensures paint has occurred
    })
  }, [])

  if (!showBg) return null

  return <AnimatedBackgroundLazy />
}

function SectionSkeleton({ heightClass = 'h-[320px]' }: { heightClass?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton border border-border-subtle/40 rounded-3xl w-full ${heightClass}`}
    />
  )
}