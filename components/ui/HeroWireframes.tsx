'use client';

import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function HeroWireframes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;
    let visible = true;
    let cleanupThree: (() => void) | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(container);

    import('three').then((THREE) => {
      if (disposed) return;

      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const shapes = [
        new THREE.Mesh(new THREE.OctahedronGeometry(1.2), material),
        new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), material.clone()),
      ];

      shapes[0].position.set(-2.2, 0.8, -1);
      shapes[1].position.set(2.5, -0.5, 0);
      shapes.forEach((s) => scene.add(s));

      const baseY = shapes.map((s) => s.position.y);

      const onScroll = () => {
        const offset = window.scrollY * 0.0008;
        shapes.forEach((s, i) => {
          s.position.y = baseY[i] - offset * (i + 1);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const animate = () => {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);
        if (!visible) return;
        shapes[0].rotation.x += 0.003;
        shapes[0].rotation.y += 0.004;
        shapes[1].rotation.x += 0.002;
        shapes[1].rotation.y += 0.003;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const nw = container.clientWidth || 1;
        const nh = container.clientHeight || 1;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      cleanupThree = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        material.dispose();
        shapes.forEach((s) => {
          s.geometry.dispose();
          if (Array.isArray(s.material)) {
            s.material.forEach((m) => m.dispose());
          } else {
            s.material.dispose();
          }
        });
      };
    });

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(rafId);
      cleanupThree?.();
      container.innerHTML = '';
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ opacity: 0.4 }}
      aria-hidden="true"
    />
  );
}
