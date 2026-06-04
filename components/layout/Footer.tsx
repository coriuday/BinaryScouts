'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Globe, Check } from 'lucide-react';
import { useAudio } from '@/components/hooks/AudioProvider';

const Footer: React.FC = () => {
  const { playClick, playHover, playSuccess } = useAudio();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    playSuccess();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-gx-dark border-t-4 border-gx-blue text-white pt-24 pb-12 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute -bottom-20 -left-20 pointer-events-none opacity-[0.02] transform rotate-12">
        <h1 className="text-[300px] font-display font-bold uppercase leading-none">GloryX</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* Brand Col */}
          <div className="col-span-1">
            <Link
              href="/"
              onClick={playClick}
              onMouseEnter={playHover}
              className="flex items-center gap-2 mb-8 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-white text-gx-black flex items-center justify-center font-display font-bold text-lg">G</div>
              <span className="font-display font-bold text-2xl tracking-tighter uppercase group-hover:text-gx-green transition-colors">GloryX</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Redefining the agency experience with raw creativity and precise automation.
              We don&apos;t follow trends, we set the trajectory.
            </p>
            <div className="flex space-x-6">
              {[Globe, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" onClick={playClick} onMouseEnter={playHover} className="text-gray-500 hover:text-gx-green transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-bold text-xl uppercase tracking-widest mb-8 text-gx-green border-b border-gx-green/30 pb-2 inline-block">Company</h4>
            <ul className="space-y-4 font-sans text-gray-400">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Press', href: '/about#press' },
                { label: 'Legal', href: '/terms' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className="hover:text-white hover:translate-x-2 transition-all block duration-300"
                  >
                    / {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Links */}
          <div>
            <h4 className="font-display font-bold text-xl uppercase tracking-widest mb-8 text-gx-orange border-b border-gx-orange/30 pb-2 inline-block">Expertise</h4>
            <ul className="space-y-4 font-sans text-gray-400">
              {[
                { label: 'Marketing', href: '/services#marketing' },
                { label: 'Development', href: '/services#development' },
                { label: 'Design', href: '/services#design' },
                { label: 'Automation', href: '/services#automation' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className="hover:text-white hover:translate-x-2 transition-all block duration-300"
                  >
                    / {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-xl uppercase tracking-widest mb-8 text-gx-blue border-b border-gx-blue/30 pb-2 inline-block">Join the Crew</h4>
            {subscribed ? (
              <div className="bg-gx-green/10 border border-gx-green p-4 font-mono text-xs text-gx-green flex items-center gap-2 animate-pulse uppercase font-bold">
                <Check size={16} />
                <span>SECURE TRANSMISSION CONFIRMED. YOU ARE IN the crew.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL"
                  required
                  className="bg-gx-black border-2 border-gray-800 p-4 text-sm focus:outline-none focus:border-gx-green transition-colors text-white font-bold uppercase placeholder-gray-600"
                />
                <button
                  type="submit"
                  onMouseEnter={playHover}
                  className="bg-gx-green hover:bg-white text-gx-black font-display font-bold uppercase py-4 tracking-wider transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-none translate-x-0 hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-wider">
          <p>&copy; 2026 GloryX Agency. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link
              href="/privacy"
              onClick={playClick}
              onMouseEnter={playHover}
              className="hover:text-gx-green transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={playClick}
              onMouseEnter={playHover}
              className="hover:text-gx-green transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;