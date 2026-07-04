'use client';

import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TEAM = [
  { name: 'Zaid Ahmad', initials: 'ZA', role: 'Lead AI Engineer', roleColor: '#6366f1', bio: 'Architecting intelligent systems with GPT-4, LangChain, and custom ML pipelines. Previously built AI infrastructure at scale.', skills: ['Python', 'LangChain', 'GPT-4'], gradient: 'linear-gradient(135deg, #6366f1, #a78bfa)' },
  { name: 'Priya Sharma', initials: 'PS', role: 'Full-Stack Dev', roleColor: '#22d3ee', bio: 'Next.js and React specialist who writes code that runs at 98+ Lighthouse scores. Obsessed with performance.', skills: ['Next.js', 'React', 'TypeScript'], gradient: 'linear-gradient(135deg, #22d3ee, #6366f1)' },
  { name: 'Arjun Mehta', initials: 'AM', role: 'DevOps Engineer', roleColor: '#06b6d4', bio: 'Cloud infrastructure architect specializing in Docker, Kubernetes, and zero-downtime deployments across AWS and GCP.', skills: ['Docker', 'K8s', 'AWS'], gradient: 'linear-gradient(135deg, #06b6d4, #10b981)' },
  { name: 'Kavya Reddy', initials: 'KR', role: 'Growth Engineer', roleColor: '#f59e0b', bio: 'Data-driven growth specialist who builds SEO systems and analytics pipelines that drive measurable revenue.', skills: ['SEO', 'Analytics', 'Python'], gradient: 'linear-gradient(135deg, #f59e0b, #22d3ee)' },
];

const TeamCard: React.FC<{ member: typeof TEAM[0]; index: number }> = ({ member, index }) => {
  const [hovered, setHovered] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 1024) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    ref.current.style.transition = 'transform 0.1s ease';
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          background: 'var(--space-2)',
          border: `0.5px solid ${hovered ? 'rgba(99,102,241,0.2)' : 'var(--border-v2)'}`,
          borderRadius: 20,
          padding: 28,
          overflow: 'hidden',
          position: 'relative',
          transition: 'border-color 0.3s',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: member.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 28,
            color: '#fff',
            marginBottom: 16,
            boxShadow: hovered ? `0 0 0 3px var(--indigo), 0 0 20px var(--indigo-glow)` : 'none',
            transition: 'box-shadow 0.3s',
          }}
        >
          {member.initials}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 18, color: 'var(--text-1)', marginBottom: 4 }}>
          {member.name}
        </h3>

        {/* Role */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: member.roleColor, marginBottom: 12 }}>
          {member.role}
        </p>

        {/* Bio */}
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          {member.bio}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.skills.map((skill) => (
            <span
              key={skill}
              style={{
                background: 'var(--space-3)',
                border: '0.5px solid var(--border-v2)',
                borderRadius: 6,
                padding: '4px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-3)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Social links on hover */}
        <div style={{ overflow: 'hidden', height: hovered ? 36 : 0, transition: 'height 0.3s ease' }}>
          <div className="flex gap-2" style={{ transform: hovered ? 'translateY(0)' : 'translateY(16px)', opacity: hovered ? 1 : 0, transition: 'all 0.3s ease' }}>
            {['GitHub', 'LinkedIn'].map((s, i) => (
              <motion.a
                key={s}
                href="#"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-3)',
                  textDecoration: 'none',
                  border: '0.5px solid var(--border-v2)',
                }}
              >
                {s === 'GitHub' ? 'GH' : 'in'}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
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
