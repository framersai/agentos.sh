'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react'
import { FrameWordmark } from '../../../components/branding/FrameWordmark'
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <FrameWordmark className="mx-auto" size="lg" />
            <motion.div
              className="mt-2 text-sm lowercase text-text-muted italic"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('hero.weAreFramers')}
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl mb-6 section-title"
          >
            {t('hero.title')}
          </motion.h1>
          
            <p className="text-xl text-text-secondary leading-relaxed">
              {t.rich('hero.description', {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                link: (chunk) => <Link href="https://frame.dev" className="text-accent-primary hover:underline font-semibold">{chunk}</Link>
              })}
            </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('mission.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-text-secondary mb-4 leading-relaxed">
              {t('mission.p1')}
            </p>
            <p className="text-lg text-gray-700 dark:text-text-secondary leading-relaxed">
              {t.rich('mission.p2', {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                span: (chunk) => <span className="font-semibold text-purple-600 dark:text-accent-primary"> OpenStrand</span>
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl mb-6 section-title">{t('team.title')}</h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t.rich('team.description', {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                link: (chunk) => <Link href="https://frame.dev" className="text-accent-primary hover:underline font-semibold">{chunk}</Link>
              })}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="surface-card p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('team.generalInquiries')}</h3>
              <a 
                href="mailto:team@frame.dev" 
                className="flex items-center gap-3 text-accent-primary hover:underline font-medium"
              >
                <Mail className="w-5 h-5" />
                team@frame.dev
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="surface-card p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('team.enterpriseSupport')}</h3>
              <a 
                href="mailto:team@frame.dev" 
                className="flex items-center gap-3 text-accent-primary hover:underline font-medium"
              >
                <Mail className="w-5 h-5" />
                team@frame.dev
              </a>
              <p className="text-sm text-text-muted mt-2">
                {t('team.enterpriseSupportDesc')}
              </p>
            </motion.div>
          </div>

          {/* Join Us CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link 
              href="/careers"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 text-accent-primary font-bold hover:bg-accent-primary/20 transition-all group"
            >
              {t('team.hiring')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <p className="text-sm text-muted mt-3">
              {t('team.joinUs')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('connect.title')}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://github.com/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Github className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('connect.github')}</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">@framersai</div>
              </a>

              <a
                href="https://www.linkedin.com/company/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Linkedin className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('connect.linkedin')}</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">FramersAI</div>
              </a>

              <a
                href="https://twitter.com/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Twitter className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('connect.twitter')}</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">@framersai</div>
              </a>

              <a
                href="https://frame.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('connect.frameDev')}</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">{t('connect.ourCompany')}</div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* License Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-morphism rounded-2xl p-8 border border-purple-200/30 dark:border-purple-500/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('license.title')}</h2>
            <div className="space-y-4 text-gray-700 dark:text-text-secondary">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{t('license.core')}</h3>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono text-sm">
                    Apache 2.0
                  </span>
                  {t('license.coreDesc')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{t('license.extensions')}</h3>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono text-sm">
                    MIT
                  </span>
                  {t('license.extensionsDesc')}
                </p>
              </div>
              <p className="text-sm mt-6">
                {t.rich('license.footer', {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  link: (chunk) => <a href="mailto:team@frame.dev" className="text-purple-600 dark:text-accent-primary hover:underline font-semibold">team@frame.dev</a>
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('cta.title')}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/framersai/agentos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all border border-purple-500/20"
              >
                <Github className="w-5 h-5" />
                {t('cta.viewOnGithub')}
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 glass-morphism rounded-xl font-semibold text-gray-700 dark:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all border border-purple-200/30 dark:border-purple-500/20"
              >
                {t('cta.backToHome')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}