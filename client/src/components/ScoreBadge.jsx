import React from 'react';
import { Award, CheckCircle2, AlertCircle, AlertTriangle, Shield } from 'lucide-react';

export default function ScoreBadge({ score, summary }) {
  // Determine color theme based on score (1-10)
  const getTheme = (val) => {
    if (val >= 8) {
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500',
        ring: 'ring-emerald-500/20',
        label: 'Excellent Code Quality',
        icon: CheckCircle2
      };
    } else if (val >= 5) {
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500',
        ring: 'ring-amber-500/20',
        label: 'Requires Optimization',
        icon: AlertTriangle
      };
    } else {
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500',
        ring: 'ring-rose-500/20',
        label: 'Critical Vulnerabilities / Smells',
        icon: AlertCircle
      };
    }
  };

  const theme = getTheme(score);
  const StatusIcon = theme.icon;

  return (
    <div className={`rounded-2xl p-6 border ${theme.border} ${theme.bg} backdrop-blur-xl shadow-xl transition-all`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Animated Score Gauge Circle */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full border-4 ${theme.border} bg-slate-950 flex flex-col items-center justify-center shadow-2xl ring-8 ${theme.ring}`}>
            <span className={`text-3xl font-black ${theme.text} tracking-tight`}>
              {score}
              <span className="text-sm font-normal text-slate-500">/10</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Score
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {theme.label}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Senior Architect Verdict
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">Review Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            "{summary}"
          </p>
        </div>

      </div>
    </div>
  );
}
