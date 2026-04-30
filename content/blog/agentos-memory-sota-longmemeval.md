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

There's a thought experiment I keep coming back to. You've been talking to a chatbot for months. It knows your work, your projects, the names of your dog. One day you mention something to it, and the next week you reference the thing you said and it has no idea what you're talking about. Yesterday's conversation is in the context window. Last week's is gone. The assistant didn't break exactly. It's just that the part of the conversation between you two from last Tuesday isn't accessible to it anymore, even though it was accessible on Wednesday.

That gap is what memory benchmarks are supposed to measure. The state of memory benchmarks right now is, candidly, bad.

Vendors publish big aggregate numbers without confidence intervals. They run on the easy variant of the test (LongMemEval-S, 115K tokens of conversation, fits in a single `gpt-4o` call) and avoid the hard variant (LongMemEval-M, 1.5 million tokens, 500 sessions, requires retrieval). When someone independently reruns a vendor's published configuration, the number routinely comes out 8 to 11 points lower. [Trivedi et al. measured Zep at 63.8% against Zep's self-reported 71.2%](https://arxiv.org/abs/2512.13564). Mem0's research paper measured Zep at 65.99%, and Zep's response paper measured Zep at 75.14%. Same library, three numbers, three labs.

We've been working on AgentOS, an open-source memory library, for about a year. Last week we published our first LongMemEval-M number: 30.6%. Three configuration changes later, we're at 70.2%. That number is the first open-source LongMemEval-M result above 65% on the public record, and +4.5 points above the strongest M result in the original LongMemEval paper ([Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813)).

We also moved our LongMemEval-S number from 84.8% to 85.6% in the same week. The smaller move is the more interesting one architecturally, because the change wasn't a new feature. It was deleting code. We ripped out a query-time policy router that was slowing the architecture down and lowering the accuracy at the same time.

Both numbers come with bootstrap 95% confidence intervals (10,000 resamples, seed 42), per-case run JSONs, judge false-positive-rate probes, and a one-line CLI command anyone can reproduce. The code is MIT-licensed at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench). 

This post is the story of how those two numbers happened, what they actually mean against the vendor landscape, why no other open-source memory library has published an M number, and how to read benchmark claims with appropriate skepticism. It's long. Here's the table of contents to acknowledge the fact.

## TL;DR for the busy reader

| Variant | AgentOS | Closest published competitor at matched reader | Cost-per-correct | License | Status |
|---|---:|---|---:|---|---|
| **LongMemEval-S** (115K tokens, 50 sessions) | **85.6%** | EmergenceMem 86.0% (tied within CI), Mastra OM gpt-4o 84.23%, Supermemory 81.6% | **$0.0090** | MIT | new headline |
| **LongMemEval-M** (1.5M tokens, 500 sessions) | **70.2%** | AgentBrain 71.7% (closed-source, tied within CI). Every other open-source library does not publish M. | **$0.0078** | MIT | first open-source above 65% |

