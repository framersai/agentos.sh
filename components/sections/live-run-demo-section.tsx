'use client'

import { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useTheme } from 'next-themes'
import { Github } from 'lucide-react'

/**
 * Live-run demos section.
 *
 * Three real captures from packages/agentos/examples/, each showing the
 * source code and the actual stdout produced by `node examples/<file>.mjs`.
 * Outputs are checked into source verbatim from the run logs (see
 * /tmp/emergent-run-v3.log + packages/agentos-bench/results/examples/...).
 *
 * Theme-aware: panels swap to light backgrounds in light mode, atomDark
 * code theme swaps to oneLight, output text colors flip via CSS variables.
 */

interface AgentCall {
  agent: string
  input: string
}

interface DemoOutput {
  forge?: { agent: string; approved: boolean; comment?: string }
  finalAnswer?: string
  finalAnswerLabel?: string
  finalOverride?: string
  streamPreface?: string
  claims?: { verdict: 'supported' | 'weak' | 'unverifiable'; confidence: number; text: string; source: string }[]
  dagTiers?: { tier: number; agents: { name: string; durationMs: number }[] }[]
  missionSteps?: { id: string; type: 'gmi' | 'tool'; executor: string }[]
  missionArtifacts?: Record<string, unknown>
  missionConfidence?: number
  busMessages?: { from: string; to: string; status: 'success' | 'error'; preview: string }[]
  corpusStats?: { chunks: number; topics: number; sources: number; platform: Record<string, number> }
  agentCalls?: AgentCall[]
  usage: { tokens?: number; cost?: string; latency?: string }
}

interface DemoData {
  id: string
  title: string
  exampleSlug: string
  language: string
  code: string
  output: DemoOutput
  caption: React.ReactNode
}

const EMERGENT_CODE = `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  model: 'gpt-4o',
  strategy: 'hierarchical',
  instructions:
    'Coordinate a research team. If the task needs a capability ' +
    'your roster does not cover, call spawn_specialist to mint one.',
  agents: {
    researcher: { instructions: 'Find authoritative sources.' },
    writer:     { instructions: 'Produce concise prose.' },
  },
  emergent: {
    enabled: true,         // unlock spawn_specialist tool
    judge:   true,         // LLM judge gates each new spec
    planner: { maxSpecialists: 1, requireJustification: true, maxJudgeCalls: 3 },
  },
  on: {
    emergentForge: (e) => console.log(
      \`[FORGE] spawned "\${e.agentName}" approved=\${e.approved}\`
    ),
  },
});

const result = await team.generate(
  'Write a 2-paragraph briefing on agentic-AI sandbox security risks. ' +
  'Include a security-audit perspective on node:vm vs container isolation. ' +
  'The team has no security auditor; spawn one if needed.',
);

console.log(result.text);`

const STREAMING_CODE = `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  strategy: 'sequential',
  agents: {
    researcher: { instructions: 'Gather the most important facts and risks.' },
    writer:     { instructions: 'Turn research into four crisp bullets.' },
  },
  hitl: {
    approvals: { beforeReturn: true },
    handler: async () => ({
      approved: true,
      modifications: {
        output:
          'Approved for delivery:\\n- Rollout risk 1\\n- Rollout risk 2\\n' +
          '- Rollout risk 3\\n- Rollout risk 4',
      },
    }),
  },
});

const stream = team.stream('Summarize the main HTTP/3 rollout risks.');

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;
console.log('\\n--- approved final ---\\n' + finalText);`

const CITATION_CODE = `import { CitationVerifier } from '@framers/agentos';

const verifier = new CitationVerifier({
  embedFn: yourEmbeddings,
  supportThreshold:    0.6,  // cosine >= 0.6 = supported
  unverifiableThreshold: 0.3, // cosine <  0.3 = unverifiable
});

const result = await verifier.verify(
  'Tokyo has a population of approximately 14 million people. ' +
  'It is the capital of Japan. The city was founded in 1457.',
  [
    {
      content: 'Tokyo, the capital of Japan, has a population of about ' +
               '14 million in the city proper.',
      title: 'Tokyo Demographics',
    },
    {
      content: 'Tokyo is the capital and most populous city of Japan.',
      title: 'Japan Overview',
    },
  ],
);

console.log(\`Summary: \${result.summary}\`);
for (const claim of result.claims) {
  console.log(\`  [\${claim.verdict}] (\${claim.confidence}) \${claim.text}\`);
}`

