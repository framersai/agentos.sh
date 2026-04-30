import { locales } from '../../i18n';
import { canonical } from './canonical';

/**
 * Per-page hreflang alternates map.
 *
 * Returns the `alternates.languages` object that Next.js's metadata API
 * expects. Includes every configured locale plus the `x-default` entry
 * pointing at the English version, which Google uses when no per-locale
 * URL matches the searcher's language.
 *
 * Why this lives in its own helper: every per-route `generateMetadata`
 * needs the same map, and the homepage layout's hand-rolled version
 * doesn't propagate to child routes (Next.js metadata is replaced, not
 * merged, by child segments).
 *
 * @param path  Route path under the locale prefix (no locale).
 * @returns Object keyed by locale (plus 'x-default') to absolute URL.
 *
 * @example
 *   hreflangAlternates('/blog')
 *   // { en: '...en/blog/', zh: '...zh/blog/', ..., 'x-default': '...en/blog/' }
 */
export function hreflangAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of locales) {
    map[loc] = canonical(loc, path);
  }
  map['x-default'] = canonical('en', path);
  return map;
}
