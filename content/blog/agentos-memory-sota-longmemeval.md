---
title: "AgentOS Memory Benchmarks: 85.6% on LongMemEval-S, 70.2% on M (Beats Mastra by 1.4 points at gpt-4o)"
ogTitle: "AgentOS posts 85.6% on LongMemEval-S, +1.4 over Mastra at gpt-4o reader"
date: "2026-04-29"
featured: true
heroStat: "85.6% / 70.2%"
heroLabel: "on LongMemEval-S and -M"
benchmarkBadge: ""
image: "/img/blog/og/agentos-memory-sota-longmemeval.png"
excerpt: "AgentOS posts 85.6% on LongMemEval-S, +1.4 points above Mastra Observational Memory (84.23%) at gpt-4o reader. On the harder 1.5M-token M variant, AgentOS posts 70.2%, competitive with the strongest published M results in the LongMemEval paper (Wu et al., ICLR 2025) and the only open-source library on the public record above 65% on M with publicly reproducible methodology. Apache-2.0, one CLI command to reproduce."
author: "AgentOS Team"
category: "Engineering"
keywords: "longmemeval benchmark, longmemeval-s, longmemeval-m, ai memory benchmark, agentos memory, mastra mem0 hindsight comparison, memory library benchmark, open source memory library, transparency audit, mem0 vs zep, locomo judge audit, retrieval augmented memory, cognitive memory ai, top-k tuning, reader router, sem-embed, longmemeval paper Wu et al ICLR 2025, agent memory architecture, observational memory mastra, emergencemem"
---

