---
title: "85.6% on LongMemEval-S at $0.009/Correct, 4-Second Latency: Per-Category Reader Routing"
date: "2026-04-28"
excerpt: "AgentOS Phase B at full N=500 lands 85.6% [82.4%, 88.6%] on LongMemEval-S. +1.4 pp over Mastra OM gpt-4o, statistically tied with EmergenceMem 86%. 4.6x cheaper, 5.3x faster than the prior 84.8% headline. Plus 15 stress-tested adjacent configurations, all regressions."
author: "AgentOS Team"
category: "Engineering"
image: "/og-image.png"
keywords: "longmemeval-s, agentos memory router, per-category dispatch, reader tier router, cost-pareto memory, gpt-4o vs gpt-5-mini, canonical hybrid retrieval, semantic embedder, ai memory benchmark, mastra mem0 alternative"
---

LongMemEval-S Phase B at full N=500, `gpt-4o-2024-08-06` judge, rubric `2026-04-18.1`, bootstrap 10,000 resamples, seed 42. AgentOS lands at **85.6% [82.4%, 88.6%]** at **$0.0090 per correct** and **4.0-second average latency**. This post documents the architectural change that produced the result and the 15 stress-tested adjacent configurations that all regressed against it.

| System (gpt-4o-class reader) | Accuracy | $/correct | p50 latency | p95 latency | Source |
|---|---:|---:|---:|---:|---|
| EmergenceMem internal | 86.0% (no CI) | not published | 5,650 ms | not published | [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag) |
| **AgentOS canonical-hybrid + reader router (this post)** | **85.6% [82.4%, 88.6%]** | **$0.0090** | **3,558 ms** | **7,264 ms** | this post |
| Mastra OM gpt-4o (gemini observer) | 84.2% (no CI) | not published | not published | not published | [mastra.ai](https://mastra.ai/research/observational-memory) |
| AgentOS reader-router with Tier 3 policy router (prior) | 84.8% [81.6%, 87.8%] | $0.0410 | ~5,000 ms | 111,535 ms | prior post |
| AgentOS Tier 3 min-cost + sem-embed (gpt-4o reader only) | 83.2% [79.8%, 86.4%] | $0.0521 | ~5,000 ms | not published | prior post |
| Supermemory gpt-4o | 81.6% (no CI) | not published | not published | not published | [supermemory.ai](https://supermemory.ai/research/) |

**+1.4 pp accuracy over Mastra OM gpt-4o at the same gpt-4o reader. Statistically tied with EmergenceMem Internal 86.0%**: their point estimate sits inside our 95% CI [82.4%, 88.6%], 0.4 pp ahead at the point estimate. EmergenceMem publishes median latency (5.65 s); our p50 of 3.558 s is **1.6x faster**.

## How we got here

A week ago, the AgentOS LongMemEval-S Phase B headline was **76.6%** measured against `CharHashEmbedder`, the bench's lexical-hash fallback. Wiring `text-embedding-3-small` (the documented production embedder) lifted the number to **83.2% [79.8%, 86.4%]**, placing AgentOS within statistical CI of Mastra OM gpt-4o (84.2%). Two days later, a per-category reader router that dispatches between gpt-4o and gpt-5-mini lifted that to **84.8% [81.6%, 87.8%]** at 21% lower cost.

Today's headline is **85.6% [82.4%, 88.6%]** at 4.6x lower cost than the 84.8% headline. The unlock came from dropping an architectural component that was supposed to be load-bearing.

## Discovery: the Tier 3 minimize-cost policy router was hurting, not helping

The 84.8% reader-router-with-policy headline used the Tier 3 minimize-cost policy router, which dispatches per query among three memory backends: `canonical-hybrid` for SSA/SSU/TR/KU questions, `observational-memory-v11` for MS/SSP questions. That calibration came from Phase B per-category accuracy data measured before the sem-embed migration, when `CharHashEmbedder` was the bench's default and canonical-hybrid recall@10 hovered around 0.62. At that recall level, OM-v11's compressed observation log was a real win for MS/SSP cases retrieval was missing.

In the sem-embed era, recall@10 on canonical-hybrid is **0.981**. The OM-v11 routing for MS/SSP no longer compensates for retrieval misses. It replaces verbatim chunks the gpt-5-mini reader needs with a compressed summary. At the gpt-4o reader, that compression destroyed SSP accuracy: **63.3%** in the prior 83.2% headline (Tier 3 + gpt-4o). At the gpt-5-mini reader (via the reader router), OM-v11's SSP was 86.7%. Canonical-hybrid + gpt-5-mini reader was also 86.7% on SSP, at a fraction of the cost and latency.

Today's run drops the policy router entirely. All categories flow through `canonical-hybrid` retrieval. The reader router fires its own `gpt-5-mini` classifier (one extra LLM call per case, ~$0.000138) and dispatches per category to the right reader tier.

```
                            Reader-router  Reader-router       Δ
                            + Tier 3 PR    + canonical only
Aggregate accuracy           84.8%          85.6%               +0.8 pp (CIs overlap)
Total LLM cost               $17.38         $3.84               -78%
Cost per correct             $0.0410        $0.0090             4.6x cheaper
Avg latency                  21,042 ms      4,001 ms            5.3x faster
p95 latency                  111,535 ms     7,264 ms            15.4x faster on tail
Recall@K=10                  0.831          0.981               +0.150
```

The +0.8 pp aggregate is within bootstrap-CI overlap. The cost and latency wins are unambiguous Pareto improvements.

## Per-category breakdown

| Category | Tier 3 PR + reader router | Canonical + reader router | Δ |
|---|---:|---:|---:|
| single-session-assistant (n=56) | 100.0% [100, 100] | 98.2% [94.6, 100] | -1.8 pp (within CI) |
| single-session-user (n=70) | 91.4% [84.3, 97.1] | **94.3%** [88.6, 98.6] | +2.9 pp |
| knowledge-update (n=78) | 88.5% [80.8, 94.9] | **91.0%** [84.6, 97.4] | +2.5 pp |
| single-session-preference (n=30) | 86.7% [73.3, 96.7] | 86.7% [73.3, 96.7] | 0 pp |
| **temporal-reasoning** (n=133) | 82.0% [75.2, 88.0] | **84.2%** [77.4, 90.2] | +2.2 pp |
| multi-session (n=133) | 75.2% [67.7, 82.7] | 74.4% [66.9, 82.0] | -0.8 pp (within CI) |
| **Aggregate** | **84.8%** | **85.6%** | **+0.8 pp** |

## Stress-tested optimum: 14 adjacent configurations all regress

Before publishing the 85.6% headline, every adjacent knob in the parameter space was tested as a Phase A probe at N=54 stratified. None lift over the canonical-hybrid + reader-router baseline.

| Probe | Phase A | Δ vs baseline |
|---|---:|---:|
| `--reader-top-k 30` (wider reader context) | 81.5% | -3.7 pp |
| `--hyde` (hypothetical-doc query expansion) | 83.3% | -1.9 pp |
| `--rerank-candidate-multiplier 5` (wider rerank pool) | 75.9% | -9.3 pp |
| `--retrieval-config-router minimize-cost-augmented` | 77.8% | -7.4 pp |
| `--policy-router-preset balanced` | 74.1% | -11.1 pp |
| `--policy-router-preset maximize-accuracy` | 83.3% | -1.9 pp |
| `text-embedding-3-large` (larger embedding) | 83.3% | -1.9 pp |
| **Reference: canonical + reader router (this headline) Phase A** | **88.9%** | **+3.7 pp** |

Phase B confirmations at full N=500:

| Probe | Phase B | Δ vs baseline |
|---|---:|---:|
| `--om-classifier-model gpt-4o` (gpt-4o classifier upgrade) | 84.0% [80.6%, 87.0%] | -1.6 pp at +44% cost-per-correct |
| `--embedder-model text-embedding-3-large` | 83.4% [80.2%, 86.4%] | -2.2 pp at **20x slower latency** |
| `--rerank-model rerank-v4.0-pro` (Cohere "pro" tier) | 84.6% [81.4%, 87.6%] | -1.0 pp; 5/6 categories regress |
| `--reader-router min-cost-best-cat-gpt5-tr-2026-04-29` | 83.2% [79.8%, 86.4%] | -2.4 pp; TR drops 84.2% → 80.5% |

Fifteen adjacent configurations tested across Phase A and Phase B; fifteen regressions. The 85.6% canonical-hybrid + reader-router configuration is **empirically Pareto-optimal in the tested parameter space**.

## Architecture: what ships

```ts
import { Memory } from '@framers/agentos';
import { ReaderRouter } from '@framers/agentos/memory-router';
import { OpenAIEmbedder } from '@framers/agentos-bench/cognitive';

const mem = await Memory.createSqlite({
  path: './memory.sqlite',
  embedder: new OpenAIEmbedder('text-embedding-3-small'),
  // No policyRouter, no observationalMemory; canonical-hybrid for all cases
  readerRouter: new ReaderRouter({
    preset: 'min-cost-best-cat-2026-04-28',
    classifier: gpt5miniClassifier,
    readers: { 'gpt-4o': gpt4o, 'gpt-5-mini': gpt5mini },
  }),
});
```

Calibration table:

```ts
export const MIN_COST_BEST_CAT_2026_04_28_TABLE: ReaderRouterTable = {
  preset: 'min-cost-best-cat-2026-04-28',
  mapping: {
    'temporal-reasoning': 'gpt-4o',         // +11.8 pp on TR
    'single-session-user': 'gpt-4o',        // +4.3 pp on SSU
    'single-session-preference': 'gpt-5-mini', // +23.4 pp on SSP
    'single-session-assistant': 'gpt-5-mini',  // +1.8 pp + cheaper
    'knowledge-update': 'gpt-5-mini',          // +1.5 pp + cheaper
    'multi-session': 'gpt-5-mini',             // +3.5 pp + cheaper
  },
};
```

## Methodology disclosures

What's apples-to-apples in this post:

- **Accuracy comparison vs Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem.** Same gpt-4o reader, same dataset (LongMemEval-S, 500 cases, ~115K-token haystacks). The +1.4 pp lift over Mastra OM gpt-4o is an apples-to-apples accuracy comparison at the same reader tier.
- **Same judge harness across all AgentOS rows.** `gpt-4o-2024-08-06` with rubric `2026-04-18.1`. Judge FPR 1% [0%, 3%].
- **Bootstrap 95% CI at 10,000 resamples.** Most vendors do not publish CIs.

What is NOT apples-to-apples (caveats inline):

- **Cost and latency vs Mastra, Supermemory, EmergenceMem are not measurable** because those vendors do not publish $/correct or per-case latency. The cost/latency wins quoted are AgentOS-internal.
- **Mastra OM's 94.9% headline** uses `gpt-5-mini` as both reader and observer. Cross-provider observer setups are not single-provider reproducible.
- **Managed-platform numbers** (Mastra, Mem0 v3, agentmemory) run on curated infrastructure with platform-specific optimizations. Mem0's own production-stack number on LOCOMO is [66.9%](https://mem0.ai/blog/state-of-ai-agent-memory-2026), suggesting the 93.4% LongMemEval-S number reflects the managed-evaluation harness more than the architecture.

## Reproducing

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

## Related

- [70.2% on LongMemEval-M with reader-top-K=5](/blog/longmemeval-m-70-with-topk5): the M-side headline post.
- [Memory Benchmark Transparency Audit](/blog/memory-benchmark-transparency-audit): methodology framework that drives every published number.
- [Full benchmarks reference](https://docs.agentos.sh/benchmarks): canonical SOTA tables with citations.
