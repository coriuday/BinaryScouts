'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const opacityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    // Disable continuous canvas on mobile / coarse pointers
    const mobile =
      window.innerWidth < 768 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!mobile);
  }, [reduced]);

  const initParticles = useCallback((w: number, h: number) => {
    const count = 48;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible' && visibleRef.current;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const startTime = performance.now();

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (!visibleRef.current || document.visibilityState !== 'visible') return;
      if (!width || !height) return;

      const elapsed = time - startTime;
      opacityRef.current = Math.min(elapsed / 1200, 1);

      const targetX = ((mouseRef.current.x / width) - 0.5) * 28;
      const targetY = ((mouseRef.current.y / height) - 0.5) * 28;
      offsetRef.current.x += (targetX - offsetRef.current.x) * 0.04;
      offsetRef.current.y += (targetY - offsetRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacityRef.current;

      const particles = particlesRef.current;
      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();

        // Connect only a subset of neighbors (cheaper than full O(n²))
        const jMax = Math.min(particles.length, i + 8);
        for (let j = i + 1; j < jMax; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000) {
            const dist = Math.sqrt(distSq);
            const lineOpacity = (1 - dist / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x + ox, p.y + oy);
            ctx.lineTo(q.x + ox, q.y + oy);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, [enabled, initParticles]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticleCanvas;