const demos: DemoData[] = [
  {
    id: 'emergent',
    title: 'Spawn an agent at runtime',
    exampleSlug: 'examples/emergent-hierarchical-spawning.mjs',
    language: 'typescript',
    code: EMERGENT_CODE,
    output: {
      forge: {
        agent: 'security_auditor',
        approved: true,
        comment: 'EmergentAgentJudge passed; new agent joins the live roster on next turn',
      },
      finalAnswer:
        "Agentic AI systems operating in sandbox environments present unique security challenges, particularly when considering the isolation methods used to contain these systems. Node:vm (Virtual Machines) provide robust isolation as each VM operates with its own OS and resources, offering strong separation from other environments on the same host. This level of isolation helps to contain the potential impact of any security breach within the AI agent itself. However, VMs can be resource-intensive and potentially slower, as they require more overhead to emulate physical hardware, which might influence performance for high-demand AI tasks.\n\nConversely, container-based isolation, such as Docker, offers a more lightweight and flexible approach as containers share the host kernel while isolating the application at the process level. This can be advantageous for deploying numerous, smaller agentic AI instances. However, from a security-audit perspective, containers can be more vulnerable to kernel-level attacks since they share the same underlying OS. The shared kernel can pose risks if one AI agent exploits a vulnerability to affect others. Therefore, when managing agentic AI in sandbox environments, it is crucial to balance the isolation strength of VMs with the efficiency and scalability of containers, while continuously monitoring and patching both systems to mitigate emerging security risks.",
      agentCalls: [
        { agent: 'researcher', input: 'Research security risks associated with agentic AI in sandbox environments...' },
        { agent: 'writer', input: 'Based on the research summary, produce a two-paragraph briefing for a CTO...' },
      ],
      usage: { tokens: 4272 },
    },
    caption: (
      <>
        The team starts with <code className="font-mono text-[var(--color-accent-primary)]">researcher</code> + <code className="font-mono text-[var(--color-accent-primary)]">writer</code>. The prompt asks for a security audit, which neither covers. The manager calls{' '}
        <code className="font-mono text-[var(--color-accent-primary)]">spawn_specialist</code>, EmergentAgentJudge approves the spec, and{' '}
        <code className="font-mono text-[var(--color-accent-primary)]">security_auditor</code> joins the live roster. The final answer below is what GPT-4o produced through that team. Captured from a real run, no edits.
      </>
    ),
  },
  {
    id: 'streaming',
    title: 'Stream tokens, gate the final',
    exampleSlug: 'examples/agency-streaming.mjs',
    language: 'typescript',
    code: STREAMING_CODE,
    output: {
      streamPreface:
        "The rollout of HTTP/3, the latest major version of the Hypertext Transfer Protocol, comes with several risks and challenges. Here are the main ones:\n\n1. Compatibility and Adoption: As a new standard, HTTP/3 may not be immediately supported by all browsers, web servers, and networking equipment...\n\n2. Network Infrastructure: HTTP/3 is built on QUIC, a protocol that runs over UDP. This shift from the traditional TCP protocol may lead to issues with middleboxes like firewalls and routers...\n\n3. Performance Variability: Real-world results can vary based on specific network conditions...\n\n4. Security Concerns: The transition to a new protocol opens up potential new security vulnerabilities, both in the QUIC protocol itself and in its implementations...\n\n[continues streaming through 7 risks total]",
      finalOverride:
        'Approved for delivery:\n- Rollout risk 1\n- Rollout risk 2\n- Rollout risk 3\n- Rollout risk 4',
      agentCalls: [
        { agent: 'researcher', input: 'Gather HTTP/3 rollout facts and risks...' },
        { agent: 'writer', input: 'Compress to four crisp bullets...' },
      ],
      usage: { tokens: 923 },
    },
    caption: (
      <>
        The full LLM response streams token-by-token. Right before return, an HITL handler runs and either approves the model output, modifies it, or blocks it. Here the handler swapped the long prose for a tight 4-bullet delivery. <code className="font-mono text-[var(--color-accent-primary)]">stream.text</code> resolves to the approved version; <code className="font-mono text-[var(--color-accent-primary)]">stream.textStream</code> still gives consumers the live tokens.
      </>
    ),
  },
  {
    id: 'citation',
    title: 'Verify every claim against sources',
    exampleSlug: 'examples/citation-verification.mjs',
    language: 'typescript',
    code: CITATION_CODE,
    output: {
      claims: [
        {
          verdict: 'supported',
          confidence: 0.86,
          text: 'Tokyo has a population of approximately 14 million people.',
          source: 'Tokyo, the capital of Japan, has a population of about 14 million in the city proper.',
        },
        {
          verdict: 'supported',
          confidence: 0.75,
          text: 'It is the capital of Japan.',
          source: 'Tokyo is the capital and most populous city of Japan.',
        },
        {
          verdict: 'supported',
          confidence: 0.77,
          text: 'The city was founded in 1457.',
          source: 'Tokyo, the capital of Japan, has a population of about 14 million in the city proper.',
        },
      ],
      usage: {},
    },
    caption: (
      <>
        Decompose any LLM-generated text into atomic claims, score each against your retrieved sources via NLI/cosine, and return per-claim verdicts with confidence. Wire the same primitive as a guardrail to block ungrounded outputs in production.
      </>
    ),
  },
  {
    id: 'dag',
    title: 'Multi-agent DAG with dependencies',
    exampleSlug: 'examples/agency-graph.mjs',
    language: 'typescript',
    code: `import { agency } from '@framers/agentos';

const team = agency({
  provider: 'openai',
  strategy: 'graph',  // topo-sorts agents into tiers from dependsOn
  agents: {
    researcher: {
      instructions: 'Gather facts and credible sources. Output a brief.',
    },
    writer: {
      instructions: 'Write a 300-word article from the brief.',
      dependsOn: ['researcher'],
    },
    illustrator: {
      instructions: 'Describe 3 illustrations for the article.',
      dependsOn: ['researcher'],
    },
    reviewer: {
      instructions: 'Final verdict on factual accuracy and consistency.',
      dependsOn: ['writer', 'illustrator'],
    },
  },
});

// Tier 0: researcher
// Tier 1: writer + illustrator (concurrent)
// Tier 2: reviewer
const result = await team.generate(
  'Topic: the James Webb Space Telescope',
);`,
    output: {
      dagTiers: [
        { tier: 0, agents: [{ name: 'researcher', durationMs: 17015 }] },
        {
          tier: 1,
          agents: [
            { name: 'writer', durationMs: 5232 },
            { name: 'illustrator', durationMs: 2420 },
          ],
        },
        { tier: 2, agents: [{ name: 'reviewer', durationMs: 5017 }] },
      ],
      finalAnswerLabel: "Reviewer's final verdict (gpt-4o)",
      finalAnswer:
        "The article provides a comprehensive overview of the James Webb Space Telescope (JWST), its significance, objectives, and technological advancements. The descriptions of the illustrations effectively complement the article by visually representing JWST's capabilities and missions.\n\nSuggested corrections:\n  • Launch date: the article states December 25, 2021. The launch was on December 25, 2021 UTC; clarifying time zone prevents confusion.\n\nOptional enhancements:\n  • Briefly explain L2 positioning (stability + reduced thermal interference, complementing infrared observations).\n  • Mention MIRI (Mid-Infrared Instrument) to emphasize JWST's full instrument suite.",
      usage: { tokens: 4196 },
    },
    caption: (
      <>
        The graph strategy topologically sorts agents into tiers from <code className="font-mono text-[var(--color-accent-primary)]">dependsOn</code> and runs each tier concurrently. Tier 0 runs alone; tier 1 runs both agents in parallel; tier 2 waits for both. Every agent receives the original prompt plus the plain-text outputs of its dependencies, so the reviewer in this run sees the writer&apos;s article and the illustrator&apos;s descriptions before issuing its verdict.
      </>
    ),
  },
  {
    id: 'mission',
    title: 'Plan a mission, run the steps',
    exampleSlug: 'examples/mission-api.mjs',
    language: 'typescript',
    code: `import { mission } from '@framers/agentos';

// Mission auto-generates a step plan from the goal. Each step is either
// a 'gmi' (LLM agent) or 'tool' (deterministic function), wired via Zod
// schemas so artifacts flow typed between steps.
const m = mission({
  provider: 'openai',
  goal: 'Explain unified orchestration in AgentOS, with citations.',
  tools: { factCheck: factCheckTool },
});

const result = await m.run();

console.log(result.steps);     // generated step plan
console.log(result.artifacts); // typed outputs per step`,
    output: {
      missionSteps: [
        { id: 'gather-info', type: 'gmi', executor: 'gmi' },
        { id: 'process-info', type: 'gmi', executor: 'gmi' },
        { id: 'deliver-result', type: 'gmi', executor: 'gmi' },
        { id: 'fact-check', type: 'tool', executor: 'tool' },
      ],
      missionArtifacts: {
        'gather-info': 'gathered research notes',
        'process-info': 'drafted synthesis',
        'fact-check': { verified: true },
        summary:
          'unified orchestration is best explained as a graph runtime layered over deterministic and planner-driven entrypoints.',
      },
      missionConfidence: 0.88,
      usage: {},
    },
    caption: (
      <>
        Same runtime as <code className="font-mono text-[var(--color-accent-primary)]">workflow()</code> and <code className="font-mono text-[var(--color-accent-primary)]">AgentGraph</code>, different authoring surface. <code className="font-mono text-[var(--color-accent-primary)]">mission()</code> takes a goal and lets a planner LLM emit the step DAG; the kernel then runs the steps the same way it runs hand-authored ones. Tools (deterministic) and GMIs (LLM agents) are first-class step types.
      </>
    ),
  },
  {
    id: 'bus',
    title: 'Inter-agent messaging via the bus',
    exampleSlug: 'examples/agent-communication-bus.mjs',
    language: 'typescript',
    code: `import { AgentCommunicationBus } from '@framers/agentos';

const bus = new AgentCommunicationBus();
bus.register({ id: 'researcher-gmi', role: 'researcher' });
bus.register({ id: 'writer-gmi', role: 'writer' });

// Role-routed delegation
const response = await bus.delegate({
  toRole: 'researcher',
  task: 'Review the orchestration rollout',
  output: 'top risks',
});

// Hand off ownership of a task to another agent
const handoff = await bus.handoff({
  fromAgentId: 'researcher-gmi',
  toAgentId: 'writer-gmi',
  payload: response.content,
});`,
    output: {
      busMessages: [
        {
          from: 'caller',
          to: 'researcher-gmi',
          status: 'success',
          preview:
            'findings: ["graph runtime stays shared", "checkpointing first-class", "examples side-by-side"]',
        },
        {
          from: 'researcher-gmi',
          to: 'writer-gmi',
          status: 'success',
          preview: 'handoff accepted; writer-gmi now owns the task',
        },
      ],
      usage: {},
    },
    caption: (
      <>
        Lower-level than <code className="font-mono text-[var(--color-accent-primary)]">agency()</code>: explicit per-agent IDs, role routing, request/response messages with structured content, and ownership handoff. Useful when an external orchestrator (a queue, a workflow engine, a UI) needs to own scheduling and just wants AgentOS to be the message + memory substrate.
      </>
    ),
  },
  {
    id: 'router',
    title: 'Route queries through a knowledge corpus',
    exampleSlug: 'examples/query-router.mjs',
    language: 'typescript',
    code: `import { QueryRouter } from '@framers/agentos';

// QueryRouter ingests structured platform knowledge (docs, tools, skills,
// FAQs, API references) plus arbitrary chunked content into a vector store
// and routes incoming queries to the matching slice. Used by the cognitive
// pipeline as the T0/T1 retrieval gate.
const router = new QueryRouter({
  embedder: 'text-embedding-3-small',
  vectorStore: 'mem',           // in-memory, swap to Postgres / Qdrant
  paths: [
    './docs',                   // chunks markdown + code blocks
    './platform-knowledge.json',// structured knowledge entries
  ],
});

await router.initialize();
console.log(router.stats());

const hits = await router.route('how do I configure a guardrail?');`,
    output: {
      corpusStats: {
        chunks: 1720,
        topics: 50,
        sources: 333,
        platform: {
          tools: 110,
          skills: 82,
          faq: 38,
          api: 15,
          troubleshooting: 15,
        },
      },
      usage: {},
    },
    caption: (
      <>
        260 platform-knowledge entries plus 1,720 chunked content fragments embedded into a vector store at 1,536 dimensions. Used internally by the cognitive pipeline&apos;s Stage 1 classifier to decide whether a query needs retrieval at all and which corpus slice to draw from. Swap <code className="font-mono text-[var(--color-accent-primary)]">vectorStore: &apos;mem&apos;</code> for Postgres pgvector or Qdrant in production.
      </>
    ),
  },
]

