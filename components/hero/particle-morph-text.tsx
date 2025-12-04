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
 * ParticleMorphText - Smooth liquid particle morphing
 */
export const ParticleMorphText = memo(function ParticleMorphText({
  words,
  className = '',
  interval = 2200,
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ 
    wordIdx: startIndex, 
    phase: 0, // 0=stable, 1=dissolve, 2=form
    progress: 0, 
    lastSwitch: 0 
  });
  const particlesRef = useRef<{ 
    x: number; y: number; 
    ox: number; oy: number; 
    tx: number; ty: number; 
    vx: number; vy: number;
    r: number; c: string; 
    delay: number;
    wobble: number;
  }[]>([]);
  const [mounted, setMounted] = useState(false);

  const width = Math.ceil(Math.max(words[0].length, words[1].length) * fontSize * 0.58);
  const height = Math.ceil(fontSize * 1.2);

  const hexToRgb = useCallback((hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);

  const lerp = useCallback((a: number[], b: number[], t: number) => 
    `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`, []);

  // Smooth easing functions
  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
  const easeInQuart = (t: number) => t * t * t * t;

  const sample = useCallback((ctx: CanvasRenderingContext2D, text: string) => {
    const off = document.createElement('canvas');
    const oc = off.getContext('2d', { willReadFrequently: true });
    if (!oc) return [];
    
    off.width = width; off.height = height;
    oc.font = `700 ${fontSize}px Inter,system-ui,sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    oc.fillText(text, width / 2, height * 0.55);
    
    const d = oc.getImageData(0, 0, width, height).data;
    const step = Math.max(2, Math.floor(fontSize / 16));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const pts: typeof particlesRef.current = [];
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (d[(y * width + x) * 4 + 3] > 50) {
          const normalizedX = x / width;
          pts.push({ 
            x, y, 
            ox: x, oy: y, 
            tx: x, ty: y, 
            vx: 0, vy: 0,
            r: 1.0 + Math.random() * 0.6, 
            c: lerp(c1, c2, normalizedX),
            delay: normalizedX * 0.3 + Math.random() * 0.15, // Staggered by position
            wobble: Math.random() * Math.PI * 2,
          });
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

      // Phase transitions
      if (s.phase === 0 && dt > interval) {
        s.phase = 1; 
        s.progress = 0;
        // Set up dissolve targets - particles flow outward organically
        particlesRef.current.forEach(p => {
          const angle = Math.atan2(p.oy - height / 2, p.ox - width / 2) + (Math.random() - 0.5) * 1.5;
          const dist = 15 + Math.random() * 25;
          p.tx = p.ox + Math.cos(angle) * dist;
          p.ty = p.oy + Math.sin(angle) * dist;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
        });
      } else if (s.phase === 1) {
        s.progress += 0.012; // Slower dissolve
        if (s.progress >= 1) {
          s.wordIdx = 1 - s.wordIdx;
          const newParticles = sample(ctx, words[s.wordIdx]);
          // Position new particles scattered, ready to flow in
          newParticles.forEach(p => {
            const angle = Math.atan2(p.oy - height / 2, p.ox - width / 2) + (Math.random() - 0.5) * 1.5;
            const dist = 15 + Math.random() * 25;
            p.x = p.ox + Math.cos(angle) * dist;
            p.y = p.oy + Math.sin(angle) * dist;
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = (Math.random() - 0.5) * 2;
          });
          particlesRef.current = newParticles;
          s.phase = 2; 
          s.progress = 0;
        }
      } else if (s.phase === 2) {
        s.progress += 0.015; // Slower formation
        if (s.progress >= 1) { 
          s.phase = 0; 
          s.lastSwitch = t; 
          // Snap to final positions
          particlesRef.current.forEach(p => {
            p.x = p.ox;
            p.y = p.oy;
          });
        }
      }

      const globalProgress = s.progress;

      particlesRef.current.forEach(p => {
        // Apply per-particle delay for liquid stagger effect
        const delayedProgress = Math.max(0, Math.min(1, (globalProgress - p.delay) / (1 - p.delay * 0.8)));
        
        // Organic wobble during transition
        const wobbleAmount = s.phase !== 0 ? Math.sin(t * 0.003 + p.wobble) * (1 - delayedProgress) * 2 : 0;
        
        let px: number, py: number, alpha: number;
        
        if (s.phase === 0) {
          // Stable - subtle breathing
          const breath = Math.sin(t * 0.002 + p.wobble) * 0.5;
          px = p.ox + breath;
          py = p.oy;
          alpha = 1;
        } else if (s.phase === 1) {
          // Dissolving - smooth ease out
          const ease = easeInQuart(delayedProgress);
          px = p.ox + (p.tx - p.ox) * ease + wobbleAmount + p.vx * ease;
          py = p.oy + (p.ty - p.oy) * ease + wobbleAmount + p.vy * ease;
          // Fade out smoothly
          alpha = 1 - easeInOutCubic(delayedProgress) * 0.6;
        } else {
          // Forming - smooth ease in
          const ease = easeOutQuart(delayedProgress);
          px = p.x + (p.ox - p.x) * ease;
          py = p.y + (p.oy - p.y) * ease;
          // Fade in smoothly
          alpha = 0.4 + easeInOutCubic(delayedProgress) * 0.6;
        }
        
        // Draw with soft glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.r * 2);
        gradient.addColorStop(0, p.c.replace('rgb', 'rgba').replace(')', `,${alpha})`));
        gradient.addColorStop(0.5, p.c.replace('rgb', 'rgba').replace(')', `,${alpha * 0.5})`));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(px - p.r * 2, py - p.r * 2, p.r * 4, p.r * 4);
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mounted, width, height, words, interval, sample]);

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
