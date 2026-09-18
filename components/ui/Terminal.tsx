'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { useAudio } from '@/components/hooks/AudioProvider';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
}

const Terminal: React.FC = () => {
  const router = useRouter();
  const { playClick, playHover, playSuccess, playError } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Message[]>([
    {
      role: 'system',
      text: `BINARYSCOUTS AI SYSTEM v2.5.0\nConnected to BinaryScouts Intelligence Network.\nType 'help' for available commands or ask me anything.\n\nB.I.N.A.R.Y. AI is online and ready.`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen && !isMinimized, panelRef);

  // Listen for navbar >_ toggle event
  useEffect(() => {
    const onToggle = (e: Event) => {
      const { open } = (e as CustomEvent).detail;
      setIsOpen(open);
      setIsMinimized(false);
    };
    window.addEventListener('bs:terminal-toggle', onToggle);
    return () => window.removeEventListener('bs:terminal-toggle', onToggle);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, typedText]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('bs:terminal-toggle', { detail: { open: false } }));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const typeMessage = (text: string, callback: () => void) => {
    let index = 0;
    setTypedText('');
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 14);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    playClick();
    setHistory((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInputVal('');
    setLoading(true);

    const lower = trimmed.toLowerCase();

    if (lower === 'clear') { setHistory([]); setLoading(false); return; }

    if (lower === 'help' || lower === 'commands') {
      setHistory((prev) => [...prev, {
        role: 'system',
        text: `AVAILABLE COMMANDS:\n  help / commands  — Show this menu\n  services         — List our capabilities\n  about            — About BinaryScouts Studio\n  configure        — Open Strategy Configurator\n  contact / crew   — Go to contact page\n  clear            — Clear the terminal`,
      }]);
      playSuccess(); setLoading(false); return;
    }

    if (lower === 'services') {
      setHistory((prev) => [...prev, {
        role: 'system',
        text: `BINARYSCOUTS CORE CAPABILITIES:\n  1. AI Systems & Intelligent Automation\n  2. SaaS & Web Platform Development\n  3. CRM Automation & Lead Infrastructure\n  4. Growth Engineering & SEO\n  5. Enterprise Dashboards & Analytics\n  6. Infrastructure & DevOps Engineering`,
      }]);
      playSuccess(); setLoading(false); return;
    }

    if (lower === 'about') {
      setHistory((prev) => [...prev, {
        role: 'system',
        text: `BINARYSCOUTS STUDIO:\nAn AI-native digital engineering studio building intelligent systems for modern businesses.\n\nWe design, automate, and engineer full-stack digital infrastructure — from AI pipelines to enterprise SaaS platforms — that scale with your business.\n\nFounded on the principle that every business decision should be backed by intelligent, automated systems.`,
      }]);
      playSuccess(); setLoading(false); return;
    }

    if (lower === 'contact' || lower === 'crew') {
      setHistory((prev) => [...prev, { role: 'system', text: 'Redirecting to contact page...' }]);
      playSuccess();
      setTimeout(() => { setIsOpen(false); router.push('/contact'); }, 800);
      setLoading(false); return;
    }

    if (lower === 'configure' || lower === 'planner' || lower === 'heist') {
      setHistory((prev) => [...prev, { role: 'system', text: 'Opening Strategy Configurator...' }]);
      playSuccess();
      setTimeout(() => { setIsOpen(false); router.push('/planner'); }, 800);
      setLoading(false); return;
    }

    // AI response
    try {
      const chatHistory = history
        .filter((h) => h.role !== 'system')
        .map((h) => ({ role: h.role, text: h.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: chatHistory }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      typeMessage(data.text, () => {
        setHistory((prev) => [...prev, { role: 'model', text: data.text }]);
        setTypedText('');
        setLoading(false);
      });
    } catch {
      playError();
      setHistory((prev) => [...prev, { role: 'system', text: 'Connection error. Type "help" for local commands.' }]);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('bs:terminal-toggle', { detail: { open: false } }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 font-mono text-xs animate-fade-up"
      style={{
        bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        right: 'calc(112px + env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="BinaryScouts AI Terminal"
        tabIndex={-1}
        className="flex flex-col transition-all duration-300 overflow-hidden rounded-2xl outline-none"
        style={{
          width: isMinimized ? '260px' : 'min(400px, calc(100vw - 48px))',
          height: isMinimized ? '48px' : '440px',
          backgroundColor: 'var(--bg-glass-solid)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-glass), 0 0 40px rgba(99,102,241,0.15)',
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          className="h-12 px-4 flex justify-between items-center cursor-pointer select-none flex-shrink-0"
          style={{
            borderBottom: isMinimized ? 'none' : '1px solid var(--border-subtle)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
          }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2.5">
            <TerminalIcon size={14} style={{ color: 'var(--accent)' }} className="animate-pulse" />
            <span className="font-display font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              B.I.N.A.R.Y. Terminal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className="p-1 rounded transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="p-1 rounded transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fb7185')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* ── Message Buffer ─────────────────────────────── */}
        {!isMinimized && (
          <>
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3"
              style={{ scrollbarWidth: 'thin' }}
            >
              {history.map((msg, i) => (
                <div key={i} className="leading-relaxed">
                  {msg.role === 'user' && (
                    <div>
                      <span className="font-semibold" style={{ color: 'var(--accent)' }}>you@bs:~$</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>{msg.text}</span>
                    </div>
                  )}
                  {msg.role === 'model' && (
                    <div
                      className="whitespace-pre-wrap pl-3"
                      style={{
                        color: 'var(--text-secondary)',
                        borderLeft: '2px solid var(--accent)',
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                  {msg.role === 'system' && (
                    <div className="whitespace-pre-wrap font-medium" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {typedText && (
                <div>
                  <div className="whitespace-pre-wrap pl-3" style={{ color: 'var(--text-secondary)', borderLeft: '2px solid var(--accent)' }}>
                    {typedText}
                    <span className="inline-block w-1.5 h-3 ml-0.5 animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                  </div>
                </div>
              )}

              {loading && !typedText && (
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
                  <span>Processing</span>
                  <span className="w-1 h-2" style={{ backgroundColor: 'var(--accent)' }} />
                  <span className="w-1 h-2" style={{ backgroundColor: 'var(--accent)' }} />
                  <span className="w-1 h-2" style={{ backgroundColor: 'var(--accent)' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ────────────────────────────────────── */}
            <div
              className="px-4 py-3 flex items-center gap-2 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <span className="font-semibold flex-shrink-0 text-[11px]" style={{ color: 'var(--accent)' }}>
                you@bs:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) handleCommand(inputVal);
                }}
                disabled={loading}
                placeholder={loading ? 'Processing...' : 'Type a command or question...'}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-xs"
                style={{
                  color: 'var(--text-primary)',
                  caretColor: 'var(--accent)',
                }}
              />
              <button
                onClick={() => !loading && handleCommand(inputVal)}
                disabled={loading || !inputVal.trim()}
                className="flex-shrink-0 transition-colors duration-200"
                style={{ color: inputVal.trim() ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                <CornerDownLeft size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Terminal;
