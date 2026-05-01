import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { HeroSection } from '../../components/sections/hero-section'
import { BenchmarkBanner } from '../../components/sections/benchmark-banner'
import { DiscordCTA } from '../../components/sections/discord-cta'

// Enable static generation for faster initial loads
export const dynamicParams = false

// Animated background is purely decorative (no semantic content), so we
// keep it client-only with no SSR shell.
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  { ssr: false, loading: () => null }
)

// Three sections are kept client-only because their first render reads
// browser-only state (refs, video element, theme via next-themes) and
// would otherwise produce hydration warnings or duplicate work. Each
// gets a server-rendered SSR shell below containing the H2 and intro
// copy so search engines see the section title regardless of hydration.
const DemoVideoPlayerLazy = dynamic(
  () => import('../../components/video/DemoVideoPlayer').then(m => m.DemoVideoPlayer),
  { ssr: false, loading: () => <div className="aspect-video bg-slate-900/50 rounded-xl animate-pulse" /> }
)

const SkylineSectionLazy = dynamic(
  () => import('../../components/sections/skyline-section').then(m => m.SkylineSection),
  { ssr: false }
)

const CognitiveSectionLazy = dynamic(
  () => import('../../components/sections/cognitive-section').then(m => m.CognitiveSection),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

// Twelve below-fold sections stay `ssr: false`. We previously experimented
// with `ssr: true` to put their text content in static HTML for crawlers,
// but that flipped mobile TBT from ~1.4s to ~6.2s on desktop and dropped
// mobile perf 67 → 23. Hydrating 12 framer-motion + next-intl client
// components in series is too costly for marginal SEO gain. The SSR
// shells below (DemoVideo, Cognitive, Skyline) deliver the SEO win at a
// fraction of the hydration cost, and the converted-to-SSR-shell pattern
// is the right one to extend if we want more sections crawler-visible.
const ProductCardsLazy = dynamic(
  () => import('../../components/sections/product-cards').then(m => m.ProductCards),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> }
)

const GMISectionLazy = dynamic(
  () => import('../../components/sections/gmi-section').then(m => m.GMISection),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

const AgencySectionLazy = dynamic(
  () => import('../../components/sections/agency-section').then(m => m.AgencySection),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

const EmergentSectionLazy = dynamic(
  () => import('../../components/sections/emergent-section').then(m => m.EmergentSection),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

const CodeExamplesSectionLazy = dynamic(
  () => import('../../components/sections/code-examples-section').then(m => m.CodeExamplesSection),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> }
)

const EcosystemSectionLazy = dynamic(
  () => import('../../components/sections/ecosystem-section').then(m => m.EcosystemSection),
  { ssr: false }
)

const SocialProofSectionLazy = dynamic(
  () => import('../../components/sections/social-proof-section').then(m => m.SocialProofSection),
  { ssr: false }
)

const FeaturesGridClient = dynamic(
  () => import('../../components/sections/features-grid-client'),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

const WorkbenchCTALazy = dynamic(
  () => import('../../components/sections/workbench-cta').then(m => m.WorkbenchCTA),
  { ssr: false }
)

const ParacosmBannerLazy = dynamic(
  () => import('../../components/sections/paracosm-banner').then(m => m.ParacosmBanner),
  { ssr: false }
)

const BenchmarksSectionLazy = dynamic(
  () => import('../../components/sections/benchmarks-section').then(m => m.BenchmarksSection),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
)

const WhitepaperCTALazy = dynamic(
  () => import('../../components/sections/whitepaper-cta').then(m => m.WhitepaperCTA),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> }
)

export default function LandingPageRedesigned() {
  return (
    <>
      {/* Animated Background - deferred client-side */}
      <AnimatedBackgroundLazy />

      {/* Main Content */}
      <div>
        {/* Latest benchmark headline - dismissible per visit */}
        <BenchmarkBanner />

        {/* Hero Section - SSR enabled for faster LCP */}
        <HeroSection />

        {/* Discord CTA — official Wilds AI community for AgentOS + Paracosm support */}
        <DiscordCTA />

        {/* Paracosm — AI Agent Swarm Simulation */}
        <ParacosmBannerLazy />

        {/* Live Demo Videos with Captions — SSR shell wraps client-only video player */}
        <section className="lazy-section">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">See AgentOS in action</h2>
          <p className="text-center text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
            Watch a live AgentOS agent handle a real workload end-to-end: tool use, memory recall, multi-step planning. Every clip is captured from a running runtime, no edits.
          </p>
          <DemoVideoPlayerLazy />
        </section>

        {/* Memory Benchmarks SOTA — matched gpt-4o reader on LongMemEval-S/M */}
        <div className="lazy-section-lg">
          <BenchmarksSectionLazy />
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

        {/* Cognitive Mechanisms + HEXACO + RAG Pipeline — the section component
            owns its own badge / title / subtitle + canvas; do not wrap it in a
            second header here or the page renders two competing 'Cognitive
            Memory' titles back-to-back. */}
        <section className="lazy-section-lg">
          <CognitiveSectionLazy />
        </section>

        {/* Enhanced Features Grid with Code Popovers */}
        <div className="lazy-section-lg">
          <FeaturesGridClient />
        </div>

        {/* Enterprise-Ready Infrastructure — SSR shell around client-only skyline canvas */}
        <section className="lazy-section">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Enterprise-ready infrastructure</h2>
          <p className="text-center text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
            Self-hostable, Apache-2.0 licensed, with built-in PII redaction, prompt-injection defense, content moderation, and 21 LLM providers. Ship the same agent runtime to staging and production without vendor lock-in.
          </p>
          <SkylineSectionLazy />
        </section>

        {/* Code Examples Section */}
        <div className="lazy-section-lg">
          <CodeExamplesSectionLazy />
        </div>

        {/* Whitepaper coming-soon CTA — full architecture + benchmark methodology */}
        <div className="lazy-section">
          <WhitepaperCTALazy />
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
