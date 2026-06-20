'use client';

import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroDotGridProps {
  mouseX: number;
  mouseY: number;
}

export default function HeroDotGrid({ mouseX, mouseY }: HeroDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const spacing = 24;
      const spotlightX = ((mouseX + 1) / 2) * w;
      const spotlightY = ((mouseY + 1) / 2) * h;

      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          const dx = x - spotlightX;
          const dy = y - spotlightY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = Math.max(0.03, 0.18 - dist / 400);
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.fill();
        }
      }

      const grad = ctx.createRadialGradient(spotlightX, spotlightY, 0, spotlightX, spotlightY, 350);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (!reduced) rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
