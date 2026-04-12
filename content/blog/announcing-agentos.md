---
title: "Announcing AgentOS: Open-Source TypeScript AI Agent Framework"
date: "2025-11-10"
excerpt: "AgentOS is an open-source TypeScript runtime for building AI agents with cognitive memory, HEXACO personality, multi-agent orchestration, and runtime tool forging. Apache 2.0 licensed."
author: "AgentOS Team"
category: "Announcements"
image: "/blog/announcing-agentos.png"
keywords: "agentos launch, ai agent framework, typescript ai agents, build ai agent, multi-agent orchestration, cognitive memory, open source ai framework, langgraph alternative, crewai alternative, adaptive ai agents, emergent tool forging"
---

## What AgentOS Is

[AgentOS](https://agentos.sh) is a TypeScript runtime for building AI agents that adapt, remember, and collaborate. Every agent is a **Generalized Mind Instance (GMI)**: a persistent cognitive core with personality traits, episodic memory, and autonomous decision-making. Not a prompt wrapper. A mind.

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

[8 neuroscience-grounded memory mechanisms](https://docs.agentos.sh/features/cognitive-memory) modulated by the agent's personality:

- **[Reconsolidation](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)** -- memories rewrite each time they are recalled, incorporating new context. Based on [Nader et al. (2000)](https://doi.org/10.1038/35021052) on memory reconsolidation in fear conditioning.
- **[Retrieval-induced forgetting](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine)** -- retrieving one memory suppresses related competing memories. Based on [Anderson et al. (1994)](https://doi.org/10.1037/0096-3445.123.2.186).
- **Involuntary recall, feeling-of-knowing, temporal gist extraction, schema encoding, source confidence decay, emotion regulation** -- each mechanism has its own implementation in the [`CognitiveMechanismsEngine`](https://docs.agentos.sh/api/classes/CognitiveMechanismsEngine), with trait modulation controlled by [HEXACO personality dimensions](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure).

Memory follows an [Ebbinghaus forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve) for natural decay. A 4-tier hierarchy (working memory, episodic, semantic, observational) consolidates upward automatically. See the [memory architecture guide](https://docs.agentos.sh/features/memory-architecture).

### Multi-Agent Orchestration

[6 coordination strategies](https://docs.agentos.sh/features/agency-api) for teams of specialized agents:

| Strategy | Description |
|---|---|
| Sequential | Linear pipeline, each agent refines the previous output |
| Parallel | Fan-out to all agents simultaneously |
| Debate | Agents argue positions, synthesize consensus |
| Review loop | Author and reviewer iterate until quality threshold |
| Hierarchical | Manager delegates to workers |
| Graph (DAG) | Dependency-based execution with conditional branching |

Agents share memory through the [`AgentCommunicationBus`](https://docs.agentos.sh/api/classes/AgentCommunicationBus) and coordinate via the [`AgencyRegistry`](https://docs.agentos.sh/api/classes/AgencyRegistry).

### Emergent Tool Forging

Agents [create new tools at runtime](https://docs.agentos.sh/features/emergent-capabilities) when no existing tool fits the task. Compose mode chains existing tools into pipelines (safe by construction). Sandbox mode generates code in a memory-bounded, time-limited isolation environment. An [`EmergentJudge`](https://docs.agentos.sh/api/classes/EmergentJudge) reviews safety and correctness before activation. Approved tools promote through three trust tiers: session, agent, shared. The [`EmergentToolRegistry`](https://docs.agentos.sh/api/classes/EmergentToolRegistry) tracks usage and confidence scores.

### Production Infrastructure

- **17 LLM providers** with automatic fallback chains: OpenAI, Anthropic, Gemini, Ollama, OpenRouter, Groq, Together, Fireworks, Perplexity, Mistral, Cohere, DeepSeek, xAI, Bedrock, Qwen, Moonshot, plus [CLI bridges](https://docs.agentos.sh/features/cli-providers) for Claude Code and Gemini CLI
- **[37 channel adapters](https://docs.agentos.sh/features/channels)**: Telegram, Discord, Slack, WhatsApp, email, webchat, Twitter/X, Instagram, Reddit, Bluesky, Mastodon, and 26 more
- **[5 security tiers](https://docs.agentos.sh/features/guardrails)** from `permissive` to `paranoid` with PII redaction, prompt injection defense, grounding guards, and code safety scanning
- **[Multimodal RAG](https://docs.agentos.sh/features/multimodal-rag)**: 7 vector backends (SQLite to Qdrant), 4 retrieval strategies, [GraphRAG](https://docs.agentos.sh/features/rag-memory) with Louvain community detection, 10 document loaders
- **[Voice pipeline](https://docs.agentos.sh/features/voice-pipeline)**: 12 STT providers, 12 TTS providers, VAD, speaker diarization, [telephony](https://docs.agentos.sh/features/telephony-providers) via Twilio, Telnyx, Plivo
- **[Graph-based orchestration](https://docs.agentos.sh/features/workflow-dsl)**: `workflow()` for deterministic DAGs, `AgentGraph` for loops and custom control flow, `mission()` for planner-driven orchestration
- **[OpenTelemetry observability](https://docs.agentos.sh/features/cost-optimization)**: opt-in OTEL export, cost tracking, token usage, session audit logs

### TypeScript Native

Full type safety with [Zod-validated structured output](https://docs.agentos.sh/features/structured-output). ESM-first architecture. The [TypeDoc API reference](https://docs.agentos.sh/api) documents every public class, interface, and function.

## Get Started

- [Documentation](https://docs.agentos.sh) -- guides, tutorials, API reference
- [GitHub](https://github.com/framersai/agentos) -- source code, issues, contributing
- [Discord](https://discord.gg/VXXC4SJMKh) -- community
- [npm](https://www.npmjs.com/package/@framers/agentos) -- `npm install @framers/agentos`
- [How to Build a TypeScript AI Agent in 5 Minutes](/blog/build-typescript-ai-agent-5-minutes) -- hands-on tutorial
- [AgentOS vs LangGraph vs CrewAI vs Mastra](/blog/agentos-vs-langgraph-vs-crewai) -- framework comparison

[Apache 2.0 licensed](https://github.com/framersai/agentos/blob/master/LICENSE). Built by [Manic Agency](https://manic.agency) / [Frame.dev](https://frame.dev).

