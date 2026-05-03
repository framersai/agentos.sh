import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { getAllJobs } from '@/lib/markdown';
import { locales } from '@/i18n';

const baseUrl = 'https://agentos.sh';

/**
 * The app router uses /[locale] for every public route, so a URL like
 * "/blog/foo" never resolves; only "/en/blog/foo", "/es/blog/foo",
 * etc. exist on disk after `next export`. Earlier sitemap revisions
 * emitted bare-path URLs for the default locale (no /en/ prefix),
 * which caused Google Search Console to flag ~98 sitemap URLs as
 * 404 because the bare paths never deployed. This file always emits
 * the locale-prefixed URL so every entry resolves to a real HTML
 * file in the static export.
 *
 * For non-blog top-level redirect stubs that DO live at bare paths
 * (about, faq, legal/*, privacy, cookies — see the comment in
 * middleware.ts about static-export redirect pages), Google can find
 * them via the locale homepage; the sitemap stays canonical-locale.
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

  // Always locale-prefix every URL. The static export only emits
  // `/[locale]/...` paths; bare-path equivalents (where they exist as
  // redirect stubs) are not canonical and should not appear in the
  // sitemap.
  const staticUrls: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${baseUrl}/${alt}${page.path}`]),
        ),
      },
    })),
  );

  const blogUrls: MetadataRoute.Sitemap = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${baseUrl}/${alt}/blog/${post.slug}`]),
        ),
      },
    })),
  );

  const careerUrls: MetadataRoute.Sitemap = jobs.flatMap((job) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/careers/${job.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${baseUrl}/${alt}/careers/${job.slug}`]),
        ),
      },
    })),
  );

  return [...staticUrls, ...blogUrls, ...careerUrls];
}
