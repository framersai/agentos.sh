import { getAllPosts, getPostBySlug } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { locales } from '../../../../../i18n';

interface Props {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  // Generate paths for every supported locale and every post
  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | AgentOS Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'AgentOS Team'],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-background-primary)]">
      <article className="max-w-3xl mx-auto">
        <Link 
          href={`/${params.locale}/blog`}
          className="inline-flex items-center text-sm text-muted hover:text-accent-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        <header className="mb-12 text-center">
           <div className="flex items-center justify-center gap-4 mb-6">
             <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                {post.category || 'Update'}
              </span>
              <time className="text-sm text-muted">
                {new Date(post.date).toLocaleDateString(params.locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
           </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          {post.author && (
            <div className="text-sm text-muted">
              By <span className="text-text-primary font-medium">{post.author}</span>
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-accent-primary prose-img:rounded-xl prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

