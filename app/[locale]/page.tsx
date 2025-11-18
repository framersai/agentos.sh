'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { HeroSection } from '../../components/sections/hero-section'
import { GMISection } from '../../components/sections/gmi-section'
import { CodeExamplesSection } from '../../components/sections/code-examples-section'
import { EcosystemSection } from '../../components/sections/ecosystem-section'
import { CTASection } from '../../components/sections/cta-section'
import { SocialProofSection } from '../../components/sections/social-proof-section'
import { CoordinationPatternsSection } from '../../components/sections/coordination-patterns-section'
import dynamic from 'next/dynamic'
import { MediaShowcase } from '../../components/media/media-showcase'
import { MarketplacePreview } from '../../components/marketplace/marketplace-preview'
import { RealStats } from '../../components/real-stats'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import { LazyMotion, domAnimation, motion } from 'framer-motion'
import { Globe, Package, Database, Terminal, Users } from 'lucide-react'

const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false }
)
const FloatingElementsLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.FloatingElements),
  { ssr: false }
)

export default function LandingPage() {
  const t = useTranslations('features')
  const tCommon = useTranslations()
  const tMarketplace = useTranslations('marketplace')
  const tCaseStudies = useTranslations('caseStudies')
  
  // Enhanced feature cards with translations
  const featureCards = [
    {
      icon: Users,
      title: t('multiAgent.title'),
      body: t('multiAgent.description'),
      pill: t('multiAgent.pill'),
      gradient: 'from-violet-500 to-purple-500',
      layout: 'horizontal',
      span: 'lg:col-span-2',
      bullets: [t('multiAgent.bullet1'), t('multiAgent.bullet2')]
    },
    {
      icon: Package,
      title: t('toolPacks.title'),
      body: t('toolPacks.description'),
      pill: t('toolPacks.pill'),
      gradient: 'from-blue-500 to-cyan-500',
      layout: 'vertical',
      bullets: [t('toolPacks.bullet1'), t('toolPacks.bullet2')]
    },
    {
      icon: Globe,
      title: t('language.title'),
      body: t('language.description'),
      pill: t('language.pill'),
      gradient: 'from-purple-500 to-pink-500',
      layout: 'vertical',
      bullets: [t('language.bullet1'), t('language.bullet2')]
    },
    {
      icon: Database,
      title: t('storage.title'),
      body: t('storage.description'),
      pill: t('storage.pill'),
      gradient: 'from-green-500 to-emerald-500',
      layout: 'horizontal',
      span: 'lg:col-span-2',
      bullets: [t('storage.bullet1'), t('storage.bullet2')]
    },
    {
      icon: Terminal,
      title: t('workbench.title'),
      body: t('workbench.description'),
      pill: t('workbench.pill'),
      gradient: 'from-orange-500 to-red-500',
      layout: 'vertical',
      bullets: [t('workbench.bullet1'), t('workbench.bullet2'), t('workbench.bullet3')]
    }
  ]
  return (
    <LazyMotion features={domAnimation}>
      {/* Animated Background (mount after idle) */}
      <DeferredAnimatedBackground />

      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        {tCommon('skipToMain')}
      </a>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section with new design */}
        <HeroSection />

        {/* GMI Section with architecture diagrams */}
        <GMISection />

        {/* Features Grid */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 section-tint relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl mb-6 section-title">Enterprise‑Ready Features</h2>
              <p className="text-lg text-text-muted max-w-3xl mx-auto">
                Production-grade infrastructure for building, deploying, and scaling AI agents
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
              {featureCards.map((card, index) => {
                const Icon = card.icon
                const isHorizontal = card.layout === 'horizontal'
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`group surface-card h-full ${card.span ?? ''} ${isHorizontal ? 'p-8 md:flex md:items-center md:gap-6' : 'p-8 flex flex-col gap-4'}`}
                  >
                    <div className={`flex ${isHorizontal ? 'items-center gap-6 w-full' : 'items-start gap-4'}`}>
                      <div className={`shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                        <Icon className="w-7 h-7 drop-shadow" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 text-xs font-semibold text-accent-primary">
                          {card.pill}
                        </span>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {card.body}
                        </p>
                        {card.bullets && (
                          <ul className="space-y-1.5 text-sm text-text-secondary">
                            {card.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>


        <SocialProofSection />

        {/* Coordination Patterns Section */}
        <CoordinationPatternsSection />

        {/* Code Examples Section */}
        <CodeExamplesSection />


        {/* Marketplace Preview - Coming Soon */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 backdrop-blur-md bg-background-primary/60 z-10 flex items-center justify-center rounded-3xl">
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl section-title">{tMarketplace('comingSoon')}</h3>
                <p className="text-lg text-gray-700 dark:text-text-secondary max-w-2xl mx-auto">
                  {tMarketplace('description')}
                </p>
              </div>
            </div>
            <div className="blur-sm opacity-30">
              <MarketplacePreview />
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <EcosystemSection />

        {/* Case Studies - Coming Soon */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 backdrop-blur-sm bg-background-primary/50 z-10 flex items-center justify-center rounded-3xl">
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl section-title">{tCaseStudies('comingSoon')}</h3>
                <p className="text-lg text-gray-700 dark:text-text-secondary">
                  {tCaseStudies('description')}
                </p>
              </div>
            </div>
            <div className="blur-md opacity-20">
              <MediaShowcase />
            </div>
          </div>
        </section>

        {/* Real Stats Section */}
        <RealStats />

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
    const mount = () => setShowBg(true)
    if ('requestIdleCallback' in window) {
      const w = window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }
      w.requestIdleCallback(mount, { timeout: 1200 })
    } else {
      const t = setTimeout(mount, 600)
      return () => clearTimeout(t)
    }
  }, [])
  if (!showBg) return null
  return (
    <>
      <AnimatedBackgroundLazy />
      <FloatingElementsLazy />
    </>
  )
}