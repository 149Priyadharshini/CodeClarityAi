export type SupportedLanguage = 'python' | 'javascript' | 'java' | 'c' | 'cpp';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  extension: string;
  iconColor: string;
  badgeColor: string;
  popularFor: string;
}

export interface LineExplanation {
  lineNumberRange: string;
  codeSnippet: string;
  explanation: string;
  analogy?: string;
}

export interface CodeBug {
  severity: 'critical' | 'warning' | 'tip';
  line: string;
  title: string;
  description: string;
  suggestedFix: string;
}

export interface CodeImprovement {
  title: string;
  description: string;
  improvedSnippet?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExplanationResponse {
  summary: string;
  detectedLanguage: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  timeComplexity: string;
  spaceComplexity: string;
  keyConcepts: string[];
  lineExplanations: LineExplanation[];
  bugs: CodeBug[];
  improvements: CodeImprovement[];
  cleanCode: string;
  quiz?: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export type AudienceLevel = 'beginner' | 'kid' | 'college';
