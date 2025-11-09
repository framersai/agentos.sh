"use client";

import { useState } from "react";
import {
  ArrowRight,
  Cpu,
  Radio,
  ShieldCheck,
  Sparkle,
  Waves,
  Code2,
  Zap,
  Users,
  TrendingUp,
  Brain,
  Layers,
  Shield,
  Workflow,
  GitBranch
} from "lucide-react";
import { motion } from "framer-motion";
import { EmailSignupForm } from "../components/email-signup-form";
import { AnimatedMetrics } from "../components/hero/animated-metrics";
import { MediaShowcase } from "../components/media/media-showcase";
import { MarketplacePreview } from "../components/marketplace/marketplace-preview";
import DocSearch from "../components/docs/DocSearch";
import ScrollToTopButton from "../components/ScrollToTopButton";

const featureCards = [
  {
    icon: Shield,
    title: "Guardrails & Safety Marketplace",
    body: "Agents 'change their mind' mid-stream via keyword filters, LLM-powered policy checks, cost ceilings, and human escalation queues. Install from curated or community registries with free CI/CD.",
    pill: "Safety first"
  },
  {
    icon: Cpu,
    title: "Extension Registry & Auto-Loading",
    body: "Install tools (web search, Telegram, code execution) via npm. AgentOS auto-discovers and loads extensions from the community registry. Tree-shakable, lazy-loaded, fully typed.",
    pill: "Community-driven"
  },
  {
    icon: Radio,
    title: "Language & translation services",
    body: "Auto language detection, persona-aware response preferences, and pluggable translation providers keep GMIs fluent across every surface.",
    pill: "Multilingual ready"
  },
  {
    icon: Code2,
    title: "Storage & deployment adapters",
    body: "One API across cloud, desktop, mobile, and browser. IndexedDB (sql.js + browser persistence) for PWAs, better-sqlite3 for Electron, PostgreSQL for cloud, Capacitor for mobile. Full SQLite feature parity including JSON functions, BLOBs, and transactions. Auto-detects platform and selects the best adapter.",
    pill: "Deploy anywhere"
  }
];

const gmiHighlights = [
  {
    icon: Brain,
    title: "Cohesive cognitive layer",
    description:
      "Bundle persona prompts, context memory, and linguistic preferences into a single mind that can be reused across products."
  },
  {
    icon: Shield,
    title: "Policy-aware by design",
    description:
      "Every GMI carries guardrail hooks, subscription entitlements, and rate budgetsâ€”enforcing what the mind is allowed to say or do."
  },
  {
    icon: Workflow,
    title: "Agency orchestration",
    description:
      "Drop GMIs into multi-role workflows. They collaborate, hand off tasks, and stream telemetry without bespoke glue code."
  },
  {
    icon: Layers,
    title: "Multilingual out of the box",
    description:
      "Auto-detect the active language from conversation context, pivot content when needed, and respond in the personaâ€™s preferred voiceâ€”all before the request ever reaches the model."
  },
  {
    icon: GitBranch,
    title: "Versioned & exportable",
    description:
      "Overlay new behaviours, capture lineage, and export minds as JSON so you can audit, rollback, or run them in other environments."
  }
];

const timeline = [
  {
    title: "Workflow runtime",
    description:
      "Async generators stream AgentOSResponse chunks with rich metadata for text, tool calls, artifacts, and guardrail outcomesâ€”ready for SSE, WebSocket, or in-memory bridges.",
    status: "Available today",
    progress: 100
  },
  {
    title: "Multi-GMI agencies",
    description:
      "Persona overlays, workflow definitions, and Agency registries let specialised GMIs collaborate on shared goals with human-in-the-loop checkpoints.",
    status: "Developer preview",
    progress: 75
  },
  {
    title: "Hosted control plane",
    description:
      "Managed streaming, observability, and billing integrations for production teams that want Frame's infrastructure without the ops burden.",
    status: "Roadmap",
    progress: 30
  }
];

