'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          className="fixed inset-0 z-[9990] pointer-events-none"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 100%)' }}
          exit={{ clipPath: 'inset(0 0 0 0%)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: '#050505' }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
