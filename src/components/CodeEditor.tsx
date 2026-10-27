import React, { useRef, useEffect, useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Clipboard,
  Check,
  ChevronDown,
  Bug,
  BookMarked,
  FileCode,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { LANGUAGES, SAMPLE_CODES, SampleSnippet } from '../sampleCodes';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onExplain: () => void;
  onClear: () => void;
  isLoading: boolean;
  highlightedLine?: string | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  onExplain,
  onClear,
  isLoading,
  highlightedLine,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isSampleMenuOpen, setIsSampleMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const linesCount = Math.max(1, lines.length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  // Sync scroll between textarea and line gutter
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position for developer status bar
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split('\n').length;
    const lastNewline = textBefore.lastIndexOf('\n');
    const col = lastNewline === -1 ? pos + 1 : pos - lastNewline;
    setCursorPos({ line, col });
  };

  // Keyboard shortcut Ctrl/Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!isLoading && code.trim()) {
          e.preventDefault();
          onExplain();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, code, onExplain]);

  // Click outside sample menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSampleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
      }
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleCopyInput = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSample = (sample: SampleSnippet) => {
    setLanguage(sample.language);
    setCode(sample.code);
    setIsSampleMenuOpen(false);
  };

  const currentLangInfo = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const filename = `solution${currentLangInfo.ext}`;

  return (
    <div className="flex flex-col h-full bg-[#0d121f] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Workbench Tab Header */}
      <div className="h-10 bg-[#090d16] border-b border-slate-800 flex items-center justify-between px-3 gap-3">
        {/* Active file tab */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d121f] border-t-2 border-indigo-500 border-x border-slate-800 text-xs font-mono text-slate-200 rounded-t-md">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>{filename}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center ml-2 border border-slate-800 rounded-md bg-[#0a0e18] p-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  language === l.id
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Load Preset Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSampleMenuOpen(!isSampleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-md transition-colors"
          >
            <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Load Sample</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isSampleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-[#0b0f19] border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-slate-850 text-xs">
              <div className="p-2 bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select a code sample
              </div>
              <div className="p-1 space-y-0.5 max-h-64 overflow-y-auto">
                {SAMPLE_CODES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => loadSample(sample)}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-900 border border-transparent transition-all flex flex-col gap-0.5 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-slate-200 group-hover:text-indigo-300">
                        {sample.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {sample.hasBug && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                            <Bug className="w-2.5 h-2.5" /> Bug
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {sample.language}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {sample.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="relative flex-1 flex min-h-[380px] sm:min-h-[460px] bg-[#070a13] font-mono text-xs sm:text-sm">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 sm:w-14 select-none py-3 text-right pr-3 pl-1 font-mono text-xs text-slate-600 bg-[#090d16] border-r border-slate-800/80 overflow-hidden"
        >
          {lineNumbers.map((num) => {
            const isHighlighted = highlightedLine === String(num);
            return (
              <div
                key={num}
                className={`leading-6 h-6 transition-colors ${
                  isHighlighted
                    ? 'text-indigo-400 font-bold bg-indigo-500/10'
                    : 'text-slate-600'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative flex-1 h-full">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              updateCursorPosition();
            }}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            placeholder={`// Write or paste your ${currentLangInfo.name} source code here...`}
            className="w-full h-full p-3 resize-none bg-transparent text-slate-100 placeholder-slate-600 font-mono text-xs sm:text-sm leading-6 focus:outline-none selection:bg-indigo-600/30 selection:text-white"
          />
        </div>
      </div>

      {/* Bottom Workbench Status Bar */}
      <div className="h-10 px-3 bg-[#090d16] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 gap-3">
        {/* Left: Telemetry & Actions */}
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums text-slate-400">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-slate-400">
            {linesCount} {linesCount === 1 ? 'line' : 'lines'}
          </span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="font-mono tabular-nums text-slate-400 hidden sm:inline">
            {code.length} chars
          </span>

          <span className="text-slate-600 hidden md:inline">·</span>
          <button
            onClick={handlePaste}
            className="hover:text-slate-200 transition-colors hidden md:flex items-center gap-1"
          >
            <Clipboard className="w-3 h-3" />
            <span>Paste</span>
          </button>

          {code && (
            <button
              onClick={handleCopyInput}
              className="hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}

          {code && (
            <button
              onClick={onClear}
              className="hover:text-rose-400 transition-colors text-slate-500 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Right: Explain Button */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden lg:inline">
            <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
              Enter
            </kbd>
          </span>

          <button
            onClick={onExplain}
            disabled={isLoading || !code.trim()}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              isLoading || !code.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Explaining...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>Explain Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
