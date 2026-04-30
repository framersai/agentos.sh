---
title: "Mars Genesis vs MiroFish: Two Approaches to Multi-Agent Simulation"
date: "2026-04-13"
excerpt: "Technical comparison of AgentOS Mars Genesis and MiroFish, two open-source multi-agent simulation frameworks. MiroFish builds parallel digital worlds from real-world seed data. Mars Genesis runs deterministic Mars colonies with personality-driven leaders forging tools at runtime."
author: "AgentOS Team"
category: "Engineering"
audience: "engineer"
image: "/img/blog/og/mars-genesis-vs-mirofish-multi-agent-simulation.png"
keywords: "multi-agent simulation framework, AI agent simulation comparison, AgentOS Mars Genesis, MiroFish prediction engine, emergent AI behavior, HEXACO personality model AI, runtime tool forging, LLM agent simulation, OASIS social simulation, generative agents Park, autonomous AI agents, TypeScript AI framework, Mars colony simulation"
---

> "Two roads diverged in a yellow wood, / And sorry I could not travel both / And be one traveler, long I stood."
>
> — Robert Frost, *The Road Not Taken*, 1916

The two systems compared in this post answer "what would happen if" with very different machinery. MiroFish answers it bottom-up: spawn 1,000–1,000,000 LLM agents on a social substrate seeded with a real-world document, watch the swarm behavior aggregate into a forecast. Mars Genesis answers it top-down: spawn ~100 colonists led by one HEXACO commander, run a deterministic kernel for six turns, swap the commander's personality, see what diverges. Both are legitimate. They serve different jobs. The honest comparison is per-axis (direction, scale, determinism, output shape) rather than per-headline.

