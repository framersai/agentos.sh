import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { HeroSection } from '../../components/sections/hero-section'

// Enable static generation for faster initial loads
export const dynamicParams = false

// Lazy load the animated background - client-only, deferred
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false, loading: () => null }
)

// Demo Video Player with captions - lazy loaded for better LCP
const DemoVideoPlayerLazy = dynamic(
  () => import('../../components/video/DemoVideoPlayer').then(m => m.DemoVideoPlayer),
  { ssr: false, loading: () => <div className="aspect-video bg-slate-900/50 rounded-xl animate-pulse" /> }
)

const ProductCardsLazy = dynamic(
  () => import('../../components/sections/product-cards').then(m => m.ProductCards),
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

const AgencySectionLazy = dynamic(
  () => import('../../components/sections/agency-section').then(m => m.AgencySection),
  { ssr: true }
)

const EmergentSectionLazy = dynamic(
  () => import('../../components/sections/emergent-section').then(m => m.EmergentSection),
  { ssr: true }
)

const CognitiveSectionLazy = dynamic(
  () => import('../../components/sections/cognitive-section').then(m => m.CognitiveSection),
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

const WorkbenchCTALazy = dynamic(
  () => import('../../components/sections/workbench-cta').then(m => m.WorkbenchCTA),
  { ssr: false }
)

export default function LandingPageRedesigned() {
  return (
    <>
      {/* Animated Background - deferred client-side */}
      <AnimatedBackgroundLazy />

      {/* Main Content */}
      <div>
        {/* Hero Section - SSR enabled for faster LCP */}
        <HeroSection />

        {/* Live Demo Videos with Captions */}
        <div className="lazy-section">
          <DemoVideoPlayerLazy />
        </div>

        {/* AgentOS Workbench CTA */}
        <div className="lazy-section-sm">
          <WorkbenchCTALazy />
        </div>

        {/* Product Cards Section */}
        <div className="lazy-section">
          <ProductCardsLazy />
        </div>

        {/* GMI Section with architecture diagrams */}
        <div className="lazy-section-lg">
          <GMISectionLazy />
        </div>

        {/* Parallel Agency — 6 multi-agent orchestration strategies */}
        <div className="lazy-section-lg">
          <AgencySectionLazy />
        </div>

        {/* Emergent Capabilities — runtime tool forging, agent synthesis, self-improvement */}
        <div className="lazy-section-lg">
          <EmergentSectionLazy />
        </div>

        {/* Cognitive Mechanisms + HEXACO + RAG Pipeline */}
        <div className="lazy-section-lg">
          <CognitiveSectionLazy />
        </div>

        {/* Enhanced Features Grid with Code Popovers */}
        <div className="lazy-section-lg">
          <FeaturesGridClient />
        </div>

        {/* Enterprise-Ready Infrastructure — skyline visualization */}
        <div className="lazy-section">
          <SkylineSectionLazy />
        </div>

        {/* Code Examples Section */}
        <div className="lazy-section-lg">
          <CodeExamplesSectionLazy />
        </div>

        {/* Social Proof Section */}
        <div className="lazy-section">
          <SocialProofSectionLazy />
        </div>

        {/* Ecosystem Section */}
        <div className="lazy-section">
          <EcosystemSectionLazy />
        </div>

        {/* CTA Section */}
        <div className="lazy-section-sm">
          <CTASection />
        </div>
      </div>
    </>
  )
}
