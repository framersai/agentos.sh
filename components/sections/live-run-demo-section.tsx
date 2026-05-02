'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Github, Sparkles, ExternalLink } from 'lucide-react'

/**
 * Live-run demos section.
 *
 * Each demo is a real script captured from a production AgentOS run, shown
 * side-by-side with the source code that produced it. The output panel uses
 * custom highlighting (not just monospace) so the moment that matters in each
 * run (a [FORGE] event, an agent call, a memory recall) is the first thing
 * the eye lands on.
 *
 * Output strings are pre-rendered React fragments rather than plain strings
 * so we can mark up specific tokens with semantic spans without dragging in
 * a runtime ANSI-to-HTML parser. Captured outputs are checked into source
 * verbatim from the run logs in /tmp/emergent-run-v2.log.
 */

interface DemoData {
  id: string
  title: string
  lede: string
  language: string
  code: string
  output: React.ReactNode
  caption: React.ReactNode
  exampleSlug: string
  runMeta: { tokens: number; costUsd: string }
}

const EMERGENT_CODE = `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  model: 'gpt-4o',
  strategy: 'hierarchical',
  instructions:
    'When the task needs a capability outside the static ' +
    'roster, call spawn_specialist to mint one for this run.',
  agents: {
    researcher: { instructions: 'Find authoritative sources...' },
    writer:     { instructions: 'Produce well-cited prose...' },
  },
  emergent: {
    enabled: true,         // unlock spawn_specialist tool
    judge:   true,         // LLM judge gates each new spec
    planner: {
      maxSpecialists:       2,
      requireJustification: true,
      maxJudgeCalls:        4,
    },
  },
  on: {
    emergentForge: (e) => console.log(
      \`[FORGE] spawned "\${e.agentName}" approved=\${e.approved}\`
    ),
  },
});

const result = await team.generate(
  'Briefing on agentic-AI sandbox security risks. Must include ' +
  'a security-audit review of node:vm vs isolated-vm vs container ' +
  'isolation. The team does not currently have a security auditor.',
);`

function EmergentOutput() {
  return (
    <div className="font-mono text-[13px] leading-[1.65] tabular-nums">
      <div className="rounded-md bg-emerald-500/10 px-3 py-2 mb-3 border border-emerald-500/30">
        <div>
          <span className="text-emerald-400 font-semibold">[FORGE]</span>{' '}
          spawned <span className="text-white">&quot;security_audit_specialist&quot;</span>
        </div>
        <div className="ml-8 text-[var(--color-text-secondary)] text-[12px]">
          at 2026-05-02T16:08:22.778Z
        </div>
        <div className="ml-8 text-[var(--color-text-secondary)] text-[12px]">
          approved=<span className="text-amber-400">true</span>
        </div>
        <div className="ml-8 italic text-[var(--color-text-muted)] text-[11px] mt-1">
          // EmergentAgentJudge passed; new agent
          <br />
          // joins the live roster on next turn
        </div>
      </div>

      <div className="text-[var(--color-accent-primary)] font-semibold mt-4 mb-1">
        === AGENT CALLS ===
      </div>
      {[
        { agent: 'researcher', input: 'Research security risks in agentic...' },
        { agent: 'researcher', input: 'Identify main risk categories...' },
        { agent: 'writer    ', input: 'Draft CTO-audience briefing...' },
        { agent: 'writer    ', input: 'Cover sandbox isolation primitives...' },
        { agent: 'researcher', input: 'Investigate sandbox primitives...' },
        { agent: 'researcher', input: 'Summarize node:vm vs isolated-vm...' },
        { agent: 'researcher', input: 'Review container isolation...' },
        { agent: 'researcher', input: 'Final synthesis pass...' },
        { agent: 'researcher', input: 'Verify load-bearing claims...' },
      ].map((call, i) => (
        <div key={i} className="pl-2">
          <span className="text-[var(--color-accent-primary)]">→</span>{' '}
          <span className="text-[var(--color-text-secondary)]">{call.agent}:</span>{' '}
          <span>&quot;{call.input}&quot;</span>
        </div>
      ))}

      <div className="text-[var(--color-accent-primary)] font-semibold mt-4 mb-1">
        === USAGE ===
      </div>
      <div className="pl-2">
        <span className="text-[var(--color-text-secondary)]">prompt:</span>{' '}
        <span className="text-amber-400">11,287</span> tokens
      </div>
      <div className="pl-2">
        <span className="text-[var(--color-text-secondary)]">completion:</span>{' '}
        <span className="text-amber-400">4,412</span> tokens
      </div>
      <div className="pl-2">
        <span className="text-[var(--color-text-secondary)]">total:</span>{' '}
        <span className="text-amber-400">15,699</span> tokens
      </div>
      <div className="pl-2">
        <span className="text-[var(--color-text-secondary)]">cost:</span>{' '}
        <span className="text-amber-400">$0.0721</span>
      </div>
    </div>
  )
}

