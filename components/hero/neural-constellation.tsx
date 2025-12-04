'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface NeuralConstellationProps {
  size?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number; // 0 = core, 1 = inner, 2 = outer
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  pulseOffset: number;
}

interface EnergyPulse {
  connectionIdx: number;
  progress: number;
  speed: number;
  color: string;
}

/**
 * NeuralConstellation - A refined, luminescent neural network visualization
 * with smooth animations, subtle glow effects, and polished particle movements
 */
export function NeuralConstellation({ 
  size = 400, 
  className = '' 
}: NeuralConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const pulsesRef = useRef<EnergyPulse[]>([]);
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = resolvedTheme === 'dark';

  // Brand-aligned color palette with luminescence (memoized to prevent re-renders)
  const colors = useMemo(() => ({
    core: isDark ? '#a78bfa' : '#8b5cf6',      // Violet
    inner: isDark ? '#818cf8' : '#6366f1',      // Indigo
    outer: isDark ? '#67e8f9' : '#06b6d4',      // Cyan
    accent: isDark ? '#f472b6' : '#ec4899',     // Pink
    pulse: isDark ? '#c4b5fd' : '#a78bfa',      // Light violet
    glow: isDark ? 'rgba(167, 139, 250, 0.6)' : 'rgba(139, 92, 246, 0.4)',
    connectionBase: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.12)',
    connectionActive: isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(139, 92, 246, 0.35)',
  }), [isDark]);

  // Initialize particles with intentional positioning
  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    const centerX = size / 2;
    const centerY = size / 2;

    // Core particle (center)
    particles.push({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 12,
      baseRadius: 12,
      color: colors.core,
      alpha: 1,
      pulsePhase: 0,
      pulseSpeed: 0.02,
      layer: 0,
    });

    // Inner ring particles (6 particles)
    const innerRadius = size * 0.18;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const wobble = (Math.random() - 0.5) * 10;
      particles.push({
        x: centerX + Math.cos(angle) * innerRadius + wobble,
        y: centerY + Math.sin(angle) * innerRadius + wobble,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 6 + Math.random() * 2,
        baseRadius: 6 + Math.random() * 2,
        color: colors.inner,
        alpha: 0.9,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.01,
        layer: 1,
      });
    }

    // Outer ring particles (10 particles)
    const outerRadius = size * 0.32;
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
      const radiusVariation = outerRadius + (Math.random() - 0.5) * 30;
      particles.push({
        x: centerX + Math.cos(angle) * radiusVariation,
        y: centerY + Math.sin(angle) * radiusVariation,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 4 + Math.random() * 2,
        baseRadius: 4 + Math.random() * 2,
        color: i % 3 === 0 ? colors.accent : colors.outer,
        alpha: 0.75,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.008,
        layer: 2,
      });
    }

    // Ambient floating particles (8 particles)
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = size * 0.38 + Math.random() * size * 0.08;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 2 + Math.random() * 1.5,
        baseRadius: 2 + Math.random() * 1.5,
        color: colors.pulse,
        alpha: 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.015,
        layer: 2,
      });
    }

    return particles;
  }, [size, colors]);

  // Initialize connections
  const initializeConnections = useCallback((particles: Particle[]) => {
    const connections: Connection[] = [];

    // Connect core to all inner ring
    for (let i = 1; i <= 6; i++) {
      connections.push({
        from: 0,
        to: i,
        strength: 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Connect inner ring to each other (adjacent)
    for (let i = 1; i <= 6; i++) {
      const next = i === 6 ? 1 : i + 1;
      connections.push({
        from: i,
        to: next,
        strength: 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Connect inner to outer (strategic connections)
    for (let i = 1; i <= 6; i++) {
      // Each inner connects to 2 outer particles
      const outerBase = 7;
      const outerIdx1 = outerBase + ((i - 1) * 2) % 10;
      const outerIdx2 = outerBase + ((i - 1) * 2 + 1) % 10;
      
      if (particles[outerIdx1]) {
        connections.push({
          from: i,
          to: outerIdx1,
          strength: 0.4,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
      if (particles[outerIdx2]) {
        connections.push({
          from: i,
          to: outerIdx2,
          strength: 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    return connections;
  }, []);

  // Animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    const connections = connectionsRef.current;
    const pulses = pulsesRef.current;
    const time = timeRef.current;
    const centerX = size / 2;
    const centerY = size / 2;

    // Clear canvas completely for transparent background
    ctx.clearRect(0, 0, size, size);

    // Update particle positions with smooth orbital motion
    particles.forEach((p) => {
      // Pulse effect
      p.pulsePhase += p.pulseSpeed;
      const pulseFactor = 1 + Math.sin(p.pulsePhase) * 0.15;
      p.radius = p.baseRadius * pulseFactor;

      if (p.layer > 0) {
        // Gentle orbital drift
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Orbital rotation speed based on layer
        const orbitSpeed = p.layer === 1 ? 0.0008 : 0.0005;
        const newAngle = angle + orbitSpeed;
        
        // Apply smooth exponential decay to velocity
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Gentle attraction to maintain orbit
        const targetDist = p.layer === 1 ? size * 0.18 : size * 0.32;
        const distDiff = (targetDist - dist) * 0.002;
        
        p.x = centerX + Math.cos(newAngle) * (dist + distDiff) + p.vx;
        p.y = centerY + Math.sin(newAngle) * (dist + distDiff) + p.vy;
        
        // Add subtle random motion
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        
        // Boundary soft bounce
        const margin = 20;
        if (p.x < margin) p.vx += 0.05;
        if (p.x > size - margin) p.vx -= 0.05;
        if (p.y < margin) p.vy += 0.05;
        if (p.y > size - margin) p.vy -= 0.05;
      }
    });

    // Draw connections with gradient and pulse effect
    connections.forEach((conn) => {
      const from = particles[conn.from];
      const to = particles[conn.to];
      if (!from || !to) return;

      const pulseIntensity = (Math.sin(time * 0.002 + conn.pulseOffset) + 1) / 2;
      const baseAlpha = conn.strength * 0.3;
      const alpha = baseAlpha + pulseIntensity * 0.15;

      // Create gradient along connection
      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      const startColor = isDark 
        ? `rgba(167, 139, 250, ${alpha})` 
        : `rgba(139, 92, 246, ${alpha * 0.8})`;
      const endColor = isDark 
        ? `rgba(103, 232, 249, ${alpha * 0.7})` 
        : `rgba(6, 182, 212, ${alpha * 0.6})`;
      
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1 + conn.strength;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Update and draw energy pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i];
      pulse.progress += pulse.speed;
      
      if (pulse.progress >= 1) {
        pulses.splice(i, 1);
        continue;
      }

      const conn = connections[pulse.connectionIdx];
      if (!conn) continue;

      const from = particles[conn.from];
      const to = particles[conn.to];
      if (!from || !to) continue;

      // Smooth easing for pulse movement
      const easedProgress = 1 - Math.pow(1 - pulse.progress, 3);
      const x = from.x + (to.x - from.x) * easedProgress;
      const y = from.y + (to.y - from.y) * easedProgress;

      // Pulse glow
      const glowRadius = 8;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      gradient.addColorStop(0, pulse.color);
      gradient.addColorStop(0.5, isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(139, 92, 246, 0.3)');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Pulse core
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = pulse.color;
      ctx.fill();
    }

    // Spawn new pulses periodically
    if (Math.random() < 0.02 && pulses.length < 8) {
      const connIdx = Math.floor(Math.random() * connections.length);
      pulses.push({
        connectionIdx: connIdx,
        progress: 0,
        speed: 0.008 + Math.random() * 0.006,
        color: isDark ? '#c4b5fd' : '#a78bfa',
      });
    }

    // Helper to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Draw particles with glow effect
    particles.forEach((p) => {
      // Outer glow
      const glowSize = p.radius * 3.5;
      const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
      glowGradient.addColorStop(0, hexToRgba(p.color, p.alpha * 0.5));
      glowGradient.addColorStop(0.4, hexToRgba(p.color, p.alpha * 0.2));
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Inner glow (luminescence)
      const innerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 1.5);
      innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      innerGlow.addColorStop(0.3, p.color);
      innerGlow.addColorStop(1, hexToRgba(p.color, 0.6));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();
    });

    // Update time
    timeRef.current += 16;
  }, [size, isDark]);

  // Setup and animation loop
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Initialize
    particlesRef.current = initializeParticles();
    connectionsRef.current = initializeConnections(particlesRef.current);
    pulsesRef.current = [];
    timeRef.current = 0;

    // Clear canvas initially
    ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, size, size);

    // Start animation loop
    const loop = () => {
      animate(ctx);
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, size, isDark, initializeParticles, initializeConnections, animate]);

  if (!mounted) {
    return (
      <div 
        className={`relative ${className}`} 
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow behind */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)',
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary pulsing ring */}
      <motion.div
        className="absolute inset-[15%] rounded-full"
        style={{
          border: isDark
            ? '1px solid rgba(139, 92, 246, 0.2)'
            : '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: isDark
            ? '0 0 30px rgba(139, 92, 246, 0.15), inset 0 0 30px rgba(139, 92, 246, 0.1)'
            : '0 0 20px rgba(139, 92, 246, 0.1), inset 0 0 20px rgba(139, 92, 246, 0.05)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute inset-[5%] rounded-full"
        style={{
          border: isDark
            ? '1px solid rgba(6, 182, 212, 0.15)'
            : '1px solid rgba(6, 182, 212, 0.1)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 360],
        }}
        transition={{
          opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
        }}
      />

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{
          width: size,
          height: size,
        }}
      />
    </motion.div>
  );
}

export default NeuralConstellation;

