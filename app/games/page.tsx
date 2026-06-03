'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAudio } from '@/components/AudioProvider';
import { Play, Calendar, Trophy, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface GameRelease {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  description: string;
  imageUrl: string;
  missionBrief: string;
  weapons: string[];
  lootSecured: string[];
  clientReview: {
    quote: string;
    author: string;
    role: string;
  };
  status: 'Accomplished' | 'Active';
}

const RELEASES: GameRelease[] = [
  {
    id: 'marketing-conquest',
    title: 'GRAND THEFT AUTO: MARKETING CONQUEST',
    category: 'Digital Marketing',
    subtitle: 'Mission: Securing 5,000 sales on CRM autopilot',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Return on Ads', value: '410% ROI' },
      { label: 'Growth Scale', value: '3.5x' },
      { label: 'Customer CPA', value: '-42%' }
    ],
    description: 'We hijacked standard paid advertising channels and hotwired a custom tracking script to optimize acquisition bids in real-time. The payload? Massive growth.',
    missionBrief: 'Target client was bleeding marketing spend on broad keywords. The mission was to restrict wasted impressions, deploy semantic targeting pipelines, and scale sales automatically without bloating budgets.',
    weapons: ['PPC Ads', 'Halftone Scripts', 'Next.js Frontend Analytics', 'Custom Bid Managers'],
    lootSecured: [
      '+$1.4M Generated Revenue',
      '5,800+ Verified Customer Signups',
      '-42% Reduction in Cost Per Acquisition'
    ],
    clientReview: {
      quote: 'GloryX came in, stripped down our ad account, rewrote our conversion flows, and put the scale on auto. Absolute game-changers.',
      author: 'Vikram Vance',
      role: 'VP Marketing, Nexus Corp'
    },
    status: 'Accomplished'
  },
  {
    id: 'crm-pipeline',
    title: 'RED DEAD REDEMPTION: PIPELINE WILD WEST',
    category: 'Business Automation',
    subtitle: 'Mission: Taming 25,000 chaotic lead threads',
    imageUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Pipeline Errors', value: '-95%' },
      { label: 'Response Time', value: '<2 mins' },
      { label: 'Conversion Lift', value: '+34%' }
    ],
    description: 'We entered a lawless land of fragmented leads and manually typed spreadsheets. We established a secure, centralized CRM automated railroad that connects targets to closing agents instantly.',
    missionBrief: 'Tame a chaotic Wild West database of leads incoming from 6 disconnected social APIs. We deployed cron listeners, message queue routers, and built automated WhatsApp and email outreach bots to nurture leads.',
    weapons: ['Node.js API Bridges', 'WhatsApp API Orchestration', 'PostgreSQL Hub', 'CRM Cron Webhooks'],
    lootSecured: [
      '25,000+ Automated Leads Managed',
      '95% Reduction in Database Sync Errors',
      'Average Lead Response Time under 120 Seconds'
    ],
    clientReview: {
      quote: 'Our sales team used to spend hours sorting leads. Now the automation feeds them high-intent hot calls directly. The pipeline runs itself.',
      author: 'Clara Marston',
      role: 'Operations Director, Frontier Logistics'
    },
    status: 'Accomplished'
  },
  {
    id: 'seo-conquest',
    title: 'L.A. NOIRE: SEO SEARCH CONQUEST',
    category: 'SEO Optimization',
    subtitle: 'Mission: Investigating drops, ranking top #3',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Organic Traffic', value: '+400%' },
      { label: 'Domain Authority', value: '+28 pts' },
      { label: 'Lead Value', value: '+$340k' }
    ],
    description: 'We investigated a mysterious drop in organic visibility. We dug into competitor footprints, patched technical code leaks, and launched an aggressive content syndicate sequence.',
    missionBrief: 'The client lost 50% traffic after an algorithmic shift. We audited indexation pipelines, optimized server-side rendering loads, and scaled highly structured target terms to conquer primary page rankings.',
    weapons: ['Next.js SSR Tuning', 'Schema Markup Generators', 'Automated Content Pipelines', 'Crawler Diagnostic Tools'],
    lootSecured: [
      'Top #3 Ranking on 45 Main Competitive Terms',
      'Organic Traffic scale up by 400%',
      'Saving $30k monthly in PPC alternative bids'
    ],
    clientReview: {
      quote: 'They diagnosed issues that three previous SEO agencies missed. Within four months, our rankings skyrocketed. They know Google inside out.',
      author: 'Detective Phelps',
      role: 'CEO, CaseFinder SaaS'
    },
    status: 'Accomplished'
  },
  {
    id: 'video-render',
    title: 'MAX PAYNE: HIGH-SPEED BRAND RENDER',
    category: 'Video & Design',
    subtitle: 'Mission: Cinematic storytelling in bullet time',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    stats: [
      { label: 'Video Views', value: '4.2M' },
      { label: 'CTR Growth', value: '+85%' },
      { label: 'User Retention', value: '+70%' }
    ],
    description: 'A dark, moody aesthetic overhaul designed to command user retention. High-impact motion grids and dark UI assets that load in bullet time.',
    missionBrief: 'Rewrite the client\'s visual identity from generic corporate design to an edgy, premium tech branding layout, and produce a flagship CGI cinematic promotional clip.',
    weapons: ['After Effects & Cinema 4D', 'Halftone Shaders', 'WebM High Compression Codecs', 'Dynamic CSS Animations'],
    lootSecured: [
      '4.2 Million Cross-platform Views',
      '85% Increase in Interactive CTA Clickthroughs',
      'Average Brand Watch Duration Increased by 70%'
    ],
    clientReview: {
      quote: 'The video asset they produced went viral on Twitter. Our brand identity looks extremely premium now. They delivered exactly what we wanted.',
      author: 'Mona Sax',
      role: 'Founder, Noir Studios'
    },
    status: 'Accomplished'
  }
];

