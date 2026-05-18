import Script from 'next/script'

// Per-page JSON-LD for the home / index. The SoftwareApplication and
// Organization schemas (canonical entity = "Frame" publishing AgentOS) live
// in app/[locale]/layout.tsx so every page emits them; this component
// adds only the BreadcrumbList.
//
// FAQPage JSON-LD used to ship from here, but the questions it advertised
// to Google never appeared visibly on the homepage. Google calls that a
// "phantom FAQ" and can drop a site's rich-results eligibility for it.
// The /faq page emits its own FAQPage JSON-LD that matches the visible
// content (see app/[locale]/faq/page.tsx → FAQJsonLd) — that's the only
// place FAQ schema should live.
export function SchemaMarkup() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://agentos.sh/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Documentation',
        item: 'https://docs.agentos.sh/'
      }
    ]
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
      }}
    />
  )
}
