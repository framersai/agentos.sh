"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, ExternalLink, ArrowRight } from "lucide-react";

interface DocSearchProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

/**
 * Lightweight search trigger that opens docs.agentos.sh search.
 * The marketing site doesn't host search indexes — full search lives on the docs site.
 */
export function DocSearch({ triggerClassName, triggerLabel }: DocSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Keyboard shortcut: / or Ctrl+K opens the modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  const goToDocSearch = useCallback(() => {
    const q = query.trim();
    // Docusaurus local-search uses hash-based search
    window.open(
      q ? `https://docs.agentos.sh/?q=${encodeURIComponent(q)}` : "https://docs.agentos.sh/",
      "_blank",
    );
    setOpen(false);
    setQuery("");
  }, [query]);

  const quickLinks = [
    { label: "Getting Started", href: "https://docs.agentos.sh/getting-started/high-level-api" },
    { label: "Agency API", href: "https://docs.agentos.sh/features/agency-api" },
    { label: "Emergent Capabilities", href: "https://docs.agentos.sh/features/emergent-capabilities" },
    { label: "Voice Pipeline", href: "https://docs.agentos.sh/features/voice-pipeline" },
    { label: "API Reference", href: "https://docs.agentos.sh/api/" },
  ];

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
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery(""); } }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-background-primary, #0f0a1a)",
              borderColor: "var(--color-border-primary, rgba(99,102,241,0.2))",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--color-border-primary, rgba(99,102,241,0.1))" }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-muted, #666)" }} />
              <input
                autoFocus
                type="text"
                placeholder="Search docs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") goToDocSearch(); }}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--color-text-primary, #e0e7ff)" }}
              />
              <kbd
                className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{
                  backgroundColor: "var(--color-background-secondary, rgba(255,255,255,0.05))",
                  color: "var(--color-text-muted, #666)",
                  border: "1px solid var(--color-border-primary, rgba(99,102,241,0.15))",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Quick links */}
            <div className="px-2 py-2">
              <p
                className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest"
                style={{ color: "var(--color-text-muted, #555)" }}
              >
                Quick links
              </p>
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: "var(--color-text-primary, #e0e7ff)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-background-secondary, rgba(99,102,241,0.08))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={() => { setOpen(false); setQuery(""); }}
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              ))}
            </div>

            {/* Search button */}
            <div className="px-3 pb-3">
              <button
                onClick={goToDocSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent-primary, #6366f1), var(--color-accent-secondary, #8b5cf6))",
                  color: "#fff",
                }}
              >
                {query.trim() ? `Search "${query.trim()}" on docs` : "Open full docs"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocSearch;
