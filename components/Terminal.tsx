'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { useAudio } from './AudioProvider';

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
      text: `GLORYX SECURE SYSTEM OPERATOR v2.5.0
ESTABLISHING SYSTEM CONNECTION... DONE.
TYPE 'help' FOR AVAILABLE SYSTEM ACTIONS.

G.L.O.R.Y. AI IS ONLINE. PROMPT TO BEGIN.`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, typedText]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Typewriter effect for latest model response
  const typeMessage = (text: string, callback: () => void) => {
    let index = 0;
    setTypedText('');
    
    const interval = setInterval(() => {
      if (index < text.length) {
        // Grab characters (handle newlines nicely)
        setTypedText((prev) => prev + text.charAt(index));
        index++;
        
        // Play typing click sound every few characters
        if (index % 3 === 0) {
          playHover();
        }
      } else {
        clearInterval(interval);
        callback();
      }
    }, 15); // Adjust typing speed here
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    playClick();
    const userMsg: Message = { role: 'user', text: trimmed };
    
    // Add user message to history
    setHistory((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    const lowerCmd = trimmed.toLowerCase();

    // 1. Check local terminal commands
    if (lowerCmd === 'clear') {
      setHistory([]);
      setLoading(false);
      return;
    }

    if (lowerCmd === 'heist' || lowerCmd === 'planner') {
      setHistory((prev) => [
        ...prev,
        { role: 'system', text: 'REDIRECTING ENGINE TO HEIST PLANNER CONTROLLER...' }
      ]);
      playSuccess();
      setTimeout(() => {
        setIsOpen(false);
        router.push('/planner');
      }, 1000);
      setLoading(false);
      return;
    }

    if (lowerCmd === 'games' || lowerCmd === 'releases' || lowerCmd === 'work') {
      setHistory((prev) => [
        ...prev,
        { role: 'system', text: 'REDIRECTING ENGINE TO RELEASES CATALOGUE...' }
      ]);
      playSuccess();
      setTimeout(() => {
        setIsOpen(false);
        router.push('/games');
      }, 1000);
      setLoading(false);
      return;
    }

    // 2. Fetch AI response for general messages or help commands
    try {
      // Map history excluding latest user message since it will be passed explicitly
      const chatHistory = history
        .filter(h => h.role !== 'system')
        .map(h => ({ role: h.role, text: h.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error('API failure');
      }

      const data = await res.json();
      
      // Animate typewriter response
      typeMessage(data.text, () => {
        setHistory((prev) => [...prev, { role: 'model', text: data.text }]);
        setTypedText('');
        setLoading(false);
      });
    } catch (e) {
      playError();
      setHistory((prev) => [
        ...prev,
        { role: 'system', text: 'CONNECTION FAILURE. PLEASE RETRY OR TYPE LOCAL COMMANDS.' }
      ]);
      setLoading(false);
    }
  };

  const handleToggle = () => {
    playClick();
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-xs">
      {/* Floating pulsing launcher button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          onMouseEnter={playHover}
          className="w-14 h-14 bg-gx-black hover:bg-gx-green border-2 border-gx-green rounded-full flex items-center justify-center text-gx-green hover:text-gx-black transition-all shadow-[0_0_15px_rgba(121,192,67,0.4)] cursor-pointer group hover:scale-105"
          title="Open System Terminal"
        >
          <TerminalIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Actual Terminal Window */}
      {isOpen && (
        <div
          className={`bg-gx-dark border-2 border-gx-green flex flex-col transition-all duration-300 shadow-[0_0_30px_rgba(121,192,67,0.35)] clip-corner crt-screen crt-flicker ${
            isMinimized ? 'h-10 w-64' : 'h-[420px] w-[350px] sm:w-[450px]'
          }`}
        >
          {/* Header Controls */}
          <div
            className="h-10 bg-gx-black border-b border-gx-green/30 px-4 flex justify-between items-center cursor-pointer select-none text-gx-green/80"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-2xs">
              <TerminalIcon className="w-4 h-4 text-gx-green animate-pulse" />
              <span>GLORYX TERMINAL v2.5</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleMinimize}
                className="text-gx-green/60 hover:text-white transition-colors"
                title={isMinimized ? 'Expand Console' : 'Minimize Console'}
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button
                onClick={handleToggle}
                className="text-gx-orange/80 hover:text-white transition-colors"
                title="Disconnect Terminal"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Screen Buffer (Hidden if minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gx-green bg-gx-black/40">
                {history.map((msg, i) => (
                  <div key={i} className="text-left leading-relaxed">
                    {msg.role === 'user' && (
                      <div>
                        <span className="text-gx-orange font-bold">guest@gloryx:~$</span>{' '}
                        <span className="text-white">{msg.text}</span>
                      </div>
                    )}
                    {msg.role === 'model' && (
                      <div className="text-gx-green whitespace-pre-wrap whitespace-pre-line pl-2 border-l border-gx-green/20">
                        {msg.text}
                      </div>
                    )}
                    {msg.role === 'system' && (
                      <div className="text-gx-green/60 uppercase font-bold italic tracking-wide">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typewriter animated response */}
                {typedText && (
                  <div className="text-left leading-relaxed">
                    <div className="text-gx-green whitespace-pre-wrap pl-2 border-l border-gx-green/20">
                      {typedText}
                      <span className="w-1.5 h-3.5 bg-gx-green inline-block ml-0.5 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* AI Processing Status */}
                {loading && !typedText && (
                  <div className="text-left flex items-center gap-1.5 text-gx-green/50 animate-pulse font-bold uppercase tracking-widest text-2xs">
                    <span>TRANSMITTING INSTRUCTIONS</span>
                    <span className="w-1 h-3 bg-gx-green/50" />
                    <span className="w-1 h-3 bg-gx-green/50" />
                    <span className="w-1 h-3 bg-gx-green/50" />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Prompt (Hidden if loading) */}
              <div className="p-3 bg-gx-black/80 border-t border-gx-green/20 flex items-center gap-2">
                <span className="text-gx-orange font-bold flex-shrink-0">guest@gloryx:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleCommand(inputVal);
                    }
                  }}
                  disabled={loading}
                  className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 font-mono caret-gx-green"
                  placeholder={loading ? 'Operator is executing...' : "Type command or chat..."}
                />
                <button
                  onClick={() => !loading && handleCommand(inputVal)}
                  disabled={loading || !inputVal.trim()}
                  className="text-gx-green/40 hover:text-gx-green transition-colors disabled:text-gx-green/20 flex-shrink-0"
                >
                  <CornerDownLeft size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Terminal;
