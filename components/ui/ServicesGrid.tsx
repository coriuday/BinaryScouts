'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import TiltCard from '@/components/motion/TiltCard';
import ServiceCardVisual from '@/components/ui/ServiceCardVisual';
import ScrollReveal, { StaggerReveal } from '@/components/motion/ScrollReveal';

const CAPABILITIES = [
  {
    id: 'ai-systems',
    title: 'AI Systems',
    description: 'Custom AI pipelines, intelligent agents, and deep integrations built on state-of-the-art models.',
    href: '/services#ai-systems',
  },
  {
    id: 'saas-dev',
    title: 'SaaS Development',
    description: 'Full-stack web platforms engineered for performance and scale — from design systems to Rust API gateways.',
    href: '/services#saas-dev',
  },
  {
    id: 'crm',
    title: 'CRM Automation',
    description: 'Intelligent lead workflows, WhatsApp automation, email sequences, and CRM integrations that run 24/7.',
    href: '/services#crm',
  },
  {
    id: 'growth',
    title: 'Growth Engineering',
    description: 'Data-driven SEO infrastructure, paid acquisition systems, and conversion optimization at every funnel stage.',
    href: '/services#growth',
  },
  {
    id: 'dashboards',
    title: 'Enterprise Dashboards',
    description: 'Real-time analytics platforms and internal tooling that turn raw data into actionable business intelligence.',
    href: '/services#dashboards',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & DevOps',
    description: 'Scalable cloud architectures, CI/CD pipelines, containerized deployments, and API gateway engineering.',
    href: '/services#infrastructure',
  },
];

function ServiceCard({ cap, index }: { cap: typeof CAPABILITIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={cap.href} className="block h-full" data-cursor="pointer">
      <TiltCard
        className="rounded-2xl h-full cursor-pointer group relative overflow-hidden"
        intensity={10}
        scale={1.02}
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          minHeight: 280,
        }}
      >
        <div
          className="absolute top-4 left-4 font-mono text-[11px] font-medium z-10"
          style={{ color: '#00d4ff' }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <ServiceCardVisual type={cap.id} hovered={hovered} />

        <div
          className="relative z-10 p-7 pt-12 flex flex-col h-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h3
            className="font-sans font-medium text-xl mb-3"
            style={{ color: '#fff' }}
          >
            {cap.title}
          </h3>
          <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: '#888' }}>
            {cap.description}
          </p>
          <div
            className="flex items-center gap-1.5 mt-6 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: '#00d4ff' }}
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

const ServicesGrid: React.FC = () => {
  return (
    <section id="capabilities" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="max-w-2xl mb-20">
          <div className="eyebrow-badge mb-6">
            <Sparkles size={11} />
            <span>Our Arsenal</span>
          </div>
          <h2 className="font-sans font-medium text-4xl md:text-5xl leading-tight mb-4" style={{ color: '#fff' }}>
            Six disciplines.{' '}
            <span style={{ color: '#00d4ff' }}>One studio.</span>
          </h2>
          <p className="font-sans text-lg leading-relaxed" style={{ color: '#888' }}>
            We&apos;ve mastered the six systems every growing business needs — deployed as a single, integrated architecture.
          </p>
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1}>
          {CAPABILITIES.map((cap, i) => (
            <ServiceCard key={cap.id} cap={cap} index={i} />
          ))}
        </StaggerReveal>

        <ScrollReveal className="text-center mt-14" delay={0.2}>
          <Link href="/services">
            <button className="btn-secondary px-8 py-3.5 text-sm gap-2">
              Explore All Services
              <ArrowRight size={15} />
            </button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesGrid;
