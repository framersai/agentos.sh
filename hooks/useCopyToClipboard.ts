'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Shared clipboard hook -- use across all copy buttons for consistent behavior.
 * Returns `{ copied, copy }` where `copy(text)` writes to clipboard and
 * sets `copied = true` for {@link resetMs} (default 1500ms).
 *
 * Tries `navigator.clipboard.writeText` first, then falls back to a hidden
 * textarea + `document.execCommand('copy')` for insecure contexts or older
 * browsers. Shows the "copied" indicator regardless so the user always gets
 * visual feedback.
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      // Clear any pending reset timer so rapid clicks don't flicker
      if (timerRef.current) clearTimeout(timerRef.current);

      let success = false;

      // Primary path: Clipboard API (requires secure context)
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch {
          // Falls through to textarea fallback
        }
      }

      // Fallback: hidden textarea + execCommand (works in non-secure contexts)
      if (!success && typeof document !== 'undefined') {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          success = true;
        } catch {
          // Both paths failed -- still show feedback below
        }
      }

      // Always show visual feedback so the user knows the click registered
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), resetMs);
    },
    [resetMs],
  );

  return { copied, copy };
}
