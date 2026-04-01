---
title: "How to Build a TypeScript AI Agent in 5 Minutes"
date: "2026-03-31"
excerpt: "From npm install to a working agent with personality, memory, tools, and guardrails — in under 50 lines of code."
author: "AgentOS Team"
category: "Tutorial"
image: "/blog/quickstart-tutorial.png"
keywords: "build ai agent typescript, typescript ai tutorial, ai agent quickstart, how to build ai agent, agentos tutorial"
---

Zero to a working AI agent with personality, cognitive memory, web search, and guardrails. Five steps, under 50 lines of TypeScript.

## Step 1: Install

```bash
npm install @framers/agentos
```

Set your API key:

```bash
export OPENAI_API_KEY=sk-your-key
# or ANTHROPIC_API_KEY, GEMINI_API_KEY, GROQ_API_KEY, etc.
```

AgentOS auto-detects which provider you have configured. Supports [21 LLM providers](https://docs.agentos.sh/features/llm-providers) out of the box.

## Step 2: Generate Text

```typescript
import { generateText } from '@framers/agentos';

const result = await generateText({
  provider: 'openai',
  model: 'gpt-4o',
  prompt: 'Explain the Monty Hall problem.',
});

console.log(result.text);
```

That's the simplest possible agent — one LLM call, one response. Now let's add personality and memory.

## Step 3: Add Personality and Memory

```typescript
import { agent } from '@framers/agentos';

const assistant = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: 'You are a helpful research assistant.',
  personality: {
    openness: 0.9,          // explores ideas broadly
    conscientiousness: 0.85, // thorough and organized
    agreeableness: 0.7,      // friendly but direct
  },
  memory: {
    enabled: true,
    decay: 'ebbinghaus',     // memories naturally fade over time
  },
});

// First conversation
const answer1 = await assistant.text('My name is Sarah and I study marine biology.');
// The agent remembers Sarah's name and field

// Later conversation — the agent still knows
const answer2 = await assistant.text('What topics would interest me?');
// Response references marine biology because it remembers
```

[HEXACO personality traits](https://docs.agentos.sh/features/personality) shape how the agent communicates. High openness means it explores tangential ideas. High conscientiousness means it stays organized and thorough. These aren't prompt hacks — they're modeled as weighted parameters that influence every response.

[Cognitive memory](https://docs.agentos.sh/features/cognitive-memory) goes beyond chat history. Memories decay organically (Ebbinghaus forgetting curve), high-importance events resist decay (flashbulb memories), and retrieved memories drift toward the agent's current emotional context (reconsolidation). Eight cognitive mechanisms total, all backed by published cognitive science research.

## Step 4: Add Tools

```typescript
const researcher = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a research assistant with access to web search.',
  tools: ['web_search', 'deep_research', 'verify_citations'],
  memory: { enabled: true },
});

const result = await researcher.text(
  'What are the latest developments in room-temperature superconductors?'
);
// The agent searches the web, verifies claims against sources,
// and responds with cited information
```

AgentOS ships with [100+ curated extensions](https://docs.agentos.sh/extensions/overview) covering web search, news, image search, file operations, social media, and more. The `verify_citations` tool decomposes the response into atomic claims and checks each against sources using cosine similarity.

## Step 5: Add Guardrails

```typescript
const safeBot = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: 'You are a customer support agent for a SaaS product.',
  security: { tier: 'strict' },
  guardrails: {
    input: ['pii-redaction', 'ml-classifiers'],
    output: ['grounding-guard', 'code-safety'],
  },
  memory: { enabled: true },
  tools: ['web_search'],
});
```

Six [guardrail packs](https://docs.agentos.sh/features/guardrails) run on every request:

- **PII Redaction** — four-tier detection (regex + NLP + NER + LLM)
- **ML Classifiers** — toxicity, prompt injection, and jailbreak detection via ONNX models
- **Topicality** — embedding-based topic enforcement with drift detection
- **Code Safety** — 25 OWASP regex rules for generated code
- **Grounding Guard** — NLI-based claim verification against RAG sources
- **Content Policy Rewriter** — 8 configurable categories with LLM rewrite/block

Five security tiers: `dangerous` > `permissive` > `balanced` > `strict` > `paranoid`. Each tier controls which tools the agent can access and what guardrails are enforced.

## Full Example: 47 Lines

```typescript
import { agent } from '@framers/agentos';

const myAgent = agent({
  // LLM
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: `You are a knowledgeable research assistant.
    You search the web for current information,
    verify your claims against sources, and cite everything.`,

  // Personality
  personality: {
    openness: 0.9,
    conscientiousness: 0.85,
    agreeableness: 0.7,
    extraversion: 0.6,
    emotionality: 0.3,
    honestyHumility: 0.95,
  },

  // Memory
  memory: {
    enabled: true,
    decay: 'ebbinghaus',
  },

  // Tools
  tools: [
    'web_search',
    'deep_research',
    'verify_citations',
    'news_search',
  ],

  // Safety
  security: { tier: 'balanced' },
  guardrails: {
    input: ['pii-redaction'],
    output: ['grounding-guard'],
  },
});

// Use it
const response = await myAgent.text('What happened in tech this week?');
console.log(response);
```

## What's Next

- [Deploy to Telegram or WhatsApp](https://docs.agentos.sh/features/channels) — `wunderland start --channel telegram`
- [Add voice](https://docs.agentos.sh/features/voice) — STT, TTS, and voice activity detection
- [Build multi-agent teams](https://docs.agentos.sh/features/multi-agent) — graph workflows with emergent collaboration
- [Full documentation](https://docs.agentos.sh) — guides, API reference, and architecture

```bash
npm install @framers/agentos
```

[GitHub](https://github.com/framersai/agentos) · [npm](https://www.npmjs.com/package/@framers/agentos) · [Documentation](https://docs.agentos.sh)
