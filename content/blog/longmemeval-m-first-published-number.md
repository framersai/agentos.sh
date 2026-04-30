---
title: "First Public LongMemEval-M Number: 30.6% at 500-Session Haystacks (Now Lifted to 70.2%)"
date: "2026-04-26"
excerpt: "Every published memory-library number on LongMemEval is the easier S variant: 115K tokens, 50 sessions per haystack. The official benchmark also ships an M variant: 1.5M tokens, 500 sessions per haystack. No vendor publishes M numbers. AgentOS published the first one. Here is the methodology, the scale gap, and what the 30.6% baseline tells us."
author: "AgentOS Team"
category: "Engineering"
image: "/og-image.png"
keywords: "longmemeval-m, longmemeval m benchmark, agent memory benchmark scale, memory retrieval at scale, longmemeval-s vs m, agentos longmemeval, first public longmemeval-m number, 1.5 million tokens, 500 sessions"
---

> **Update 2026-04-29:** This 30.6% Phase B has been superseded three times. **45.4%** with M-tuned retrieval flags. Then **57.6%** with sem-embed + reader router on top. The current **[70.2% [66.0%, 74.0%] M headline](/blog/longmemeval-m-70-with-topk5)** stacks reader-top-K=5 on top, achieving the LongMemEval paper's own best-config single-variable choice. **+39.6 pp total lift over the 30.6% Tier 1 baseline below**, validated at Phase B N=500 with CIs non-overlapping. **+4.5 pp above the LongMemEval paper's academic-baseline ceiling (65.7%)**. **agentos-bench is the first open-source memory library on the public record with end-to-end LongMemEval-M QA accuracy above 65% with full methodology disclosure**. The S→M scale gap framing below still holds at the architecture level; the absolute numbers move with each measurement.

