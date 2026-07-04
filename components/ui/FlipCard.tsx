'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { FlipCardData } from '@/lib/flip-team';

interface FlipCardProps {
  data: FlipCardData;
  index?: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ data, index = 0 }) => {
  const reduced = useReducedMotion();
  const [locked, setLocked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggle = useCallback(() => {
    setLocked((f) => !f);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const isFlipped = locked || hovered;
  const rotation = isFlipped ? 180 : 0;
  const transition = reduced
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 260, damping: 22 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-sm mx-auto"
      style={{ perspective: 1000 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`${data.name} team card. ${isFlipped ? 'Showing details' : 'Click to flip for details'}.`}
        aria-pressed={isFlipped}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          if (!reduced && window.innerWidth >= 1024) setHovered(true);
        }}
        onMouseLeave={() => {
          if (!reduced && window.innerWidth >= 1024) setHovered(false);
        }}
        className="relative w-full cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--indigo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space)] rounded-[20px]"
        style={{ aspectRatio: '3 / 4' }}
      >
        <motion.div
          animate={{ rotateY: rotation }}
          transition={transition}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[20px]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              border: '0.5px solid var(--border-v2)',
            }}
          >
            <Image
              src={data.image}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={index === 0}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,5,10,0.95) 0%, rgba(5,5,10,0.4) 45%, transparent 70%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--text-1)',
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                {data.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--cyan-v2)',
                  marginBottom: 10,
                }}
              >
                {data.username}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {data.titles.map((title) => (
                  <span
                    key={title}
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      border: '0.5px solid rgba(99,102,241,0.35)',
                      borderRadius: 100,
                      padding: '4px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--indigo)',
                      fontWeight: 600,
                    }}
                  >
                    {title}
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: 'var(--text-2)',
                  lineHeight: 1.4,
                }}
              >
                {data.role}
              </p>
              <p
                className="hidden lg:block mt-3"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-3)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Hover to flip
              </p>
              <p
                className="lg:hidden mt-3"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-3)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Tap to flip
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[20px] flex flex-col"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'var(--space-2)',
              border: '0.5px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 40px rgba(99,102,241,0.12)',
            }}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <p
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: 20,
                    color: 'var(--text-1)',
                    marginBottom: 2,
                  }}
                >
                  {data.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--cyan-v2)',
                  }}
                >
                  {data.username}
                </p>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  color: 'var(--text-2)',
                  lineHeight: 1.65,
                  flex: 1,
                  marginBottom: 20,
                }}
              >
                {data.bio}
              </p>

              <div
                className="grid grid-cols-3 gap-3 mb-5"
                style={{
                  borderTop: '0.5px solid var(--border-v2)',
                  borderBottom: '0.5px solid var(--border-v2)',
                  padding: '16px 0',
                }}
              >
                {data.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p
                      style={{
                        fontFamily: 'var(--font-syne)',
                        fontWeight: 700,
                        fontSize: 18,
                        color: 'var(--text-1)',
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-3)',
                        marginTop: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {data.socialLinks?.github && (
                  <a
                    href={data.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${data.name} on GitHub`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--space-3)',
                      border: '0.5px solid var(--border-v2)',
                      color: 'var(--text-2)',
                    }}
                  >
                    <Github size={18} />
                  </a>
                )}
                {data.socialLinks?.linkedin && (
                  <a
                    href={data.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${data.name} on LinkedIn`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--space-3)',
                      border: '0.5px solid var(--border-v2)',
                      color: 'var(--text-2)',
                    }}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlipCard;