Multi-agent simulation splits into two schools: predict the real world, or generate emergent worlds that never existed. [MiroFish](https://github.com/666ghj/MiroFish) (54k GitHub stars) builds parallel digital worlds from real-world seed data to forecast outcomes. [Mars Genesis](https://github.com/framersai/mars-genesis-simulation) (built with [AgentOS](https://github.com/framersai/agentos)) creates a deterministic Mars colony where two AI commanders with distinct personalities face emergent crises, forge computational tools at runtime, and produce measurably different civilizations from identical starting conditions.

Both descend from the [Generative Agents](https://arxiv.org/abs/2304.03442) lineage (Park et al., Stanford 2023), which established that LLM-driven simulacra produce believable human behavior at small scale. The split between MiroFish and Mars Genesis is what to do with that capability: predict reality, or generate divergent histories.

This post breaks down how each system works at the architecture level, where they diverge in design philosophy, and what builders can learn from both. For the long-form essay version of the Mars Genesis side of the comparison, see [Paracosm: Counterfactual World Simulation in 2026](https://agentos.sh/blog/paracosm-2026-overview).



![Mars Genesis simulation dashboard showing two AI commanders running side-by-side with emergent crises, department analysis, forged tools, colonist reactions, and divergence tracking](/img/blog/mars-genesis-simulation-dashboard.png)
*Mars Genesis dashboard: two AI commanders face different emergent crises. Left column (Visionary) chose a risky exterior repair during a dust storm. Right column (Engineer) landed conservatively at Arcadia Planitia. Department pills, forged tools, colonist voice reactions, and the divergence rail are visible.*

<video controls poster="/img/blog/paracosm/sim-poster.jpg" style="width:100%;border-radius:8px;margin:1rem 0;">
  <source src="/img/blog/paracosm/sim-real.mp4" type="video/mp4">
</video>
*Side-by-side Mars Genesis run: identical seed, identical scenario, two commanders with opposing HEXACO profiles. Divergence in tool inventory, mortality cause distribution, and infrastructure footprint emerges by turn three.*

---

## The core question each system answers

**MiroFish asks:** "Given this real-world information, what happens next?"

You upload a news article, policy draft, or financial signal. MiroFish extracts entities and relationships into a knowledge graph ([Zep Cloud](https://www.getzep.com/) GraphRAG), generates agent profiles with personalities and backstories, then runs a social media simulation on Twitter and Reddit replicas powered by [OASIS](https://github.com/camel-ai/oasis). Thousands of agents post, reply, like, and argue. A ReportAgent with retrieval tools synthesizes the results into a prediction report.

**Mars Genesis asks:** "How does leadership personality shape civilization?"

You configure two commanders with [HEXACO personality profiles](https://hexaco.org/hexaco-online) (six-factor model from [Lee & Ashton's research](https://hexaco.org/hexaco-inventory)). Both start with the same 100 colonists, same resources, same deterministic seed. An AI Crisis Director generates unique crises per timeline based on colony state. Department agents analyze each crisis, forge computational tools (radiation dose calculators, food security models), and the commander decides. The deterministic kernel applies bounded numerical effects. Five turns later, the two colonies have diverged in population, morale, infrastructure, and political structure.

The difference is not cosmetic. It reflects an architectural split in how each system handles truth, agency, and emergence.

## Architecture: who owns truth?

### MiroFish: the graph owns truth

MiroFish's architecture has five stages:

1. **Graph Building.** Seed text is chunked and fed to [Zep Cloud](https://www.getzep.com/) to build a knowledge graph. Entities (people, organizations, events) and their relationships become the simulation's ground truth.

2. **Environment Setup.** An `OasisProfileGenerator` converts graph entities into agent profiles with personality (MBTI-based), demographics, social metrics (karma, followers), and behavioral instructions. Each agent gets a `persona` field: a paragraph-length character description generated by an LLM from the entity's graph context.

3. **Simulation.** OASIS runs parallel Twitter and Reddit simulations. Agents take actions each round: create posts, like, reply, retweet, follow. Activity levels vary by simulated time of day (the codebase includes a `CHINA_TIMEZONE_CONFIG` with hourly activity multipliers). A `SimulationIPCClient` uses file-system IPC (commands written to disk, polled by the simulation process) to coordinate between the Flask backend and the OASIS subprocess.

4. **Report Generation.** A `ReportAgent` using ReACT-style reasoning ([Yao et al., 2022](https://arxiv.org/abs/2210.03629)) queries the post-simulation graph with three retrieval tools: `InsightForge` (deep multi-query retrieval), `PanoramaSearch` (breadth search including expired content), and `QuickSearch`. It generates a structured prediction report.

5. **Deep Interaction.** Users can chat with any agent in the simulated world or interrogate the ReportAgent.

The knowledge graph is the single source of truth. Agents' actions update the graph. The simulation runner reads from it. Reports query it.

### Mars Genesis: the kernel owns truth

Mars Genesis has a different separation:

```
Director crisis → Department analyses → Commander choice
  → Typed policy effect → Kernel progression → Outcome
    → Personality drift → Colonist reactions → Next turn
```

**The deterministic kernel** (no LLM calls) owns canonical state: population, births, deaths, aging, bone density loss, radiation accumulation, resource production, career progression. All driven by seeded RNG ([Mulberry32](https://en.wikipedia.org/wiki/Multiply-with-carry_pseudorandom_number_generator)). Same seed always produces the same colonist roster and the same downstream event stream.

**AI agents** own interpretation: the Crisis Director generates crises from colony state, department agents analyze them and forge tools, the commander decides strategy. Their decisions feed into the kernel as bounded numerical effects (morale shifts, power changes, food reserve adjustments). The kernel applies these deterministically.

**The LLM-as-judge** reviews forged tool code for safety, correctness, determinism, and bounded execution. It does not determine simulation outcomes.

The principle: **the host runtime owns truth, the agents own interpretation.** This matches the CoALA framework's distinction between the agent's decision module and the environment's state-keeping module ([Sumers et al., 2023, arXiv:2309.02427](https://arxiv.org/abs/2309.02427)).

## Agent architecture: personality at scale

### MiroFish: MBTI + social-graph personas

MiroFish agents get their personality from two sources:

1. **Entity extraction.** Zep's knowledge graph identifies entities from the seed text. Each entity becomes a potential agent.

2. **LLM-generated personas.** The `OasisProfileGenerator` calls an LLM to generate a detailed character description from the entity's graph context. The persona includes MBTI type, age, gender, profession, interested topics, and a narrative backstory.

```python
@dataclass
class OasisAgentProfile:
    user_id: int
    user_name: str
    name: str
    bio: str
    persona: str       # LLM-generated character description
    age: Optional[int]
    gender: Optional[str]
    mbti: Optional[str]
    country: Optional[str]
    profession: Optional[str]
    interested_topics: List[str]
```

Agent behavior emerges from the persona prompt combined with OASIS's social media action space (post, reply, like, retweet, follow). Personality does not evolve over time: an agent's MBTI and persona remain fixed throughout the simulation.

### Mars Genesis: HEXACO + drift forces

Mars Genesis uses the [HEXACO model](https://hexaco.org/hexaco-online) from psychology research (six continuous traits 0-1, not categorical types):

- **Openness.** Creativity, willingness to experiment.
- **Conscientiousness.** Discipline, thoroughness.
- **Extraversion.** Sociability, assertiveness.
- **Agreeableness.** Cooperation, trust.
- **Emotionality.** Anxiety, empathy.
- **Honesty-Humility.** Sincerity, fairness.

Personality is not static. Three forces cause trait drift each turn:

1. **Leader pull (0.02/turn).** Promoted colonists' traits converge toward their commander's profile. Grounded in [leader-follower alignment research](https://www.tandfonline.com/doi/full/10.1080/1359432X.2023.2250085) (Van Iddekinge 2023).

2. **Role pull (0.01/turn).** Department roles activate specific traits. Engineering activates conscientiousness. Psychology activates agreeableness and emotionality. Based on [trait activation theory](https://doi.org/10.1037/0021-9010.88.3.500) (Tett & Burnett 2003).

3. **Outcome pull (event-driven).** Successful risks boost openness. Failed risks boost conscientiousness. Consistent with the [social investment principle](https://pmc.ncbi.nlm.nih.gov/articles/PMC3398702/) (Roberts 2005).

After each turn, all ~100 alive colonists generate individual reactions via lightweight LLM calls. Each colonist's HEXACO profile, health stats, social ties, and the crisis context shape their 1-2 sentence reaction. A high-openness Mars-born teenager reacts differently to a governance crisis than a high-conscientiousness Earth-born engineer.

![Mars Genesis colonist reactions panel showing individual quotes from 100+ colonists with mood distribution bar, personality details on hover](/img/blog/mars-genesis-colonist-reactions.png)
*Colonist reactions after a crisis outcome. Each of 100+ colonists generates an individual reaction shaped by their HEXACO personality, health, and social context. Mood distribution shows 63% negative, 38% anxious. Hovering any colonist reveals their full profile.*

## Emergent capabilities: prediction vs tool forging

### MiroFish: emergent social dynamics

MiroFish's emergence happens through agent interactions on simulated social platforms. Thousands of agents posting, replying, and influencing each other produce:

- **Information cascading.** How news spreads through a social network.
- **Opinion polarization.** Echo chambers forming around contentious topics.
- **Herd behavior.** Agents following trending content.
- **Sentiment shifts.** Collective mood changes over simulation rounds.

The emergence is **social**: individual agents acting on their personas and the content they see produce macro-level patterns that no single agent intended. OASIS supports simulations of up to [one million agents](https://github.com/camel-ai/oasis), enabling studies at real-world platform scale. The pattern descends from [Park et al.'s Smallville generative agents](https://arxiv.org/abs/2304.03442) (Stanford, 2023) but at orders-of-magnitude larger population.

### Mars Genesis: emergent tool forging

Mars Genesis's emergence happens through runtime capability creation. Department agents can invent new computational tools that never existed before:

1. **Agent identifies need.** The Medical agent facing a radiation crisis decides it needs a "cumulative dose risk calculator."
2. **Agent writes code.** Specifies tool name, description, input/output schemas, sandboxed JavaScript implementation, and test cases.
3. **Judge reviews.** An LLM-as-judge scores safety, correctness, determinism, bounded execution, and input validation.
4. **Tool executes.** Approved tools run in an isolated V8 sandbox with colony data as input, producing numerical results.
5. **Output informs decisions.** The tool's computed output (risk scores, projections) appears in the department report to the commander.

This uses AgentOS's [`EmergentCapabilityEngine`](https://docs.agentos.sh/api/classes/EmergentCapabilityEngine), [`EmergentJudge`](https://docs.agentos.sh/api/classes/EmergentJudge), and [`SandboxedToolForge`](https://docs.agentos.sh/api/classes/SandboxedToolForge). Tools do not directly change colony state. They produce analysis that informs decisions. The commander's selected policy effects change state through the kernel.

Tools forged in one turn persist and can be reused. Over a 12-turn simulation, department agents accumulate a growing toolkit of specialized analytical instruments, each reviewed by the judge and sandboxed for safe execution.

## Determinism: reproducibility vs exploration

### MiroFish: stochastic exploration

MiroFish simulations are inherently non-deterministic. Each run produces different agent interactions, different post timings, different content cascades. This is by design: the value is in running many simulations and aggregating patterns. The `SimulationConfigGenerator` uses LLM calls to auto-generate simulation parameters (time schedule, event injection, agent activity levels), which introduces additional variance.

### Mars Genesis: deterministic kernel + stochastic agents

Mars Genesis separates determinism from agency:

- **Deterministic.** Colonist roster generation, births, deaths, aging, bone density, radiation, career progression, outcome classification (all seeded RNG).
- **Non-deterministic.** Crisis generation, department analysis, tool forging, commander decisions, colonist reactions (all LLM-driven).

Same seed guarantees the same starting conditions and the same mechanical outcomes for identical decisions. The divergence between two timelines is entirely attributable to different leadership personalities making different choices. The simulation's central claim ("different personalities create different civilizations") is empirically testable.

## Technology stack comparison

| Dimension | MiroFish | Mars Genesis |
|-----------|----------|-------------|
| **Language** | Python backend + Vue.js frontend | TypeScript (full stack) |
| **Agent runtime** | [OASIS](https://github.com/camel-ai/oasis) (CAMEL-AI) | [AgentOS](https://github.com/framersai/agentos) |
| **Knowledge store** | [Zep Cloud](https://www.getzep.com/) GraphRAG | DOI-linked knowledge base + live web search |
| **Personality model** | MBTI (categorical, static) | HEXACO (continuous, evolving) |
| **Agent scale** | Thousands to millions | ~107 per turn (1 commander + 5 dept heads + 1 director + ~100 colonists) |
| **Simulation type** | Social media platform replica | Colony management with crisis response |
| **Emergence mechanism** | Social dynamics (posts, likes, follows) | Tool forging + personality drift + crisis generation |
| **Determinism** | Non-deterministic | Seeded RNG kernel + non-deterministic agents |
| **Output** | Prediction reports | Side-by-side civilization comparison |
| **IPC** | File-system command/response | In-process SSE streaming |
| **Deployment** | Docker + Flask + Node.js | Single `npx tsx` process |

## What builders can take from each

**From MiroFish:**

- GraphRAG as simulation ground truth is powerful for prediction use cases. The Zep integration shows how entity extraction can bootstrap agent populations from unstructured text.
- Dual-platform simulation (Twitter + Reddit) captures different interaction modalities. Agents behave differently with character limits vs threaded discussions.
- ReACT-style report generation with retrieval tools produces richer analysis than simple summarization.

**From Mars Genesis:**

- Separating the deterministic kernel from AI interpretation makes claims testable. You can prove divergence came from decisions, not randomness.
- Runtime tool forging gives agents genuine problem-solving capability beyond their initial training. The judge pipeline (build, test, review, sandbox) makes it safe.
- Continuous personality evolution produces more nuanced behavioral change than static personality types. HEXACO drift grounded in psychology research adds scientific credibility.
- Typed policy effects with bounded numerical ranges prevent LLM hallucination from corrupting simulation state.

## Running Mars Genesis

Mars Genesis runs as a single process with a live dashboard:

```bash
npm install
cp .env.example .env
# Add your OPENAI_API_KEY or ANTHROPIC_API_KEY

# Launch with dashboard
npm run dashboard

# Or quick 3-turn smoke test
npm run dashboard:smoke
```

![Mars Genesis settings panel with HEXACO personality sliders, leader configuration, starting resources, department toggles, API keys, and model selection](/img/blog/mars-genesis-settings.png)
*Settings panel: configure two leaders with HEXACO sliders, starting resources, key personnel, custom event injection, API keys, LLM model selection, and sandbox execution parameters.*

The Settings tab lets you configure leaders, HEXACO personality sliders, custom events, starting resources, API keys, model selection, and department activation. Presets include "Balanced Founders," "High Risk vs Ultra Cautious," and custom configurations shareable via URL.

![Mars Genesis game report showing side-by-side turn comparison with crisis titles, decisions, outcomes, department stats, and colonist quotes](/img/blog/mars-genesis-reports.png)
*Reports panel: side-by-side turn-by-turn comparison with crisis titles, commander decisions, outcome badges, department citation and tool counts, colonist quotes, and a replay scrubber.*

The simulation streams events via SSE to the browser. Both timelines run in parallel. Department cards show citations, forged tools, and risk assessments. Decision cards expand to show full commander reasoning and selected policies. Colonist quotes show individual reactions with personality-driven mood analysis.

## Try both

- **Mars Genesis**: [github.com/framersai/mars-genesis-simulation](https://github.com/framersai/mars-genesis-simulation)
- **AgentOS**: [github.com/framersai/agentos](https://github.com/framersai/agentos) | [docs.agentos.sh](https://docs.agentos.sh) | [npm](https://www.npmjs.com/package/@framers/agentos)
- **MiroFish**: [github.com/666ghj/MiroFish](https://github.com/666ghj/MiroFish)
- **OASIS**: [github.com/camel-ai/oasis](https://github.com/camel-ai/oasis)

Both are open source. Both prove that multi-agent simulation has moved past chatbot demos into systems that generate genuine emergent behavior. The question is no longer whether AI agents can simulate complex social and organizational dynamics. It is which dynamics matter for your use case.

---

*Mars Genesis is built with [AgentOS](https://agentos.sh), an open-source TypeScript runtime for autonomous AI agents. Install: `npm i @framers/agentos`*

*Built by [Manic Agency](https://manic.agency) / [Frame.dev](https://frame.dev). Contact: [team@frame.dev](mailto:team@frame.dev)*
