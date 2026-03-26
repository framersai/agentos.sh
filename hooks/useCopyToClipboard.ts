'use client';

import { useCallback, useState } from 'react';

/**
 * Shared clipboard hook — use across all copy buttons for consistent behavior.
 * Returns `{ copied, copy }` where `copy(text)` writes to clipboard and
 * sets `copied = true` for 1.5s (matches the Toast duration).
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      } catch {
        // Fallback for older browsers / insecure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
