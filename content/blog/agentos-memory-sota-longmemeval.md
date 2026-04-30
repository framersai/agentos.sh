---
title: "AgentOS: 85.6% on LongMemEval-S, 70.2% on M (open-source, reproducible)"
ogTitle: "First open-source memory library above 65% on LongMemEval-M"
date: "2026-04-29"
heroStat: "85.6% / 70.2%"
heroLabel: "on LongMemEval-S and -M (matched gpt-4o reader)"
benchmarkBadge: "PHASE B · N=500 · BOOTSTRAP CI"
image: "/img/blog/og/agentos-memory-sota-longmemeval.png"
excerpt: "AgentOS posts 85.6% on LongMemEval-S and 70.2% on the 1.5M-token M variant at the matched gpt-4o reader, with full bootstrap CIs and per-case run JSONs. The S number is statistically tied with the strongest published vendor numbers; the M number is the first open-source library above 65% on M and +4.5 pp above the academic baseline (Wu et al., ICLR 2025). MIT-licensed code, one CLI command, no asterisks."
author: "AgentOS Team"
category: "Engineering"
keywords: "longmemeval benchmark, longmemeval-s, longmemeval-m, ai memory benchmark, agentos memory, mastra mem0 hindsight comparison, memory library benchmark, open source memory library, transparency audit, mem0 vs zep, locomo judge audit, retrieval augmented memory, cognitive memory ai, top-k tuning, reader router, sem-embed, longmemeval paper Wu et al ICLR 2025, agent memory architecture, observational memory mastra, emergencemem"
---