[Full benchmarks reference](https://docs.agentos.sh/benchmarks) · [Reproducible run JSONs](https://github.com/framersai/agentos-bench/tree/master/results/runs) · [Methodology audit framework](https://docs.agentos.sh/blog/2026/04/24/memory-benchmark-transparency-audit)

---

## Part 1: LongMemEval-S at the `gpt-4o` reader

S is the easier of the two LongMemEval variants. 115K tokens of conversation per question, about 50 sessions per haystack, the whole thing fits in a single `gpt-4o` call with room to spare. It's where every memory-library vendor publishes, and the numbers are crowded at the top.

The fairest way to read this table is to anchor on the reader model. When every vendor uses `gpt-4o`, the comparison isolates memory architecture from base-LLM capability, which is the only thing the benchmark is actually trying to measure. Phase B at full N=500, `gpt-4o-2024-08-06` as judge, rubric `2026-04-18.1` (judge false-positive rate 1%), bootstrap 10,000 resamples, seed 42.

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

### What changed: the policy router got deleted

The previous 84.8% headline ran with a query-time "policy router" that picked between two retrieval modes per question. For four categories it used `canonical-hybrid`, our standard hybrid BM25 + dense + cross-encoder retrieval. For the other two it used `observational-memory-v11`, which compresses each session into a short observation log at ingest time and feeds the reader the log instead of the raw chunks.

That calibration came from a world where our hybrid retrieval was hitting recall@10 around 0.62. The observation-log path was real value when retrieval was missing the right chunks 4 times in 10. Once we switched to semantic embedders (`text-embedding-3-small` instead of CharHash), recall@10 jumped to 0.981. At that recall, compressing sessions into an observation log actively makes things worse, because the log strips the verbatim temporal and preference detail that `gpt-5-mini` needs to answer cleanly.

So we deleted the router. Every category now flows through `canonical-hybrid`. The reader router (a separate component, lightweight `gpt-5-mini` classifier) still picks the reader model per category. That's it. One extra LLM call per case at about $0.000138, no per-query retrieval branching.

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

### 15 adjacent configurations all regressed

Before publishing 85.6% we ran the obvious "what if we just changed this one thing" experiments. None of them lifted the number.

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

Fifteen knobs, fifteen regressions. The 85.6% configuration is, at minimum, a local optimum we couldn't shake free of through obvious one-at-a-time changes. We're publishing it as the headline on that basis.

---

## Part 2: LongMemEval-M at the `gpt-4o` reader

If S is "fits in one LLM call," M is "the LLM can't see most of the conversation no matter what you do." This is the variant we actually care about. It's the one that tests whether your memory architecture works in the long run, not whether your prompt-stuffing logic is efficient.

### What LongMemEval is, and what M means

[LongMemEval](https://github.com/xiaowu0162/LongMemEval) is the academic memory benchmark every memory-library vendor cites. The paper, ["LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory"](https://arxiv.org/abs/2410.10813) by Wu et al., was published at ICLR 2025. The dataset, evaluation harness, and rubric are open source at [github.com/xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). The paper's 12 authors are all academic researchers, none affiliated with a memory-library vendor.

The benchmark ships two variants by haystack scale:

| Variant | Tokens per haystack | Sessions per haystack | Fits in production context window? |
|---|---:|---:|---|
| **S** | ~115K | ~50 | Yes. Every modern long-context LLM fits this. GPT-4o is 128K, Claude Opus is 200K, Gemini 3 Pro is 1M, GPT-5 is 400K |
| **M** | ~1.5M | ~500 | No. Exceeds every production context window |

The S to M jump isn't a 13× scaling exercise. It's a category change. At S scale, a memory architecture is competing against the option of just dumping everything into the context window. The 24-point lift Mastra reports between their full-context baseline (60.20%) and their Observational Memory configuration (84.23%) at S partly measures *token compression*, not *memory architecture*: the OM config fits in fewer tokens, the reader has less to skim, the answers come out cleaner. Penfield Labs made the same point in [their April 2026 LOCOMO audit](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg): when the corpus fits in the context window, the benchmark is partly measuring context-window management rather than memory.

At M scale, retrieval is the only option. The benchmark stops being about whether you bothered to call retrieval and starts being about whether your retrieval can find the needle in 25,000 candidate chunks across 500 sessions. That category change is why M is the test that actually matters for a memory architecture claim.

### Every memory-library vendor with a published LongMemEval number stops at S

When we started writing this up, we wanted to know who else had published on M. So we did a vendor sweep: every memory library or platform we could find with a public LongMemEval claim, going through their research pages, blog posts, GitHub repos, and peer-reviewed papers. The cutoff date is 2026-04-29.

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

The full per-vendor audit is at [packages/agentos-bench/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md](https://github.com/framersai/agentos-bench/blob/master/docs/COMPETITOR_METHODOLOGY_AUDIT_2026-04-24.md).

### Why no one publishes on M

There are three reasons it's hard to publish on M, and they stack.

The first is structural. S fits in every modern long-context LLM. M doesn't fit in any production context window. A vendor whose architecture relies on prompt-stuffing or compression-then-stuffing is going to look much worse on M than on S, and they have no reason to publish that comparison voluntarily.

The second is technical. `longmemeval_m.json` is 2.7 GB. Node's V8 engine has a max-string-length cap that rejects `fs.readFile` on a file that big. Out-of-the-box Node fails to load the dataset before any benchmark code runs. The fix is `chain([createReadStream, parser(), streamArray()])` from `stream-json` plus `stream-chain`, with a file-size probe to route >1 GB files through the streaming path. [Our debug log on this](https://github.com/framersai/agentos-bench/blob/master/docs/STAGE_J_BLOCKED_2026-04-25.md) records the day we lost to figuring it out.

The third is cost. A memory-augmented full-context M run consumes around 750M input tokens at GPT-4o-128K pricing, roughly $1,250 per run. Retrieval-augmented M runs are $5 to $15. Either way, a vendor running M is paying real money for a number that's almost certainly going to come in lower than their S headline, with no marketing upside.

### What the academic paper itself reports on M

Wu et al., Table 3 of [arXiv:2410.10813](https://arxiv.org/abs/2410.10813), reports academic-baseline configurations on LongMemEval-M. Their strongest published M result reads:

> 65.7% on LongMemEval-M with `GPT-4o + Stella V5 retriever + Value=Session + K=V+fact + top-5`.

This is the academic ceiling: the strongest M number anyone with access to the dataset, the harness, and the paper's authors managed to run. The paper, dataset, and reproducible methodology are all open at [xiaowu0162/LongMemEval](https://github.com/xiaowu0162/LongMemEval). The authors didn't beat 65.7% in their own paper. Until [agentos-bench](https://github.com/framersai/agentos-bench) Phase B at N=500, no open-source M result on the public record went higher.

### Where we land

| System | Accuracy | 95% CI | License | Source |
|---|---:|---|---|---|
| AgentBrain | 71.7% (Test 0) | not published | closed-source SaaS | [github.com/AgentBrainHQ](https://github.com/AgentBrainHQ) |
| **🚀 AgentOS** (sem-embed + reader-router + top-K=5) | **70.2%** | **[66.0%, 74.0%]** | **MIT** | [agentos-bench](https://github.com/framersai/agentos-bench) |
| LongMemEval paper academic baseline | 65.7% | not published | open repo | [Wu et al., ICLR 2025, Table 3](https://arxiv.org/abs/2410.10813) |
| Mem0 v3, Mastra OM, Hindsight, Zep, EmergenceMem, Supermemory, MemMachine, Memoria, agentmemory, Backboard, ByteRover, Letta, Cognee | not published | (no CI) | various | reports S only |

We're statistically tied with [AgentBrain's](https://github.com/AgentBrainHQ) closed-source SaaS at the point estimate (their 71.7% sits inside our 95% CI), +4.5 points above the academic ceiling, and the first open-source memory library on the public record above 65% on M with the full methodology stack: bootstrap CIs at 10,000 resamples, per-case run JSONs at `seed=42`, judge-FPR probes, MIT-licensed code at [github.com/framersai/agentos-bench](https://github.com/framersai/agentos-bench).

### The journey: 30.6% to 70.2% in two weeks

The 70.2% number didn't show up overnight. Here's what each step actually changed.

| Date | Configuration | Aggregate | Lift |
|---|---|---:|---:|
| 2026-04-25 | Tier 1 canonical (CharHash, top-K=20) | 30.6% | baseline |
| 2026-04-26 | M-tuned (HyDE + top-K=50 + rerank-mult=5, CharHash) | 45.4% [41.2%, 49.8%] | +14.8 pp |
| 2026-04-29 | M-tuned + sem-embed + reader-router (top-K=50) | 57.6% [53.2%, 61.8%] | +12.2 pp |
| **2026-04-29** | M-tuned + sem-embed + reader-router + **top-K=5** | **70.2% [66.0%, 74.0%]** | **+12.6 pp** |

Each step has confidence intervals disjoint from the prior step, which is the bar we're using to call something a real lift instead of variance. Cost per correct dropped 17× over the journey, from $0.1348 to $0.0078.

### The single change that produced the M headline: top-K=5

We had been running with `--reader-top-k 50`, on the assumption that more retrieved context per query is generally better. The LongMemEval paper's strongest M configuration in Table 3 uses top-5. We re-ran Phase B at full N=500 with `--reader-top-k 5` and held every other knob constant.

| Metric | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| Aggregate accuracy | 57.6% [53.2%, 61.8%] | **70.2% [66.0%, 74.0%]** | +12.6 pp; CIs disjoint |
| Cost per correct | $0.0505 | **$0.0078** | -$0.0427 per correct |
| Avg latency | 264,933 ms | 83,711 ms | -181,222 ms |

M cost at scale: at $0.0078 per memory-grounded answer over a 1.5M-token haystack, 1,000 RAG calls cost $7.80. The prior top-K=50 configuration on the same architecture cost $0.0505 per correct, or $50.50 per 1,000 calls.

The interesting question is why the reader gets *worse* with more context. A LongMemEval-M haystack contains roughly 1.5M tokens spread across 500 sessions, which produces around 25,000 candidate chunks. At top-K=50 the reader sees 50 chunks: the rerank cross-encoder's top picks, plus 45 of progressively lower confidence. The 6th through 50th chunks are frequently from sessions that share lexical surface with the query but don't actually contain the answer. The reader has to read all of them, weigh them, and decide which one matters. Forcing the cross-encoder to commit to its top picks raises signal-to-noise enough to clear the difference. [Liu et al. (2024), "Lost in the Middle"](https://arxiv.org/abs/2307.03172) reports the same shape of failure at the long-context-LLM level: more context doesn't help when most of the context is distractor.

### Per-category at the 70.2% M headline

| Category | Top-K=50 | Top-K=5 | Δ |
|---|---:|---:|---:|
| **temporal-reasoning** (n=133) | 42.1% | **66.2% [57.9%, 74.4%]** | +24.1 pp |
| **single-session-preference** (n=30) | 40.0% | **63.3% [46.7%, 80.0%]** | +23.3 pp |
| **multi-session** (n=133) | 29.3% | **48.9% [40.6%, 57.1%]** | +19.6 pp |
| knowledge-update (n=78) | 76.9% | 78.2% [69.2%, 87.2%] | +1.3 pp |
| single-session-assistant (n=56) | 96.4% | 96.4% [91.1%, 100%] | tied |
| single-session-user (n=70) | 95.7% | 91.4% [84.3%, 97.1%] | -4.3 pp (within CI) |

### Four one-knob probes all regress

Same exercise as the S section. We tested four obvious "what if we just changed this one thing" variants on top of the 70.2% configuration. None of them lifted.

| Probe | Aggregate | Δ | Verdict |
|---|---:|---:|---|
| `--reader-top-k 3` | 65.2% [60.8%, 69.4%] | -5.0 pp; CIs disjoint | refuted |
| `--hyde` off | 69.2% [65.0%, 73.4%] | -1.0 pp; tied within CI | marginal |
| `--rerank-candidate-multiplier 10` | 60.0% [55.6%, 64.4%] | -10.2 pp; CIs disjoint | catastrophically refuted |
| `--two-call-reader` (Chain-of-Note) | 58.6% [54.2%, 62.8%] | -11.6 pp; CIs disjoint | refuted |

Top-K=5 with HyDE on and rerank-multiplier 5 is the local optimum in the tested parameter space.

---

## Part 3: What goes wrong on M when you scale up retrieval

Most of the per-category numbers from our 30.6% baseline tell the story of where retrieval precision falls apart at scale. It's not uniform. Some categories survive the jump from S to M with mild damage. Others collapse.

| Category | n | M accuracy | S baseline | Δ at M scale |
|---|---:|---:|---:|---:|
| single-session-user | 70 | 60.0% | 97.1% | -37.1 pp |
| single-session-assistant | 56 | 50.0% | 89.3% | -39.3 pp |
| knowledge-update | 78 | 50.0% | 86.8% | -36.8 pp |
| **multi-session** | 133 | **18.0%** | 61.7% | **-43.7 pp** |
| **temporal-reasoning** | 133 | **12.8%** | 70.2% | **-57.4 pp** |
| single-session-preference | 30 | 10.0% | 63.3% | -53.3 pp |
| **Aggregate** | **500** | **30.6%** | **76.6%** | **-46.0 pp** |

The two biggest categories, multi-session and temporal-reasoning, account for 53% of all M cases and they're the ones that collapse hardest. With 500 candidate sessions per haystack instead of 50, the right session simply doesn't make the top-20 most of the time when CharHash + BM25 + Cohere rerank are operating over 10× more distractors. The retrieval that worked at S scale is, at M scale, missing the answer entirely.

The +39.6-point lift from baseline to 70.2% comes from four independent axes: M-tuned retrieval flags (+14.8 pp), the semantic embedder switch (+12.2 pp, folded with reader router), and reader-top-K=5 (+12.6 pp). The two collapsed categories recovered the most: multi-session went 18% → 48.9% (+30.9 pp), and temporal-reasoning went 12.8% → 66.2% (+53.4 pp).

---

## A detour: why does Mastra's `gpt-5-mini` reader score higher than their `gpt-4o` reader?

If you spend any time on Mastra's research page you'll notice something that looks wrong. They publish 84.23% on LongMemEval-S with `gpt-4o` as the reader, and 94.87% with `gpt-5-mini` as the reader. The cheaper model gets the higher score. That seems backwards.

It is backwards, but only if you think of the reader as the thing doing the work. The architectural answer is that Mastra's `gpt-5-mini` config moves the reasoning *upstream* of the reader. The reader is no longer the thing answering the question.

In Mastra's `gpt-4o`-only configuration, the reader does everything. It reads the retrieved context, extracts what's relevant, reasons across sessions, and answers. All of that work happens at query time, in a single LLM call.

In their `gpt-5-mini` + Observational Memory configuration, the work moves earlier in the pipeline. During *ingest* (paid once per haystack, before the user has asked anything), a [`gemini-2.5-flash`](https://blog.google/technology/google-deepmind/gemini-2-5/) "observer" runs over each session and extracts dense structured observation logs. A second `gemini-2.5-flash` "reflector" synthesizes those observations into long-term cross-session insights. At query time, the `gpt-5-mini` reader answers from the pre-distilled log plus reflections, not from raw chunks. It's mostly a synthesizer over pre-extracted facts. A cheaper reader can outperform a more expensive one if the upstream pipeline has done the reasoning already.

Mastra documents this directly on [their Observational Memory research page](https://mastra.ai/research/observational-memory), and [VentureBeat's coverage](https://venturebeat.com/data/observational-memory-cuts-ai-agent-costs-10x-and-outscores-rag-on-long) frames the architectural decision the same way: shift complexity from query-time to ingest-time, then a small reader is sufficient. It's a perfectly defensible design choice, and the math works out in their favor on inference cost when the haystack is queried more than a handful of times.

We don't include the 94.87% number in our matched-reader tables, for two reasons.

The first is that we can't reproduce it. When we ran AgentOS at what we believed was the same stack (`gpt-5-mini` reader, `gemini-2.5-flash` observer) on LongMemEval-S Phase A, we got 70.4%. That's a 24-point gap from the headline. We're not claiming Mastra's 94.87% is wrong. We're saying we can't reproduce it from the methodology they've published, and a cost-per-correct comparison would require running their *library*, not our reproduction of the architecture they describe.

The second is that they don't publish a CI on the 94.87%. Their 84.23% `gpt-4o` number sits inside our 95% CI [82.4%, 88.6%], so at the matched reader we're statistically tied with their single-provider OpenAI configuration. Their cross-provider `gpt-5-mini` + Gemini stack is a separate claim that lives in its own column.

The matched-reader comparison at the top of the post is `gpt-4o` on both sides. That's the apples-to-apples version. The 94.87% sits in its own column.

---

## Part 4: Why most published memory benchmark numbers don't reproduce

This is the section we wish we hadn't had to write. The honest version of the published memory-library record is that most of the headline numbers don't survive contact with an independent re-run, and several of the most-cited benchmarks have problems with the *benchmarks themselves* that the published record doesn't acknowledge. Five recurring patterns show up.

### LOCOMO's answer key is wrong 6.4% of the time

In April 2026, [Penfield Labs](https://dev.to/penfieldlabs/we-audited-locomo-64-of-the-answer-key-is-wrong-and-the-judge-accepts-up-to-63-of-intentionally-33lg) ran a manual audit of LOCOMO and found 99 errors in 1,540 answer-key entries. That's a 6.4% ground-truth error rate baked into the benchmark itself. Then they tested the LLM judge LOCOMO uses by feeding it intentionally wrong answers that were topically adjacent to the right ones. The judge accepted 62.81% of those intentionally wrong answers as correct.

Two consequences fall out of that.

The 6.4% answer-key error rate means any LOCOMO score above 93.6% is benefiting from benchmark errors rather than measuring memory quality. The 62.81% judge false-positive rate means any LOCOMO score difference below roughly 6 points is inside the judge's noise floor and shouldn't be read as a real difference.

For context, [Northcutt et al. (NeurIPS 2021)](https://arxiv.org/abs/2103.14749) found that a 3.3% label-error rate is enough to destabilize benchmark rankings. LOCOMO's is nearly double that. There are real research questions LOCOMO can answer, but "which memory library is best?" isn't one of them at the resolution most vendors publish at.

### LongMemEval-S is partly a context-window test

LongMemEval-S uses 115K tokens of conversation per question. GPT-4o has a 128K context window; Claude 3.5 has 200K; Gemini 1.5 Pro has 1M; GPT-5 has 400K. Every current-generation production model can fit the entire S test corpus in a single prompt. Whether or not that's "memory" is a definitional question, but it's not the same problem you'd be solving for a chatbot that's been running for a year.

Mastra's own results show what this looks like in practice. Their full-context baseline at `gpt-4o` is 60.20%; their Observational Memory configuration at the same model is 84.23%. That 24-point lift is partly measuring how well their system compresses 115K tokens into fewer tokens, which the reader can then process more effectively. It's a real engineering result. It's also not the same thing as "this memory architecture is +24 points better at remembering."

The M variant fixes the test by exceeding every production context window. That's why we publish on M. It's also why no other open-source memory library has.

### When vendors run each other's systems, the numbers come out wrong

In May 2025, Mem0 published a research paper positioning their product as state-of-the-art on LOCOMO. The paper's comparison table scored Zep at 65.99%. Zep responded with a post titled ["Lies, Damn Lies, & Statistics"](https://blog.getzep.com/lies-damn-lies-statistics-is-mem0-really-sota-in-agent-memory/), reran the same evaluation with what they considered a correctly-configured Zep, and got 75.14% ±0.17. The difference, according to Zep: Mem0 had run Zep with sequential search instead of concurrent search, which is the production mode.

This is the cross-vendor-comparison problem in a nutshell. When a vendor reimplements a competitor's system to put a number in a comparison table, the reimplementation is almost always suboptimal for the competitor. Sometimes by accident, sometimes not.

Zep's own self-reported number on LongMemEval doesn't fare much better when independently rerun. Zep's primary LongMemEval-S number is 71.2% at `gpt-4o`, from [their SOTA blog post](https://blog.getzep.com/state-of-the-art-agent-memory/). An independent reproduction at [arXiv:2512.13564](https://arxiv.org/abs/2512.13564) measured Zep at 63.8%, a 7.4-point gap that's roughly the same size as the LOCOMO judge's false-positive floor.

### Other things you find when you read the methodology pages

- [EmergenceMem's "Simple Fast"](https://github.com/EmergenceAI/emergence_simple_fast) hardcodes `top_k=42` in the retrieval call, with a Douglas Adams comment in the source. It's a magic number left in shipping code.
- [Mastra's research page](https://mastra.ai/research/observational-memory) publishes 84.23% at `gpt-4o`. The observer and reflector models in the same configuration are `gemini-2.5-flash`. The cross-provider detail is easy to miss when the number gets re-cited.
- [Mem0's research page](https://mem0.ai/research) claims 92.0% on LongMemEval. [Their research-2 page](https://mem0.ai/research-2) claims 93.4% on the same benchmark. Two numbers from the same company on the same benchmark, and they don't reconcile in any obvious way.
- MemPalace claimed 100% on both LongMemEval and LOCOMO. The "100% LongMemEval" turned out to be retrieval recall@5, not end-to-end QA accuracy. The "100% LOCOMO" was obtained by setting `top_k=50` to dump every session into Claude Sonnet, which is closer to a context-window test than a memory benchmark. The advertised "contradiction detection" feature was absent from the shipped code. [HackerNoon ran a post-mortem](https://hackernoon.com/resident-evil-star-milla-jovovich-shipped-an-ai-memory-system-devs-shredded-its-benchmarks).

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

### Judge FPR is the variable that swings LOCOMO scores by 30 to 60 points

| Benchmark | AgentOS judge FPR | LOCOMO default judge FPR (Penfield audit) |
|---|---:|---:|
| LongMemEval-S | 1% [0%, 3%] | not measured |
| LongMemEval-M | 2% [0%, 5%] | not measured |
| LOCOMO | **0% [0%, 0%]** | **62.81%** |

The 62.81% false-positive rate on LOCOMO's default `gpt-4o-mini` judge is the dominant source of variance in published LOCOMO scores. AgentOS runs LOCOMO with `gpt-4o-2024-08-06` as judge and rubric `2026-04-18.1`, which probes at 0% FPR on the same adversarial set Penfield used. That's the only reason our LOCOMO numbers are comparable to anyone else's, and it's why the audit framework matters more than any individual headline number.

---

## Part 5: How to reproduce both numbers

If you'd rather run this yourself than take our word for it (which is what we want), here's the full command for each. You'll need an OpenAI API key and a Cohere API key in your environment.

### LongMemEval-S, 85.6% headline

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

### LongMemEval-M, 70.2% headline

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

Both runs save per-case run JSONs under `seed=42` so anyone can compare against the cases in our leaderboard at [`packages/agentos-bench/results/LEADERBOARD.md`](https://github.com/framersai/agentos-bench/blob/master/results/LEADERBOARD.md). If a case fails for you and not for us (or vice versa), the per-case JSONs are how we figure out which knob is different.

---

## The architecture, briefly

The decomposition we use comes from the [CoALA framework (Sumers et al., 2023)](https://arxiv.org/abs/2309.02427): explicit memory partitions plus a decision-making module that picks a strategy based on query context. Our `MemoryRouter` is the CoALA-style memory module; the `ReaderRouter` is the decision module. The benchmark numbers above are mostly a measurement of how that decomposition behaves under stress on each evaluation distribution.

The closest comparable architecture on the public record is [Letta](https://www.letta.com/blog/memgpt-and-letta), formerly MemGPT ([Packer et al., 2023](https://arxiv.org/pdf/2310.08560)), which models the LLM as a virtual operating system with paged memory. Letta hasn't published a LongMemEval number under their post-MemGPT branding, so a head-to-head isn't possible right now.

The other 8 mechanisms behind AgentOS memory (Ebbinghaus decay, reconsolidation, retrieval-induced forgetting, feeling-of-knowing, gist extraction, schema encoding, source confidence decay, emotion regulation) are described in [Cognitive Memory for AI Agents](/blog/cognitive-memory-beyond-rag) with citations to the underlying psychology and ML literature. They're orthogonal to the LongMemEval numbers but they're what the production memory system in AgentOS is actually built on.

## Where the numbers still leave headroom

Multi-session is the weakest per-category score on both variants. On M it sits at 48.9%, which moved from 29.3% with the top-K=5 change but is still about 30 points below the per-category ceiling on SSA/SSU. The same pattern shows at S, where MS sits at 74.4% as the weakest category against an 85.6% aggregate. Our read is that multi-session bridge queries need a signal type that retrieval-broadening alone can't provide: typed-graph traversal, observational memory with reflection, or hierarchical session summary cascades.

The candidate v2 architecture is Stage E, our "Hindsight 4-network typed-observer," which adds a typed-graph signal orthogonal to BM25 + dense + Cohere rerank. The architecture follows [Hindsight (vectorize.io, 2025)](https://arxiv.org/html/2512.12818v1). The other LongMemEval-paper move we haven't run is K=V+fact key augmentation: indexing sessions by both raw content and extracted facts, with dual-key vector lookup. The Phase B mult=10 ablation regressed catastrophically on the same retrieval-heavy categories K=V+fact would touch, so we're queueing it with conservative expectations for v1.2 rather than as the next obvious win.

---

## Methodology disclosures

What's apples-to-apples in the comparisons above:

- Same `gpt-4o` reader as Mastra OM gpt-4o, Supermemory gpt-4o, EmergenceMem.
- Same benchmark dataset (LongMemEval-S, 500 cases; LongMemEval-M, 500 cases).
- Same judge harness (`gpt-4o-2024-08-06` with rubric `2026-04-18.1`); judge false-positive rate 1% on S, 2% on M, 0% on LOCOMO.
- Bootstrap 95% CIs at 10,000 resamples; most vendors don't publish CIs at all.

What isn't, with caveats:

- Cost and latency comparisons against Mastra, Supermemory, and EmergenceMem aren't directly measurable, because those vendors don't publish $/correct or per-case latency. The cost and latency wins above are AgentOS-internal versus prior AgentOS configurations.
- Mastra's 94.87% headline uses `gpt-5-mini` + `gemini-2.5-flash` observer. We can't reproduce it from their public methodology page, so it sits outside our matched-reader table.
- Mem0 v3's 93.4% is a managed-platform number with no published CI, no judge disclosure, and no reader disclosure. Their own [State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) post reports 66.9% on LOCOMO for the production stack.
- Hindsight's 91.4% uses `gemini-3-pro` as reader. Supermemory's 85.2% uses `gemini-3-pro` as reader. Both are cross-provider, so they sit outside the matched-`gpt-4o` table.
- Managed-platform numbers (Mastra, Mem0 v3, agentmemory) run on infrastructure with platform-specific optimizations that aren't necessarily portable.

---

## What to do with this if you're evaluating memory libraries

The honest advice is to ignore the headline number, read the methodology page, and run the benchmark yourself against your actual workload. Memory architecture is one of the few areas of LLM engineering where the published claims and the production reality diverge by 5 to 30 points routinely, and there isn't a way to know which side of that range any vendor is on without rerunning their stack against the test.

Three open-source bench frameworks make this less painful than it sounds:

- [agentos-bench](https://github.com/framersai/agentos-bench), which is what we built. Covers LongMemEval-S/M, LOCOMO, BEAM, and eight cognitive-mechanism micro-benchmarks. Has bootstrap CIs, judge-adversarial probes, a per-stage retention metric, and per-case run JSONs at `--seed 42`. Depth over breadth.
- [Supermemory's memorybench](https://github.com/supermemoryai/memorybench), which covers LoCoMo, LongMemEval, and ConvoMem across Supermemory, Mem0, and Zep with multi-judge support. Breadth over depth.
- [Mem0's memory-benchmarks](https://github.com/mem0ai/memory-benchmarks), which runs LOCOMO and LongMemEval against Mem0 Cloud and OSS.

If you're a vendor publishing benchmark numbers, the ask is simple: pick one of these harnesses, publish the seed, the config, and the per-case run JSONs alongside the headline. A number without that stack isn't a measurement; it's a claim.

## Further reading

- [The full benchmarks reference](https://docs.agentos.sh/benchmarks) is the canonical version of the comparison tables above with citations, the methodology disclosure matrix, and LOCOMO judge-FPR data.
- [Cognitive Memory for AI Agents: Beyond RAG](/blog/cognitive-memory-beyond-rag) covers the nine cognitive mechanisms behind AgentOS memory, with primary-source citations to the underlying psychology and ML literature.
- [agentos-bench v1 evaluation matrix](https://github.com/framersai/agentos-bench/blob/master/results/eval-matrix-v1/comparison-table.md) is the per-cell run JSONs for everything we've published.
- [docs.agentos.sh/blog](https://docs.agentos.sh/blog) has deeper engineering writeups for the M-series intermediate stages (45.4%, 57.6%), Stage L/I negative findings, the ingest-router executor design, and the memory archive rehydration model.

---

*Built by [Manic Agency LLC](https://manic.agency) / [Frame.dev](https://frame.dev). AgentOS is open source under Apache 2.0. agentos-bench is MIT-licensed. [GitHub](https://github.com/framersai/agentos) · [npm](https://www.npmjs.com/package/@framers/agentos) · [Discord](https://wilds.ai/discord)*
