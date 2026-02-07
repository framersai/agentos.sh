# RAG & Memory Configuration

## Overview

AgentOS provides a flexible memory system combining:

- **Working Memory** — Short-term context within a conversation
- **Vector Store** — Semantic search over documents and history
- **Persistent Storage** — SQLite, PostgreSQL, or IndexedDB backends

## Quick Start

### Basic RAG Setup

```typescript
import { AgentOS } from '@framers/agentos';
import { EmbeddingManager } from '@framers/agentos/rag';

const agent = new AgentOS();
await agent.initialize({
  llmProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o'
  },
  memory: {
    vectorStore: 'memory',  // In-memory for dev
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 512,
    chunkOverlap: 50
  }
});
```

### Ingest Documents

```typescript
// Ingest text content
await agent.memory.ingest([
  { content: 'AgentOS is a TypeScript runtime for AI agents...', metadata: { source: 'docs', topic: 'intro' } },
  { content: 'GMIs maintain persistent identity across sessions...', metadata: { source: 'docs', topic: 'gmi' } }
]);

// Ingest from files
await agent.memory.ingestFile('./knowledge-base.pdf');
await agent.memory.ingestFile('./api-reference.md');

// Ingest from URLs
await agent.memory.ingestUrl('https://docs.example.com/guide');
```

### Query with Context

```typescript
// RAG context is automatically injected into prompts
for await (const chunk of agent.processRequest({
  message: 'How do GMIs work?',
  retrievalOptions: {
    topK: 5,
    minScore: 0.7
  }
})) {
  process.stdout.write(chunk.content);
}

// Manual retrieval
const results = await agent.memory.search('streaming responses', { topK: 3 });
console.log(results.map(r => r.content));
```

## Vector Store Options

| Store | Use Case | Persistence |
|-------|----------|-------------|
| `memory` | Development, testing | None (RAM only) |
| `sqlite` | Desktop apps, local dev | File-based |
| `postgres` | Production deployments | Database |
| `supabase` | Edge/serverless | Cloud |

### SQLite Vector Store

```typescript
await agent.initialize({
  memory: {
    vectorStore: 'sqlite',
    sqlitePath: './vectors.db',
    embeddingModel: 'text-embedding-3-small'
  }
});
```

### PostgreSQL with pgvector

```typescript
await agent.initialize({
  memory: {
    vectorStore: 'postgres',
    connectionString: process.env.DATABASE_URL,
    tableName: 'embeddings',
    embeddingModel: 'text-embedding-3-small',
    dimensions: 1536
  }
});
```

## Embedding Models

| Model | Provider | Dimensions | Best For |
|-------|----------|------------|----------|
| `text-embedding-3-small` | OpenAI | 1536 | General purpose |
| `text-embedding-3-large` | OpenAI | 3072 | Higher accuracy |
| `nomic-embed-text` | Ollama | 768 | Local/private |
| `mxbai-embed-large` | Ollama | 1024 | Local high-quality |

### Custom Embedding Provider

```typescript
import { EmbeddingManager, IEmbeddingProvider } from '@framers/agentos/rag';

const customProvider: IEmbeddingProvider = {
  embed: async (text: string) => {
    const response = await myEmbeddingAPI(text);
    return response.embedding;
  },
  dimensions: 768
};

const embeddingManager = new EmbeddingManager({
  provider: customProvider
});
```

## Chunking Strategies

```typescript
await agent.initialize({
  memory: {
    chunking: {
      strategy: 'recursive',  // 'fixed', 'sentence', 'recursive', 'semantic'
      chunkSize: 512,
      chunkOverlap: 50,
      separators: ['\n\n', '\n', '. ', ' ']
    }
  }
});
```

| Strategy | Description | Best For |
|----------|-------------|----------|
| `fixed` | Split at exact character count | Uniform chunks |
| `sentence` | Split at sentence boundaries | Natural text |
| `recursive` | Split hierarchically by separators | Structured docs |
| `semantic` | Split by topic/meaning | Long documents |

## Context Window Management

AgentOS automatically manages context to fit model limits:

```typescript
await agent.initialize({
  memory: {
    contextWindow: {
      maxTokens: 8000,        // Reserve for RAG context
      reserveForResponse: 2000,
      overflowStrategy: 'truncate_oldest'  // or 'summarize'
    }
  }
});
```

### Summarization on Overflow

```typescript
// When context exceeds limits, older content is summarized
await agent.initialize({
  memory: {
    contextWindow: {
      maxTokens: 8000,
      overflowStrategy: 'summarize',
      summarizationModel: 'gpt-4o-mini'
    }
  }
});
```

## Conversation Memory

Separate from RAG, conversation memory tracks dialog history:

```typescript
// Conversation history is automatically maintained
const response1 = await agent.processRequest({ 
  message: 'My name is Alice',
  conversationId: 'conv-123'
});

const response2 = await agent.processRequest({ 
  message: 'What is my name?',  // Agent remembers: "Alice"
  conversationId: 'conv-123'
});

// Access conversation history
const history = await agent.getConversationHistory('conv-123');
```

