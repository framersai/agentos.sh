'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';

interface ParticleMorphTextProps {
  words: [string, string];
  className?: string;
  interval?: number;
  fontSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
  startIndex?: number;
}

/**
 * ParticleMorphText - High-performance particle text with SEO-friendly fallback
 */
export const ParticleMorphText = memo(function ParticleMorphText({
  words,
  className = '',
  interval = 1800,
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ wordIdx: startIndex, phase: 0, progress: 0, lastSwitch: 0 });
  const particlesRef = useRef<{ x: number; y: number; ox: number; oy: number; tx: number; ty: number; r: number; c: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  const width = Math.ceil(Math.max(words[0].length, words[1].length) * fontSize * 0.58);
  const height = Math.ceil(fontSize * 1.2);

  const hexToRgb = useCallback((hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);

  const lerp = useCallback((a: number[], b: number[], t: number) => 
    `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`, []);

  const sample = useCallback((ctx: CanvasRenderingContext2D, text: string) => {
    const off = document.createElement('canvas');
    const oc = off.getContext('2d', { willReadFrequently: true });
    if (!oc) return [];
    
    off.width = width; off.height = height;
    oc.font = `700 ${fontSize}px Inter,system-ui,sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    oc.fillText(text, width / 2, height / 2);
    
    const d = oc.getImageData(0, 0, width, height).data;
    const step = Math.max(2, Math.floor(fontSize / 16));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const pts: typeof particlesRef.current = [];
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (d[(y * width + x) * 4 + 3] > 50) {
          pts.push({ x, y, ox: x, oy: y, tx: x, ty: y, r: 1.1 + Math.random() * 0.5, c: lerp(c1, c2, x / width) });
        }
      }
    }
    return pts;
  }, [width, height, fontSize, gradientFrom, gradientTo, hexToRgb, lerp]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    particlesRef.current = sample(ctx, words[stateRef.current.wordIdx]);
    stateRef.current.lastSwitch = performance.now();

    const draw = (t: number) => {
      const s = stateRef.current;
      const dt = t - s.lastSwitch;

      ctx.clearRect(0, 0, width, height);

      // Phase: 0=stable, 1=dissolve, 2=form
      if (s.phase === 0 && dt > interval) {
        s.phase = 1; s.progress = 0;
        particlesRef.current.forEach(p => {
          const a = Math.random() * Math.PI * 2;
          p.tx = p.ox + Math.cos(a) * (8 + Math.random() * 12);
          p.ty = p.oy + Math.sin(a) * (8 + Math.random() * 12);
        });
      } else if (s.phase === 1) {
        s.progress += 0.12;
        if (s.progress >= 1) {
          s.wordIdx = 1 - s.wordIdx;
          particlesRef.current = sample(ctx, words[s.wordIdx]);
          particlesRef.current.forEach(p => {
            const a = Math.random() * Math.PI * 2;
            p.x = p.ox + Math.cos(a) * (8 + Math.random() * 12);
            p.y = p.oy + Math.sin(a) * (8 + Math.random() * 12);
          });
          s.phase = 2; s.progress = 0;
        }
      } else if (s.phase === 2) {
        s.progress += 0.12;
        if (s.progress >= 1) { s.phase = 0; s.lastSwitch = t; }
      }

      const ease = s.phase === 1 ? s.progress : s.phase === 2 ? 1 - s.progress : 0;

      particlesRef.current.forEach(p => {
        const px = s.phase === 1 ? p.ox + (p.tx - p.ox) * ease : s.phase === 2 ? p.ox + (p.x - p.ox) * (1 - ease) : p.ox;
        const py = s.phase === 1 ? p.oy + (p.ty - p.oy) * ease : s.phase === 2 ? p.oy + (p.y - p.oy) * (1 - ease) : p.oy;
        const alpha = s.phase === 0 ? 1 : 0.6 + 0.4 * (1 - Math.abs(ease - 0.5) * 2);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mounted, width, height, words, interval, sample]);

  // SEO: Always render text for crawlers, visually hidden when JS runs
  return (
    <span className={`inline-block ${className}`} style={{ width, height, position: 'relative' }}>
      <span className="sr-only">{words[0]} / {words[1]}</span>
      {mounted ? (
        <canvas ref={canvasRef} style={{ width, height, display: 'block' }} aria-hidden="true" />
      ) : (
        <span 
          style={{
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize, fontWeight: 700,
          }}
        >
          {words[startIndex]}
        </span>
      )}
    </span>
  );
});

export default ParticleMorphText;
