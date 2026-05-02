/**
 * @file public-stats.ts
 * @description Shared loader for the build-time-generated `/stats.json` blob.
 *
 * Three layers of caching, hottest first:
 *
 *  1. **In-process module cache** — once `loadPublicStats()` resolves in this
 *     tab, every subsequent caller in the same SPA navigation gets the same
 *     promise. Zero re-renders trigger a refetch within the same page session.
 *  2. **localStorage** with a 1-hour TTL — lets repeat visits and across-tab
 *     reads skip the network entirely. Stats only update once per hour from
 *     the user's perspective; the underlying blob updates whenever a build
 *     ships (manually triggered or by the daily cron in `pages.yml`).
 *  3. **HTTP cache** — `/stats.json` is a static asset served by GitHub Pages
 *     with the default `Cache-Control` headers (CDN-cached). The browser will
 *     hit its own HTTP cache before going to network when localStorage misses.
 *
 * Failure modes: if `localStorage` is unavailable (private mode, SSR, blocked),
 * the helper degrades gracefully to the network-only path. Network errors
 * resolve to `null` so callers can show their hardcoded fallback copy.
 */

const STORAGE_KEY = 'agentos-public-stats';
const TTL_MS = 60 * 60 * 1000; // 1 hour
const STATS_URL = '/stats.json';

export interface RepoStats {
  slug: string;
  name?: string;
  description?: string | null;
  stars?: number;
  forks?: number;
  openIssues?: number;
  pushedAt?: string;
  htmlUrl?: string;
  license?: string | null;
}

export interface PublicStats {
  generatedAt: string;
  repos: Record<string, RepoStats>;
  orgRepos: RepoStats[];
  aggregate: {
    agentosStars?: number | null;
    agentosOpenIssues?: number | null;
    agentosContributors?: number | null;
  };
  npm: Record<string, number | null>;
}

let inFlight: Promise<PublicStats | null> | null = null;

interface StorageEntry {
  ts: number;
  data: PublicStats;
}

function readLocal(): PublicStats | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as StorageEntry;
    if (!entry?.ts || !entry?.data) return null;
    if (Date.now() - entry.ts > TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeLocal(data: PublicStats): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ts: Date.now(), data } satisfies StorageEntry),
    );
  } catch {
    // Quota or unavailable storage; ignore.
  }
}

/**
 * Load the public stats blob with all three cache layers active.
 * Returns `null` if nothing usable could be obtained (network failure,
 * malformed response, etc.). Safe to call from any client component.
 */
export function loadPublicStats(): Promise<PublicStats | null> {
  // Layer 1: in-process cache.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    // Layer 2: localStorage.
    const cached = readLocal();
    if (cached) return cached;

    // Layer 3: network (HTTP cache aware — let the browser/CDN do their job).
    try {
      const res = await fetch(STATS_URL);
      if (!res.ok) return null;
      const data = (await res.json()) as PublicStats;
      writeLocal(data);
      return data;
    } catch {
      return null;
    }
  })();

  return inFlight;
}

/**
 * Force a refetch on the next `loadPublicStats()` call. Clears both the
 * in-process promise and the localStorage entry. Useful for tests or for
 * a manual "refresh stats" button if one ever ships.
 */
export function clearPublicStatsCache(): void {
  inFlight = null;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
