'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import { Cpu, Layers, GitMerge, TrendingUp, BarChart3, Server, ArrowRight, Sparkles, DollarSign, Clock, ChevronDown } from 'lucide-react';
import { ease, dur, viewport } from '@/lib/motion';

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu, Layers, GitMerge, TrendingUp, BarChart3, Server,
};

interface ServiceDetail {
  id: string;
  icon: string;
  title: string;
  category: string;
  priceRange: string;
  timeframe: string;
  description: string;
  specs: string[];
  gradient: string;
  iconColor: string;
  accentBorder: string;
}

const SERVICES_DATA: ServiceDetail[] = [
  {
    id: '0',
    icon: 'Cpu',
    title: 'Full Stack Development',
    category: 'development',
    priceRange: '$12,000 – $50,000',
    timeframe: '4 – 10 weeks',
    description: 'Engineered for absolute performance. We build compiled endpoints, scalable database schemas, and beautiful client interfaces.',
    specs: ['Next.js React frontends', 'Rust Axum gateway routing', 'FastAPI Python AI microservices', 'Tailwind + Framer Motion'],
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    iconColor: 'var(--accent)',
    accentBorder: 'rgba(139,92,246,0.22)',
  },
  {
    id: '1',
    icon: 'TrendingUp',
    title: 'Digital Marketing',
    category: 'marketing',
    priceRange: '$5,000 – $20,000',
    timeframe: '2 – 4 weeks',
    description: 'Deploy custom automated ad funnels on search and social channels with instrumentation that ties spend to qualified pipeline.',
    specs: ['Paid traffic funnels', 'Bid optimisation engines', 'Pixel analytics tracking', 'Dynamic retargeting'],
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
    iconColor: 'var(--rose)',
    accentBorder: 'rgba(236,72,153,0.20)',
  },
  {
    id: '2',
    icon: 'GitMerge',
    title: 'CRM Automation',
    category: 'automation',
    priceRange: '$8,000 – $35,000',
    timeframe: '3 – 6 weeks',
    description: 'Integrate disconnected company databases into a central hub with message-queue listeners that trigger outreach as leads arrive.',
    specs: ['CRM Node.js bridges', 'PostgreSQL sync engines', 'Auto-outreach sequences', 'Data integrity sentry'],
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    iconColor: 'var(--accent)',
    accentBorder: 'rgba(139,92,246,0.22)',
  },
  {
    id: '3',
    icon: 'Server',
    title: 'SEO Optimisation',
    category: 'seo',
    priceRange: '$3,000 – $12,000',
    timeframe: '2 – 4 weeks',
    description: 'Re-engineer page structures for crawler efficiency, target high-intent keywords, and instrument rankings so growth is measurable.',
    specs: ['Next.js SSR tuning', 'Google crawler diagnostics', 'Structured schema markup', 'Content syndication scripts'],
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
    iconColor: 'var(--sage)',
    accentBorder: 'rgba(16,185,129,0.20)',
  },
  {
    id: '4',
    icon: 'Layers',
    title: 'Motion & Design',
    category: 'design',
    priceRange: '$4,000 – $15,000',
    timeframe: '2 – 5 weeks',
    description: 'Inject gorgeous interactive WebGL/CSS motion elements and premium animations that capture user attention instantly.',
    specs: ['Framer Motion systems', 'WebGL visual experiences', 'CSS animation libraries', 'Brand identity design'],
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
    iconColor: 'var(--rose)',
    accentBorder: 'rgba(236,72,153,0.20)',
  },
  {
    id: '5',
    icon: 'BarChart3',
    title: 'Enterprise Dashboards',
    category: 'development',
    priceRange: '$10,000 – $40,000',
    timeframe: '4 – 8 weeks',
    description: 'Real-time analytics platforms and internal tooling that turn raw data into actionable business intelligence.',
    specs: ['Real-time data streams', 'Custom chart systems', 'Role-based access control', 'Export & reporting engines'],
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    iconColor: 'var(--accent)',
    accentBorder: 'rgba(139,92,246,0.22)',
  },
  {
    id: '6',
    icon: 'TrendingUp',
    title: 'Social Media Strategy',
    category: 'marketing',
    priceRange: '$3,000 – $10,000',
    timeframe: '1 – 3 weeks',
    description: 'Scale brand outreach and social presence with community engagement automations, visual assets, and high-frequency content.',
    specs: ['Content calendars', 'Viral format testing', 'Community monitoring', 'Audience growth analytics'],
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
    iconColor: 'var(--rose)',
    accentBorder: 'rgba(236,72,153,0.20)',
  },
  {
    id: '7',
    icon: 'Cpu',
    title: 'AI Integrations',
    category: 'automation',
    priceRange: '$6,000 – $25,000',
    timeframe: '3 – 6 weeks',
    description: 'Embed state-of-the-art LLMs into your business workflows — from intelligent chat agents to automated content pipelines.',
    specs: ['GPT-4 / Gemini integrations', 'Custom AI agent design', 'Vector search systems', 'Function calling pipelines'],
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
    iconColor: 'var(--sage)',
    accentBorder: 'rgba(16,185,129,0.20)',
  },
];

