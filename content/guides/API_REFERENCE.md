# API Reference

> Core exports from `@framers/agentos` — the TypeScript runtime for autonomous AI agents.

## Installation

```bash
npm install @framers/agentos
```

---

## High-Level APIs

### AgentMemory

Simple facade for the cognitive memory system. No PAD mood or HEXACO knowledge required.

```typescript
import { AgentMemory } from '@framers/agentos';

const memory = AgentMemory.wrap(existingManager); // or new AgentMemory()

await memory.remember("User prefers dark mode");
await memory.remember("Deploy by Friday", { type: 'prospective', tags: ['deadline'] });

const results = await memory.recall("user preferences");
// → { memories: [{ content: "...", retrievalScore: 0.92 }], diagnostics: {...} }

await memory.observe('user', "Help me with TMJ");
await memory.observe('assistant', "TMJ disorders involve...");

const context = await memory.getContext("TMJ treatment", { tokenBudget: 2000 });

await memory.remind({ content: "Deploy deadline", triggerType: 'time', triggerAt: Date.now() + 3600000 });
await memory.consolidate();
const health = await memory.health();
```

| Method | Returns | Description |
|--------|---------|-------------|
| `remember(content, options?)` | `RememberResult` | Encode text into long-term memory |
| `recall(query, options?)` | `RecallResult` | Retrieve relevant memories (uses HyDE when enabled) |
| `search(query, options?)` | `ScoredMemoryTrace[]` | Search with filtering |
| `observe(role, content)` | `ObservationNote[] \| null` | Feed conversation turn to observational memory |
| `getContext(query, { tokenBudget })` | `AssembledMemoryContext` | Get memory context for prompt injection |
| `remind(input)` | `ProspectiveMemoryItem` | Set a reminder/intention |
| `reminders()` | `ProspectiveMemoryItem[]` | List active reminders |
| `consolidate()` | `void` | Run memory consolidation (merge, strengthen, decay) |
| `health()` | `MemoryHealthReport` | Get diagnostics |
| `shutdown()` | `void` | Release resources |
| `raw` | `ICognitiveMemoryManager` | Access underlying manager |

---

### AgentOS

Core orchestrator. Manages personas, tools, LLM routing, and the agent lifecycle.

```typescript
import { AgentOS } from '@framers/agentos';

const agentos = new AgentOS();
await agentos.initialize({
  llmProviders: [...],
  retrievalAugmentor: rag,
  personas: [{ id: 'assistant', systemPrompt: '...' }],
});
```

---

## Memory System

### CognitiveMemoryManager

Advanced memory orchestrator (used internally by `AgentMemory`).

| Method | Description |
|--------|-------------|
| `initialize(config)` | Set up with working memory, vector store, embedding manager |
| `encode(input, mood, gmiMood, options?)` | Create memory trace with emotional encoding |
| `retrieve(query, mood, options?)` | Retrieve with PAD mood congruence scoring |
| `assembleForPrompt(query, tokenBudget, mood)` | Assemble context within token budget |
| `observe(role, content, mood?)` | Observational memory (Observer agent) |
| `runConsolidation()` | Merge, strengthen important memories, decay weak ones |
| `getMemoryHealth()` | Diagnostics: trace count, graph size, working memory usage |

### Memory Types

```typescript
type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'prospective';
type MemoryScope = 'thread' | 'user' | 'persona' | 'organization';
```

### MemoryObserver / MemoryReflector

Background agents that compress conversation history into dense observations.

- **Observer**: Watches conversations, creates observation notes when token threshold (~30K) is reached
- **Reflector**: Condenses observations when they exceed ~40K tokens — combines related items, reflects on patterns

### CognitiveWorkingMemory

Baddeley's model with 7±2 slots. Tracks active context during conversation.

---

## RAG (Retrieval-Augmented Generation)

### HydeRetriever

Hypothetical Document Embedding — generates a pseudo-answer before searching for better semantic matching.

```typescript
import { HydeRetriever } from '@framers/agentos';

const retriever = new HydeRetriever({
  enabled: true,
  initialThreshold: 0.7,
  minThreshold: 0.3,
  thresholdStep: 0.1,
  adaptiveThreshold: true,
});

const result = await retriever.retrieve({
  query: "TMJ treatment options",
  vectorStore,
  collectionName: 'memories',
  llmCall: async (system, user) => llm.chat(system, user),
  embed: async (text) => embedder.embed(text),
});
```

### EmbeddingManager

Multi-provider text embedding with LRU cache.

```typescript
import { EmbeddingManager } from '@framers/agentos';

const em = new EmbeddingManager();
await em.initialize({
  embeddingModels: [
    { modelId: 'text-embedding-3-small', providerId: 'openai', dimension: 1536, isDefault: true },
  ],
}, providerManager);

const embeddings = await em.generateEmbeddings(['hello world']);
```

### RetrievalAugmentor

Orchestrates embedding + vector search + context assembly.

