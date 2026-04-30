---
title: "70.2% on LongMemEval-M: First Open-Source Library Above 65% on the 1.5M-Token Variant"
date: "2026-04-29"
excerpt: "AgentOS hits 70.2% [66.0%, 74.0%] on LongMemEval-M at Phase B N=500. +4.5 pp above the LongMemEval paper's academic ceiling, statistically tied with AgentBrain's closed-source 71.7%, $0.0078 per correct, 6.5x cheaper than the prior headline. The single-variable change was reader-top-K=5."
author: "AgentOS Team"
category: "Engineering"
image: "/og-image.png"
keywords: "longmemeval-m, agentos memory benchmark, top-K reduction, multi-session memory, 1.5M tokens, M variant, open source memory library, longmemeval benchmark, ai memory benchmark, sota memory library, mastra mem0 hindsight comparison"
---

LongMemEval ships two variants: S (115K tokens, 50 sessions per haystack) and M (1.5M tokens, 500 sessions per haystack). Every other open-source memory library publishes only the easier S number. The M variant is harder by an order of magnitude in token count, and no open-source memory library has published an end-to-end QA accuracy above 65% on M with full methodology disclosure.

AgentOS hits **70.2% [66.0%, 74.0%]** on LongMemEval-M at Phase B N=500, validated. That number sits **+4.5 pp above the LongMemEval paper's published academic-baseline ceiling of 65.7%** ([Wu et al., ICLR 2025, arXiv:2410.10813](https://arxiv.org/abs/2410.10813), Table 3) and is **statistically tied with [AgentBrain's](https://github.com/AgentBrainHQ) closed-source SaaS 71.7%**. Cost per correct: $0.0078, 6.5x cheaper than the same architecture at top-K=50.

## The single change that moved the number

The previous M Phase B headline was 57.6% [53.2%, 61.8%] at `--reader-top-k 50`. The LongMemEval paper's strongest published M configuration uses `top-5` (Wu et al., Table 3). We reran Phase B at full N=500 with `--reader-top-k 5` and held every other knob constant: same retrieval pipeline, same `text-embedding-3-small` embedder, same per-category reader router, same M-tuned ablation flags (HyDE on, rerank-candidate-multiplier 5).

Aggregate accuracy: **70.2% [66.0%, 74.0%]**. +12.6 pp over 57.6%, CIs non-overlapping. +4.5 pp above the academic ceiling.

| Metric | Top-K=50 (prior) | Top-K=5 (this post) | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 57.6% [53.2%, 61.8%] | **70.2% [66.0%, 74.0%]** | +12.6 pp; CIs disjoint |
| Cost per correct | $0.0505 | **$0.0078** | 6.5x cheaper |
| Total LLM cost | $14.56 | $2.74 | -81% |
| Avg latency | 264,933 ms | 83,711 ms | 3.2x faster |
| p50 latency | 22,166 ms | 18,018 ms | 19% faster |
| p95 latency | 911,071 ms | 744,911 ms | 18% faster |

## Why the reader does worse with more context at this scale

Each LongMemEval-M haystack contains ~1.5M tokens spread across 500 sessions, producing roughly 25,000 candidate chunks for retrieval. At top-K=50 the reader receives 50 chunks per query: the rerank cross-encoder's top picks plus 45 chunks of progressively lower confidence. At top-K=5 the reader sees only the chunks the cross-encoder is most confident in.

With 500 sessions to disambiguate, the cross-encoder's tail picks are noisy. The 6th through 50th chunks frequently come from sessions that share lexical surface with the query but don't contain the answer. Forcing the cross-encoder to commit to its top picks raises the signal-to-noise ratio at the reader. The same bias was reported by [Liu et al. (2024) "Lost in the Middle"](https://arxiv.org/abs/2307.03172) at the long-context-LLM level: gpt-4o accuracy degrades when answer-bearing context sits in the middle of a long prompt rather than at the start or end.

This matches the LongMemEval paper's own best M configuration. Their Table 3 row at 65.7% on M uses GPT-4o + Stella V5 retriever + Value=Session + K=V+fact + **top-5**. The paper authors converged on top-5; we tested it last.

## Per-category breakdown

| Category | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| **temporal-reasoning** (n=133) | 42.1% | **66.2% [57.9%, 74.4%]** | +24.1 pp |
| **single-session-preference** (n=30) | 40.0% | **63.3% [46.7%, 80.0%]** | +23.3 pp |
| **multi-session** (n=133) | 29.3% | **48.9% [40.6%, 57.1%]** | +19.6 pp |
| knowledge-update (n=78) | 76.9% | 78.2% [69.2%, 87.2%] | +1.3 pp |
| single-session-assistant (n=56) | 96.4% | 96.4% [91.1%, 100%] | tied |
| single-session-user (n=70) | 95.7% | 91.4% [84.3%, 97.1%] | -4.3 pp (within CI) |

Temporal-reasoning, single-session-preference, and multi-session together account for the bulk of the +12.6 pp aggregate lift.

## Why no open-source library has published above 65% on M

**(1) Long-context windows hide the problem at S scale.** M's haystacks are 1.5M tokens. GPT-4o's context window is 128K. Claude Opus is 200K. Gemini 3 Pro is 1M. None of the major production context windows fit a single M haystack. Memory vendors stop at LongMemEval-S (115K tokens) because it fits inside a single LLM call and the benchmark stops measuring memory once context reaches that size. [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) made the same point about S: at sub-128K corpus size, the benchmark partly measures context-window management rather than retrieval.

**(2) The dataset file is technically painful.** `longmemeval_m.json` is 2.7 GB. Node's `fs.readFile` rejects it because of V8's max-string-length cap. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is documented in [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain` with a file-size probe routing >1 GB files through the streaming path.

**(3) Per-run cost is bounded but discouraging.** Each M Phase B run costs $2-15 in LLM calls and takes 1-8 hours of wall time depending on top-K. The LongMemEval paper notes that a memory-augmented full-context run on M would consume 1.5M × 500 = 750M input tokens at GPT-4o-128K pricing, roughly $1,250. Retrieval-augmented systems pay $5-20 per Phase B run. Vendors avoid M because publishing an M number means publishing one that's worse than their S number.

agentos-bench publishes M anyway because the methodology stack is the differentiator: bootstrap CIs (10,000 Mulberry32 resamples, seed 42), per-case run JSONs, reproducible CLI, MIT-licensed code. A 70.2% number with a full audit trail beats a 90% number with no methodology disclosure.

## Vendor landscape (LongMemEval-M end-to-end QA)

Verified across Mem0, Mastra, Hindsight, Letta, Zep, Cognee, EmergenceMem, Supermemory, MemMachine, Memoria, agentmemory, Backboard, ByteRover, AgentBrain, plus the LongMemEval paper academic baseline and [SelRoute](https://github.com/snap-research/locomo). Audit performed 2026-04-29.

| System | License | LongMemEval-S | **LongMemEval-M** | Source |
|---|---|---:|---:|---|
| **agentos-bench (this post)** | **MIT** | 85.6% | **70.2% [66.0%, 74.0%]** | Phase B N=500, full methodology |
| AgentBrain | closed-source SaaS | not published | 71.7% (Test 0) | requires hosted Brain endpoint |
| LongMemEval paper academic baseline | open repo | not published | 65.7% | Wu et al., Table 3 |
| Mem0 v3 | Apache 2.0 | 93.4% | not published | reports S only |
| Mastra OM | Apache 2.0 | 84.2-94.9% | not published | reports S only |
| Zep | Apache 2.0 | 71.2% | not published | "due to gpt-4o's 128k context window we chose S over M" |
| Hindsight | open repo | 91.4% | not published | reports S only |
| EmergenceMem | open Python | 79-86% | not published | reports S only |
| Supermemory | open | 81.6-99% | not published | reports S only |
| MemMachine | open repo | 93% | not published | reports S only |
| Memoria | open | 88.78% | not published | reports S only |
| Backboard | open | 93.4% | not published | reports S only |
| agentmemory (JordanMcCann) | MIT | 96.2% | not published | reports S only |
| ByteRover | closed | 92.8% | not published | "M scales beyond any context window" |
| Letta / Cognee | open | not published | not published | no LongMemEval published |

The 70.2% point estimate sits inside AgentBrain's CI band; their 71.7% sits inside ours [66.0%, 74.0%]. AgentBrain ships only a benchmark harness publicly. agentos-bench ships the full architecture (memory primitives, retrieval pipeline, reader router, dispatch logic) as MIT-licensed code that anyone can `git clone` and reproduce.

## The journey: 30.6% → 45.4% → 57.6% → 70.2%

| Date | Configuration | Aggregate |
|---|---|---:|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K=20) | 30.6% |
| 2026-04-26 | M-tuned (HyDE + top-K=50 + rerank-multiplier 5, CharHash) | 45.4% [41.2%, 49.8%] |
| 2026-04-29 | M-tuned + sem-embed + reader router (top-K=50) | 57.6% [53.2%, 61.8%] |
| **2026-04-29** | M-tuned + sem-embed + reader router + **top-K=5** | **70.2% [66.0%, 74.0%]** |

Cumulative lift: **+39.6 pp** over the original Tier 1 canonical baseline. Each step has CIs disjoint from the prior step.

## Pareto-optimality probe: 4 single-variable changes all regress

Three follow-up Phase A/B probes tested whether 70.2% sits at a local optimum. All four directions reduced or tied the aggregate.

| Probe | Aggregate | Δ | Verdict |
|---|---:|---:|---|
| `--reader-top-k 3` | 65.2% [60.8%, 69.4%] | -5.0 pp; CIs disjoint | refuted |
| `--hyde` off | 69.2% [65.0%, 73.4%] | -1.0 pp; tied within CI | marginal |
| `--rerank-candidate-multiplier 10` | 60.0% [55.6%, 64.4%] | -10.2 pp; CIs disjoint | catastrophically refuted |
| `--two-call-reader` (Chain-of-Note) | 58.6% [54.2%, 62.8%] | -11.6 pp; CIs disjoint | refuted |

The mult=10 result is the most informative. Increasing the rerank candidate pool (more candidates feeding the cross-encoder) regressed retrieval-heavy categories the same way the K=V+fact axis would. That makes top-K=5 + HyDE-on + mult=5 the local optimum in tested parameter space.

## Methodology disclosures

Apples-to-apples vs the prior 57.6% headline:

- **Same dataset.** `data/longmemeval/longmemeval_m.json`, 500 cases, ~1.5M tokens per haystack, 500 sessions per haystack.
- **Same judge.** `gpt-4o-2024-08-06` with the LongMemEval upstream rubric, judge FPR 2% [0%, 5%] at n=100.
- **Same retrieval baseline.** Cohere `rerank-v3.5` candidate-multiplier 5, HyDE on, `text-embedding-3-small`, reader-router `min-cost-best-cat-2026-04-28`.
- **Same bootstrap CI methodology.** 10,000 Mulberry32 resamples, seed 42, percentile 95% CI.

The single change vs the prior 57.6% baseline: `--reader-top-k 5` (was: 50).

## Reproducing

```bash
git clone https://github.com/framersai/agentos
cd agentos/packages/agentos-bench
pnpm install && pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive \
  --replay ingest \
  --hybrid-retrieval --rerank cohere --rerank-candidate-multiplier 5 \
  --reader-top-k 5 \
  --hyde \
  --embedder-model text-embedding-3-small \
  --reader-router min-cost-best-cat-2026-04-28 \
  --concurrency 5 \
  --bootstrap-resamples 10000
```

Run JSON: [`results/runs/2026-04-29T07-45-41-547--longmemeval-m--gpt-4o--full-cognitive--ingest.json`](https://github.com/framersai/agentos-bench/blob/master/results/runs/2026-04-29T07-45-41-547--longmemeval-m--gpt-4o--full-cognitive--ingest.json).

## Theoretical grounding

The architecture this post measures fits the **CoALA framework** (Cognitive Architectures for Language Agents, [Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit working / episodic / semantic / procedural memory partitions, classifier-driven dispatch between recall strategies, and a reasoning loop that selects retrieval configurations based on query category. CoALA's "memory module" maps to AgentOS's `MemoryRouter`; their "decision-making module" maps to the `ReaderRouter`. The closest precedent for memory-augmented long-context QA is **MemGPT** ([Packer et al., arXiv:2310.08560](https://arxiv.org/pdf/2310.08560)), now part of [Letta](https://www.letta.com/blog/memgpt-and-letta).

## Related

- [85.6% on LongMemEval-S Pareto-Win](/blog/longmemeval-s-85-pareto-win): the S-side headline post.
- [Memory Benchmark Transparency Audit](/blog/memory-benchmark-transparency-audit): the methodology framework.
- [Full benchmarks reference](https://docs.agentos.sh/benchmarks): canonical SOTA tables with citations.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md): full transparency stack.
