import React, { useMemo } from 'react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript / Node.js' },
  { value: 'jsx', label: 'React (JSX / TSX)' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML / Markup' },
  { value: 'css', label: 'CSS / Styling' }
];

const MAX_LINES = 200;

export default function CodeInput({
  code,
  setCode,
  language,
  setLanguage,
  onSubmit,
  loading,
  onClear
}) {
  const lines = useMemo(() => {
    if (!code) return 1;
    return code.split(/\r\n|\r|\n/).length;
  }, [code]);

  const isExceeded = lines > MAX_LINES;
  const isNearLimit = lines > MAX_LINES * 0.8 && !isExceeded;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCode(text);
    } catch (err) {
      console.warn('Clipboard access not granted');
    }
  };

  return (
    <div className="panel-surface p-4 sm:p-5 border border-[#333540] shadow-lg">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono font-bold text-[#E8E6E1] uppercase tracking-wider">
            Input Code Snippet
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1E1F26] border border-[#333540] text-[#E8E6E1] text-xs font-mono rounded px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-[#8FBC8F] focus:outline-none transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={handlePaste}
              className="px-2.5 py-1.5 rounded bg-[#1E1F26] hover:bg-[#2D2F38] text-[#9A9C9B] hover:text-[#E8E6E1] border border-[#333540] transition-colors focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
              title="Paste from clipboard"
            >
              Paste
            </button>

            {code && (
              <button
                type="button"
                onClick={onClear}
                className="px-2.5 py-1.5 rounded bg-[#1E1F26] hover:bg-[#2D2F38] text-[#9A9C9B] hover:text-[#C77B72] border border-[#333540] transition-colors focus-visible:ring-2 focus-visible:ring-[#C77B72]"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Code Textarea Container */}
      <div className="relative rounded bg-[#1E1F26] border border-[#333540] overflow-hidden">
        <div className="flex text-xs font-mono">
          {/* Line Numbers Gutter */}
          <div className="select-none py-3 px-3 bg-[#17181E] text-[#6C6E75] text-right border-r border-[#333540] min-w-[2.5rem] font-mono leading-6">
            {Array.from({ length: Math.max(lines, 10) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste snippet here to start code review..."
            rows={12}
            className="w-full bg-transparent p-3 text-[#E8E6E1] placeholder-[#6C6E75] focus:outline-none resize-none font-mono text-xs leading-6 selection:bg-[#3E404D]"
            spellCheck="false"
          />
        </div>

        {/* Line Count Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#17181E] border-t border-[#333540] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#9A9C9B]">
              Lines: <strong className={isExceeded ? 'text-[#C77B72]' : isNearLimit ? 'text-[#E8E6E1]' : 'text-[#8FBC8F]'}>{lines}</strong> / {MAX_LINES}
            </span>
            {isNearLimit && (
              <span className="text-[11px] text-[#9A9C9B]">
                [!] Nearing limit
              </span>
            )}
            {isExceeded && (
              <span className="text-[11px] text-[#C77B72] font-semibold">
                [!] Exceeds 200 line limit
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#6C6E75]">
            {code ? `${code.length} chars` : 'Empty buffer'}
          </div>
        </div>
      </div>

      {/* Review Trigger Action */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-mono text-[#6C6E75]">
          Senior Engineer Automated Audit
        </span>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !code.trim() || isExceeded}
          className={`flex items-center gap-2 px-5 py-2 rounded font-mono font-semibold text-xs transition-all ${
            loading || !code.trim() || isExceeded
              ? 'bg-[#1E1F26] text-[#6C6E75] cursor-not-allowed border border-[#333540]'
              : 'bg-[#8FBC8F] hover:bg-[#7aa77a] text-[#1E1F26] shadow-sm font-bold focus-visible:ring-2 focus-visible:ring-[#8FBC8F]'
          }`}
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#1E1F26]/30 border-t-[#1E1F26] rounded-full animate-spin"></div>
              <span>Reviewing...</span>
            </>
          ) : (
            <span>Review Code</span>
          )}
        </button>
      </div>

    </div>
  );
}