const FILTERS = [
  { key: 'all',         label: 'All Services' },
  { key: 'development', label: 'Development' },
  { key: 'marketing',   label: 'Marketing' },
  { key: 'automation',  label: 'Automation' },
  { key: 'seo',         label: 'SEO' },
  { key: 'design',      label: 'Design' },
];

export default function ServicesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredServices = filter === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === filter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Page header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow-badge mb-6">
              <Sparkles size={11} />
              <span>What We Build</span>
            </div>
            <h1
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.05em' }}
            >
              Our{' '}
              <span className="gradient-text">Services</span>
            </h1>
            <p
              className="font-sans text-xl max-w-2xl leading-relaxed"
              style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              Precision-engineered systems that power modern businesses — from AI infrastructure to growth engineering.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all duration-250"
                style={{
                  background: filter === key ? 'var(--gradient-primary)' : 'var(--glass-2)',
                  color: filter === key ? '#fff' : 'var(--text-secondary)',
                  border: '1.5px solid',
                  borderColor: filter === key ? 'transparent' : 'var(--glass-border-2)',
                  boxShadow: filter === key ? 'var(--shadow-brand)' : 'var(--glass-inner)',
                  backdropFilter: 'blur(12px)',
                  letterSpacing: '-0.01em',
                }}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Services grid */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service, i) => {
                const Icon = ICON_MAP[service.icon] || Cpu;
                const isExpanded = expandedId === service.id;

                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                    className="glass-card rounded-3xl overflow-hidden cursor-pointer group"
                    onClick={() => toggleExpand(service.id)}
                    style={{ height: 'fit-content' }}
                  >
                    <div className="p-7">
                      {/* Icon */}
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: service.gradient, border: `1px solid ${service.accentBorder}` }}
                        >
                          <Icon size={21} style={{ color: service.iconColor }} />
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>

                      {/* Category badge */}
                      <div className="mb-3">
                        <span
                          className="font-sans text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: service.iconColor }}
                        >
                          {service.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-display font-bold text-xl mb-2 group-hover:text-[var(--accent)] transition-colors duration-200"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                      >
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="font-sans text-sm leading-relaxed mb-5"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {service.description}
                      </p>

                      {/* Price & timeframe */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={12} style={{ color: 'var(--text-muted)' }} />
                          <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            {service.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                          <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                            {service.timeframe}
                          </span>
                        </div>
                      </div>

                      {/* Expanded specs */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mt-5 pt-5"
                              style={{ borderTop: '1px solid var(--glass-border-1)' }}
                            >
                              <p
                                className="font-sans text-[11px] font-bold uppercase tracking-wider mb-3"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                Included
                              </p>
                              <ul className="space-y-2">
                                {service.specs.map((spec) => (
                                  <li
                                    key={spec}
                                    className="flex items-center gap-2 font-sans text-sm"
                                    style={{ color: 'var(--text-secondary)' }}
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{ background: 'var(--gradient-primary)' }}
                                    />
                                    {spec}
                                  </li>
                                ))}
                              </ul>
                              <a href="/planner" className="block mt-5">
                                <button className="btn-primary text-sm w-full justify-center gap-2">
                                  Start This Project
                                  <ArrowRight size={14} />
                                </button>
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <div
              className="glass-card rounded-[2.5rem] px-12 py-12 inline-block relative overflow-hidden"
            >
              <div
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
              />
              <div className="eyebrow-badge mx-auto mb-5">
                <Sparkles size={11} />
                <span>Get Started</span>
              </div>
              <h2
                className="font-display font-bold text-3xl md:text-4xl mb-4 relative z-10"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                Not sure where to{' '}
                <span className="gradient-text">begin?</span>
              </h2>
              <p className="font-sans text-base mb-8 max-w-md mx-auto relative z-10" style={{ color: 'var(--text-secondary)' }}>
                Book a free 30-minute strategy session and we&apos;ll map the exact systems your business needs.
              </p>
              <a href="/planner">
                <button className="btn-primary text-base px-10 py-4 gap-2">
                  <Sparkles size={16} />
                  Book a Free Strategy Call
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
