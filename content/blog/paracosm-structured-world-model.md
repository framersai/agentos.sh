---
title: "Paracosm is a Structured World Model for AI Agents"
date: "2026-04-23"
excerpt: "In 2026, 'world model' has two distinct meanings. Sora, Genie 3, and World Labs Marble generate pixels and 3D scenes. Eric Xing's arXiv paper argues a world model's real job is simulating all actionable possibilities for decision-making, and the ACM CSUR 2025 survey separates the two branches formally. Paracosm is the second kind: a structured, reproducible, counterfactual world simulator for AI agents. This post places it on the 2026 world-model map and explains what that means for developers."
author: "AgentOS Team"
category: "Engineering"
image: "/img/blog/paracosm/dashboard-overview.png"
keywords: "structured world model, counterfactual world simulation model, CWSM, LLM based world model, paracosm positioning, world model taxonomy, Sora Genie alternative, symbolic world model, multi-agent simulation, HEXACO AI agents, digital twin LLM, reproducible simulation, deterministic seeded kernel, agent based modeling, OASIS MiroFish comparison"
---

## Two meanings of "world model" in 2026

Type "world model" into any search engine in April 2026 and you get two very different answers.

The first answer is generative and visual. [OpenAI's Sora](https://openai.com/sora), [DeepMind's Genie 3](https://deepmind.google/discover/blog/genie-3/), and [World Labs Marble](https://www.worldlabs.ai/) generate pixels or 3D scenes conditioned on text or on action streams. They're evaluated on visual and physical realism. Their customers are filmmakers, 3D artists, embodied-AI researchers, and robotics teams. [Not Boring's primer](https://www.notboring.co/p/world-models) is the best popular explainer for this branch.

The second answer is academic and older. A world model, in the sense that matters for decision-making, is an internal simulator that an agent uses to imagine future states before acting. That idea goes back to [Ha and Schmidhuber's 2018 paper](https://arxiv.org/abs/1803.10122) and further back into classical reinforcement learning; the recent [ACM Computing Surveys 2025 survey "Understanding World or Predicting Future?"](https://dl.acm.org/doi/full/10.1145/3746449) formally splits the field in two: *understanding-world* models (simulate actionable possibilities for planning and counterfactual reasoning) and *predicting-future* models (generate perceptual futures). Both are legitimate research agendas. Both are called world models. They're optimized for different things and serve different customers.

The pressure of the first meaning is enormous. Yann LeCun's [AMI Labs raised $1.03B on March 10](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) to train JEPA-style predictive representations on sensor and video streams. Fei-Fei Li's World Labs is building a spatial-intelligence world-model platform. Nvidia built its CES 2026 keynote around world models. The generative-visual branch soaks up the narrative oxygen.

The pressure of the second meaning is real but quieter. Eric Xing's [Critiques of World Models](https://arxiv.org/abs/2507.05169) paper, published mid-2025 and iterated since, is the reset-button paper for the academic branch:

> A world model is NOT about generating videos for viewing-pleasure, but IS about simulating all actionable possibilities of the world to serve as a sandbox for general-purpose reasoning via thought-experiments.

Paracosm is the second thing, built as an engineering product rather than a research prototype. This post explains what that means and names the adjacent categories so the placement is obvious.

## Five approaches, one slot

The [Themesis "Five Competing Approaches" overview](https://themesis.com/2026/01/07/world-models-five-competing-approaches/) is the cleanest current taxonomy. Paracosm maps into exactly one of those slots:

| Approach | What it is | Representatives | Paracosm? |
|---|---|---|---|
| Generative visual / spatial | Text-to-video, text-to-world-scene | Sora, Genie 3, Marble | No. No pixels. |
| JEPA / predictive representation | Self-supervised joint-embedding on video | AMI Labs, V-JEPA, I-JEPA | No. Paracosm does not train a model. |
| Object-centric / symbolic | Compositional object dynamics | AXIOM / Verses | Adjacent. Paracosm is symbolic in state but relies on LLM reasoning for dynamics. |
| **Structured / LLM-based / LLM-induced** | LLM as environment-dynamics simulator, augmented by deterministic modules, schemas, research grounding | **Paracosm** | **Yes.** |
| Hybrid / foundation | Neural plus simulator components in a generalist architecture | Xing's PAN | Forward-compatible target. Paracosm's universal artifact schema is a plausible contract layer. |

Within the structured / LLM-based branch, paracosm's specific research lineage is the **counterfactual world simulation model** (CWSM), introduced formally in [Kirfel et al, Stanford 2025 "When simulations get real: ethical implications of counterfactual world simulation models"](https://cicl.stanford.edu/papers/kirfel2025when.pdf). A CWSM replays an event with one variable changed and surfaces the divergence. That's paracosm's product in one sentence: same JSON, same kernel, same seed, swap the leader's HEXACO personality, measure what diverges.

Parallel academic traces of the same idea: [Integrating Counterfactual Simulations with Language Models (AXIS)](https://arxiv.org/html/2505.17801v1) uses LLMs to explore counterfactual worlds in autonomous-driving scenarios, and [Counterfactual Effect Decomposition in Multi-Agent Sequential Decision Making](https://icml.cc/virtual/2025/poster/44311) attributes effects to individual agents via Shapley decomposition in sepsis-management simulators. The research consensus is clear: LLM-driven counterfactual world simulation is a thing, and it works.

## What paracosm is not

Every one of these categories is legitimate. None of them describe paracosm. Naming them up front saves the first-time reader a misclassification cycle.

**Not a generative visual world model.** Sora, Genie 3, and Marble generate pixel-level or 3D-scene output. Paracosm's output is a structured `RunArtifact`: metrics, decisions, specialist notes, citations, forged tool summaries. The artifact is Zod-validated and exports cleanly as JSON Schema for non-TypeScript consumers. Nothing renders on a GPU.

**Not a JEPA predictive-representation model.** LeCun's AMI Labs trains neural representations on video and sensor streams. Paracosm's `compileScenario` uses an LLM to generate TypeScript hook functions, but that's code synthesis, not representation learning. Paracosm does not train a model.

**Not a multi-agent task orchestration framework.** LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Google ADK, and Mastra build agentic workflows that execute real tasks against real tools and real APIs. Their output reaches the real world. Paracosm is a simulation. Nothing ships outside the run. The frameworks listed above and paracosm overlap zero percent in what they do for users.

**Not a bottom-up swarm intelligence simulator.** Two projects worth naming specifically. [MiroFish](https://github.com/666ghj/MiroFish) is an open-source simulator that takes a seed document (news, policy, fiction) and spawns thousands of LLM-driven agents on a social substrate; output is an aggregate prediction report. It's built on [CAMEL-AI's OASIS](https://openreview.net/forum?id=JBzTculaVV), "Open Agent Social Interaction Simulations with One Million Agents." MiroFish got four-digit GitHub stars and a $4M lift fast; it's a real and useful tool. Its shape is not paracosm's.

| Axis | MiroFish / OASIS | Paracosm |
|---|---|---|
| Direction | Bottom-up, emergent | Top-down, leader-driven |
| Scale | 1,000s to 1,000,000 agents | ~100 agents + 5 specialists + 1 commander |
| Determinism | Emergent, non-deterministic | Seeded kernel; divergence purely from leader personality |
| Input | Seed document | JSON scenario + HEXACO leader |
| Output | Aggregate prediction report | Universal `RunArtifact` (trajectory, decisions, specialist notes, forged tools, citations, cost) |
| Primary use | Forecasting | Decision support, counterfactual analysis, digital twins |

**Not a generative-agents library.** [Stanford Generative Agents](https://arxiv.org/abs/2304.03442) (Park et al, 2023, the Smallville paper) populated a 25-character virtual town with LLM-driven characters that plan, reflect, and form relationships. [Google DeepMind Concordia](https://deepmind.google/research/publications/64717/) generalizes that pattern with a "Game Master" concept and actions grounded in physical, social, or digital space. Both are research libraries for studying emergent social behavior. Paracosm is a product: a deterministic turn loop, personality drift, runtime tool forging, and a universal result schema across three simulation modes.

**Not classical agent-based modeling.** Mesa, NetLogo, MASON, AnyLogic, ABIDES: longstanding ABM tooling, generally rule-based or statistical, generally non-LLM. The [Nature HSSC 2024 survey on LLM-empowered ABM](https://www.nature.com/articles/s41599-024-03611-3) and [MIT Media Lab's "On the limits of agency in agent-based models"](https://www.media.mit.edu/publications/on-the-limits-of-agency-in-agent-based-models/) are the bridge literature for hybrid approaches. Read them for the theoretical backdrop.

## What paracosm actually is

Seven claim pillars, each verifiable against the source code:

1. **Structured.** State is JSON-declared across five bags: `metrics`, `capacities`, `statuses`, `politics`, `environment`. No hidden fields. The shape is the API.
2. **Reproducible.** Kernel state transitions use a Mulberry32-seeded PRNG. Same seed produces identical agent rosters, lifecycle schedules, promotion sequences, and resource starting values. Fix the seed, vary the personality, measure the outcome.
3. **Counterfactual-first.** The product is two runs against the same seed with different leaders, and a surfaced divergence. `runBatch` scales this to N × M across multiple scenarios.
4. **Personality-grounded.** HEXACO-PI-R six-factor model (Ashton & Lee 2007, Personality and Social Psychology Review 11(2), [doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)). Drift under three forces: leader-pull, role-activation, outcome-reinforcement. The commander drifts alongside the agents they lead.
5. **Research-grounded.** Seed-ingestion pipeline via AgentOS `WebSearchService` (Firecrawl, Tavily, Serper, Brave in parallel) with Cohere `rerank-v3.5` neural reranking. DOI-linked citations propagate through every department report.
6. **Tool-forging capable.** Specialist agents write TypeScript tools at runtime; execution in a V8 isolate with a 128 MB / 10 s sandbox; an LLM judge approves before the tool enters the decision pipeline. Approved tools are reused on later turns via `call_forged_tool` at near-zero marginal cost. Reuse economics are the single largest lever on total run spend.
7. **Universal artifact.** One Zod-validated `RunArtifact` schema covers three simulation modes: `turn-loop` (civ sims), `batch-trajectory` (digital-twin labeled timepoints over a horizon), `batch-point` (one-shot forecasts). Non-TypeScript consumers generate equivalent types via JSON Schema and `datamodel-codegen` (Python) or any JSON-Schema code generator.

## The new API surface: `WorldModel`

The existing APIs (`compileScenario`, `runSimulation`, `runBatch`, `createParacosmClient`) are unchanged and first-class. The new `paracosm/world-model` subpath adds a thin façade that makes the code vocabulary match the docs:

```typescript
import { WorldModel } from 'paracosm/world-model';
import worldJson from './my-world.json' with { type: 'json' };

const wm = await WorldModel.fromJson(worldJson, { provider: 'anthropic' });

const [pragmatist, innovator] = await Promise.all([
  wm.simulate(pragmatistLeader, { maxTurns: 6, seed: 42 }),
  wm.simulate(innovatorLeader,  { maxTurns: 6, seed: 42 }),
]);

// Same JSON, same seed, same kernel. Two HEXACO profiles. Two worlds.
console.log(pragmatist.fingerprint, innovator.fingerprint);
```

For a pre-compiled built-in scenario:

```typescript
import { marsScenario } from 'paracosm/mars';
import { WorldModel } from 'paracosm/world-model';

const wm = WorldModel.fromScenario(marsScenario);
const artifact = await wm.simulate(leader, { maxTurns: 8, seed: 950 });
```

`wm.scenario` exposes the underlying `ScenarioPackage` as an escape hatch for callers who want direct access to `runSimulation` / `runBatch` with per-call options the façade does not surface. Nothing is hidden; the façade is sugar, not a wall.

## Evidence that it works across domains

The `corporate-quarterly` smoke script is the canonical non-Mars regression. It loads a corporate-strategy scenario (five departments, quarterly cadence over three years, two preset leaders), cache-busts the compile step, runs both leaders against the OpenAI `economy` preset, and asserts the resulting artifacts have populated timepoints, a valid time-unit schema, scenario-declared metrics, populated statuses and environment bags, and no legacy year-family keys. Wall-clock around 75 to 100 seconds per leader, spend around $0.17 to $0.25.

Four signals confirm the smoke is exercising real paracosm behavior and not a cached stub:

- Citations ≥ 4 per leader (seed-ingestion + recall fires).
- Tools ≥ 1 per leader (at least one forge approved).
- Cost ≥ $0.10 per leader (all nine stages ran).
- Divergent `fingerprint` across leaders (the counterfactual signature).

That's the CWSM loop: identical seed, identical world JSON, identical kernel, different leader personalities, measurable divergence.

## What to do next

If you landed here because you searched "world model" and expected Sora, the honest answer is: Sora is a generative visual world model, paracosm is a structured world model, both are legitimate, they solve different problems. Try paracosm if you want to simulate how different leaders, policies, or decision frameworks would play out against the same world, and you want that simulation to be reproducible and inspectable.

```bash
npm install paracosm
```

- [Positioning map](https://github.com/framersai/paracosm/blob/master/docs/positioning/world-model-mapping.md): full taxonomy with citations
- [Live demo](https://paracosm.agentos.sh/sim): Mars Genesis, two leaders, same seed
- [GitHub](https://github.com/framersai/paracosm): source, scenarios, specs
- [API reference](https://paracosm.agentos.sh/docs): complete TypeDoc surface
- [Case study: Inside Mars Genesis](https://agentos.sh/blog/inside-mars-genesis-ai-colony-simulation): a run, analyzed turn by turn

If you want to scope paracosm to a specific vertical (digital twins, policy simulation, game-world NPC civilization generation, defense wargaming, corporate strategy), email [team@frame.dev](mailto:team@frame.dev). The open-source engine is unlimited; the hosted tiers for distributed fleet orchestration and persistence are on the roadmap.