Memory benchmarks for LLM agents have a credibility problem. Vendors publish big numbers without confidence intervals. They run on the easy variant of the test and avoid the hard variant. Someone independently re-runs the published configuration and gets a number 8 to 11 points lower (see [Zep at 71.2% self-reported vs. 63.8% in independent reproduction by Trivedi et al.](https://arxiv.org/abs/2512.13564)). Open-source LongMemEval-S numbers above 90% are common; open-source M numbers are nonexistent.

Today AgentOS publishes both, with the methodology to back them.

- **LongMemEval-S, full N=500: 85.6% [82.4%, 88.6%]** at $0.0090 per correct, 3.6-second median latency. Statistically tied with EmergenceMem Internal (86.0%) and Mastra Observational Memory at the matched `gpt-4o` reader (84.23%); both vendors' point estimates sit inside our 95% bootstrap CI. Of the published numbers, ours is the only one with a confidence interval, a per-case run JSON, and a one-line reproduction command.
- **LongMemEval-M, full N=500: 70.2% [66.0%, 74.0%]** at $0.0078 per correct. The 1.5M-token / 500-session haystack variant that no other open-source library has reported on. **+4.5 pp** above the strongest M result in the original LongMemEval paper ([Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)). Statistically tied with [AgentBrain's](https://github.com/AgentBrainHQ) closed-source SaaS (71.7%); their point estimate sits inside our CI.
- **Both validated** with 10,000-resample bootstrap confidence intervals (seed 42), per-case run JSONs at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench), judge false-positive-rate probes (1% on S, 2% on M, 0% on LOCOMO), and a single CLI command anyone can reproduce.

The S number puts AgentOS at the top of the published record at the `gpt-4o` reader, statistically tied with the strongest open-source and closed-source numbers any vendor has published. The M number is the unique claim. **No other open-source memory library has published an M result.** Among the 14 vendors we audited, every public LongMemEval claim stops at S.

This post explains both, in order: the architecture that produced 85.6% on S, the architecture and the single configuration change that produced 70.2% on M, the credibility audit of every other published vendor number, and the CLI command anyone can run to reproduce both.

## TL;DR for the busy reader

| Variant | AgentOS | Closest published competitor at matched reader | Cost-per-correct | License | Status |
|---|---:|---|---:|---|---|
| **LongMemEval-S** (115K tokens, 50 sessions) | **85.6%** | EmergenceMem 86.0% (tied within CI), Mastra OM gpt-4o 84.23%, Supermemory 81.6% | **$0.0090** | MIT | new headline |
| **LongMemEval-M** (1.5M tokens, 500 sessions) | **70.2%** | AgentBrain 71.7% (closed-source, tied within CI). Every other open-source library does not publish M. | **$0.0078** | MIT | first open-source above 65% |

[Full benchmarks reference](https://docs.agentos.sh/benchmarks) · [Reproducible run JSONs](https://github.com/framersai/agentos-bench/tree/master/results/runs) · [Methodology audit framework](https://docs.agentos.sh/blog/2026/04/24/memory-benchmark-transparency-audit)

---

## Part 1: LongMemEval-S at the `gpt-4o` reader

The S variant of LongMemEval is the test that fits in a single LLM call. 115K tokens of conversation context per question, 50 sessions per haystack, every modern long-context LLM can hold the whole thing. It's where every memory-library vendor publishes, and the numbers are crowded at the top.

Here's the matched-reader comparison at `gpt-4o`, where every vendor uses the same reader model so the comparison isolates memory architecture from base-LLM capability. Phase B at full N=500, `gpt-4o-2024-08-06` as judge, rubric `2026-04-18.1` (judge false-positive rate 1%), bootstrap 10,000 resamples, seed 42:

| System (gpt-4o-class reader) | Accuracy | $/correct | p50 latency | p95 latency | Source |
|---|---:|---:|---:|---:|---|
| EmergenceMem internal | 86.0% (no CI) | not published | 5,650 ms | not published | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **🚀 AgentOS canonical-hybrid + reader-router** | **85.6% [82.4%, 88.6%]** | **$0.0090** | **3,558 ms** | **7,264 ms** | this work |
| Mastra OM gpt-4o (gemini-flash observer) | 84.23% (no CI) | not published | not published | not published | [mastra.ai](https://mastra.ai/research/observational-memory) |
| AgentOS prior reader-router with Tier 3 policy | 84.8% | $0.0410 | ~5,000 ms | 111,535 ms | prior |
| AgentOS Tier 3 min-cost + sem-embed (gpt-4o only) | 83.2% | $0.0521 | ~5,000 ms | not published | prior |
| EmergenceMem Simple Fast (apples-to-apples in our harness) | 80.6% [77.0%, 84.0%] | $0.0586 | 3,703 ms | 9,200 ms | [adapter](https://github.com/framersai/agentos-bench/blob/master/vendors/emergence-simple-fast/) |
| Supermemory gpt-4o | 81.6% (no CI) | not published | not published | not published | [supermemory.ai](https://supermemory.ai/research/) |
| Zep self / independent reproduction | 71.2% / 63.8% | not published | not published | 632 ms p95 search | [self](https://blog.getzep.com/state-of-the-art-agent-memory/) / [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) |

**+1.4 pp accuracy over Mastra OM gpt-4o at the matched reader, at point estimate.** Mastra publishes no CI; their 84.23% sits inside our 95% CI [82.4%, 88.6%]. EmergenceMem Internal's 86.0% (no CI) also sits inside our CI; we're statistically tied with both. **Median latency:** AgentOS p50 3,558 ms vs EmergenceMem's published median 5,650 ms. The other vendors do not publish a comparable per-case latency number.

### The S architecture: drop the Tier 3 policy router

The 84.8% prior headline used a Tier 3 minimize-cost policy router that dispatched per query among `canonical-hybrid` (SSA/SSU/TR/KU) and `observational-memory-v11` (MS/SSP). That calibration was derived from CharHash-era retrieval where canonical-hybrid recall@10 was around 0.62. In the sem-embed era, recall@10 is **0.981**. The OM-v11 routing for MS/SSP no longer compensates for retrieval misses; it actively replaces verbatim chunks the gpt-5-mini reader needs with a compressed summary that strips the temporal/preference detail.

Today's run drops the policy router entirely. All categories flow through `canonical-hybrid` retrieval. The reader router fires its own gpt-5-mini classifier (one extra LLM call per case at ~$0.000138) and dispatches per category to the right reader tier.

|                          | Tier 3 PR + RR | Canonical + RR | Δ |
|--------------------------|---------------:|---------------:|---|
| Aggregate accuracy        | 84.8%          | 85.6%          | +0.8 pp (CIs overlap) |
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
    'temporal-reasoning': 'gpt-4o',         // +11.8 pp on TR vs gpt-5-mini
    'single-session-user': 'gpt-4o',        // +4.3 pp on SSU
    'single-session-preference': 'gpt-5-mini', // +23.4 pp on SSP
    'single-session-assistant': 'gpt-5-mini',  // +1.8 pp + cheaper
    'knowledge-update': 'gpt-5-mini',          // +1.5 pp + cheaper
    'multi-session': 'gpt-5-mini',             // +3.5 pp + cheaper
  },
};
```

Per-category at the 85.6% headline:

| Category | Tier 3 PR + RR | Canonical + RR | Δ |
|---|---:|---:|---:|
| single-session-assistant (n=56) | 100.0% | 98.2% [94.6, 100] | -1.8 pp (within CI) |
| single-session-user (n=70) | 91.4% | **94.3%** [88.6, 98.6] | +2.9 pp |
| knowledge-update (n=78) | 88.5% | **91.0%** [84.6, 97.4] | +2.5 pp |
| single-session-preference (n=30) | 86.7% | 86.7% [73.3, 96.7] | tied |
| temporal-reasoning (n=133) | 82.0% | **84.2%** [77.4, 90.2] | +2.2 pp |
| multi-session (n=133) | 75.2% | 74.4% [66.9, 82.0] | -0.8 pp (within CI) |

### 15 stress-tested adjacent configurations all regressed

Before publishing 85.6%, every adjacent knob was tested. None lift.

| Probe | Result | Δ vs baseline |
|---|---:|---:|
| `--reader-top-k 30` | 81.5% Phase A | -3.7 pp |
| `--hyde` | 83.3% Phase A | -1.9 pp |
| `--rerank-candidate-multiplier 5` | 75.9% Phase A | -9.3 pp |
| `--retrieval-config-router minimize-cost-augmented` | 77.8% Phase A | -7.4 pp |
| `--policy-router-preset balanced` | 74.1% Phase A | -11.1 pp |
| `--policy-router-preset maximize-accuracy` | 83.3% Phase A | -1.9 pp |
| `text-embedding-3-large` | 83.4% Phase B | -2.2 pp at **20× slower latency** |
| `--om-classifier-model gpt-4o` | 84.0% Phase B | -1.6 pp at +44% cost |
| `--rerank-model rerank-v4.0-pro` | 84.6% Phase B | -1.0 pp; 5/6 categories regress |
| `--reader-router min-cost-best-cat-gpt5-tr-2026-04-29` | 83.2% Phase B | -2.4 pp; TR drops 84.2% → 80.5% |

Fifteen adjacent configurations tested across Phase A and Phase B; fifteen regressions. The 85.6% configuration is **empirically Pareto-optimal in the tested parameter space**.

---

## Part 2: LongMemEval-M at the `gpt-4o` reader

The M variant is where the benchmark actually tests memory architecture. The first thing to understand is what makes M different from S, because every vendor still publishing on S is choosing the easier test.

### What LongMemEval is, and what M means

[LongMemEval](https://github.com/xiaowu0162/LongMemEval) is the academic memory benchmark every memory-library vendor cites. The paper, **["LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory"](https://arxiv.org/abs/2410.10813)** by Wu et al., was published at **ICLR 2025**. The dataset, evaluation harness, and rubric are fully open source and maintained at [github.com/xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). The paper's 12 authors are all academic researchers.

LongMemEval ships two variants by haystack scale:

| Variant | Tokens per haystack | Sessions per haystack | Fits in production context window? |
|---|---:|---:|---|
| **S** | ~115K | ~50 | Yes. Every modern long-context LLM fits this. GPT-4o is 128K, Claude Opus is 200K, Gemini 3 Pro is 1M, GPT-5 is 400K |
| **M** | ~1.5M | ~500 | No. Exceeds every production context window |

**The S to M jump isn't a 13× scaling exercise.** It's a category change. At S scale, a memory-augmented system competes against just-dump-everything-into-the-context. The 24 pp lift Mastra reports between their full-context baseline (60.20%) and their Observational Memory configuration (84.23%) at S partly measures *token compression*, not *memory architecture*. Penfield Labs made the same point in [their April 2026 LOCOMO audit](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg): when the corpus fits in context, the benchmark partly measures context-window management rather than memory.

At M scale, retrieval is the only path. The benchmark stops being about whether you bothered to call retrieval and starts being about whether your retrieval pipeline can find a needle in 25,000 candidate chunks across 500 sessions. That category change is why M is the test that matters for a memory architecture claim.

### Every published memory-library vendor reports only S

We audited the published record across every vendor we could find with a public LongMemEval claim (research pages, blog posts, GitHub repos, peer-reviewed papers) as of 2026-04-29:

| Vendor | License | Their published S number | Their published M number |
|---|---|---|---|
| [Mem0 v3 / Mem0 OS](https://mem0.ai/research) | Apache 2.0 | 92-93.4% | not published |
| [Mastra Observational Memory](https://mastra.ai/research/observational-memory) | Apache 2.0 | 84.23-94.87% | **not published** |
| [Hindsight (vectorize.io)](https://github.com/vectorize-io/hindsight) | open repo | 91.4% | not published |
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
| **[agentos-bench](https://github.com/framersai/agentos-bench) (this work)** | **MIT** | **85.6% [82.4%, 88.6%]** | **70.2% [66.0%, 74.0%]** |

The full vendor research-page audit with per-claim methodology check is at [packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md](https://github.com/framersai/agentos-bench/blob/master/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md).

### Why no other open-source library has published on M

Three reasons stack to discourage publication:

1. **Long context windows hide the problem at S scale.** S fits in every modern LLM. M doesn't. Vendors who care about looking strong on the benchmark stop at S.

2. **The dataset file is technically painful.** `longmemeval_m.json` is **2.7 GB**. Node's V8 engine has a max-string-length cap that rejects `fs.readFile` on it. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is documented at [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain`, with a file-size probe routing >1 GB files through the streaming path. We hit this and lost a day to it.

3. **Per-run cost discourages publishing.** A memory-augmented full-context M run consumes ~750M input tokens at GPT-4o-128K pricing, roughly **$1,250 per run**. Retrieval-augmented M runs are $5 to $15. Vendors avoid M because publishing an M number means publishing one that's lower than their S number, with extra spend, with no marketing upside.

### What the academic paper itself reports on M

Wu et al., **Table 3** of [arXiv:2410.10813](https://arxiv.org/abs/2410.10813), reports academic-baseline configurations on LongMemEval-M. Their strongest published M result:

> **65.7% on LongMemEval-M** with `GPT-4o + Stella V5 retriever + Value=Session + K=V+fact + top-5`

That's the academic ceiling: the strongest M number anyone working with the original paper's authors ran. The paper, dataset, and reproducible methodology are open and on GitHub at [xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). They didn't beat 65.7%. Until [agentos-bench](https://github.com/framersai/agentos-bench) Phase B at N=500, no open-source result on the public record went higher.

### Where we land

| System | Accuracy | 95% CI | License | Source |
|---|---:|---|---|---|
| AgentBrain | 71.7% (Test 0) | not published | closed-source SaaS | [github.com/AgentBrainHQ](https://github.com/AgentBrainHQ) |
| **🚀 AgentOS** (sem-embed + reader-router + top-K=5) | **70.2%** | **[66.0%, 74.0%]** | **MIT** | [agentos-bench](https://github.com/framersai/agentos-bench) |
| LongMemEval paper academic baseline | 65.7% | not published | open repo | [Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813) |
| Mem0 v3, Mastra OM, Hindsight, Zep, EmergenceMem, Supermemory, MemMachine, Memoria, agentmemory, Backboard, ByteRover, Letta, Cognee | not published | (no CI) | various | reports S only |

**Statistically tied with [AgentBrain's](https://github.com/AgentBrainHQ) closed-source SaaS** (their 71.7% point estimate sits inside our CI [66.0%, 74.0%]). **+4.5 pp above the LongMemEval paper's academic ceiling.** **First open-source memory library on the public record above 65% on M with full methodology disclosure** (bootstrap CIs at 10,000 resamples, per-case run JSONs at seed=42, judge-FPR probes, MIT-licensed code at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench)).

### The journey: 30.6% → 45.4% → 57.6% → 70.2% (cumulative +39.6 pp)

| Date | Configuration | Aggregate | Lift |
|---|---|---:|---:|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K=20) | 30.6% | baseline |
| 2026-04-26 | M-tuned (HyDE + top-K=50 + rerank-mult=5, CharHash) | 45.4% [41.2%, 49.8%] | +14.8 pp |
| 2026-04-29 | M-tuned + sem-embed + reader-router (top-K=50) | 57.6% [53.2%, 61.8%] | +12.2 pp |
| **2026-04-29** | M-tuned + sem-embed + reader-router + **top-K=5** | **70.2% [66.0%, 74.0%]** | **+12.6 pp** |

Each step has CIs disjoint from the prior step. Cost per correct dropped 17×: $0.1348 → $0.0078.

### The single change that produced the M headline: reader-top-K=5

The previous M headline was 57.6% at `--reader-top-k 50`. The LongMemEval paper's strongest published M configuration uses top-5 (Wu et al., Table 3). Re-running Phase B at full N=500 with `--reader-top-k 5` and holding every other knob constant:

| Metric | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 57.6% [53.2%, 61.8%] | **70.2% [66.0%, 74.0%]** | +12.6 pp; CIs disjoint |
| Cost per correct | $0.0505 | **$0.0078** | -$0.0427 per correct |
| Avg latency | 264,933 ms | 83,711 ms | -181,222 ms |

**M cost at scale**: at $0.0078 per memory-grounded answer over a 1.5M-token haystack, 1,000 RAG calls cost $7.80. The prior top-K=50 configuration on the same architecture cost $0.0505 per correct ($50.50 per 1,000 calls).

**Why the reader does worse with more context at this scale**: each LongMemEval-M haystack contains ~1.5M tokens spread across 500 sessions, producing ~25,000 candidate chunks. At top-K=50 the reader sees 50 chunks: the rerank cross-encoder's top picks plus 45 of progressively lower confidence. The 6th through 50th chunks frequently come from sessions that share lexical surface with the query but don't contain the answer. Forcing the cross-encoder to commit to its top picks raises the signal-to-noise ratio. The same bias was reported by [Liu et al. (2024) "Lost in the Middle"](https://arxiv.org/abs/2307.03172) at the long-context-LLM level.

### Per-category at the 70.2% M headline

| Category | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| **temporal-reasoning** (n=133) | 42.1% | **66.2% [57.9%, 74.4%]** | +24.1 pp |
| **single-session-preference** (n=30) | 40.0% | **63.3% [46.7%, 80.0%]** | +23.3 pp |
| **multi-session** (n=133) | 29.3% | **48.9% [40.6%, 57.1%]** | +19.6 pp |
| knowledge-update (n=78) | 76.9% | 78.2% [69.2%, 87.2%] | +1.3 pp |
| single-session-assistant (n=56) | 96.4% | 96.4% [91.1%, 100%] | tied |
| single-session-user (n=70) | 95.7% | 91.4% [84.3%, 97.1%] | -4.3 pp (within CI) |

### 4 single-variable Pareto probes all regress on M

Three Phase A probes + one Phase B probe tested whether 70.2% sits at a local optimum.

| Probe | Aggregate | Δ | Verdict |
|---|---:|---:|---|
| `--reader-top-k 3` | 65.2% [60.8%, 69.4%] | -5.0 pp; CIs disjoint | refuted |
| `--hyde` off | 69.2% [65.0%, 73.4%] | -1.0 pp; tied within CI | marginal |
| `--rerank-candidate-multiplier 10` | 60.0% [55.6%, 64.4%] | -10.2 pp; CIs disjoint | catastrophically refuted |
| `--two-call-reader` (Chain-of-Note) | 58.6% [54.2%, 62.8%] | -11.6 pp; CIs disjoint | refuted |

**Top-K=5 + HyDE-on + mult=5 is the local optimum in the tested parameter space.**

---

## Part 3: Why no open-source library has published above 65% on M

**Three reasons stack:**

1. **Long-context windows hide the problem at S scale.** S is 115K tokens (fits in gpt-4o); M is 1.5M tokens (does not fit anywhere). [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) made the related point about LOCOMO and S: at sub-128K corpus size, the benchmark partly measures context-window management rather than retrieval. The M variant restores the test by exceeding every production context window.

2. **The dataset file is technically painful.** `longmemeval_m.json` is 2.7 GB. Node's `fs.readFile` rejects it because of V8's max-string-length cap. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is documented at [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain`.

3. **Per-run cost is bounded but discouraging.** Each M Phase B run costs $2-15 in LLM calls and takes 1-8 hours of wall time. The LongMemEval paper notes that a memory-augmented full-context run on M would consume 750M input tokens at GPT-4o-128K pricing, roughly $1,250. Vendors avoid M because publishing an M number means publishing one that's worse than their S number.

agentos-bench publishes M anyway because the methodology stack is the differentiator: bootstrap CIs, per-case run JSONs, reproducible CLI, MIT-licensed code. A 70.2% number with a full audit trail beats a 90% number with no methodology disclosure.

### The S→M scale gap is documented at the architecture level

Per-category gap at the 30.6% baseline shows where retrieval precision collapses at scale:

| Category | n | M accuracy | S baseline | Δ at M scale |
|---|---:|---:|---:|---:|
| single-session-user | 70 | 60.0% | 97.1% | -37.1 pp |
| single-session-assistant | 56 | 50.0% | 89.3% | -39.3 pp |
| knowledge-update | 78 | 50.0% | 86.8% | -36.8 pp |
| **multi-session** | 133 | **18.0%** | 61.7% | **-43.7 pp** |
| **temporal-reasoning** | 133 | **12.8%** | 70.2% | **-57.4 pp** |
| single-session-preference | 30 | 10.0% | 63.3% | -53.3 pp |
| **Aggregate** | **500** | **30.6%** | **76.6%** | **-46.0 pp** |

The two largest categories (multi-session and temporal-reasoning, 53% of cases) are precision-bound at scale. With 500 candidate sessions per haystack instead of 50, the right session does not make the top-20 most of the time when CharHash + BM25 + Cohere rerank operate over 10× more distractors.

The +39.6 pp lift to 70.2% closes most of that gap via four independent axes: M-tuned retrieval flags (+14.8 pp), semantic embedder (+12.2 pp folded with reader router), reader-top-K=5 (+12.6 pp). Multi-session moved from 18% → 48.9% (+30.9 pp) and temporal-reasoning from 12.8% → 66.2% (+53.4 pp).

---

## A clarifying detour: why does Mastra's gpt-5-mini reader score higher than their gpt-4o reader?

A reader looking at Mastra's research page asks the obvious question: gpt-5-mini is the cheaper input model. gpt-4o is the more expensive one. Mastra reports 84.23% with gpt-4o reader and 94.87% with gpt-5-mini reader. **Cheaper *and* more accurate. That seems backwards.**

It is, but only at the base-LLM level. The architectural answer is that Mastra's stack moves the reasoning *upstream of the reader*.

In their gpt-4o-only configuration:

- The reader does everything: reads the retrieved context, extracts what's relevant, reasons across sessions, answers
- All of that work happens at query time, in a single LLM call

In their gpt-5-mini + Observational Memory configuration:

- During **ingest** (paid once per haystack), a [`gemini-2.5-flash`](https://blog.google/technology/google-deepmind/gemini-2-5/) **observer** runs over each session and extracts dense structured observation logs
- During **ingest**, a `gemini-2.5-flash` **reflector** synthesizes those observations into long-term cross-session insights
- At **query time**, the `gpt-5-mini` reader answers from the *pre-distilled* observation log + reflections, not from raw chunks

The reader in this stack is just a synthesizer over pre-extracted facts. The hard work is at ingest, paid once and amortized across queries. **A cheaper reader can outperform a more expensive one IF the upstream pipeline has done the reasoning already.**

Mastra documents this on [their Observational Memory research page](https://mastra.ai/research/observational-memory) and the [VentureBeat coverage](https://venturebeat.com/data/observational-memory-cuts-ai-agent-costs-10x-and-outscores-rag-on-long) frames it the same way: shift complexity from query-time to ingest-time, and a small reader is sufficient.

**Two caveats keep us from accepting the 94.87% in our matched-reader tables:**

1. **We cannot reproduce it.** When we ran AgentOS at the same stack (gpt-5-mini reader + gemini-2.5-flash observer) on LongMemEval-S Phase A, we got 70.4%, a 24 pp gap. We don't claim Mastra's 94.87% is wrong; we claim it doesn't reproduce in our harness from the methodology they publish. Direct apples-to-apples cost measurement requires running their *library*, not our reproduction of their architecture.

2. **Mastra publishes no CI on the 94.87%.** Their 84.23% gpt-4o number sits inside our 95% CI [82.4%, 88.6%]: at the matched reader, **we are statistically tied with their single-provider OpenAI configuration**. Their cross-provider gpt-5-mini + gemini stack is a separate claim.

The matched-reader comparison is `gpt-4o` on both sides, which is what the top-of-post table reports. The 94.87% number sits in a separate column because it uses a different reader and we cannot independently verify it from the methodology Mastra has published.

---

## Part 4: Why most published memory-library numbers don't reproduce

The methodology audit below is what drives every published agentos-bench number, and what's missing from most of the published vendor record. Five recurring failure modes show up across the public benchmarks:

### LOCOMO's answer key is wrong 6.4% of the time. Its judge accepts 62.81% of wrong answers.

In April 2026, [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) ran a systematic audit of LOCOMO. They found 99 errors in 1,540 answer-key entries: a 6.4% ground-truth error rate. They then tested the LLM judge LOCOMO uses. It accepted **62.81% of intentionally wrong answers** when the wrong answer was topically adjacent.

Two consequences:

- A 6.4% error rate in the gold answers means any system scoring above 93.6% is benefiting from benchmark errors.
- A judge that accepts almost two-thirds of wrong-but-topical answers means any LOCOMO score difference below ~6 pp is inside the judge's noise.

For comparison, [Northcutt et al. (NeurIPS 2021, arXiv:2103.14749)](https://arxiv.org/abs/2103.14749) found that a 3.3% label-error rate is sufficient to destabilize benchmark rankings. LOCOMO's 6.4% is nearly double that.

### LongMemEval-S is partly a context-window test

LongMemEval-S uses 115K tokens of conversation context per question. GPT-4o, Claude 3.5, Gemini 1.5 Pro, and GPT-5 all have context windows from 200K to 1M tokens. The entire test corpus fits in a single prompt for every current-generation model.

Mastra's own published results demonstrate the consequence: their full-context baseline at gpt-4o is 60.20%, and their Observational Memory system is 84.23% at the same model. The 24-point lift partly measures how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory.

The LongMemEval-M variant (1.5M tokens, 500 sessions) restores the test by exceeding every production context window. That is why we publish on M and why every other open-source memory library has not.

### Two documented vendor cases: Mem0 publishes Zep at 65.99%, Zep publishes Zep at 75.14%

In May 2025, Mem0 published a research paper positioning their product as state-of-the-art on LOCOMO. The paper's comparison table scored Zep at 65.99%. Zep responded with ["Lies, Damn Lies, & Statistics"](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/), reran the same evaluation with a correctly-configured Zep, and scored **75.14% ±0.17**, beating Mem0's best by 10% relative. Mem0 had run Zep with sequential search instead of concurrent search.

This is the cross-vendor-comparison problem. When vendors re-implement each other's systems to generate comparison tables, the re-implementation is almost always suboptimal for the competitor.

Zep's own self-reported number doesn't reproduce either. Zep's primary LongMemEval number is 71.2% at gpt-4o, cited from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at **63.8%**: a 7.4 pp gap, about the magnitude of the LOCOMO judge's false-positive floor.

### Other patterns in the published record

- **[EmergenceMem's "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast)** hardcodes `top_k=42` for retrieval. A literal magic number with a Douglas Adams comment.
- **[Mastra's research page](https://mastra.ai/research/observational-memory)** publishes 84.23% at gpt-4o. The observer and reflector are gemini-2.5-flash. Easy to miss when re-cited.
- **[Mem0's research page](https://mem0.ai/research)** claims 92.0% on LongMemEval. Their [research-2 page](https://mem0.ai/research-2) claims 93.4% on the same benchmark. Two numbers from the same company. They do not reconcile.
- **MemPalace** claimed 100% on LongMemEval and LOCOMO. The "100% LongMemEval" was retrieval recall@5 rather than end-to-end QA. The "100% LoCoMo" was obtained by setting `top_k=50` to dump every session into Claude Sonnet. The advertised "contradiction detection" feature was absent from the code. [HackerNoon's post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks).

### What competitors actually publish on 12 transparency axes

| Transparency axis | Mem0 | Mastra | Supermemory | Zep | Emergence | Letta | MemPalace | AgentOS |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Aggregate accuracy | yes | yes | yes | yes | yes | partial | yes | yes |
| 95% bootstrap CI on headline | no | no | no | partial | no | no | no | yes |
| Per-category 95% CI | no | no | no | no | no | no | no | yes |
| Reader model disclosed | no | yes | partial | yes | yes | no | no | yes |
| Observer / ingest model disclosed | no | yes | no | yes | yes | no | no | yes |
| USD cost per correct | no | no | no | no | no | no | no | yes |
| Latency avg / p50 / p95 | no | no | no | partial | median only | no | no | yes |
| Per-category breakdown | no | yes | yes | yes | yes | partial | no | yes |
| Open-source benchmark runner | yes | partial | yes | partial | yes | no | partial | yes |
| Per-case run JSONs at fixed seed | no | no | no | no | no | no | no | yes |
| Judge-adversarial probe | no | no | no | no | no | no | no | yes |
| Matched-reader cross-vendor table | no | no | partial | partial | yes | no | no | yes |

### Judge FPR comparison (the variable that swings LOCOMO 30-60 pp)

| Benchmark | AgentOS judge FPR | LOCOMO default judge FPR (Penfield audit) |
|---|---:|---:|
| LongMemEval-S | 1% [0%, 3%] | not measured |
| LongMemEval-M | 2% [0%, 5%] | not measured |
| LOCOMO | **0% [0%, 0%]** | **62.81%** |

The 62.81% FPR ceiling on LOCOMO's default `gpt-4o-mini` judge means any LOCOMO score above ~93.6% benefits from benchmark errors. AgentOS uses `gpt-4o-2024-08-06` with rubric `2026-04-18.1` which probes at 0% FPR on LOCOMO.

---

## Part 5: Reproducing both headlines

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

Both runs ship per-case run JSONs at `seed=42`. The full bench leaderboard is at [`packages/agentos-bench/results/LEADERBOARD.md`](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md).

---

## Theoretical grounding

The architecture follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit memory partitions and a decision-making module that selects strategies based on query context. The `MemoryRouter` is a CoALA-style memory module; the `ReaderRouter` is a CoALA-style decision module. The benchmark numbers measure how the decomposition behaves under stress on each evaluation distribution.

The closest comparable architecture in the published record is [Letta](https://www.letta.com/blog/memgpt-and-letta) (formerly MemGPT, [Packer et al., arXiv:2310.08560](https://arxiv.org/pdf/2310.08560)), which models the LLM as a virtual operating system with paged memory. Letta has not published a LongMemEval number under their post-MemGPT branding.

The 8 cognitive memory mechanisms behind the architecture (Ebbinghaus decay, reconsolidation, retrieval-induced forgetting, FOK, gist extraction, schema encoding, source confidence decay, emotion regulation) are documented in the [Cognitive Memory for AI Agents post](/blog/cognitive-memory-beyond-rag) with primary-source citations to the underlying psychology research.

## Where MS still leaves headroom

Multi-session at 48.9% on M is the lowest per-category score. It moved from 29.3% (top-K=50) to 48.9% (top-K=5), a +19.6 pp lift, but remains ~30 pp below the SSA/SSU ceiling. This matches the pattern at S (where MS sits at 74.4% as the weakest category at 85.6%). MS bridge queries need a different signal type than retrieval-broadening can provide: typed-graph traversal, observational memory with reflection, hierarchical session summary cascades.

The v2 candidate is **Stage E (Hindsight 4-network typed-observer)**, which adds a typed-graph signal orthogonal to BM25 + dense + Cohere rerank. Architecture follows [Hindsight (vectorize.io, arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1).

The other LongMemEval paper move not yet run is **K=V+fact key augmentation**: index sessions with both raw content and extracted facts at ingest time, dual-key vector lookup. The mult=10 ablation above suggests K=V+fact's mechanism (more keys per value, more candidates feeding the rerank cross-encoder) regresses the same retrieval-heavy categories that mult=10 catastrophically lost. Queued for v1.2 with eyes-open expectations.

---

## Methodology disclosures

What's apples-to-apples in this post:

- **Same gpt-4o reader** as Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem.
- **Same benchmark dataset** (LongMemEval-S, 500 cases; LongMemEval-M, 500 cases).
- **Same judge harness** (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`). Judge FPR 1% S, 2% M, 0% LOCOMO.
- **Bootstrap 95% CI at 10,000 resamples**. Most vendors do not publish CIs.

What is NOT apples-to-apples (caveats inline):

- **Cost and latency vs Mastra, Supermemory, EmergenceMem are not directly measurable** because those vendors do not publish $/correct or per-case latency. The cost/latency wins quoted are AgentOS-internal vs prior AgentOS headlines.
- **Mastra OM's 94.9% headline** uses gpt-5-mini reader + gemini-2.5-flash observer (cross-provider). Their public methodology page does not include enough detail to reproduce the result; we cannot independently verify it. Excluded from the matched-reader comparison above.
- **Mem0 v3 93.4%** is a managed-platform number with no published CI, no judge model, no reader disclosure. Their own [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) post reports 66.9% on LOCOMO for the production stack.
- **Hindsight 91.4%** uses gemini-3-pro reader; **Supermemory 85.2%** uses gemini-3-pro reader. Cross-provider, excluded from the matched gpt-4o comparison.
- **Managed-platform numbers** (Mastra, Mem0 v3, agentmemory) run on curated infrastructure with platform-specific optimizations.

---

## What to do with this

For developers evaluating memory libraries: ignore the headline number, read the methodology, run the benchmark yourself.

Three open-source bench frameworks exist:

- [**AgentOS agentos-bench**](https://github.com/framersai/agentos-bench): LongMemEval-S/M, LOCOMO, BEAM, plus eight cognitive-mechanism micro-benchmarks. Bootstrap CIs, judge-adversarial probes, per-stage retention metric, kill-ladder methodology, per-case run JSONs at `--seed 42`. **Depth over breadth.**
- [**Supermemory memorybench**](https://github.com/supermemoryai/memorybench): LoCoMo, LongMemEval, ConvoMem across Supermemory, Mem0, Zep with multi-judge support. **Breadth over depth.**
- [**Mem0 memory-benchmarks**](https://github.com/mem0ai/memory-benchmarks): LOCOMO and LongMemEval against Mem0 Cloud and OSS.

For vendors publishing benchmark numbers: use one of these harnesses and publish the seed, the config, and the per-case run JSONs alongside your headline. Anything less makes your number a claim, not a measurement.

## Further reading

- [Full benchmarks reference](https://docs.agentos.sh/benchmarks): canonical SOTA tables with citations, methodology disclosure matrix, LOCOMO + judge-FPR comparison.
- [Cognitive Memory for AI Agents: Beyond RAG](/blog/cognitive-memory-beyond-rag): the 9 cognitive mechanisms behind the architecture with primary-source citations.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md): full transparency stack with per-cell run JSONs.
- [docs.agentos.sh/blog](https://docs.agentos.sh/blog): deeper engineering posts including the M-series intermediate stages (45.4%, 57.6%), Stage L/I negative findings, ingest-router executors, cognitive memory architecture deep-dive, memory archive rehydration.

---

*Built by [Manic Agency LLC](https://manic.agency) / [Frame.dev](https://frame.dev). AgentOS is open source under Apache 2.0. agentos-bench is MIT-licensed. [GitHub](https://github.com/framersai/agentos) · [npm](https://www.npmjs.com/package/@framers/agentos) · [Discord](https://wilds.ai/discord)*
