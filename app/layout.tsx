import type { ReactNode } from 'react';

/**
 * Root layout required by Next.js.
 * MUST NOT render <html> or <body> - that's handled by [locale]/layout.tsx
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  // Just return children directly - no wrapper
  return <>{children}</>;
}

