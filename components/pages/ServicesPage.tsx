'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAudio } from '@/components/hooks/AudioProvider';
import { SERVICES } from '@/constants';
import { ShieldCheck, Cpu, Sliders, DollarSign, Calendar } from 'lucide-react';

interface ServiceDetail {
  id: string;
  title: string;
  category: 'marketing' | 'automation' | 'seo' | 'design' | 'development';
  priceRange: string;
  clearanceLevel: string;
  specs: string[];
  operationalScope: string;
  imageUrl: string;
}

const SERVICES_EXTENDED: ServiceDetail[] = [
  {
    id: '0',
    title: 'Full Stack Development',
    category: 'development',
    priceRange: '$12,000 - $50,000',
    clearanceLevel: 'LEVEL 5 ENCRYPTED',
    specs: ['Next.js React Frontends', 'Rust Axum Gateway Routing', 'FastAPI Python AI Microservices', 'Tailwind CSS animations'],
    operationalScope: 'Engineered for absolute performance. We build compiled endpoints, scalable database schemes, and gorgeous client interfaces that run in bullet time.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '1',
    title: 'Digital Marketing',
    category: 'marketing',
    priceRange: '$5,000 - $20,000',
    clearanceLevel: 'LEVEL 4 APPROVED',
    specs: ['Paid Traffic Funnels', 'Halftone Bid Optimizers', 'Pixel Analytics tracking', 'Dynamic Retargeting grids'],
    operationalScope: 'Deploy custom automated ad funnels on search and social channels, using custom bid engines to decrease lead costs by up to 45%.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Business Automation',
    category: 'automation',
    priceRange: '$8,000 - $35,000',
    clearanceLevel: 'LEVEL 5 ENCRYPTED',
    specs: ['CRM Node.js Bridges', 'PostgreSQL Sync Engines', 'Auto-Outreach Railroads', 'Data Integrity Sentry'],
    operationalScope: 'Integrate disconnected company databases into a central Postgres hub, deploying message queue listeners to trigger email/SMS outreach under 120s.',
    imageUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'SEO Optimization',
    category: 'seo',
    priceRange: '$3,000 - $12,000',
    clearanceLevel: 'LEVEL 3 COMPLIANT',
    specs: ['Next.js SSR Tuning', 'Google Crawler Diagnostic', 'Structured Schema markup', 'Content syndicates scripts'],
    operationalScope: 'Re-engineer client page structures for search crawler efficiency, index high-intent keywords, and achieve rank #1 to #3 placements organic.',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Motion Graphics',
    category: 'design',
    priceRange: '$4,000 - $15,000',
    clearanceLevel: 'LEVEL 3 COMPLIANT',
    specs: ['WebM high compression', 'CGI visual blueprints', 'Halftone shader grids', 'CSS animations library'],
    operationalScope: 'Inject gorgeous interactive WebGL/CSS motion elements and premium CGI animations that capture user attention instantly.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Video Production',
    category: 'design',
    priceRange: '$10,000 - $50,000',
    clearanceLevel: 'LEVEL 4 APPROVED',
    specs: ['Cinema 4D Rendering', 'Storyline storyboard', 'Advanced color grading', 'Audio tracks syncing'],
    operationalScope: 'Construct epic cinematic promo clips and viral branding trailers with dark-mode cyberpunk design aesthetics.',
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Social Media Strategy',
    category: 'marketing',
    priceRange: '$3,000 - $10,000',
    clearanceLevel: 'LEVEL 2 PUBLIC',
    specs: ['Content calendars', 'Viral format testing', 'Community monitoring bots', 'Audience growth analytics'],
    operationalScope: 'Scale brand outreach and social presence with community engagement automations, visual assets, and high-frequency content.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'LinkedIn Automation',
    category: 'automation',
    priceRange: '$4,000 - $15,000',
    clearanceLevel: 'LEVEL 4 APPROVED',
    specs: ['B2B lead triggers', 'Sequence scripts templates', 'API limit bypass filters', 'Profile views triggers'],
    operationalScope: 'Establish autonomous outbound messaging on LinkedIn using safe proxy limits, driving B2B client connections in background.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '8',
    title: 'Graphic Design',
    category: 'design',
    priceRange: '$2,500 - $8,000',
    clearanceLevel: 'LEVEL 3 COMPLIANT',
    specs: ['Vector blueprints systems', 'Custom icons sets', 'Typographic sheets', 'CRT layouts templates'],
    operationalScope: 'Craft cohesive brand guidelines, vector logos, and UI asset kits modeled after premium cyberpunk/retro hacker layouts.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143a4d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '9',
    title: 'WhatsApp Automation',
    category: 'automation',
    priceRange: '$5,000 - $18,000',
    clearanceLevel: 'LEVEL 4 APPROVED',
    specs: ['WhatsApp Cloud API setup', 'Dialogflow agents routing', 'Broadcast cron timers', 'Conversion triggers logs'],
    operationalScope: 'Nurture client targets instantly on WhatsApp with automated bots that dispatch scheduling links or security status alerts.',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ServicesPage() {
  const { playClick, playHover, playSuccess } = useAudio();
  const [filter, setFilter] = useState<'all' | 'marketing' | 'automation' | 'seo' | 'design' | 'development'>('all');
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);

  const filteredServices = filter === 'all'
    ? SERVICES_EXTENDED
    : SERVICES_EXTENDED.filter(s => s.category === filter);

  const selectService = (service: ServiceDetail) => {
    playSuccess();
    setActiveService(activeService?.id === service.id ? null : service);
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    playClick();
    setFilter(newFilter);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.02] pointer-events-none z-0" />

        {/* Page Title */}
        <div className="mb-12 border-b-4 border-gx-orange pb-6 text-left">
          <span className="block text-gx-orange font-display font-bold tracking-[0.2em] uppercase mb-2">
            AGENCY WEAPONS DEPLOYMENT
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">
            OUR INVENTORY
          </h1>
        </div>

        {/* Categories Filtering tabs */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-white/5 pb-6 font-mono text-xs">
          {(['all', 'marketing', 'automation', 'seo', 'design', 'development'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-4 py-2 border uppercase font-bold transition-all ${
                filter === cat
                  ? 'border-gx-green bg-gx-green/10 text-white'
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {"// "}{cat}
            </button>
          ))}
        </div>

        {/* Services layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => selectService(service)}
                  onMouseEnter={playHover}
                  className={`border cursor-pointer transition-all duration-300 p-6 flex flex-col justify-between h-72 relative overflow-hidden group clip-corner ${
                    activeService?.id === service.id
                      ? 'border-gx-green bg-gx-green/5 shadow-[0_0_20px_rgba(121,192,67,0.15)]'
                      : 'border-white/5 bg-gx-dark hover:border-gx-green/50'
                  }`}
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gx-dark via-gx-dark/90 to-transparent"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 font-mono text-3xs uppercase font-bold tracking-widest">
                        WEAPON CODE: GX-0{service.id}
                      </span>
                      <span className="text-gx-orange font-mono text-3xs font-bold uppercase">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl uppercase tracking-tighter text-white mt-2 group-hover:text-gx-green transition-colors leading-tight">
                      {service.title}
                    </h3>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-white/5 flex justify-between items-center text-3xs font-mono text-gray-400 uppercase font-bold">
                    <span>SECURITY: {service.clearanceLevel.split(' ')[1]}</span>
                    <span className="text-gx-green group-hover:translate-x-1 transition-transform">EXPAND SPECS &gt;</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Interactive Specifications panel */}
          <div className="lg:col-span-1">
            <div className="bg-gx-dark border-2 border-gx-green p-6 md:p-8 clip-corner shadow-[0_0_30px_rgba(121,192,67,0.1)] min-h-[500px] flex flex-col justify-between font-mono text-xs">
              {activeService ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gx-green/20 pb-4">
                    <span className="text-gx-orange text-3xs font-bold uppercase tracking-widest">WEAPON DETAILS RECORD</span>
                    <h3 className="font-display font-bold text-2xl text-white uppercase mt-1 leading-tight">{activeService.title}</h3>
                    <p className="text-gx-green text-3xs font-bold mt-1 uppercase">{activeService.clearanceLevel}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-gx-green" />
                      <span>OPERATIONAL SCOPE</span>
                    </h4>
                    <p className="text-gray-400 text-2xs leading-relaxed">{activeService.operationalScope}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-gx-green" />
                      <span>TECHNICAL SPECS</span>
                    </h4>
                    <ul className="space-y-1.5 text-2xs text-gray-300 list-inside list-disc pl-1">
                      {activeService.specs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-gx-green/20 pt-4 mt-6">
                    <div className="bg-gx-black p-3 border border-white/5 text-center">
                      <span className="block text-gray-500 text-3xs uppercase font-bold mb-1 flex items-center justify-center gap-0.5">
                        <DollarSign className="w-3 h-3" />
                        <span>EST. POOL</span>
                      </span>
                      <span className="text-white font-bold text-2xs">{activeService.priceRange.split(' ')[0]}</span>
                    </div>

                    <div className="bg-gx-black p-3 border border-white/5 text-center">
                      <span className="block text-gray-500 text-3xs uppercase font-bold mb-1 flex items-center justify-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>TIMEFRAME</span>
                      </span>
                      <span className="text-white font-bold text-2xs">3 - 6 WEEKS</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-grow text-gray-500 p-8 space-y-4">
                  <ShieldCheck className="w-16 h-16 text-gray-700 animate-pulse" />
                  <p className="text-2xs font-bold uppercase tracking-widest">
                    SELECT A WEAPON FROM THE INVENTORY TO EXAMINE TARGET SPECIFICATIONS.
                  </p>
                </div>
              )}

              <div className="border-t border-white/5 pt-4 mt-8 flex justify-center">
                <a href="/planner" onClick={playClick} className="w-full text-center">
                  <button className="w-full bg-gx-green hover:bg-white text-gx-black font-display font-bold uppercase py-3 transition-colors clip-corner text-sm">
                    START DEPLOYMENT PLANNER
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </motion.div>
  );
}
