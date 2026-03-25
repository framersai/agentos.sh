'use client';

import { useEffect } from 'react';

export default function BlogRedirect() {
  useEffect(() => {
    window.location.replace('https://docs.agentos.sh/blog');
  }, []);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-text-secondary, #888)' }}>
        Redirecting to <a href="https://docs.agentos.sh/blog">docs.agentos.sh/blog</a>...
      </p>
    </div>
  );
}
