import React, { useState, useEffect } from 'react';
import SideRays from './components/SideRays';
import PresetSnippets from './components/PresetSnippets';
import CodeInput from './components/CodeInput';
import LoadingState from './components/LoadingState';
import UnifiedDiffReview from './components/UnifiedDiffReview';

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('jsx');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setServerOnline(true);
      } catch (err) {
        setServerOnline(false);
      }
    }
    checkHealth();
  }, []);

  const handleSelectPreset = (preset) => {
    setCode(preset.code);
    setLanguage(preset.language);
    setReviewData(null);
    setError(null);
  };

  const handleClear = () => {
    setCode('');
    setReviewData(null);
    setError(null);
  };

  const handleSubmitReview = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setReviewData(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to generate code review.');
      }

      if (result.success && result.data) {
        setReviewData(result.data);
      } else {
        throw new Error('Malformed JSON payload received from backend.');
      }
    } catch (err) {
      console.error('Review Error:', err);
      setError(err.message || 'An error occurred while communicating with the backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1E1F26] text-[#E8E6E1] flex flex-col font-sans selection:bg-[#333540] selection:text-white overflow-x-hidden">
      
      {/* Fully Visible WebGL SideRays Background */}
      <SideRays
        speed={2.2}
        rayColor1="#EAB308"
        rayColor2="#96c8ff"
        intensity={2.2}
        spread={2.5}
        origin="top-right"
        opacity={0.8}
      />

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
        
        {/* Small Centered Glass Nav Bar */}
        <nav className="flex justify-center">
          <div className="px-5 py-2 rounded-full bg-[#26272F]/70 border border-[#333540] backdrop-blur-md text-xs font-mono text-[#E8E6E1] flex items-center gap-3 shadow-lg">
            <span className="font-normal text-[#E8E6E1]">RefactorPulse.ai</span>
            <span className="text-[#333540]">|</span>
            <span className="flex items-center gap-2 text-[#9A9C9B]">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-[#8FBC8F]' : 'bg-[#C77B72]'}`}></span>
              <span>{serverOnline ? 'Llama 3.3 70B (Groq) Online' : 'Connecting Engine...'}</span>
            </span>
          </div>
        </nav>

        {/* Quick Presets Toolbar */}
        <PresetSnippets onSelectPreset={handleSelectPreset} />

        {/* Primary Focus: Paste Input Box */}
        <CodeInput
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          onSubmit={handleSubmitReview}
          loading={loading}
          onClear={handleClear}
        />

        {/* Error State */}
        {error && (
          <div className="panel-surface p-4 border border-[#C77B72]/40 bg-[#C77B72]/10 text-xs text-[#E8E6E1] flex items-start gap-3">
            <div className="flex-1">
              <span className="font-mono font-bold text-[#C77B72] uppercase block">API Error</span>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleSubmitReview}
              className="px-2.5 py-1 rounded bg-[#1E1F26] border border-[#333540] text-[#E8E6E1] hover:bg-[#2D2F38] font-mono text-xs focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Results: Unified PR Diff & Line-Anchored Review Annotations */}
        {reviewData && !loading && (
          <UnifiedDiffReview reviewData={reviewData} originalCode={code} />
        )}

      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-[#333540]/60 py-3 font-mono text-[11px] text-[#6C6E75] text-center">
        <span>RefactorPulse.ai • Unified PR Diff View</span>
      </footer>

    </div>
  );
}
