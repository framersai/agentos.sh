'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { shouldRenderImmediately } from '@/lib/ui/lazy-visible-policy';

/**
 * Renders `fallback` (a skeleton) until the boundary nears the viewport, then
 * mounts `children`. Defers the children's JS chunk past hydration so heavy
 * below-fold sections (syntax highlighter, framer-motion) stay off the initial
 * critical path. SSR / no-IntersectionObserver renders children immediately so
 * the static export still contains the content for crawlers.
 */
export function LazyVisible({
  children,
  fallback,
  rootMargin = '200px',
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}) {
  const eager =
    typeof window === 'undefined' ||
    shouldRenderImmediately({
      hasWindow: typeof window !== 'undefined',
      hasIO: typeof IntersectionObserver !== 'undefined',
      saveData: false,
    });
  const [show, setShow] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [show, rootMargin]);

  if (show) return <>{children}</>;
  return <div ref={ref}>{fallback}</div>;
}
