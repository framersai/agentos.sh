---
title: "Announcing AgentOS: Open-Source TypeScript AI Agent Runtime"
date: "2026-04-12"
excerpt: "AgentOS is an open-source TypeScript runtime for building AI agents with cognitive memory, HEXACO personality, multi-agent orchestration, runtime tool forging, 37 channel adapters, and 21 LLM providers. Apache 2.0 licensed."
author: "AgentOS Team"
category: "Announcements"
image: "/img/blog/og/announcing-agentos.png"
keywords: "agentos launch, ai agent framework, typescript ai agents, build ai agent, multi-agent orchestration, cognitive memory, open source ai framework, langgraph alternative, crewai alternative, mastra alternative, adaptive ai agents, emergent tool forging, agent simulation framework, AI agent SDK TypeScript"
---

## What AgentOS Is

[AgentOS](https://agentos.sh) is a TypeScript runtime for building AI agents that adapt, remember, and collaborate. Every agent is a **Generalized Mind Instance (GMI)**: a persistent cognitive core with personality traits, episodic memory, and autonomous decision-making.

```bash
npm install @framers/agentos
```

```typescript
import { agent } from '@framers/agentos';

const bot = agent({
  provider: 'anthropic',
  instructions: 'You are a helpful assistant.',
  personality: { openness: 0.9, conscientiousness: 0.85 },
  memory: { enabled: true, cognitive: true },
});

const reply = await bot.session('demo').send('What is AgentOS?');
console.log(reply.text);
```

## What Makes It Different

### Cognitive Memory

[8 neuroscience-grounded memory mechanisms](https://docs.agentos.sh/features/cognitive-memory) modulated by the agent's [HEXACO personality](https://docs.agentos.sh/features/cognitive-memory-guide):

- **[Reconsolidation](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: memories rewrite each time they are recalled, incorporating new context. Based on [Nader et al. (2000)](https://doi.org/10.1038/35021052) on memory reconsolidation in fear conditioning.
- **[Retrieval-induced forgetting](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: retrieving one memory suppresses related competing memories. Based on [Anderson et al. (1994)](https://doi.org/10.1037/0096-3445.123.2.178).
- **[Involuntary recall](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: contextual cues trigger unexpected memory retrieval. Based on [Berntsen (2010)](https://doi.org/10.1177/1745691610370007).
- **[Ebbinghaus decay](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)**: exponential memory decay following the [forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve), [replicated and validated by Murre & Dros (2015)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4492928/).
- **Feeling-of-knowing, temporal gist extraction, schema encoding, source confidence decay**: each mechanism implemented in the [`CognitiveMechanismsEngine`](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine), with trait modulation controlled by [HEXACO personality dimensions](https://hexaco.org/hexaco-inventory).

Memory follows a [4-tier hierarchy](https://docs.agentos.sh/features/memory-architecture) (working memory, episodic, semantic, observational) that consolidates upward automatically. This approach is grounded in the same [ACT-R cognitive architecture](https://arxiv.org/html/2512.20651) principles used by recent systems like [Memory Bear](https://arxiv.org/html/2512.20651) and [CortexGraph](https://github.com/prefrontal-systems/cortexgraph).

### Multi-Agent Orchestration

[6 coordination strategies](https://docs.agentos.sh/features/agency-api) for teams of specialized agents:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Sequential | Linear pipeline, each agent refines previous output | Editing chains, translation pipelines |
| Parallel | Fan-out to all agents simultaneously | Research, brainstorming, redundancy |
| Debate | Agents argue positions, synthesize consensus | Decision-making under uncertainty |
| Review loop | Author and reviewer iterate until quality threshold | Content QA, code review |
| Hierarchical | Manager delegates to specialized workers | Task decomposition |
| Graph (DAG) | Dependency-based execution with conditional branching | Complex multi-step workflows |

Agents share memory through the [`AgentCommunicationBus`](https://docs.agentos.sh/api/classes/AgentCommunicationBus) and coordinate via the [`AgencyRegistry`](https://docs.agentos.sh/api/classes/AgencyRegistry).

### Emergent Tool Forging

Agents [create new tools at runtime](https://docs.agentos.sh/features/emergent-capabilities) when no existing tool fits the task:

- **Compose mode**: chains existing tools into pipelines (safe by construction)
- **Sandbox mode**: generates code in a memory-bounded, time-limited isolation environment

An [`EmergentJudge`](https://docs.agentos.sh/api/classes/EmergentJudge) reviews safety and correctness before activation. Approved tools promote through [3 trust tiers](https://docs.agentos.sh/features/emergent-capabilities): session, agent, shared. The [`EmergentToolRegistry`](https://docs.agentos.sh/api/classes/EmergentToolRegistry) tracks usage and confidence scores.

### Production Infrastructure

- **[21 LLM providers](https://docs.agentos.sh/features/llm-output-validation)** with automatic fallback chains: OpenAI, Anthropic, Gemini, Ollama, OpenRouter, Groq, Together, Fireworks, Perplexity, Mistral, Cohere, DeepSeek, xAI, Bedrock, Qwen, Moonshot, plus [CLI bridges](https://docs.agentos.sh/features/cli-providers) for Claude Code and Gemini CLI
- **[37 channel adapters](https://docs.agentos.sh/features/channels)**: Telegram, Discord, Slack, WhatsApp, email, webchat, Twitter/X, Instagram, Reddit, Bluesky, Mastodon, and [26 more](https://docs.agentos.sh/features/channels)
- **[6 guardrail packs](https://docs.agentos.sh/features/guardrails)** across [5 security tiers](https://docs.agentos.sh/features/guardrails) from `permissive` to `paranoid`: [PII redaction](https://docs.agentos.sh/features/safety-primitives) (4-tier detection: regex + NLP + NER + LLM), [prompt injection defense](https://docs.agentos.sh/features/guardrails-architecture), [grounding guards](https://docs.agentos.sh/features/citation-verification), [code safety scanning](https://docs.agentos.sh/features/guardrails), topicality enforcement, content policy
- **[Multimodal RAG](https://docs.agentos.sh/features/multimodal-rag)**: [7 vector backends](https://docs.agentos.sh/features/rag-memory) (SQLite to Qdrant), [4 retrieval strategies](https://docs.agentos.sh/features/rag-memory), [GraphRAG](https://docs.agentos.sh/features/rag-memory) with [Louvain community detection](https://doi.org/10.1088/1742-5468/2008/10/P10008) ([Blondel et al., 2008](https://doi.org/10.1088/1742-5468/2008/10/P10008)), [10 document loaders](https://docs.agentos.sh/features/multimodal-rag)
- **[Voice pipeline](https://docs.agentos.sh/features/voice-pipeline)**: [12 STT providers](https://docs.agentos.sh/features/voice-pipeline), [12 TTS providers](https://docs.agentos.sh/features/voice-pipeline), VAD, speaker diarization, [telephony](https://docs.agentos.sh/features/telephony-providers) via Twilio, Telnyx, Plivo
- **[Graph-based orchestration](https://docs.agentos.sh/features/workflow-dsl)**: `workflow()` for deterministic DAGs, `AgentGraph` for loops and custom control flow, `mission()` for planner-driven orchestration
- **[OpenTelemetry observability](https://docs.agentos.sh/features/cost-optimization)**: opt-in OTEL export, cost tracking, token usage, session audit logs

### TypeScript Native

Full type safety with [Zod-validated structured output](https://docs.agentos.sh/features/structured-output). ESM-first architecture. The [TypeDoc API reference](https://docs.agentos.sh/api) documents every public class, interface, and function.

## How AgentOS Compares

| Capability | AgentOS | [LangGraph](https://www.langchain.com/langgraph) | [CrewAI](https://crewai.com) | [Mastra](https://mastra.ai) | [VoltAgent](https://voltagent.dev/) |
|------------|---------|-----------|--------|--------|-----------|
| Language | TypeScript | Python + JS | Python | TypeScript | TypeScript |
| Cognitive memory | [8 mechanisms](https://docs.agentos.sh/features/cognitive-memory) + Ebbinghaus decay | Checkpoints | Short/long-term | Semantic | Conversation + RAG |
| Personality | [HEXACO 6-factor](https://docs.agentos.sh/features/cognitive-memory-guide) | None | Role descriptions | None | None |
| Channel adapters | [37](https://docs.agentos.sh/features/channels) | None | None | None | None |
| Voice pipeline | [12 STT + 12 TTS](https://docs.agentos.sh/features/voice-pipeline) | None | None | None | None |
| Guardrails | [6 packs](https://docs.agentos.sh/features/guardrails) | Middleware | Basic | None | Module |
| Tool forging | [Runtime creation](https://docs.agentos.sh/features/emergent-capabilities) | None | None | None | None |

See [AgentOS vs LangGraph vs CrewAI vs Mastra vs VoltAgent](/blog/agentos-vs-langgraph-vs-crewai) for the full comparison.

## Get Started

- [Documentation](https://docs.agentos.sh)
- [GitHub](https://github.com/framersai/agentos)
- [Discord](https://discord.gg/usEkfCeQxs)
- [npm](https://www.npmjs.com/package/@framers/agentos)
- [How to Build a TypeScript AI Agent in 5 Minutes](/blog/build-typescript-ai-agent-5-minutes)
- [Adaptive vs. Emergent Intelligence](/blog/adaptive-vs-emergent)

[Apache 2.0 licensed](https://github.com/framersai/agentos/blob/master/LICENSE). Built by [Manic Agency](https://manic.agency) / [Frame.dev](https://frame.dev).
