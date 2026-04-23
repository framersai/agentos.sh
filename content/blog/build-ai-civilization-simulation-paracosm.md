---
title: "Build an AI Civilization Simulation in 5 Minutes with Paracosm"
date: "2026-04-14"
excerpt: "Define any world as JSON. Assign AI commanders with HEXACO personality profiles. Run a deterministic simulation where personality shapes civilization. A tutorial and case study using Paracosm and AgentOS."
author: "AgentOS Team"
category: "Tutorials"
image: "/img/blog/paracosm/dashboard-overview.png"
keywords: "AI civilization simulation, build AI simulation, multi-agent simulation framework, HEXACO personality AI, Mars colony simulation, AI agent swarm simulation, TypeScript AI agent framework, emergent tool forging, paracosm, agentos, personality-driven AI agents, deterministic simulation engine"
---

## Two Leaders, One Colony, Divergent Civilizations

Start two Mars colonies with identical resources, identical colonists, and identical crises. Assign one commander who scores 0.97 on conscientiousness and 0.25 on openness. Assign another who scores 0.95 on openness and 0.35 on conscientiousness. Run six turns over 48 simulated years.

By the final turn, one colony has 30% higher population. The other has 40% more infrastructure modules. Same starting conditions, same deterministic seed, same crisis sequence. The difference is personality.

