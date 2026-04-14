# Design Spec: AI Companion Case Study Blog Post

## Overview

A storytelling-driven blog post for agentos.sh that uses a real wilds.ai companion conversation as the hook, then peels back the AgentOS layers that make each moment possible. Broader audience (not just developers), code blocks earn their place by explaining observed behavior.

## Metadata

- **File:** `apps/agentos.sh/content/blog/ai-companion-case-study-wilds.md`
- **Title:** "The AI That Remembers Your Name, Sends You Memes, and Knows When You're Lying"
- **Subtitle:** "How we built wilds.ai on AgentOS, and what happens when you give AI companions real tools instead of scripted responses."
- **Author:** AgentOS Team
- **Category:** Case Study
- **Target length:** 1,800-2,200 words
- **SEO keywords:** AI companion framework, AI character memory, persistent AI companion, TypeScript AI agent, AI companion SDK, build AI companion, AI companion with tools, agentic AI tools, AI personality system, HEXACO personality AI, AI companion app, AI roleplay with memory

## Structure

### 1. The Hook (~250 words)

Real conversation from wilds.ai, April 13, 2026. A user chats with Alice (an AI companion based on Alice in Wonderland). Across multiple sessions over several days:

- She remembers his name from a prior session ("You told me your name is Johnny Dunn")
- He asks for memes. She calls `send_gif` and shares a cat GIF from Giphy
- He says "that's scary, describe it." She calls `analyze_image` with the GIF URL, gets a VLM description back, and responds with what she actually sees
- He asks "what was my 7th message?" She calls `recall_messages` to search her conversation history and answers correctly

Punchline: Alice decided to do all of this. No scripted triggers, no hardcoded rules. She has tools and she uses them when the conversation calls for it.

### 2. "Most AI companions are stateless parrots" (~200 words)

The typical AI chat experience: no memory between sessions, personality resets every conversation, tools are either missing or triggered by keyword matching. The user has to re-introduce themselves every time. The AI can't see images it sends. It can't search its own conversation history.

Frame the gap without naming competitors. The audience already knows the frustration.

### 3. Memory That Actually Works (~300 words)

How Alice's memory system operates:

- **Ebbinghaus forgetting curve:** memories decay over time based on encoding strength, with periodic consolidation. Unimportant details fade. Emotional moments persist.
- **4-stage retrieval:** semantic recall (embedding similarity), recency recall (recent memories first), GraphRAG fallback (relationship graph traversal), attachment recall (images and files)
- **Flashbulb memories:** high-emotion moments get encoding boosts and resist decay
- **Memory types:** episodic (experiences), semantic (facts like "Johnny is 33"), procedural (skills), relational (relationship dynamics), prospective (reminders)

Code block: the memory bridge wiring in CompanionOrchestrator, showing how `createAgent()` receives the memory tools.

```typescript
const orchestrator = new CompanionOrchestrator(persona, relationship, {
  memoryBridge,
  history: messages,
  onRecallMessages: buildDbRecallCallback(actorId, slug),
  onRecallAttachments: buildDbAttachmentRecallCallback(actorId, slug),
  totalMessageCount: snapshot.messageCount,
});
```