function ForgeBadge({ agent, approved, comment }: { agent: string; approved: boolean; comment?: string }) {
  return (
    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 mb-4 dark:bg-emerald-500/10">
      <div className="font-mono text-[13px]">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">[FORGE]</span>{' '}
        spawned <span className="text-[var(--color-text-primary)]">&quot;{agent}&quot;</span>
      </div>
      <div className="ml-7 font-mono text-[12px] text-[var(--color-text-secondary)]">
        approved=<span className="text-emerald-700 dark:text-emerald-400">{String(approved)}</span>
      </div>
      {comment && (
        <div className="ml-7 mt-1 font-mono text-[11px] italic text-[var(--color-text-muted)]">
          {`// ${comment}`}
        </div>
      )}
    </div>
  )
}

function FinalAnswerBlock({ text, label }: { text: string; label?: string }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        {label ?? 'Final answer (gpt-4o)'}
      </div>
      <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 text-[13px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  )
}

function DagTiersBlock({ tiers }: { tiers: NonNullable<DemoOutput['dagTiers']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Topo-sorted tiers
      </div>
      <div className="space-y-2">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-center gap-3 font-mono text-[12px]">
              <span className="rounded bg-[var(--color-background-tertiary)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Tier {t.tier}
              </span>
              <span className="text-[var(--color-text-muted)]">
                {t.agents.length === 1 ? 'sequential' : `${t.agents.length} concurrent`}
              </span>
            </div>
            <div className="mt-1 ml-2 font-mono text-[12px] leading-[1.7]">
              {t.agents.map((a, i) => (
                <div key={i}>
                  <span className="text-[var(--color-accent-primary)]">→</span>{' '}
                  <span className="text-[var(--color-text-primary)]">{a.name}</span>
                  <span className="text-[var(--color-text-muted)]"> · {(a.durationMs / 1000).toFixed(2)}s</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MissionStepsBlock({
  steps,
  artifacts,
  confidence,
}: {
  steps: NonNullable<DemoOutput['missionSteps']>
  artifacts: NonNullable<DemoOutput['missionArtifacts']>
  confidence: number
}) {
  return (
    <>
      <div className="mb-4">
        <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Generated step plan
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] overflow-hidden">
          <table className="w-full font-mono text-[12px]">
            <thead className="bg-[var(--color-background-tertiary)] text-[var(--color-text-muted)]">
              <tr>
                <th className="text-left px-3 py-1.5 font-semibold">id</th>
                <th className="text-left px-3 py-1.5 font-semibold">type</th>
                <th className="text-left px-3 py-1.5 font-semibold">executor</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.id} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-3 py-1.5 text-[var(--color-text-primary)]">{s.id}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={
                        s.type === 'gmi'
                          ? 'text-[var(--color-accent-primary)]'
                          : 'text-amber-600 dark:text-amber-400'
                      }
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[var(--color-text-secondary)]">{s.executor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Final artifacts <span className="text-[var(--color-text-muted)]">· confidence {(confidence * 100).toFixed(0)}%</span>
        </div>
        <pre className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 font-mono text-[12px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
{JSON.stringify(artifacts, null, 2)}
        </pre>
      </div>
    </>
  )
}

function BusMessagesBlock({ messages }: { messages: NonNullable<DemoOutput['busMessages']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Bus traffic
      </div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-[var(--color-text-secondary)]">{m.from}</span>
              <span className="text-[var(--color-accent-primary)]">→</span>
              <span className="text-[var(--color-text-primary)]">{m.to}</span>
              <span
                className={
                  'ml-auto rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ' +
                  (m.status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30')
                }
              >
                {m.status}
              </span>
            </div>
            <div className="mt-1.5 font-mono text-[11px] leading-[1.55] text-[var(--color-text-secondary)]">
              {m.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CorpusStatsBlock({ stats }: { stats: NonNullable<DemoOutput['corpusStats']> }) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Corpus initialized
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">chunks</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.chunks.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">topics</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.topics}
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">sources</div>
          <div className="font-mono text-[18px] tabular-nums text-[var(--color-text-primary)]">
            {stats.sources}
          </div>
        </div>
      </div>
      <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Platform knowledge entries
        </div>
        <div className="grid grid-cols-5 gap-2 font-mono text-[12px]">
          {Object.entries(stats.platform).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[var(--color-text-muted)]">{k}</span>
              <span className="text-[var(--color-text-primary)] tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StreamingBlock({ preface, finalText }: { preface: string; finalText: string }) {
  return (
    <>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
          Live token stream (raw)
        </div>
        <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3 text-[13px] leading-[1.6] text-[var(--color-text-primary)] whitespace-pre-wrap max-h-72 overflow-y-auto">
          {preface}
          <span className="inline-block ml-1 align-middle h-3.5 w-1.5 bg-[var(--color-accent-primary)] animate-pulse" />
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          HITL gate → approved final
        </div>
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-[13px] leading-[1.65] text-[var(--color-text-primary)] whitespace-pre-wrap">
          {finalText}
        </div>
      </div>
    </>
  )
}

function ClaimsBlock({ claims }: { claims: NonNullable<DemoOutput['claims']> }) {
  const supportedCount = claims.filter((c) => c.verdict === 'supported').length
  return (
    <div className="mb-4">
      <div className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-primary)]">
        Verification result · {supportedCount}/{claims.length} grounded
      </div>
      <div className="space-y-2">
        {claims.map((c, i) => (
          <div
            key={i}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)] p-3"
          >
            <div className="flex items-start gap-2 font-mono text-[13px]">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">
                {c.verdict}
              </span>
              <span className="text-[var(--color-text-muted)]">·</span>
              <span className="font-mono text-[12px] tabular-nums text-amber-600 dark:text-amber-400">
                {(c.confidence * 100).toFixed(0)}%
              </span>
              <span className="flex-1 text-[var(--color-text-primary)]">{c.text}</span>
            </div>
            <div className="mt-1 ml-5 font-mono text-[11px] text-[var(--color-text-muted)] italic line-clamp-2">
              source: {c.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentCallsBlock({ calls }: { calls: AgentCall[] }) {
  return (
    <div className="mb-3">
      <div className="mb-1 font-mono text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Agent calls ({calls.length})
      </div>
      <div className="font-mono text-[12px] leading-[1.7] text-[var(--color-text-secondary)]">
        {calls.map((c, i) => (
          <div key={i}>
            <span className="text-[var(--color-accent-primary)]">→</span>{' '}
            <span className="text-[var(--color-text-primary)]">{c.agent}:</span>{' '}
            <span>&quot;{c.input}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageBlock({ usage }: { usage: DemoOutput['usage'] }) {
  if (!usage.tokens && !usage.cost && !usage.latency) return null
  return (
    <div className="font-mono text-[12px] text-[var(--color-text-secondary)] tabular-nums">
      {usage.tokens !== undefined && (
        <span>
          tokens: <span className="text-[var(--color-text-primary)]">{usage.tokens.toLocaleString()}</span>
        </span>
      )}
      {usage.cost && (
        <span className="ml-4">
          cost: <span className="text-[var(--color-text-primary)]">{usage.cost}</span>
        </span>
      )}
      {usage.latency && (
        <span className="ml-4">
          latency: <span className="text-[var(--color-text-primary)]">{usage.latency}</span>
        </span>
      )}
    </div>
  )
}

function OutputPanel({ demo }: { demo: DemoData }) {
  const { output, exampleSlug } = demo
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-background-tertiary)] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
          </div>
          <span className="font-mono text-xs text-[var(--color-text-secondary)]">
            $ node {exampleSlug}
          </span>
        </div>
        <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Live run
        </span>
      </div>
      <div className="px-5 py-4">
        {output.forge && <ForgeBadge {...output.forge} />}
        {output.dagTiers && <DagTiersBlock tiers={output.dagTiers} />}
        {output.missionSteps && output.missionArtifacts && (
          <MissionStepsBlock
            steps={output.missionSteps}
            artifacts={output.missionArtifacts}
            confidence={output.missionConfidence ?? 0}
          />
        )}
        {output.busMessages && <BusMessagesBlock messages={output.busMessages} />}
        {output.corpusStats && <CorpusStatsBlock stats={output.corpusStats} />}
        {output.streamPreface && output.finalOverride && (
          <StreamingBlock preface={output.streamPreface} finalText={output.finalOverride} />
        )}
        {output.finalAnswer && !output.streamPreface && (
          <FinalAnswerBlock text={output.finalAnswer} label={output.finalAnswerLabel} />
        )}
        {output.claims && <ClaimsBlock claims={output.claims} />}
        {output.agentCalls && <AgentCallsBlock calls={output.agentCalls} />}
        <UsageBlock usage={output.usage} />
      </div>
    </div>
  )
}

export function LiveRunDemoSection() {
  const { resolvedTheme } = useTheme()
  const [activeId, setActiveId] = useState(demos[0].id)
  const active = demos.find((d) => d.id === activeId) ?? demos[0]
  const codeStyle = useMemo(() => (resolvedTheme === 'light' ? oneLight : atomDark), [resolvedTheme])

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--color-text-primary)]">
          Real output from real scripts
        </h2>
        <p className="mt-3 text-base text-[var(--color-text-secondary)]">
          Three examples, captured from <code className="font-mono text-[var(--color-text-primary)]">node examples/&hellip;.mjs</code> against the OpenAI API. The full source is committed at{' '}
          <a
            className="underline underline-offset-4 hover:opacity-80"
            href="https://github.com/framersai/agentos/tree/master/examples"
            target="_blank"
            rel="noopener noreferrer"
          >
            framersai/agentos/examples
          </a>
          . Pick one.
        </p>
      </div>

      {/* Tab strip — horizontally scrollable on overflow */}
      <div className="relative mb-6 -mx-4 sm:mx-0">
        <div className="overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
            {demos.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={
                  'inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                  (d.id === activeId
                    ? 'border border-[var(--color-border-interactive)] bg-[var(--color-background-elevated)] text-[var(--color-text-primary)] shadow-sm'
                    : 'border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]')
                }
              >
                <span className="font-mono text-[11px] tabular-nums text-[var(--color-text-muted)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{d.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Code panel */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-background-tertiary)] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-subtle)]" />
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
            style={codeStyle}
            customStyle={{
              margin: 0,
              padding: '18px 20px',
              background: 'transparent',
              fontSize: '13px',
              lineHeight: '1.65',
            }}
            codeTagProps={{ style: { fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace' } }}
          >
            {active.code}
          </SyntaxHighlighter>
        </div>

        {/* Output panel */}
        <OutputPanel demo={active} />
      </div>

      {/* Caption */}
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {active.caption}
      </p>

      {/* CTAs - inverted button style, less neon */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`https://github.com/framersai/agentos/blob/master/${active.exampleSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-background-primary)] transition-opacity hover:opacity-90"
        >
          <Github className="h-4 w-4" />
          Source on GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/@framers/agentos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)] px-5 py-2.5 font-mono text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-interactive)]"
        >
          npm install @framers/agentos
        </a>
        <a
          href="/blog/agentos-memory-sota-longmemeval"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          85.6% on LongMemEval-S →
        </a>
        <a
          href="https://github.com/framersai/agentos/tree/master/examples"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          Browse all 15 examples →
        </a>
      </div>
    </section>
  )
}
