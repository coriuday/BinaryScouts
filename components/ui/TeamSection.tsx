'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Sparkles, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { getTeamMembers, SKILL_CATEGORY_COLORS, type TeamMember } from '@/lib/team';
import { ease, dur } from '@/lib/motion';

/* ── Skill bar ───────────────────────────────────────── */
const SkillBar: React.FC<{ name: string; level: number; color: string; index: number }> = ({
  name, level, color, index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: dur.base, ease: ease.out, delay: index * 0.04 }}
  >
    <div className="flex justify-between items-center mb-1.5">
      <span className="font-sans text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {name}
      </span>
      <span className="font-mono text-[10px] font-bold" style={{ color }}>
        {level}%
      </span>
    </div>
    <div
      className="h-1 rounded-full overflow-hidden"
      style={{ background: 'var(--glass-border-1)' }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}40` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: ease.out, delay: 0.2 + index * 0.04 }}
      />
    </div>
  </motion.div>
);

/* ── Member card ────────────────────────────────────── */
const MemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Show all skills when expanded, first 5 otherwise
  const visibleSkills = expanded ? member.skills : member.skills.slice(0, 5);

  // Initials for avatar
  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: dur.medium, delay: index * 0.12, ease: ease.out }}
    >
      <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
        {/* Header gradient band */}
        <div
          className="h-1.5 w-full"
          style={{
            background: 'var(--gradient-primary)',
          }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Avatar + info row */}
          <div className="flex items-start gap-4 mb-5">
            {member.avatar ? (
              <Image
                src={member.avatar}
                alt={member.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                style={{ border: '2px solid var(--glass-border-2)' }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-bold text-lg text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="font-display font-bold text-lg leading-tight mb-0.5 truncate"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                {member.name}
              </h3>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--accent)' }}>
                {member.role}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {member.bio}
          </p>

          {/* Stats row */}
          <div
            className="grid grid-cols-2 gap-3 mb-5 pb-5"
            style={{ borderBottom: '1px solid var(--glass-border-1)' }}
          >
            <div
              className="rounded-2xl p-3 text-center"
              style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border-1)' }}
            >
              <p className="font-display font-bold text-xl leading-none mb-1" style={{ color: 'var(--accent)', letterSpacing: '-0.04em' }}>
                {member.experience}+
              </p>
              <p className="font-sans text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Years exp.
              </p>
            </div>
            <div
              className="rounded-2xl p-3 text-center"
              style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border-1)' }}
            >
              <p className="font-display font-bold text-xl leading-none mb-1" style={{ color: 'var(--accent)', letterSpacing: '-0.04em' }}>
                {member.badges[0] || member.role.split('·')[0].trim()}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Focus
              </p>
            </div>
          </div>

          {/* Skill bars */}
          <div className="flex flex-col gap-3 mb-4">
            {visibleSkills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                color={SKILL_CATEGORY_COLORS[skill.category]}
                index={i}
              />
            ))}
          </div>

          {/* Expand toggle */}
          {member.skills.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 font-sans text-xs font-semibold transition-all duration-200 hover:gap-2.5 mt-1"
              style={{ color: 'var(--accent)' }}
            >
              {expanded ? (
                <>
                  <ChevronUp size={13} />
                  Show fewer skills
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  +{member.skills.length - 5} more skills
                </>
              )}
            </button>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5" style={{ borderTop: '1px solid var(--glass-border-1)' }}>
            {member.badges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  border: '1px solid var(--glass-border-2)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   TEAM SECTION
══════════════════════════════════════════════════════════ */
const TeamSection: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(() => getTeamMembers());

  useEffect(() => {
    fetch('/api/cms/team')
      .then((r) => r.json())
      .then((d) => {
        if (d.members?.length) setMembers(d.members);
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="team"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="orb absolute w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, var(--orb-violet) 0%, transparent 65%)',
            top: '-10%', right: '-5%',
            filter: 'blur(80px)',
            animation: 'atmosphericFloat 20s ease-in-out infinite',
          }}
        />
        <div
          className="orb absolute w-[350px] h-[350px]"
          style={{
            background: 'radial-gradient(circle, var(--orb-sage) 0%, transparent 65%)',
            bottom: '-5%', left: '-5%',
            filter: 'blur(80px)',
            animation: 'atmosphericFloat 15s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: ease.out }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 eyebrow-badge mb-6">
            <Users size={11} />
            <span>The Team</span>
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-4 max-w-2xl mx-auto"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
          >
            Engineers who{' '}
            <span className="gradient-text gradient-text-animated">build the future.</span>
          </h2>
          <p
            className="font-sans text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            A small team of specialists, each exceptional in their domain. We don&apos;t scale with headcount — we scale with capability.
          </p>
        </motion.div>

        {/* Team cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: 'var(--glass-1)',
              border: '1px solid var(--glass-border-1)',
            }}
          >
            <Code2 size={14} style={{ color: 'var(--accent)' }} />
            <p className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>
              We&apos;re hiring exceptional engineers.{' '}
              <a href="/careers" className="font-semibold" style={{ color: 'var(--accent)' }}>
                View open positions →
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
