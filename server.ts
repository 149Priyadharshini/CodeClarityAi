import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

<<<<<<< HEAD
// Shared Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
=======
// Helper to get or create GoogleGenAI client with current env API key and strict timeout
function getAIClient() {
  const key = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 20000, // 20s timeout per call to prevent hanging indefinitely
    },
  });
}
>>>>>>> c0285dd (Update AI Code Explainer)

export interface ExplainRequest {
  code: string;
  language: string;
  audienceLevel?: 'beginner' | 'kid' | 'college';
}

<<<<<<< HEAD
=======
const EXPLANATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A 2-4 sentence high-level summary of what this code does in plain English.',
    },
    detectedLanguage: {
      type: Type.STRING,
      description: 'The programming language of the code (e.g., Java, Python, C, C++, JavaScript).',
    },
    difficultyLevel: {
      type: Type.STRING,
      description: 'Skill level of this code: Beginner, Intermediate, or Advanced.',
    },
    timeComplexity: {
      type: Type.STRING,
      description: 'Big-O time complexity with a simple 1-line plain English explanation.',
    },
    spaceComplexity: {
      type: Type.STRING,
      description: 'Big-O auxiliary space complexity with a simple 1-line plain English explanation.',
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of 3 to 6 programming concepts demonstrated (e.g. Loops, Arrays, Conditionals).',
    },
    lineExplanations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lineNumberRange: {
            type: Type.STRING,
            description: 'Line number or range (e.g., "1", "2-4", "7").',
          },
          codeSnippet: {
            type: Type.STRING,
            description: 'The exact line or block of code being analyzed.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Crystal-clear explanation of what this line does in simple English.',
          },
          analogy: {
            type: Type.STRING,
            description: 'Optional fun real-world analogy explaining this line.',
          },
        },
        required: ['lineNumberRange', 'codeSnippet', 'explanation'],
      },
      description: 'Sequential breakdown of each important line or block.',
    },
    bugs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: {
            type: Type.STRING,
            description: 'critical, warning, or tip',
          },
          line: {
            type: Type.STRING,
            description: 'Line number or "general"',
          },
          title: {
            type: Type.STRING,
            description: 'Short headline of the bug or risk.',
          },
          description: {
            type: Type.STRING,
            description: 'Why this causes an issue or crash.',
          },
          suggestedFix: {
            type: Type.STRING,
            description: 'Recommended correction or corrected code line.',
          },
        },
        required: ['severity', 'line', 'title', 'description', 'suggestedFix'],
      },
      description: 'Possible bugs, logic flaws, missing edge cases, or potential crashes found in the code.',
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Short title of the improvement.',
          },
          description: {
            type: Type.STRING,
            description: 'Why this improvement helps readability, safety, or efficiency.',
          },
          improvedSnippet: {
            type: Type.STRING,
            description: 'Small snippet demonstrating the improved syntax.',
          },
        },
        required: ['title', 'description'],
      },
      description: 'Actionable suggestions to improve the code.',
    },
    cleanCode: {
      type: Type.STRING,
      description: 'Full refactored and well-commented clean version of the code.',
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctIndex', 'explanation'],
      },
      description: '2 quick comprehension questions to test understanding.',
    },
  },
  required: [
    'summary',
    'detectedLanguage',
    'difficultyLevel',
    'timeComplexity',
    'spaceComplexity',
    'keyConcepts',
    'lineExplanations',
    'bugs',
    'improvements',
    'cleanCode',
  ],
};

>>>>>>> c0285dd (Update AI Code Explainer)
app.post('/api/explain', async (req: Request, res: Response) => {
  try {
    const { code, language, audienceLevel = 'beginner' } = req.body as ExplainRequest;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Source code is required.' });
    }

<<<<<<< HEAD
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in server environment.',
      });
    }

=======
    const currentKey = process.env.GEMINI_API_KEY;
    if (!currentKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please check your Settings > Secrets in AI Studio.',
      });
    }

    const ai = getAIClient();
