'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ParticleMorphTextProps {
  words: [string, string];
  className?: string;
  interval?: number;
  fontSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
  startIndex?: number;
}

interface TextParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  alpha: number;
}

/**
 * ParticleMorphText - Ultra-fast smooth text morphing
 */
export function ParticleMorphText({
  words,
  className = '',
  interval = 2000,
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<TextParticle[]>([]);
  const currentWordIdxRef = useRef(startIndex);
  const phaseRef = useRef<'stable' | 'morphing'>('stable');
  const morphProgressRef = useRef(0);
  const lastSwitchRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 200, height: 60 });

  const interpolateColor = useCallback((color1: string, color2: string, t: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r = Math.round(parseInt(hex1.slice(0, 2), 16) * (1 - t) + parseInt(hex2.slice(0, 2), 16) * t);
    const g = Math.round(parseInt(hex1.slice(2, 4), 16) * (1 - t) + parseInt(hex2.slice(2, 4), 16) * t);
    const b = Math.round(parseInt(hex1.slice(4, 6), 16) * (1 - t) + parseInt(hex2.slice(4, 6), 16) * t);
    return `rgb(${r},${g},${b})`;
  }, []);

  const createParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number
  ): TextParticle[] => {
    const particles: TextParticle[] = [];
    
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(text).width;
    
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return particles;

    offCanvas.width = Math.ceil(textWidth) + 20;
    offCanvas.height = Math.ceil(fontSize * 1.3);

    offCtx.font = ctx.font;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#fff';
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imageData.data;
    const step = Math.max(2, Math.floor(fontSize / 14));

    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        if (pixels[(y * offCanvas.width + x) * 4 + 3] > 60) {
          const fx = centerX + (x - offCanvas.width / 2);
          const fy = centerY + (y - offCanvas.height / 2);
          const t = x / offCanvas.width;

          particles.push({
            x: fx, y: fy,
            originX: fx, originY: fy,
            targetX: fx, targetY: fy,
            radius: 1.2 + Math.random() * 0.6,
            color: interpolateColor(gradientFrom, gradientTo, t),
            alpha: 1,
          });
        }
      }
    }
    return particles;
  }, [fontSize, gradientFrom, gradientTo, interpolateColor]);

  const animate = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = dimensions;
    const cx = width / 2, cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    const elapsed = time - lastSwitchRef.current;

    if (phaseRef.current === 'stable' && elapsed > interval) {
      phaseRef.current = 'morphing';
      morphProgressRef.current = 0;
      lastSwitchRef.current = time;
      particlesRef.current.forEach(p => {
        const a = Math.random() * Math.PI * 2;
        const d = 10 + Math.random() * 15;
        p.targetX = p.originX + Math.cos(a) * d;
        p.targetY = p.originY + Math.sin(a) * d;
      });
    } else if (phaseRef.current === 'morphing') {
      morphProgressRef.current += 0.08; // Very fast
      if (morphProgressRef.current >= 1) {
        currentWordIdxRef.current = 1 - currentWordIdxRef.current;
        const newParticles = createParticles(ctx, words[currentWordIdxRef.current], cx, cy);
        newParticles.forEach(p => {
          const a = Math.random() * Math.PI * 2;
          const d = 10 + Math.random() * 15;
          p.x = p.originX + Math.cos(a) * d;
          p.y = p.originY + Math.sin(a) * d;
          p.alpha = 0.8;
        });
        particlesRef.current = newParticles;
        phaseRef.current = 'stable';
        morphProgressRef.current = 0;
        lastSwitchRef.current = time;
      }
    }

    const t = morphProgressRef.current;
    const ease = 1 - Math.pow(1 - t, 3);

    particlesRef.current.forEach(p => {
      let dx, dy, alpha;
      if (phaseRef.current === 'morphing') {
        dx = p.originX + (p.targetX - p.originX) * ease;
        dy = p.originY + (p.targetY - p.originY) * ease;
        alpha = Math.max(0.5, 1 - ease * 0.5);
      } else {
        p.x += (p.originX - p.x) * 0.25;
        p.y += (p.originY - p.y) * 0.25;
        dx = p.x;
        dy = p.y;
        p.alpha = Math.min(1, p.alpha + 0.1);
        alpha = p.alpha;
      }

      // Soft glow - no hard edges
      const gr = ctx.createRadialGradient(dx, dy, 0, dx, dy, p.radius * 2.5);
      gr.addColorStop(0, p.color.replace('rgb', 'rgba').replace(')', `,${alpha})`));
      gr.addColorStop(0.4, p.color.replace('rgb', 'rgba').replace(')', `,${alpha * 0.4})`));
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.fillRect(dx - p.radius * 2.5, dy - p.radius * 2.5, p.radius * 5, p.radius * 5);
    });
  }, [dimensions, interval, words, createParticles]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const longest = words[0].length > words[1].length ? words[0] : words[1];
    setDimensions({
      width: longest.length * fontSize * 0.58,
      height: fontSize * 1.2
    });
  }, [mounted, words, fontSize]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    particlesRef.current = createParticles(ctx, words[currentWordIdxRef.current], width / 2, height / 2);
    lastSwitchRef.current = performance.now();

    const loop = (t: number) => {
      animate(ctx, t);
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [mounted, dimensions, words, createParticles, animate]);

  if (!mounted) {
    return (
      <span 
        className={className}
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
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`} style={{ width: dimensions.width, height: dimensions.height }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </span>
  );
}

export default ParticleMorphText;
