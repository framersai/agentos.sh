import { defaultLocale } from '../../i18n';

/**
 * Locale-aware canonical URL builder.
 *
 * The site uses `trailingSlash: true` + locale-prefixed routing under
 * `app/[locale]/`. Every page is generated at `/{locale}/...` paths in
 * the static export, including the default locale at `/en/...`. But
 * the canonical URL for the default locale is emitted *without* the
 * locale prefix:
 *
 *   - default locale (`en`) → `https://agentos.sh/blog/foo/`
 *   - other locales         → `https://agentos.sh/zh/blog/foo/`
 *
 * Why: Google Search Console reports "Duplicate, Google chose
 * different canonical than user" entries where Google overrode our
 * `/en/...` canonical and picked the bare-path URL. The site serves
 * the English content at both `/` and `/en/` (the static export writes
 * both), so Google sees them as duplicates and prefers the shorter
 * path. Aligning canonical with Google's preference removes the
 * disagreement. Non-default locales keep the prefix because there is
 * no bare-path equivalent for `/zh/...`.
 *
 * The `/en/...` URLs remain reachable. A Cloudflare 301 collapses
 * `/en/...` → `/...` so any inbound link to the prefixed form lands
 * on the canonical bare path.
 *
 * @param locale  One of the configured locales (en, zh, ko, ja, es, de, fr, pt).
 * @param path    The route path under the locale, e.g. `/`, `/blog`,
 *                `/blog/announcing-agentos`. Leading slash optional;
 *                duplicate or trailing slashes are normalized.
 * @returns Absolute URL with a trailing slash. The default locale is
 *          emitted without a prefix; other locales keep their prefix.
 *
 * @example
 *   canonical('en', '/') === 'https://agentos.sh/'
 *   canonical('en', '/blog/announcing-agentos') === 'https://agentos.sh/blog/announcing-agentos/'
 *   canonical('zh', '/legal/privacy') === 'https://agentos.sh/zh/legal/privacy/'
 */
export function canonical(locale: string, path: string): string {
  // Normalize: ensure single leading slash, collapse runs of slashes,
  // strip trailing slash so we can re-add exactly one.
  const cleaned = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  // cleaned is '' for root, otherwise '/blog' or '/blog/foo' style.
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `https://agentos.sh${prefix}${cleaned}/`;
}
