/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useRef } from 'react';
>>>>>>> c0285dd (Update AI Code Explainer)
import { Navbar } from './components/Navbar';
import { CodeEditor } from './components/CodeEditor';
import { ExplanationView } from './components/ExplanationView';
import { LoadingState } from './components/LoadingState';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SAMPLE_CODES } from './sampleCodes';
import { SupportedLanguage, ExplanationResponse, AudienceLevel } from './types';
import {
  AlertCircle,
  Code2,
  ListTree,
  Bug,
  Sparkles,
  ArrowRight,
<<<<<<< HEAD
=======
  RotateCcw,
  RefreshCw,
>>>>>>> c0285dd (Update AI Code Explainer)
} from 'lucide-react';

export default function App() {
  const defaultSample = SAMPLE_CODES[0];
  const [code, setCode] = useState<string>(defaultSample.code);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultSample.language);
  const [audienceLevel, setAudienceLevel] = useState<AudienceLevel>('beginner');

  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [highlightedLine, setHighlightedLine] = useState<string | null>(null);

<<<<<<< HEAD
=======
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

>>>>>>> c0285dd (Update AI Code Explainer)
  const handleExplain = async () => {
    if (!code.trim()) {
      setErrorMessage('Please enter or paste source code to explain.');
      return;
    }

<<<<<<< HEAD
    setIsLoading(true);
    setErrorMessage(null);

=======
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);

    // 25-second client timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000);

>>>>>>> c0285dd (Update AI Code Explainer)
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          audienceLevel,
        }),
<<<<<<< HEAD
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to explain code. Please try again.');
      }

      setExplanation(data);
    } catch (err: unknown) {
      console.error('Explanation request failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while communicating with the AI.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
=======
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          response.ok
            ? 'Invalid response format from server.'
            : `Server returned HTTP ${response.status}: ${text || 'Unknown error'}`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status}). Please try again.`);
      }

      setExplanation(data);
      setErrorMessage(null);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error('Explanation request failed:', err);

      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMessage(
          'Request timed out after 25 seconds. The AI service may be experiencing high demand. Please click "Retry Explanation" below.'
        );
      } else {
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while communicating with the AI.';
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
>>>>>>> c0285dd (Update AI Code Explainer)
    }
  };

  const handleClear = () => {
<<<<<<< HEAD
=======
    handleCancel();
>>>>>>> c0285dd (Update AI Code Explainer)
    setCode('');
    setExplanation(null);
    setErrorMessage(null);
    setHighlightedLine(null);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        audienceLevel={audienceLevel}
        setAudienceLevel={setAudienceLevel}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        selectedLanguage={language}
        onResetAll={handleClear}
      />

      {/* Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
        {/* Workspace Subheader with clean unboxed metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-850 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Source Inspection Workspace</span>
            <span className="text-slate-600">·</span>
            <span>Translate code into plain English, detect errors, and understand logic</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Java, Python, C, C++, JavaScript</span>
            <span className="text-slate-700">·</span>
            <span>Static Interpretation</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* Error notification */}
=======
        {/* Top Error notification banner */}
>>>>>>> c0285dd (Update AI Code Explainer)
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-850 text-rose-200 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
<<<<<<< HEAD
                <strong className="font-semibold text-rose-300">Analysis Error: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 underline shrink-0"
            >
              Dismiss
            </button>
=======
                <strong className="font-semibold text-rose-300">Analysis Notice: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExplain}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-200 underline text-xs"
              >
                Dismiss
              </button>
            </div>
>>>>>>> c0285dd (Update AI Code Explainer)
          </div>
        )}

        {/* Side-by-Side Code Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 items-stretch min-h-[540px]">
          {/* Left Column: Code Editor */}
          <div className="h-full flex flex-col">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onExplain={handleExplain}
              onClear={handleClear}
              isLoading={isLoading}
              highlightedLine={highlightedLine}
            />
          </div>

<<<<<<< HEAD
          {/* Right Column: Explanation or Ready State */}
          <div className="h-full flex flex-col min-h-[460px]">
            {isLoading ? (
              <LoadingState />
=======
          {/* Right Column: Explanation, Error / Retry, or Ready State */}
          <div className="h-full flex flex-col min-h-[460px]">
            {isLoading ? (
              <LoadingState onCancel={handleCancel} />
            ) : errorMessage && !explanation ? (
              /* Dedicated Error & Retry State */
              <div className="h-full bg-[#0d121f] border border-rose-900/40 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-4">
                    <AlertCircle className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-100">
                    Unable to generate explanation
                  </h3>

                  <p className="text-xs text-rose-300/90 mt-2 p-3 bg-rose-950/30 border border-rose-900/30 rounded-lg leading-relaxed font-mono">
                    {errorMessage}
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-slate-400">
                    <div className="font-semibold text-slate-300">Suggested Steps:</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                      <li>Click the <strong>Retry Explanation</strong> button below.</li>
                      <li>Check that your code is valid syntax and not empty.</li>
                      <li>Try selecting a smaller snippet if analyzing a large file.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Back to ready screen
                  </button>

                  <button
                    onClick={handleExplain}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Explanation</span>
                  </button>
                </div>
              </div>
>>>>>>> c0285dd (Update AI Code Explainer)
            ) : explanation ? (
              <ExplanationView
                explanation={explanation}
                originalCode={code}
                language={language}
                onHighlightLine={setHighlightedLine}
              />
            ) : (
              /* Ready State */
              <div className="h-full bg-[#0d121f] border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4">
                    <Code2 className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-100">
                    Ready to analyze code
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                    Paste source code or choose one of our prepared examples on the left, then click <strong>Explain Code</strong> to generate a line-by-line breakdown, complexity analysis, and bug audit.
                  </p>

                  <div className="mt-8 space-y-3">
                    <div className="flex items-start gap-3 text-xs">
                      <ListTree className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-200">Line-by-Line Breakdown</div>
                        <div className="text-slate-400 text-[11px]">
                          Each important statement is translated into everyday English with intuitive mental models.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs">
                      <Bug className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-200">Bug & Edge Case Scanner</div>
                        <div className="text-slate-400 text-[11px]">
                          Checks for off-by-one loops, zero-division hazards, and unhandled conditions.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-200">Refactored Clean Code</div>
                        <div className="text-slate-400 text-[11px]">
                          Compare your snippet against an idiomatic, well-commented standard version.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sample code ready in editor</span>
                  <button
                    onClick={handleExplain}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Run Explanation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Learning Guide Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-[#090d16] py-3 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>AI Code Explainer · Built for students & beginner programmers</div>
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <span>Powered by Gemini 3.8 Flash</span>
=======
            <span>Powered by Gemini AI</span>
>>>>>>> c0285dd (Update AI Code Explainer)
            <span className="text-slate-700">·</span>
            <span>Static Code Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
