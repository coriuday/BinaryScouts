'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { getAllProjects, PROJECT_CATEGORIES, type Project } from '@/lib/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import { ease, dur } from '@/lib/motion';

const ProjectGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [allProjects, setAllProjects] = useState<Project[]>(() => getAllProjects());

  useEffect(() => {
    fetch('/api/cms/projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.length) setAllProjects(d.projects);
      })
      .catch(() => {});
  }, []);

  const projects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((p) => p.category === activeCategory);
  }, [allProjects, activeCategory]);

  return (
    <div>
      {/* ── Category Filter Tabs ─────────────────────────── */}
      <LayoutGroup>
        <div
          className="flex flex-wrap gap-2 mb-12"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {PROJECT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className="relative px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'transparent' : 'var(--glass-1)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--glass-border-1)'}`,
                }}
              >
                {/* Active pill background */}
                {isActive && (
                  <motion.span
                    layoutId="active-filter"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* ── Project Grid ────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: dur.base, ease: ease.out }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
          {projects.length === 0 && (
            <motion.div
              className="col-span-3 text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-sans text-base" style={{ color: 'var(--text-muted)' }}>
                No projects in this category yet — check back soon.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;
