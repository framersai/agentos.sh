'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { motion } from 'framer-motion'
import { Copy, Check, Code2, Cpu, Database, GitBranch, Sparkles, Play, Book } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SectionLabel } from '../ui/section-label'

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  category: 'basic' | 'advanced' | 'integration' | 'deployment'
}

export function CodeExamplesSection() {
  const t = useTranslations('codeExamples')
  const tFooter = useTranslations('footer')

  const codeExamples: CodeExample[] = useMemo(() => ([
  {
    id: 'basic-agent',
    title: t('examples.basicAgent.title'),
    description: t('examples.basicAgent.description'),
    language: 'typescript',
    category: 'basic',
    code: `// package.json must have "type": "module" (ESM required)
import { agent } from '@framers/agentos'

// Define a simple calculator tool (ITool shape)
const calculatorTool = {
  name: 'calculator',
  description: 'Performs basic math operations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: { type: 'string', enum: ['add', 'multiply', 'divide'] },
      a: { type: 'number' },
      b: { type: 'number' },
    },
    required: ['operation', 'a', 'b'],
  },
  execute: async (args) => {
    const { operation, a, b } = args
    switch (operation) {
      case 'add':      return { success: true, output: a + b }
      case 'multiply': return { success: true, output: a * b }
      case 'divide':   return { success: true, output: b !== 0 ? a / b : 'Division by zero' }
      default:         return { success: false, error: 'Unknown operation' }
    }
  },
}

// Create a stateful agent with tools
const mathAgent = agent({
  model: 'openai:gpt-4o',
  instructions: 'You are a helpful math assistant. Use the calculator tool for computations.',
  tools: [calculatorTool],
  maxSteps: 5,
})

// Generate a response (tool calls happen automatically)
const result = await mathAgent.generate('What is 42 multiplied by 17?')
console.log(result.text)
// => "42 multiplied by 17 equals 714."`
  },
  {
    id: 'gmi-roles',
    title: t('examples.gmiRoles.title'),
    description: t('examples.gmiRoles.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { agency, hitl } from '@framers/agentos'

// Create a multi-agent agency with sequential orchestration
const researchTeam = agency({
  model: 'openai:gpt-4o',   // shared default model
  strategy: 'sequential',    // agents run one after another
  agents: {
    researcher: {
      instructions: \`You are a thorough researcher.
        Find accurate, well-sourced information on the topic.
        Include citations where possible.\`,
    },
    writer: {
      instructions: \`You are an academic writer.
        Take the researcher's findings and write a clear,
        well-structured article for technical professionals.\`,
    },
    reviewer: {
      instructions: \`You are a fact-checker and editor.
        Review the article for accuracy, clarity, and tone.
        Return the polished final version.\`,
    },
  },
  // Optional: resource controls
  controls: { maxTotalTokens: 50_000, onLimitReached: 'warn' },
  // Optional: require human approval before certain tools
  hitl: { approvals: { beforeTool: ['web_search'] }, handler: hitl.autoApprove() },
})

// The agency exposes the same interface as a single agent
const result = await researchTeam.generate(
  'Write a comprehensive article about quantum computing applications'
)

console.log(result.text)
console.log('Agent calls:', result.agentCalls?.length)`
  },
  {
    id: 'memory-system',
    title: t('examples.memorySystem.title'),
    description: t('examples.memorySystem.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { agent } from '@framers/agentos'

// Create an agent with session-based conversation memory.
// Memory is enabled by default — each session keeps its own history.
const assistant = agent({
  model: 'openai:gpt-4o',
  instructions: 'You are a persistent assistant. Refer to earlier messages in the session.',
})

// Open a named session — history is scoped to this ID
const session = assistant.session('user-42')

// Conversation turns are automatically remembered within the session
await session.send('My project deadline is March 30.')
await session.send('We need to finish the API layer by Friday.')

// The agent recalls earlier context from the same session
const result = await session.send('What did we discuss about the project timeline?')
console.log(result.text)
// => Recalls the March 30 deadline and the Friday API target

// Inspect the full conversation history
console.log(session.messages())

// Check token usage across the session
const usage = await session.usage()
console.log(\`Total tokens: \${usage.totalTokens}\`)

// Wipe session history when done
session.clear()`
  },
  {
    id: 'tool-integration',
    title: t('examples.toolIntegration.title'),
    description: t('examples.toolIntegration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { agent, generateText } from '@framers/agentos'

// Define custom tools using the ITool interface
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for any location',
  inputSchema: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name' },
      units: { type: 'string', enum: ['metric', 'imperial'] },
    },
    required: ['location'],
  },
  execute: async ({ location, units = 'metric' }) => {
    const res = await fetch(
      \`https://api.weather.com/v1/current?q=\${location}&units=\${units}\`
    )
    return { success: true, output: await res.json() }
  },
}

const searchTool = {
  name: 'web_search',
  description: 'Search the web for recent information',
  inputSchema: {
    type: 'object',
    properties: { query: { type: 'string' } },
    required: ['query'],
  },
  execute: async ({ query }) => {
    // Your search implementation here
    return { success: true, output: { results: [\`Results for: \${query}\`] } }
  },
}

// Create an agent with multiple tools — it selects the right tool per step
const travelAgent = agent({
  model: 'openai:gpt-4o',
  instructions: 'You are a travel assistant. Use tools to get weather and search for news.',
  tools: [weatherTool, searchTool],
  maxSteps: 10,
})

// The agent automatically chains tool calls to fulfill the request
const result = await travelAgent.generate(
  'Check the weather in Tokyo, find recent news about it, and create a travel summary'
)
console.log(result.text)
console.log('Tool calls made:', result.toolCalls.length)`
  },
  {
    id: 'skills-integration',
    title: t('examples.skillsIntegration.title'),
    description: t('examples.skillsIntegration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { searchSkills, getSkillsByCategory } from '@framers/agentos-skills-registry/catalog'
import { createCuratedManifest } from '@framers/agentos-extensions-registry'

// Browse the catalog (zero deps, works anywhere)
const devTools = getSkillsByCategory('developer-tools')
// => [{ name: 'github', ... }, { name: 'coding-agent', ... }, { name: 'git', ... }]

const matches = searchSkills('slack')
// => [{ name: 'slack-helper', category: 'communication', ... }]

// Register extensions + channels in one call
const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord', 'slack'],
  tools: 'all',
})`
  },
  {
    id: 'streaming',
    title: t('examples.realtimeStream.title'),
    description: t('examples.realtimeStream.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { streamText, agent } from '@framers/agentos'

// --- Option 1: Stateless streaming with streamText() ---
const stream = streamText({
  model: 'openai:gpt-4o',
  prompt: 'Explain quantum computing in simple terms',
})

// Iterate over raw text deltas as they arrive
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)   // print tokens incrementally
}

// After the stream finishes, await aggregated results
const fullText = await stream.text
const usage = await stream.usage
console.log('\\nTokens used:', usage.totalTokens)

// --- Option 2: Agent streaming with session memory ---
const myAgent = agent({
  model: 'anthropic:claude-sonnet-4-20250514',
  instructions: 'You are a helpful science tutor.',
})

// .stream() returns the same StreamTextResult shape
const agentStream = myAgent.stream('What is quantum entanglement?')

// fullStream yields typed events: text, tool-call, tool-result, error
for await (const part of agentStream.fullStream) {
  switch (part.type) {
    case 'text':
      process.stdout.write(part.text)
      break
    case 'tool-call':
      console.log('\\nCalling tool:', part.toolName)
      break
    case 'tool-result':
      console.log('Tool result:', part.result)
      break
  }
}`
  },
  {
    id: 'mission-orchestrator',
    title: t('examples.missionOrchestrator.title'),
    description: t('examples.missionOrchestrator.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { mission } from '@framers/agentos/orchestration'
import { z } from 'zod'

// Describe a goal — the Tree of Thought planner handles the rest.
// It generates 3 candidate decompositions, scores each on
// feasibility/cost/latency/robustness, and picks the best one.
const research = mission('competitor-analysis')
  .input(z.object({ topic: z.string() }))
  .goal('Research {{topic}}, compare the top 5 solutions, and write a report')
  .returns(z.object({ report: z.string(), sources: z.array(z.string()) }))
  .planner({ strategy: 'adaptive', maxSteps: 8 })
  .autonomy('guardrailed')        // auto-approve below thresholds
  .providerStrategy('balanced')   // strong models for reasoning, cheap for routing
  .costCap(5.00)                  // hard spending limit
  .compile()

// Stream execution events in real time
for await (const event of research.stream({ topic: 'vector databases' })) {
  if (event.type === 'text_delta') process.stdout.write(event.content)
  if (event.type === 'mission:agent_spawned')
    console.log(\`\\nAgent spawned: \${event.role} (\${event.provider}/\${event.model})\`)
  if (event.type === 'mission:cost_update')
    console.log(\`Cost: $\${event.totalSpent.toFixed(2)} / $\${event.costCap.toFixed(2)}\`)
}

const result = await research.invoke({ topic: 'vector databases' })
console.log(result.report)`
  },
  {
    id: 'voice-agent',
    title: t('examples.voiceAgent.title'),
    description: t('examples.voiceAgent.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { agent } from '@framers/agentos'

// Voice agent with tool calling — speaks, listens, and acts.
// Deepgram for STT (streaming), ElevenLabs for TTS (low latency).
const concierge = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  instructions: \`You are a hotel concierge. Help guests with reservations,
    local recommendations, and room service orders. Be warm and concise —
    you're speaking, not writing.\`,
  tools: [
    {
      name: 'book_restaurant',
      description: 'Book a table at a local restaurant',
      inputSchema: {
        type: 'object',
        properties: {
          restaurant: { type: 'string' },
          guests: { type: 'number' },
          time: { type: 'string' },
        },
        required: ['restaurant', 'guests', 'time'],
      },
      execute: async ({ restaurant, guests, time }) => ({
        success: true,
        output: \`Booked \${guests} guests at \${restaurant} for \${time}\`,
      }),
    },
  ],
  voice: {
    enabled: true,
    stt: { provider: 'deepgram', model: 'nova-2' },
    tts: { provider: 'elevenlabs', voice: 'rachel' },
    endpointDetection: 'heuristic',
    bargein: 'hard_cut',           // stop speaking when user interrupts
    silenceTimeoutMs: 1400,
  },
})

// Start a live voice session
const session = await concierge.startVoiceSession()
console.log('Listening... (Ctrl+C to stop)')`
  },
  {
    id: 'orchestration-graph',
    title: t('examples.orchestrationGraph.title'),
    description: t('examples.orchestrationGraph.description'),
    language: 'typescript',
    category: 'advanced',
    code: `import { AgentGraph } from '@framers/agentos/orchestration'

// Build a cyclic review loop: draft -> review -> revise (until quality passes)
// then human approval gate -> publish. Full graph control with typed edges.
const reviewPipeline = new AgentGraph('content-review')
  .addNode('draft', {
    type: 'gmi',
    instructions: 'Write a blog post about the given topic. Be thorough.',
  })
  .addNode('review', {
    type: 'judge',
    rubric: 'Score 1-10 on accuracy, clarity, engagement. Explain issues.',
    threshold: 7,
  })
  .addNode('revise', {
    type: 'gmi',
    instructions: 'Revise the draft based on the reviewer feedback.',
  })
  .addNode('approve', {
    type: 'human',
    prompt: 'The draft scored 7+. Approve for publication?',
  })
  .addNode('publish', {
    type: 'tool',
    toolName: 'publish_post',
  })
  // Wire the graph — note the cycle: revise loops back to review
  .addEdge('draft', 'review')
  .addEdge('review', 'revise', { condition: 'score < 7' })
  .addEdge('review', 'approve', { condition: 'score >= 7' })
  .addEdge('revise', 'review')      // cycle until quality passes
  .addEdge('approve', 'publish')
  .compile()

// Execute with streaming events
for await (const event of reviewPipeline.stream({ topic: 'AI agents' })) {
  if (event.type === 'node_start') console.log(\`\\n[\${event.nodeId}] started\`)
  if (event.type === 'text_delta') process.stdout.write(event.content)
  if (event.type === 'interrupt') console.log('\\nWaiting for human approval...')
}`
  },
  {
    id: 'image-generation',
    title: t('examples.imageGeneration.title'),
    description: t('examples.imageGeneration.description'),
    language: 'typescript',
    category: 'integration',
    code: `import { generateImage, generateText } from '@framers/agentos'

// Generate an image with any provider — unified API
const { url, revisedPrompt } = await generateImage({
  provider: 'openai',           // or 'stability', 'replicate', 'bfl'
  prompt: 'A cyberpunk cityscape at sunset, neon signs in Japanese, rain',
  size: '1024x1024',
})
console.log('Image:', url)
console.log('Revised prompt:', revisedPrompt)

// Chain with text generation — analyze the image with vision
const analysis = await generateText({
  provider: 'openai',
  model: 'gpt-4o',
  prompt: [
    { type: 'text', text: 'Describe this image in one sentence.' },
    { type: 'image', url },
  ],
})
console.log('Description:', analysis.text)

// Generate multiple images in parallel with different providers
const [openaiImg, stabilityImg, fluxImg] = await Promise.all([
  generateImage({ provider: 'openai', prompt: 'A minimalist logo for an AI company' }),
  generateImage({ provider: 'stability', prompt: 'A minimalist logo for an AI company' }),
  generateImage({ provider: 'bfl', prompt: 'A minimalist logo for an AI company' }),
])
console.log('Compare:', openaiImg.url, stabilityImg.url, fluxImg.url)`
  },
  {
    id: 'deployment',
    title: t('examples.deployment.title'),
    description: t('examples.deployment.description'),
    language: 'bash',
    category: 'deployment',
    code: `# Install the Wunderland CLI
npm install -g @framers/wunderland

# Create an agent from natural language
wunderland create "A research assistant that finds papers and writes summaries"

# Chat with your agent
wunderland chat --provider anthropic

# Run a mission (Tree of Thought planning + multi-agent execution)
wunderland mission "Research the top 5 AI frameworks, compare architectures, write a report" \\
  --autonomy guardrailed \\
  --provider-strategy balanced \\
  --cost-cap 5.00

# Generate deployment artifacts
wunderland deploy --target docker

# Or deploy directly
docker compose up -d

# Monitor running agents
wunderland status
wunderland monitor`
  }
]), [t])
  const [activeExample, setActiveExample] = useState(codeExamples[0])
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'advanced' | 'integration' | 'deployment'>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [SyntaxHighlighter, setSyntaxHighlighter] = useState<null | (typeof import('react-syntax-highlighter').Prism)>(null)
  const [syntaxTheme, setSyntaxTheme] = useState<Record<string, React.CSSProperties> | null>(null)
  const [codeViewerReady, setCodeViewerReady] = useState(false)
  
  // Auto-select first example when category changes
  useEffect(() => {
    const filtered = activeCategory === 'all' ? codeExamples : codeExamples.filter((ex) => ex.category === activeCategory)
    if (filtered.length > 0) {
      setActiveExample(filtered[0])
    }
  }, [activeCategory, codeExamples])

  // Defer loading the heavy code highlighter until after mount/idle
  useEffect(() => {
    const loadHighlighter = () => {
      Promise.all([
        import('react-syntax-highlighter').then(m => m.Prism),
        import('react-syntax-highlighter/dist/esm/styles/prism').then(m => m.vscDarkPlus)
      ]).then(([PrismComp, theme]) => {
        setSyntaxHighlighter(() => PrismComp)
        setSyntaxTheme(theme)
        setCodeViewerReady(true)
      }).catch(() => {
        // no-op fallback; keep viewer minimal if load fails
      })
    }
    if ('requestIdleCallback' in window) {
      const w = window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }
      w.requestIdleCallback(loadHighlighter, { timeout: 1500 })
    } else {
      setTimeout(loadHighlighter, 600)
    }
  }, [])

  const categories = [
    { value: 'all' as const, label: t('categories.all'), icon: Code2, color: 'from-purple-500 to-pink-500' },
    { value: 'basic' as const, label: t('categories.basic'), icon: Code2, color: 'from-blue-500 to-cyan-500' },
    { value: 'advanced' as const, label: t('categories.advanced'), icon: Cpu, color: 'from-green-500 to-emerald-500' },
    { value: 'integration' as const, label: t('categories.integration'), icon: GitBranch, color: 'from-orange-500 to-red-500' },
    { value: 'deployment' as const, label: t('categories.deployment'), icon: Database, color: 'from-indigo-500 to-purple-500' }
  ]

  const filteredExamples = activeCategory === 'all'
    ? codeExamples
    : codeExamples.filter((ex) => ex.category === activeCategory)

  const { copy: clipboardCopy } = useCopyToClipboard()
  const copyCode = (code: string, id: string) => {
    clipboardCopy(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const categoryIcons = {
    basic: Code2,
    advanced: Cpu,
    integration: GitBranch,
    deployment: Database
  }

  return (
    <section id="code" className="py-8 sm:py-12 lg:py-14 px-2 sm:px-6 lg:px-8 relative overflow-hidden transition-theme" aria-labelledby="code-examples-heading">
      {/* Subtle organic gradient background */}
      <div className="absolute inset-0 organic-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <SectionLabel
            icon={<Code2 className="w-4 h-4" />}
            className="mx-auto mb-6 text-sm"
          >
            {t('badge')}
          </SectionLabel>

          <h2 id="code-examples-heading" className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Category Filter - Mobile Responsive */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="inline-flex gap-2 p-1 glass-morphism rounded-2xl min-w-min">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-modern'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Example List - Enhanced Blocks */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">
              {t('selectExample')}
            </h3>
            <div className="space-y-3">
              {filteredExamples.map((example) => {
                const Icon = categoryIcons[example.category]
                return (
                  <motion.button
                    key={example.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveExample(example)}
                    className={`w-full text-left p-4 rounded-xl transition-all relative overflow-hidden group ${
                      activeExample.id === example.id
                        ? 'bg-gradient-to-br from-[var(--color-background-elevated)] to-[var(--color-background-glass)] shadow-lg border border-[var(--color-accent-primary)]'
                        : 'bg-[var(--color-background-glass)] border border-transparent hover:border-[var(--color-border-interactive)]'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                        activeExample.id === example.id ? 'bg-accent-primary' : 'bg-transparent group-hover:bg-accent-primary/50'
                    }`} />
                    
                    <div className="flex items-center gap-3 pl-2">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        activeExample.id === example.id
                          ? 'bg-accent-primary text-white shadow-md'
                          : 'bg-accent-primary/10 text-accent-primary'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm mb-0.5 truncate ${
                            activeExample.id === example.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}>
                          {example.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                          {example.category}
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
                        aria-label={t('copyButton')}
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

        {/* Tabs: Synchronous vs Streaming (if applicable) */}
        <div className="px-6 pt-4 border-b border-border-subtle">
          <div className="inline-flex gap-2 rounded-2xl p-1 glass-morphism">
            <button
              onClick={() => {
                if (activeExample.id === 'streaming') {
                  // no-op, already streaming
                } else {
                  setActiveExample(codeExamples.find((e) => e.id === 'basic-agent') || activeExample)
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeExample.id !== 'streaming'
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-[var(--color-background-elevated)]'
              }`}
            >
              {t('tabs.synchronous')}
            </button>
            <button
              onClick={() => {
                setActiveExample(codeExamples.find((e) => e.id === 'streaming') || activeExample)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeExample.id === 'streaming'
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-[var(--color-background-elevated)]'
              }`}
            >
              {t('tabs.streaming')}
            </button>
          </div>
        </div>

        {/* Code Block with Syntax Highlighting */}
        <div className="flex-1 overflow-auto bg-[#1e1e1e] max-h-[300px] sm:max-h-[400px] lg:max-h-none">
                  {codeViewerReady && SyntaxHighlighter && syntaxTheme ? (
                    <SyntaxHighlighter
                      language={activeExample.language}
                      style={syntaxTheme}
                      showLineNumbers={true}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                      }}
                      lineNumberStyle={{
                        minWidth: '2.5rem',
                        paddingRight: '1rem',
                        color: '#6b7280',
                        userSelect: 'none',
                      }}
                    >
                      {activeExample.code}
                    </SyntaxHighlighter>
                  ) : (
                    <pre
                      aria-busy="true"
                      className="m-0 p-6 text-sm text-gray-200"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                    >
{activeExample.code}
                    </pre>
                  )}
                </div>

                {/* Footer - Interactive */}
                <div className="p-3 sm:p-4 border-t border-border-subtle bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <a
                        href={`https://playground.agentos.sh?example=${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-accent-primary text-white text-xs sm:text-sm font-semibold hover:bg-accent-hover transition-all group"
                      >
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                        {t('runButton')}
                      </a>
                      <a
                        href={`https://docs.agentos.sh/examples/${activeExample.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-accent-primary text-accent-primary text-xs sm:text-sm font-semibold hover:bg-accent-primary/10 transition-all"
                      >
                        <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('docsButton')}</span>
                        <span className="sm:hidden">Docs</span>
                      </a>
                      <a
                        href="https://docs.agentos.sh/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-accent-primary text-accent-primary text-xs sm:text-sm font-semibold hover:bg-accent-primary/10 transition-all"
                      >
                        <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tFooter('apiReferenceTSDoc')}</span>
                        <span className="sm:hidden">API</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
                      <span className="text-xs font-semibold text-text-muted">
                        {t(`categories.${activeExample.category}`)}
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
                {t('cta.title')}
              </h3>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="px-8 py-4 bg-[var(--color-background-elevated)] rounded-xl font-mono text-sm border-2 border-[var(--color-border-interactive)] shadow-lg">
                  <span className="text-[var(--color-text-muted)]">$</span> npm install @framers/agentos
                  <button
                    onClick={() => clipboardCopy('npm install @framers/agentos')}
                    className="ml-3 p-1.5 rounded-md hover:bg-[var(--color-background-secondary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    aria-label="Copy install command"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <a
                  href="https://docs.agentos.sh/getting-started/getting-started"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-[var(--color-text-on-accent)] shadow-lg shadow-[var(--color-accent-primary)]/20 hover:shadow-xl hover:brightness-110 transition-all duration-[var(--duration-fast)]"
                >
                  <Sparkles className="w-5 h-5" />
                  {t('cta.button')}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{t('cta.time')}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}