```typescript
const rag = new RetrievalAugmentor();
await rag.initialize(config, embeddingManager, vectorStoreManager);

await rag.ingestDocuments([{ id: 'doc-1', content: '...' }]);
const context = await rag.retrieveContext('query', { topK: 5, strategy: 'hybrid' });
```

### Retrieval Strategies

| Strategy | Description |
|----------|-------------|
| `similarity` | Dense bi-encoder search |
| `hybrid` | Dense + BM25 lexical fusion |
| `mmr` | Maximal Marginal Relevance diversification |

### Vector Store Providers

| Provider | Type | Notes |
|----------|------|-------|
| `InMemoryVectorStore` | Ephemeral | Dev/testing |
| `SqlVectorStore` | Persistent | SQLite, optional FTS |
| `HnswlibVectorStore` | ANN | Fast approximate search |
| `QdrantVectorStore` | Remote | Cloud or self-hosted |

---

## Speech / Voice

### TextToSpeechTool

Multi-provider TTS — callable by agents during conversations.

```typescript
import { TextToSpeechTool } from '@framers/agentos-ext-voice-synthesis';

const tts = new TextToSpeechTool({
  openaiApiKey: process.env.OPENAI_API_KEY,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
});

const result = await tts.execute({
  text: "Hello world",
  voice: "nova",        // OpenAI: alloy/echo/fable/onyx/nova/shimmer
  provider: "openai",   // or "elevenlabs", "ollama", "auto"
});
// → { audioBase64: "...", contentType: "audio/mpeg", provider: "openai" }
```

### SpeechToTextTool

OpenAI Whisper-based transcription.

```typescript
import { SpeechToTextTool } from '@framers/agentos-ext-voice-synthesis';

const stt = new SpeechToTextTool({ openaiApiKey: process.env.OPENAI_API_KEY });

const result = await stt.execute({
  audioBase64: "data:audio/wav;base64,...",
  responseFormat: "verbose_json",
});
// → { text: "hello world", language: "en", segments: [...] }
```

---

## Discovery

### CapabilityDiscoveryEngine

Tiered semantic search for tools, skills, and extensions.

```typescript
const engine = new CapabilityDiscoveryEngine(config);
await engine.initialize(capabilities);

const result = await engine.discover("generate an image", { tier: 2 });
// → [{ id: "generate_image", relevance: 0.95, schema: {...} }]
```

### Three Tiers

| Tier | Tokens | Description |
|------|--------|-------------|
| 0 | ~150 | Category summaries (always in context) |
| 1 | ~200 | Top-5 semantic matches |
| 2 | ~1500 | Full schemas for selected tools |

---

## Extensions

### ITool Interface

All tools implement this interface:

```typescript
interface ITool<Input = unknown, Output = unknown> {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  version: string;
  hasSideEffects: boolean;
  inputSchema: JSONSchemaObject;
  requiredCapabilities?: string[];
  execute(input: Input, context: ToolExecutionContext): Promise<ToolExecutionResult<Output>>;
}
```

### Extension Pack Pattern

```typescript
export function createExtensionPack(context: ExtensionContext) {
  const tool = new MyTool(context.options);
  return {
    name: '@scope/my-extension',
    version: '1.0.0',
    descriptors: [
      { id: tool.name, kind: 'tool', priority: 50, payload: tool },
    ],
    onActivate: async () => { /* setup */ },
    onDeactivate: async () => { /* cleanup */ },
  };
}
```

---

## Safety & Security

### Security Tiers

| Tier | Name | Description |
|------|------|-------------|
| 1 | Dangerous | No restrictions (testing only) |
| 2 | Permissive | Basic input sanitization |
| 3 | Balanced | Pre-LLM classification + output verification |
| 4 | Strict | Dual-LLM audit + signed outputs |
| 5 | Paranoid | Full pipeline + external anchoring |

### Safety Primitives

- `PreLLMClassifier` — Classifies input before LLM processing
- `DualLLMAuditor` — Second LLM reviews outputs
- `SignedOutputVerifier` — Cryptographic output signing
- `ActionDeduplicator` — Prevents duplicate tool calls
- `StepUpAuthorizationManager` — Tiered permission escalation

---

## Channels

37 platform adapters implementing `IChannelAdapter`:

Discord, Telegram, Slack, WhatsApp, SMS, Email, Teams, Webchat, Twitter/X, Instagram, Facebook, LinkedIn, Threads, Bluesky, Mastodon, Nostr, Matrix, Signal, Line, WeChat, Zalo, Feishu, Google Chat, Mattermost, Nextcloud, Twitch, Tlon, iMessage, Farcaster, Lemmy, Google Business, YouTube, TikTok, Dev.to, Medium, Hashnode, WordPress.

---

## Observability

- OpenTelemetry integration (`@opentelemetry/api`)
- Distributed tracing for LLM calls, tool executions, memory operations
- Structured logging via `pino`
- Metrics: token usage, latency, cost tracking via `UsageLedger`
