'use client';

import { useState, useRef, useEffect } from 'react';
import { parseEvaluation, parseRationaleMarkdown } from '../utils/parse';
import {
  evaluationPrompt,
  revisionPrompt,
  rationalePrompt,
} from '../utils/prompts';
import { useDiffLoader } from '../hooks/useDiffLoader';
import { ScoreCircle } from '../components/ScoreCircle';
import { ScoreBar } from '../components/ScoreBar';
import { Evaluation } from '../utils/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function askServer(prompt: string, reset = false): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, reset }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data.text;
}

export default function EnglishEvaluatorPage() {
  // --- State Management ---
  const [task, setTask] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [revisedAnswer, setRevisedAnswer] = useState('');
  const [rationaleMd, setRationaleMd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const diffHtml = useDiffLoader(answer, revisedAnswer, showDiff);

  // Scroll into view when results or error appear
  useEffect(() => {
    if (evaluation || error) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [evaluation, error]);

  // --- Main Handler ---
  const handleSubmit = async () => {
    if (!task.trim() || !answer.trim()) {
      setError('Please provide both the task and your answer.');
      return;
    }

    setIsLoading(true);
    setError('');
    setEvaluation(null);
    setRevisedAnswer('');
    setRationaleMd('');
    setShowDiff(false);


    try {
      // 1) Evaluation, with reset=true so server clears history
      const evalText = await askServer(evaluationPrompt(task, answer), true);
      setEvaluation(parseEvaluation(evalText));
      // console.log('Client evalText:', evalText);

      // 2) Revision
      const revText = await askServer(revisionPrompt);
      setRevisedAnswer(revText.trim());

      // 3) Rationale
      const ratText = await askServer(rationalePrompt(answer, revText));
      // console.log('ratText:', ratText);
      setRationaleMd(parseRationaleMarkdown(ratText));
      // console.log('rationaleMd:', rationaleMd);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

    
  // --- Render ---
  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">AI English Writing Coach</h1>
          <p className="mt-2 text-lg text-gray-600">
            Get instant, expert feedback on your writing.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="space-y-6">
            <div>
              <label htmlFor="task" className="block text-sm font-medium mb-1">
                Writing Task
              </label>
              <textarea
                id="task"
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the writing prompt here..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium mb-1">
                Your Answer
              </label>
              <textarea
                id="answer"
                rows={8}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Write your response here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Analyzing…' : 'Evaluate My Writing'}
          </button>
        </section>

        {/* Results */}
        <div ref={resultsRef} className="mt-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {evaluation && (
            <>
              {/* Numeric UI as before */}
              <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-4">Evaluation</h2>
                <div className="md:grid md:grid-cols-3 gap-6">
                  <div className="flex justify-center">
                    <ScoreCircle score={evaluation.totalScore} />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <ScoreBar label="Relevancy" score={evaluation.relevancy} />
                    <ScoreBar label="Elaboration" score={evaluation.elaboration} />
                    <ScoreBar label="Syntax" score={evaluation.syntax} />
                    <ScoreBar label="Vocabulary" score={evaluation.vocabulary} />
                    <ScoreBar label="Naturalness" score={evaluation.naturalness} />
                    <ScoreBar label="Grammar" score={evaluation.grammar} />
                  </div>
                </div>
              </section>

              {/* Detailed Feedback as Markdown */}
              <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
                <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>
                <div className="prose prose-sm max-w-none">
                  
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {evaluation.detailedFeedback}
    </ReactMarkdown>
  </div>
              </section>
            </>
          )}
          

          {revisedAnswer && (
            <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Revised Text</h2>
                <button
                  onClick={() => setShowDiff((prev) => !prev)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                  {showDiff ? 'Hide Comparison' : 'Compare with Original'}
                </button>
              </div>
              {showDiff ? (
                <div
                  className="diff-container whitespace-pre-wrap text-left text-base"
                  dangerouslySetInnerHTML={{ __html: diffHtml }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-base">{revisedAnswer}</pre>
              )}
            </section>
          )}

          {rationaleMd && (
            <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Rationale for Changes</h2>
              <div className="prose prose-sm max-w-none">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
             {rationaleMd}
           </ReactMarkdown>
         </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
