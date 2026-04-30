---
title: "Why Memory-Library Benchmarks Don't Mean What You Think"
date: "2026-04-24"
excerpt: "An audit of how Mem0, Mastra, Supermemory, Zep, EmergenceMem, and MemPalace publish their LongMemEval and LOCOMO numbers. The benchmarks are broken, the gaming is documented, and AgentOS publishes its own honest numbers alongside the audit framework."
author: "AgentOS Team"
category: "Engineering"
image: "/og-image.png"
keywords: "memory benchmark transparency, longmemeval gaming, locomo audit, agentos policy router, pareto-optimal routing, memory library benchmark reproducibility, mem0 vs zep, mastra observational memory, supermemory memorybench, benchmark reproducibility, ai memory benchmark methodology"
---

In April 2026, [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) ran a systematic audit of [LOCOMO](https://aclanthology.org/2024.acl-long.747.pdf), the long-term-memory benchmark every major memory-library vendor cites as their SOTA proving ground. The audit found 99 errors in 1,540 answer-key entries: a 6.4% ground-truth error rate. Penfield then tested the LLM judge the benchmark relies on. It accepted **62.81% of intentionally wrong answers** when the wrong answer was topically adjacent to the correct one.

Those two numbers put a hard floor on any LOCOMO score comparison. A 6.4% error rate in the gold answers means any system scoring above 93.6% is benefiting from benchmark errors. A judge that accepts almost two-thirds of wrong-but-topical answers means any score gap below roughly 6 pp is inside the judge's noise. Mem0's 91.6% LOCOMO claim, Hydra DB's 90.79%, Zep's self-reported 71.2%, Emergence AI's 86%: all are measured against a benchmark whose ceiling is 93.6% and whose grader tolerates the exact failure mode (vague, topically-adjacent answers) that weak memory systems produce.

LOCOMO is one of the two benchmarks the industry converges on. The other is LongMemEval-S, whose 115K-token corpus fits inside every current-generation LLM's context window. Mastra's own published results demonstrate the consequence: their full-context baseline at `gpt-4o` scored 60.20%, and their Observational Memory system scored 84.23% on the same model. The 24-point lift measures how well a system compresses 115K tokens into fewer tokens, not how well it retrieves from long-term memory across conversations.

This post is an audit. It cites primary sources. It includes our own company's numbers and calls out where our methodology is open to the same critique.

## The benchmarks everyone cites are broken

LongMemEval ([Wu et al., ICLR 2025, arXiv:2410.10813](https://arxiv.org/abs/2410.10813)) and LOCOMO ([Maharana et al., ACL 2024](https://aclanthology.org/2024.acl-long.747.pdf)) are the two benchmarks every memory-library vendor quotes. Both have structural problems documented by third-party audits.

**LOCOMO's answer key is wrong 6.4% of the time.** [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) found 99 score-corrupting errors in 1,540 questions, categorized as hallucinated facts, incorrect temporal reasoning, and speaker attribution errors. The theoretical maximum score for a perfect system sits at about 93.6%. A score of 95% on LOCOMO is mathematically impossible without benefiting from the errors.

Per the audit: "Vague answers that identified the correct topic while missing every specific detail passed nearly two-thirds of the time. This is precisely the failure mode of weak retrieval, locating the right conversation but extracting nothing specific, and the benchmark rewards it."

Any score difference below roughly ±6 pp on LOCOMO is inside the judge's noise floor. By comparison, [Northcutt et al. (NeurIPS 2021, arXiv:2103.14749)](https://arxiv.org/abs/2103.14749) found that a 3.3% label-error rate is sufficient to destabilize model rankings across major ML benchmarks. LOCOMO's 6.4% is nearly double that.

**LongMemEval-S is partly a context-window test, not just a memory test.** LongMemEval-S uses about 115K tokens of conversation context per question. GPT-4o, Claude 3.5, Gemini 1.5 Pro, and GPT-5 all have context windows from 200K to 1M tokens. The entire test corpus fits in a single prompt for every current-generation model.

The [LongMemEval-M variant](https://arxiv.org/abs/2410.10813) (1.5M tokens, 500 sessions) restores the test by exceeding every production context window.

## Two documented cases of benchmark gaming between actual memory vendors

### Case one: Mem0 publishes Zep at 65.99%, Zep publishes Zep at 75.14%

In May 2025, Mem0 published a research paper positioning their product as state-of-the-art on LOCOMO. The paper included a comparison table. Zep's score in that table was 65.99%.

Zep responded with a blog post titled ["Lies, Damn Lies, & Statistics"](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/). They reran the same LOCOMO evaluation with a correctly-configured Zep implementation. Zep scored **75.14% ±0.17**, beating Mem0's best configuration by about 10% relative.

The root cause, per Zep: Mem0 ran Zep with sequential search instead of concurrent search. The published comparison table was a real measurement, but it was measuring a Zep that Zep does not ship.

This is the cross-vendor-comparison problem. When vendors re-implement each other's systems to generate comparison tables, the re-implementation is almost always suboptimal for the competitor. Published tables look like apples-to-apples; they usually are not.

### Case two: Zep's own self-reported number does not reproduce

Zep's primary LongMemEval number is 71.2% at `gpt-4o`, cited from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at **63.8%** on the same benchmark. That is a 7.4 pp gap, about the magnitude of the LOCOMO judge's false-positive floor.

Zep is one of the more transparent vendors in this space. They ship open-source code ([Graphiti](https://github.com/getzep/graphiti)), publish a peer-reviewed paper ([arXiv:2501.13956](https://arxiv.org/html/2501.13956v1)), and corrected their own number when they found an error in the Mem0 replication. Their number still does not reproduce cleanly. That tells you something about the space.

### Other patterns in the published record

- **[EmergenceMem's "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast)** hardcodes `top_k=42` for retrieval. A literal magic number with a Douglas Adams comment.
- **[Mastra's research page](https://mastra.ai/research/observational-memory)** publishes 84.23% at `gpt-4o`. The primary source discloses that the ingest-time Observer and Reflector are `gemini-2.5-flash`. Only the Actor is `gpt-4o`. Easy to miss when re-cited on LinkedIn.
- **[Mem0's research page](https://mem0.ai/research)** claims 92.0% on LongMemEval. Their [research-2 page](https://mem0.ai/research-2) claims 93.4% on the same benchmark. Two numbers from the same company. They do not reconcile. Neither page lists the reader model, the judge model, the seed, the bootstrap CI, or the per-category breakdown.
- **MemPalace** claimed 100% on LongMemEval and LOCOMO. The "100% LongMemEval" was retrieval recall@5 rather than end-to-end QA. The "100% LoCoMo" was obtained by setting `top_k=50` to dump every session into Claude Sonnet. The advertised "contradiction detection" feature was absent from the code. [HackerNoon's post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks).

## What competitors actually publish on 12 transparency axes

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

## Where AgentOS lands

Phase B N=500 numbers on LongMemEval-S at `gpt-4o` reader (current headline):

- **AgentOS canonical-hybrid + reader router**: 85.6% [82.4%, 88.6%] at $0.0090/correct, 4-second avg latency. **+1.4 pp over Mastra OM gpt-4o (84.23%)** at the matched reader. **Statistically tied with EmergenceMem Internal (86.0%, no CI published)**.
- **AgentOS on LongMemEval-M**: 70.2% [66.0%, 74.0%]. **First open-source memory library above 65% on the 1.5M-token variant.** Statistically tied with closed-source AgentBrain 71.7%.

Both numbers ship with bootstrap 95% CIs at 10,000 resamples, per-case run JSONs at `--seed 42`, judge-FPR probes (1% on S, 2% on M, 0% on LOCOMO), and per-category cost/latency breakdowns. Reproducible from a single CLI command.

## Judge FPR comparison (the variable that swings LOCOMO 30-60 pp)

| Benchmark | AgentOS judge FPR | Penfield's audit on LOCOMO default judge |
|---|---:|---:|
| LongMemEval-S | 1% [0%, 3%] | not measured |
| LongMemEval-M | 2% [0%, 5%] | not measured |
| LOCOMO | **0% [0%, 0%]** | **62.81%** |

The 62.81% FPR ceiling on LOCOMO's default `gpt-4o-mini` judge means any LOCOMO score above ~93.6% benefits from benchmark errors, and any score difference below ~6 pp sits in judge noise. AgentOS uses `gpt-4o-2024-08-06` with rubric `2026-04-18.1` which probes at 0% FPR on LOCOMO.

## What a good memory benchmark publication would include

Penfield Labs lists six requirements:

1. **Corpus size must exceed context windows.** "If the full test corpus fits in context, retrieval is optional and the benchmark cannot distinguish memory systems from context window management."
2. **Evaluation must use current-generation models.** "gpt-4o-mini as a judge introduces a ceiling on scoring precision."
3. **Judge reliability must be validated adversarially.** "When a judge accepts 63% of intentionally wrong answers, score differences below that threshold are not interpretable."
4. **Ingestion should reflect realistic use.** Conversations built through turns and corrections, not single-pass static-text ingestion.
5. **Evaluation pipelines must be standardized or fully disclosed.** "At minimum: ingestion method (and prompt if applicable), embedding model, answer generation prompt, judge model, judge prompt, number of runs, and standard deviation."
6. **Ground truth must be verified.** "A 6.4% error rate in the answer key creates a noise floor that makes small score differences uninterpretable."

Three additions from building [`agentos-bench`](https://github.com/framersai/agentos-bench):

7. **Bootstrap percentile confidence intervals on every headline.** Ten thousand resamples with a seeded PRNG. Score differences smaller than the CI gap are not signal.
8. **Per-case run artifacts at a seed.** A run JSON with `caseId`, predicted category, chosen backend, estimated cost, actual cost, actual reader output, judge score. Third parties should be able to rerun a specific case from a specific tier and get the same outcome deterministically.
9. **Cache fingerprinting that invalidates on config change.** When a routing table changes or a prompt hash bumps, the cache invalidates.

If a memory-library benchmark publication satisfies all nine, the number is trustworthy. If it satisfies fewer than five, treat the number as marketing.

## What to do with this

For developers evaluating memory libraries for their own stack, the takeaway is not "pick the vendor with the highest number." The takeaway is: ignore the headline number, read the methodology, run the benchmark yourself.

Three open-source bench frameworks exist to do that without writing your own harness:

- [**AgentOS agentos-bench**](https://github.com/framersai/agentos-bench): LongMemEval-S, LOCOMO, BEAM, plus eight cognitive-mechanism micro-benchmarks. Bootstrap CIs, judge-adversarial probes, per-stage retention metric, kill-ladder methodology, per-case run JSONs at `--seed 42`. Depth over breadth.
- [**Supermemory memorybench**](https://github.com/supermemoryai/memorybench): LoCoMo, LongMemEval, ConvoMem across Supermemory, Mem0, and Zep with multi-judge support. Breadth over depth.
- [**Mem0 memory-benchmarks**](https://github.com/mem0ai/memory-benchmarks): LOCOMO and LongMemEval against Mem0 Cloud and OSS. Mem0-specific but fully open.

For vendors publishing benchmark numbers: use one of these harnesses and publish the seed, the config, and the per-case run JSONs alongside your headline. Anything less makes your number a claim, not a measurement.

## Related

- [70.2% on LongMemEval-M (current M headline)](/blog/longmemeval-m-70-with-topk5): first open-source library above 65% on the 1.5M-token variant.
- [85.6% on LongMemEval-S (current S headline)](/blog/longmemeval-s-85-pareto-win): per-category reader routing.
- [Full benchmarks reference](https://docs.agentos.sh/benchmarks): canonical SOTA tables.

---

*All claims in this post are sourced from primary URLs visited April 24, 2026. The full audit with per-vendor transparency report cards is at [`packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md`](https://github.com/framersai/agentos-bench/blob/master/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md). The AgentOS bench implementation is open source at [`packages/agentos-bench`](https://github.com/framersai/agentos-bench).*
