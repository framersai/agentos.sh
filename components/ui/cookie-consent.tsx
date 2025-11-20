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
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="glass-morphism p-4 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-3">
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
                className="flex-1 py-2 px-4 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => setShow(false)}
                className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-lg transition-colors border border-white/10"
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

