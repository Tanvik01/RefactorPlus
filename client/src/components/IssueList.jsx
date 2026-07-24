import React, { useState } from 'react';
import { ShieldAlert, Zap, Eye, AlertOctagon, Filter, CheckCircle } from 'lucide-react';

export default function IssueList({ issues = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.category.toLowerCase() === filter;
  });

  const getCategoryMeta = (category) => {
    switch (category.toLowerCase()) {
      case 'security':
        return {
          icon: ShieldAlert,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20'
        };
      case 'performance':
        return {
          icon: Zap,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20'
        };
      case 'readability':
      default:
        return {
          icon: Eye,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20'
        };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
      default:
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      
      {/* Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Detected Code Issues
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              {issues.length}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'security', 'performance', 'readability'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List Grid */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800/60">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-slate-200">No issues found in this category!</p>
          <p className="text-xs text-slate-400 mt-1">Code conforms well to best practices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue, idx) => {
            const meta = getCategoryMeta(issue.category);
            const Icon = meta.icon;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
              >
                <div className={`p-2 rounded-lg ${meta.bg} ${meta.color} border ${meta.border} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-xs font-semibold capitalize ${meta.color}`}>
                      {issue.category} Issue
                    </span>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getSeverityBadge(
                        issue.severity
                      )}`}
                    >
                      {issue.severity} Severity
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {issue.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
