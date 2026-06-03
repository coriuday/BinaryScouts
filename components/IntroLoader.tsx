'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioProvider';

interface IntroLoaderProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'GLORYX CORE SECURITY INTERFACE v2.5.0',
  'INITIALIZING SYSTEM DECRYPTOR...',
  'ESTABLISHING CONNECTION TO SECURE NETWORK... [OK]',
  'MOUNTING VIRTUAL H.U.D. OVERLAYS... [OK]',
  'CALIBRATING WEB AUDIO SYNTHESIZERS... [OK]',
  'BYPASSING SECURITY FIREWALL PROTOCOLS... [OK]',
  'SYNCING PROJECT DATA PACKAGES... [OK]',
  'ESTABLISHING LINK TO THE MATRIX... [CONNECTED]',
  'DECRYPTION COMPLETE. BOOTING GLORYX PLATFORM...'
];

const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const { playHover, playBoot, playSuccess } = useAudio();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  // Print logs sequentially
  useEffect(() => {
    if (logIndex < BOOT_LOGS.length && !isSkipped) {
      const delay = logIndex === 0 ? 200 : Math.random() * 250 + 100;
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, BOOT_LOGS[logIndex]]);
        setLogIndex(logIndex + 1);
        playHover(); // Play subtle click sound for each log printed
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [logIndex, isSkipped, playHover]);

  // Handle loading progress bar
  useEffect(() => {
    if (!isSkipped) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = Math.floor(Math.random() * 12) + 4;
          return Math.min(prev + increment, 100);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isSkipped]);

  // Complete loader when progress is 100 and logs are finished
  useEffect(() => {
    if ((progress === 100 && logIndex === BOOT_LOGS.length) || isSkipped) {
      playSuccess();
      playBoot();
      const fadeTimer = setTimeout(() => {
        onComplete();
      }, 800); // Allow fade animation to run
      return () => clearTimeout(fadeTimer);
    }
  }, [progress, logIndex, isSkipped, onComplete, playBoot, playSuccess]);

  const handleSkip = () => {
    setIsSkipped(true);
  };

  return (
    <div className="fixed inset-0 bg-gx-black z-[999] flex flex-col justify-between p-8 font-mono text-xs crt-screen crt-flicker">
      {/* Top Header info */}
      <div className="flex justify-between text-gx-green/60 border-b border-gx-green/20 pb-4">
        <div>SYSTEM STATUS: BOOTING</div>
        <div className="hidden sm:block">LOCAL PORT: :3000 // CORE: V2</div>
      </div>

      {/* Terminal Screen Console */}
      <div className="flex-1 my-8 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {/* Large Glitching Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-gx-green font-bold text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter animate-pulse select-none">
            GLORY<span className="text-gx-orange">X</span>
          </h1>
          <p className="text-gx-green/40 tracking-[0.3em] uppercase text-[10px] mt-2">
            Dominate The Matrix
          </p>
        </div>

        {/* Console Print Log Buffer */}
        <div className="bg-gx-dark/60 border border-gx-gray p-6 h-64 overflow-y-auto mb-8 text-gx-green/90 font-mono text-left space-y-2 selection:bg-gx-green/20">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-gx-orange/70">&gt;</span>
              <span className={i === BOOT_LOGS.length - 1 ? 'text-gx-orange font-bold' : ''}>
                {log}
              </span>
            </div>
          ))}
          {logIndex < BOOT_LOGS.length && (
            <div className="flex gap-2 items-center">
              <span className="text-gx-orange/70 animate-pulse">&gt;</span>
              <span className="w-2.5 h-4 bg-gx-green animate-pulse" />
            </div>
          )}
        </div>

        {/* Progress Bar Container */}
        <div className="max-w-xl mx-auto w-full">
          <div className="flex justify-between text-gx-green mb-2 font-bold">
            <span>DECRYPTING DATA CORE</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-3 border border-gx-green/30 p-0.5 bg-gx-black">
            <div
              className="h-full bg-gx-green transition-all duration-150 ease-out shadow-[0_0_8px_#79c043]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Info & Skip Button */}
      <div className="flex justify-between items-center text-gx-green/60 border-t border-gx-green/20 pt-4">
        <div>CODENAME: GLORYX AGENCY</div>
        <button
          onClick={handleSkip}
          className="px-6 py-2 border border-gx-green/30 bg-gx-dark hover:bg-gx-green hover:text-gx-black text-gx-green transition-colors font-bold uppercase tracking-wider text-2xs clip-corner"
        >
          Skip Decryption [ESC]
        </button>
      </div>
    </div>
  );
};

export default IntroLoader;
