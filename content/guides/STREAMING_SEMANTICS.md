# Streaming Semantics

AgentOS exposes multiple streaming surfaces on `agency().stream(...)` because
the raw live output and the finalized approved answer are not always the same.

## Which Stream Should You Use?

- `textStream`
  - Raw live text chunks.
  - Lowest latency.
  - May differ from the final approved answer after guardrails or HITL.
- `fullStream`
  - Structured event stream.
  - Includes live text/tool/lifecycle events plus late approval and
    finalization events.
- `text`
  - Finalized scalar text after post-processing.
- `finalTextStream`
  - Finalized-text iterable.
  - Emits only the approved final text.
- `usage`
  - Finalized usage totals for the streamed run.
- `agentCalls`
  - Finalized per-agent execution ledger.
- `parsed`
  - Final structured payload when `output` is configured.

## Example

```ts
const stream = team.stream('Draft the answer');

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk); // raw live text
}

for await (const chunk of stream.finalTextStream) {
  console.log('approved:', chunk); // finalized text only
}

for await (const part of stream.fullStream) {
  if (part.type === 'final-output') {
    console.log(part.text);
    console.log(part.usage.totalTokens);
  }
}
```

## Important Distinction

If you enable output guardrails or `beforeReturn` HITL approval:

- `textStream` can show text that is later rewritten
- `text` and `finalTextStream` are the truthful finalized answer
- `fullStream` shows both the raw path and the final approval/finalization
  events

## Practical Default

- Use `textStream` for fast chat UIs
- Use `finalTextStream` when the client should only ever see approved output
- Use `fullStream` for tooling, traces, audits, and workbench-style UIs
