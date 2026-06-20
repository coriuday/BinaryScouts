'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MESSAGES = [
  'AI pipeline deployed...',
  '98 leads qualified...',
  'System uptime: 99.98%',
  'CRM sync complete — 240 leads/week',
  'Model inference: 45ms avg',
];

export default function HeroTerminalBar() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setText(MESSAGES[0]);
      return;
    }

    const msg = MESSAGES[index];
    let charIdx = 0;
    setText('');

    const typeInterval = setInterval(() => {
      charIdx++;
      setText(msg.slice(0, charIdx));
      if (charIdx >= msg.length) clearInterval(typeInterval);
    }, 40);

    const nextTimeout = setTimeout(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, msg.length * 40 + 2000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(nextTimeout);
    };
  }, [index, reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md"
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs"
        style={{
          background: 'rgba(6, 6, 6, 0.85)',
          border: '0.5px solid rgba(0, 212, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
        }}
      >
        <span style={{ color: '#00d4ff' }}>$</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#888' }}
          >
            {text}
            <span className="animate-blink" style={{ color: '#00d4ff' }}>|</span>
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
