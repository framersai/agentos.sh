import { Metadata } from 'next';
import { Handshake, Cpu, Rocket, ArrowRight } from 'lucide-react';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

type Props = { params: { locale: string } };

const TITLE = 'Partners & Sponsors — AgentOS';
const DESCRIPTION =
  'Partner with AgentOS: sponsor development, ship your model as a featured provider, or bring your startup and credit programs to an open-source agent runtime running in production.';

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const path = '/partners';
  const url = canonical(locale, path);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: 'AgentOS',
      images: [{ url: '/og-image-v2.png' }],
      type: 'website',
    },
  };
}

const WAYS_TO_ENGAGE = [
  {
    icon: Handshake,
    title: 'Sponsor',
    body: 'Fund maintenance, releases, benchmarks, and new features. Sponsors get clearly-labeled, featured placement in the README and docs, sized by tier, plus release-notes credit.',
    href: 'https://github.com/framerslab/agentos/blob/master/SPONSORS.md',
    cta: 'Sponsorship details',
  },
  {
    icon: Cpu,
    title: 'Provider integration',
    body: 'Ship your model, inference platform, or API as a first-class provider. Integration is free and on technical merit; partners and sponsors can be featured prominently, including a spot near the top of the provider list and in examples.',
    href: 'https://docs.agentos.sh/contributing/new-provider',
    cta: 'Provider guide',
  },
  {
    icon: Rocket,
    title: 'Startup & credit programs',
    body: 'Run a startup, accelerator, or cloud or model-credit program? AgentOS and its sister platforms (paracosm.agentos.sh, wilds.ai) run real production workloads, and we credit the services that power them.',
    href: 'mailto:team@frame.dev',
    cta: 'Talk to us',
  },
];

const PARTNERS = [
  {
    name: 'Deepgram',
    kind: 'Startup Program',
    body: 'Speech-to-text and text-to-speech credits plus go-to-market support, powering the AgentOS voice pipeline.',
    href: 'https://deepgram.com/startups',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background-primary)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Partners &amp; Sponsors
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            AgentOS is Apache-2.0 and free, funded by{' '}
            <a href="https://frame.dev" className="text-accent-primary hover:underline">
              Frame
            </a>{' '}
            and the companies that build with it. There are three ways to work with us.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-20">
          {WAYS_TO_ENGAGE.map((way) => {
            const Icon = way.icon;
            return (
              <a
                key={way.title}
                href={way.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group holographic-card p-6 sm:p-8 transition-all duration-300 hover:border-accent-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <Icon className="w-8 h-8 mb-4 text-accent-primary" aria-hidden="true" />
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                  {way.title}
                </h2>
                <p className="text-sm text-muted mb-4">{way.body}</p>
                <span className="inline-flex items-center text-sm font-semibold text-accent-primary">
                  {way.cta} <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Current partners</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Every partner placement is labeled as such. Material connections (credits, discounts, or in-kind support) are disclosed wherever a partner appears.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 mb-20">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group holographic-card p-6 sm:p-8 transition-all duration-300 hover:border-accent-primary/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold group-hover:text-accent-primary transition-colors">
                  {partner.name}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-primary border border-accent-primary/40 rounded-full px-3 py-1">
                  {partner.kind}
                </span>
              </div>
              <p className="text-sm text-muted">{partner.body}</p>
            </a>
          ))}
        </div>

        <div className="text-center holographic-card p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Partner with us</h2>
          <p className="text-muted mb-6 max-w-xl mx-auto">
            Tell us what you have in mind. We reply to every serious inquiry.
          </p>
          <a
            href="mailto:team@frame.dev"
            className="inline-flex items-center text-lg font-semibold text-accent-primary hover:underline"
          >
            team@frame.dev <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
