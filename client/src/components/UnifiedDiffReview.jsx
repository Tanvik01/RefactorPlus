import React, { useMemo, useState } from 'react';
import { buildUnifiedDiff } from '../utils/diffBuilder';

export default function UnifiedDiffReview({ reviewData, originalCode }) {
  const [copied, setCopied] = useState(false);

  const { score, summary, issues = [], refactor } = reviewData || {};

  const diffLines = useMemo(() => {
    if (!refactor) return [];
    return buildUnifiedDiff(refactor.before || originalCode, refactor.after, issues);
  }, [refactor, originalCode, issues]);

  const stats = useMemo(() => {
    let additions = 0;
    let removals = 0;
    diffLines.forEach(line => {
      if (line.type === 'add') additions++;
      if (line.type === 'remove') removals++;
    });
    return { additions, removals };
  }, [diffLines]);

  const handleCopyRefactored = async () => {
    if (refactor?.after) {
      await navigator.clipboard.writeText(refactor.after);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!reviewData) return null;

  return (
    <section className="space-y-4">
      
      {/* Monospace Metrics Bar (GitHub PR / VS Code Header style) */}
      <div className="panel-surface p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#E8E6E1]">
        
        {/* Score & Issue Count */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#9A9C9B]">SCORE:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-sm ${
              score >= 8
                ? 'bg-[#8FBC8F]/20 text-[#8FBC8F] border border-[#8FBC8F]/30'
                : score >= 5
                ? 'bg-[#E8B563]/20 text-[#E8B563] border border-[#E8B563]/30'
                : 'bg-[#C77B72]/20 text-[#C77B72] border border-[#C77B72]/30'
            }`}>
              {score < 10 ? `0${score}` : score}/10
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9A9C9B]">ISSUES:</span>
            <span className="font-bold text-[#E8E6E1]">{issues.length}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#8FBC8F]">+{stats.additions}</span>
            <span className="text-[#C77B72]">-{stats.removals}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyRefactored}
          className="px-3 py-1.5 rounded border border-[#333540] bg-[#1E1F26] text-[#E8E6E1] hover:bg-[#2D2F38] transition-colors focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
        >
          {copied ? 'Copied!' : 'Copy Refactored Code'}
        </button>
      </div>

      {/* Summary Box */}
      <div className="panel-surface p-4 border-l-4 border-l-[#8FBC8F] text-xs text-[#E8E6E1]">
        <span className="font-mono text-[#9A9C9B] uppercase tracking-wider block mb-1">
          Reviewer Summary:
        </span>
        <p className="leading-relaxed font-sans">{summary}</p>
      </div>

      {/* Unified PR Diff Container */}
      <div className="panel-surface overflow-hidden border border-[#333540] font-mono text-xs">
        
        {/* Diff Header Bar */}
        <div className="bg-[#1E1F26] px-4 py-2 border-b border-[#333540] flex items-center justify-between text-[#9A9C9B]">
          <span className="font-medium text-[#E8E6E1]">Unified Diff & Inline Review Comments</span>
          <span>VS Code Panel View</span>
        </div>

        {/* Diff Line List */}
        <div className="divide-y divide-[#2C2E38]/40 overflow-x-auto">
          {diffLines.map((line, idx) => {
            const isAdd = line.type === 'add';
            const isRemove = line.type === 'remove';
            const hasIssues = line.issues && line.issues.length > 0;

            return (
              <React.Fragment key={idx}>
                {/* Diff Line Row */}
                <div
                  className={`flex items-stretch leading-6 select-text transition-colors ${
                    isAdd
                      ? 'bg-[rgba(143,188,143,0.10)] text-[#E8E6E1]'
                      : isRemove
                      ? 'bg-[rgba(199,123,114,0.10)] text-[#E8E6E1]'
                      : 'hover:bg-[#2D2F38]/40 text-[#E8E6E1]'
                  }`}
                >
                  {/* Line Number Gutters */}
                  <div className="flex select-none text-[#6C6E75] bg-[#1E1F26]/70 border-r border-[#333540] shrink-0 text-right">
                    <span className="w-10 px-2 py-0.5 border-r border-[#333540]/40">
                      {line.oldLine || ''}
                    </span>
                    <span className="w-10 px-2 py-0.5">
                      {line.newLine || ''}
                    </span>
                  </div>

                  {/* Diff Marker (+ / - / space) */}
                  <div
                    className={`w-6 px-1 py-0.5 font-bold select-none text-center shrink-0 ${
                      isAdd
                        ? 'text-[#8FBC8F] bg-[rgba(143,188,143,0.2)]'
                        : isRemove
                        ? 'text-[#C77B72] bg-[rgba(199,123,114,0.2)]'
                        : 'text-[#6C6E75]'
                    }`}
                  >
                    {isAdd ? '+' : isRemove ? '-' : ' '}
                  </div>

                  {/* Line Code Content */}
                  <div className="px-3 py-0.5 whitespace-pre font-mono overflow-x-auto flex-1">
                    {line.content}
                  </div>
                </div>

                {/* Inline Reviewer Margin Annotations (Anchored directly to line) */}
                {hasIssues && (
                  <div className="bg-[#1E1F26] p-3 px-4 sm:px-12 border-y border-[#333540]">
                    {line.issues.map((issue, issueIdx) => (
                      <div
                        key={issueIdx}
                        style={{ animationDelay: `${issueIdx * 120}ms` }}
                        className="animate-reveal-annotation my-2 rounded border border-[rgba(232,181,99,0.4)] bg-[rgba(232,181,99,0.06)] p-3 font-sans text-xs text-[#E8E6E1]"
                      >
                        {/* Annotation Header */}
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[rgba(232,181,99,0.2)]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#E8B563] font-mono text-[11px] uppercase tracking-wider">
                              Senior Engineer Comment • {issue.category}
                            </span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            issue.severity === 'high'
                              ? 'bg-[#C77B72]/20 text-[#C77B72] border border-[#C77B72]/40'
                              : issue.severity === 'medium'
                              ? 'bg-[#E8B563]/20 text-[#E8B563] border border-[#E8B563]/40'
                              : 'bg-[#8FBC8F]/20 text-[#8FBC8F] border border-[#8FBC8F]/40'
                          }`}>
                            {issue.severity} severity
                          </span>
                        </div>

                        {/* Annotation Body */}
                        <p className="leading-relaxed text-[#E8E6E1]">
                          {issue.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Rationale Section */}
      {refactor?.explanation && (
        <div className="panel-surface p-4 border border-[rgba(232,181,99,0.4)] bg-[rgba(232,181,99,0.04)] text-xs text-[#E8E6E1]">
          <span className="font-mono text-[#E8B563] uppercase tracking-wider block mb-1 font-bold">
            Refactoring Rationale:
          </span>
          <p className="leading-relaxed font-sans text-[#E8E6E1]">
            {refactor.explanation}
          </p>
        </div>
      )}

    </section>
  );
}
