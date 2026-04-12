import Link from 'next/link';
import type { Route } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllPosts } from '@/lib/markdown';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import type { Locale } from '../../../i18n';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata' });
  const canonical = locale === 'en' ? '/blog' : `/${locale}/blog`;

  return {
    title: 'Blog - AgentOS',
    description: 'Technical articles, framework comparisons, tutorials, and engineering insights from the AgentOS team. Learn how to build production AI agents with TypeScript.',
    alternates: { canonical },
    openGraph: {
      title: 'Blog - AgentOS',
      description: 'Technical articles, framework comparisons, tutorials, and engineering insights from the AgentOS team.',
      url: `https://agentos.sh${canonical}`,
      siteName: 'AgentOS',
      images: [{ url: '/og-image.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Blog - AgentOS',
      description: 'Technical articles, framework comparisons, and tutorials for building AI agents with TypeScript.',
    },
  };
}

const categoryColors: Record<string, string> = {
  Engineering: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Announcements: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Comparison: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Tutorial: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

export default async function BlogPage({ params: { locale } }: Props) {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="relative overflow-x-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agentos.sh' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://agentos.sh${locale === 'en' ? '/blog' : `/${locale}/blog`}` },
            ],
          }),
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--color-text-primary)]">Blog</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Technical articles, framework comparisons, and tutorials for building production AI agents with TypeScript.
          </p>
        </header>

        <div className="space-y-8">
          {posts.map((post) => {
            const href = locale === 'en' ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;
            const colorClass = categoryColors[post.category || ''] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400';

            return (
              <article key={post.slug} className="group">
                <Link href={href as Route} className="block p-6 sm:p-8 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card,var(--color-background-elevated))] hover:border-[var(--color-accent-primary)]/40 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    {post.category && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                        <Tag className="w-3 h-3" aria-hidden="true" />
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-primary)] group-hover:gap-2 transition-all">
                    Read article
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-muted)] text-lg">No posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
