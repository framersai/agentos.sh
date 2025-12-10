import Link from "next/link";
import { BookOpen, Code2, FileCode, Github } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">AgentOS Documentation</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Complete API reference, guides, and examples for building with AgentOS
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* API Reference */}
          <article className="holographic-card p-8 group h-full transition-all">
            <div className="flex items-center gap-3 text-[var(--color-accent-primary)] mb-4">
              <Code2 className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">API Reference</h2>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Complete TypeDoc-generated API documentation for @framers/agentos package. Explore all classes,
              interfaces, types, and methods.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/docs-generated/library/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:brightness-110"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                View API Reference
              </a>
              <p className="text-xs text-[var(--color-text-muted)]">
                TypeDoc documentation for all exported modules and types
              </p>
            </div>
          </article>

          {/* Guides & Architecture */}
          <article className="holographic-card p-8 group h-full transition-all">
            <div className="flex items-center gap-3 text-[var(--color-accent-primary)] mb-4">
              <FileCode className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Guides</h2>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              In-depth guides covering architecture, planning engine, RAG memory, human-in-the-loop patterns,
              and multi-agent communication.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/framersai/agentos/tree/master/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:brightness-110"
              >
                <FileCode className="h-4 w-4" aria-hidden="true" />
                View Guides
              </a>
              <p className="text-xs text-[var(--color-text-muted)]">
                Architecture, Planning, HITL, Agent Communication, RAG & more
              </p>
            </div>
          </article>

          {/* GitHub Repository */}
          <article className="holographic-card p-8 group h-full transition-all">
            <div className="flex items-center gap-3 text-[var(--color-accent-primary)] mb-4">
              <Github className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Source Code</h2>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Explore the full source code, examples, and contribute to AgentOS on GitHub. MIT licensed and
              open for collaboration.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/framersai/agentos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[var(--color-border-primary)] bg-[var(--color-background-card)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View on GitHub
              </a>
            </div>
          </article>

          {/* Quick Start */}
          <article className="holographic-card p-8 group h-full transition-all">
            <div className="flex items-center gap-3 text-[var(--color-accent-primary)] mb-4">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Getting Started</h2>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              New to AgentOS? Start here with installation instructions, basic concepts, and your first agent.
            </p>
            <div>
              <pre className="code-block overflow-x-auto">
                <code>{`pnpm add @framers/agentos

import { AgentOS } from "@framers/agentos";

const agentos = new AgentOS();
await agentos.initialize(config);`}</code>
              </pre>
              <Link
                href="/#docs"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
              >
                View full quickstart →
              </Link>
            </div>
          </article>
        </div>

        {/* Note about local development */}
        <div className="mt-12 holographic-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            📝 Development Note
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Documentation is auto-generated from source code. To regenerate locally:
          </p>
          <pre className="code-block text-xs">
            <code>pnpm run docs        # Generate all docs{"\n"}pnpm run docs:serve  # Serve at localhost:8080</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
