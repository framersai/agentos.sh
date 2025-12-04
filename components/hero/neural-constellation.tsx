'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface NeuralConstellationProps {
  size?: number;
  className?: string;
}

/**
 * NeuralConstellation - Radiant, luminescent neural network visualization
 */
export function NeuralConstellation({ 
  size = 500, 
  className = '' 
}: NeuralConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = resolvedTheme === 'dark';

  const colors = useMemo(() => ({
    core: isDark ? '#c4b5fd' : '#a78bfa',
    inner: isDark ? '#a5b4fc' : '#818cf8',
    outer: isDark ? '#67e8f9' : '#22d3ee',
    accent: isDark ? '#f9a8d4' : '#f472b6',
    pulse: isDark ? '#e9d5ff' : '#c4b5fd',
  }), [isDark]);

  // Stable node positions
  const nodes = useMemo(() => {
    const cx = size / 2, cy = size / 2;
    const result = [
      { x: cx, y: cy, r: 14, color: colors.core, layer: 0 }, // Center
    ];
    // Inner ring - 6 nodes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const r = size * 0.2;
      result.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, r: 8, color: colors.inner, layer: 1 });
    }
    // Outer ring - 12 nodes
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = size * 0.38;
      result.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, r: 5, color: i % 3 === 0 ? colors.accent : colors.outer, layer: 2 });
    }
    return result;
  }, [size, colors]);

  // Connections
  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    // Center to inner
    for (let i = 1; i <= 6; i++) conns.push({ from: 0, to: i });
    // Inner ring
    for (let i = 1; i <= 6; i++) conns.push({ from: i, to: i === 6 ? 1 : i + 1 });
    // Inner to outer
    for (let i = 1; i <= 6; i++) {
      conns.push({ from: i, to: 7 + (i - 1) * 2 });
      conns.push({ from: i, to: 7 + ((i - 1) * 2 + 1) % 12 });
    }
    return conns;
  }, []);

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const animate = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = timeRef.current;
    ctx.clearRect(0, 0, size, size);

    // Draw connections with pulsing glow
    connections.forEach((c, i) => {
      const n1 = nodes[c.from], n2 = nodes[c.to];
      const pulse = (Math.sin(t * 0.003 + i * 0.5) + 1) / 2;
      const alpha = 0.15 + pulse * 0.2;
      
      const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
      grad.addColorStop(0, hexToRgba(n1.color, alpha));
      grad.addColorStop(1, hexToRgba(n2.color, alpha * 0.7));
      
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 + pulse;
      ctx.stroke();
    });

    // Energy pulses along connections
    connections.forEach((c, i) => {
      const n1 = nodes[c.from], n2 = nodes[c.to];
      const progress = ((t * 0.001 + i * 0.3) % 2) / 2;
      if (progress < 1) {
        const px = n1.x + (n2.x - n1.x) * progress;
        const py = n1.y + (n2.y - n1.y) * progress;
        const pulseAlpha = Math.sin(progress * Math.PI) * 0.8;
        
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, hexToRgba(colors.pulse, pulseAlpha));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(px - 6, py - 6, 12, 12);
      }
    });

    // Draw nodes with radiant glow
    nodes.forEach((n, i) => {
      const pulse = 1 + Math.sin(t * 0.004 + i * 0.7) * 0.15;
      const r = n.r * pulse;
      
      // Outer glow
      const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
      glow.addColorStop(0, hexToRgba(n.color, 0.5));
      glow.addColorStop(0.3, hexToRgba(n.color, 0.2));
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(n.x - r * 4, n.y - r * 4, r * 8, r * 8);
      
      // Core with bright center
      const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
      core.addColorStop(0, 'rgba(255,255,255,0.95)');
      core.addColorStop(0.3, n.color);
      core.addColorStop(1, hexToRgba(n.color, 0.7));
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    });

    timeRef.current += 16;
  }, [size, nodes, connections, colors]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const loop = () => {
      animate(ctx);
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationRef.current);
  }, [mounted, size, animate]);

  if (!mounted) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, position: 'relative' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Large ambient glow */}
      <motion.div
        className="absolute inset-[-20%] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)',
        }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <canvas ref={canvasRef} className="relative z-10" style={{ width: size, height: size }} />
    </motion.div>
  );
}

export default NeuralConstellation;
