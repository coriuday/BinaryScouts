'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Volume2, VolumeX, Settings } from 'lucide-react';
import { NAV_ITEMS } from '@/constants';
import { useAudio } from './AudioProvider';
import SettingsDrawer from './SettingsDrawer';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isMuted, toggleMute, playClick, playHover } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled
        ? 'bg-gx-black/95 backdrop-blur-md border-gx-green py-3'
        : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <Link
            href="/"
            onClick={playClick}
            onMouseEnter={playHover}
            className="flex-shrink-0 flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gx-green flex items-center justify-center font-display font-bold text-xl text-gx-black border-2 border-transparent group-hover:border-white transition-all">
              G
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter text-white uppercase group-hover:text-gx-green transition-colors">
              Glory<span className="text-gx-green group-hover:text-white">X</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={playClick}
                onMouseEnter={playHover}
                className="font-display text-lg font-bold uppercase tracking-wider text-white hover:text-gx-green transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gx-green after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/planner"
              onClick={playClick}
              onMouseEnter={playHover}
            >
              <button className="bg-gx-blue hover:bg-gx-orange text-white font-display font-bold uppercase tracking-wide px-6 py-2 border border-white/20 hover:border-white transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_rgba(255,255,255,0.1)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] clip-corner">
                Start Heist
              </button>
            </Link>

            {/* Audio Toggle */}
            <button
              onClick={handleMuteClick}
              onMouseEnter={playHover}
              title={isMuted ? "Enable Sound Context" : "Mute Sound Context"}
              className="p-2 text-white hover:text-gx-green transition-colors duration-200"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
            </button>

            {/* Settings System Config Toggle */}
            <button
              onClick={() => {
                playClick();
                setIsSettingsOpen(true);
              }}
              onMouseEnter={playHover}
              title="System Configurations"
              className="p-2 text-white hover:text-gx-green transition-colors hover:rotate-90 duration-500 cursor-pointer"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={handleMuteClick}
              className="text-white hover:text-gx-green p-2"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button
              onClick={() => {
                playClick();
                setIsSettingsOpen(true);
              }}
              className="text-white hover:text-gx-green p-2"
            >
              <Settings size={24} />
            </button>
            <button
              onClick={() => {
                playClick();
                setIsOpen(!isOpen);
              }}
              className="text-white hover:text-gx-green p-2 focus:outline-none"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-gx-black z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="px-4 pt-8 pb-3 space-y-4 flex flex-col h-full bg-grid-pattern bg-[length:20px_20px]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                playClick();
                setIsOpen(false);
              }}
              className="font-display text-4xl font-bold uppercase text-white hover:text-gx-green block border-b border-white/10 pb-4"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/planner"
            onClick={() => {
              playClick();
              setIsOpen(false);
            }}
            className="block w-full mt-8"
          >
            <button className="w-full bg-gx-green text-gx-black font-display font-bold text-xl uppercase py-4 hover:bg-white transition-colors">
              Start Heist
            </button>
          </Link>
        </div>
      </div>
      {/* Settings Drawer Panel */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
};

export default Navbar;