import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { getPostBySlug, getPostSlugs } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { Comments } from '@/components/blog/Comments';
import { BlogPostHero } from '@/components/blog/BlogPostHero';
import { Calendar, ArrowLeft, Tag, User } from 'lucide-react';
import { locales } from '../../../../i18n';

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return locales.flatMap((locale) =>
    slugs.map((file) => ({
      locale,
      slug: file.replace(/\.md$/, ''),
    }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const post = getPostBySlug(slug);
  if (!post) return {};

  const canonical = locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return {
    title: `${post.title} - AgentOS Blog`,
    description: post.excerpt || post.title,
    keywords: post.keywords || '',
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://agentos.sh${canonical}`,
      siteName: 'AgentOS',
      images: post.image ? [{ url: post.image }] : [{ url: '/og-image.png' }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'AgentOS Team'],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.title,
      description: post.excerpt || post.title,
    },
  };
}

export default function BlogPostPage({ params: { locale, slug } }: Props) {
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const blogHref = `/${locale}/blog`;
  const canonical = `/${locale}/blog/${slug}`;

  return (
    <main id="main-content" className="relative overflow-x-clip bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.title,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Organization',
              name: post.author || 'AgentOS Team',
              url: 'https://agentos.sh',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Manic Agency LLC',
              url: 'https://manic.agency',
              logo: { '@type': 'ImageObject', url: 'https://agentos.sh/og-image.png' },
            },
            mainEntityOfPage: `https://agentos.sh${canonical}`,
            image: post.image ? `https://agentos.sh${post.image}` : 'https://agentos.sh/og-image.png',
          }),
        }}
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agentos.sh' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://agentos.sh${blogHref}` },
              { '@type': 'ListItem', position: 3, name: post.title, item: `https://agentos.sh${canonical}` },
            ],
          }),
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Back link */}
        <Link
          href={blogHref as Route}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-link)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to blog
        </Link>

        <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-x-12">
          <div className="min-w-0 max-w-3xl">
            {/* Post header */}
            <header className="mb-10">
              {/* Eyebrow row: thin gradient accent + meta items separated by tiny dot bullets */}
              <div className="flex items-center gap-3 mb-5 text-xs">
                <span
                  aria-hidden
                  className="block h-[2px] w-8 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, hsl(180, 95%, 60%), hsl(270, 85%, 65%))',
                  }}
                />
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-[var(--color-text-link)]/10 text-[var(--color-text-link)] border border-[var(--color-text-link)]/30">
                    <Tag className="w-3 h-3" aria-hidden="true" />
                    {post.category}
                  </span>
                )}
                <span className="text-[var(--color-text-muted)]/40">·</span>
                <span className="flex items-center gap-1.5 text-[var(--color-text-muted)] tabular-nums">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                {post.author && (
                  <>
                    <span className="text-[var(--color-text-muted)]/40">·</span>
                    <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <User className="w-3 h-3" aria-hidden="true" />
                      {post.author}
                    </span>
                  </>
                )}
              </div>

              {/* Title — refined typography, tighter line height and letter-spacing for premium feel */}
              <h1 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.1]">
                {post.title}
              </h1>

              {/* Dek / lead paragraph: left-border accent, slightly muted, smaller than the body */}
              {post.excerpt && (
                <div
                  className="mt-6 pl-5 border-l-2 text-[15px] sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl"
                  style={{
                    borderImage:
                      'linear-gradient(180deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%) 1',
                  }}
                >
                  {post.excerpt}
                </div>
              )}
            </header>

            {/* Hero metrics block (renders only when frontmatter has heroStat + heroLabel) */}
            <BlogPostHero post={post} />

            {/* Inline TOC for mobile (lg:hidden); the sticky right-rail
                takes over at lg+ breakpoints and is rendered below the
                article column inside the same grid */}
            <TableOfContents content={post.content} placement="inline" />

            {/* Post content */}
            <MarkdownRenderer content={post.content} />

            {/* Comments (giscus when configured, friendly stub otherwise) */}
            <Comments slug={slug} />


            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-[var(--color-border-subtle)]">
              <Link
                href={blogHref as Route}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-link)] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to all articles
              </Link>
            </footer>
          </div>

          {/* Sticky right-rail table of contents (lg+ only) */}
          <TableOfContents content={post.content} />
        </div>
      </div>
    </main>
  );
}
