import React from 'react';
import { Terminal, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { AudienceLevel, SupportedLanguage } from '../types';

interface NavbarProps {
  audienceLevel: AudienceLevel;
  setAudienceLevel: (level: AudienceLevel) => void;
  onOpenHowItWorks: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectSampleModal?: () => void;
  onResetAll?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  audienceLevel,
  setAudienceLevel,
  onOpenHowItWorks,
  onResetAll,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1px] flex items-center justify-center">
            <div className="h-full w-full bg-[#0a0e18] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-100 whitespace-nowrap">
            AI Code Explainer
          </span>
        </div>

        {/* Zone 2: Navigation links / Tutor depth mode */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
            <span className="text-slate-500 px-2 py-1 text-[11px] uppercase tracking-wider font-semibold">
              Audience:
            </span>
            <button
              onClick={() => setAudienceLevel('beginner')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                audienceLevel === 'beginner'
                  ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setAudienceLevel('kid')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                audienceLevel === 'kid'
                  ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple Analogies
            </button>
            <button
              onClick={() => setAudienceLevel('college')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                audienceLevel === 'college'
                  ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CS Freshman
            </button>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Learning Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {onResetAll && (
            <button
              onClick={onResetAll}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors hidden sm:inline-block whitespace-nowrap"
            >
              Reset Canvas
            </button>
          )}
          <button
            onClick={onOpenHowItWorks}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>How it works</span>
          </button>
        </div>
      </div>
    </header>
  );
};
