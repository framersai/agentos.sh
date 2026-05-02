---
title: "Why Memory-Library Benchmarks Don't Mean What You Think"
date: "2026-04-24"
excerpt: "An audit of how Mem0, Mastra, Supermemory, Zep, EmergenceMem, and MemPalace publish their LongMemEval and LOCOMO numbers. The benchmarks are broken, the gaming is documented, and AgentOS publishes its own honest numbers alongside the audit framework."
author: "AgentOS Team"
category: "Engineering"
audience: "engineer"
image: "/img/blog/og/memory-benchmark-transparency-audit.png"
keywords: "memory benchmark transparency, longmemeval gaming, locomo audit, agentos policy router, pareto-optimal routing, memory library benchmark reproducibility, mem0 vs zep, mastra observational memory, supermemory memorybench, benchmark reproducibility"
---

> "If a measurement matters at all, it is because it must have some conceivable effect on decisions and behavior. If we can't identify a decision that could be affected by a proposed measurement and how it could change those decisions, then the measurement simply has no value."
>
> — Douglas Hubbard, *How to Measure Anything*, 2014

This post examines the benchmarks the entire memory-library industry uses as proof. The benchmarks are broken in measurable ways, the gaming patterns are documented, and the right response is not to refuse to publish numbers but to publish honest ones with a methodology stack disclosed at every step. Below is the audit; everything else AgentOS publishes runs against this disclosure.

> **Note:**
>
> This post laid out the methodology audit framework that drives every published agentos-bench number. The current LongMemEval-S Phase B headline is **[85.6% on LongMemEval-S at $0.009/correct, 4-second latency](/blog/agentos-memory-sota-longmemeval)**, validated under the same transparency stack this post describes (per-cell run JSON at seed 42, bootstrap 95% CI at 10k resamples, judge FPR 1% [0%, 3%] at n=100, eleven adjacent stress-tests all regressing). The current LongMemEval-M headline is **[70.2% on LongMemEval-M](/blog/agentos-memory-sota-longmemeval)**.


