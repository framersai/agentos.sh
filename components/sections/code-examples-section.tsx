'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Terminal, Code2, Cpu, Database, GitBranch, Sparkles, Play, Book } from 'lucide-react'

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
    code: `import { Agent, Memory, Tool } from '@framersai/agentos'

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
    code: `import { GMI, Agency, Role } from '@framersai/agentos'

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
    code: `import { Agent, VectorMemory, EpisodicMemory, WorkingMemory } from '@framersai/agentos'

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
    code: `import { Agent, Tool, ToolRegistry } from '@framersai/agentos'
import { WebBrowser, CodeInterpreter, DatabaseQuery } from '@framersai/agentos-tools'

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
    code: `import { StreamingAgent, StreamProcessor } from '@framersai/agentos-streaming'

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
  qdrant_data:`
  }
]

export function CodeExamplesSection() {
  const [activeExample, setActiveExample] = useState(codeExamples[0])
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'advanced' | 'integration' | 'deployment'>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const categories = [
    { value: 'all' as const, label: 'All Examples', icon: Code2, color: 'from-purple-500 to-pink-500' },
    { value: 'basic' as const, label: 'Basic', icon: Terminal, color: 'from-blue-500 to-cyan-500' },
    { value: 'advanced' as const, label: 'Advanced', icon: Cpu, color: 'from-green-500 to-emerald-500' },
    { value: 'integration' as const, label: 'Integration', icon: GitBranch, color: 'from-orange-500 to-red-500' },
    { value: 'deployment' as const, label: 'Deployment', icon: Database, color: 'from-indigo-500 to-purple-500' }
  ]

  const filteredExamples = activeCategory === 'all'
    ? codeExamples
    : codeExamples.filter((ex) => ex.category === activeCategory)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const categoryIcons = {
    basic: Terminal,
    advanced: Cpu,
    integration: GitBranch,
    deployment: Database
  }

  return (
    <section id="code" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-6">
            <Code2 className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-semibold text-text-secondary">Code Examples</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Build with AgentOS</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Production-ready code examples and patterns for building intelligent agent systems
          </p>
        </motion.div>

        {/* Category Filter with better styling */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-2 p-1 glass-morphism rounded-2xl">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-modern'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Example List - Enhanced */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">
              Select Example
            </h3>
            <div className="space-y-2">
              {filteredExamples.map((example) => {
                const Icon = categoryIcons[example.category]
                return (
                  <motion.button
                    key={example.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveExample(example)}
                    className={`w-full text-left p-4 rounded-2xl transition-all ${
                      activeExample.id === example.id
                        ? 'glass-morphism shadow-modern border-l-4 border-accent-primary'
                        : 'hover:bg-background-primary/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeExample.id === example.id
                          ? 'bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20'
                          : 'bg-background-tertiary'
                      }`}>
                        <Icon className="w-4 h-4 text-accent-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-text-primary mb-1">
                          {example.title}
                        </p>
                        <p className="text-xs text-text-muted line-clamp-2">
                          {example.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Code Display - Much better styling */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeExample.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="glass-morphism rounded-3xl overflow-hidden shadow-modern-lg h-full flex flex-col">
                {/* Header - Enhanced */}
                <div className="p-6 border-b border-border-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {activeExample.title}
                      </h3>
                      <p className="text-text-secondary">
                        {activeExample.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 text-xs font-bold text-accent-primary">
                        {activeExample.language}
                      </span>
                      <button
                        onClick={() => copyCode(activeExample.code, activeExample.id)}
                        className="p-2.5 rounded-lg hover:bg-accent-primary/10 transition-all group"
                        aria-label="Copy code"
                      >
                        {copied === activeExample.id ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Code Block - Clean, no harsh lines */}
                <div className="flex-1 overflow-auto bg-gradient-to-br from-background-primary to-background-secondary">
                  <pre className="p-6 text-sm font-mono leading-relaxed">
                    <code className="language-typescript text-text-primary">
                      {activeExample.code.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="select-none text-text-muted opacity-50 mr-6 text-right" style={{ minWidth: '2rem' }}>
                            {i + 1}
                          </span>
                          <span className="flex-1">{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Footer - Interactive */}
                <div className="p-4 border-t border-border-subtle bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <a
                        href={`https://playground.agentos.sh?example=${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary text-white font-semibold hover:bg-accent-hover transition-all group"
                      >
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Try in Playground
                      </a>
                      <a
                        href={`https://docs.agentos.sh/examples/${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-accent-primary text-accent-primary font-semibold hover:bg-accent-primary/10 transition-all"
                      >
                        <Book className="w-4 h-4" />
                        View Docs
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
                      <span className="text-xs font-semibold text-text-muted">
                        {activeExample.category.charAt(0).toUpperCase() + activeExample.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Start CTA - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-3xl glass-morphism p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-accent-secondary/10 to-accent-tertiary/10" />

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                Ready to Build Your First Agent?
              </h3>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Get started with AgentOS in less than 5 minutes. Install the SDK and follow our interactive tutorial.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="px-8 py-4 bg-background-primary rounded-2xl font-mono text-sm border-2 border-accent-primary/30 shadow-modern">
                  <span className="text-text-muted">$</span> npm install @framersai/agentos
                </div>

                <a
                  href="https://docs.agentos.sh/quickstart"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Building
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">5 min</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
