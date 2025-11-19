import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import '../../styles/tokens.css';
import '../globals.css';
import { ThemeProvider } from '../../components/theme-provider';
import { SiteHeader } from '../../components/site-header';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import { locales, type Locale } from '../../i18n';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function resolveLocaleMetadata(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://agentos.sh'),
    alternates: {
      canonical: locale === 'en' ? 'https://agentos.sh' : `https://agentos.sh/${locale}`,
      languages: {
        'en': 'https://agentos.sh',
        'zh': 'https://agentos.sh/zh',
        'ko': 'https://agentos.sh/ko',
        'ja': 'https://agentos.sh/ja',
        'es': 'https://agentos.sh/es',
        'de': 'https://agentos.sh/de',
      },
    },
    keywords: [
      'AgentOS',
      'AI agents',
      'artificial intelligence',
      'machine learning',
      'TypeScript AI',
      'autonomous agents',
      'agent runtime',
      'AI framework',
      'adaptive intelligence',
      'emergent intelligence',
      'emergent AI',
      'agency AI',
      'multi-agent systems',
      'AI orchestration',
      'GMI roles',
      'generalised mind instances',
      'Frame.dev',
      'FramersAI',
      'voice chat assistant',
      'AI development',
      'open source AI',
      'adaptive ai intelligence',
      'enterprise AI platform',
      'RAG orchestration',
      'portable agents',
      'AI agency runtime',
      'permanent intelligence',
      'dynamic AI coordination',
      'transportable agent instances',
      'agent export markdown json'
    ],
    authors: [{ name: 'Framers', url: 'https://frame.dev' }],
    creator: 'Framers',
    publisher: 'Framers',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-128.png', sizes: '128x128', type: 'image/png' },
        { url: '/icon-256.png', sizes: '256x256', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ],
      apple: [
        { url: '/icon-256.png', sizes: '256x256', type: 'image/png' }
      ]
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: locale === 'en' ? 'https://agentos.sh' : `https://agentos.sh/${locale}`,
      siteName: 'AgentOS',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AgentOS - Adaptive AI Agent Intelligence Runtime'
        }
      ],
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      creator: '@framersai',
      site: '@framersai',
      images: ['/og-image.png']
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
    }
  };
}

export async function generateMetadata({ params: { locale } }: Props) {
  return resolveLocaleMetadata(locale as Locale);
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  if (!locales.includes(locale as Locale)) notFound();

  const tFooter = await getTranslations({ locale: locale as Locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale: locale as Locale, namespace: 'nav' });

  const messages = await getMessages();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <style dangerouslySetInnerHTML={{ __html: `
          * { box-sizing: border-box; }
          html, body { width: 100%; margin: 0; padding: 0; }
          html { height: 100%; overflow-x: hidden; }
          body { min-height: 100vh; overflow-x: hidden; background-color: #030014; color: #f5f0ff; }
          :root { background-color: #030014; }
          .skip-to-content { position: absolute; left: -9999px; z-index: 999; padding: 1rem 1.5rem; background: #6366F1; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
          .skip-to-content:focus { left: 1rem; top: 1rem; outline: 2px solid #8B5CF6; outline-offset: 2px; }
          .skeleton { position: relative; overflow: hidden; background: rgba(255,255,255,0.06); border-radius: 0.5rem; }
          .skeleton::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%); animation: skeleton-shimmer 2s ease-in-out infinite; }
          @keyframes skeleton-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        ` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__NEXT_INTL_LOCALE__ = '${locale}';` }} />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} grainy min-h-screen antialiased transition-theme bg-background-primary text-text-primary`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <a href="#main-content" className="skip-to-content">Skip to content</a>
            <SiteHeader />
            {/* JSON-LD: Organization */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'AgentOS',
                  url: 'https://agentos.sh',
                  email: 'mailto:team@frame.dev',
                  sameAs: [
                    'https://frame.dev',
                    'https://github.com/framersai',
                    'https://twitter.com/framersai',
                    'https://www.linkedin.com/company/framersai',
                    'https://vca.chat'
                  ]
                })
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'SoftwareApplication',
                  name: 'AgentOS',
                  applicationCategory: 'EnterpriseApplication',
                  operatingSystem: 'Cross-platform',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                  },
                  downloadUrl: 'https://github.com/framersai/agentos',
                  featureList: [
                    'Adaptive and emergent multi-agent orchestration',
                    'Portable intelligence exports (Markdown/JSON)',
                    'Deterministic guardrails and approvals',
                    'Streaming-first runtime with unified memory'
                  ],
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '40'
                  }
                })
              }}
            />
            <main id="main-content" tabIndex={-1} className="focus:outline-none scroll-mt-24">{children}</main>
            <ScrollToTopButton />
            <footer className="border-t border-purple-200/30 dark:border-purple-500/20 bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/30 dark:from-black/80 dark:via-purple-950/40 dark:to-pink-950/40 backdrop-blur-lg py-12">
              <div className="mx-auto w-full max-w-6xl px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">AgentOS</h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {tFooter('tagline')}
                    </p>
                    <div className="flex gap-3">
                      <a href="https://github.com/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on GitHub">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a href="https://www.linkedin.com/company/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on LinkedIn">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="https://twitter.com/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors" aria-label="FramersAI on Twitter">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        <span className="sr-only">Twitter</span>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">{tFooter('resources')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="https://docs.agentos.sh" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('docsGuides')}</a></li>
                      <li><a href="https://docs.agentos.sh/api" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('apiReferenceTSDoc')}</a></li>
                      <li><a href={locale === 'en' ? '/#code' : `/${locale}/#code`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('examples')}</a></li>
                      <li><a href="https://github.com/framersai/agentos/releases" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('releaseNotes')}</a></li>
                      <li><a href="https://github.com/framersai/agentos" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('github')}</a></li>
                      <li><a href="https://discord.gg/framersai" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('discord')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">{tFooter('company')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href={locale === 'en' ? '/about' : `/${locale}/about`} className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('about')}</a></li>
                      <li><a href={locale === 'en' ? '/faq' : `/${locale}/faq`} className="text-text-secondary hover:text-accent-primary transition-colors">{tNav('faq')}</a></li>
                      <li><a href="https://frame.dev" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">Frame.dev</a></li>
                      <li><a href="mailto:team@frame.dev" className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('contact')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">{tFooter('legal')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href={locale === 'en' ? '/legal/terms' : `/${locale}/legal/terms`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('terms')}</a></li>
                      <li><a href={locale === 'en' ? '/legal/privacy' : `/${locale}/legal/privacy`} className="text-text-secondary hover:text-accent-primary transition-colors">{tFooter('privacy')}</a></li>
                      <li><span className="text-text-secondary">{tFooter('license')}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="pt-6 border-t border-purple-200/30 dark:border-purple-500/20 text-center">
                  <p className="text-text-secondary">{tFooter('copyright', { 
                    year: new Date().getFullYear() 
                  })}</p>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