Link to: [Cognitive Memory docs](https://docs.agentos.sh/features/cognitive-memory)

### 4. Tools She Decides to Use (~300 words)

The 8 agentic tools available to every companion:

| Tool | What it does | When she uses it |
|------|-------------|------------------|
| `recall_messages` | Search conversation history | "What did I say 3 messages ago?" |
| `search_conversation` | Full-text search across all messages | "Did I mention X?" |
| `recall_memories` | Query long-term memory | "What do you remember about me?" |
| `recall_attachments` | Find shared images/files | "Show me that photo I sent" |
| `send_gif` | Search and share GIFs from Giphy | Humor, reactions, emphasis |
| `send_selfie` | Generate a selfie image | "Send me a photo of you" |
| `analyze_image` | VLM vision analysis of any image URL | "Describe what you just sent" |
| `web_search` | Search the web | "Look up X for me" |

The key insight: these are defined as closures on `createAgent()`, not loaded from a registry. Each tool captures request-scoped state (user ID, companion slug, policy tier). The LLM decides when to call them based on conversation context.

Code block: the analyze_image tool definition.

```typescript
const agent = createAgent({
  name: persona.name,
  tools: {
    analyze_image: {
      description: 'Look at an image URL to see what it contains.',
      parameters: {
        type: 'object',
        properties: {
          image_url: { type: 'string' },
        },
        required: ['image_url'],
      },
      execute: async ({ image_url }) => {
        const description = await describeImage(image_url);
        return { description };
      },
    },
    // ... 7 more tools
  },
  maxSteps: 8,
});
```

Link to: [Tools docs](https://docs.agentos.sh/architecture/tools)

### 5. Personality That Doesn't Break (~250 words)

- **HEXACO trait system:** six personality dimensions (honesty-humility, emotionality, extraversion, agreeableness, conscientiousness, openness) scored 0-1. Alice has high openness and curiosity, moderate agreeableness. These shape her tone, not just her words.
- **Policy routing:** content safety tiers (safe, standard, mature, private-adult) enforced at the framework level. Alice deflects sexual requests in character ("my adventures are more in the realm of tea parties") rather than with a corporate refusal.
- **Graduated familiarity:** trust starts low. As the user chats more and forms memories, Alice opens up. Early conversations are polite and curious. After 50 messages, she teases and uses inside jokes.

Code block: personality config on createAgent().

```typescript
const agent = createAgent({
  name: 'Alice',
  personality: {
    honesty: 0.7,
    emotionality: 0.6,
    extraversion: 0.8,
    agreeableness: 0.65,
    conscientiousness: 0.5,
    openness: 0.9,
  },
  // ...
});
```

Link to: [HEXACO Personality docs](https://docs.agentos.sh/features/cognitive-memory-guide)

### 6. Build Your Own Alice (~200 words)

The five AgentOS primitives that make this possible:

1. `createAgent()` with inline tools and personality
2. Cognitive memory with Ebbinghaus decay
3. Policy routing for content safety
4. VLM vision pipeline for image understanding
5. Media service integration (Giphy, Pexels, Unsplash, DALL-E)

All TypeScript. All `npm install @framers/agentos`. Under 50 lines for a working companion with memory and tools.

CTA: link to the [5-minute quickstart](https://agentos.sh/blog/build-typescript-ai-agent-5-minutes), the [GitHub repo](https://github.com/framersai/agentos), and [wilds.ai](https://wilds.ai) to try it live.

### 7. Footer

Standard footer matching existing posts: "AgentOS is built by Manic Agency LLC / Frame.dev. See Wilds.ai for AI companions and game worlds powered by AgentOS."

## Tone and Style

- Storytelling first, code second
- Every code block earns its place by explaining an observed behavior from the opening scene
- No marketing fluff ("revolutionary", "cutting-edge", "game-changing")
- No hedging ("aims to", "tries to", "currently")
- State what it does. Show the code. Link the docs.
- Em dashes replaced with periods, commas, colons
- No sycophancy, no mirror-back

## Citations

- Link to AgentOS docs for each technical claim (memory, tools, personality, guardrails)
- Link to wilds.ai for the live product
- Link to GitHub repo for source code
- Link to existing blog posts where relevant (quickstart, comparison)

## SEO Strategy

- Title targets "AI companion" + intrigue (curiosity gap)
- H2 headings use searchable phrases: "memory that actually works", "tools she decides to use", "personality that doesn't break"
- Keywords in first paragraph, subheadings, and meta description
- Internal links to other agentos.sh blog posts and docs pages
- External link to wilds.ai as the production showcase

## Success Criteria

- Non-developer reads the hook and opening sections without bouncing
- Developer reads the code blocks and understands how to replicate
- Post ranks for "AI companion framework", "AI companion with memory", "build AI companion TypeScript"
- Drives traffic to both agentos.sh docs and wilds.ai signups
