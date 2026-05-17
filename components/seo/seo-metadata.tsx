import Script from 'next/script'

// Per-page JSON-LD for the home / index. The SoftwareApplication and
// Organization schemas (canonical entity = "Frame" publishing AgentOS) live
// in app/[locale]/layout.tsx so every page emits them; this component adds
// FAQ + BreadcrumbList on the surfaces that include it.
export function SchemaMarkup() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AgentOS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AgentOS is an enterprise-grade AI agent orchestration platform that enables multi-agent collaboration with real-time streaming and persistent memory.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is AgentOS open source?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, AgentOS is fully open source under the Apache 2.0 license and available on GitHub.'
        }
      },
      {
        '@type': 'Question',
        name: 'What programming languages does AgentOS support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AgentOS is built with TypeScript and supports JavaScript/TypeScript development. It can orchestrate agents in any language through its API.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does AgentOS support GDPR workflows?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AgentOS ships PII redaction guardrails that strip personal data before it reaches LLM providers, structured audit logs for every redaction event, and self-hosted deployment so data stays on your infrastructure. The memory system supports deletion and export for data-subject access requests. GDPR compliance itself is an organizational responsibility of the deploying team, not a property of the library.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between consensus, sequential, and parallel agent execution?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Consensus execution has multiple agents vote on decisions, sequential processes tasks in order through a pipeline, and parallel executes multiple agents simultaneously for maximum throughput.'
        }
      }
    ]
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://agentos.sh'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Documentation',
        item: 'https://docs.agentos.sh'
      }
    ]
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  )
}

// Additional meta tags for comprehensive SEO
export function AdditionalMetaTags() {
  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href="https://agentos.sh" />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href="https://agentos.sh/en" />
      <link rel="alternate" hrefLang="es" href="https://agentos.sh/es" />
      <link rel="alternate" hrefLang="fr" href="https://agentos.sh/fr" />
      <link rel="alternate" hrefLang="de" href="https://agentos.sh/de" />
      <link rel="alternate" hrefLang="pt" href="https://agentos.sh/pt" />
      <link rel="alternate" hrefLang="ja" href="https://agentos.sh/ja" />
      <link rel="alternate" hrefLang="ko" href="https://agentos.sh/ko" />
      <link rel="alternate" hrefLang="zh" href="https://agentos.sh/zh" />
      <link rel="alternate" hrefLang="x-default" href="https://agentos.sh" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      {/* Additional meta tags */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

      {/* Performance hints */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    </>
  )
}