---
title: "Paracosm: Counterfactual World Simulation in 2026"
date: "2026-04-26"
featured: true
excerpt: "An end-to-end essay about why we built Paracosm, what it actually does, and what surprised us in the process. Counterfactual world simulation is the second meaning of 'world model' in 2026, and it's the meaning that lets you ask what-if without lying about what you measured."
author: "AgentOS Team"
category: "Engineering"
audience: "evaluator"
image: "/img/blog/paracosm/dashboard-overview.png"
keywords: "paracosm world model, counterfactual world simulator, structured world model AI, prompt to simulation, multi-agent simulation typescript, hexaco simulation, deterministic kernel V8 sandbox, agentos paracosm, Mars Genesis simulation, civilization simulation AI"
---

> "It's a poor sort of memory that only works backwards."
>
> — *Alice in Wonderland*, the Queen, 1865

There is a particular discomfort in watching two LLMs that share the same prompt arrive at very different answers. The first time I saw it I had been awake for too long and was building Paracosm's turn loop in a coffee shop on Market Street; one commander was an "Engineer" archetype, the other a "Visionary," and I had carefully arranged for both runs to share an identical seed, identical scenario, identical agent roster, and identical starting resources. The kernel ran. The Engineer's colony bought a centrifuge on turn two. The Visionary forged a propaganda tool and convened a Founders' assembly. By turn six, the colonies looked like they were on different planets, even though the planet was technically Mars in both cases, and the planet was technically the same Mars.

That divergence is the entire point of the project: the same world, two leaders, two futures. It's also the part that's hardest to explain, because the language we use for "AI simulation" in 2026 is overloaded to a degree that even the people building these tools find difficult to navigate. Half the people you meet think a world model is something that produces video. The other half think it's something an agent uses to plan. Both groups are right. They're just not talking about the same thing.

This post is the ground-up tour. What Paracosm is, why it is shaped the way it is, what it does in five minutes, what it refuses to claim, and what's surprised us in the building. If you want only the live demo, the demo is at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) and the package is at [npmjs.com/package/paracosm](https://www.npmjs.com/package/paracosm). The rest of the post is for the people who want to know whether this thing is a toy or a tool. We think it's a tool. We will try to convince you, but we will also try to be honest about what it isn't.

## Part 1: Two world models

Type "world model" into any search engine in April 2026 and you get two answers, neither of them wrong, both of them unhelpful if your question was about the other one.

