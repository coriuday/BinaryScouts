'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';
import { FLIP_TEAM_MEMBERS } from '@/lib/flip-team';

const TeamNew: React.FC = () => {
  return (
    <section id="team" style={{ backgroundColor: 'var(--space)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">THE TEAM</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 48 }}
        >
          Meet the <span className="v2-gradient-word">engineers</span><br />
          behind the systems.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto lg:max-w-none">
          {FLIP_TEAM_MEMBERS.map((member, i) => (
            <FlipCard key={member.name} data={member} index={i} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center mt-12">
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'var(--text-2)' }}>
            We are always looking for exceptional engineers. →{' '}
            <a href="/careers" style={{ color: 'var(--indigo)', fontWeight: 600, textDecoration: 'none' }}>See Open Roles</a>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamNew;
