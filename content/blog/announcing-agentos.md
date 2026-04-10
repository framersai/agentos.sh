---
title: "Announcing AgentOS: The First Adaptive AI Agent Runtime"
date: "2025-11-10"
excerpt: "AgentOS is an open-source TypeScript framework for building adaptive, multi-agent AI systems with cognitive memory, personality, and emergent tool forging."
author: "AgentOS Team"
category: "Announcements"
image: "/blog/announcing-agentos.png"
keywords: "agentos, ai agent framework, typescript ai agents, multi-agent systems, open source ai framework, cognitive memory ai, adaptive ai agents"
---

## The First Adaptive AI Agent Runtime

**[AgentOS](https://agentos.sh)** is an open-source TypeScript framework for building adaptive, multi-agent AI systems. Where traditional agent frameworks rely on static chains of thought or hard-coded decision trees, AgentOS introduces **Generalized Mind Instances (GMIs)** — agents that dynamically adapt their roles, tools, and collaboration patterns based on the task at hand.

### Why AgentOS?

- **Cognitive Memory:** 8 neuroscience-backed mechanisms (reconsolidation, retrieval-induced forgetting, involuntary recall, and more) give agents memory that behaves like human cognition
- **HEXACO Personality:** 6 personality traits modulate how agents communicate, remember, and adapt
- **TypeScript Native:** Full type safety, Zod-validated structured output, and ESM-first architecture
- **16 LLM Providers:** OpenAI, Anthropic, Gemini, Groq, Ollama, OpenRouter, and more — with automatic fallback
- **Enterprise Ready:** 5-tier guardrails, OpenTelemetry observability, cost guards, circuit breakers

### Key Features

- **Multi-Agent Teams:** 6 coordination strategies (sequential, parallel, debate, review-loop, hierarchical, graph) with shared memory and inter-agent messaging
- **RAG Pipeline:** 7 vector backends, 4 retrieval strategies, GraphRAG with entity extraction and community detection
- **Emergent Capabilities:** Agents forge new tools at runtime, with tiered promotion (session → agent → shared)
- **37 Channel Adapters:** Deploy to Telegram, Discord, Slack, WhatsApp, webchat, and more
- **Voice & Telephony:** ElevenLabs, Deepgram, OpenAI Whisper; Twilio, Telnyx, Plivo

### Getting Started

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

### Learn More

- [Documentation](https://docs.agentos.sh) — Getting started, API reference, architecture guides
- [GitHub](https://github.com/framersai/agentos) — Source code, issues, contributing
- [Discord](https://discord.gg/VXXC4SJMKh) — Community chat and support
- [Wilds.ai](https://wilds.ai) — AI game worlds powered by AgentOS
- [How to Build a TypeScript AI Agent in 5 Minutes](/blog/build-typescript-ai-agent-5-minutes) — Step-by-step tutorial
- [AgentOS vs LangGraph vs CrewAI vs Mastra](https://docs.agentos.sh/blog/2026/02/20/agentos-vs-langgraph-vs-crewai) — Framework comparison

AgentOS is [Apache 2.0 licensed](https://github.com/framersai/agentos/blob/master/LICENSE), built by [Manic Agency LLC](https://manic.agency) / [Frame.dev](https://frame.dev).

