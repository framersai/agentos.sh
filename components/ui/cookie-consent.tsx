'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('agentos-consent');
    if (!consent) {
      // Delay slightly to not block initial paint
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('agentos-consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-[var(--color-background-primary)] p-4 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-accent-primary font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Privacy & Cookies
              </div>
              <button 
                onClick={() => setShow(false)}
                className="text-muted hover:text-primary"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              We use cookies to analyze traffic and improve your experience. 
              Since we use GitHub Pages, no personal data is stored on our servers.
            </p>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 py-2 px-4 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] text-xs font-bold rounded-lg transition-colors shadow-md"
                style={{ color: 'hsl(0, 0%, 100%)' }}
                aria-label="Accept all cookies"
              >
                Accept All
              </button>
              <button
                onClick={() => setShow(false)}
                className="flex-1 py-2 px-4 bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] text-xs font-bold rounded-lg transition-colors"
                aria-label="Decline cookies"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

