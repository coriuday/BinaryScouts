'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
  playError: () => void;
  playBoot: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Default muted to respect browser auto-play policies
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientDroneRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    gain: GainNode;
    lfo: OscillatorNode;
  } | null>(null);

  // Initialize AudioContext lazily on user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleMute = () => {
    initAudio();
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (nextMute) {
        stopAmbientDrone();
      } else {
        startAmbientDrone();
      }
      return nextMute;
    });
  };

  // 1. Programmatic Synth Sounds using Web Audio API

  const playClick = () => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playHover = () => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  };

  const playSuccess = () => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  };

  const playError = () => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    // Apply lowpass filter to make it sound gritty instead of harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  };

  const playBoot = () => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Low rumble sweeps up
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(50, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 1.5);
    gain1.gain.setValueAtTime(0.05, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    // High cyber sweep sweeps down
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2000, now);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 1.2);
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 1.5);
    osc2.start(now);
    osc2.stop(now + 1.2);
  };

  // 2. Cyberpunk Ambient Drone generator
  const startAmbientDrone = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || ambientDroneRef.current) return;

    // Create detuned oscillators for a thick, low-frequency atmospheric drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Slow modulation LFO for volume pulsing
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
    osc1.detune.setValueAtTime(-10, ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.41, ctx.currentTime); // E2 note (fifth)
    osc2.detune.setValueAtTime(10, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime); // Very low pass to keep it background rumble

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime); // Very slow cycle (every 6.6s)
    lfoGain.gain.setValueAtTime(0.02, ctx.currentTime); // Pulsing depth

    // Start with low volume and fade in gently
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3.0); // 3 second fade in

    // Connect LFO to filter frequency to sweep the filter cut-off slowly
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    lfo.start();
    osc1.start();
    osc2.start();

    ambientDroneRef.current = { osc1, osc2, gain, lfo };
  }, []);

  const stopAmbientDrone = useCallback(() => {
    const drone = ambientDroneRef.current;
    if (!drone) return;

    const ctx = audioCtxRef.current;
    if (ctx) {
      const now = ctx.currentTime;
      // Fade out drone
      drone.gain.gain.setValueAtTime(drone.gain.gain.value, now);
      drone.gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      setTimeout(() => {
        try {
          drone.osc1.stop();
          drone.osc2.stop();
          drone.lfo.stop();
        } catch (e) {}
      }, 550);
    }
    ambientDroneRef.current = null;
  }, []);

  // Handle ambient status when tab shifts or window focus changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAmbientDrone();
      } else if (!isMuted) {
        startAmbientDrone();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAmbientDrone();
    };
  }, [isMuted, startAmbientDrone, stopAmbientDrone]);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playClick, playHover, playSuccess, playError, playBoot }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
