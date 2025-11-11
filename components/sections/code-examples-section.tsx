'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Terminal, Code2, FileCode2, Cpu, Database, GitBranch } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  category: 'basic' | 'advanced' | 'integration' | 'deployment'
}

const codeExamples: CodeExample[] = [
  {
    id: 'basic-agent',
    title: 'Create Your First Agent',
    description: 'Basic agent setup with memory and tools',
    language: 'typescript',
    category: 'basic',
    code: `import { Agent, Memory, Tool } from '@agentos/core'

// Define a simple calculator tool
const calculatorTool = new Tool({
  name: 'calculator',
  description: 'Performs basic math operations',
  execute: async ({ operation, a, b }) => {
    switch(operation) {
      case 'add': return a + b
      case 'multiply': return a * b
      case 'divide': return b !== 0 ? a / b : 'Error: Division by zero'
      default: return 'Unknown operation'
    }
  }
})

// Create an agent with memory and tools
const agent = new Agent({
  name: 'MathAssistant',
  model: 'gpt-4',
  memory: new Memory({ type: 'persistent' }),
  tools: [calculatorTool],
  systemPrompt: 'You are a helpful math assistant. Use the calculator tool for computations.'
})

// Run the agent
const response = await agent.run({
  message: 'What is 42 multiplied by 17?'
})

console.log(response)
// Output: "42 multiplied by 17 equals 714."`
  },
  {
    id: 'gmi-roles',
    title: 'GMI Roles & Agencies',
    description: 'Implementing Generalised Mind Instance roles',
    language: 'typescript',
    category: 'advanced',
    code: `import { GMI, Agency, Role } from '@agentos/core'

// Define specialized roles
const researcherRole = new Role({
  name: 'Researcher',
  capabilities: ['web_search', 'document_analysis', 'summarization'],
  constraints: {
    maxTokens: 4000,
    allowedDomains: ['*.edu', '*.org', 'scholar.google.com']
  }
})

const writerRole = new Role({
  name: 'Writer',
  capabilities: ['content_generation', 'style_adaptation', 'editing'],
  preferences: {
    style: 'academic',
    tone: 'formal',
    citations: true
  }
})

// Create an Agency with multiple GMI instances
const researchAgency = new Agency({
  name: 'ResearchTeam',
  roles: [researcherRole, writerRole],
  workflow: {
    type: 'sequential',
    steps: [
      { role: 'Researcher', action: 'gather_information' },
      { role: 'Writer', action: 'draft_article' },
      { role: 'Researcher', action: 'fact_check' },
      { role: 'Writer', action: 'finalize' }
    ]
  }
})

// Execute complex task with the agency
const article = await researchAgency.execute({
  task: 'Write a comprehensive article about quantum computing applications',
  requirements: {
    length: 2000,
    includeReferences: true,
    targetAudience: 'technical professionals'
  }
})

console.log(article.content)
console.log('References:', article.references)`
  },
  {
    id: 'memory-system',
    title: 'Advanced Memory Management',
    description: 'Implementing persistent and contextual memory',
    language: 'typescript',
    category: 'advanced',
    code: `import { Agent, VectorMemory, EpisodicMemory, WorkingMemory } from '@agentos/core'

// Configure multi-tier memory system
const memorySystem = {
  working: new WorkingMemory({
    capacity: 10, // Keep last 10 interactions
    ttl: 3600 // 1 hour time-to-live
  }),

  episodic: new EpisodicMemory({
    storage: 'postgresql',
    connectionString: process.env.DATABASE_URL,
    compressionThreshold: 100 // Compress after 100 messages
  }),

  vector: new VectorMemory({
    provider: 'pinecone',
    apiKey: process.env.PINECONE_API_KEY,
    index: 'agent-knowledge',
    dimensions: 1536
  })
}

// Create agent with advanced memory
const agent = new Agent({
  name: 'PersistentAssistant',
  memory: memorySystem,

  // Memory-aware processing
  beforeProcess: async (input) => {
    // Search relevant past interactions
    const context = await memorySystem.vector.search(input, { limit: 5 })

    // Load recent working memory
    const recent = await memorySystem.working.getRecent()

    return {
      input,
      context: [...context, ...recent]
    }
  },

  afterProcess: async (input, output) => {
    // Store in appropriate memory tier
    await memorySystem.working.add({ input, output })

    // Index important information
    if (output.importance > 0.7) {
      await memorySystem.vector.index({
        content: output.text,
        metadata: { timestamp: Date.now(), importance: output.importance }
      })
    }
  }
})

// Agent remembers across sessions
const response = await agent.run({
  message: 'What did we discuss about project timeline last week?'
})`
  },
  {
    id: 'tool-integration',
    title: 'External Tool Integration',
    description: 'Connect APIs and services as agent tools',
    language: 'typescript',
    category: 'integration',
    code: `import { Agent, Tool, ToolRegistry } from '@agentos/core'
import { WebBrowser, CodeInterpreter, DatabaseQuery } from '@agentos/tools'

// Create custom API tool
const weatherTool = new Tool({
  name: 'weather',
  description: 'Get current weather for any location',
  parameters: {
    location: { type: 'string', required: true },
    units: { type: 'string', enum: ['metric', 'imperial'], default: 'metric' }
  },
  execute: async ({ location, units }) => {
    const response = await fetch(
      \`https://api.weather.com/v1/current?q=\${location}&units=\${units}\`
    )
    return response.json()
  }
})

// Register multiple tools
const toolRegistry = new ToolRegistry()
toolRegistry.register(weatherTool)
toolRegistry.register(new WebBrowser({ headless: true }))
toolRegistry.register(new CodeInterpreter({ sandbox: true }))
toolRegistry.register(new DatabaseQuery({
  connection: process.env.DB_URL,
  readOnly: true
}))

// Create multi-tool agent
const agent = new Agent({
  name: 'SwissArmyAgent',
  tools: toolRegistry,

  // Tool selection strategy
  toolSelector: async (task, availableTools) => {
    // AI-driven tool selection based on task
    const analysis = await analyzeTask(task)
    return availableTools.filter(tool =>
      analysis.requiredCapabilities.includes(tool.type)
    )
  },

  // Parallel tool execution
  executionMode: 'parallel',
  maxConcurrentTools: 3
})

// Complex task using multiple tools
const result = await agent.run({
  message: 'Check the weather in Tokyo, find recent news about it, and create a travel summary'
})`
  },
  {
    id: 'streaming',
    title: 'Real-time Streaming Responses',
    description: 'Stream agent responses for better UX',
    language: 'typescript',
    category: 'advanced',
    code: `import { StreamingAgent, StreamProcessor } from '@agentos/streaming'

// Configure streaming agent
const streamingAgent = new StreamingAgent({
  name: 'RealtimeAssistant',
  model: 'gpt-4',
  streaming: {
    enabled: true,
    chunkSize: 'word', // or 'sentence', 'paragraph'
    bufferSize: 100
  }
})

// Set up stream processors
const processors = [
  new StreamProcessor.TokenCounter(),
  new StreamProcessor.SentimentAnalyzer(),
  new StreamProcessor.SafetyFilter({
    blockPII: true,
    moderationLevel: 'medium'
  })
]

// Handle streaming response
streamingAgent.stream({
  message: 'Explain quantum computing in simple terms',
  onChunk: (chunk) => {
    // Process each chunk through pipeline
    const processed = processors.reduce(
      (data, processor) => processor.process(data),
      chunk
    )

    // Update UI in real-time
    updateChatInterface(processed)
  },
  onComplete: (fullResponse) => {
    console.log('Complete response:', fullResponse)
    console.log('Token count:', fullResponse.metadata.tokens)
  },
  onError: (error) => {
    console.error('Streaming error:', error)
    fallbackToNonStreaming()
  }
})`
  },
  {
    id: 'deployment',
    title: 'Production Deployment',
    description: 'Deploy AgentOS with Docker and Kubernetes',
    language: 'yaml',
    category: 'deployment',
    code: `# docker-compose.yml
version: '3.8'

services:
  agentos:
    image: framersai/agentos:latest
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - DATABASE_URL=postgresql://postgres:password@db:5432/agentos
      - REDIS_URL=redis://cache:6379
      - VECTOR_DB_URL=http://vectordb:8000
    ports:
      - "3000:3000"
    depends_on:
      - db
      - cache
      - vectordb
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=agentos
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  vectordb:
    image: qdrant/qdrant
    volumes:
      - qdrant_data:/qdrant/storage

  monitoring:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  postgres_data:
  redis_data:
  qdrant_data:

# Kubernetes deployment (agentos-deployment.yaml)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agentos
spec:
  replicas: 5
  selector:
    matchLabels:
      app: agentos
  template:
    metadata:
      labels:
        app: agentos
    spec:
      containers:
      - name: agentos
        image: framersai/agentos:latest
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: NODE_ENV
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: agentos-secrets
              key: openai-api-key`
  }
]

