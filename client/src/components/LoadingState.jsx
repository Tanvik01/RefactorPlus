import React from 'react';

export default function LoadingState() {
  return (
    <div className="panel-surface p-6 text-center font-mono text-xs text-[#E8E6E1]">
      <div className="flex items-center justify-center gap-3">
        <div className="w-3.5 h-3.5 border-2 border-[#8FBC8F]/30 border-t-[#8FBC8F] rounded-full animate-spin"></div>
        <span>Reviewer is analyzing AST, security parameters, and unified refactor diff...</span>
      </div>
    </div>
  );
}
