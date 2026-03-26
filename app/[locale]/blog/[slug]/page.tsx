'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

/** Required for `output: 'export'` — no blog posts are statically generated here. */
export function generateStaticParams() {
  return [];
}

export default function BlogPostRedirect() {
  const params = useParams();
  const slug = params?.slug || '';

  useEffect(() => {
    window.location.replace(`https://docs.agentos.sh/blog/${slug}`);
  }, [slug]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-text-secondary, #888)' }}>
        Redirecting to <a href={`https://docs.agentos.sh/blog/${slug}`}>docs.agentos.sh/blog</a>...
      </p>
    </div>
  );
}