### Persistent Sessions

```typescript
// Sessions persist across restarts with SQL storage
await agent.initialize({
  memory: {
    persistence: {
      adapter: 'sqlite',
      path: './conversations.db'
    }
  }
});

// Resume previous conversation
const response = await agent.processRequest({
  message: 'Continue where we left off',
  conversationId: 'conv-123'  // Loads history from DB
});
```

## Hybrid Search

Combine vector similarity with keyword matching:

```typescript
const results = await agent.memory.search('TypeScript agent framework', {
  topK: 10,
  hybridSearch: {
    enabled: true,
    keywordWeight: 0.3,  // 30% BM25, 70% vector
    rerank: true
  }
});
```

## Cross-Encoder Reranking (Optional)

Reranking uses a cross-encoder model to re-score retrieved documents for higher relevance.
**Disabled by default** due to added latency (~100-500ms for 50 docs).

### When to Enable

| Use Case | Recommendation |
|----------|----------------|
| Real-time chat | **Disabled** — latency sensitive |
| Background analysis | **Enabled** — accuracy matters more |
| Batch processing | **Enabled** — no user waiting |
| Knowledge-intensive tasks | **Enabled** — reduces hallucination |

### Configuration

```typescript
await agent.initialize({
  memory: {
    // ... other config ...
    rerankerServiceConfig: {
      providers: [
        { providerId: 'cohere', apiKey: process.env.COHERE_API_KEY },
        { providerId: 'local', defaultModelId: 'cross-encoder/ms-marco-MiniLM-L-6-v2' }
      ],
      defaultProviderId: 'local'
    }
  }
});

// Register provider implementations after initialization
import { CohereReranker, LocalCrossEncoderReranker } from '@framers/agentos/rag/reranking';

agent.registerRerankerProvider(new CohereReranker({
  providerId: 'cohere',
  apiKey: process.env.COHERE_API_KEY!
}));

agent.registerRerankerProvider(new LocalCrossEncoderReranker({
  providerId: 'local',
  defaultModelId: 'cross-encoder/ms-marco-MiniLM-L-6-v2'
}));
```

### Per-Request Usage

```typescript
// Enable reranking for specific queries
const results = await agent.memory.search('complex technical question', {
  topK: 20,  // Retrieve more, reranker will filter
  rerankerConfig: {
    enabled: true,
    providerId: 'cohere',  // or 'local'
    modelId: 'rerank-english-v3.0',
    topN: 5  // Return top 5 after reranking
  }
});
```

### Global Default (for Analysis Personas)

```typescript
// Enable reranking by default for batch/analysis workloads
await agent.initialize({
  memory: {
    globalDefaultRetrievalOptions: {
      rerankerConfig: {
        enabled: true,
        topN: 5
      }
    }
  }
});
```

### Providers

| Provider | Model | Latency | Cost |
|----------|-------|---------|------|
| Cohere | `rerank-english-v3.0` | ~100ms/50 docs | $0.10/1K queries |
| Cohere | `rerank-multilingual-v3.0` | ~150ms/50 docs | $0.10/1K queries |
| Local | `cross-encoder/ms-marco-MiniLM-L-6-v2` | ~200ms/50 docs | Free (self-hosted) |
| Local | `BAAI/bge-reranker-base` | ~300ms/50 docs | Free (self-hosted) |

### How It Works

1. **Initial retrieval** — Fast bi-encoder vector search returns top-K candidates
2. **Reranking** — Cross-encoder scores each (query, document) pair
3. **Final selection** — Results sorted by cross-encoder score, top-N returned

Cross-encoders jointly encode the query and document together, enabling richer
semantic understanding than bi-encoder similarity. The trade-off is latency:
cross-encoders are ~10-100x slower than bi-encoders, hence their use as a
second-stage reranker rather than primary retrieval.

## Memory Lifecycle

```typescript
// Clear all memory
await agent.memory.clear();

// Delete specific documents
await agent.memory.delete({ source: 'outdated-docs' });

// Export for backup
const dump = await agent.memory.export();
await fs.writeFile('memory-backup.json', JSON.stringify(dump));

// Import from backup
const backup = JSON.parse(await fs.readFile('memory-backup.json'));
await agent.memory.import(backup);
```

## Performance Tips

1. **Batch ingestion** — Use `ingest([...])` not multiple `ingest()` calls
2. **Appropriate chunk size** — 256-1024 tokens works best for most cases
3. **Filter before search** — Use metadata filters to narrow scope
4. **Cache embeddings** — Enable caching for repeated queries

```typescript
await agent.initialize({
  memory: {
    caching: {
      enabled: true,
      maxSize: 10000,  // Cache up to 10k embeddings
      ttlMs: 3600000   // 1 hour TTL
    }
  }
});
```

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [Client-Side Storage](./CLIENT_SIDE_STORAGE.md)
- [SQL Storage Quickstart](./SQL_STORAGE_QUICKSTART.md)
