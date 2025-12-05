import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import { HeroSection } from '../../components/sections/hero-section'
import { useTranslations } from 'next-intl'

// Enable static generation for faster initial loads
export const dynamicParams = false
export const revalidate = 3600 // Revalidate every hour

// Lazy load the animated background - client-only, deferred
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false, loading: () => null }
)

// Lazy load below-the-fold sections for better LCP
const HolographicVideoPlayerLazy = dynamic(
  () => import('../../components/media/holographic-video-player').then(m => m.HolographicVideoPlayer),
  { ssr: false, loading: () => <div className="aspect-video bg-slate-900/50 rounded-xl animate-pulse" /> }
)

const ProductCardsLazy = dynamic(
  () => import('../../components/sections/product-cards-redesigned').then(m => m.ProductCardsRedesigned),
  { ssr: true }
)

const SkylineSectionLazy = dynamic(
  () => import('../../components/sections/skyline-section').then(m => m.SkylineSection),
  { ssr: false }
)

const GMISectionLazy = dynamic(
  () => import('../../components/sections/gmi-section').then(m => m.GMISection),
  { ssr: true }
)

const CodeExamplesSectionLazy = dynamic(
  () => import('../../components/sections/code-examples-section').then(m => m.CodeExamplesSection),
  { ssr: true }
)

const EcosystemSectionLazy = dynamic(
  () => import('../../components/sections/ecosystem-section').then(m => m.EcosystemSection),
  { ssr: true }
)

const SocialProofSectionLazy = dynamic(
  () => import('../../components/sections/social-proof-section').then(m => m.SocialProofSection),
  { ssr: true }
)

const FeaturesGridClient = dynamic(
  () => import('../../components/sections/features-grid-client'),
  { ssr: false }
)

export default function LandingPageRedesigned() {
  const tCommon = useTranslations()

  return (
    <>
      {/* Animated Background - deferred client-side */}
      <AnimatedBackgroundLazy />

      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        {tCommon('skipToMain')}
      </a>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section - SSR enabled for faster LCP */}
        <HeroSection />

      {/* Product Demo Video */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative"
        aria-labelledby="demo-heading"
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h2 id="demo-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
              Product Demo
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] max-w-2xl mx-auto">
              See AgentOS orchestrate complex workflows in real-time.
            </p>
          </header>
          <HolographicVideoPlayerLazy 
            placeholder={true}
            title="AgentOS Architecture Demo"
            description="Visualizing high-throughput multi-agent coordination."
          />
        </div>
      </section>

        {/* Product Cards Section */}
        <ProductCardsLazy />

        {/* Multi-Agent Collaboration Section (Commented out as per request) */}
        {/* <MultiAgentCollaborationSection /> */}

        {/* GMI Section with architecture diagrams */}
        <GMISectionLazy />

        {/* Enhanced Features Grid with Code Popovers */}
        <FeaturesGridClient />

        {/* Skyline Section */}
        <SkylineSectionLazy />

        {/* Code Examples Section */}
        <CodeExamplesSectionLazy />

        {/* Social Proof Section */}
        <SocialProofSectionLazy />

        {/* Ecosystem Section */}
        <EcosystemSectionLazy />

        {/* Enterprise Edition Info */}
        <section 
          className="py-16 px-4 sm:px-6 lg:px-8 relative"
          aria-labelledby="enterprise-heading"
        >
          <article className="max-w-6xl mx-auto holographic-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <header>
                <h2 id="enterprise-heading" className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                  AgentOS Enterprise Edition
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Additional robustness for CI/CD and automated deployments, self‑hosting, advanced PII/anon controls,
                  evaluations/telemetry, and first‑class local model hosting. Contact{' '}
                  <a className="underline text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors" href="mailto:team@frame.dev">team@frame.dev</a> or visit{' '}
                  <a className="underline text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors" href="https://frame.dev" target="_blank" rel="noreferrer">Frame.dev</a>.
                </p>
              </header>
              <div>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]" role="list">
                  <li>• Automated self‑hosted deployments with CI/CD pipelines</li>
                  <li>• Enhanced PII handling, anonymization plugins, audit trails</li>
                  <li>• Advanced evaluation and telemetry for production workloads</li>
                  <li>• Optimized on‑prem/local model serving with GPU orchestration</li>
                  <li>• SDKs and integrations for fine‑tuning and model ingestion</li>
                  <li>• SSO/Auth and subscriptions/payments integrations</li>
                </ul>
              </div>
            </div>
          </article>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </>
  )
}