// Testimonials placeholder data
const testimonials = [
  {
    author: "Sarah Chen",
    role: "Senior AI Engineer",
    company: "TechCorp",
    content: "AgentOS transformed how we build conversational AI. The streaming architecture and persona system are game-changers.",
    rating: 5
  },
  {
    author: "Marcus Rodriguez",
    role: "CTO",
    company: "AI Startup",
    content: "We deployed 50+ custom agents in just 2 weeks. The tool orchestration saved us months of development.",
    rating: 5
  },
  {
    author: "Emily Watson",
    role: "Product Manager",
    company: "Enterprise Co",
    content: "The guardrail system and subscription-aware limits gave us confidence to go to production quickly.",
    rating: 5
  }
];

export default function LandingPage() {
  const [gmiDiagramMissing, setGmiDiagramMissing] = useState(false);

  return (
    <>
      {/* Early Access Banner - Configurable via env */}
      {process.env.NEXT_PUBLIC_SHOW_EARLY_ACCESS_BANNER === 'true' && (
        <div className="relative bg-gradient-to-r from-brand to-purple-600 py-3 text-center text-sm font-medium text-white">
          <span className="inline-flex items-center justify-center gap-2">
            <Sparkle className="h-4 w-4" aria-hidden="true" />
            {process.env.NEXT_PUBLIC_EARLY_ACCESS_MESSAGE || 'Early access: be among the first to experience AgentOS'}
          </span>
          <a
            href="https://app.vca.chat/en"
            className="ml-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/30"
          >
            Try demo <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24 pt-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-col gap-14 md:flex-row md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="z-10 max-w-xl space-y-8"
            >
              <span className="inline-flex items-center gap-3 rounded-full border border-brand/20 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-foreground">
                <Sparkle className="h-3.5 w-3.5" aria-hidden="true" />
                Generalised Mind Instances for builders
              </span>
              <h1 id="hero-heading" className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl sm:leading-tight dark:text-white">
                Build AI agents with safety, extensions, and real-time guardrails.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                AgentOS is the cognitive runtime powering Frame.dev&apos;s voice assistants. Deploy adaptive agents with built-in safety (guardrails that let agents "change their mind"), community extensions (search, Telegram, code execution), and free CI/CD for contributors. Apache-licensed for teams.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="https://agentos.sh/docs"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand/40"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View documentation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              <a
                href="https://www.npmjs.com/package/@agentos/core"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install via npm
              </a>
              <a
                href="https://github.com/framersai/agentos"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </a>
              <DocSearch triggerClassName="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand" />
            </div>
              <ul className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-brand" aria-hidden="true" />
                  GMIs orchestrate personas & policies
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                  Guardrail & compliance aware
                </li>
                <li className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-brand" aria-hidden="true" />
                  Extensible packs & providers
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-2xl"
            >
              <div className="glass-panel relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl dark:bg-brand/20" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-slate-300/40 blur-3xl dark:bg-slate-800/40" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Realtime session
                    </p>
                    <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300">
                      Live
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Persona</p>
                    <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">Atlas, Systems Architect</h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      &ldquo;I spotted a tool loop. Escalating to code interpreter with a capped energy budget and memoising your last three diagrams.&rdquo;
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-widest text-brand">Streaming cost</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">$0.021</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Session budget 8%</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-widest text-brand">Toolchain</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">3 calls</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Planner + Designer + Search</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* GMIs introduction */}
          <section id="gmis" className="landing-gmis">
            <div className="landing-section-header">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                Meet Generalised Mind Instances (GMIs)
              </h3>
              <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
                GMIs bundle persona knowledge, memory, tools, and guardrails into composable building blocks. Instead of wiring
                ad-hoc prompts, you assemble agencies from reusable minds that understand context, entitlements, language, and policy
                before a request ever reaches the model. Input, translation, and output preferences are negotiated automatically so
                the same GMI can reason fluently across conversations, locales, and channels.
              </p>
            </div>
            <div className="landing-gmis__body">
              <div className="landing-gmis__media">
                {!gmiDiagramMissing ? (
                  <picture>
                    <source srcSet="/media/diagrams/gmi-layers-dark.png" media="(prefers-color-scheme: dark)" />
                    <img
                      src="/media/diagrams/gmi-layers-light.png"
                      alt="Diagram showing a GMI combining persona memory, guardrails, and tool permissions."
                      onError={() => setGmiDiagramMissing(true)}
                    />
                  </picture>
                ) : (
                  <div className="landing-gmis__placeholder">
                    <p>
                      Upload <code>public/media/diagrams/gmi-layers-light.png</code> (and <code>gmi-layers-dark.png</code>) to
                      illustrate the GMI stack. Until then, this placeholder explains where the visual lives.
                    </p>
                  </div>
                )}
              </div>
              <div className="landing-gmis__grid">
                {gmiHighlights.map((item) => (
                  <article key={item.title} className="landing-gmis__card glass-panel">
                    <div className="landing-gmis__card-icon">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

      {/* Platform Feature Matrix */}
      <section className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Platform support</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            One API across cloud, desktop, mobile, and browser. AgentOS uses the SQL Storage Adapter to select the right backend at runtime. IndexedDB adapter (sql.js + browser persistence) provides full SQLite feature parity including JSON functions, BLOBs, and transactions—perfect for offline-first PWAs.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200/40 dark:border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/60 dark:bg-slate-900/60">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Cloud (Postgres)</th>
                  <th className="p-3">Desktop (Electron)</th>
                  <th className="p-3">Mobile (Capacitor)</th>
                  <th className="p-3">Browser (sql.js)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'Persistence', cloud: '✅ durable', desk: '✅ local file', mob: '✅ on-device', web: '✅ IndexedDB (auto-save)' },
                  { f: 'Concurrency', cloud: '✅ pooled', desk: '❌ single-writer', mob: '❌ single-connection', web: '❌ single-threaded' },
                  { f: 'Transactions', cloud: '✅', desk: '✅', mob: '✅', web: '✅' },
                  { f: 'WAL/Locks', cloud: '❌', desk: '✅', mob: '✅', web: '❌' },
                  { f: 'JSON/Arrays', cloud: '✅ JSONB', desk: '✅ JSON1', mob: '✅ JSON1', web: '✅ JSON1' },
                  { f: 'Prepared statements', cloud: '✅', desk: '✅', mob: '❌', web: '✅' },
                  { f: 'Cloud backups', cloud: '✅ S3/R2', desk: '✅ optional', mob: '✅ optional', web: '✅ export/import' },
                  { f: 'Multi-tenant orgs', cloud: '✅', desk: '❌', mob: '❌', web: '❌' },
                  { f: 'Marketplace (server)', cloud: '✅', desk: '⚠️ read-only', mob: '⚠️ read-only', web: '⚠️ disabled' },
                  { f: 'Billing', cloud: '✅', desk: '❌', mob: '❌', web: '❌' },
                ].map((row) => (
                  <tr key={row.f} className="border-t border-slate-200/40 dark:border-white/5">
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{row.f}</td>
                    <td className="p-3">{row.cloud}</td>
                    <td className="p-3">{row.desk}</td>
                    <td className="p-3">{row.mob}</td>
                    <td className="p-3">{row.web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            See docs for details: Platform Feature Matrix and SQL Storage Adapter architecture.
          </p>
        </div>
      </section>

          {/* Architecture Overview */}
          <section id="architecture" className="mt-20 space-y-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Composable runtime architecture</h2>
              <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
                AgentOS brings the GMI manager, conversation memory, tool orchestrator, guardrail dispatcher, extension loader, streaming manager,
                and workflow engine together behind a single facade. Extensions and guardrails are community-driven with free CI/CD—install via npm or browse the registry at runtime.
              </p>
              <div className="w-full max-w-4xl">
                <picture>
                  <source srcSet="/media/diagrams/agentos-architecture-dark.png" media="(prefers-color-scheme: dark)" />
                  <img
                    src="/media/diagrams/agentos-architecture-light.png"
                    alt="Diagram showing AgentOS modules coordinating GMIs, guardrails, and tool execution."
                    className="w-full rounded-2xl border border-slate-200/40 bg-white/70 p-4 shadow-lg dark:border-white/5 dark:bg-slate-950/60"
                  />
                </picture>
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="glass-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">AgentOSConfig at a glance</p>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900/90 p-5 text-left text-xs text-slate-100">
{`const config: AgentOSConfig = {
  gmiManagerConfig: { personaLoaderConfig: { loaderType: "file_system" } },
  toolOrchestratorConfig: { orchestratorId: "default" },
  guardrailService: composeGuardrails([
    new KeywordGuardrail({ patterns: [...] }),
    new CostCeilingGuardrail({ maxCostUsd: 0.05 })
  ]),
  guardrailConfig: { loadCurated: true, loadCommunity: false },
  extensionConfig: { loadCurated: true, autoInstall: true },
  languageConfig: { defaultLanguage: "en", autoDetect: true },
  workflowEngineConfig: { maxConcurrentWorkflows: 32 }
};`}
                </pre>
              </div>
              <div className="glass-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">Operational telemetry</p>
                <AnimatedMetrics />
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Licensing & ownership */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/60">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <article className="glass-panel space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand dark:bg-brand/20 dark:text-brand-foreground">
              Licensing
            </span>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Apache engine, MIT surfaces</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              AgentOS core (\`@agentos/core\`) is Apache 2.0 licensed, providing explicit patent grants and clear attribution. The
              surrounding product surfaces— including the vca.chat marketplace and this site — are MIT licensed. You control your
              personas, tool packs, and marketplace listings — export them as JSON or load them into your own deployments at any time.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Export personas, workflows, and artifacts without leaving the platform</li>
            <li>Approve or reject bundle submissions before they hit production</li>
              <li>Ship private, unlisted, org-only, or invite-only listings while keeping compliance guardrails intact</li>
              <li>Release automation mirrors `@agentos/core`, landing sites, and docs to public repos</li>
            </ul>
            <nav className="flex flex-wrap gap-3 text-sm" aria-label="Licensing links">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                href="https://github.com/framersai/voice-chat-assistant/blob/main/docs/RELEASE_AUTOMATION.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Review release automation
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                href="https://vca.chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore vca.chat marketplace
              </a>
            </nav>
          </article>
          <article className="glass-panel space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ownership FAQ</h3>
            <details className="group rounded-xl border border-slate-200/50 p-4 dark:border-slate-700/60">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                Do I keep control of my agents?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Yes. Export personas, prompt packs, and tool registries as versioned JSON. Import them into another AgentOS deploymentâ€”or
                any Apache-compatible forkâ€”without losing history.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200/50 p-4 dark:border-slate-700/60">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                How does the Apache transition work?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Core packages will be relicensed to Apache&nbsp;2.0 during the public mirror rollout. Existing MIT releases remain
                available; new versions will carry Apache terms and upgraded NOTICE files.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200/50 p-4 dark:border-slate-700/60">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                Can I publish commercial agents?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Yes. Use the vca.chat marketplace to monetise personas or packs, or self-host your own catalog. Apache licensing ensures
                your commercial rights remain intact.
              </p>
            </details>
          </article>
        </div>
      </section>

      {/* Media Showcase Section */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900/60">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">See AgentOS in action</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Pair the runtime with the Voice Chat Assistant demo, AgentOS client workbench, and marketplace-ready personas to
              understand how GMIs stream decisions, artifacts, and guardrail outcomes in real products.
            </p>
          </div>
          <MediaShowcase />
          <div className="mt-8 text-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://app.vca.chat/en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Try Voice Chat Assistant demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/framersai/agentos-client"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand"
              >
                Download AgentOS client
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" aria-labelledby="features-heading" className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 id="features-heading" className="sr-only">Key Features</h2>
          <div className="grid gap-10 md:grid-cols-2">
            {featureCards.map((card) => (
              <article key={card.title} className="glass-panel h-full">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  <card.icon className="h-4 w-4" aria-hidden="true" />
                  {card.pill}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="bg-slate-50 py-24 dark:bg-slate-900/60">
        <div className="mx-auto w-full max-w-7xl px-6">
          <MarketplacePreview />
        </div>
      </section>

      {/* Timeline/Roadmap Section */}
      <section id="telemetry" aria-labelledby="roadmap-heading" className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 shadow dark:bg-slate-950/60 dark:text-slate-300">
              Multi-GMI agencies & workflow automation
            </span>
            <h2 id="roadmap-heading" className="text-3xl font-semibold leading-snug text-slate-900 dark:text-white">
              Coordinate specialised personas, tools, and human approvals in one control plane.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The workflow engine spins up Agencies composed of Generalised Mind Instances, applies guardrail policies, streams progress,
              and hands off to humans when needed. Use it to run research pods, code reviewers, or customer onboarding flows.
            </p>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <Code2 className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" />
                <span>
                  <strong>@agentos/core</strong> &mdash; TypeScript package exporting the orchestrator, workflow runtime, streaming bridge, and guardrail APIs.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkle className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" />
                <span>
                  <strong>Agency templates</strong> &mdash; Declarative descriptors for research trios, review duos, and automation packs shipped as extensions.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" />
                <span>
                  <strong>AgentOS client</strong> &mdash; React workbench for testing personas, watching workflow updates, and replaying streaming payloads.
                </span>
              </li>
            </ul>
          </div>
          <div className="glass-panel relative flex-1 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Product Roadmap</h3>
            {timeline.map((item, index) => (
              <article key={item.title} className="relative pl-8">
                <div
                  className="absolute left-0 top-2 h-10 w-px bg-gradient-to-b from-brand/80 to-transparent"
                  aria-hidden="true"
                  style={{ height: `${item.progress}%` }}
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {item.status}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        className="h-full bg-brand"
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.progress}%</span>
                  </div>
                </motion.div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900/60">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white mb-12">
            What Developers Are Saying
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">â˜…</span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
                  <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation & Resources */}
      <section id="docs" aria-labelledby="docs-heading" className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="glass-panel space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand dark:bg-brand/20 dark:text-brand-foreground">
              Documentation hub
            </span>
            <h2 id="docs-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">Start building in minutes</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Browse the TypeDoc site, explore integration guides, or regenerate the API reference locally. Every exported interface ships
              with rich TSDoc annotations covering streaming invariants, guardrail semantics, and error contracts.
            </p>
            <pre className="overflow-x-auto rounded-2xl border border-slate-200/30 bg-slate-900/90 p-4 text-xs text-slate-100 shadow-lg shadow-slate-900/40 dark:border-slate-700/60">
{`pnpm add @agentos/core

import { AgentOS } from "@agentos/core";

const agentos = new AgentOS();
await agentos.initialize(config);

for await (const chunk of agentos.processRequest(input)) {
  // handle AgentOSResponseChunkType.* events
}`}
            </pre>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                href="https://docs.agentos.sh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse documentation
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                href="https://docs.agentos.sh/typedoc"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open TypeDoc
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                href="https://github.com/framersai/agentos"
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository
              </a>
            </div>
          </article>
          <div className="space-y-6">
            <article className="glass-panel space-y-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resources & support</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Voice Chat Assistant demo for end-to-end voice orchestration</li>
                <li>AgentOS client workbench to inspect streaming payloads</li>
                <li>Marketplace blueprints for distributing personas and packs</li>
                <li>Release automation for mirroring OSS packages and landing pages</li>
              </ul>
            </article>
            <article className="glass-panel space-y-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Stay in the loop</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Join the community newsletter for release notes, roadmap updates, and deep dives on multi-GMI workflows.
              </p>
              <EmailSignupForm />
            </article>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {[
              { value: '10,000+', label: 'Developers' },
              { value: '50+', label: 'Enterprises' },
              { value: '25+', label: 'Countries' },
              { value: '5,000+', label: 'GitHub stars' },
              { value: '2,500+', label: 'Community members' }
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/70"
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        aria-labelledby="cta-heading"
        className="relative overflow-hidden bg-gradient-to-br from-brand via-purple-600 to-brand py-24 text-white"
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/30 blur-3xl" aria-hidden="true" />
        </div>
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 id="cta-heading" className="text-3xl font-semibold">Ready to make AgentOS your runtime?</h2>
          <p className="max-w-2xl text-sm opacity-90">
            AgentOS core is open source under Apache 2.0. Marketplace and site components are MIT. Join the early access list to collaborate with the Frame team, migrate your existing assistant, and shape the roadmap.
          </p>
          <EmailSignupForm />
          <p className="text-xs opacity-70">
            By subscribing you agree to receive product updates from Frame.dev. No spam, pinky promise.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://app.vca.chat/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              <Sparkle className="h-4 w-4" />
              Try Voice Chat Assistant
            </a>
            <a
              href="https://vca.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <TrendingUp className="h-4 w-4" />
              Browse Marketplace
            </a>
            <a
              href="https://github.com/framersai/agentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <Users className="h-4 w-4" />
              Join Community
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          A product by <a href="https://frame.dev" className="text-brand hover:underline">Frame.dev</a>
        </p>
      </div>
      <ScrollToTopButton />
    </>
  );
}




