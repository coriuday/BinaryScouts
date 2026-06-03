'use client';

import React from 'react';
import { FEATURES } from '@/constants';
import { Wifi, Radio } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white text-gx-black relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-[0.03]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div>
            <h2 className="font-display font-bold text-6xl md:text-7xl uppercase tracking-tighter mb-8 leading-none text-gx-black">
              Engineered for <br />
              <span className="text-gx-green bg-gx-black px-2 inline-block transform -skew-x-6">Growth</span>
            </h2>

            <p className="font-sans text-xl text-gray-700 mb-6 font-light leading-relaxed border-l-4 border-gx-orange pl-6">
              GloryX isn&apos;t just an agency; it&apos;s an arsenal. We combine cutting-edge automation technology with high-octane creative services to streamline your business and amplify your brand voice.
            </p>

            <p className="font-sans text-lg text-gray-600 mb-12">
              From the grit of backend automation to the polish of frontend design, we handle the entire spectrum of digital dominance.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-gray-100 p-4 border-l-4 hover:bg-gray-200 transition-colors cursor-default group"
                  style={{ borderColor: feature.color === 'orange' ? '#f58220' : feature.color === 'blue' ? '#0f2b5c' : '#79c043' }}>
                  <feature.icon className={`w-8 h-8 ${feature.color === 'orange' ? 'text-gx-orange' : feature.color === 'blue' ? 'text-gx-blue' : 'text-gx-green'
                    }`} />
                  <span className="font-display font-bold uppercase text-lg tracking-wide">{feature.title}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <button className="px-10 py-4 bg-transparent border-2 border-gx-black text-gx-black font-display font-bold text-xl uppercase tracking-wider hover:bg-gx-black hover:text-white transition-colors duration-300 clip-corner">
                Read Manifesto
              </button>
            </div>
          </div>

          {/* Graphic Element */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gx-blue to-gx-green opacity-20 blur-3xl rounded-full"></div>

            <div className="relative bg-gx-black p-2 border border-gx-gray shadow-2xl transform rotate-1">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>

              {/* Fake Map Image */}
              <div className="relative overflow-hidden bg-gx-dark h-[500px] w-full group">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                  alt="Global Network"
                  className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Overlay UI elements similar to game map */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,43,92,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(15,43,92,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="absolute bottom-6 left-6 right-6 bg-gx-black/90 backdrop-blur border-l-4 border-gx-green p-5 flex justify-between items-center">
                  <div>
                    <div className="text-gx-green font-display text-sm uppercase mb-1 tracking-wider">System Status</div>
                    <div className="text-white font-mono text-xs">Optimal. Protocols Active.</div>
                  </div>
                  <Wifi className="text-gx-green animate-pulse" />
                </div>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <h3 className="text-6xl text-white/10 font-display font-bold uppercase tracking-widest whitespace-nowrap">Global Network</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;