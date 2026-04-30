/**
 * Locale-aware canonical URL builder.
 *
 * The site uses `trailingSlash: true` + locale-prefixed routing under
 * `app/[locale]/`. The historical canonical generation in per-route
 * `generateMetadata` hand-rolled the URL string, dropped the locale
 * prefix for `en`, and inconsistently emitted trailing slashes. This
 * helper is the single source of truth.
 *
 * @param locale  One of the configured locales (en, zh, ko, ja, es, de, fr, pt).
 * @param path    The route path under the locale, e.g. `/`, `/blog`,
 *                `/blog/announcing-agentos`. Leading slash optional;
 *                duplicate or trailing slashes are normalized.
 * @returns Absolute URL with the locale prefix and a trailing slash.
 *
 * @example
 *   canonical('en', '/') === 'https://agentos.sh/en/'
 *   canonical('en', '/blog/announcing-agentos') === 'https://agentos.sh/en/blog/announcing-agentos/'
 *   canonical('zh', '/legal/privacy') === 'https://agentos.sh/zh/legal/privacy/'
 */
export function canonical(locale: string, path: string): string {
  // Normalize: ensure single leading slash, collapse runs of slashes,
  // strip trailing slash so we can re-add exactly one.
  const cleaned = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  // cleaned is '' for root, otherwise '/blog' or '/blog/foo' style.
  return `https://agentos.sh/${locale}${cleaned}/`;
}
