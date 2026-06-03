'use client';

import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if the user is on mobile
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Trail lag effect
    let frameId: number;
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15, // Speed factor
          y: prev.y + dy * 0.15,
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };
    frameId = requestAnimationFrame(updateTrail);

    // Detect clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.classList.contains('cursor-pointer');

      setIsHovered(!!isClickable);
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, [position.x, position.y, isMobile]);

  if (isMobile || isHidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Center Target Dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-gx-green transition-transform duration-200 ease-out shadow-[0_0_8px_#79c043]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '8px' : '4px',
          height: isHovered ? '8px' : '4px',
        }}
      />

      {/* Lagging Tactical HUD Crosshair */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 border border-gx-green/40 rounded-full transition-all duration-100 ease-out"
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
          width: isHovered ? '40px' : '26px',
          height: isHovered ? '40px' : '26px',
          transform: `translate(-50%, -50%) rotate(${position.x + position.y}deg)`,
        }}
      >
        {/* HUD Tick Marks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gx-green/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gx-green/60" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gx-green/60" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gx-green/60" />
      </div>
    </div>
  );
};

export default CustomCursor;