>>>>>>> c0285dd (Update AI Code Explainer)
    const selectedLang = language || 'Auto-detect';
    const audienceDesc =
      audienceLevel === 'kid'
        ? 'an enthusiastic 10-year-old learning code for the very first time'
        : audienceLevel === 'college'
        ? 'a first-year computer science university student'
        : 'a beginner programmer with no prior coding background';

    const systemInstruction = `You are a patient, brilliant, and friendly Computer Science educator teaching ${audienceDesc}.
Your mission is to make programming intuitive, welcoming, and demystified.
Analyze the given source code written in ${selectedLang}.

Rules:
1. Explain the code in simple, clear, engaging English.
2. Avoid opaque jargon; if you use a technical term (like "variable", "pointer", "array", "recursion", "iteration"), immediately explain it with a friendly metaphor or analogy (e.g., variables are labeled shoeboxes, functions are recipes).
3. Do NOT claim the code was executed or run in a live runtime. State your insights as static analysis.
4. Provide a line-by-line or block-by-block breakdown of every meaningful line or construct.
5. Identify any potential bugs, subtle syntax errors, logic flaws, off-by-one errors, memory issues, null pointer exceptions, or infinite loops.
6. Provide constructive suggestions to make the code cleaner, more readable, and idiomatic.
7. Provide a clean, formatted, well-commented version of the code.
8. Include 2 quick multiple-choice questions for the student to test their comprehension.`;

    const prompt = `Please explain the following ${selectedLang} code for a student:\n\n\`\`\`${selectedLang.toLowerCase()}\n${code}\n\`\`\``;

