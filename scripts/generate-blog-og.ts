/**
 * @file generate-blog-og.ts
 * @description Build-time OG image generator for blog posts.
 *
 * For each `content/blog/*.md` post, render a custom branded 1200x630
 * PNG into `public/img/blog/og/<slug>.png` based on one of two
 * hand-authored SVG templates in `public/img/blog/og/templates/`.
 *
 * Pick rule:
 *   - if frontmatter has both `heroStat` and `heroLabel`  -> stat-banner.svg
 *   - else                                                -> title-banner.svg
 *
 * Run via:
 *   pnpm gen:og
 *
 * Output PNGs are committed (no runtime cost, GitHub Pages-friendly).
 *
 * Substitution variables in templates use `{{NAME}}` syntax. After
 * substitution, the SVG is rasterized to PNG via `@resvg/resvg-js`.
 *
 * The script is intentionally template-driven rather than building
 * SVG strings programmatically — it keeps the artistic decisions in
 * the SVG files (where they can be opened in any vector editor for
 * iteration) and the data plumbing in this script.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';
import { Resvg } from '@resvg/resvg-js';

const REPO_ROOT = resolve(__dirname, '..');
const BLOG_DIR = join(REPO_ROOT, 'content/blog');
const TEMPLATES_DIR = join(REPO_ROOT, 'public/img/blog/og/templates');
const OUTPUT_DIR = join(REPO_ROOT, 'public/img/blog/og');

interface PostFrontmatter {
  title: string;
  excerpt?: string;
  category?: string;
  /** Headline metric to feature (e.g. "70.2%"). Triggers stat-banner.svg. */
  heroStat?: string;
  /** Label rendered under the hero stat (e.g. "on LongMemEval-M (1.5M tokens)"). */
  heroLabel?: string;
  /** Optional small badge under the hero label (e.g. "PHASE B · N=500"). */
  benchmarkBadge?: string;
}

/**
 * XML-escape a string so it's safe to drop into SVG `<text>` content.
 * `&` must be replaced first to avoid double-escaping the entities we
 * inject in the next steps.
 */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Word-wrap a string to at most `maxLines` lines, each not exceeding
 * `maxCharsPerLine` characters. Splits at whitespace boundaries.
 *
 * If the input doesn't fill all `maxLines`, the trailing slots are
 * returned as empty strings (not undefined) so the SVG `<tspan>`
 * elements always have a string to render — empty strings render as
 * blank lines, which keeps the layout stable when titles are short.
 */
function wrapToLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (lines.length === maxLines - 1) {
      // Last allowed line — append rest verbatim and clip if needed
      const remaining = (current ? current + ' ' : '') + words.slice(words.indexOf(word)).join(' ');
      if (remaining.length > maxCharsPerLine) {
        lines.push(remaining.slice(0, maxCharsPerLine - 1).trimEnd() + '…');
      } else {
        lines.push(remaining);
      }
      current = '';
      break;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  while (lines.length < maxLines) lines.push('');
  return lines.slice(0, maxLines);
}

/** Substitute `{{NAME}}` placeholders in a template with the given map. */
function substitute(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? '');
}

/** Render an SVG string to PNG at the canvas size declared inside the SVG. */
function rasterizeSvg(svg: string, outputPath: string): void {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: 'rgba(0, 0, 0, 0)',
    font: {
      // Try common system fonts first; resvg loads them lazily
      fontFiles: [],
      loadSystemFonts: true,
      defaultFontFamily: 'Inter',
    },
  });
  const png = resvg.render().asPng();
  writeFileSync(outputPath, png);
}

/**
 * Truncate a long passage to its first sentence (or up to maxChars,
 * whichever comes first). Used to derive a one-glance "dek" from the
 * post's excerpt for the title-banner template, where the excerpt
 * field is typically a multi-sentence paragraph that won't fit in
 * the OG card.
 */
function firstSentence(text: string, maxChars: number): string {
  const trimmed = text.trim();
  // Match first sentence ending in `. ` `! ` `? ` (or end-of-string)
  const match = trimmed.match(/^(.{20,}?[.!?])(\s|$)/);
  const candidate = match ? match[1] : trimmed;
  if (candidate.length > maxChars) {
    return candidate.slice(0, maxChars - 1).trimEnd() + '…';
  }
  return candidate;
}

/**
 * Use a frontmatter `ogTitle` override when present (lets posts that
 * have very long full titles supply a tighter version specifically
 * for the social card). Falls back to the regular title.
 */
function ogTitleOf(fm: PostFrontmatter): string {
  return ((fm as Record<string, unknown>).ogTitle as string | undefined) ?? fm.title;
}

/** Build OG card variables for a single post. */
function buildVars(_slug: string, frontmatter: PostFrontmatter): { template: 'stat' | 'title'; vars: Record<string, string> } {
  const category = (frontmatter.category ?? 'Engineering').toUpperCase();

  // Stat-banner branch: heroStat + heroLabel both required.
  // Wide budget for the bottom title since the hero stat dominates
  // visually and we'd rather show the full title than clip it.
  if (frontmatter.heroStat && frontmatter.heroLabel) {
    const titleLines = wrapToLines(ogTitleOf(frontmatter), 76, 2);
    return {
      template: 'stat',
      vars: {
        HERO_STAT: xmlEscape(frontmatter.heroStat),
        HERO_LABEL: xmlEscape(frontmatter.heroLabel),
        BENCHMARK_BADGE: xmlEscape(frontmatter.benchmarkBadge ?? ''),
        TITLE_LINE_1: xmlEscape(titleLines[0]),
        TITLE_LINE_2: xmlEscape(titleLines[1]),
        CATEGORY: xmlEscape(category),
      },
    };
  }

  // Title-banner branch: title is dominant, dek line below is the
  // first sentence of the excerpt.
  const titleLines = wrapToLines(ogTitleOf(frontmatter), 36, 3);
  const dek = frontmatter.excerpt ? firstSentence(frontmatter.excerpt, 160) : '';
  const dekLines = dek ? wrapToLines(dek, 80, 2) : ['', ''];
  return {
    template: 'title',
    vars: {
      TITLE_LINE_1: xmlEscape(titleLines[0]),
      TITLE_LINE_2: xmlEscape(titleLines[1]),
      TITLE_LINE_3: xmlEscape(titleLines[2]),
      EXCERPT_LINE_1: xmlEscape(dekLines[0]),
      EXCERPT_LINE_2: xmlEscape(dekLines[1]),
      CATEGORY: xmlEscape(category),
    },
  };
}

function main(): void {
  if (!existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const statTemplate = readFileSync(join(TEMPLATES_DIR, 'stat-banner.svg'), 'utf8');
  const titleTemplate = readFileSync(join(TEMPLATES_DIR, 'title-banner.svg'), 'utf8');

  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const generated: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(BLOG_DIR, file), 'utf8');
    const { data } = matter(raw);
    const fm = data as PostFrontmatter;

    if (!fm.title) {
      console.warn(`  SKIP ${slug}: no title in frontmatter`);
      continue;
    }

    const { template, vars } = buildVars(slug, fm);
    const sourceTemplate = template === 'stat' ? statTemplate : titleTemplate;
    const svg = substitute(sourceTemplate, vars);

    const outputPath = join(OUTPUT_DIR, `${slug}.png`);
    rasterizeSvg(svg, outputPath);
    generated.push(`${template === 'stat' ? '[STAT]' : '[TITLE]'} ${slug}.png`);
  }

  console.log(`Generated ${generated.length} OG card(s):`);
  for (const line of generated) console.log(`  ${line}`);
}

main();
