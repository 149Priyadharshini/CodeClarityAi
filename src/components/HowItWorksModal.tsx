import React from 'react';
import { X, BookOpen, Bug, ListTree, Sparkles, Code2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Guide to AI Code Explainer
          </h3>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              1. Choose Language & Write Code
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Supports Java, Python, C, C++, and JavaScript. Click <strong>Load Sample</strong> to inspect pre-built algorithms or test bug scenarios.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <ListTree className="w-4 h-4 text-indigo-400" />
              2. Line-by-Line Breakdown & Everyday Analogies
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Each statement is dissected into plain English. Click any line in the breakdown to inspect it side-by-side with your code editor.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              3. Automated Bug & Edge Case Auditing
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Identifies off-by-one errors, unhandled empty inputs, zero-division, and memory safety issues before you test in a runtime.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              4. Interactive Practice & Follow-up Q&A
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Take the instant comprehension quiz to test your understanding, or chat with the AI Tutor to ask questions about specific keywords.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