<<<<<<< HEAD
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: unknown = null;
    let responseText: string | null = null;

    for (const modelName of modelsToTry) {
      try {
=======
    // Prioritize high-speed, reliable flash models that respond in 1-2 seconds
    const modelsToTry = [
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
    ];

    let lastError: unknown = null;
    let responseText: string | null = null;
    let succeededModel = '';

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting code explanation with model: ${modelName}...`);
>>>>>>> c0285dd (Update AI Code Explainer)
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
<<<<<<< HEAD
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'A 2-4 sentence high-level summary of what this code does in plain English.',
                },
                detectedLanguage: {
                  type: Type.STRING,
                  description: 'The programming language of the code (e.g., Java, Python, C, C++, JavaScript).',
                },
                difficultyLevel: {
                  type: Type.STRING,
                  description: 'Skill level of this code: Beginner, Intermediate, or Advanced.',
                },
                timeComplexity: {
                  type: Type.STRING,
                  description: 'Big-O time complexity with a simple 1-line plain English explanation.',
                },
                spaceComplexity: {
                  type: Type.STRING,
                  description: 'Big-O auxiliary space complexity with a simple 1-line plain English explanation.',
                },
                keyConcepts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of 3 to 6 programming concepts demonstrated (e.g. Loops, Arrays, Conditionals).',
                },
                lineExplanations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      lineNumberRange: {
                        type: Type.STRING,
                        description: 'Line number or range (e.g., "1", "2-4", "7").',
                      },
                      codeSnippet: {
                        type: Type.STRING,
                        description: 'The exact line or block of code being analyzed.',
                      },
                      explanation: {
                        type: Type.STRING,
                        description: 'Crystal-clear explanation of what this line does in simple English.',
                      },
                      analogy: {
                        type: Type.STRING,
                        description: 'Optional fun real-world analogy explaining this line.',
                      },
                    },
                    required: ['lineNumberRange', 'codeSnippet', 'explanation'],
                  },
                  description: 'Sequential breakdown of each important line or block.',
                },
                bugs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      severity: {
                        type: Type.STRING,
                        description: 'critical, warning, or tip',
                      },
                      line: {
                        type: Type.STRING,
                        description: 'Line number or "general"',
                      },
                      title: {
                        type: Type.STRING,
                        description: 'Short headline of the bug or risk.',
                      },
                      description: {
                        type: Type.STRING,
                        description: 'Why this causes an issue or crash.',
                      },
                      suggestedFix: {
                        type: Type.STRING,
                        description: 'Recommended correction or corrected code line.',
                      },
                    },
                    required: ['severity', 'line', 'title', 'description', 'suggestedFix'],
                  },
                  description: 'Possible bugs, logic flaws, missing edge cases, or potential crashes found in the code.',
                },
                improvements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: {
                        type: Type.STRING,
                        description: 'Short title of the improvement.',
                      },
                      description: {
                        type: Type.STRING,
                        description: 'Why this improvement helps readability, safety, or efficiency.',
                      },
                      improvedSnippet: {
                        type: Type.STRING,
                        description: 'Small snippet demonstrating the improved syntax.',
                      },
                    },
                    required: ['title', 'description'],
                  },
                  description: 'Actionable suggestions to improve the code.',
                },
                cleanCode: {
                  type: Type.STRING,
                  description: 'Full refactored and well-commented clean version of the code.',
                },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctIndex', 'explanation'],
                  },
                  description: '2 quick comprehension questions to test understanding.',
                },
              },
              required: [
                'summary',
                'detectedLanguage',
                'difficultyLevel',
                'timeComplexity',
                'spaceComplexity',
                'keyConcepts',
                'lineExplanations',
                'bugs',
                'improvements',
                'cleanCode',
              ],
            },
=======
            responseSchema: EXPLANATION_SCHEMA,
>>>>>>> c0285dd (Update AI Code Explainer)
          },
        });

        if (response.text) {
          responseText = response.text;
<<<<<<< HEAD
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${modelName} encountered error, trying next fallback if available:`, err);
        lastError = err;
        // Brief delay before trying next fallback model
        await new Promise((resolve) => setTimeout(resolve, 800));
=======
          succeededModel = modelName;
          console.log(`Successfully generated explanation with ${modelName}`);
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${modelName} encountered an error:`, err);
        lastError = err;
        // Proceed to next fallback immediately without long sleep
>>>>>>> c0285dd (Update AI Code Explainer)
      }
    }

    if (!responseText) {
<<<<<<< HEAD
      throw lastError || new Error('All model attempts returned empty response.');
    }

    const parsed = JSON.parse(responseText);
    return res.json(parsed);
  } catch (err: unknown) {
    console.error('Error generating code explanation:', err);
    const message = err instanceof Error ? err.message : 'Failed to explain code';
=======
      let errorMsg = 'Failed to generate explanation with Gemini AI.';
      if (lastError instanceof Error) {
        errorMsg = lastError.message;
        // Clean up raw JSON error messages if any
        try {
          const parsed = JSON.parse(errorMsg);
          if (parsed.error?.message) {
            errorMsg = parsed.error.message;
          }
        } catch {
          // not JSON, keep original
        }
      }
      return res.status(503).json({ error: errorMsg });
    }

    // Clean any markdown code fence wrapping if model included it
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    const parsed = JSON.parse(cleanText);
    return res.json(parsed);
  } catch (err: unknown) {
    console.error('Error generating code explanation:', err);
    let message = 'An unexpected server error occurred while analyzing the code.';
    if (err instanceof Error) {
      message = err.message;
    }
>>>>>>> c0285dd (Update AI Code Explainer)
    return res.status(500).json({ error: message });
  }
});

// Follow-up question endpoint for interactive student learning
app.post('/api/ask-question', async (req: Request, res: Response) => {
  try {
    const { code, language, question, previousSummary } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

<<<<<<< HEAD
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

=======
    const currentKey = process.env.GEMINI_API_KEY;
    if (!currentKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const ai = getAIClient();
>>>>>>> c0285dd (Update AI Code Explainer)
    const systemInstruction = `You are a supportive, friendly Computer Science tutor.
A student is asking a question about the code they submitted.
Provide a concise, friendly, beginner-accessible answer (around 2-3 short paragraphs).
Use simple language, bold key terms, and provide a tiny code snippet if helpful.
Do not claim to have executed the code.`;

    const prompt = `Code (${language || 'programming language'}):
\`\`\`
${code || '(No specific code provided)'}
\`\`\`

Context Summary: ${previousSummary || 'N/A'}

Student Question: ${question}

Please answer the student's question in a clear, friendly, beginner-friendly way:`;

<<<<<<< HEAD
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const answer = response.text || 'Unable to generate an answer at this time.';
    return res.json({ answer });
=======
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    let answerText = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
          },
        });
        if (response.text) {
          answerText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed for ask-question:`, err);
      }
    }

    if (!answerText) {
      return res.status(503).json({ error: 'Unable to reach the AI tutor at this time. Please try again.' });
    }

    return res.json({ answer: answerText });
>>>>>>> c0285dd (Update AI Code Explainer)
  } catch (err: unknown) {
    console.error('Error answering question:', err);
    const message = err instanceof Error ? err.message : 'Failed to answer question';
    return res.status(500).json({ error: message });
  }
});

// Mount Vite or static dist
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
