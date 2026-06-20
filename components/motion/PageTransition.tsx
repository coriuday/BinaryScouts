'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { dur, ease } from '@/lib/motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => (
  <motion.div
    className={`min-h-screen flex flex-col relative ${className}`}
    style={{ backgroundColor: '#050505' }}
    initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
    animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
    transition={{ duration: dur.medium, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <div
        className="orb absolute w-[700px] h-[700px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 65%)',
          top: '-15%',
          right: '-5%',
          filter: 'blur(90px)',
          animation: 'atmosphericFloat 22s ease-in-out infinite',
        }}
      />
      <div
        className="orb absolute w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(circle, rgba(123,0,255,0.06) 0%, transparent 65%)',
          bottom: '5%',
          left: '-5%',
          filter: 'blur(80px)',
          animation: 'atmosphericFloat 18s ease-in-out infinite reverse',
        }}
      />
    </div>

    <div className="relative z-10 flex flex-col flex-grow">
      {children}
    </div>
  </motion.div>
);

export default PageTransition;
