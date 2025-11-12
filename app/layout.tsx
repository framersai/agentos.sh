import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { SiteHeader } from "../components/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "AgentOS - TypeScript Runtime for Adaptive AI Agent Intelligence",
  description:
    "Build intelligent, adaptive AI agents with AgentOS. Open-source TypeScript runtime for creating autonomous AI systems with agency, memory, and multi-modal capabilities. Featuring GMI roles, tool orchestration, and enterprise-ready guardrails.",
  metadataBase: new URL("https://agentos.sh"),
  keywords: [
    "AgentOS",
    "AI agents",
    "artificial intelligence",
    "machine learning",
    "TypeScript AI",
    "autonomous agents",
    "agent runtime",
    "AI framework",
    "adaptive intelligence",
    "agency AI",
    "multi-agent systems",
    "AI orchestration",
    "GMI roles",
    "generalised mind instances",
    "Frame.dev",
    "voice chat assistant",
    "AI development",
    "open source AI"
  ],
  authors: [{ name: "Frame.dev", url: "https://frame.dev" }],
  creator: "Frame.dev",
  publisher: "Frame.dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" }
    ]
  },
  openGraph: {
    title: "AgentOS - TypeScript Runtime for Adaptive AI Agent Intelligence",
    description:
      "Build intelligent AI agents with memory, tools, and agency. Open-source runtime featuring GMI roles, multi-agent orchestration, and enterprise guardrails. By Frame.dev.",
    url: "https://agentos.sh",
    siteName: "AgentOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgentOS - Adaptive AI Agent Intelligence Runtime"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentOS - TypeScript Runtime for Adaptive AI Agents",
    description: "Build intelligent AI agents with AgentOS. Open-source runtime with GMI roles, agency orchestration, and enterprise guardrails.",
    creator: "@frame_dev",
    site: "@frame_dev",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "https://agentos.sh"
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <body className="grainy min-h-screen antialiased">
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="border-t border-slate-200/60 bg-white/80 py-10 text-sm text-slate-500 dark:border-slate-900 dark:bg-slate-950/70 dark:text-slate-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
              <p>&copy; {new Date().getFullYear()} Frame.dev / framersai. All rights reserved.</p>
              <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
                <a href="https://github.com/framersai" className="hover:text-brand" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="mailto:founders@frame.dev" className="hover:text-brand">
                  Contact
                </a>
                <a href="/legal/terms" className="hover:text-brand">
                  Terms
                </a>
                <a href="/legal/privacy" className="hover:text-brand">
                  Privacy
                </a>
              </nav>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                AgentOS by Frame.dev
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