LongMemEval ([Wu et al., ICLR 2025, arXiv:2410.10813](https://arxiv.org/abs/2410.10813)) ships two variants. **LongMemEval-S** has approximately 115K tokens and 50 sessions per haystack. **LongMemEval-M** has 1.5M tokens and 500 sessions per haystack. Every memory-library vendor we audit publishes only the S variant: Mem0 v3 reports 93.4% on S; Mastra Observational Memory reports 84.23% (`gpt-4o`); Hindsight reports 91.4% (`gemini-3-pro`). [The official benchmark site](https://xiaowu0162.github.io/long-mem-eval/) lists both variants. None of the vendors' research pages cite an M number.

We just ran LongMemEval-M Phase B at full N=500 and report **30.6% accuracy at $0.0818 per correct, p50 5.4 s / p95 34 s latency**, with judge FPR 2% [0%, 5%] at n=100. First public LongMemEval-M number for any orchestration-router architecture.

## Why no other vendor publishes M

The dataset file is 2.7 GB. V8's max-string-length cap rejects `fs.readFile` on it. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is documented at [Stage J](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md): `chain([createReadStream, parser(), streamArray()])` from `stream-json` + `stream-chain`, with a file-size probe that routes >1 GB files through the streaming path. With the loader fixed, peak memory during ingest is bounded by the largest single case (~3 MB).

The Phase B run cost itself is ~$12 per architecture (500 cases × ~$0.025 per case at `gpt-4o` reader). That is not the gating factor; the loader is.

## The shipping config

- Memory: `full-cognitive` (CharHashEmbedder + the cognitive memory subsystem at default config; HEXACO neutral, mood-neutral)
- Replay: `ingest` (one `encode()` call per session, matching production cadence)
- Retrieval: hybrid BM25 + dense + Cohere `rerank-v3.5` over the merged pool
- `--reader-top-k 20`
- Reader: `gpt-4o`, temperature 0, max tokens 256
- Judge: `gpt-4o-2024-08-06`, rubric `2026-04-18.1`, empty system prompt
- Seed 42, bootstrap 10,000 Mulberry32 resamples

## The result

| Metric | Value |
|---|---:|
| Aggregate accuracy | **30.6%** (153/500) |
| Total cost | $12.52 |
| $/correct | $0.0818 |
| Latency p50 | 5.353 s |
| Latency p95 | 34.076 s |
| Avg latency | 10.564 s |

Per-category breakdown:

| Category | n | M accuracy | S baseline | Δ at M scale |
|---|---:|---:|---:|---:|
| single-session-user | 70 | 60.0% | 97.1% | -37.1 pp |
| single-session-assistant | 56 | 50.0% | 89.3% | -39.3 pp |
| knowledge-update | 78 | 50.0% | 86.8% | -36.8 pp |
| **multi-session** | 133 | **18.0%** | 61.7% | **-43.7 pp** |
| **temporal-reasoning** | 133 | **12.8%** | 70.2% | **-57.4 pp** |
| single-session-preference | 30 | 10.0% | 63.3% | -53.3 pp |
| **Aggregate** | **500** | **30.6%** | **76.6%** | **-46.0 pp** |

The two largest categories (multi-session 26.6% of cases, temporal-reasoning 26.6%) account for 53.2% of LongMemEval-M and pull the aggregate down hardest. Both are precision-bound at scale: with 500 candidate sessions per haystack instead of 50, the right session does not make the top-20 most of the time when CharHashEmbedder + BM25 + Cohere rerank operate over 10x more distractors.

The S→M scale gap is **-46 percentage points**, much steeper than the spec's 5-10 pp estimate. Retrieval precision at the 500-session-per-haystack scale is the bottleneck.

## Judge integrity at M scale

The Stage G probe synthesizes topically-adjacent wrong answers via `gpt-5-mini` and sends them to the same judge that scores real answers. The acceptance rate is the judge's effective false-positive rate.

| Benchmark | Judge FPR | 95% CI |
|---|---:|---:|
| LongMemEval-S | 1% | [0%, 3%] |
| **LongMemEval-M** | **2%** | **[0%, 5%]** |
| LOCOMO | 0% | [0%, 0%] |

The 30.6% aggregate is honest at the precision of the bootstrap CI. Weak retrieval systems that occasionally surface vague-but-topical answers would receive at most 2 pp of unearned credit from this judge.

For comparison: [Penfield Labs measured 62.81% FPR](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) on LOCOMO's default `gpt-4o-mini` judge with the original LOCOMO rubric. Any vendor publishing memory benchmark numbers measured with the default judge inherits up to 63 pp of accepted-wrong-answer noise.

## What this validates and rules in

The S→M precision collapse rules in **typed-graph traversal across long histories** as the v2 architectural push. With multi-session at -44 pp and temporal-reasoning at -57 pp at M scale, the bottleneck is retrieval precision, not signal stacking. Hindsight's [4-network typed observer (arXiv:2512.12818)](https://arxiv.org/html/2512.12818v1) is specifically designed for typed graph traversal across long histories.

## What this rules out

Lightweight signal additions on top of the current pipeline are ruled out. Both Stage L (Anthropic Contextual Retrieval) and Stage I (Mem0-v3-style entity-linking re-rank) measured negative at the smaller LongMemEval-S and LOCOMO scales; they would be even more swamped by the precision problem at M scale. The next architectural push needs to be substantial: typed graph traversal, not signal stacking.

## The transparency stack

Every cell in the v1 evaluation matrix ships with:

- Bootstrap 95% CI (10,000 Mulberry32 resamples, seed 42)
- Per-category breakdown
- $/correct (full pipeline: ingest + reader + judge + reranker)
- p50 / p95 latency
- Judge FPR per benchmark via the Stage G probe (1% S, 2% M, 0% LOCOMO)
- Per-case run JSON at seed 42
- Matched-reader caveat for every cross-vendor comparison

That stack is the publishable artifact. The numbers are what they are; the discipline behind producing them is the differentiator vs every memory-library publisher we audited.

## Theoretical grounding

The architecture stack maps to the **CoALA framework** (Cognitive Architectures for Language Agents, [Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)): explicit memory access, decision-making module, and a retrieval pipeline. The 30.6% measurement is the CoALA decomposition's behavior on a 1.5M-token haystack distribution.

## Reproducing the run

```bash
git clone https://github.com/framersai/agentos
cd agentos/packages/agentos-bench
pnpm install && pnpm build

# Set OPENAI_API_KEY and COHERE_API_KEY in your environment
NODE_OPTIONS="--max-old-space-size=8192" pnpm exec tsx src/cli.ts run longmemeval-m \
  --reader gpt-4o \
  --memory full-cognitive \
  --replay ingest \
  --hybrid-retrieval \
  --rerank cohere \
  --reader-top-k 20 \
  --bootstrap-resamples 10000
```

## Related

- [70.2% on LongMemEval-M (current M headline)](/blog/longmemeval-m-70-with-topk5): +39.6 pp lift via M-tuned retrieval + sem-embed + reader-router + reader-top-K=5.
- [85.6% on LongMemEval-S Pareto-Win](/blog/longmemeval-s-85-pareto-win): the S-side headline with matched-reader honest framing.
- [Memory Benchmark Transparency Audit](/blog/memory-benchmark-transparency-audit): why other vendors' numbers don't reproduce.
- [Cognitive Memory for AI Agents: Beyond RAG](/blog/cognitive-memory-beyond-rag): the 8 mechanisms behind the architecture.
- [Full benchmarks reference](https://docs.agentos.sh/benchmarks): canonical SOTA tables with citations.
