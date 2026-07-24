import React from 'react';
import { PRESETS } from './PresetSnippetsData';

export default function PresetSnippets({ onSelectPreset }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
      <span className="text-[#9A9C9B] uppercase tracking-wider">Presets:</span>
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelectPreset(preset)}
          type="button"
          className="px-2.5 py-1 rounded bg-[#26272F] hover:bg-[#2D2F38] border border-[#333540] text-[#E8E6E1] transition-colors focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
        >
          {preset.category}
        </button>
      ))}
    </div>
  );
}
