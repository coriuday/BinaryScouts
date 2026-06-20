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

    import('three').then((THREE) => {
      if (disposed) return;

      const w = container.clientWidth;
      const h = container.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });

      const shapes = [
        new THREE.Mesh(new THREE.OctahedronGeometry(1.2), material),
        new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), material.clone()),
        new THREE.Mesh(new THREE.TetrahedronGeometry(1.1), material.clone()),
      ];

      shapes[0].position.set(-2.2, 0.8, -1);
      shapes[1].position.set(2.5, -0.5, 0);
      shapes[2].position.set(0.5, 1.5, -2);

      shapes.forEach((s) => scene.add(s));

      const onScroll = () => {
        const scroll = window.scrollY;
        shapes.forEach((s, i) => {
          s.position.y += (scroll * 0.0003 * (i + 1));
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const animate = () => {
        if (disposed) return;
        shapes[0].rotation.x += 0.004;
        shapes[0].rotation.y += 0.006;
        shapes[1].rotation.x += 0.003;
        shapes[1].rotation.y += 0.005;
        shapes[2].rotation.x += 0.005;
        shapes[2].rotation.z += 0.004;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      animate();

      const onResize = () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (container) container.innerHTML = '';
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
