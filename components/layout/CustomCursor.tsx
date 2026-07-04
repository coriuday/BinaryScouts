'use client';

import React, { useEffect, useRef } from 'react';

const CURSOR_SIZE = 12;
const RING_SIZE = 24;

/**
 * CustomCursor — zero-React-render cursor.
 *
 * All visual updates happen via direct DOM manipulation (refs + RAF),
 * so mousemove never triggers a React re-render. This eliminates the
 * lag that occurred when overlays (Settings, mobile menu) were open.
 */
const CustomCursor: React.FC = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);
  const pointerRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    // Bail on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Check localStorage for cursor preference
    const stored = localStorage.getItem('bs_custom_cursor');
    if (stored === 'false') return;

    document.documentElement.classList.add('has-custom-cursor');

    // ── Direct DOM helpers (no React state = no re-renders) ──
    const setVisible = (v: boolean) => {
      if (visibleRef.current === v) return;
      visibleRef.current = v;
      if (wrapRef.current) wrapRef.current.style.opacity = v ? '1' : '0';
    };

    const setPointer = (v: boolean) => {
      if (pointerRef.current === v) return;
      pointerRef.current = v;
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = v ? '#6366f1' : '#00d4ff';
        dotRef.current.style.boxShadow = v
          ? '0 0 12px rgba(99,102,241,0.6)'
          : '0 0 12px rgba(0,212,255,0.6)';
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = v ? '#6366f1' : 'rgba(0,212,255,0.4)';
        ringRef.current.style.width = v ? '48px' : `${RING_SIZE}px`;
        ringRef.current.style.height = v ? '48px' : `${RING_SIZE}px`;
        ringRef.current.style.opacity = v ? '0.5' : '0.65';
        ringRef.current.style.background = v ? 'rgba(99,102,241,0.08)' : 'transparent';
        ringRef.current.style.boxShadow = v ? '0 0 16px rgba(99,102,241,0.3)' : 'none';
      }
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      const target = e.target as HTMLElement;
      const isPtr = !!target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
      );
      setPointer(isPtr);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // RAF loop: smooth ring interpolation (GPU via transform3d)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      const { x, y } = posRef.current;

      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - CURSOR_SIZE / 2}px, ${y - CURSOR_SIZE / 2}px, 0)`;
      }

      // Ring: lagging (~80ms feel via lower lerp)
      const halfRing = pointerRef.current ? 24 : RING_SIZE / 2;
      ringPos.current.x = lerp(ringPos.current.x, x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - halfRing}px, ${ringPos.current.y - halfRing}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // Listen for toggle events from SettingsDrawer
    const onToggle = (e: Event) => {
      const on = (e as CustomEvent<{ enabled: boolean }>).detail.enabled;
      if (!on) {
        document.documentElement.classList.remove('has-custom-cursor');
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('mouseenter', onEnter);
        if (wrapRef.current) wrapRef.current.style.display = 'none';
      } else {
        document.documentElement.classList.add('has-custom-cursor');
        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        rafRef.current = requestAnimationFrame(loop);
        if (wrapRef.current) wrapRef.current.style.display = '';
      }
    };
    window.addEventListener('bs:cursor-toggle', onToggle);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('bs:cursor-toggle', onToggle);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  // Don't render on touch devices (SSR safe check)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div ref={wrapRef} style={{ opacity: 0, transition: 'opacity 0.2s ease' }}>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          borderRadius: '50%',
          backgroundColor: '#00d4ff',
          boxShadow: '0 0 12px rgba(0,212,255,0.6)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,212,255,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.65,
          willChange: 'transform',
          transition: 'border-color 0.2s, width 0.2s, height 0.2s, opacity 0.2s, background 0.2s',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
    </div>
  );
};

export default CustomCursor;
