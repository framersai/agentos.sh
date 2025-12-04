'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';

interface ParticleMorphTextProps {
  words: string[];
  className?: string;
  interval?: number;
  fontSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

interface TextParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  delay: number;
  char: string;
  charIndex: number;
}

/**
 * ParticleMorphText - Text that dissolves into particles and morphs into new words
 * with smooth exponential decay animations and refined particle effects
 */
export function ParticleMorphText({
  words,
  className = '',
  interval = 4000,
  fontSize = 64,
  gradientFrom = '#8b5cf6',
  gradientTo = '#06b6d4',
}: ParticleMorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<TextParticle[]>([]);
  const phaseRef = useRef<'stable' | 'dissolving' | 'forming'>('stable');
  const progressRef = useRef(0);
  const currentWordRef = useRef(0);
  const nextWordRef = useRef(1);
  const lastTransitionRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 80 });

  const isDark = resolvedTheme === 'dark';

  // Shuffle array without immediate repeats
  const shuffledWords = useMemo(() => {
    const shuffled = [...words];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [words]);

  // Get text metrics and create particles from text
  const createTextParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number
  ): TextParticle[] => {
    const particles: TextParticle[] = [];
    
    // Configure font
    ctx.font = `bold ${fontSize}px "Inter", "SF Pro Display", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure text
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    
    // Create off-screen canvas to sample text pixels
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return particles;

    const padding = 20;
    offCanvas.width = textWidth + padding * 2;
    offCanvas.height = fontSize * 1.5;

    offCtx.font = ctx.font;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    // Sample pixels
    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imageData.data;

    // Particle density based on font size
    const sampleStep = Math.max(2, Math.floor(fontSize / 20));
    
    // Create gradient colors for particles
    const gradientStops = 10;
    const colors: string[] = [];
    for (let i = 0; i < gradientStops; i++) {
      const t = i / (gradientStops - 1);
      colors.push(interpolateColor(gradientFrom, gradientTo, t));
    }

    let charIndex = 0;
    let currentCharX = 0;
    const charWidths: number[] = [];
    
    // Get individual character widths
    for (const char of text) {
      const charWidth = offCtx.measureText(char).width;
      charWidths.push(charWidth);
    }

    // Sample pixels and create particles
    for (let y = 0; y < offCanvas.height; y += sampleStep) {
      for (let x = 0; x < offCanvas.width; x += sampleStep) {
        const i = (y * offCanvas.width + x) * 4;
        const alpha = pixels[i + 3];

        if (alpha > 128) {
          // Determine which character this particle belongs to
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

          // Calculate final position relative to center
          const finalX = centerX + (x - offCanvas.width / 2);
          const finalY = centerY + (y - offCanvas.height / 2);

          // Gradient color based on x position
          const colorIdx = Math.floor((x / offCanvas.width) * (colors.length - 1));
          const particleColor = colors[colorIdx];

          particles.push({
            x: finalX + (Math.random() - 0.5) * 300,
            y: finalY + (Math.random() - 0.5) * 200,
            targetX: finalX,
            targetY: finalY,
            originX: finalX,
            originY: finalY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: 1.5 + Math.random() * 1,
            color: particleColor,
            alpha: 0,
            delay: charIdx * 0.05 + Math.random() * 0.1,
            char: text[charIdx] || '',
            charIndex: charIdx,
          });
        }
      }
    }

    return particles;
  }, [fontSize, gradientFrom, gradientTo]);

  // Color interpolation helper
  const interpolateColor = (color1: string, color2: string, t: number): string => {
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
  };

  // Exponential decay easing
  const expDecay = (t: number, decay: number = 4): number => {
    return 1 - Math.exp(-decay * t);
  };

  // Smooth step easing
  const smoothStep = (t: number): number => {
    return t * t * (3 - 2 * t);
  };

  // Animation loop
  const animate = useCallback((
    ctx: CanvasRenderingContext2D,
    time: number
  ) => {
    const particles = particlesRef.current;
    const phase = phaseRef.current;
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Phase timing
    const timeSinceTransition = time - lastTransitionRef.current;

    // Handle phase transitions
    if (phase === 'stable' && timeSinceTransition > interval) {
      // Start dissolving
      phaseRef.current = 'dissolving';
      progressRef.current = 0;
      lastTransitionRef.current = time;

      // Set dissolution targets (scatter outward)
      particles.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        p.targetX = p.originX + Math.cos(angle) * distance;
        p.targetY = p.originY + Math.sin(angle) * distance;
        p.vx = (Math.random() - 0.5) * 3;
        p.vy = (Math.random() - 0.5) * 3;
      });
    } else if (phase === 'dissolving') {
      progressRef.current += 0.015;
      
      if (progressRef.current >= 1) {
        // Move to forming phase
        phaseRef.current = 'forming';
        progressRef.current = 0;
        lastTransitionRef.current = time;

        // Update word indices (avoid repeats)
        currentWordRef.current = nextWordRef.current;
        do {
          nextWordRef.current = Math.floor(Math.random() * shuffledWords.length);
        } while (nextWordRef.current === currentWordRef.current && shuffledWords.length > 1);

        // Create new particles for next word
        const nextWord = shuffledWords[currentWordRef.current];
        const newParticles = createTextParticles(ctx, nextWord, centerX, centerY);

        // Transfer scattered positions to new particles
        newParticles.forEach((p, i) => {
          const oldP = particles[i % particles.length];
          if (oldP) {
            p.x = oldP.x;
            p.y = oldP.y;
          } else {
            p.x = centerX + (Math.random() - 0.5) * 300;
            p.y = centerY + (Math.random() - 0.5) * 200;
          }
          p.alpha = 0.5;
        });

        particlesRef.current = newParticles;
      }
    } else if (phase === 'forming') {
      progressRef.current += 0.012;

      if (progressRef.current >= 1) {
        phaseRef.current = 'stable';
        progressRef.current = 0;
        lastTransitionRef.current = time;
      }
    }

    // Update and draw particles
    const currentPhase = phaseRef.current;
    const progress = progressRef.current;

    particlesRef.current.forEach((p) => {
      // Calculate eased progress with per-particle delay
      const delayedProgress = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
      const easedProgress = expDecay(delayedProgress, 5);

      if (currentPhase === 'dissolving') {
        // Move toward dissolution target with exponential decay
        p.x += (p.targetX - p.x) * 0.08 + p.vx;
        p.y += (p.targetY - p.y) * 0.08 + p.vy;
        
        // Apply velocity decay
        p.vx *= 0.96;
        p.vy *= 0.96;
        
        // Add turbulence
        p.vx += (Math.random() - 0.5) * 0.5;
        p.vy += (Math.random() - 0.5) * 0.5;
        
        // Fade out
        p.alpha = Math.max(0, 1 - easedProgress * 1.2);
      } else if (currentPhase === 'forming') {
        // Move toward origin with smooth exponential convergence
        const dx = p.originX - p.x;
        const dy = p.originY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Smooth exponential approach
        const approachSpeed = 0.06 + easedProgress * 0.08;
        p.x += dx * approachSpeed;
        p.y += dy * approachSpeed;
        
        // Fade in
        p.alpha = Math.min(1, easedProgress * 1.5);
        
        // Snap when close
        if (dist < 1) {
          p.x = p.originX;
          p.y = p.originY;
          p.alpha = 1;
        }
      } else {
        // Stable - gentle breathing motion
        const breatheX = Math.sin(time * 0.001 + p.charIndex * 0.3) * 0.3;
        const breatheY = Math.cos(time * 0.0008 + p.charIndex * 0.2) * 0.2;
        p.x = p.originX + breatheX;
        p.y = p.originY + breatheY;
        p.alpha = 1;
      }

      // Draw particle with glow
      if (p.alpha > 0.01) {
        // Glow effect
        const glowRadius = p.radius * 3;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        gradient.addColorStop(0, p.color.replace('rgb', 'rgba').replace(')', `, ${p.alpha * 0.8})`));
        gradient.addColorStop(0.5, p.color.replace('rgb', 'rgba').replace(')', `, ${p.alpha * 0.3})`));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${p.alpha})`);
        ctx.fill();
      }
    });
  }, [dimensions, interval, shuffledWords, createTextParticles]);

  // Initialize
  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure container and setup
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Measure based on longest word
      const longestWord = shuffledWords.reduce((a, b) => a.length > b.length ? a : b, '');
      const estimatedWidth = longestWord.length * fontSize * 0.65;
      const width = Math.max(estimatedWidth, 300);
      const height = fontSize * 1.8;
      
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [mounted, shuffledWords, fontSize]);

  // Animation setup
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Initialize particles for first word
    const firstWord = shuffledWords[0];
    particlesRef.current = createTextParticles(ctx, firstWord, width / 2, height / 2);
    
    // Set initial state
    particlesRef.current.forEach((p) => {
      p.x = p.originX;
      p.y = p.originY;
      p.alpha = 1;
    });

    phaseRef.current = 'stable';
    progressRef.current = 0;
    lastTransitionRef.current = performance.now();

    // Animation loop
    const loop = (time: number) => {
      animate(ctx, time);
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, dimensions, shuffledWords, createTextParticles, animate]);

  if (!mounted) {
    return (
      <span 
        className={className}
        style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
        }}
      >
        {words[0]}
      </span>
    );
  }

  return (
    <span 
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ 
        position: 'relative',
        minWidth: dimensions.width,
        height: dimensions.height,
        verticalAlign: 'middle',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

export default ParticleMorphText;

