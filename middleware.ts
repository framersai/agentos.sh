import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// ============================================================================
// WARNING: This middleware is DEAD CODE when using `output: 'export'` in
// next.config.mjs. Next.js static export does not execute middleware at
// runtime — there is no server to run it on.
//
// For non-locale-prefixed routes (e.g. /faq, /about, /legal/terms,
// /legal/privacy), client-side redirect pages exist under app/ to forward
// visitors to their /en/ equivalents. See:
//   app/about/page.tsx
//   app/faq/page.tsx
//   app/legal/terms/page.tsx
//   app/legal/privacy/page.tsx
//
// This file is kept so that middleware will activate automatically if the
// project ever switches away from static export.
// ============================================================================

// Skip paths that should bypass locale handling
const PUBLIC_FILE = /^(\/(_next|favicon\.ico|manifest\.json|assets|robots\.txt|sitemap\.xml))/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore public files and Next.js internals
  if (PUBLIC_FILE.test(pathname)) {
    return;
  }

  // Check if the path already starts with a supported locale
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameSegments[0];

  if (locales.includes(firstSegment as any)) {
    return;
  }

  // Rewrite to include default locale prefix
  const localePrefixed = `/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
  return NextResponse.redirect(new URL(localePrefixed, request.url));
}

export const config = {
  matcher: [
    // Run on all paths except next/internal files and public files handled above
    '/((?!_next|favicon.ico|manifest.json|assets|robots.txt|sitemap.xml).*)',
  ],
};