The first answer is generative and visual. [Sora](https://openai.com/sora), [Genie 3](https://deepmind.google/discover/blog/genie-3/), [World Labs Marble](https://www.worldlabs.ai/), text-to-video, text-to-3D-scene, text-to-environment. They are evaluated on visual fidelity and physical plausibility. Their customers are filmmakers, 3D artists, embodied-AI labs, and robotics teams. Yann LeCun's AMI Labs raised [$1.03B in March](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) to do something adjacent on sensor and video streams. The narrative oxygen is mostly here.

The second answer is academic and quieter. A world model, in the sense Eric Xing's [Critiques of World Models](https://arxiv.org/abs/2507.05169) paper rebuilds, is *an internal simulator that an agent uses to imagine future states before acting*. It does not generate pixels. Its job is to enumerate actionable possibilities so a decision can be made. The [ACM Computing Surveys 2025 piece](https://dl.acm.org/doi/full/10.1145/3746449), "Understanding World or Predicting Future?", formalizes the split: *understanding-world* models simulate counterfactuals for planning; *predicting-future* models generate perceptual continuations. They are different jobs. They have different customers. They are both legitimately called world models, which is part of why this is so hard to talk about.

Paracosm is the second thing.

There is a tradition behind the second meaning that pre-dates LLMs by several decades. Schmidhuber and Ha's [2018 paper](https://arxiv.org/abs/1803.10122) is the modern foundation, but you can trace the family tree back to classical reinforcement learning, to model-based control theory, and farther back than that to a Borges short story I keep returning to.

> "The Garden of Forking Paths is an enormous riddle, or parable, whose theme is time… He believed in an infinite series of times, in a growing, dizzying net of divergent, convergent and parallel times. This network of times which approached one another, forked, broke off, or were unaware of one another for centuries, embraces all possibilities of time."
>
> — Borges, *The Garden of Forking Paths*, 1941

That's it. That's the product, written by an Argentine librarian forty-three years before any of us were born. A counterfactual world simulator builds a network of times that fork at the points the user asks about and re-converge or diverge or break off depending on what was perturbed. Borges anticipated this in fiction. The math is more recent. The engineering (runnable, queryable, attributable) is from the last eighteen months of work on Paracosm.

## Part 2: What Paracosm is

A Paracosm run takes four inputs and produces one artifact:

```
prompt or brief or URL
                    ↓
              ScenarioPackage (Zod-validated JSON)
                    ↓
        + HEXACO leader profile
        + deterministic seed
        + agent roster (kernel-generated)
                    ↓
              Turn loop
              ├─ Mulberry32 PRNG drives state
              ├─ LLM generates events + specialist analyses
              ├─ Specialists may forge new TypeScript tools
              ├─ V8 isolate sandbox runs forged tools
              ├─ LLM judge approves forged tools before re-use
              └─ Kernel applies consequences; personalities drift
                    ↓
              RunArtifact (one schema, three modes)
```

The artifact is a Zod-validated JSON object. It records every decision the leader made, every specialist note that fed those decisions, every tool that got forged and approved or rejected, every metric that moved, every citation the LLM grounded against. It also records cost, every token, every reranker call, so you can compare runs by spend as honestly as you can by outcome. The artifact exports cleanly to JSON Schema and from there to Python types via `datamodel-codegen` for non-TypeScript consumers.

Three modes share the same artifact:

- **`turn-loop`** runs a multi-turn civilization simulation. Mars Genesis is the canonical example: thirty colonists, six turns, two opposing HEXACO leaders, identical seed, divergence emerges from personality and from the tools the specialists choose to forge.
- **`batch-trajectory`** treats the simulator as a digital twin and produces labeled timepoints across a horizon, useful when you have a real-world entity (a customer cohort, a product launch, a policy change) and you want to forecast its evolution under different counterfactual interventions.
- **`batch-point`** is a one-shot Monte-Carlo style sweep across N scenarios × M leaders for fast forecasting when you don't need the inner trajectory.

I built turn-loop first. The Mars Genesis case study is below in Part 4. The other two modes followed because users kept asking for them and because the artifact happened to be general enough to cover all three.

## Part 3: How a turn actually executes

The turn loop is the only piece of Paracosm that's interesting at the level of engineering rather than philosophy. The rest of the system is plumbing. Here's what a single turn does, in order, with the parts that surprised me marked:

1. **State snapshot.** The kernel reads the current `ScenarioPackage` state, five bags called `metrics`, `capacities`, `statuses`, `politics`, `environment`. State lives in JSON. There are no hidden fields. The shape *is* the API.
2. **Event generation.** An LLM is prompted with the snapshot and the leader's HEXACO profile and is asked to propose a small number of events that could plausibly occur this turn. Crucially, the LLM does not just imagine; it consults research via AgentOS's `WebSearchService` (Firecrawl + Tavily + Serper + Brave in parallel, Cohere `rerank-v3.5` neural reranking on top). DOI-linked citations propagate into the artifact. *(This was the second-largest accuracy lever in development. Without research grounding, events drift toward LLM cliché.)*
3. **Specialist analyses.** Each specialist agent, economist, scientist, security officer, etc., produces a short analysis given the events and the leader's profile. Specialists have personalities too; they will disagree.
4. **Tool forging.** A specialist may decide that the next decision needs a tool that doesn't exist yet. They write a TypeScript function, signed with a Zod-validated schema, and submit it. *This is the part that surprised me most.* The first time I saw a specialist forge a `compute_resource_allocation_under_drought_constraint(state) → priorityList` tool, I assumed it was hallucinated, that it would not run. It ran. It returned reasonable output. It was also, somewhat, hallucinated, because the function logic was the LLM's best guess at what the kernel had, but the LLM judge caught the cases where it was wrong, and the cases that survived the judge made the next decision noticeably tighter.
5. **Sandbox execution.** Approved tools run in a V8 isolate with a 128 MB heap and a 10-second wall clock. No filesystem access, no network access, no `eval`, no dynamic import. The sandbox is the boring part. The boring parts are where security lives.
6. **LLM judge.** A separate LLM call examines each forged tool's output against the specialist's stated intent. Mismatch rejects the tool. Match approves it for inclusion in the decision context AND adds it to a discoverable tool index for future turns. Reuse is via `call_forged_tool(name, args)`. *This is the largest lever on cost.* A forge costs full LLM tokens; a reuse costs tens of tokens. After turn three of a typical run, most decisions invoke at least one previously-forged tool, and total run cost flattens.
7. **Decision.** The leader, equipped with events, analyses, and forged tools, makes a turn decision. The decision is a structured object: an action category, a parameter set, a stated rationale, a confidence score.
8. **Kernel apply.** The kernel applies the decision's effects to state. Resources move. Statuses change. Agents may be promoted, demoted, lost.
9. **Personality drift.** This is HEXACO's contribution. Three drift forces apply: **leader-pull** (the leader's traits influence the agents who reported to them), **role-activation** (an agent's role nudges their traits, a security officer drifts toward Conscientiousness over time), **outcome-reinforcement** (success reinforces the traits that produced it). The commander drifts alongside the agents. By turn six, the Engineer commander is more risk-averse than they started; the Visionary commander has become more open-to-experience because their riskier bets occasionally paid off.
10. **Artifact append.** Everything from this turn is appended to the `RunArtifact`. The next turn begins.

That is the whole loop. The clever parts, research grounding, tool forging, personality drift, exist because we tried doing the simulation without them and the simulator told us boring stories.

<video controls poster="/img/blog/paracosm/branches-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/branches.mp4" type="video/mp4">
</video>

The video above is the dashboard's Branches view: every fork point in a multi-leader run, color-coded by leader, where the same scenario produced a different action. It's the closest thing to a Borgesian "garden of forking paths" you can ship in a TypeScript package.

## Part 4: Mars Genesis

The reference scenario for Paracosm is Mars Genesis. Thirty colonists, six turns, two leaders chosen to differ on a single HEXACO axis, identical seed. The leaders are an "Atlas" archetype, high Conscientiousness, low Openness, and a "Maria" archetype, high Openness, lower Conscientiousness. Atlas optimizes for survival; Maria optimizes for discovery. Both colonies face the same kernel-generated weather, the same opening resource pool, the same agent roster.

The first time we ran Mars Genesis end-to-end with real research grounding, the divergence on turn three was sharp enough to feel narratively coherent. Atlas had built a redundant water reclamation pipeline; Maria had funded an exobiology survey of a thermal anomaly her science specialist had argued for. By turn five Atlas had a deployable lifeboat protocol; Maria had four named lichen-analog species and a paper draft. Both colonies were alive at turn six. They had spent identical token counts. The artifact recorded the entire trajectory.

This was not the result of a fixed if-then ruleset. The kernel does not know the difference between Atlas and Maria. The LLM events are seeded but not predetermined. The divergence emerges because the leaders' HEXACO profiles bias which specialists they listen to, which forged tools their specialists propose, and which decisions they sign off on. Personality is a real variable. The kernel measures what diverges.

<video controls poster="/img/blog/paracosm/digital-twin-atlas-lab-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/digital-twin-atlas-lab.mp4" type="video/mp4">
</video>

The full Atlas lab walkthrough is the video above. The case-study post, [Inside Mars Genesis](/blog/inside-mars-genesis-ai-colony-simulation), has the per-turn breakdown if you want the long form.

## Part 5: HEXACO is the leverage

There are six factors in the HEXACO model: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness. The model was introduced by Lee and Ashton in their 2007 *Personality and Social Psychology Review* paper ([doi:10.1177/1088868306294907](https://doi.org/10.1177/1088868306294907)) as a six-factor extension of the Big Five, with Honesty-Humility split out as a separate axis because the data demanded it.

There is nothing magical about HEXACO. It is a measurement framework with extensive cross-cultural validation. We use it in Paracosm because, after trying the alternatives, it's the smallest set of dimensions that produces visibly distinct simulator behavior. The Big Five works almost as well; the Big Five plus an "honesty" axis works better; HEXACO is, in our hands, the sweet spot of expressive-without-being-overfit.

Two things to note. First, HEXACO use in Paracosm is *opt-in*. Many Paracosm scenarios, most of `batch-point` for example, never touch personality at all. You can simulate a financial market without giving the market a Big Six profile. Second, when personality is on, it does not act through prompt injection alone. Agent personalities bias which specialists they consult, which decisions they accept, which tools they choose to forge. The drift mechanism (leader-pull, role-activation, outcome-reinforcement) is encoded in the kernel, not in a prompt. Prompt-only personality dissolves under pressure. Kernel-encoded personality survives.

The microbenchmark for this is in the agentos-bench package: [`HexacoEncodingBias`](https://github.com/framersai/agentos-bench/blob/master/src/micro/HexacoEncodingBias.ts). It asserts that each HEXACO trait modulates encoding in the direction the literature predicts. Pass criterion is published in the source.

## Part 6: Tool forging at runtime

This is the part that made me reconsider what "agent" actually means. A specialist agent in Paracosm is not just an LLM in a costume. It can write code at runtime that the kernel will then execute. The pipeline looks like:

```
Specialist proposes a tool
       ↓
   Zod-validated function signature (input, output)
       ↓
   TypeScript body authored by the LLM
       ↓
   V8 isolate sandbox: 128MB heap, 10s wall clock
       ↓
   LLM judge: does the output match the stated intent?
   ↓ approve            ↓ reject
   Tool added         Tool dropped
   to forge cache     from this turn
```

The economics are the surprise here. Forging is expensive, full LLM tokens for the proposal, the body, the test scaffolding, the judge. Reuse is nearly free, tens of tokens to dispatch via `call_forged_tool(name, args)`. After turn three of a typical run, most decisions invoke at least one previously-forged tool. Total run cost stops climbing linearly. The asymptote is set by the rate at which new situations arise that no previously-forged tool covers.

We did not design for this. We designed for forge-on-demand and assumed reuse would be a nice-to-have. Reuse turned out to be the largest cost lever in the entire system. That's the kind of thing you only discover by running the system.

<video controls poster="/img/blog/paracosm/digital-twin-maria-poster.jpg" style="width:100%;border-radius:8px;margin:1.5rem 0;">
  <source src="/img/blog/paracosm/digital-twin-maria.mp4" type="video/mp4">
</video>

The Maria scenario above shows specifically the discovery-bias path: she forges more tools because she takes more risks, but she also discovers more reusable patterns, so her per-turn cost falls faster than Atlas's after turn four. The artifact records this. The dashboard renders it. The economics are visible to the user, not hidden in a metering API.

## Part 7: Run your first simulation in five minutes

```bash
npm install paracosm
```

```ts
import { Paracosm } from 'paracosm';

const sim = new Paracosm();
const scenario = await sim.compileScenario({
  prompt: 'A coastal fishing town facing a regulatory shock that bans certain net types.',
});

const atlas = await sim.runTurnLoop({
  scenario,
  leader: { archetype: 'engineer' },
  seed: 'coast-2026-04-29',
  turns: 6,
});

const maria = await sim.runTurnLoop({
  scenario,
  leader: { archetype: 'visionary' },
  seed: 'coast-2026-04-29', // same seed, different leader
  turns: 6,
});

console.log(sim.diff(atlas, maria));
```

This runs locally. The cost of a six-turn run with default specialists, default reranker, and default reader on a small scenario is in the low tens of cents. The dashboard at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim) lets you do all of this without writing code.

## Part 8: What we don't claim

I have spent more time editing this section than any other section of this post. It matters more.

**We do not generate pixels.** Sora, Genie 3, World Labs Marble do that. Their output is visual. Paracosm's output is a structured `RunArtifact`. There are no images in the artifact. There are diagrams in the dashboard, but the diagrams are renderings of the artifact, not the artifact.

**We do not train a model.** AMI Labs, V-JEPA, I-JEPA do that. We use existing frontier LLMs (configurable per run) and existing embeddings and rerankers. We do not produce model weights.

**We are not a substitute for real-world data.** A counterfactual world simulator is a tool for thinking, not for forecasting in the strong sense. We are honest about this in the artifact: every decision has a `confidence` score, every metric has a `derivedFrom` trace, every citation has a DOI when one exists. If you treat a Paracosm run as ground truth, you have misunderstood what we built. We try very hard not to let users misunderstand.

**We do not run as many agents as OASIS or MiroFish.** [OASIS](https://openreview.net/forum?id=JBzTculaVV) and [MiroFish](https://github.com/666ghj/MiroFish) operate at 1,000 to 1,000,000 agents and do bottom-up emergent prediction. Paracosm operates at ~100 agents plus 5 specialists plus 1 commander and does top-down leader-driven counterfactuals. The two products do not compete on scale. We have a [comparison post on docs.agentos.sh](https://docs.agentos.sh/blog/2026/04/13/mars-genesis-vs-mirofish-multi-agent-simulation) if you want the engineering breakdown.

**We are not a multi-agent task orchestration framework.** LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Mastra: those frameworks execute real tasks against real APIs. Their output reaches the world. Paracosm's output stays inside the simulation. The frameworks listed and Paracosm overlap zero percent in user job-to-be-done.

**The forge is not magic.** Forged tools fail. The LLM judge rejects a meaningful fraction of proposals. The 128 MB / 10 s sandbox kills tools that try to do too much. The artifact records every forge attempt, including the failed ones. We think this transparency is more valuable than a higher reported success rate. We could prompt-engineer the success rate up; we are choosing not to.

## Part 9: What surprised us

I have built simulators before. I have never had a simulator surprise me the way Paracosm did the first time the Mars Genesis case study converged on a story-level coherent divergence without any of the divergence being prompted in. Every individual mechanism in Paracosm is unsurprising, research grounding, sandboxed code execution, LLM judging, personality biasing, and they are each well-trodden in the literature. The combination, running on a deterministic kernel against a fixed seed, produced behavior I did not predict. The behavior was reasonable. The behavior was attributable to specific traits in specific specialists in specific turns. The behavior was reproducible: rerun the same inputs, get the same outputs.

That, more than any single technical claim, is the reason the project exists. A counterfactual world simulator should be something you can reason about. A reasoning tool should not surprise its operator with non-determinism. Paracosm's surprise is not noise; it's signal. The kernel is deterministic. The LLMs are seeded. The divergence is the personality.

## Part 10: Where to go next

- The live demo at [paracosm.agentos.sh/sim](https://paracosm.agentos.sh/sim).
- The npm package at [paracosm](https://www.npmjs.com/package/paracosm).
- The structured-world-model positioning post at [Paracosm is a Structured World Model](/blog/paracosm-2026-overview) for the taxonomy and lineage if you want the academic placement.
- The tutorial at [Build an AI Civilization Simulation in 5 Minutes](/blog/build-ai-civilization-simulation-paracosm) for the code walk.
- The Mars Genesis case study at [Inside Mars Genesis](/blog/inside-mars-genesis-ai-colony-simulation) for the narrative breakdown.
- The MiroFish comparison at [docs.agentos.sh](https://docs.agentos.sh/blog/2026/04/13/mars-genesis-vs-mirofish-multi-agent-simulation) for the head-to-head with the bottom-up swarm approach.
- The github repository at [framersai/paracosm](https://github.com/framersai/paracosm).
- The agentos-bench package at [framersai/agentos-bench](https://github.com/framersai/agentos-bench) for the underlying memory benchmark methodology.

## FAQ

**Is Paracosm a digital twin?** It can be used as one. The `batch-trajectory` mode is specifically the digital-twin shape: real-world entity, labeled timepoints over a horizon, counterfactual interventions. But Paracosm is broader than digital twins. It also covers civilization simulations and one-shot forecasts.

**How does Paracosm relate to agent-based modeling?** Classical ABM tooling (Mesa, NetLogo, MASON, AnyLogic, ABIDES) is rule-based or statistical, generally non-LLM. Paracosm uses LLMs for event generation and specialist reasoning while keeping a deterministic kernel for state transitions. The bridge literature is the [Nature HSSC 2024 survey on LLM-empowered ABM](https://www.nature.com/articles/s41599-024-03611-3) and MIT Media Lab's [On the limits of agency in agent-based models](https://arxiv.org/abs/2409.10568).

**Can Paracosm replace Sora-style world models?** No. They do different things. Sora-class models generate perceptual continuations; Paracosm enumerates actionable possibilities. You can use them together, Sora-style to render the look of a Paracosm run, but they are not substitutes.

**Is Paracosm a physics simulator?** No. The kernel applies symbolic state transitions. There is no fluid dynamics, no rigid-body mechanics, no chemistry engine. If you need physics, use a physics simulator and feed Paracosm the resulting state changes through `ScenarioPackage` updates.

**What's different about Paracosm vs MiroFish or OASIS?** Direction (top-down vs bottom-up), scale (~100 vs 1k–1M agents), determinism (seeded vs emergent). They are useful for different jobs. The full table is in the [structured-world-model post](/blog/paracosm-2026-overview#what-paracosm-is-not).

**What's the cost of a typical run?** A six-turn `turn-loop` run on a small scenario with default settings runs in the low tens of cents. The artifact records every token spend; you can compare runs by cost as honestly as by outcome. Reuse of forged tools after turn three is the largest cost lever.

**Does Paracosm need an internet connection?** Yes, for research grounding (web search via Firecrawl/Tavily/Serper/Brave) and for the LLM calls. Offline mode falls back to LLM-only event generation without research citations; the artifact records this so you can audit which runs were grounded and which weren't.

**Is Paracosm open source?** Yes. Apache 2.0. Code at [github.com/framersai/paracosm](https://github.com/framersai/paracosm). Built on AgentOS ([github.com/framersai/agentos](https://github.com/framersai/agentos)), which is also Apache 2.0.

**Where do I start?** With the live demo. If you spend ten minutes there and the model in your head clicks, install the package and run your first turn loop. If it doesn't click, this isn't the tool for your job, and we'd rather you find that out fast than spend a week trying to make it work.

---

Counterfactual world simulation is not a product category that markets itself. It is the second meaning of "world model", the one Eric Xing's paper rebuilt in 2025, the one Borges anticipated in 1941, the one that lets you ask *what if* without lying about what you measured. We built Paracosm because we wanted that tool and didn't have it. If you want it too, we'd love to hear how you use it.