This is [Paracosm](https://paracosm.agentos.sh), an AI agent swarm simulation engine built on [AgentOS](https://agentos.sh). You define any scenario as JSON, assign [HEXACO personality profiles](https://hexaco.org/) to AI commanders, and watch their decisions compound into measurably different outcomes.

## Install

```bash
npm install paracosm
```

Paracosm ships as an npm package with a TypeScript API, a CLI, and a browser-based dashboard. The engine, compiler, and two built-in scenarios (Mars Genesis, Lunar Outpost) are all included.

## Define Your World

A scenario is a JSON file that describes the simulation domain. Here is a submarine habitat:

```json
{
  "id": "submarine-habitat",
  "labels": {
    "name": "Deep Ocean Habitat",
    "populationNoun": "crew",
    "settlementNoun": "habitat",
    "currency": "credits",
    "timeUnitNoun": "year",
    "timeUnitNounPlural": "years"
  },
  "setup": {
    "defaultTurns": 8,
    "defaultPopulation": 50,
    "defaultStartTime": 2040,
    "defaultSeed": 42
  },
  "departments": [
    {
      "id": "life-support",
      "label": "Life Support",
      "role": "Chief Life Support Officer",
      "instructions": "Analyze O2 levels, CO2 scrubbing capacity, water recycling."
    },
    {
      "id": "engineering",
      "label": "Engineering",
      "role": "Chief Engineer",
      "instructions": "Analyze hull integrity, pressure systems, power generation."
    }
  ],
  "metrics": [
    { "id": "population", "format": "number" },
    { "id": "morale", "format": "percent" }
  ]
}
```

The scenario defines departments (specialist AI agents that analyze each crisis), metrics (what gets tracked), labels (domain vocabulary), and setup defaults. The engine handles the rest: crisis generation, state transitions, tool forging, personality drift.

## Compile and Run

The compiler turns your JSON into a runnable scenario by generating TypeScript hooks via LLM calls. Compilation costs roughly $0.10 and is cached to disk after the first run.

```typescript
import { compileScenario } from 'paracosm/compiler';
import { runSimulation } from 'paracosm/runtime';

const scenario = await compileScenario(worldJson, {
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
});
```

Define leaders with HEXACO personality profiles and run:

```typescript
const leaders = [
  {
    name: 'Captain Reyes',
    archetype: 'The Pragmatist',
    unit: 'Station Alpha',
    hexaco: {
      openness: 0.4, conscientiousness: 0.9,
      extraversion: 0.3, agreeableness: 0.6,
      emotionality: 0.5, honestyHumility: 0.8,
    },
    instructions: 'You lead by protocol. Safety margins first.',
  },
  {
    name: 'Captain Okafor',
    archetype: 'The Innovator',
    unit: 'Station Beta',
    hexaco: {
      openness: 0.9, conscientiousness: 0.4,
      extraversion: 0.8, agreeableness: 0.5,
      emotionality: 0.3, honestyHumility: 0.6,
    },
    instructions: 'You lead by experimentation. Push boundaries.',
  },
];

// Every event carries a universal `e.data.summary` one-liner the
// runtime populates for you. Narrow via `e.type` if you want
// intellisense on per-event fields (title, choice, outcome, etc.).
const results = await Promise.all(
  leaders.map(leader =>
    runSimulation(leader, [], {
      scenario,
      maxTurns: 8,
      seed: 42,
      onEvent(e) { console.log(leader.name, e.type, e.data.summary); },
    })
  )
);

// Each result is a Zod-validated RunArtifact from `paracosm/schema`.
for (const r of results) {
  console.log(r.metadata.scenario.name, '->', r.fingerprint);
  console.log('  cost   $', r.cost?.totalUSD.toFixed(2), `(${r.cost?.llmCalls} LLM calls)`);
  console.log('  final   ', r.finalState?.metrics);
  console.log('  tools   ', r.forgedTools?.length ?? 0,
              'citations', r.citations?.length ?? 0);
  if (r.providerError) {
    console.error('  provider error:', r.providerError.kind, r.providerError.message);
  }
}
```

Each call to `runSimulation` takes one leader. Run one, two, or twenty. The dashboard runs two side-by-side for comparison, but the API has no limit.

## Case Study: Mars Genesis

Mars Genesis is the built-in scenario that ships with Paracosm. 100 colonists, 6 turns spanning 48 years, 5 departments (Medical, Engineering, Agriculture, Psychology, Governance), and two AI commanders with opposite personality profiles.

### The Commanders

**Aria Chen, "The Visionary"** leads Ares Horizon. Her HEXACO profile: openness 0.95, conscientiousness 0.35, extraversion 0.85, emotionality 0.30. She favors bold expansion and calculated risks, prioritizing higher upside even when the odds are uncertain.

**Dietrich Voss, "The Engineer"** leads Meridian Base. His profile: openness 0.25, conscientiousness 0.97, extraversion 0.30, emotionality 0.70. He demands data before decisions, favors lower risk, and runs everything through engineering discipline.

Both start with the same deterministic seed (950), the same 100 colonists, and the same resource allocation. The crisis sequence is generated by an AI Event Director that reads colony state and produces contextually appropriate challenges.

### What Happens

The HEXACO personality model (Ashton & Lee, 2007) provides six orthogonal trait dimensions that predict behavioral tendencies across cultures. In Paracosm, these traits directly influence how the commander agent processes department reports and selects crisis responses.

**Turn 1:** Both colonies face their first crisis. Chen's high openness leads her to authorize an experimental infrastructure approach. Voss's high conscientiousness leads him to follow established protocol. The colonies diverge from the first decision.

**Turns 2-4:** The compounding begins. Chen's Engineering department forges a custom radiation shielding calculator (a tool written at runtime by the AI, executed in a sandboxed V8 isolate, and verified by an LLM-as-judge before activation). Voss's departments stick to standard analysis. Chen takes bigger swings; some fail. Voss accumulates steady gains.

**Turns 5-6:** By the final turns, the divergence is measurable across every metric. Population, morale, food reserves, power generation, infrastructure modules, science output. Two civilizations grew from identical seeds because of personality.

### Tool Forging in Action

One of the distinguishing features of Paracosm is that department agents forge computational tools at runtime. When the Agriculture department needs to calculate soil toxicity thresholds for Martian regolith, it writes JavaScript code, tests it against expected outputs, and submits it for LLM-as-judge review. If the judge approves (checking safety, correctness, determinism, and schema compliance), the tool is registered and available for future turns.

This is powered by AgentOS's [Emergent Capability Engine](https://docs.agentos.sh/docs/features/emergent-capabilities). Every forged tool is sandboxed with hard memory (128 MB) and timeout (10 second) limits. Blocked APIs include `eval`, `require`, `process`, and filesystem writes. The tool starts at session scope and can be promoted to agent scope after 5+ successful uses with >0.8 confidence.

## How It Works Under the Hood

Paracosm's architecture separates three concerns:

```
Engine (the npm package)
  core/         deterministic kernel (RNG, state, progression)
  compiler/     JSON -> ScenarioPackage (LLM-generated hooks)
  mars/         Mars Genesis scenario
  lunar/        Lunar Outpost scenario

Runtime (orchestration, not exported)
  orchestrator  turn pipeline: director -> kernel -> departments -> commander
  director      emergent crisis generation from simulation state
  departments   parallel department analysis agents

CLI (server + dashboard, not exported)
  serve.ts      HTTP + SSE server
  dashboard/    React/Vite live visualization
```

**The kernel** handles state, time, randomness, and invariants. It is deterministic: given the same seed and the same decisions, the simulation produces identical numerical outcomes.

**The scenario** handles domain knowledge: crisis categories, department instructions, progression hooks, and research citations. The compiler generates these from your JSON definition.

**The orchestrator** connects them. Each turn follows a pipeline: the AI Event Director generates a crisis from the current state, the kernel updates metrics, department agents analyze the crisis in parallel, the commander reads their analysis and decides, and the kernel applies bounded numerical effects.

Paracosm uses [AgentOS](https://agentos.sh) for all agent orchestration:

| AgentOS API | Used For |
|------------|----------|
| `agent()` | Commander, department, and Event Director agents |
| `generateText()` | LLM calls for crisis generation and tool evaluation |
| `EmergentCapabilityEngine` | Runtime tool forging in sandboxed V8 |
| `EmergentJudge` | LLM-as-judge safety review of forged tools |

## Build Your Own Scenario

Three steps:

**1. Write the JSON.** Define departments, metrics, labels, and setup defaults. Use the submarine habitat example above or the Mars Genesis scenario as a template.

**2. Compile.**

```bash
npm run compile -- scenarios/my-world.json \
  --seed-url https://example.com/relevant-report \
  --no-web-search
```

The compiler accepts `--seed-text` and `--seed-url` for domain-specific context, and `--no-web-search` to skip web research during compilation. Compiled scenarios are cached to disk.

**3. Run.** Either programmatically via the `runSimulation()` API, or through the dashboard:

```bash
npm run dashboard
# Opens http://localhost:3456
```

The dashboard includes a scenario editor where you can write, import, compile, and run custom worlds from the browser.

## Try It

- **Live demo:** [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) -- run Mars Genesis in your browser
- **npm:** [npmjs.com/package/paracosm](https://www.npmjs.com/package/paracosm)
- **GitHub:** [github.com/framersai/paracosm](https://github.com/framersai/paracosm)
- **AgentOS:** [agentos.sh](https://agentos.sh) -- the runtime that powers it
- **API docs:** [paracosm.agentos.sh/docs](https://paracosm.agentos.sh/docs)
- **Discord:** [wilds.ai/discord](https://wilds.ai/discord)

---

**References:**

- Ashton, M. C., & Lee, K. (2007). Empirical, theoretical, and practical advantages of the HEXACO model of personality structure. *Personality and Social Psychology Review*, 11(2), 150-166. [hexaco.org](https://hexaco.org/)
- Park, J. S., et al. (2024). Project Sid: Many-agent simulations toward AI civilization. *arXiv:2411.00114*. [arxiv.org](https://arxiv.org/abs/2411.00114)
- Gao, C., et al. (2023). S3: Social-network simulation system with large language model-empowered agents. *arXiv:2307.14984*.
