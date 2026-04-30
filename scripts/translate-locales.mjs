#!/usr/bin/env node
/**
 * @file translate-locales.mjs
 *
 * Merges hand-authored translations into the per-locale JSON files under
 * messages/. Reads `scripts/translations-data.mjs` which exports a flat map
 * keyed by dotted JSON path:
 *
 *   {
 *     "socialProof.title": {
 *       pt: "Implantações confiáveis (revelação em breve)",
 *       es: "Despliegues confiables (revelación próximamente)",
 *       ...
 *     },
 *     ...
 *   }
 *
 * Behaviour:
 *  - For each (key, locale) pair: writes the translation into messages/<locale>.json
 *    if the current value at that path is missing OR identical to en.json's value
 *    (i.e. it is still an English placeholder from the sync-i18n-keys.js fallback).
 *  - Never overwrites a value that has already been translated by hand
 *    (i.e. differs from English). This protects existing manual work.
 *  - Preserves the existing nested key order; only the value at the leaf is
 *    swapped. New keys (missing in the target) are inserted in en.json's order.
 *
 * Runs offline. No network calls, no external API. Exit code 0 on success,
 * non-zero on file/JSON errors.
 *
 * Usage:
 *   node scripts/translate-locales.mjs
 *   node scripts/translate-locales.mjs --dry-run   # report changes, write nothing
 *   node scripts/translate-locales.mjs --locale pt # only one locale
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import translations from './translations-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(__dirname, '..', 'messages');
const SUPPORTED_LOCALES = ['pt', 'es', 'fr', 'de', 'ja', 'ko', 'zh'];

function parseArgs(argv) {
  const args = { dryRun: false, locale: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a === '--locale') args.locale = argv[++i];
  }
  return args;
}

/**
 * Walk the dotted path and return the leaf value, or undefined when any
 * intermediate node is missing.
 */
function getAtPath(obj, dottedPath) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/**
 * Write the value at the dotted path, creating intermediate objects as
 * needed. Mutates `obj` in place. Returns true when the value actually
 * changed (so the caller can count modifications).
 */
function setAtPath(obj, dottedPath, value) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] == null || typeof cur[p] !== 'object' || Array.isArray(cur[p])) {
      cur[p] = {};
    }
    cur = cur[p];
  }
  const leaf = parts[parts.length - 1];
  if (cur[leaf] === value) return false;
  cur[leaf] = value;
  return true;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
  // Preserve trailing newline + 2-space indentation that the existing
  // locale files use. Don't sort keys — `next-intl` doesn't care, and
  // preserving order makes diffs reviewable.
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetLocales = args.locale ? [args.locale] : SUPPORTED_LOCALES;

  const enPath = join(MESSAGES_DIR, 'en.json');
  const en = loadJson(enPath);

  const totals = {};
  let totalChanges = 0;

  for (const locale of targetLocales) {
    if (!SUPPORTED_LOCALES.includes(locale)) {
      console.error(`Unknown locale: ${locale}`);
      process.exitCode = 2;
      continue;
    }
    const localePath = join(MESSAGES_DIR, `${locale}.json`);
    const data = loadJson(localePath);

    let translated = 0;
    let skippedAlreadyTranslated = 0;
    let skippedNoTranslation = 0;

    for (const [keyPath, perLocale] of Object.entries(translations)) {
      const newValue = perLocale?.[locale];
      // Accept any string, including the empty string. Some UI keys
      // (e.g. cognitive.ragPipeline.strategies.graphrag.badge) are
      // intentionally blank and must be writeable.
      if (typeof newValue !== 'string') {
        skippedNoTranslation++;
        continue;
      }
      const enValue = getAtPath(en, keyPath);
      const curValue = getAtPath(data, keyPath);

      // Only overwrite if value is missing or is still the English placeholder.
      // This protects existing hand translations. The `--force` flag skips
      // this guard, useful when pt.json contains stale English text from a
      // previous en.json revision (which won't equal the current en value
      // and would otherwise be misclassified as "already translated").
      const isPlaceholder = curValue === undefined || curValue === enValue;
      if (!isPlaceholder && !args.force) {
        skippedAlreadyTranslated++;
        continue;
      }
      if (setAtPath(data, keyPath, newValue)) translated++;
    }

    totals[locale] = { translated, skippedAlreadyTranslated, skippedNoTranslation };
    totalChanges += translated;

    if (translated > 0 && !args.dryRun) {
      writeJson(localePath, data);
    }
  }

  console.log('Locale | translated | skipped(hand-done) | skipped(no-data)');
  console.log('-------+------------+--------------------+-----------------');
  for (const [locale, t] of Object.entries(totals)) {
    console.log(
      `  ${locale}   |    ${String(t.translated).padStart(4)}    |        ${String(t.skippedAlreadyTranslated).padStart(4)}        |       ${String(t.skippedNoTranslation).padStart(4)}`,
    );
  }
  console.log('');
  console.log(args.dryRun
    ? `Dry run: would write ${totalChanges} translations.`
    : `Wrote ${totalChanges} translations across ${Object.keys(totals).length} locale(s).`);
}

main();
