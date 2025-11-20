import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AgentOS Blog - News & Insights',
    description: 'Latest news, updates, and insights about AgentOS, AI agents, and multi-agent orchestration.',
    openGraph: {
      title: 'AgentOS Blog',
      description: 'Latest news, updates, and insights about AgentOS, AI agents, and multi-agent orchestration.',
      type: 'website',
    },
  };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background-primary)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            News & Insights
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Updates from the AgentOS team on the future of adaptive AI, multi-agent systems, and open source development.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block h-full"
            >
              <div className="holographic-card h-full overflow-hidden flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
                {post.image && (
                  <div className="relative h-48 overflow-hidden border-b border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    {/* Placeholder for actual image rendering */}
                    <div className="w-full h-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                       <span className="text-4xl opacity-20">AgentOS</span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                      {post.category || 'Update'}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-accent-primary">
                    Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

