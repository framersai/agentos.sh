'use client'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - AgentOS',
  description:
    'Frequently asked questions about AgentOS — adaptive AI orchestration, personas, tools, and guardrails.',
  alternates: { canonical: 'https://agentos.sh/faq' },
  openGraph: {
    title: 'FAQ - AgentOS',
    description:
      'Frequently asked questions about AgentOS — adaptive AI orchestration, personas, tools, and guardrails.',
    url: 'https://agentos.sh/faq',
    siteName: 'AgentOS',
    images: [{ url: '/og-image.png' }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - AgentOS',
    description:
      'Frequently asked questions about AgentOS — adaptive AI orchestration, personas, tools, and guardrails.'
  },
  authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }]
}

function FAQJsonLd() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AgentOS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'AgentOS is an adaptive orchestration layer that manages tools, memory, guardrails, and multi‑agent workflows.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I build custom personas and agencies?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. Define personas, agencies, and workflows with evolution rules, guardrails, and extensions.',
        },
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function AgentOSFaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <FAQJsonLd />
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Answers about AgentOS, orchestration concepts, and how it powers the OS family.
        </p>
      </header>

      <section className="space-y-7 md:space-y-8">
        <article>
          <h2 className="text-xl md:text-2xl font-semibold">What is AgentOS?</h2>
          <p className="mt-2">
            AgentOS is a modular platform for building adaptive, policy‑aware agents with tooling, memory,
            and multi‑agent collaboration.
          </p>
        </article>
        <article>
          <h2 className="text-xl md:text-2xl font-semibold">How does it integrate with VCA?</h2>
          <p className="mt-2">
            VCA.Chat runs on AgentOS; it showcases agents, extensions, and streaming interactions.
          </p>
        </article>
      </section>

      <section className="mt-10 md:mt-14">
        <h3 className="text-lg font-semibold">See also</h3>
        <ul className="mt-3 grid gap-2 underline text-brand">
          <li><a href="https://vca.chat/faq" target="_blank" rel="noopener">VCA.Chat FAQ</a></li>
          <li><a href="https://frame.dev/faq" target="_blank" rel="noopener">Frame.dev FAQ</a></li>
          <li><a href="https://manic.agency" target="_blank" rel="noopener">Manic Agency</a></li>
          <li><a href="https://manic.agency/blog" target="_blank" rel="noopener">The Looking Glass — AI newsletter & blog</a></li>
        </ul>
      </section>
    </main>
  )
}