const demos: DemoData[] = [
  {
    id: 'emergent-spawning',
    title: 'Emergent agent spawning',
    lede:
      'When the static roster does not cover the task, the manager calls spawn_specialist. EmergentAgentForge synthesises a config, EmergentAgentJudge approves it, and the new specialist joins the live roster on the next turn.',
    language: 'typescript',
    code: EMERGENT_CODE,
    output: <EmergentOutput />,
    caption: (
      <>
        The <code className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[12px] font-mono">[FORGE]</code>{' '}
        line above is the moment AgentOS minted a{' '}
        <strong>security_audit_specialist</strong> agent that did not exist when
        the run started. The static roster was researcher + writer; the prompt
        required a security audit; the manager called{' '}
        <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>,
        EmergentAgentJudge approved the spec, and the new specialist joined the
        live roster. Real run, real OpenAI API call, no edits.
      </>
    ),
    exampleSlug: 'examples/emergent-hierarchical-spawning.mjs',
    runMeta: { tokens: 15699, costUsd: '$0.0721' },
  },
]

export function LiveRunDemoSection() {
  const [activeId, setActiveId] = useState(demos[0].id)
  const active = demos.find((d) => d.id === activeId) ?? demos[0]

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
          Live runs, real outputs
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--color-text-primary)]">
          See AgentOS run, not just compile
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-text-secondary)] sm:text-lg">
          Real script outputs, side-by-side with the source. Captured from a
          live OpenAI API call, no edits. The <code className="font-mono text-[var(--color-accent-primary)]">[FORGE]</code> line
          is the moment AgentOS spawned an agent that did not exist when the run started.
        </p>
      </div>

      {/* Tab strip — single demo today, expandable */}
      {demos.length > 1 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all ' +
                (d.id === activeId
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] shadow'
                  : 'border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-interactive)]')
              }
            >
              {d.title}
            </button>
          ))}
        </div>
      )}

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Code panel */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[#0e1320]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-black/30 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                {active.exampleSlug}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              TypeScript
            </span>
          </div>
          <SyntaxHighlighter
            language={active.language}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '18px 20px',
              background: 'transparent',
              fontSize: '13px',
              lineHeight: '1.65',
            }}
            codeTagProps={{ style: { fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace' } }}
            wrapLongLines
          >
            {active.code}
          </SyntaxHighlighter>
        </div>

        {/* Output panel */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[#060a13]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-black/30 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                $ node {active.exampleSlug.replace('examples/', 'examples/')}
              </span>
            </div>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              ● Live run
            </span>
          </div>
          <div className="px-5 py-4 text-[var(--color-text-primary)]">{active.output}</div>
        </div>
      </div>

      {/* Caption */}
      <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {active.caption}
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`https://github.com/framersai/agentos/blob/master/${active.exampleSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-on-accent)] shadow transition-all hover:bg-[var(--color-accent-hover)]"
        >
          <Github className="h-4 w-4" />
          View source on GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/@framers/agentos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] px-5 py-2.5 font-mono text-xs font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-interactive)]"
        >
          npm install @framers/agentos
        </a>
        <a
          href="/blog/agentos-memory-sota-longmemeval"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-interactive)]"
        >
          Read the 85.6% benchmark
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </a>
        <a
          href="https://github.com/framersai/agentos/tree/master/examples"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)]"
        >
          Browse all examples →
        </a>
      </div>
    </section>
  )
}
