#!/usr/bin/env tsx
/**
 * @file indexnow-submit.ts
 * @description Notify Bing / Yandex / Naver / Seznam / Yep that
 * agentos.sh URLs have changed.
 *
 * Run via:
 *   pnpm tsx scripts/indexnow-submit.ts
 *
 * Pre-requisites:
 *   1. The IndexNow key file must already be live at
 *      https://agentos.sh/<KEY>.txt with the key as the file body.
 *   2. KEY constant below must match that file's content.
 *
 * What this submits:
 *   - All locale-prefixed homepages
 *   - All static pages across all 8 locales (about/blog/docs/faq/etc.)
 *   - All blog post pages across all 8 locales
 *   - All career listing pages across all 8 locales
 *
 * URL list shape mirrors app/sitemap.ts so what gets submitted matches
 * what gets indexed via the sitemap.
 *
 * Limits per IndexNow spec: ≤10,000 URLs per call, ≤10 MB body.
 * agentos.sh ships ~200 URLs (12 posts × 8 locales + ~12 static × 8
 * locales + a handful of careers), well under both limits.
 *
 * Google does NOT participate in IndexNow (they deprecated their
 * sitemap ping endpoint in 2023). Use Search Console for Google.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';

const KEY = 'f79b6774ba544b46bd70ed09dd117988';
const HOST = 'agentos.sh';
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// Locales mirror the i18n config; keep manually in sync since this
// script runs outside the Next.js bundle.
const LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh'];

const STATIC_PATHS = [
  '',
  '/about',
  '/blog',
  '/docs',
  '/faq',
  '/careers',
  '/legal/terms',
  '/legal/privacy',
  '/legal/security',
  '/legal/cookies',
  '/guides',
];

const REPO_ROOT = resolve(__dirname, '..');
const BLOG_DIR = join(REPO_ROOT, 'content/blog');
const JOBS_DIR = join(REPO_ROOT, 'content/careers');

function listMarkdownSlugs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

function buildUrlList(): string[] {
  const blogSlugs = listMarkdownSlugs(BLOG_DIR);
  const jobSlugs = listMarkdownSlugs(JOBS_DIR);

  const urls: string[] = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      urls.push(`${BASE}/${locale}${path}`);
    }
    for (const slug of blogSlugs) {
      urls.push(`${BASE}/${locale}/blog/${slug}`);
    }
    for (const slug of jobSlugs) {
      urls.push(`${BASE}/${locale}/careers/${slug}`);
    }
  }

  // Deduplicate just in case anything overlaps.
  return [...new Set(urls)];
}

async function submit(urlList: string[]): Promise<void> {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  // IndexNow status codes:
  //   200 — submission accepted
  //   202 — submission accepted, key validation pending
  //   400 — bad request (invalid URL list / key format)
  //   403 — key invalid for the host or key file mismatch
  //   422 — URLs do not belong to the host
  //   429 — rate-limited
  // Bodies are typically empty for 200/202.
  console.log(`POST ${ENDPOINT} → ${res.status} ${res.statusText}`);
  if (res.status >= 400) {
    const text = await res.text().catch(() => '');
    console.error(`Body: ${text}`);
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const urls = buildUrlList();
  console.log(`Submitting ${urls.length} URLs to IndexNow…`);
  console.log(`Key: ${KEY}`);
  console.log(`Key location: ${KEY_LOCATION}`);
  console.log(`Sample URLs:`);
  urls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
  console.log(`  …`);
  await submit(urls);
}

void main();
