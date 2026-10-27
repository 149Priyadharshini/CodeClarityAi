import React, { useState } from 'react';
import {
  FileText,
  ListTree,
  Bug,
  Sparkles,
  Check,
  Copy,
  Download,
  Volume2,
  VolumeX,
  Send,
  HelpCircle,
  Clock,
  Layers,
  RotateCcw,
  Search,
} from 'lucide-react';
import { ExplanationResponse, ChatMessage } from '../types';

interface ExplanationViewProps {
  explanation: ExplanationResponse;
  originalCode: string;
  language: string;
  onHighlightLine?: (line: string | null) => void;
}

export const ExplanationView: React.FC<ExplanationViewProps> = ({
  explanation,
  originalCode,
  language,
  onHighlightLine,
}) => {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'lines' | 'bugs' | 'clean' | 'quiz' | 'ask'
  >('summary');

  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedClean, setCopiedClean] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Tutor chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  // Line search filter
  const [lineSearch, setLineSearch] = useState('');

  // Speech synthesis
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${explanation.summary}. Time complexity: ${explanation.timeComplexity}. Space complexity: ${explanation.spaceComplexity}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Copy full explanation markdown
  const handleCopyFull = async () => {
    let md = `# Code Explanation: ${explanation.detectedLanguage || language}\n\n`;
    md += `## Summary\n${explanation.summary}\n\n`;
    md += `**Difficulty:** ${explanation.difficultyLevel} · **Time:** ${explanation.timeComplexity} · **Space:** ${explanation.spaceComplexity}\n\n`;
    md += `**Key Concepts:** ${explanation.keyConcepts.join(', ')}\n\n`;

    md += `## Line-by-Line Breakdown\n`;
    explanation.lineExplanations.forEach((item) => {
      md += `### Line ${item.lineNumberRange}: \`${item.codeSnippet}\`\n`;
      md += `${item.explanation}\n`;
      if (item.analogy) {
        md += `*Analogy:* ${item.analogy}\n`;
      }
      md += `\n`;
    });

    if (explanation.bugs.length > 0) {
      md += `## Detected Issues\n`;
      explanation.bugs.forEach((b) => {
        md += `- **[${b.severity.toUpperCase()}] Line ${b.line}: ${b.title}**\n  ${b.description}\n  *Fix:* \`${b.suggestedFix}\`\n\n`;
      });
    }

    if (explanation.cleanCode) {
      md += `## Clean Code\n\`\`\`\n${explanation.cleanCode}\n\`\`\`\n`;
    }

    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Download markdown
  const handleDownload = () => {
    let md = `# Code Explanation: ${explanation.detectedLanguage || language}\n\n`;
    md += `## Summary\n${explanation.summary}\n\n`;
    md += `**Difficulty:** ${explanation.difficultyLevel} · **Time:** ${explanation.timeComplexity} · **Space:** ${explanation.spaceComplexity}\n\n`;
    md += `## Line-by-Line Breakdown\n`;
    explanation.lineExplanations.forEach((item) => {
      md += `### Line ${item.lineNumberRange}: \`${item.codeSnippet}\`\n${item.explanation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `explanation-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy clean code
  const handleCopyClean = async () => {
    if (!explanation.cleanCode) return;
    try {
      await navigator.clipboard.writeText(explanation.cleanCode);
      setCopiedClean(true);
      setTimeout(() => setCopiedClean(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Ask tutor
  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuestion.trim() || isAnswering) return;

    const q = userQuestion.trim();
    setUserQuestion('');
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setIsAnswering(true);

    try {
      const res = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: originalCode,
          language: explanation.detectedLanguage || language,
          question: q,
          previousSummary: explanation.summary,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get answer');

      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error communicating with tutor';
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: `Issue: ${msg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAnswering(false);
    }
  };

  const filteredLines = explanation.lineExplanations.filter(
    (item) =>
      item.codeSnippet.toLowerCase().includes(lineSearch.toLowerCase()) ||
      item.explanation.toLowerCase().includes(lineSearch.toLowerCase()) ||
      item.lineNumberRange.includes(lineSearch)
  );

  return (
    <div className="flex flex-col h-full bg-[#0d121f] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Top Bar with unboxed metadata & export controls */}
      <div className="h-10 bg-[#090d16] border-b border-slate-800 flex items-center justify-between px-3 gap-3">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-400 overflow-hidden">
          <span className="font-semibold text-slate-200">
            {explanation.detectedLanguage || language}
          </span>
          <span className="text-slate-600">·</span>
          <span>{explanation.difficultyLevel || 'Beginner'}</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline font-mono tabular-nums">
            {explanation.lineExplanations.length} lines analyzed
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              isSpeaking
                ? 'bg-indigo-950 text-indigo-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Listen to summary"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            title="Download Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyFull}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="px-3 py-2 bg-[#090d16]/50 border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'summary'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('lines')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lines'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListTree className="w-3 h-3" />
          <span>Line-by-Line</span>
          <span className="text-[11px] font-mono text-slate-500">
            ({explanation.lineExplanations.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bugs')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'bugs'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bug className="w-3 h-3" />
          <span>Issues & Bugs</span>
          {explanation.bugs.length > 0 && (
            <span className="text-[11px] font-mono text-rose-400 font-bold">
              ({explanation.bugs.length})
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('clean')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'clean'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Refactored Code</span>
        </button>

        {explanation.quiz && explanation.quiz.length > 0 && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Quiz</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('ask')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ask'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3 h-3" />
          <span>Ask Tutor</span>
          {chatMessages.length > 0 && (
            <span className="text-[11px] font-mono text-indigo-400">
              ({chatMessages.length})
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* ================= SUMMARY VIEW ================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Purpose section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Overview & Purpose
              </h4>
              <p className="text-sm leading-relaxed text-slate-200 font-sans">
                {explanation.summary}
              </p>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-medium">Time Complexity</span>
                </div>
                <div className="text-xs text-slate-200 font-mono">
                  {explanation.timeComplexity}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#070a13] border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Space Complexity</span>
                </div>
                <div className="text-xs text-slate-200 font-mono">
                  {explanation.spaceComplexity}
                </div>
              </div>
            </div>

            {/* Key Concepts - Unboxed text items with separators */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Core Programming Concepts
              </h4>
              <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-300">
                {explanation.keyConcepts.map((concept, idx) => (
                  <React.Fragment key={idx}>
                    <span className="font-medium text-slate-200">{concept}</span>
                    {idx < explanation.keyConcepts.length - 1 && (
                      <span className="text-slate-600 px-2" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setActiveTab('lines')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
              >
                Inspect line-by-line breakdown →
              </button>
              {explanation.bugs.length > 0 && (
                <button
                  onClick={() => setActiveTab('bugs')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 text-rose-300 transition-colors"
                >
                  Review {explanation.bugs.length} potential issues →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= LINE BY LINE VIEW ================= */}
        {activeTab === 'lines' && (
          <div className="space-y-3">
            {/* Filter */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">
                Click any line to highlight in code editor
              </span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter lines..."
                  value={lineSearch}
                  onChange={(e) => setLineSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-md bg-[#070a13] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-40 sm:w-52"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredLines.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onHighlightLine?.(item.lineNumberRange)}
                  className="p-3 rounded-lg bg-[#070a13] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-1.5 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-indigo-400">
                      Ln {item.lineNumberRange}
                    </span>
                    <span className="text-slate-600">·</span>
                    <code className="text-xs font-mono text-slate-200 bg-slate-900 px-2 py-0.5 rounded overflow-x-auto max-w-full">
                      {item.codeSnippet}
                    </code>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans pl-1">
                    {item.explanation}
                  </p>

                  {item.analogy && (
                    <div className="mt-1 text-[11px] text-slate-400 pl-1 italic">
                      <span className="text-indigo-400 font-medium not-italic">Analogy: </span>
                      {item.analogy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BUGS VIEW ================= */}
        {activeTab === 'bugs' && (
          <div className="space-y-3">
            {explanation.bugs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-[#070a13] rounded-lg border border-slate-800">
                <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-200">No Critical Bugs Found</div>
                <p className="mt-1 text-slate-400">
                  The code structure appears sound under standard inputs.
                </p>
              </div>
            ) : (
              explanation.bugs.map((bug, idx) => {
                const isCrit = bug.severity.toLowerCase().includes('crit');
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#070a13] border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold uppercase tracking-wider text-[10px] ${
                            isCrit ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {bug.severity}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-slate-400">
                          {bug.line === 'general' ? 'General' : `Line ${bug.line}`}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{bug.title}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{bug.description}</p>

                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-xs font-mono">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
                        Recommended Fix:
                      </span>
                      <code className="text-emerald-300 whitespace-pre-wrap">
                        {bug.suggestedFix}
                      </code>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ================= REFACTORED CODE VIEW ================= */}
        {activeTab === 'clean' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Idiomatic, formatted, and commented version
              </span>
              <button
                onClick={handleCopyClean}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copiedClean ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedClean ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#070a13] border border-slate-800 font-mono text-xs leading-5 text-slate-200 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{explanation.cleanCode}</pre>
            </div>
          </div>
        )}

        {/* ================= QUIZ VIEW ================= */}
        {activeTab === 'quiz' && explanation.quiz && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Check your understanding of this code</span>
              {submittedQuiz && (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmittedQuiz(false);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Quiz</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {explanation.quiz.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div key={qIdx} className="p-3.5 rounded-lg bg-[#070a13] border border-slate-800 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-200">
                      <span className="text-indigo-400 mr-1.5">Q{qIdx + 1}.</span>
                      {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (submittedQuiz) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-950/60 border-rose-600/50 text-rose-200';
                          } else {
                            btnStyle = 'opacity-40 border-slate-900';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-indigo-950/60 border-indigo-500 text-indigo-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                            className={`w-full p-2 rounded text-left text-xs transition-colors border ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div
                        className={`p-2 rounded text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-950/30 text-emerald-300'
                            : 'bg-amber-950/30 text-amber-300'
                        }`}
                      >
                        <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submittedQuiz && (
              <button
                onClick={() => setSubmittedQuiz(true)}
                disabled={Object.keys(selectedAnswers).length < explanation.quiz.length}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            )}
          </div>
        )}

        {/* ================= ASK TUTOR VIEW ================= */}
        {activeTab === 'ask' && (
          <div className="flex flex-col h-full space-y-3">
            <span className="text-xs text-slate-400">
              Ask any question about how this code works:
            </span>

            <div className="space-y-2 min-h-[160px] max-h-[320px] overflow-y-auto pr-1">
              {chatMessages.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-[#070a13] rounded-lg border border-slate-800">
                  <p className="text-slate-400 font-medium">No questions yet</p>
                  <p className="mt-1 text-[11px]">
                    Try asking: "What does this loop do?", "Why use a pointer here?", or "What happens if the input is empty?"
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-lg text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#070a13] border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                  </div>
                ))
              )}

              {isAnswering && (
                <div className="text-xs text-indigo-400 p-2">Tutor is typing...</div>
              )}
            </div>

            <form onSubmit={handleAskQuestion} className="flex items-center gap-2 pt-2 mt-auto">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask about this code..."
                disabled={isAnswering}
                className="flex-1 px-3 py-1.5 rounded-md bg-[#070a13] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim() || isAnswering}
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
