import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { SiteHeader } from "../components/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "AgentOS - Orchestrate adaptive AI systems",
  description:
    "AgentOS is the orchestration substrate powering Frame.dev. Build, debug, and deploy adaptive AI agents with a runtime designed for audio, tools, and realtime feedback loops.",
  metadataBase: new URL("https://agentos.sh"),
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
    title: "AgentOS by Frame",
    description:
      "Adaptive agent runtime with battle-tested streaming, tooling, and observability. Built by Frame.dev.",
    url: "https://agentos.sh",
    siteName: "AgentOS",
    images: [{ url: "/og-image.png", width: 1600, height: 1600 }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    creator: "@frame_dev",
    site: "@frame_dev",
    images: ["/og-image.png"]
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
