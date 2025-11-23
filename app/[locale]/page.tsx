import { useTranslations } from 'next-intl'
import { ProductCardsRedesigned } from '../../components/sections/product-cards-redesigned'
import { SkylineSection } from '../../components/sections/skyline-section'
import { CTASection } from '../../components/sections/cta-section'
import dynamic from 'next/dynamic'
import { HolographicVideoPlayer } from '../../components/media/holographic-video-player'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import { HeroSectionRedesigned } from '../../components/sections/hero-section-redesigned'
import {
  Globe,
  Package,
  Database,
  Terminal,
  Users
} from 'lucide-react'

// Enable static generation for faster initial loads
export const dynamicParams = false
export const revalidate = 3600 // Revalidate every hour

// Lazy load the animated background - client-only, deferred
const AnimatedBackgroundLazy = dynamic(
  () => import('../../components/ui/animated-background').then(m => m.AnimatedBackground),
  {
    ssr: false,
    loading: () => null
  }
)

// Lazy load heavy interactive sections
const GMISectionLazy = dynamic(
  () => import('../../components/sections/gmi-section').then((m) => ({
    default: m.GMISection
  })),
  { ssr: true }
)

const CodeExamplesSectionLazy = dynamic(
  () => import('../../components/sections/code-examples-section').then((m) => ({
    default: m.CodeExamplesSection
  })),
  { ssr: true }
)

const EcosystemSectionLazy = dynamic(
  () => import('../../components/sections/ecosystem-section').then((m) => ({
    default: m.EcosystemSection
  })),
  { ssr: true }
)

const SocialProofSectionLazy = dynamic(
  () => import('../../components/sections/social-proof-section').then((m) => ({
    default: m.SocialProofSection
  })),
  { ssr: true }
)

const FeaturesGridClient = dynamic(
  () => import('../../components/sections/features-grid-client'),
  { ssr: false }
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
        <HeroSectionRedesigned />

      {/* Product Demo Video */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
              Product Demo
            </h2>
            <p className="text-sm text-muted max-w-2xl mx-auto">
              See AgentOS orchestrate complex workflows in real-time.
            </p>
          </div>
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

        {/* Enhanced Features Grid with Code Popovers - Statically rendered */}
        <FeaturesGridClient featureCards={featureCards} />

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
    </>
  )
}