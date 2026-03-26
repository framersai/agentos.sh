"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, ExternalLink, FileText } from "lucide-react";

interface DocSearchProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

interface SearchDoc {
  title: string;
  url: string;
  content?: string;
}

const DOCS_BASE = "https://docs.agentos.sh";

/**
 * Search modal that fetches the docs.agentos.sh search index on first open,
 * then filters results inline as you type. Falls back to curated quick links
 * if the index fails to load.
 */
export function DocSearch({ triggerClassName, triggerLabel }: DocSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const fetchedRef = useRef(false);

  // Keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const input = document.activeElement?.tagName;
      if (input === "INPUT" || input === "TEXTAREA") return;
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  // Fetch docs search index on first open
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);

    // Docusaurus local-search plugin stores its index at this path
    fetch(`${DOCS_BASE}/search-index.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        // The index format varies — handle both array and object shapes
        const entries: SearchDoc[] = [];
        if (Array.isArray(data)) {
          for (const item of data) {
            entries.push({
              title: item.title || item.t || item.name || "",
              url: item.url || item.u || item.href || "",
              content: item.content || item.c || item.body || item.description || "",
            });
          }
        } else if (data.documents) {
          for (const doc of data.documents) {
            entries.push({
              title: doc.title || doc.t || "",
              url: doc.url || doc.u || "",
              content: doc.content || doc.body || "",
            });
          }
        }
        setDocs(entries.filter((d) => d.title && d.url));
      })
      .catch(() => {
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [open]);

  // Fallback curated list when index fetch fails
  const fallbackDocs: SearchDoc[] = useMemo(() => [
    { title: "High-Level API", url: "/getting-started/high-level-api", content: "generateText streamText generateImage agent provider" },
    { title: "Multi-Agent Agency API", url: "/features/agency-api", content: "agency dependsOn graph sequential parallel hierarchical" },
    { title: "Emergent Capabilities", url: "/features/emergent-capabilities", content: "forge tool sandbox compose LLM judge tiered" },
    { title: "Voice Pipeline", url: "/features/voice-pipeline", content: "voice stt tts vad barge-in endpoint detection telephony" },
    { title: "Capability Discovery", url: "/features/capability-discovery", content: "discovery semantic tier token reduction embedding" },
    { title: "System Architecture", url: "/architecture/system-architecture", content: "diagram gmi orchestrator runtime components" },
    { title: "Cognitive Memory", url: "/features/cognitive-memory", content: "ebbinghaus decay working memory baddeley consolidation" },
    { title: "Guardrails", url: "/features/guardrails", content: "pii redaction content filter guardrail pipeline" },
    { title: "Provenance & Immutability", url: "/features/provenance-immutability", content: "provenance audit ledger tombstone signed event" },
    { title: "workflow() DSL", url: "/features/workflow-dsl", content: "workflow steps DAG pipeline yaml checkpointing" },
    { title: "Deep Research", url: "/features/deep-research", content: "deep research query classification multi-source" },
    { title: "Speech Providers", url: "/features/speech-providers", content: "deepgram whisper elevenlabs speech provider catalog" },
    { title: "Telephony Providers", url: "/features/telephony-providers", content: "twilio telnyx plivo telephony call webhook" },
    { title: "Extensions Overview", url: "/extensions/overview", content: "extension catalog registry channel adapter" },
    { title: "Evaluation Framework", url: "/features/evaluation-framework", content: "eval benchmark grader candidate experiment" },
    { title: "API Reference", url: "/api/", content: "typedoc api reference class interface" },
  ], []);

  const searchableIndex = docs.length > 0 ? docs : fallbackDocs;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return searchableIndex
      .map((doc) => {
        const t = doc.title.toLowerCase();
        const c = (doc.content || "").toLowerCase();
        let score = 0;
        if (t === q) score += 200;
        else if (t.startsWith(q)) score += 100;
        else if (t.includes(q)) score += 60;
        if (c.includes(q)) score += 25;
        // Boost for each word match
        for (const word of q.split(/\s+/)) {
          if (word.length < 2) continue;
          if (t.includes(word)) score += 15;
          if (c.includes(word)) score += 5;
        }
        return { doc, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((r) => r.doc);
  }, [query, searchableIndex]);

  useEffect(() => { setSelectedIndex(0); }, [results]);

  const navigate = useCallback((doc: SearchDoc) => {
    const url = doc.url.startsWith("http") ? doc.url : `${DOCS_BASE}${doc.url}`;
    window.open(url, "_blank");
    setOpen(false);
    setQuery("");
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = results;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[selectedIndex]) navigate(items[selectedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }, [results, selectedIndex, navigate, query, fallbackDocs]);

  const displayItems = results.length > 0 ? results : [];

  const hint = loading
    ? "Loading..."
    : results.length > 0
      ? `${results.length} result${results.length > 1 ? "s" : ""}`
      : "";

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? "inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"}
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        title="Search (/ or Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        {triggerLabel ? triggerLabel : null}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery(""); } }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-background-primary, #0f0a1a)",
              borderColor: "var(--color-border-primary, rgba(99,102,241,0.2))",
            }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
              <Search className="w-4 h-4 shrink-0 opacity-40" />
              <input
                autoFocus
                type="text"
                placeholder="Search docs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--color-text-primary, #e0e7ff)" }}
              />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono opacity-40 border" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {displayItems.length > 0 ? (
                <div className="px-2 py-1.5">
                  <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest opacity-40">
                    {hint}
                  </p>
                  {displayItems.map((doc, i) => (
                    <button
                      key={doc.url}
                      onClick={() => navigate(doc)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors"
                      style={{
                        color: "var(--color-text-primary, #e0e7ff)",
                        backgroundColor: i === selectedIndex ? "rgba(99,102,241,0.1)" : "transparent",
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0 opacity-40" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{doc.title}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-20" />
                    </button>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="px-4 py-6 text-center text-sm opacity-40">
                  No results for &ldquo;{query.trim()}&rdquo;
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t flex items-center gap-4 text-[10px] opacity-30" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
              <span><kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "rgba(99,102,241,0.15)" }}>↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "rgba(99,102,241,0.15)" }}>↵</kbd> open</span>
              <span><kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "rgba(99,102,241,0.15)" }}>esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocSearch;
