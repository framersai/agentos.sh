'use client'

import { motion } from 'framer-motion'

const placeholderLogos = [
  { name: 'Helios Finance', description: 'Multi-market research pods (coming soon)' },
  { name: 'Northwind Labs', description: 'Product localization + CRM sync (coming soon)' },
  { name: 'Atlas Service Desk', description: 'Adaptive support routing (coming soon)' }
] as const

const updateLinks = [
  { label: 'Release notes', href: 'https://github.com/framersai/agentos/releases' },
  { label: 'Changelog', href: 'https://docs.agentos.sh/updates' },
  { label: 'FAQ', href: '/faq' }
] as const

export function SocialProofSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden section-tint" aria-labelledby="social-proof-heading">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_80%_20%,var(--color-accent-primary),transparent_55%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">Social proof</p>
          <h2 id="social-proof-heading" className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Trusted deployments (revealing soon)
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We&apos;re onboarding AI agency teams across finance, operations, and support. Logos and case studies unlock with their launches—stay tuned.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {placeholderLogos.map((item, index) => (
              <div key={item.name} className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 dark:border-white/10 p-5 backdrop-blur">
                <div className="absolute inset-0 bg-black/50 blur-lg opacity-0 pointer-events-none" aria-hidden="true" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-primary to-[color:var(--color-accent-warm)] opacity-30" />
                  <div>
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <p className="text-xs text-accent-primary">Reveal #{index + 1}</p>
                  </div>
                </div>
                <p className="text-sm text-text-muted">{item.description}</p>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-lg text-center">
                  <span className="text-sm font-semibold text-text-primary">Coming soon</span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border-subtle/70 bg-white/85 dark:bg-white/5 dark:border-white/10 p-6 shadow-sm backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-4">Latest updates</p>
            <ul className="space-y-3">
              {updateLinks.map((link) => (
                <li key={link.label} className="flex items-center justify-between">
                  <a
                    href={link.href}
                    className="text-text-primary font-semibold hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </a>
                  <span aria-hidden="true" className="text-text-muted">↗</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-dashed border-accent-primary/40 p-4 text-center">
              <p className="text-sm text-text-secondary">Want to be featured?</p>
              <a href="mailto:team@frame.dev" className="text-accent-primary font-semibold">team@frame.dev</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

