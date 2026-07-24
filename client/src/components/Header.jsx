import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function Header() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data.geminiKeyConfigured) {
            setServerStatus('online');
          } else {
            setServerStatus('no-key');
          }
        } else {
          setServerStatus('offline');
        }
      } catch (err) {
        setServerStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                RefactorPulse<span className="text-indigo-400"></span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                MERN AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Senior Software Architect Code Review & Refactoring Assistant
            </p>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>LLM: <strong className="text-white">Gemini 3.5 Flash</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            {serverStatus === 'checking' && (
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Connecting API...
              </span>
            )}
            {serverStatus === 'online' && (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Backend Ready
              </span>
            )}
            {serverStatus === 'no-key' && (
              <span className="text-amber-400 flex items-center gap-1.5 font-medium" title="GEMINI_API_KEY missing in server/.env">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Key Required
              </span>
            )}
            {serverStatus === 'offline' && (
              <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Server Offline
              </span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