export function CodeExamplesSection() {
  const [activeExample, setActiveExample] = useState(codeExamples[0])
  const [activeCategory, setActiveCategory] = useState<'all' | CodeExample['category']>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const filteredExamples = activeCategory === 'all'
    ? codeExamples
    : codeExamples.filter(ex => ex.category === activeCategory)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const categoryIcons = {
    basic: <Terminal className="w-4 h-4" />,
    advanced: <Cpu className="w-4 h-4" />,
    integration: <GitBranch className="w-4 h-4" />,
    deployment: <Database className="w-4 h-4" />
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            Code Examples & API Reference
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Practical examples showing real-world AgentOS implementations
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 p-1 bg-background-glass backdrop-blur-md rounded-xl border border-border-subtle">
            {[
              { value: 'all', label: 'All Examples', icon: <Code2 className="w-4 h-4" /> },
              { value: 'basic', label: 'Basic', icon: categoryIcons.basic },
              { value: 'advanced', label: 'Advanced', icon: categoryIcons.advanced },
              { value: 'integration', label: 'Integration', icon: categoryIcons.integration },
              { value: 'deployment', label: 'Deployment', icon: categoryIcons.deployment }
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Example List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              Examples
            </h3>
            {filteredExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(example)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  activeExample.id === example.id
                    ? 'bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30'
                    : 'hover:bg-background-tertiary border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {categoryIcons[example.category]}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-primary">
                      {example.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">
                      {example.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code Display */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeExample.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background-primary rounded-2xl border border-border-subtle overflow-hidden shadow-neumorphic"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-primary">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {activeExample.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {activeExample.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-background-tertiary rounded-lg text-xs font-medium">
                    {activeExample.language}
                  </span>
                  <button
                    onClick={() => copyCode(activeExample.code, activeExample.id)}
                    className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    {copied === activeExample.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={activeExample.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers
                >
                  {activeExample.code}
                </SyntaxHighlighter>
              </div>

              {/* Footer with Try It / Docs Links */}
              <div className="p-4 border-t border-border-primary bg-background-secondary/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <a
                      href={`https://playground.agentos.sh?example=${activeExample.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-accent-primary hover:text-accent-hover flex items-center gap-1"
                    >
                      Try in Playground →
                    </a>
                    <a
                      href={`https://docs.agentos.sh/examples/${activeExample.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text-secondary hover:text-text-primary flex items-center gap-1"
                    >
                      View Docs →
                    </a>
                  </div>
                  <span className="text-xs text-text-muted">
                    Category: {activeExample.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20"
        >
          <h3 className="text-2xl font-bold mb-3">Ready to build?</h3>
          <p className="text-text-secondary mb-6">
            Install AgentOS and start building intelligent agents in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <code className="px-6 py-3 bg-background-primary rounded-xl font-mono text-sm border border-border-primary">
              npm install @agentos/core
            </code>
            <a
              href="https://docs.agentos.sh/quickstart"
              className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white hover:shadow-lg transition-all"
            >
              View Quick Start Guide
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}