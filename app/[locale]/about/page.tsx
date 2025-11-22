import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft, ArrowRight, Github, Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '../../../i18n';

type Props = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale: locale as Locale, namespace: 'about' });
  const title = `${t('hero.title')} — AgentOS`;
  const description = t('mission.p1');
  const canonical = locale === 'en' ? '/about' : `/${locale}/about`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `https://agentos.sh${canonical}`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function AboutPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale: locale as Locale, namespace: 'about' });
  const homeHref = locale === 'en' ? '/' : `/${locale}`;

  const heroDescription = t.rich('hero.description', {
    link: (chunks) => (
      <a
        href="https://frame.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-accent-primary underline decoration-dotted underline-offset-4"
      >
        {chunks}
      </a>
    ),
  });

  const missionHighlight = t.rich('mission.p2', {
    span: (chunks) => <span className="text-accent-primary font-semibold">{chunks}</span>,
  });

  const teamDescription = t.rich('team.description', {
    link: (chunks) => (
      <a
        href="https://frame.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-primary underline underline-offset-4"
      >
        {chunks}
      </a>
    ),
  });

  const licenseFooter = t.rich('license.footer', {
    link: (chunks) => (
      <a
        href="mailto:team@frame.dev"
        className="text-accent-primary font-semibold underline underline-offset-4"
      >
        {chunks}
      </a>
    ),
  });

  const connectLinks = [
    { label: t('connect.github'), href: 'https://github.com/framersai/agentos', icon: Github },
    { label: t('connect.linkedin'), href: 'https://www.linkedin.com/company/framersai', icon: Linkedin },
    { label: t('connect.twitter'), href: 'https://twitter.com/framersai', icon: Twitter },
    { label: t('connect.frameDev'), href: 'https://frame.dev', icon: Globe },
  ];

  const contactCards = [
    {
      title: t('team.generalInquiries'),
      description: teamDescription,
      email: 'team@frame.dev',
    },
    {
      title: t('team.enterpriseSupport'),
      description: t('team.enterpriseSupportDesc'),
      email: 'enterprise@frame.dev',
    },
    {
      title: t('team.hiring'),
      description: t('team.joinUs'),
      email: 'careers@frame.dev',
    },
  ];

  return (
    <main id="main-content" className="relative overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent-primary/10 to-transparent blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">
        {/* Hero */}
        <section className="space-y-8 text-center">
          <p className="uppercase tracking-[0.5em] text-xs text-accent-primary">
            {t('hero.weAreFramers')}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight gradient-text">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/framersai/agentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold shadow-lg shadow-accent-primary/30"
            >
              <Github className="w-4 h-4" />
              {t('cta.viewOnGithub')}
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href={homeHref as Route}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border-subtle text-[var(--color-text-primary)] font-semibold hover:border-accent-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('cta.backToHome')}
            </Link>
          </div>
        </section>

        {/* Mission */}
        <section className="rounded-[32px] border border-border-subtle/60 bg-white/70 dark:bg-white/5 p-10 space-y-6 shadow-2xl shadow-black/5">
          <h2 className="text-3xl font-bold">{t('mission.title')}</h2>
          <p className="text-lg text-[var(--color-text-secondary)]">{t('mission.p1')}</p>
          <p className="text-lg text-[var(--color-text-secondary)]">{missionHighlight}</p>
        </section>

        {/* Team & Contact */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{t('team.title')}</h2>
            <p className="text-[var(--color-text-secondary)] max-w-3xl">{teamDescription}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-border-subtle/60 bg-white/70 dark:bg-white/5 p-6 flex flex-col gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-accent-primary">{t('team.title')}</p>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-2">{card.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-2">{card.description}</p>
                </div>
                <a
                  href={`mailto:${card.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-background-secondary)] text-sm font-semibold hover:bg-[var(--color-background-tertiary)] transition-colors w-fit"
                >
                  <Mail className="w-4 h-4" />
                  {card.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Connect */}
        <section className="rounded-3xl bg-gradient-to-r from-accent-primary/10 via-transparent to-accent-secondary/10 p-8 border border-border-subtle/60">
          <h2 className="text-3xl font-bold mb-6">{t('connect.title')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {connectLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 px-5 py-4 hover:border-accent-primary transition-colors"
              >
                <Icon className="w-5 h-5 text-accent-primary" />
                <span className="text-lg font-semibold">{label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-[var(--color-text-secondary)]" />
              </a>
            ))}
          </div>
        </section>

        {/* License */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold">{t('license.title')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 p-6">
              <h3 className="text-2xl font-semibold mb-2">{t('license.core')}</h3>
              <p className="text-[var(--color-text-secondary)]">{t('license.coreDesc')}</p>
            </div>
            <div className="rounded-2xl border border-border-subtle/60 bg-white/80 dark:bg-white/5 p-6">
              <h3 className="text-2xl font-semibold mb-2">{t('license.extensions')}</h3>
              <p className="text-[var(--color-text-secondary)]">{t('license.extensionsDesc')}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{licenseFooter}</p>
        </section>
      </div>
    </main>
  );
}
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