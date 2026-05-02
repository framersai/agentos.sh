#!/usr/bin/env node
/**
 * @file fetch-public-stats.mjs
 * @description Build-time fetcher for GitHub + npm stats used by the marketing
 * surfaces (hero, ecosystem, real-stats). Runs as part of `prebuild` and writes
 * `public/stats.json` so the live site reads from a static asset instead of
 * hammering api.github.com from every visitor's browser (which 403s after 60
 * unauthenticated requests per IP per hour).
 *
 * Why static instead of an API route: agentos.sh ships with `output: 'export'`
 * (static GitHub Pages deploy). Next.js API routes don't run there. Build-time
 * fetch + static JSON is the right pattern for a fully-static site.
 *
 * Auth: if `GITHUB_TOKEN` is set in env, requests are authenticated (5000/hr
 * instead of 60/hr) so CI builds don't hit the unauthenticated rate limit.
 *
 * Failure mode: never throws. If a request fails or returns 403, the field is
 * omitted from the output and client components fall back to their hardcoded
 * placeholder. The build keeps moving.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const OUT = join(PUBLIC, 'stats.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

// Repos to fetch top-level stats for (used by hero + ecosystem grids).
const REPOS = [
  'framersai/agentos',
  'framersai/agentos.sh',
  'framersai/agentos-live-docs',
  'framersai/agentos-extensions',
  'framersai/agentos-skills',
  'framersai/agentos-skills-registry',
  'framersai/agentos-extensions-registry',
  'framersai/agentos-workbench',
  'framersai/sql-storage-adapter',
  'framersai/paracosm',
  'framersai/discussions',
];

// npm packages whose weekly download counts feed real-stats / ecosystem.
const NPM_PACKAGES = [
  '@framers/agentos',
  '@framers/agentos-bench',
  '@framers/agentos-personas',
  '@framers/agentos-ext-skills',
  '@framers/sql-storage-adapter',
  '@framers/agentos-skills-registry',
];

function ghHeaders() {
  const h = { Accept: 'application/vnd.github+json', 'User-Agent': 'agentos.sh-build' };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function safeJson(url, headers = {}) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[stats] ${res.status} ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[stats] err ${url}: ${err?.message ?? err}`);
    return null;
  }
}

async function fetchRepo(slug) {
  const data = await safeJson(`https://api.github.com/repos/${slug}`, ghHeaders());
  if (!data) return null;
  return {
    slug,
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    pushedAt: data.pushed_at,
    htmlUrl: data.html_url,
    license: data.license?.spdx_id ?? null,
  };
}

async function fetchOrgRepos(org) {
  const data = await safeJson(
    `https://api.github.com/orgs/${org}/repos?per_page=100&type=public&sort=updated`,
    ghHeaders(),
  );
  if (!Array.isArray(data)) return [];
  return data.map((r) => ({
    slug: `${org}/${r.name}`,
    name: r.name,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    pushedAt: r.pushed_at,
    htmlUrl: r.html_url,
    license: r.license?.spdx_id ?? null,
  }));
}

async function fetchContributors(slug) {
  const data = await safeJson(
    `https://api.github.com/repos/${slug}/contributors?per_page=100`,
    ghHeaders(),
  );
  if (!Array.isArray(data)) return null;
  return data.length;
}

async function fetchNpmDownloads(pkg) {
  const url = `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`;
  const data = await safeJson(url);
  if (!data || typeof data.downloads !== 'number') return null;
  return data.downloads;
}

async function main() {
  console.log(`[stats] fetching public stats (auth=${GITHUB_TOKEN ? 'yes' : 'no'})`);

  const [repoEntries, orgRepos, contribAgentos, ...npmDownloads] = await Promise.all([
    Promise.all(REPOS.map(fetchRepo)),
    fetchOrgRepos('framersai'),
    fetchContributors('framersai/agentos'),
    ...NPM_PACKAGES.map(fetchNpmDownloads),
  ]);

  const repos = Object.fromEntries(
    repoEntries.filter(Boolean).map((r) => [r.slug, r]),
  );

  const npm = Object.fromEntries(
    NPM_PACKAGES.map((pkg, i) => [pkg, npmDownloads[i] ?? null]),
  );

  const out = {
    generatedAt: new Date().toISOString(),
    repos,
    orgRepos: orgRepos ?? [],
    aggregate: {
      agentosStars: repos['framersai/agentos']?.stars ?? null,
      agentosOpenIssues: repos['framersai/agentos']?.openIssues ?? null,
      agentosContributors: contribAgentos,
    },
    npm,
  };

  mkdirSync(PUBLIC, { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2));
  const reposCount = Object.keys(repos).length;
  console.log(`[stats] wrote ${OUT} — ${reposCount}/${REPOS.length} repos, ${orgRepos?.length ?? 0} org repos, ${Object.values(npm).filter(Boolean).length}/${NPM_PACKAGES.length} npm packages`);
}

main().catch((err) => {
  console.error('[stats] fatal:', err);
  // Always write a sentinel file so the client fetch finds *something* rather
  // than hard-failing. Components fall back to placeholders when fields are null.
  try {
    mkdirSync(PUBLIC, { recursive: true });
    writeFileSync(OUT, JSON.stringify({
      generatedAt: new Date().toISOString(),
      repos: {},
      orgRepos: [],
      aggregate: {},
      npm: {},
      _error: String(err?.message ?? err),
    }, null, 2));
  } catch {}
  process.exit(0); // never fail the build on stats fetch
});
