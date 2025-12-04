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
 * ParticleMorphText - Clear, fast text morphing with proper baseline alignment
 */
export const ParticleMorphText = memo(function ParticleMorphText({
  words,
  className = '',
  interval = 3000,
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ wordIdx: startIndex, morphT: 0, lastSwitch: 0, isMorphing: false });
  const particlesARef = useRef<{ x: number; y: number; r: number; c: string }[]>([]);
  const particlesBRef = useRef<{ x: number; y: number; r: number; c: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  // Wider container to prevent cutoff, especially for "Emergent"
  const width = Math.ceil(Math.max(words[0].length, words[1].length) * fontSize * 0.65);
  const height = Math.ceil(fontSize * 1.2);

  const hexToRgb = useCallback((hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }, []);

  const lerp = useCallback((a: number[], b: number[], t: number) => 
    `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`, []);

  const sampleText = useCallback((text: string) => {
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    
    off.width = width;
    off.height = height;
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    // Position text at top-left with small padding
    ctx.fillText(text, 2, Math.round(height * 0.1));
    
    const data = ctx.getImageData(0, 0, width, height).data;
    const step = Math.max(2, Math.floor(fontSize / 18));
    const c1 = hexToRgb(gradientFrom), c2 = hexToRgb(gradientTo);
    const particles: { x: number; y: number; r: number; c: string }[] = [];
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 100) {
          particles.push({
            x, y,
            r: 1.2,
            c: lerp(c1, c2, x / width),
          });
        }
      }
    }
    return particles;
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

    particlesARef.current = sampleText(words[0]);
    particlesBRef.current = sampleText(words[1]);
    stateRef.current.lastSwitch = performance.now();

    const draw = (t: number) => {
      const s = stateRef.current;
      const elapsed = t - s.lastSwitch;

      ctx.clearRect(0, 0, width, height);

      if (!s.isMorphing && elapsed > interval) {
        s.isMorphing = true;
        s.morphT = 0;
      }

      if (s.isMorphing) {
        s.morphT += 0.04;
        if (s.morphT >= 1) {
          s.morphT = 0;
          s.isMorphing = false;
          s.wordIdx = 1 - s.wordIdx;
          s.lastSwitch = t;
        }
      }

      const fromParticles = s.wordIdx === 0 ? particlesARef.current : particlesBRef.current;
      const toParticles = s.wordIdx === 0 ? particlesBRef.current : particlesARef.current;
      const easeT = s.isMorphing ? (1 - Math.cos(s.morphT * Math.PI)) / 2 : 0;
      const maxLen = Math.max(fromParticles.length, toParticles.length);
      
      for (let i = 0; i < maxLen; i++) {
        const fromP = fromParticles[i % fromParticles.length];
        const toP = toParticles[i % toParticles.length];
        
        const x = fromP.x + (toP.x - fromP.x) * easeT;
        const y = fromP.y + (toP.y - fromP.y) * easeT;
        
        const fromRgb = fromP.c.match(/\d+/g)!.map(Number);
        const toRgb = toP.c.match(/\d+/g)!.map(Number);
        const r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * easeT);
        const g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * easeT);
        const b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * easeT);
        
        const alpha = s.isMorphing ? 0.7 + 0.3 * Math.cos(s.morphT * Math.PI) : 1;
        
        const grad = ctx.createRadialGradient(x, y, 0, x, y, fromP.r * 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.3})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(x - fromP.r * 2, y - fromP.r * 2, fromP.r * 4, fromP.r * 4);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mounted, width, height, words, interval, sampleText]);

  // Align with text baseline, shift down slightly
  return (
    <span 
      className={`inline-block align-baseline ${className}`} 
      style={{ 
        width, 
        height,
        marginBottom: `-${Math.round(fontSize * 0.08)}px`, // Smaller adjustment = text sits lower
      }}
    >
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
