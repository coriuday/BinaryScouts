'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Radio, Activity } from 'lucide-react';

const CREW_LOGS = [
  'SYS_ALERT: AGENT GIBSON BYPASSING TARGET FIREWALL NODE #4...',
  'OP_UPDATE: SEO CRUISE MISSILE INJECTED ON SaaS SEARCH MATRIX... CTR +85%',
  'NET_LOG: CRM WHATSAPP AUTOMATION TUNNEL CREATED FOR LOGISTICS CLIENT...',
  'SECURE_COMMS: DECRYPTED CORRESPONDENCE FROM INBOUND HEIST BRIEFING...',
  'SYS_ALERT: AGENT KAPPA DEPLOYED FOR BRAND OVERHAUL VISUAL RENDERS...',
  'NET_LOG: AUDITING SEMANTIC CLOUD CONVERGENCES FOR MARKETING PAYLOAD...'
];

const CrewTicker: React.FC = () => {
  const [logIndex, setLogIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setLogIndex((prev) => (prev + 1) % CREW_LOGS.length);
        setFade(true);
      }, 300); // Wait for fade out
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#030303] border-b border-gx-green/20 text-[10px] md:text-xs font-mono h-8 flex items-center justify-between px-4 text-gx-green relative z-[60] select-none uppercase tracking-wider crt-screen">
      <div className="flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-gx-orange animate-pulse" />
        <span className="text-gx-orange/80 font-bold">OPERATIONAL STATUS:</span>
        <div
          className={`transition-opacity duration-300 flex items-center gap-1.5 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>{CREW_LOGS[logIndex]}</span>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-4 text-gx-green/50">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-gx-green/70" />
          <span>PORT: ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-gx-green/70 animate-pulse" />
          <span>LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  );
};

export default CrewTicker;