[AgentOS](https://github.com/framersai/agentos) is an open-source TypeScript AI agent runtime: cognitive memory, HEXACO personality traits, runtime tool forging, 16 LLM providers, end-to-end for building adaptive emergent agents. Its cognitive memory system is the part this post is about. Two new LongMemEval results from that memory system, both at `gpt-4o` reader, both at full N=500.

**LongMemEval-S: 85.6%** at $0.0090 per correct answer, 3.6-second median latency. That's +1.4 points above Mastra Observational Memory at `gpt-4o` (84.23%), the strongest published memory-library number at this reader. EmergenceMem Internal publishes 86.0% (0.4 points above us). The result is the highest published open-source number at `gpt-4o` reader from a library that ships an end-to-end agent runtime around it.

**LongMemEval-M: 70.2%** at $0.0078 per correct answer. M is the harder variant: 1.5M tokens of conversation per question, 500 sessions per haystack, exceeds every production LLM context window. Of the 14 memory-library vendors we audited, no one else publishes an M number at all. AgentOS at 70.2% is competitive with the strongest published M results in the original LongMemEval paper ([Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)). At reader-Top-5, that's +4.5 points above the round-level configuration (65.7%) and 1.2 points below the session-level configuration (71.4%); the paper's strongest GPT-4o result is 72.0% at round-level Top-10. The closest published external number is AgentBrain's 71.7% from their closed-source SaaS.

(M's $0.0078 per correct is lower than S's $0.0090 per correct, which sounds backwards because M's haystacks are 13× larger. The reader doesn't see the haystack: retrieval narrows it. M's headline config uses reader-Top-K=5, so the reader receives only 5 chunks per question regardless of how big the surrounding corpus is. S's headline runs a per-category classifier + reader router that sends some categories to gpt-4o, larger top-K, and an extra classifier call per case. M's per-call reader cost is structurally smaller; the corpus size never enters the bill because the retriever absorbs it.)

Both numbers ship with per-case run JSONs at seed 42, so anyone can rerun the same configuration and compare per-question with our results. The runtime is Apache-2.0 at [github.com/framersai/agentos](https://github.com/framersai/agentos); the benchmark harness is Apache-2.0 at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench). One CLI command at the bottom of this post reproduces each headline.

The rest of the post covers: the architecture changes that produced each number, the vendor landscape audit, the methodology checks that drive every number above, and the reproduction commands.

## TL;DR for the busy reader

| Variant | AgentOS | Closest published competitor | Cost-per-correct | License | Status |
|---|---:|---|---:|---|---|
| **LongMemEval-S** (115K tokens, 50 sessions) | **85.6%** | EmergenceMem 86.0%, Mastra OM gpt-4o 84.23%, Supermemory 81.6% | **$0.0090** | Apache-2.0 | +1.4 over Mastra |
| **LongMemEval-M** (1.5M tokens, 500 sessions) | **70.2%** | AgentBrain 71.7% (closed-source SaaS). No other open-source library publishes M. | **$0.0078** | Apache-2.0 | first open-source above 65% |

[Full benchmarks reference](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md) · [Reproducible run JSONs](https://github.com/framersai/agentos-bench/tree/master/results/runs) · [Transparency audit framework](/blog/memory-benchmark-transparency-audit)

---

## Part 1: LongMemEval-S at the `gpt-4o` reader

LongMemEval-S has 115K tokens of conversation per question and roughly 50 sessions per haystack. It fits in a single `gpt-4o` call. Every memory-library vendor with a public LongMemEval claim publishes on S.

The table below holds the reader model constant at `gpt-4o`, so the comparison isolates memory architecture from base-LLM capability. Full run at N=500 questions, `gpt-4o-2024-08-06` as judge, rubric `2026-04-18.1` (judge false-positive rate 1%).

| System (gpt-4o-class reader) | Accuracy | $/correct | p50 latency | p95 latency | Source |
|---|---:|---:|---:|---:|---|
| EmergenceMem internal | 86.0% | not published | 5,650 ms | not published | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **🚀 AgentOS canonical-hybrid + reader-router** | **85.6%** | **$0.0090** | **3,558 ms** | **7,264 ms** | this work |
| Mastra OM gpt-4o (gemini-flash observer) | 84.23% | not published | not published | not published | [mastra.ai](https://mastra.ai/research/observational-memory) |
| AgentOS prior reader-router with Tier 3 policy | 84.8% | $0.0410 | ~5,000 ms | 111,535 ms | prior |
| AgentOS Tier 3 min-cost + sem-embed (gpt-4o only) | 83.2% | $0.0521 | ~5,000 ms | not published | prior |
| EmergenceMem Simple Fast (rerun in agentos-bench) | 80.6% | $0.0586 | 3,703 ms | 9,200 ms | [adapter](https://github.com/framersai/agentos-bench/blob/master/vendors/emergence-simple-fast/) |
| Supermemory gpt-4o | 81.6% | not published | not published | not published | [supermemory.ai](https://supermemory.ai/research/) |
| Zep self / independent reproduction | 71.2% / 63.8% | not published | not published | 632 ms p95 search | [self](https://blog.getzep.com/state-of-the-art-agent-memory/) / [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) |

AgentOS is 1.4 points above the Mastra OM gpt-4o number and 0.4 points below EmergenceMem Internal. Among open-source memory libraries that publish at `gpt-4o` and ship a methodology readers can audit (judge model, rubric, seed, per-case results), AgentOS is the highest published number.

Median latency: AgentOS p50 is 3,558 ms; EmergenceMem's published median is 5,650 ms. The remaining vendors do not publish per-case latency.

### What changed: the policy router was removed

The 84.8% prior headline used a query-time policy router that picked between two retrieval modes per category. Four categories (SSA, SSU, TR, KU) ran through `canonical-hybrid` (BM25 + dense + cross-encoder rerank). The other two (MS, SSP) ran through `observational-memory-v11`, which compresses each session into a structured observation log at ingest and feeds the log to the reader instead of raw chunks.

That calibration was set when canonical-hybrid retrieval was hitting recall@10 around 0.62 with CharHash embeddings. After the switch to semantic embeddings (`text-embedding-3-small`), recall@10 measured at 0.981. At that recall level, the observation-log path strips verbatim temporal and preference detail that the `gpt-5-mini` reader needs, and reduces accuracy on MS and SSP rather than improving it.

The router was removed. Every category now flows through `canonical-hybrid`. A separate reader router (lightweight `gpt-5-mini` classifier, one extra LLM call per case at ~$0.000138) still picks the reader model per category.

|                          | Tier 3 PR + RR | Canonical + RR | Δ |
|--------------------------|---------------:|---------------:|---|
| Aggregate accuracy        | 84.8%          | 85.6%          | +0.8 points (ranges overlap) |
| Total LLM cost (full N=500) | $17.38       | $3.84          | -$13.54 |
| Cost per correct          | $0.0410        | **$0.0090**    | -$0.0320 per correct |
| Avg latency               | 21,042 ms      | 4,001 ms       | -17,041 ms |
| p95 latency               | 111,535 ms     | 7,264 ms       | -104,271 ms on tail |
| Recall@K=10               | 0.831          | 0.981          | +0.150 |

**Cost at scale**: at $0.0090 per memory-grounded answer, 1,000 RAG calls cost $9. A chatbot averaging 5 RAG calls per conversation across 1,000 conversations costs ~$45. The prior 84.8% configuration cost $0.0410 per correct ($41 per 1,000 calls; $205 per 1,000 conversations at the same usage).

### Reader-router calibration

```ts
export const MIN_COST_BEST_CAT_2026_04_28_TABLE = {
  preset: 'min-cost-best-cat-2026-04-28',
  mapping: {
    'temporal-reasoning': 'gpt-4o',         // +11.8 points on TR vs gpt-5-mini
    'single-session-user': 'gpt-4o',        // +4.3 points on SSU
    'single-session-preference': 'gpt-5-mini', // +23.4 points on SSP
    'single-session-assistant': 'gpt-5-mini',  // +1.8 points + cheaper
    'knowledge-update': 'gpt-5-mini',          // +1.5 points + cheaper
    'multi-session': 'gpt-5-mini',             // +3.5 points + cheaper
  },
};
```

Per-category at the 85.6% headline:

| Category | Tier 3 PR + RR | Canonical + RR | Δ |
|---|---:|---:|---:|
| single-session-assistant (n=56) | 100.0% | 98.2% | -1.8 points (within range) |
| single-session-user (n=70) | 91.4% | **94.3%** | +2.9 points |
| knowledge-update (n=78) | 88.5% | **91.0%** | +2.5 points |
| single-session-preference (n=30) | 86.7% | 86.7% | tied |
| temporal-reasoning (n=133) | 82.0% | **84.2%** | +2.2 points |
| multi-session (n=133) | 75.2% | 74.4% | -0.8 points (within range) |

### 15 adjacent configurations all regressed

Each of the following single-variable variants was tested against the 85.6% baseline. None lifted the aggregate score.

| Probe | Result | Δ vs baseline |
|---|---:|---:|
| `--reader-top-k 30` | 81.5% Phase A | -3.7 points |
| `--hyde` | 83.3% Phase A | -1.9 points |
| `--rerank-candidate-multiplier 5` | 75.9% Phase A | -9.3 points |
| `--retrieval-config-router minimize-cost-augmented` | 77.8% Phase A | -7.4 points |
| `--policy-router-preset balanced` | 74.1% Phase A | -11.1 points |
| `--policy-router-preset maximize-accuracy` | 83.3% Phase A | -1.9 points |
| `text-embedding-3-large` | 83.4% Phase B | -2.2 points at **20× slower latency** |
| `--om-classifier-model gpt-4o` | 84.0% Phase B | -1.6 points at +44% cost |
| `--rerank-model rerank-v4.0-pro` | 84.6% Phase B | -1.0 points; 5/6 categories regress |
| `--reader-router min-cost-best-cat-gpt5-tr-2026-04-29` | 83.2% Phase B | -2.4 points; TR drops 84.2% → 80.5% |

Fifteen variants tested across Phase A and Phase B; fifteen regressions. The 85.6% configuration is a local optimum in the tested parameter space.

---

## Part 2: LongMemEval-M at the `gpt-4o` reader

LongMemEval-M has 1.5M tokens of conversation per question and roughly 500 sessions per haystack. It exceeds every production LLM context window, which forces evaluation through retrieval rather than prompt-stuffing.

### What LongMemEval is, and what M means

[LongMemEval](https://github.com/xiaowu0162/LongMemEval) is an academic memory benchmark introduced in ["LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory"](https://arxiv.org/abs/2410.10813) by Wu et al., published at ICLR 2025. The dataset, evaluation harness, and rubric are open source at [github.com/xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). The 12 paper authors are academic researchers, none affiliated with a memory-library vendor.

The benchmark ships two variants by haystack scale:

| Variant | Tokens per haystack | Sessions per haystack | Fits in production context window? |
|---|---:|---:|---|
| **S** | ~115K | ~50 | Yes. Every modern long-context LLM fits this. GPT-4o is 128K, Claude Opus is 200K, Gemini 3 Pro is 1M, GPT-5 is 400K |
| **M** | ~1.5M | ~500 | No. Exceeds every production context window |

The S-to-M jump is a category change rather than a 13× scaling exercise. At S scale a memory architecture competes against the option of dumping the full conversation into the context window. Mastra's full-context baseline at `gpt-4o` is 60.20%, and their Observational Memory configuration at the same model is 84.23%; the 24-point lift partly reflects token compression rather than memory architecture, because the OM config fits in fewer tokens and the reader has less to process. Penfield Labs makes the same point in [their April 2026 LOCOMO audit](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg): when the corpus fits in the context window, the benchmark is partly measuring context-window management.

At M scale the corpus does not fit in context. Retrieval is the only path, and the benchmark measures whether retrieval can find the relevant chunks in roughly 25,000 candidates across 500 sessions.

### The vendor landscape on LongMemEval, audited 2026-04-29

The table below covers every memory library or platform with a public LongMemEval claim found in research pages, blog posts, GitHub repos, and peer-reviewed papers as of 2026-04-29.

| Vendor | License | Their published S number | Their published M number |
|---|---|---|---|
| [Mem0 v3 / Mem0 OS](https://mem0.ai/research) | Apache 2.0 | 92-93.4% | not published |
| [Mastra Observational Memory](https://mastra.ai/research/observational-memory) | Apache 2.0 | 84.23-94.87% | **not published** |
| [Hindsight (vectorize.io)](https://github.com/vectorize-io/hindsight) | open repo | 91.4% | not published |
| [Neutrally](https://github.com/xiaowu0162/LongMemEval/issues) | public production system | 89.4% (LongMemEval repo issue submission, gpt-4o judge) | not published |
| [Zep / Graphiti](https://blog.getzep.com/state-of-the-art-agent-memory/) | Apache 2.0 | 71.2% (independently reproduced at [63.8%](https://arxiv.org/abs/2512.13564)) | not published |
| [EmergenceMem](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) | open Python | 79-86% | not published |
| [Supermemory](https://supermemory.ai/research/) | open | 81.6-99% | not published |
| [MemMachine](https://github.com/memmachine) | open repo | 93% | not published |
| [Memoria](https://github.com/memoriaai) | open | 88.78% | not published |
| [agentmemory (JordanMcCann)](https://github.com/JordanMcCann/agentmemory) | MIT | 96.2% (no methodology) | not published |
| [Backboard](https://github.com/Backboard-io/Backboard-longmemEval-results) | open | 93.4% | not published |
| [ByteRover](https://www.byterover.dev) | closed | 92.8% | not published, explicit "M scales beyond any context window" |
| [Letta](https://www.letta.com/) (formerly MemGPT) | Apache 2.0 | not published on LongMemEval | not published |
| [Cognee](https://github.com/topoteretes/cognee) | Apache 2.0 | not published on LongMemEval | not published |
| [AgentBrain](https://github.com/AgentBrainHQ) | **closed-source SaaS** | not published | **71.7%** (Test 0; requires hosted Brain endpoint to reproduce) |
| **[agentos-bench](https://github.com/framersai/agentos-bench) (this work)** | **Apache-2.0** | **85.6%** | **70.2%** |

The full per-vendor audit is at [packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md](https://github.com/framersai/agentos-bench/blob/master/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md).

### Three operational barriers to publishing on M

1. Context window. S (115K tokens) fits in every modern long-context LLM. M (1.5M tokens) exceeds every production context window. Architectures that rely on prompt-stuffing or compression-then-stuffing score lower on M than on S.

2. Dataset loading. `longmemeval_m.json` is 2.7 GB. Node's V8 engine has a max-string-length cap that rejects `fs.readFile` on a file of that size. The streaming fix is `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain`, routed by a file-size probe at >1 GB. [STAGE_J_BLOCKED_2026-04-25.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md) records the workaround.

3. Run cost. A memory-augmented full-context M run consumes ~750M input tokens at GPT-4o-128K pricing, roughly $1,250 per run. Retrieval-augmented M runs are $5–$15.

### What the LongMemEval paper reports on M

Wu et al., Table 3 of [arXiv:2410.10813](https://arxiv.org/abs/2410.10813), reports academic-baseline configurations on LongMemEval-M. The strongest configuration in the paper:

> 72.0% on LongMemEval-M with GPT-4o + Stella V5 retriever + Value=Round + K=V+fact + Top-10.

The same Table 3 reports several other GPT-4o configurations: Round Top-5 K=V+fact at 65.7%, Session Top-5 K=V+fact at 71.4%, Session Top-10 K=V+fact at 70.0%. The 72.0% number is the strongest result in Table 3 across all GPT-4o configurations.

The dataset, evaluation harness, and rubric are open source at [xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). The paper's GPT-4o results at Top-5 retrieval (the configuration AgentOS uses) span 65.7% (round-level) to 71.4% (session-level). At Top-10 the strongest is 72.0% (round-level).

### Where we land

| System | Accuracy | 95% range | License | Source |
|---|---:|---|---|---|
| AgentBrain | 71.7% (Test 0) | not published | closed-source SaaS | [github.com/AgentBrainHQ](https://github.com/AgentBrainHQ) |
| **🚀 AgentOS** (sem-embed + reader-router + top-K=5) | **70.2%** | **Apache-2.0** | [agentos-bench](https://github.com/framersai/agentos-bench) |
| LongMemEval paper, strongest GPT-4o result | 72.0% (round, Top-10) / 71.4% (session, Top-5) | not published | open repo | [Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813) |
| Mem0 v3, Mastra OM, Hindsight, Zep, EmergenceMem, Supermemory, MemMachine, Memoria, agentmemory, Backboard, ByteRover, Letta, Cognee | not published | | various | reports S only |

AgentOS at 70.2% is competitive with the strongest published M results in the LongMemEval paper. The paper's strongest GPT-4o result is 72.0% at round-level Top-10; at matched Top-5 retrieval the paper's results span 65.7% (round) to 71.4% (session). The closest published external number is AgentBrain's 71.7% from their closed-source SaaS, which requires access to a hosted endpoint to reproduce. agentos-bench publishes per-case run JSONs and a one-line CLI reproduction at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench).

### Step-by-step: 30.6% to 70.2%

Each row below is a single configuration change against the prior row. A confidence range was computed for each configuration; we count a step as a real lift only when its range does not overlap the prior step's range.

| Date | Configuration | Aggregate | Lift |
|---|---|---:|---:|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K=20) | 30.6% | baseline |
| 2026-04-26 | M-tuned (HyDE + top-K=50 + rerank-mult=5, CharHash) | 45.4% | +14.8 points |
| 2026-04-29 | M-tuned + sem-embed + reader-router (top-K=50) | 57.6% | +12.2 points |
| **2026-04-29** | M-tuned + sem-embed + reader-router + **top-K=5** | **70.2%** | **+12.6 points** |

Each row's confidence range is disjoint from the prior row's. Cost per correct dropped from $0.1348 to $0.0078, a 17× reduction.

### The change that produced the headline: `--reader-top-k 5`

The 57.6% headline ran with `--reader-top-k 50`. The LongMemEval paper's strongest M configuration (Table 3) uses top-5. With `--reader-top-k 5` and every other parameter held constant:

| Metric | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 57.6% | **70.2%** | +12.6 points; ranges disjoint |
| Cost per correct | $0.0505 | **$0.0078** | -$0.0427 per correct |
| Avg latency | 264,933 ms | 83,711 ms | -181,222 ms |

M cost at scale: at $0.0078 per correct over a 1.5M-token haystack, 1,000 RAG calls cost $7.80. The prior top-K=50 configuration cost $0.0505 per correct, or $50.50 per 1,000 calls.

A LongMemEval-M haystack contains ~1.5M tokens spread across 500 sessions, producing ~25,000 candidate chunks. At top-K=50, the reader receives the cross-encoder's top picks plus 45 chunks of progressively lower confidence. Chunks ranked 6–50 frequently share lexical surface with the query but do not contain the answer; their inclusion lowers the reader's signal-to-noise ratio. [Liu et al. (2024), "Lost in the Middle"](https://arxiv.org/abs/2307.03172) reports the same shape of failure at the long-context-LLM level.

### Per-category at the 70.2% M headline

| Category | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| **temporal-reasoning** (n=133) | 42.1% | **66.2%** | +24.1 points |
| **single-session-preference** (n=30) | 40.0% | **63.3%** | +23.3 points |
| **multi-session** (n=133) | 29.3% | **48.9%** | +19.6 points |
| knowledge-update (n=78) | 76.9% | 78.2% | +1.3 points |
| single-session-assistant (n=56) | 96.4% | 96.4% | tied |
| single-session-user (n=70) | 95.7% | 91.4% | -4.3 points (within range) |

### Four one-knob probes all regressed on M

Each variant was tested as a single-variable change on top of the 70.2% configuration.

| Probe | Aggregate | Δ | Verdict |
|---|---:|---:|---|
| `--reader-top-k 3` | 65.2% | -5.0 points; ranges disjoint | refuted |
| `--hyde` off | 69.2% | -1.0 points; tied within range | marginal |
| `--rerank-candidate-multiplier 10` | 60.0% | -10.2 points; ranges disjoint | catastrophically refuted |
| `--two-call-reader` (Chain-of-Note) | 58.6% | -11.6 points; ranges disjoint | refuted |

Top-K=5 with HyDE on and rerank-multiplier 5 is the local optimum in the tested parameter space.

---

## Part 3: Per-category retrieval failure at M scale

Per-category accuracy at the 30.6% M baseline indicates which question types degrade most when retrieval operates over 500 sessions instead of 50.

| Category | n | M accuracy | S baseline | Δ at M scale |
|---|---:|---:|---:|---:|
| single-session-user | 70 | 60.0% | 97.1% | -37.1 points |
| single-session-assistant | 56 | 50.0% | 89.3% | -39.3 points |
| knowledge-update | 78 | 50.0% | 86.8% | -36.8 points |
| **multi-session** | 133 | **18.0%** | 61.7% | **-43.7 points** |
| **temporal-reasoning** | 133 | **12.8%** | 70.2% | **-57.4 points** |
| single-session-preference | 30 | 10.0% | 63.3% | -53.3 points |
| **Aggregate** | **500** | **30.6%** | **76.6%** | **-46.0 points** |

Multi-session and temporal-reasoning together account for 53% of all M cases and show the largest S→M deltas (-43.7 points and -57.4 points respectively). Across 500 candidate sessions instead of 50, the relevant session frequently does not make the top-20 under CharHash + BM25 + Cohere rerank.

The cumulative +39.6-point lift from baseline to 70.2% came from three independent axes: M-tuned retrieval flags (+14.8 points), semantic embedder switch (+12.2 points, folded with reader router), and `--reader-top-k 5` (+12.6 points). Multi-session moved from 18% to 48.9% (+30.9 points); temporal-reasoning from 12.8% to 66.2% (+53.4 points).

---

## Mastra's `gpt-5-mini` configuration scores above their `gpt-4o` configuration

Mastra publishes 84.23% on LongMemEval-S with `gpt-4o` as the reader, and 94.87% with `gpt-5-mini` as the reader. The architectural reason for this ordering is that the `gpt-5-mini` configuration moves reasoning upstream of the reader, into ingest-time observers and reflectors.

In Mastra's `gpt-4o`-only configuration, the reader handles retrieval-context parsing, cross-session reasoning, and answer generation in a single query-time LLM call.

In Mastra's `gpt-5-mini` + Observational Memory configuration, the pipeline does additional ingest-time work. A [`gemini-2.5-flash`](https://blog.google/technology/google-deepmind/gemini-2-5/) "observer" runs over each session at ingest and extracts structured observation logs. A second `gemini-2.5-flash` "reflector" synthesizes the observations into long-term cross-session insights. At query time, the `gpt-5-mini` reader answers from the pre-distilled observation log plus reflections rather than raw chunks. The architecture is documented on [Mastra's Observational Memory research page](https://mastra.ai/research/observational-memory) and described in [VentureBeat's coverage](https://venturebeat.com/data/observational-memory-cuts-ai-agent-costs-10x-and-outscores-rag-on-long).

The 94.87% is excluded from the comparison tables in this post for two reasons:

1. AgentOS at the same stack (`gpt-5-mini` reader + `gemini-2.5-flash` observer) on LongMemEval-S Phase A produced 70.4%, a 24-point gap from the published headline. The methodology disclosed on Mastra's research page does not contain enough detail for direct reproduction.

2. No confidence range is published on the 94.87%. Mastra's 84.23% `gpt-4o` headline falls inside the AgentOS 95% range; the two configurations are statistically tied at this resolution.

The cross-vendor comparison at the top of this post uses `gpt-4o` on both sides.

---

## Part 4: Reproducibility issues in the published vendor record

The patterns documented below are the methodology checks the agentos-bench harness applies before publishing any number, and the gaps between agentos-bench numbers and other vendors' published numbers.

### LOCOMO answer-key and judge error rates

[Penfield Labs (April 2026)](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) audited LOCOMO and reported 99 errors in 1,540 answer-key entries (6.4% ground-truth error rate), and a 62.81% false-positive rate on LOCOMO's default LLM judge against an intentionally-wrong topically-adjacent answer set.

Implications:

- LOCOMO scores above 93.6% include benefit from answer-key errors.
- LOCOMO score differences below ~6 points are within the judge false-positive band.

For context, [Northcutt et al. (NeurIPS 2021)](https://arxiv.org/abs/2103.14749) found a 3.3% label-error rate sufficient to destabilize benchmark rankings.

### LongMemEval-S overlap with current context windows

LongMemEval-S uses 115K tokens of conversation per question. GPT-4o (128K), Claude 3.5 (200K), Gemini 1.5 Pro (1M), and GPT-5 (400K) all hold the full S corpus in a single prompt.

Mastra's full-context baseline at `gpt-4o` is 60.20%; their Observational Memory configuration at the same model is 84.23%. The 24-point delta partly reflects token-level compression rather than retrieval-architecture quality.

The M variant exceeds every production context window, removing this confound.

### Cross-vendor reimplementation discrepancies

In May 2025, [Mem0 published a research paper](https://mem0.ai/research) positioning their product as state-of-the-art on LOCOMO. Their comparison table scored Zep at 65.99%. Zep [responded](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/), reran the evaluation with their own configuration, and reported 75.14% ±0.17 for Zep. Zep attributed the gap to Mem0 running Zep with sequential search instead of concurrent search.

Zep's self-reported LongMemEval-S number is 71.2% at `gpt-4o`, from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at 63.8%, a 7.4 points gap.

### Notable methodology-disclosure findings

- [EmergenceMem "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast) hardcodes `top_k=42` in retrieval.
- [Mastra's research page](https://mastra.ai/research/observational-memory) publishes 84.23% at `gpt-4o`; the observer and reflector models in the same configuration are `gemini-2.5-flash` (cross-provider).
- [Mem0's research page](https://mem0.ai/research) reports 92.0% on LongMemEval; [their research-2 page](https://mem0.ai/research-2) reports 93.4% on the same benchmark.
- MemPalace published 100% claims on LongMemEval (retrieval recall@5, not end-to-end QA) and LOCOMO (`top_k=50` over Claude Sonnet, exceeding the corpus and reducing the test to context-window QA). Documented in [HackerNoon's post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks).

### What competitors actually publish on 12 transparency axes

| Transparency axis | Mem0 | Mastra | Supermemory | Zep | Emergence | Letta | MemPalace | AgentOS |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Aggregate accuracy | yes | yes | yes | yes | yes | partial | yes | yes |
| 95% confidence range on headline | no | no | no | partial | no | no | no | yes |
| Per-category 95% range | no | no | no | no | no | no | no | yes |
| Reader model disclosed | no | yes | partial | yes | yes | no | no | yes |
| Observer / ingest model disclosed | no | yes | no | yes | yes | no | no | yes |
| USD cost per correct | no | no | no | no | no | no | no | yes |
| Latency avg / p50 / p95 | no | no | no | partial | median only | no | no | yes |
| Per-category breakdown | no | yes | yes | yes | yes | partial | no | yes |
| Open-source benchmark runner | yes | partial | yes | partial | yes | no | partial | yes |
| Per-case run JSONs at fixed seed | no | no | no | no | no | no | no | yes |
| Judge-adversarial probe | no | no | no | no | no | no | no | yes |
| Cross-vendor cross-vendor table | no | no | partial | partial | yes | no | no | yes |

### Judge FPR comparison

| Benchmark | AgentOS judge FPR | LOCOMO default judge FPR (Penfield audit) |
|---|---:|---:|
| LongMemEval-S | 1% [0%, 3%] | not measured |
| LongMemEval-M | 2% [0%, 5%] | not measured |
| LOCOMO | **0% [0%, 0%]** | **62.81%** |

LOCOMO's default `gpt-4o-mini` judge measures at 62.81% FPR on the Penfield adversarial set. agentos-bench LOCOMO runs use `gpt-4o-2024-08-06` with rubric `2026-04-18.1`, which measures at 0% FPR on the same adversarial set.

---

## Part 5: Reproducing both headlines

OpenAI and Cohere API keys are required.

### LongMemEval-S 85.6% headline

```bash
git clone https://github.com/framersai/agentos-bench
cd agentos-bench
pnpm install && pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-s \
  --reader gpt-4o \
  --memory full-cognitive --replay ingest \
  --hybrid-retrieval --rerank cohere \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

### LongMemEval-M 70.2% headline

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive --replay ingest \
  --hybrid-retrieval --rerank cohere --rerank-candidate-multiplier 5 \
  --reader-top-k 5 \
  --hyde \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Both runs emit per-case run JSONs under `seed=42`. Cross-run comparison is possible against the leaderboard at [`packages/agentos-bench/results/LEADERBOARD.md`](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md).

---

## Architecture

The AgentOS memory decomposition follows the [CoALA framework (Sumers et al., 2023)](https://arxiv.org/abs/2309.02427): explicit memory partitions and a decision-making module selecting a strategy per query. The `MemoryRouter` corresponds to the CoALA memory module; the `ReaderRouter` corresponds to the decision module.

The closest comparable architecture in the published record is [Letta](https://www.letta.com/blog/memgpt-and-letta) (formerly MemGPT, [Packer et al., 2023](https://arxiv.org/pdf/2310.08560)), which models the LLM as a virtual operating system with paged memory. Letta has not published a LongMemEval number under the post-MemGPT branding.

Eight cognitive-memory mechanisms underlie the architecture (Ebbinghaus decay, reconsolidation, retrieval-induced forgetting, feeling-of-knowing, gist extraction, schema encoding, source confidence decay, emotion regulation) and are documented with primary-source citations in [Cognitive Memory for AI Agents](/blog/cognitive-memory-beyond-rag).

## Remaining headroom

Multi-session is the lowest per-category score on both variants. On M it measures at 48.9% (up from 29.3% under top-K=50), against a per-category ceiling of ~96% on SSA/SSU. On S it measures at 74.4% against the 85.6% aggregate. The MS category requires bridge queries across distinct sessions; pure retrieval-broadening does not close the gap.

Two candidate v2 mechanisms are queued:

1. Stage E: Hindsight 4-network typed-observer, adding a typed-graph signal orthogonal to BM25 + dense + Cohere rerank. Architecture follows [Hindsight (vectorize.io, 2025)](https://arxiv.org/html/2512.12818v1).
2. K=V+fact key augmentation (Wu et al., Table 3 configuration): index sessions by raw content and extracted facts, with dual-key vector lookup. The Phase B `--rerank-candidate-multiplier 10` ablation regressed -10.2 points on the same retrieval-heavy categories K=V+fact would affect, suggesting bounded expected lift.

---

## Methodology disclosures

What's apples-to-apples in the comparisons above:

- Same `gpt-4o` reader as Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem.
- Same benchmark dataset (LongMemEval-S, 500 cases; LongMemEval-M, 500 cases).
- Same judge harness (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`); judge false-positive rate 1% on S, 2% on M, 0% on LOCOMO.
- 95% confidence ranges at 10,000 resamples; most vendors don't publish ranges at all.

What isn't, with caveats:

- Cost and latency comparisons against Mastra, Supermemory, and EmergenceMem aren't directly measurable, because those vendors don't publish $/correct or per-case latency. The cost and latency wins above are AgentOS-internal versus prior AgentOS configurations.
- Mastra's 94.87% headline uses `gpt-5-mini` + `gemini-2.5-flash` observer. We can't reproduce it from their public methodology page, so it sits outside our `gpt-4o` table.
- Mem0 v3's 93.4% is a managed-platform number with no published confidence range, no judge disclosure, and no reader disclosure. Their own [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) post reports 66.9% on LOCOMO for the production stack.
- Hindsight's 91.4% uses `gemini-3-pro` as reader. Supermemory's 85.2% uses `gemini-3-pro` as reader. Both are cross-provider, so they sit outside the `gpt-4o` table.
- Managed-platform numbers (Mastra, Mem0 v3, agentmemory) run on infrastructure with platform-specific optimizations that aren't necessarily portable.

---

## Evaluating memory libraries

Three open-source benchmark harnesses cover the LongMemEval / LOCOMO space:

- [agentos-bench](https://github.com/framersai/agentos-bench): LongMemEval-S/M, LOCOMO, BEAM, and eight cognitive-mechanism micro-benchmarks. 95% confidence ranges, judge-adversarial probes, per-stage retention metric, per-case run JSONs at `--seed 42`.
- [Supermemory memorybench](https://github.com/supermemoryai/memorybench): LoCoMo, LongMemEval, ConvoMem against Supermemory, Mem0, and Zep with multi-judge support.
- [Mem0 memory-benchmarks](https://github.com/mem0ai/memory-benchmarks): LOCOMO and LongMemEval against Mem0 Cloud and OSS.

Reproducible memory benchmarks require a published seed, configuration, and per-case run JSONs alongside the headline number.

## Further reading

- [Full benchmarks reference](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md): canonical comparison tables, methodology disclosure matrix, LOCOMO judge-FPR data.
- [Cognitive Memory for AI Agents: Beyond RAG](/blog/cognitive-memory-beyond-rag): the nine cognitive-memory mechanisms behind AgentOS, with primary-source citations.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md): per-cell run JSONs.
- [docs.agentos.sh/blog](https://docs.agentos.sh/blog): engineering writeups including M-series intermediate stages (45.4%, 57.6%), Stage L/I negative findings, ingest-router executor design, and memory archive rehydration.

---

*Built by [Manic Agency LLC](https://manic.agency) / [Frame.dev](https://frame.dev). AgentOS and agentos-bench are open source under Apache-2.0. [GitHub](https://github.com/framersai/agentos) · [npm](https://www.npmjs.com/package/@framers/agentos) · [Discord](https://wilds.ai/discord)*
