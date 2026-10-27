import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Terminal, Lightbulb } from 'lucide-react';
=======
import { Terminal, Lightbulb, XCircle } from 'lucide-react';
>>>>>>> c0285dd (Update AI Code Explainer)

const STAGES = [
  'Lexing keywords and tokenizing syntax...',
  'Constructing abstract syntax tree & flow graph...',
  'Inspecting edge cases, boundaries, and variables...',
  'Synthesizing plain English breakdown and analogies...',
];

const QUICK_TIPS = [
  'A function is like a cooking recipe: it takes ingredients (inputs) and produces a dish (output).',
  'Off-by-one errors are one of the most common programming mistakes. Always verify loop boundaries.',
  'Pointers in C/C++ store the street address where data lives, not the data itself.',
  'Python indentation defines scope, whereas Java, C, and JavaScript use curly braces {}.',
  'Time complexity measures how your program slows down as input size grows, not real clock seconds.',
];

<<<<<<< HEAD
export const LoadingState: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
=======
interface LoadingStateProps {
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
>>>>>>> c0285dd (Update AI Code Explainer)

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1300);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % QUICK_TIPS.length);
    }, 3800);

<<<<<<< HEAD
    return () => {
      clearInterval(stageTimer);
      clearInterval(tipTimer);
=======
    const secondTimer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(tipTimer);
      clearInterval(secondTimer);
>>>>>>> c0285dd (Update AI Code Explainer)
    };
  }, []);

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-full bg-[#0d121f] border border-slate-800 rounded-xl p-8 items-center justify-center text-center">
=======
    <div className="flex flex-col h-full bg-[#0d121f] border border-slate-800 rounded-xl p-8 items-center justify-center text-center relative">
>>>>>>> c0285dd (Update AI Code Explainer)
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
        <Terminal className="w-5 h-5 animate-pulse" />
      </div>

      <h3 className="text-sm font-semibold text-slate-100">
        Analyzing Source Code
      </h3>

      <p className="text-xs text-slate-400 mt-1 max-w-sm">
        Gemini is parsing code structures and translating them into simple English.
      </p>

      {/* Technical stage bar */}
      <div className="w-full max-w-xs mt-6 space-y-2">
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          <span className="text-indigo-400 font-semibold">[{stageIndex + 1}/4]</span>{' '}
          {STAGES[stageIndex]}
        </div>
<<<<<<< HEAD
      </div>

=======

        {elapsedSeconds >= 8 && (
          <div className="text-[10px] text-slate-500">
            Waiting for AI model response ({elapsedSeconds}s)...
          </div>
        )}
      </div>

      {/* Cancel button if user wants to stop waiting */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-3 py-1 rounded border border-slate-850 hover:bg-slate-900"
        >
          <XCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Cancel</span>
        </button>
      )}

>>>>>>> c0285dd (Update AI Code Explainer)
      {/* Tip */}
      <div className="mt-8 p-3 rounded-lg bg-[#070a13] border border-slate-800/80 text-xs text-slate-400 max-w-sm flex items-start gap-2.5 text-left">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed">{QUICK_TIPS[tipIndex]}</span>
      </div>
    </div>
  );
};
