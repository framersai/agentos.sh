import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { getAllJobs } from '@/lib/markdown';
import { locales, defaultLocale } from '@/i18n';

const baseUrl = 'https://agentos.sh';

/**
 * The sitemap emits only the default-locale (`/en/...`) URL for each page,
 * with `alternates.languages` pointing to every locale variant. Earlier
 * revisions emitted all 8 locales as top-level sitemap entries; that
 * produced 192 URLs, of which Google Search Console flagged 333 as
 * "Discovered – currently not indexed" because the non-English translations
 * are largely auto-translated UI chrome wrapping the same English content,
 * and Google decided indexing them wasn't worth the crawl budget.
 *
 * The current strategy:
 *   - Sitemap emits the canonical English URL per page (~24 URLs total).
 *   - `alternates.languages` still lists all 8 locales so Google knows the
 *     translations exist and can serve them to users in matching regions.
 *   - The locale-prefixed HTML files (`/es/`, `/fr/`, ...) still ship in
 *     the static export and remain reachable; we just stop pushing Google
 *     to index them.
 *
 * The app router still uses `/[locale]/...` for every public route, so the
 * sitemap continues to emit `/en/...` (not bare `/...`). Switching to
 * `localePrefix: 'as-needed'` is a separate change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const jobs = getAllJobs();

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/features', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/docs', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/careers', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/legal/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal/security', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/guides', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries(
      locales.map((alt) => [alt, `${baseUrl}/${alt}${path}`]),
    ),
  });

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}/${defaultLocale}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: alternatesFor(page.path),
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/${defaultLocale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: alternatesFor(`/blog/${post.slug}`),
  }));

  const careerUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/${defaultLocale}/careers/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: alternatesFor(`/careers/${job.slug}`),
  }));

  return [...staticUrls, ...blogUrls, ...careerUrls];
}
