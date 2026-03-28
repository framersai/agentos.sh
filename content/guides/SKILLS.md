# Skills (SKILL.md)

AgentOS supports **skills**: modular prompt modules defined by a `SKILL.md` file.

Skills are intended to complement tools/extensions:

- **Tools** are atomic operations (`ITool`) that the runtime can execute.
- **Skills** are higher-level instructions/workflows injected into the agent’s prompt.

## File format

Each skill lives in its own folder containing `SKILL.md`:

```md
---
name: github
description: Use the GitHub CLI (gh) for issues, PRs, and repos.
metadata:
  agentos:
    emoji: "🐙"
    primaryEnv: GITHUB_TOKEN
    requires:
      bins: ["gh"]
    install:
      - id: brew
        kind: brew
        formula: gh
        bins: ["gh"]
---

# GitHub (gh CLI)

Use the `gh` CLI to interact with GitHub repositories.
```

## Runtime API

Load skills from one or more directories:

```ts
import { SkillRegistry } from '@framers/agentos/skills';

const registry = new SkillRegistry();
await registry.loadFromDirs(['./skills']);

const snapshot = registry.buildSnapshot({ platform: process.platform });
console.log(snapshot.prompt);
```

## Curated registry (optional)

- `@framers/agentos-skills-registry` — catalog SDK with typed query helpers and snapshot factories
- `@framers/agentos-skills` — 69 curated SKILL.md files + registry.json

The curated content currently includes **69 skills** spanning developer tools, productivity, information, communication, memory, social media, and voice. See `@framers/agentos-skills/registry.json` for the canonical list.

`@framers/agentos-skills-registry` supports two usage modes:

- Lightweight catalog queries (no `@framers/agentos` peer dependency)
- Factory helpers that **lazy-load** `@framers/agentos/skills` only when called (to build a `SkillRegistry` or snapshot)

When you pass `skills: ['github', 'weather']` to the snapshot helper, it loads only
those requested curated skills before building the prompt snapshot.

The skills engine (`@framers/agentos/skills`) provides `SkillRegistry`, which exposes
`skills_list`, `skills_read`, `skills_status`, `skills_enable`, and `skills_install`
tools. Curated skill content (the actual SKILL.md files) ships in `@framers/agentos-skills`.

Catalog loaders like `loadSkillByName()` return the SKILL body, typed frontmatter,
and parsed `metadata`, so callers can read fields like `primaryEnv`, `emoji`,
or install requirements without re-parsing `metadata.agentos` manually.

## Agentic discovery (optional)

If you want agents to **discover and enable** curated skills at runtime (HITL-gated):

- `@framers/agentos/skills` — the engine that exposes `skills_list`, `skills_read`, `skills_enable`, `skills_status`, and `skills_install` tools via `SkillRegistry`.
- `@framers/agentos-skills` — the content package (69 SKILL.md files + registry.json).