In April 2026, [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) ran a systematic audit of [LOCOMO](https://aclanthology.org/2024.acl-long.747.pdf), the long-term-memory benchmark every major memory-library vendor cites as their SOTA proving ground. The audit found 99 errors in 1,540 answer-key entries: a 6.4% ground-truth error rate. Penfield then tested the LLM judge the benchmark relies on. It accepted **62.81% of intentionally wrong answers** when the wrong answer was topically adjacent to the correct one.

Those two numbers put a hard floor on any LOCOMO score comparison. A 6.4% error rate in the gold answers means any system scoring above 93.6% is benefiting from benchmark errors. A judge that accepts almost two-thirds of wrong-but-topical answers means any score gap below roughly 6 pp is inside the judge's noise. Mem0's 91.6% LOCOMO claim, Hydra DB's 90.79%, Zep's self-reported 71.2%, Emergence AI's 86%: all are measured against a benchmark whose ceiling is 93.6% and whose grader tolerates the exact failure mode (vague, topically-adjacent answers) that weak memory systems produce.



LOCOMO is one of the two benchmarks the industry converges on. The other is LongMemEval-S, whose 115K-token corpus fits inside every current-generation LLM's context window. Mastra's own published results demonstrate the consequence: their full-context baseline at `gpt-4o` scored 60.20%, and their Observational Memory system scored 84.23% on the same model. The 24-point lift measures how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory across conversations.

This post is an audit. It cites primary sources. It includes our own company's numbers and calls out where our methodology is open to the same critique.

## The benchmarks everyone cites are broken

LongMemEval ([Wu et al., ICLR 2025, arXiv:2410.10813](https://arxiv.org/abs/2410.10813)) and LOCOMO ([Maharana et al., ACL 2024](https://aclanthology.org/2024.acl-long.747.pdf)) are the two benchmarks every memory-library vendor quotes. Both have structural problems documented by third-party audits.

**LOCOMO's answer key is wrong 6.4% of the time.** [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) found 99 score-corrupting errors in 1,540 questions, categorized as hallucinated facts, incorrect temporal reasoning, and speaker attribution errors. The theoretical maximum score for a perfect system sits at about 93.6%. A score of 95% on LOCOMO is mathematically impossible without benefiting from the errors.

The Penfield team then tested the LLM judge. LOCOMO uses `gpt-4o-mini` to grade answers against the gold reference. Penfield synthesized intentionally wrong-but-topically-adjacent answers for all 1,540 questions. The judge accepted **62.81%** of them. Per the audit: "Vague answers that identified the correct topic while missing every specific detail passed nearly two-thirds of the time. This is precisely the failure mode of weak retrieval, locating the right conversation but extracting nothing specific, and the benchmark rewards it."

That means any score difference below roughly ±6 pp on LOCOMO is inside the judge's noise floor. By comparison, [Northcutt et al. (NeurIPS 2021, arXiv:2103.14749)](https://arxiv.org/abs/2103.14749) found that a 3.3% label-error rate is sufficient to destabilize model rankings across major ML benchmarks. LOCOMO's 6.4% is nearly double that.

**LongMemEval-S is partly a context-window test, not just a memory test.** LongMemEval-S uses about 115K tokens of conversation context per question. GPT-4o, Claude 3.5, Gemini 1.5 Pro, and GPT-5 all have context windows from 200K to 1M tokens. The entire test corpus fits in a single prompt for every current-generation model.

Penfield points out that Mastra's own published results demonstrate this. Mastra's full-context baseline at `gpt-4o` scored 60.20% on LongMemEval-S. Their Observational Memory system scored 84.23%. The 24-point lift is largely a measurement of how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory. As context windows continue to grow, the benchmark's ability to discriminate shrinks. The [LongMemEval-M variant](https://arxiv.org/abs/2410.10813) (1.5M tokens, 500 sessions) restores the test by exceeding every production context window.

These are the conditions under which every memory vendor in the space has been racing to post higher numbers. The newer [Locomo-Plus benchmark (arXiv:2602.10715)](https://arxiv.org/html/2602.10715v1) and the [Beyond a Million Tokens ICLR 2026 poster](https://iclr.cc/virtual/2026/poster/10006595) explicitly target these limitations.

## Two documented cases of benchmark gaming between actual memory vendors

### Case one: Mem0 publishes Zep at 65.99%, Zep publishes Zep at 75.14%

In May 2025, Mem0 published a research paper positioning their product as state-of-the-art on LOCOMO. The paper included a comparison table. Zep's score in that table was 65.99%.

Zep responded with a blog post titled ["Lies, Damn Lies, & Statistics"](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/). They reran the same LOCOMO evaluation with a correctly-configured Zep implementation. Zep scored **75.14% ±0.17**, beating Mem0's best configuration by about 10% relative.

The root cause, per Zep: Mem0 ran Zep with sequential search instead of concurrent search. Zep's search latency as reported by Mem0 was 0.778 s (with their sequential implementation). Zep's correctly-configured search latency is 0.632 s p95. The published comparison table was a real measurement, but it was measuring a Zep that Zep does not ship.

This is the cross-vendor-comparison problem. When vendors re-implement each other's systems to generate comparison tables, the re-implementation is almost always suboptimal for the competitor. Published tables look like apples-to-apples; they usually are not.

### Case two: Zep's own self-reported number does not reproduce

Zep's primary LongMemEval number is 71.2% at `gpt-4o`, cited from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at **63.8%** on the same benchmark. That is a 7.4 pp gap, about the magnitude of the LOCOMO judge's false-positive floor.

A separate [GitHub issue (#5 in zep-papers)](https://github.com/getzep/zep-papers/issues/5) titled "Revisiting Zep's 84% LoCoMo Claim: Corrected Evaluation & 58.44%" claims Zep's self-reported LOCOMO result does not survive a corrected evaluation, landing at 58.44% instead of 84%. Zep has engaged publicly with the Mem0 critique but has not (as of April 2026) published a response to the independent LongMemEval reproduction.

Zep is one of the more transparent vendors in this space. They ship open-source code ([Graphiti](https://github.com/getzep/graphiti)), publish a peer-reviewed paper ([arXiv:2501.13956](https://arxiv.org/html/2501.13956v1)), and corrected their own number when they found an error in the Mem0 replication. Their number still does not reproduce cleanly. That tells you something about the space, not specifically about Zep.

### Other patterns in the published record

[EmergenceMem's "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast) hardcodes `top_k=42` for retrieval. A literal magic number with a comment referencing Douglas Adams. [Calvin Ku reproduced their work with GPT-4o-mini](https://medium.com/asymptotic-spaghetti-integration/emergence-ai-broke-the-agent-memory-benchmark-i-tried-to-break-their-code-23b9751ded97) and found the fixed-k approach works on LongMemEval but falls apart on LOCOMO and MSC. Emergence's framing, to their credit, is honest: their blog post explicitly says the fact that RAG-like methods near-saturate LongMemEval indicates the benchmark "still isn't capturing important aspects of memory."

[Mastra's research page](https://mastra.ai/research/observational-memory) publishes 84.23% at `gpt-4o` on LongMemEval. The primary source discloses, explicitly and in the results block, that the ingest-time Observer and Reflector are `gemini-2.5-flash`. Only the Actor (the model generating the final answer) is `gpt-4o`. This is disclosed. It is easy to miss when the headline number gets re-cited on LinkedIn or in competitor comparison tables. When AgentOS evaluates against a pure-OpenAI stack with `gpt-5-mini` as observer and `gpt-4o` as reader, we are not comparing like to like against Mastra's number.

[Mem0's research page](https://mem0.ai/research) claims 92.0% on LongMemEval. Their [research-2 page](https://mem0.ai/research-2) claims 93.4% on the same benchmark. Two numbers from the same company. They do not reconcile. Neither page lists the reader model, the judge model, the seed, the bootstrap CI, or the per-category breakdown. A third-party attempt to reproduce Mem0's LongMemEval result is filed as [mem0/#3944](https://github.com/mem0ai/mem0/issues/3944), cited by Penfield Labs as one of multiple documented reproduction failures.

(The most-publicized 2026 benchmark implosion, the actress Milla Jovovich's MemPalace launch claiming 100% on LongMemEval and LOCOMO, was a celebrity-driven stunt rather than a serious competitor. The project's "100% LongMemEval" was retrieval recall@5 rather than end-to-end QA, the "100% LoCoMo" was obtained by setting `top_k=50` to dump every session into Claude Sonnet, and the advertised "contradiction detection" feature was absent from the code. [HackerNoon's post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks) and [GitHub Issue #29](https://github.com/milla-jovovich/mempalace/issues/29) cover the anatomy in full. Worth mentioning because the three patterns (wrong-metric-claimed-as-SOTA, bypass-retrieval-to-inflate, advertised-feature-absent-from-code) recur in less-flagrant forms across the real vendors surveyed above.)

## What competitors actually publish on 12 transparency axes

Across Mem0, Mastra, Supermemory, Zep, EmergenceMem, Letta, and MemPalace, no single vendor ships every transparency axis that makes a memory benchmark meaningful. The matrix below is built from each vendor's primary research page and open-source bench repo as of April 2026.

| Transparency axis | Mem0 | Mastra | Supermemory | Zep | Emergence | Letta | MemPalace | AgentOS |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Aggregate accuracy | yes | yes | yes | yes | yes | partial | yes | yes |
| 95% bootstrap CI on headline | no | no | no | partial (±0.17 SD only) | no | no | no | yes |
| Per-category 95% CI | no | no | no | no | no | no | no | yes |
| Reader model disclosed on research page | no | yes | partial | yes | yes | no | no | yes |
| Observer / ingest model disclosed | no | yes | no | yes | yes | no | no | yes |
| USD cost per correct | no | no | no | no | no | no | no | yes |
| Latency avg / p50 / p95 | no | no | no | partial (p95 search) | median only | no | no | yes |
| Per-category breakdown | no | yes | yes | yes | yes | partial | no | yes |
| Open-source benchmark runner | yes | partial (workshop) | yes | partial | yes | no | partial | yes |
| Per-case run JSONs at seed | no | no | no | no | no | no | no | yes |
| Judge-adversarial probe | no | no | no | no | no | no | no | yes |
| Cross-vendor cross-vendor table | no | no | partial | partial | yes | no | no | yes |

**Bench tooling: two open suites in the space.** [Supermemory's memorybench](https://github.com/supermemoryai/memorybench) is a TypeScript framework with multi-provider support (Supermemory, Mem0, Zep), multi-benchmark coverage (LoCoMo, LongMemEval, ConvoMem), multi-judge support (GPT-4o, Claude, Gemini), a checkpointed pipeline (ingest → index → search → answer → evaluate → report), a web UI, and a MemScore triple (accuracy / latency / tokens). agentos-bench covers a narrower vendor surface but adds bootstrap CIs, judge-adversarial probes, kill-ladder methodology, and per-case run JSONs at fixed seed.

Two vendors ship real bench suites. Everyone else ships a runner for their own system (Mem0's [memory-benchmarks](https://github.com/mem0ai/memory-benchmarks) runs Mem0 Cloud and OSS, not other vendors) or a workshop (Mastra's [workshop-longmemeval](https://github.com/mastra-ai/workshop-longmemeval) is examples from a July 2025 workshop). Five do not ship anything beyond their memory system itself.

Supermemory goes wide. AgentOS goes deep. Neither is strictly better, and no single vendor covers the full transparency surface.

## Where AgentOS actually lands

Phase B N=500 numbers on LongMemEval-S at `gpt-4o` reader, measured 2026-04-24. Primary source: run JSONs under `packages/agentos-bench/results/runs/` in the [AgentOS monorepo](https://github.com/framersai/agentos).

| Tier | Accuracy | 95% CI | $/correct | Avg latency | Notes |
|---|---:|---|---:|---:|---|
| Tier 1 canonical | 73.2% | [69.2, 77.0] | $0.0213 | 98 s | BM25 + dense RRF + Cohere rerank |
| Tier 2a v10 router | 74.6% | [70.8, 78.4] | $0.3265 | 12 s | gpt-5-mini classifier routes KU/MS to OM |
| Tier 2b v11 verbatim | 75.4% | [71.6, 79.0] | $0.4362 | 14 s | v10 + conditional verbatim on KU/SSU |
| Tier 3 max-acc v2 | 75.6% | [71.8, 79.2] | $0.2434 | 66 s | Per-query policy router, max-acc table |
| **Tier 3 min-cost** | **76.6%** | **[72.8, 80.2]** | **$0.0580** | **16 s** | Pareto-dominates all three flat tiers |

76.6% at $0.058 per correct answer. Sixteen seconds average latency, 3.3 s median. Bootstrap confidence interval of 72.8% to 80.2%. Backend mix: 85.8% Tier 1 + 14.2% Tier 2b.

Tier 3 is the policy-router tier. Instead of shipping a single memory architecture, the router picks a backend per query based on the `gpt-5-mini` classifier's predicted question category. The `minimize-cost` preset routes SSA / SSU / TR / KU to Tier 1 (where those categories Pareto-dominate at baseline) and only pays the Tier 2b OM premium on MS and SSP (where the architectural lift earns it).

### The LLM-as-judge memory router is a first-class agentos primitive

The 76.6% headline is not bench-only tier logic. It is produced by [`@framers/agentos/memory-router`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router), a shipping agentos primitive that consumers import directly:

```ts
import {
  LLMMemoryClassifier,
  MemoryRouter,
  FunctionMemoryDispatcher,
} from '@framers/agentos/memory-router';

const router = new MemoryRouter({
  classifier: new LLMMemoryClassifier({ llm: openaiAdapter }),
  preset: 'minimize-cost',
  budget: { perQueryUsd: 0.05, mode: 'cheapest-fallback' },
  dispatcher: new FunctionMemoryDispatcher({
    'canonical-hybrid': async (q, p) => hybridRetriever.retrieve(q, p),
    'observational-memory-v10': async (q, p) => omV10.recall(q, p),
    'observational-memory-v11': async (q, p) => omV11.recall(q, p),
  }),
});

const { decision, traces, backend } = await router.decideAndDispatch(query, { topK: 10 });
```

The benchmark number and the production primitive are the same code. Not a paper, not a spec, not a bench-only flag: a TypeScript primitive with 89 passing tests, a provider-agnostic LLM adapter, budget-aware dispatch, and shipping presets calibrated from the Phase B N=500 cost-accuracy points in the table above.

The pattern generalizes into the agentos **Cognitive Pipeline**: smart per-message orchestration at every pipeline boundary. agentos ships three LLM-as-judge router primitives plus a composition layer:

| Stage | Primitive | What it picks |
|---|---|---|
| Ingest | [`@framers/agentos/ingest-router`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/ingest-router) | storage strategy per content (raw-chunks / summarized / observational / fact-graph / hybrid / skip) |
| Recall | [`@framers/agentos/memory-router`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router) | recall architecture per query (canonical-hybrid / OM-v10 / OM-v11) |
| Read | [`@framers/agentos/read-router`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/read-router) | reader strategy per query+evidence (single-call / two-call extract+answer / commit-vs-abstain / verbatim / scratchpad) |
| Composition | [`@framers/agentos/cognitive-pipeline`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/cognitive-pipeline) | wires the three stages together |

This is **smart orchestration, not safety guardrails.** The Cognitive Pipeline picks strategies; it does not block, refuse, or validate output. Safety/policy concerns are a separate, complementary layer (`@framers/agentos/core/guardrails`, `agentos-ext-grounding-guard`, `agentos-ext-topicality`, `agentos-ext-pii-redaction`) that runs after the pipeline finishes. Two stacks, two responsibilities, two distinct mental models.

Same LLM-as-judge contract at every orchestration boundary: classify context, pick strategy, dispatch to a registered executor. Each stage classifier costs about $0.0002 per call. The savings from per-message routing pay for the classifier overhead orders of magnitude over: shipping `minimize-cost` preset costs $0.058/correct because it only pays the OM premium on multi-session and single-session-preference queries; an always-OM pipeline costs $0.44/correct on the same workload.

For workloads whose cost / accuracy profile diverges from LongMemEval-S, the [`AdaptiveMemoryRouter`](https://github.com/framersai/agentos/tree/master/packages/agentos/src/memory-router/adaptive.ts) derives the routing table from your own calibration data. Run a Phase A sweep on your workload, feed the (category, backend, cost, correct) samples into the constructor, and the router builds a workload-specific routing table at startup. No Phase B on someone else's distribution required.

What this gives a consumer: one OpenAI API key, one agentos dependency, and the same routing decisions we publish measurements for. No Claude / Gemini / specialized provider accounts required. Every classifier talks to a provider-agnostic adapter interface; swap OpenAI, Anthropic, local, or a mock by adapting two methods to the interface.

The architecture follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)) for cognitive architectures: explicit decomposition between memory access (MemoryRouter) and decision-making (ReadRouter), with an ingestion module (IngestRouter) that classifies storage strategy at write time. The benchmark numbers measure how the CoALA decomposition behaves under stress on each evaluation distribution.

Compared to the three flat tiers shipped previously:

- +1.2 pp accuracy over Tier 2b v11 at 7.5x lower $/correct
- +2.0 pp accuracy over Tier 2a v10 at 5.6x lower $/correct
- +3.4 pp accuracy over Tier 1 canonical at 2.7x higher $/correct, 6x lower latency

Compared to the published frontier, 76.6% sits above Zep's self-reported 71.2% (and well above Zep's independently-audited 63.8%) but below Mastra's 84.23%, Supermemory's 81.6%, EmergenceMem's 86%, and Mem0's 92-93.4%. AgentOS is not the frontier. The cost and latency profile at 76.6% is probably the cheapest path to that accuracy that has been published.

Primary source for runs: [`packages/agentos-bench/results/LEADERBOARD.md`](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md). Reproducibility via `pnpm exec agentos-bench run longmemeval-s --policy-router --policy-router-preset minimize-cost --bootstrap-resamples 10000 --seed 42`.

## Validation experiments

The Tier 3 routing tables (maximize-accuracy, balanced, minimize-cost) were constructed from Phase B N=500 per-category cost-accuracy data on the three flat tiers, then measured on the same Phase B distribution. To address in-distribution test-set optimization, five validation experiments cover hold-out calibration, two architectural-hypothesis tests, OOD transfer to LOCOMO, and a judge false-positive probe on the shipping number. The hold-out validates the `minimize-cost` shipping table: the calibration-derived routing table is identical to the published one across all six categories. The judge FPR probe on LongMemEval-S returns 1% [0%, 3%]: the 76.6% is not inflated by judge topical-false-positives the way Penfield's LOCOMO audit found 62.81% FPR on theirs. The three architectural tests (session-NDCG port with three K values, stronger observer model) all return negative. LOCOMO shows a negative OOD transfer diagnosed as abstention miscalibration. All five publish with per-case run JSONs at `--seed 42`.

### Hold-out calibration

Stratified 80/20 split of the Phase B N=500 data (seed=42), derive routing tables from the 398-case calibration slice, evaluate on the 97 held-out cases. For `minimize-cost`, the calibration-derived table is identical to the published table across all six categories. A different random stratified split produces the same routing decisions. The shipping 76.6% at $0.058/correct on `minimize-cost` is not a product of table overfitting.

For `maximize-accuracy`, two categories (SSU and KU) differ: calibration-derived routes both to Tier 2a, published routes to Tier 2b. Both backends' accuracy on these two categories is within CI overlap at calibration scale. The published table picks the backend with a non-significant in-sample advantage. End-to-end on the held-out N=97: 71.1% (published) vs 69.1% (calib-derived). The in-sample optimization buys ~2 pp on this specific held-out sample, which is inside sampling variance at n=97 (CI ±9 pp).

Held-out N=97 aggregate drops 7 pp vs full N=500 (69.1% vs 76.6%). Decomposition: 2.8 pp from n=97 sampling variance, 4 pp from classifier behaving worse on the smaller subset (51% accuracy on full → 46% on held-out). Not an architectural overfit signal. Full methodology and per-category breakdown at [STAGE_A_HOLDOUT_CALIBRATION_2026-04-24.md](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_A_HOLDOUT_CALIBRATION_2026-04-24.md).

### LOCOMO out-of-distribution

We ran the LongMemEval-tuned Tier 1 canonical pipeline on LOCOMO N=1986 at `gpt-4o` reader, no tuning changes. Aggregate: 49.9% [47.7, 52.1] at $0.0123/correct. About 16 pp below Mem0's claimed LOCOMO range of 66-68%. Per-category:

| Category | N | Accuracy |
|---|---:|---:|
| adversarial | 446 | 83.4% |
| open-domain | 841 | 48.5% |
| multi-hop | 321 | 39.6% |
| temporal | 96 | 27.1% |
| single-hop | 282 | 20.6% |

The single-hop 20.6% is the diagnostic. Sample inspection on conv-26: the pipeline abstains on questions that have clear answers in the haystack. "Where did Caroline move from 4 years ago?" (answer: Sweden) returns "I don't know, the excerpts do not mention where Caroline moved from 4 years ago." Retrieval did not surface the evidence turns, and the system prompt is calibrated to abstain when evidence is thin.

The abstention prompt is tuned for LongMemEval-S, where abstention is the correct answer on adversarial questions. The 83.4% on LOCOMO adversarial confirms it is working as designed. It just over-fires on LOCOMO single-hop where every question has an answer in the conversation.

A reusable CLI flag (`--no-abstention`) shipped that any user can opt into on any benchmark; it is not benchmark-specific code, it is a capability. We shipped the flag, ran the tuned configuration on LOCOMO, and published both rows.

### LOCOMO retrieval ablation: K=20 is Pareto-best, `--no-abstention` is category-specific

Four LOCOMO configurations at N=1986, gpt-4o reader, seed=42:

| LOCOMO config | Accuracy | 95% CI | $/correct | Avg latency | Δ vs OOD |
|---|---:|---|---:|---:|---:|
| **K=20 alone (Pareto-best LOCOMO tuning)** | **51.5%** | [49.2, 53.7] | **$0.0099** | 1.45 s | +1.6 pp |
| K=10 baseline (Stage F-1 OOD, no tuning) | 49.9% | [47.7, 52.1] | $0.0123 | 2.58 s | reference |
| K=20 + `--no-abstention` | 47.3% | [45.2, 49.5] | $0.0107 | 1.20 s | -2.6 pp |
| `--no-abstention` alone at K=10 | 42.1% | [40.0, 44.3] | $0.0082 | 1.19 s | -7.8 pp |

The mechanism: when the `--no-abstention` directive reaches the reader, **adversarial accuracy collapses**: 83.4% → 56.5% at K=10 (-26.9 pp), 83.4% → 54.3% at K=20 (-29.1 pp). LOCOMO is 22.5% adversarial cases by count, so the adversarial loss outweighs everything else in aggregate. Per category at K=20 + `--no-abstention`:

| Category | n | OOD baseline | K=20 + --no-abstention | Δ |
|---|---:|---:|---:|---:|
| temporal | 96 | 27.1% | 40.6% | +13.5 pp |
| open-domain | 841 | 48.5% | 55.2% | +6.7 pp |
| single-hop | 282 | 20.6% | 22.3% | +1.7 pp |
| multi-hop | 321 | 39.6% | 41.1% | +1.5 pp |
| adversarial | 446 | 83.4% | 54.3% | **-29.1 pp** |

`--no-abstention` is a category-specific tuning knob, not a Pareto improvement. For workloads with no adversarial questions that need refusal, the temporal +13.5 pp and open-domain +6.7 pp gains are real. On LOCOMO's distribution, the adversarial -29 pp wipes them out.

The Pareto-best LOCOMO tuning is **K=20 retrieval alone**: 51.5% [49.2, 53.7] at $0.0099/correct, 1.45 s avg. The `--no-abstention` row stays in the table as a transparent regression so readers see the trade-off explicitly.

### Stage G-LOCOMO: judge FPR probe on LOCOMO cases (0% FPR)

Penfield Labs found 62.81% FPR on LOCOMO's default judge (`gpt-4o-mini` with the original LOCOMO rubric). If our LOCOMO numbers ran on that same judge, most of the score would be noise. They do not: we use `gpt-4o-2024-08-06` + `rubricVersion 2026-04-18.1` (the same setup that produced 1% FPR on LongMemEval-S). The probe ran on LOCOMO cases directly: 100 randomly stratified LOCOMO cases (seed=42), gpt-5-mini synthesizing topical-adjacent wrong answers, same judge scoring them.

**Result: 0% FPR [0%, 0%].** Zero false positives in 100 probes.

| Rubric category | N | FPR |
|---|---:|---:|
| multi-session | 77 | 0% |
| temporal-reasoning | 5 | 0% |
| abstention | 18 | 0% |

(Breakdown by native LOCOMO category: single-hop 0% of 21, multi-hop 0% of 11, open-domain 0% of 45, temporal 0% of 5, adversarial 0% of 18.)

Cost: $0.04. Elapsed: 167 seconds. Standalone script at [`src/scripts/stage-g-locomo-judge-fpr-probe.ts`](https://github.com/framersai/agentos-bench/blob/master/src/scripts/stage-g-locomo-judge-fpr-probe.ts).

Two conclusions from the 63 pp gap between Penfield's LOCOMO FPR and ours:

1. **AgentOS LOCOMO numbers (49.9% OOD, 51.5% K=20 tuned, 47.3% K=20 + `--no-abstention` corrected) are not judge-inflated at our rubric's strictness.** The 14.5-16.5 pp gap to Mem0's claimed 66-68% is not sitting on judge noise floor on our side.
2. **LOCOMO's default judge + rubric is the FPR source, not LOCOMO's gold-answer format.** The short entity-style gold answers are perfectly judge-able when the rubric is strict and the judge model is current-generation. Any published LOCOMO score that ran the default `gpt-4o-mini` judge is sitting on 30-60 pp of accepted-wrong-answer noise by Penfield's measurement. That is a warning about how to interpret every LOCOMO number in the space, including Mem0's.

We cannot, from our side, prove that Mem0's 66-68% is judge-inflated. That would require replicating Mem0 through our harness. What we can prove: on our rubric, LOCOMO is judge-able at a false-positive floor of 0%. Any vendor who wants to claim a LOCOMO number should publish their judge model, their rubric, and their FPR probe output. The gap between "we ran the benchmark" and "we validated the judge" is the gap between a claim and a measurement.

### Emergence AI session-NDCG port (negative)

Emergence AI Simple Fast's 82.4% LongMemEval-S run uses a session-level NDCG retrieval stage with `k=42`. We implemented the pattern (group retrieved chunks by session, compute per-session NDCG, pick top-K sessions, expand to full session turns) and swept K.

| K | Phase B N=500 accuracy | CI | $/correct |
|---|---:|---|---:|
| 3 | 68.8% | [64.8, 72.8] | $0.0267 |
| 5 | 70.2% | [66.2, 74.2] | $0.0373 |
| 10 | 72.2% | [68.4, 76.0] | $0.0537 |
| Canonical (no session NDCG) | **73.2%** | [69.2, 77.0] | $0.0213 |

Monotonic improvement with K but never overtakes canonical HybridRetriever. Hypothesis: the BM25 + dense RRF + Cohere rerank-v3.5 pipeline already produces the session diversity that Emergence's filter enforces. On a weaker base retriever the filter adds signal; on ours it adds a lossy pre-filter.

### Observer model upgrade (negative)

Mastra's 84.23% LongMemEval-S at `gpt-4o` reader uses `gemini-2.5-flash` as the observer/reflector. Our Phase B runs use `gpt-5-mini`. We tested swapping the observer to `gpt-4o` on a category subset (70 SSU + 32 MS, both routing to Tier 2b v11 under the maximize-accuracy preset).

| Category | Baseline (`gpt-5-mini` observer, Tier 2b v11 N=500) | `gpt-4o` observer | Δ |
|---|---:|---:|---:|
| single-session-user | 98.6% | 92.0% | -6.6 pp |
| multi-session | 61.7% | 53.0% | -8.7 pp |

Upgrading the observer model to a stronger LLM hurts both categories. The `gpt-5-mini` observer's looser extraction preserves dense specifics that the reader needs. Cost of the negative run: $102.58.

### Judge false-positive probe on our own number

Penfield's LOCOMO audit found the `gpt-4o` judge has a 62.81% false-positive rate on topically-adjacent wrong answers. If our judge on LongMemEval-S has anywhere near that FPR, our 76.6% is inflated.

We ran the probe on LongMemEval-S: 100 randomly sampled cases (seed=42), synthesize a topically-adjacent wrong answer with `gpt-5-mini`, score it with the same `gpt-4o-2024-08-06` judge + `rubricVersion 2026-04-18.1` rubric we use for real answers.

**Result: 1% FPR [0%, 3%].** 1 false positive in 100 probes. The one FP was a temporal-reasoning distractor (4% FPR on that category, 0% on the other five).

| Case type | N | FPR |
|---|---:|---:|
| single-session-assistant | 11 | 0% |
| temporal-reasoning | 25 | 4% |
| single-session-user | 18 | 0% |
| multi-session | 25 | 0% |
| single-session-preference | 3 | 0% |
| knowledge-update | 18 | 0% |

The gap between our 1% on LongMemEval-S and Penfield's 62.81% on LOCOMO is big enough to deserve two explanations. First, LOCOMO gold answers are often short entity-style strings ("Sweden", "beach, mountains, forest") where topical-adjacent distractors land inside the judge's tolerance band. LongMemEval-S gold answers are usually complete propositions, which makes topical distractors easier to reject. Second, the `rubricVersion 2026-04-18.1` is stricter than whatever rubric Penfield's audit subject used. Rubric strictness is a first-order FPR variable.

Either way, on LongMemEval-S the 76.6% is not meaningfully inflated by judge false-positives. The judge's noise floor (1-3%) is well below the bootstrap CI on the accuracy number (±4 pp at n=500). Score differences above that bound are interpretable. The 100-probe run cost $0.05 and took 174 seconds. The standalone script is at [`src/scripts/stage-g-judge-fpr-probe.ts`](https://github.com/framersai/agentos-bench/blob/master/src/scripts/stage-g-judge-fpr-probe.ts). Any vendor who wants to reproduce this on their own benchmark can fork it in ten minutes.

This is the probe every memory-library publication should run and none of the eight vendors in our methodology audit did.

### What these tests leave unchanged

Tier 3 `minimize-cost` ships unchanged at 76.6% [72.8, 80.2] at $0.0580/correct on LongMemEval-S N=500. The hold-out validates it. The negative architectural experiments (session-NDCG, `gpt-4o` observer) confirm the shipping pipeline is near-optimal on our stack for this benchmark.

The Tier 3 framing, validated by the hold-out: routing per-query against measured per-category cost-accuracy curves produces strictly better cost-accuracy points than committing to a single architecture when the category distribution of the target workload is close to the distribution calibrated against. For the LongMemEval-S distribution, the published tables deliver 76.6% at $0.058/correct and survive independent calibration. For other distributions (BEAM, a custom workload), run your own calibration.

This is weaker than "we beat everyone." It is what the data supports.

## What a good memory benchmark publication would include

[Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) lists six requirements for meaningful long-term memory evaluation. Worth quoting directly:

1. **Corpus size must exceed context windows.** "If the full test corpus fits in context, retrieval is optional and the benchmark cannot distinguish memory systems from context window management."
2. **Evaluation must use current-generation models.** "gpt-4o-mini as a judge introduces a ceiling on scoring precision."
3. **Judge reliability must be validated adversarially.** "When a judge accepts 63% of intentionally wrong answers, score differences below that threshold are not interpretable."
4. **Ingestion should reflect realistic use.** Conversations built through turns and corrections, not single-pass static-text ingestion.
5. **Evaluation pipelines must be standardized or fully disclosed.** "At minimum: ingestion method (and prompt if applicable), embedding model, answer generation prompt, judge model, judge prompt, number of runs, and standard deviation."
6. **Ground truth must be verified.** "A 6.4% error rate in the answer key creates a noise floor that makes small score differences uninterpretable."

Three additions from building `agentos-bench`:

7. **Bootstrap percentile confidence intervals on every headline.** Ten thousand resamples with a seeded PRNG. Report CI low and CI high alongside the point estimate. Score differences smaller than the CI gap are not signal.
8. **Per-case run artifacts at a seed.** A run JSON with `caseId`, predicted category (when routing), chosen backend, estimated cost, actual cost, actual reader output, judge score, and per-stage retention data. Third parties should be able to rerun a specific case from a specific tier and get the same outcome deterministically.
9. **Cache fingerprinting that invalidates on config change.** When a routing table changes or a prompt hash bumps, the cache invalidates. We discovered during our Tier 3 rollout that hashing only the preset name (not the routing table content) allowed stale cached results to satisfy edited-table queries. A one-line edit to the TR routing entry returned $0 "re-run" results that were actually the pre-edit data. Fix: hash the sorted table serialization. Publicly-shipping bench runners should make this kind of cache-invalidation bug impossible, not only debuggable.

If a memory-library benchmark publication satisfies all nine, the number is trustworthy. If it satisfies fewer than five, treat the number as marketing.

## What to do with this

For developers evaluating memory libraries for their own stack, the takeaway is not "pick the vendor with the highest number." The takeaway is: ignore the headline number, read the methodology, run the benchmark yourself.

Three open-source bench frameworks exist to do that without writing your own harness:

- [**AgentOS agentos-bench**](https://github.com/framersai/agentos-bench) covers LongMemEval-S, LOCOMO, BEAM, and eight cognitive-mechanism micro-benchmarks. Bootstrap CIs, judge-adversarial probes, per-stage retention metric, kill-ladder methodology, per-case run JSONs at `--seed 42`. Depth over breadth.
- [**Supermemory memorybench**](https://github.com/supermemoryai/memorybench) covers LoCoMo, LongMemEval, and ConvoMem across Supermemory, Mem0, and Zep with any of GPT-4o, Claude, or Gemini as judge. Checkpointed pipeline, web UI, MemScore triple. Breadth over depth.
- [**Mem0 memory-benchmarks**](https://github.com/mem0ai/memory-benchmarks) covers LOCOMO and LongMemEval against Mem0 Cloud and OSS. Mem0-specific but fully open.

For vendors publishing benchmark numbers: use one of these harnesses and publish the seed, the config, and the per-case run JSONs alongside your headline. Anything less makes your number a claim, not a measurement. The community will find the gap between the claim and the reproduction. The reproduction will be louder than the launch.

AgentOS is not at the frontier of accuracy on LongMemEval-S. We are at 76.6% [72.8%, 80.2%], with a measured judge false-positive rate of 1% on the same benchmark. The frontier self-reports sit above us, and three of them (Zep's 71.2%, Mem0's 92.0/93.4%, MemPalace's 100%) have been independently disputed, unreproducible, or outright false. AgentOS's 76.6% passed an 80/20 stratified hold-out with `minimize-cost` producing an identical routing table on the calibration slice. The `maximize-accuracy` preset has two category picks at the CI-overlap boundary, minor in-sample optimization that is within sampling variance on the held-out subset.

What AgentOS is: the only vendor in the surveyed set that publishes bootstrap CIs, judge false-positive probes on shipping numbers (measured, not hypothesized), per-stage retention metrics, full cost-per-correct accounting, latency distributions, per-case run JSONs, hold-out calibration against shipping tables, and cross-vendor comparison tables at a seeded reproducible configuration. For the reader trying to decide which memory library to use, those are the things that matter. The headline number is a lottery ticket. The methodology is the infrastructure.

## References

1. Hubbard, D. W. (2014). *How to Measure Anything: Finding the Value of Intangibles in Business* (3rd ed.). Wiley.
2. Wu, D., et al. (2025). LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory. *ICLR 2025*. [arXiv:2410.10813](https://arxiv.org/abs/2410.10813).
3. Maharana, A., et al. (2024). Evaluating Very Long-Term Conversational Memory of LLM Agents (LOCOMO). *ACL 2024*. [aclanthology.org/2024.acl-long.747](https://aclanthology.org/2024.acl-long.747.pdf).
4. Penfield Labs (April 2026). We audited LOCOMO — 6.4% of the answer key is wrong, and the judge accepts up to 63% of intentionally wrong answers. [dev.to/penfieldlabs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg).
5. Northcutt, C. G., Athalye, A., & Mueller, J. (2021). Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks. *NeurIPS 2021*. [arXiv:2103.14749](https://arxiv.org/abs/2103.14749).
6. Sumers, T. R., et al. (2023). Cognitive Architectures for Language Agents (CoALA). [arXiv:2309.02427](https://arxiv.org/abs/2309.02427).
7. Independent Zep LongMemEval reproduction. [arXiv:2512.13564](https://arxiv.org/abs/2512.13564).
8. Zep / Graphiti (2025). Temporally-aware knowledge graph memory for AI agents. [arXiv:2501.13956](https://arxiv.org/html/2501.13956v1).
9. Locomo-Plus benchmark. [arXiv:2602.10715](https://arxiv.org/html/2602.10715v1).
10. Beyond a Million Tokens (poster). *ICLR 2026*. [iclr.cc/virtual/2026/poster/10006595](https://iclr.cc/virtual/2026/poster/10006595).
11. Zep blog (2025). Lies, Damn Lies, & Statistics: Is Mem0 Really SOTA in Agent Memory? [blog.getzep.com](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/).
12. Zep blog (2025). State of the Art Agent Memory. [blog.getzep.com](https://blog.getzep.com/state-of-the-art-agent-memory/).
13. Mem0 research page. [mem0.ai/research](https://mem0.ai/research) and [mem0.ai/research-2](https://mem0.ai/research-2).
14. Mem0 issue #3944: Third-party reproduction failure. [github.com/mem0ai/mem0/issues/3944](https://github.com/mem0ai/mem0/issues/3944).
15. Mastra (2025). Observational Memory — research page. [mastra.ai/research/observational-memory](https://mastra.ai/research/observational-memory).
16. EmergenceMem Simple Fast (open-source repo). [github.com/EmergenceAI/emergence_simple_fast](https://github.com/EmergenceAI/emergence_simple_fast).
17. Emergence AI blog. SOTA on LongMemEval with RAG. [emergence.ai](https://www.emergence.ai/blog/sota-on-longmemeval-with-rag).
18. Calvin Ku (2025). Emergence AI broke the agent memory benchmark — I tried to break their code. [Medium](https://medium.com/asymptotic-spaghetti-integration/emergence-ai-broke-the-agent-memory-benchmark-i-tried-to-break-their-code-23b9751ded97).
19. Supermemory memorybench (open-source repo). [github.com/supermemoryai/memorybench](https://github.com/supermemoryai/memorybench).
20. Mem0 memory-benchmarks (open-source repo). [github.com/mem0ai/memory-benchmarks](https://github.com/mem0ai/memory-benchmarks).
21. Mastra workshop-longmemeval. [github.com/mastra-ai/workshop-longmemeval](https://github.com/mastra-ai/workshop-longmemeval).
22. zep-papers issue #5: Revisiting Zep's 84% LoCoMo Claim. [github.com/getzep/zep-papers/issues/5](https://github.com/getzep/zep-papers/issues/5).
23. HackerNoon (2026). Resident Evil star Milla Jovovich shipped an AI memory system; devs shredded its benchmarks. [hackernoon.com](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks).
24. MemPalace issue #29. [github.com/milla-jovovich/mempalace/issues/29](https://github.com/milla-jovovich/mempalace/issues/29).
25. Zheng, L., et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. [arXiv:2306.05685](https://arxiv.org/abs/2306.05685).

---

*All claims in this post are sourced from primary URLs visited April 24, 2026. The full audit with per-vendor transparency report cards is at [`packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md`](https://github.com/framersai/agentos-bench/blob/master/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md). The AgentOS bench implementation is open source at [`packages/agentos-bench`](https://github.com/framersai/agentos-bench).*
