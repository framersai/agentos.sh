import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import '../styles/tokens.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          * { box-sizing: border-box; }
          html, body { width: 100%; margin: 0; padding: 0; }
          html { height: 100%; overflow-x: hidden; }
          body { min-height: 100vh; overflow-x: hidden; background-color: #030014; color: #f5f0ff; }
          :root { background-color: #030014; }
          .skip-to-content { position: absolute; left: -9999px; z-index: 999; padding: 1rem 1.5rem; background: #6366F1; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
          .skip-to-content:focus { left: 1rem; top: 1rem; outline: 2px solid #8B5CF6; outline-offset: 2px; }
          .skeleton { position: relative; overflow: hidden; background: rgba(255,255,255,0.06); border-radius: 0.5rem; }
          .skeleton::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%); animation: skeleton-shimmer 2s ease-in-out infinite; }
          @keyframes skeleton-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          .hero-critical { position: relative; background-color: #030014; color: #f5f0ff; }
          .hero-critical::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse at top, rgba(15,4,40,0.8), rgba(3,0,20,0.95) 60%),
              radial-gradient(circle at 30% 20%, rgba(118,75,255,0.3), transparent 45%),
              radial-gradient(circle at 70% 80%, rgba(255,102,196,0.25), transparent 50%);
            opacity: 0.65;
            pointer-events: none;
            z-index: 0;
          }
          .hero-critical > * { position: relative; z-index: 1; }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
            .motion-safe {
              animation: none !important;
              transition: none !important;
            }
          }
        `
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${grotesk.variable} grainy min-h-screen antialiased transition-theme bg-background-primary text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}