export default function GamesPage() {
  const { playClick, playHover, playSuccess } = useAudio();
  const [activeGame, setActiveGame] = useState<GameRelease | null>(null);

  const openDossier = (game: GameRelease) => {
    playSuccess();
    setActiveGame(game);
  };

  const closeDossier = () => {
    playClick();
    setActiveGame(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      {/* Glitch sweep animation */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed left-0 right-0 h-12 bg-gradient-to-b from-transparent via-gx-green/20 to-transparent pointer-events-none z-[100] shadow-[0_0_10px_#79c043]"
      />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Background texture */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.03] pointer-events-none z-0" />

        {/* Page title */}
        <div className="mb-16 border-b-4 border-gx-green pb-6">
          <span className="block text-gx-green font-display font-bold tracking-[0.2em] uppercase mb-2">
            GloryX Projects
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">
            Our Releases
          </h1>
        </div>

        {/* Featured Release banner */}
        <div className="mb-16 border border-gx-orange/30 bg-gx-dark relative overflow-hidden group clip-corner">
          <div className="absolute inset-0 bg-gx-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-gx-black via-gx-black/75 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1519608487953-e999c9dc296f?q=80&w=1600&auto=format&fit=crop"
            alt="Latest Release"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-40"
          />
          <div className="relative z-20 p-8 md:p-16 max-w-2xl flex flex-col items-start gap-4">
            <span className="bg-gx-orange text-white font-display font-bold uppercase text-2xs tracking-widest px-4 py-1">
              Latest Masterpiece
            </span>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white uppercase tracking-tighter leading-none mt-2">
              REWRITING THE MARKETING MATRIX
            </h2>
            <p className="text-gray-300 font-mono text-sm leading-relaxed mb-4">
              Explore how we built the customized heist setups, automated CRM pipelines, and executed SEO conquests for our client organizations. Select a title below for the full mission briefing.
            </p>
            <button
              onClick={() => openDossier(RELEASES[0])}
              onMouseEnter={playHover}
              className="px-8 py-4 bg-gx-green hover:bg-white text-gx-black font-display font-bold text-lg uppercase transition-colors duration-300 flex items-center gap-2 clip-corner"
            >
              <Play className="fill-current" size={16} />
              <span>Analyze Featured Mission</span>
            </button>
          </div>
        </div>

        {/* Games Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RELEASES.map((game) => (
            <div
              key={game.id}
              onClick={() => openDossier(game)}
              onMouseEnter={playHover}
              className="group border border-white/5 bg-gx-dark hover:border-gx-green transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Artwork */}
              <div className="relative h-64 w-full bg-gx-gray overflow-hidden">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gx-dark to-transparent opacity-90" />
                
                <span className="absolute top-4 left-4 bg-gx-black/80 backdrop-blur border border-gx-green/20 text-gx-green font-display font-bold uppercase text-2xs px-3 py-1 tracking-widest">
                  {game.category}
                </span>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 justify-between items-end">
                  <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tighter group-hover:text-gx-green transition-colors leading-tight">
                    {game.title}
                  </h3>
                </div>
              </div>

              {/* Description & Mini Stats */}
              <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                <p className="text-gray-400 font-mono text-xs leading-relaxed">
                  {game.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                  {game.stats.map((st) => (
                    <div key={st.label} className="text-left font-mono">
                      <span className="block text-[10px] text-gray-500 uppercase">{st.label}</span>
                      <span className="text-sm font-bold text-white uppercase">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer action bar */}
              <div className="bg-gx-black/80 p-4 border-t border-white/5 flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-gx-green">
                <span>Mission Accomplished</span>
                <span className="group-hover:translate-x-2 transition-transform duration-200">Read Briefing &gt;&gt;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Dossier Modal overlay */}
        {activeGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gx-black/90 backdrop-blur-md crt-screen crt-flicker">
            <div className="bg-gx-dark border-2 border-gx-green max-w-3xl w-full max-h-[85vh] overflow-y-auto relative clip-corner p-6 md:p-10 shadow-[0_0_50px_rgba(121,192,67,0.3)]">
              
              {/* Close Button */}
              <button
                onClick={closeDossier}
                onMouseEnter={playHover}
                className="absolute top-4 right-4 text-gx-green hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>

              {/* Modal Header */}
              <div className="border-b border-gx-green/20 pb-4 mb-6 text-left">
                <span className="text-gx-orange font-mono text-2xs uppercase tracking-widest font-bold">
                  CLASSIFIED MISSION DIRECTORY // VOL.{activeGame.id.toUpperCase()}
                </span>
                <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter text-white mt-1">
                  {activeGame.title}
                </h2>
                <p className="text-gx-green font-mono text-xs mt-2 uppercase font-bold">
                  {activeGame.subtitle}
                </p>
              </div>

              {/* Modal Content */}
              <div className="space-y-6 font-mono text-xs leading-relaxed text-gray-300 text-left">
                
                {/* Stats cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeGame.stats.map((st) => (
                    <div key={st.label} className="bg-gx-black p-4 border border-gx-gray flex flex-col justify-center items-center">
                      <span className="text-gray-500 uppercase tracking-widest text-3xs mb-1">{st.label}</span>
                      <span className="text-lg font-display font-bold text-gx-green uppercase">{st.value}</span>
                    </div>
                  ))}
                </div>

                {/* Brief section */}
                <div>
                  <h4 className="text-white font-display font-bold text-base uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="text-gx-green w-4 h-4" />
                    <span>Mission Parameters & Objective</span>
                  </h4>
                  <p className="bg-gx-black/40 p-4 border border-white/5 italic">
                    &quot;{activeGame.missionBrief}&quot;
                  </p>
                </div>

                {/* Grid layout for Weapons & Loot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-display font-bold text-base uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Trophy className="text-gx-orange w-4 h-4" />
                      <span>Weapons Array (Tech Used)</span>
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-gray-400 pl-1">
                      {activeGame.weapons.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-display font-bold text-base uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="text-gx-green w-4 h-4" />
                      <span>Loot Secured (Deliverables)</span>
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-gray-400 pl-1">
                      {activeGame.lootSecured.map((l) => (
                        <li key={l} className="font-bold text-white">{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Testimonial review */}
                <div className="border-t border-white/5 pt-6 mt-4">
                  <h4 className="text-white font-display font-bold text-base uppercase tracking-wider mb-2">
                    Client Transmission log
                  </h4>
                  <div className="bg-gx-black/50 p-4 border border-gx-gray">
                    <p className="italic text-gray-400 mb-2 font-light">
                      &quot;{activeGame.clientReview.quote}&quot;
                    </p>
                    <div className="text-right">
                      <span className="block font-bold text-gx-green text-[10px]">{activeGame.clientReview.author}</span>
                      <span className="block text-gray-500 text-[9px] uppercase">{activeGame.clientReview.role}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="flex justify-end border-t border-white/5 pt-6 mt-8">
                <button
                  onClick={closeDossier}
                  onMouseEnter={playHover}
                  className="px-8 py-3 bg-gx-green text-gx-black hover:bg-white font-display font-bold uppercase transition-colors duration-300 clip-corner"
                >
                  Close Archive
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </motion.div>
  );
}
