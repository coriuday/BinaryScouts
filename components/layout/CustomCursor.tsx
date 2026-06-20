'use client';

import React, { useEffect, useRef, useState } from 'react';

const CURSOR_SIZE = 12;
const RING_SIZE = 24;

const CustomCursor: React.FC = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('bs_custom_cursor') !== 'false';
  });

  useEffect(() => {
    // Bail on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Check localStorage for cursor preference
    const stored = localStorage.getItem('bs_custom_cursor');
    if (stored === 'false') return; // user has disabled it

    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const pointerEl = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]');
      setIsPointer(!!pointerEl);
    };
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

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
      ringPos.current.x = lerp(ringPos.current.x, x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - RING_SIZE / 2}px, ${ringPos.current.y - RING_SIZE / 2}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // Listen for toggle events from SettingsDrawer
    const onToggle = (e: Event) => {
      const enabled = (e as CustomEvent<{ enabled: boolean }>).detail.enabled;
      setEnabled(enabled);
      if (!enabled) {
        document.documentElement.classList.remove('has-custom-cursor');
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('mouseenter', onEnter);
      } else {
        document.documentElement.classList.add('has-custom-cursor');
        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        rafRef.current = requestAnimationFrame(loop);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  // Hidden when user has disabled cursor in settings
  if (!enabled) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="gpu"
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
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.05s ease',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="gpu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: '50%',
          border: `1.5px solid ${isPointer ? '#00d4ff' : 'rgba(0,212,255,0.4)'}`,
          boxShadow: isPointer ? '0 0 16px rgba(0,212,255,0.3)' : 'none',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 0.65 : 0,
          transition: 'opacity 0.3s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease',
          transform: 'translate3d(-100px, -100px, 0)',
          ...(isPointer
            ? { width: 48, height: 48, opacity: 0.5, background: 'rgba(0,212,255,0.08)' }
            : {}),
        }}
      />
    </>
  );
};

export default CustomCursor;
