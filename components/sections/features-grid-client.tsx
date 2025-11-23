'use client'

import { motion } from 'framer-motion'
import { Code2, Globe, Package, Database, Terminal, Users, type LucideIcon } from 'lucide-react'
import { CodePopover } from '../ui/code-popover'
import { useTranslations } from 'next-intl'

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

export default function FeaturesGridClient() {
  const t = useTranslations('features')
  
  const featureCards: FeatureCard[] = [
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

