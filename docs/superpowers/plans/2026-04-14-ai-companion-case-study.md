# AI Companion Case Study Blog Post Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write and publish a storytelling-driven blog post on agentos.sh showing how wilds.ai's AI companion system works, using a real conversation as the hook and AgentOS code as the reveal.

**Architecture:** Single markdown file in the existing blog content directory. Follows the established frontmatter format (title, date, excerpt, author, category, image, keywords). Uses the `/deep-write` research pipeline if available for citation verification, otherwise manual citation.

**Tech Stack:** Markdown, existing agentos.sh Next.js blog rendering pipeline

**Spec:** `apps/agentos.sh/docs/superpowers/specs/2026-04-13-ai-companion-case-study-design.md`

---

### Task 1: Research and verify all technical claims

**Files:**
- Reference: `apps/wilds-ai/packages/wilds-companions/src/CompanionOrchestrator.ts`
- Reference: `apps/wilds-ai/src/app/api/v1/companions/[id]/messages/route.ts`
- Reference: `apps/wilds-ai/packages/wilds-companions/src/runtime.ts`
- Reference: `packages/agentos/src/skills/SkillRegistry.ts`

- [ ] **Step 1: Verify memory system claims**

Read `CompanionOrchestrator.ts` and confirm:
- Ebbinghaus decay is implemented (search for `ebbinghaus` or `decay`)
- 4-stage retrieval exists (semantic, recency, GraphRAG, attachment)
- Flashbulb memories exist (search for `flashbulb`)
- Memory types match: episodic, semantic, procedural, relational, prospective

- [ ] **Step 2: Verify agentic tool claims**

Read `CompanionOrchestrator.ts` tool definitions (around line 1550-1650) and confirm all 8 tools exist:
- `recall_messages`, `search_conversation`, `conversation_stats`
- `recall_attachments`, `recall_memories`
- `send_gif`, `send_selfie`, `send_photo`, `web_search`, `generate_image`
- `analyze_image`

Count the actual number. The post should use the real count, not an assumed one.

- [ ] **Step 3: Verify personality system claims**

Read `CompanionOrchestrator.ts` agent creation (around line 1650-1700) and confirm:
- HEXACO traits are passed to `createAgent()`
- Policy routing exists (search for `policyRouter`)
- Graduated familiarity exists (search for `familiarity`)

- [ ] **Step 4: Extract real code snippets**

Pull the actual code blocks that will appear in the post. Do not fabricate code. Use simplified versions of real code with non-essential lines removed. Capture:
1. The orchestrator constructor call showing memory bridge wiring
2. The `analyze_image` tool definition
3. The personality config on `createAgent()`

---

### Task 2: Write the blog post

**Files:**
- Create: `apps/agentos.sh/content/blog/ai-companion-case-study-wilds.md`

- [ ] **Step 1: Write the frontmatter**

```markdown
---
title: "The AI That Remembers Your Name, Sends You Memes, and Knows When You're Lying"
date: "2026-04-14"
excerpt: "A user asks their AI companion to describe a GIF it just sent. The companion calls a vision tool, looks at the image, and responds with what it sees. None of this is scripted. Here's how AgentOS makes it possible."
author: "AgentOS Team"
category: "Case Study"
image: "/og-image.png"
keywords: "AI companion framework, AI character memory, persistent AI companion, TypeScript AI agent, AI companion SDK, build AI companion, AI companion with tools, agentic AI tools, AI personality system, HEXACO personality AI, AI companion app, AI roleplay with memory, wilds.ai, AgentOS case study"
---
```

- [ ] **Step 2: Write Section 1 - The Hook (~250 words)**

Open with the real Alice conversation from April 13, 2026. Include actual conversation excerpts formatted as blockquotes. Cover: she remembers his name across sessions, sends a cat GIF via Giphy tool call, gets asked "that's scary, describe it", calls `analyze_image` to actually look at the GIF, responds with what she sees. End with: "None of this is scripted. Alice decided to do all of it."

- [ ] **Step 3: Write Section 2 - "Most AI companions are stateless parrots" (~200 words)**

Contrast with the typical AI chat experience. No memory between sessions, personality resets, no real tools. The user re-introduces themselves every time. The AI says "I can't see images" about content it just sent. Frame the gap without naming competitors.

- [ ] **Step 4: Write Section 3 - Memory That Actually Works (~300 words)**

Cover Ebbinghaus decay, 4-stage retrieval, flashbulb memories, memory types. Include the orchestrator constructor code block from Task 1 Step 4. Link to cognitive memory docs.

- [ ] **Step 5: Write Section 4 - Tools She Decides to Use (~300 words)**

List all agentic tools in a table. Explain the inline closure pattern. Include the `analyze_image` tool definition code block from Task 1 Step 4. Link to tools docs.

- [ ] **Step 6: Write Section 5 - Personality That Doesn't Break (~250 words)**

Cover HEXACO, policy routing, graduated familiarity. Include the personality config code block from Task 1 Step 4. Use Alice's actual in-character deflection as an example. Link to personality docs.

- [ ] **Step 7: Write Section 6 - Build Your Own Alice (~200 words)**

List the 5 AgentOS primitives. CTA with links to quickstart, GitHub, wilds.ai. Add the standard footer.

- [ ] **Step 8: Self-review the complete post**

Read the full post end-to-end. Check:
- No em dashes (use periods, commas, colons)
- No hedging language ("aims to", "tries to", "currently")
- No marketing fluff ("revolutionary", "cutting-edge")
- All code blocks are real (from Task 1)
- All links resolve to real URLs
- Word count is 1,800-2,200
- Every H2 heading contains a searchable phrase

---

### Task 3: Commit and verify

**Files:**
- Create: `apps/agentos.sh/content/blog/ai-companion-case-study-wilds.md`

- [ ] **Step 1: Stage and commit the blog post**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant/apps/agentos.sh
git add content/blog/ai-companion-case-study-wilds.md
git commit -m "blog: AI companion case study - wilds.ai on AgentOS"
```

- [ ] **Step 2: Verify the post renders**

Check that the markdown file has valid frontmatter and no broken syntax:
```bash
head -10 content/blog/ai-companion-case-study-wilds.md
```

Confirm the frontmatter fields match the existing post format (title, date, excerpt, author, category, image, keywords).

- [ ] **Step 3: Push**

```bash
git push origin master
```
