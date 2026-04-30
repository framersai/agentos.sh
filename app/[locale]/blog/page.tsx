import Link from 'next/link';
import type { Route } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';
import { DiscordCTA } from '@/components/sections/discord-cta';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const path = '/blog';
  const url = canonical(locale, path);

  return {
    title: 'Blog — AgentOS',
    description: 'Technical articles, framework comparisons, tutorials, and engineering insights from the AgentOS team. Learn how to build production AI agents with TypeScript.',
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: 'Blog — AgentOS',
      description: 'Technical articles, framework comparisons, tutorials, and engineering insights from the AgentOS team.',
      url,
      siteName: 'AgentOS',
      images: [{ url: '/og-image.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: 'Blog — AgentOS',
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

  // Posts marked `featured: true` in frontmatter render at the top in a
  // larger hero grid. Editorial control: bump the field per-post when
  // we want a piece of writing elevated above the chronological list.
  const featuredPosts = posts.filter((p) => p.featured === true);
  const standardPosts = posts.filter((p) => p.featured !== true);

  return (
    <main id="main-content" className="relative overflow-x-clip bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--color-text-primary)]">Blog</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Technical articles, framework comparisons, and tutorials for building production AI agents with TypeScript.
          </p>
        </header>

        <DiscordCTA variant="section" className="mb-12" />

        {featuredPosts.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden
                className="block h-[2px] w-10 rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(180, 95%, 60%), hsl(270, 85%, 65%))' }}
              />
              <h2 id="featured-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Featured
              </h2>
            </div>
            <div className={`grid gap-6 ${featuredPosts.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {featuredPosts.map((post) => {
                const href = `/${locale}/blog/${post.slug}`;
                const colorClass = categoryColors[post.category || ''] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
                return (
                  <article key={post.slug} className="group">
                    <Link
                      href={href as Route}
                      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card,var(--color-background-elevated))] transition-all hover:border-[var(--color-text-link)]/40 hover:shadow-xl"
                    >
                      {post.image && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-background-tertiary)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            aria-hidden
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(180deg, transparent 50%, hsla(220, 30%, 8%, 0.45))',
                            }}
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <div className="mb-3 flex items-center gap-3 text-sm">
                          {post.category && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                              <Tag className="h-3 w-3" aria-hidden="true" />
                              {post.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-text-link)] sm:text-3xl">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mb-5 line-clamp-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-link)] transition-all group-hover:gap-3">
                          Read article
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {standardPosts.length > 0 && (
          <section aria-labelledby="all-posts-heading">
            {featuredPosts.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[2px] w-10 rounded-full bg-[var(--color-border-primary)]"
                />
                <h2 id="all-posts-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  All posts
                </h2>
              </div>
            )}
            <div className="space-y-6 max-w-4xl mx-auto">
              {standardPosts.map((post) => {
                const href = `/${locale}/blog/${post.slug}`;
                const colorClass = categoryColors[post.category || ''] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
                return (
                  <article key={post.slug} className="group">
                    <Link
                      href={href as Route}
                      className="block rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card,var(--color-background-elevated))] p-6 transition-all hover:border-[var(--color-text-link)]/40 hover:shadow-lg sm:p-8"
                    >
                      <div className="mb-3 flex items-center gap-3 text-sm">
                        {post.category && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            {post.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-text-link)] sm:text-2xl">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mb-4 leading-relaxed text-[var(--color-text-secondary)]">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-text-link)] transition-all group-hover:gap-2">
                        Read article
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-muted)] text-lg">No posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
