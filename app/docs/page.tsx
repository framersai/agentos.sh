import Link from "next/link";
import { BookOpen, Code2, FileCode, Github } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">AgentOS Documentation</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Complete API reference, guides, and examples for building with AgentOS
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* GMIs, Agents, Agency */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">GMIs, Agents, and Agency</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Generalised Mind Instances (GMIs) package persona prompts, memory, tools, and guardrails into reusable minds.
              Agents wrap GMIs for product surfaces. Agencies coordinate multiple GMIs (and humans) via workflows.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Policy-aware by design with guardrail hooks and entitlements</li>
              <li>Versioned and exportable as JSON for audits and portability</li>
              <li>Runs across cloud, desktop, mobile, and browser with capability-aware fallbacks</li>
            </ul>
            <div className="mt-6">
              <a
                href="/docs-generated/library/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
              >
                Explore types in TypeDoc
              </a>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                See also: docs/GMIS_AGENTS_AGENCY.md for a high-level overview.
              </p>
            </div>
          </article>

          {/* API Reference */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <Code2 className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">API Reference</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Complete TypeDoc-generated API documentation for @agentos/core package. Explore all classes,
              interfaces, types, and methods.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/docs-generated/library/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                View API Reference
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TypeDoc documentation for all exported modules and types
              </p>
            </div>
          </article>

          {/* Backend API */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <FileCode className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Backend API</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              REST API documentation for the AgentOS backend server. View all endpoints, request/response
              schemas, and examples.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/docs-generated/api/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <FileCode className="h-4 w-4" aria-hidden="true" />
                View Backend API
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-generated from Express routes and OpenAPI spec
              </p>
            </div>
          </article>

          {/* AgentOS HTTP Endpoints (Quick) */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <FileCode className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AgentOS HTTP Endpoints</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Minimal REST surface for orchestration and streaming. See the full Backend API for schemas.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900/90 p-4 text-xs text-slate-100">
{`POST /api/agentos/chat
GET  /api/agentos/stream?userId=...&conversationId=...&mode=...&messages=[...]&workflowRequest={}
GET  /api/agentos/personas?capability=...&tier=...&search=...
GET  /api/agentos/workflows/definitions
POST /api/agentos/workflows/start`}
            </pre>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900/90 p-4 text-xs text-slate-100">
{`curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "default",
    "messages": [ { "role": "user", "content": "hello" } ]
  }' \
  https://your-host/api/agentos/chat`}
            </pre>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Tip: Use the SSE stream for incremental updates during long-running turns.
            </p>
          </article>

          {/* GitHub Repository */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <Github className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Source Code</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Explore the full source code, examples, and contribute to AgentOS on GitHub. MIT licensed and
              open for collaboration.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://github.com/framersai/agentos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View on GitHub
              </a>
            </div>
          </article>

          {/* Quick Start */}
          <article className="glass-panel group h-full transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 text-brand">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Getting Started</h2>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              New to AgentOS? Start here with installation instructions, basic concepts, and your first agent.
            </p>
            <div className="mt-6">
              <pre className="overflow-x-auto rounded-lg bg-slate-900/90 p-4 text-xs text-slate-100">
                <code>{`pnpm add @framersai/agentos

import { AgentOS } from "@framersai/agentos";

const agentos = new AgentOS();
await agentos.initialize(config);`}</code>
              </pre>
              <Link
                href="/#docs"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
              >
                View full quickstart →
              </Link>
            </div>
          </article>
        </div>

        {/* Licensing & roadmap notes */}
        <div className="mt-12 rounded-2xl border border-slate-200/40 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Licensing</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            AgentOS core (\`@agentos/core\`) is Apache 2.0. Marketplace and site components are MIT. vca.chat hosts a public marketplace
            for sharing and monetising agents and packs.
          </p>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Roadmap</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Multi-GMI agency templates and role bindings</li>
            <li>Hosted control plane (streams, observability, compliance)</li>
            <li>Pack ecosystem (guardrails, tools, workflows)</li>
          </ul>
        </div>

        {/* Note about local development */}
        <div className="mt-12 rounded-2xl border border-slate-200/40 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            📝 Development Note
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Documentation is auto-generated from source code. To regenerate locally:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900/90 p-3 text-xs text-slate-100">
            <code>pnpm run docs        # Generate all docs{"\n"}pnpm run docs:serve  # Serve at localhost:8080</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
