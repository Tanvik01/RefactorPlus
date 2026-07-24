import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import { Sparkles, Copy, Check, ArrowRight, Lightbulb, Split, FileCode } from 'lucide-react';

export default function RefactorView({ refactor, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'tabs'
  const [activeTab, setActiveTab] = useState('after'); // 'before' | 'after'

  useEffect(() => {
    // Re-run Prism syntax highlighting when content updates
    Prism.highlightAll();
  }, [refactor, viewMode, activeTab]);

  if (!refactor) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refactor.after);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  // Map language to Prism class name
  const getPrismLangClass = (lang) => {
    switch (lang.toLowerCase()) {
      case 'jsx':
      case 'react':
        return 'language-jsx';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'python':
      case 'py':
        return 'language-python';
      default:
        return 'language-javascript';
    }
  };

  const prismClass = getPrismLangClass(language);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Refactored Code Blueprint
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Optimized
              </span>
            </h3>
            <p className="text-xs text-slate-400">Prism.js syntax highlighted comparison</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Split Diff
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'tabs' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Tabs
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:-translate-y-0.5'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Refactored Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Split View */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* BEFORE Container */}
          <div className="rounded-xl bg-[#0b0f19] border border-rose-500/30 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Original / Flawed Code
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Before</span>
            </div>
            <div className="p-1 overflow-x-auto max-h-[480px]">
              <pre className={prismClass}>
                <code>{refactor.before}</code>
              </pre>
            </div>
          </div>

          {/* AFTER Container */}
          <div className="rounded-xl bg-[#0b0f19] border border-emerald-500/30 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Corrected & Refactored Code
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">After</span>
            </div>
            <div className="p-1 overflow-x-auto max-h-[480px]">
              <pre className={prismClass}>
                <code>{refactor.after}</code>
              </pre>
            </div>
          </div>

        </div>
      )}

      {/* Tabbed View */}
      {viewMode === 'tabs' && (
        <div className="rounded-xl bg-[#0b0f19] border border-slate-800 overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'before'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original Code (Before)
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'after'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Refactored Code (After)
            </button>
          </div>

          <div className="p-1 overflow-x-auto max-h-[480px]">
            <pre className={prismClass}>
              <code>{activeTab === 'before' ? refactor.before : refactor.after}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Architect Explanation Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-inner flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
            Architectural Rationale & Benefits
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {refactor.explanation}
          </p>
        </div>
      </div>

    </div>
  );
}
