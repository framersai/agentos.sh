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
  charIndex: number;
}

/**
 * ParticleMorphText - Fast, smooth text morphing with particle effects
 */
export function ParticleMorphText({
  words,
  className = '',
  interval = 2500, // Faster interval
  fontSize = 48,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
  startIndex = 0,
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<TextParticle[]>([]);
  const currentWordIdxRef = useRef(startIndex);
  const phaseRef = useRef<'stable' | 'morphing'>('stable');
  const morphProgressRef = useRef(0);
  const lastSwitchRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 200, height: 50 });

  // Color interpolation
  const interpolateColor = useCallback((color1: string, color2: string, t: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Create particles for a word
  const createParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number
  ): TextParticle[] => {
    const particles: TextParticle[] = [];
    
    ctx.font = `700 ${fontSize}px "Inter", "SF Pro Display", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return particles;

    const padding = 4;
    offCanvas.width = textWidth + padding * 2;
    offCanvas.height = fontSize * 1.2;

    offCtx.font = ctx.font;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imageData.data;
    const sampleStep = Math.max(2, Math.floor(fontSize / 16));
    
    const charWidths: number[] = [];
    for (const char of text) {
      charWidths.push(offCtx.measureText(char).width);
    }

    for (let y = 0; y < offCanvas.height; y += sampleStep) {
      for (let x = 0; x < offCanvas.width; x += sampleStep) {
        const i = (y * offCanvas.width + x) * 4;
        if (pixels[i + 3] > 80) {
          const relativeX = x - padding;
          let charIdx = 0;
          let accWidth = 0;
          const textStartX = (offCanvas.width - textWidth) / 2 - padding;
          
          for (let c = 0; c < charWidths.length; c++) {
            if (relativeX >= textStartX + accWidth && relativeX < textStartX + accWidth + charWidths[c]) {
              charIdx = c;
              break;
            }
            accWidth += charWidths[c];
          }

          const finalX = centerX + (x - offCanvas.width / 2);
          const finalY = centerY + (y - offCanvas.height / 2);
          const t = x / offCanvas.width;

          particles.push({
            x: finalX,
            y: finalY,
            originX: finalX,
            originY: finalY,
            targetX: finalX,
            targetY: finalY,
            radius: 1.5 + Math.random() * 0.5,
            color: interpolateColor(gradientFrom, gradientTo, t),
            alpha: 1,
            charIndex: charIdx,
          });
        }
      }
    }

    return particles;
  }, [fontSize, gradientFrom, gradientTo, interpolateColor]);

  // Fast easing
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  // Animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const timeSinceSwitch = time - lastSwitchRef.current;
    const phase = phaseRef.current;

    // Phase transitions
    if (phase === 'stable' && timeSinceSwitch > interval) {
      phaseRef.current = 'morphing';
      morphProgressRef.current = 0;
      lastSwitchRef.current = time;

      particlesRef.current.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 25; // Tighter scatter
        p.targetX = p.originX + Math.cos(angle) * dist;
        p.targetY = p.originY + Math.sin(angle) * dist;
      });
    } else if (phase === 'morphing') {
      morphProgressRef.current += 0.045; // Much faster morphing

      if (morphProgressRef.current >= 1) {
        currentWordIdxRef.current = currentWordIdxRef.current === 0 ? 1 : 0;
        const nextWord = words[currentWordIdxRef.current];
        
        const newParticles = createParticles(ctx, nextWord, centerX, centerY);
        
        newParticles.forEach((p) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 15 + Math.random() * 25;
          p.x = p.originX + Math.cos(angle) * dist;
          p.y = p.originY + Math.sin(angle) * dist;
          p.alpha = 0.7;
        });

        particlesRef.current = newParticles;
        phaseRef.current = 'stable';
        morphProgressRef.current = 0;
        lastSwitchRef.current = time;
      }
    }

    const progress = morphProgressRef.current;
    const easedProgress = easeOutQuart(progress);

    particlesRef.current.forEach((p) => {
      let drawX = p.x;
      let drawY = p.y;
      let drawAlpha = p.alpha;

      if (phaseRef.current === 'morphing') {
        drawX = p.originX + (p.targetX - p.originX) * easedProgress;
        drawY = p.originY + (p.targetY - p.originY) * easedProgress;
        drawAlpha = Math.max(0.4, 1 - easedProgress * 0.6);
      } else {
        const convergeSpeed = 0.18; // Faster convergence
        p.x += (p.originX - p.x) * convergeSpeed;
        p.y += (p.originY - p.y) * convergeSpeed;
        drawX = p.x;
        drawY = p.y;
        
        const breathe = Math.sin(time * 0.003 + p.charIndex * 0.3) * 0.3;
        drawX += breathe;
        
        p.alpha = Math.min(1, p.alpha + 0.08);
        drawAlpha = p.alpha;
      }

      // Draw glow
      const glowRadius = p.radius * 2;
      const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowRadius);
      gradient.addColorStop(0, p.color.replace('rgb', 'rgba').replace(')', `, ${drawAlpha * 0.6})`));
      gradient.addColorStop(0.5, p.color.replace('rgb', 'rgba').replace(')', `, ${drawAlpha * 0.15})`));
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(drawX, drawY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw core
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${drawAlpha})`);
      ctx.fill();
    });
  }, [dimensions, interval, words, createParticles]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dimensions - match text size exactly
  useEffect(() => {
    if (!mounted) return;

    const longestWord = words[0].length > words[1].length ? words[0] : words[1];
    const estimatedWidth = longestWord.length * fontSize * 0.55;
    const width = estimatedWidth;
    const height = fontSize;
    
    setDimensions({ width, height });
  }, [mounted, words, fontSize]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const firstWord = words[currentWordIdxRef.current];
    particlesRef.current = createParticles(ctx, firstWord, width / 2, height / 2);
    
    particlesRef.current.forEach((p) => {
      p.alpha = 1;
    });

    phaseRef.current = 'stable';
    morphProgressRef.current = 0;
    lastSwitchRef.current = performance.now();

    const loop = (time: number) => {
      animate(ctx, time);
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, dimensions, words, createParticles, animate]);

  if (!mounted) {
    return (
      <span 
        className={className}
        style={{
          display: 'inline',
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: `${fontSize}px`,
          fontWeight: 700,
        }}
      >
        {words[startIndex]}
      </span>
    );
  }

  return (
    <span 
      ref={containerRef}
      className={`inline-flex items-center ${className}`}
      style={{ 
        width: dimensions.width,
        height: fontSize,
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

export default ParticleMorphText;
