'use client';

import { useState } from 'react';
import Markdown from 'react-markdown';
import { Sparkles, Heart, PenTool, Lightbulb, FileText, ListChecks } from 'lucide-react';
import { analyzePost, type AnalysisResult } from '../lib/api';

const OWN_MODES = [
  { id: 'emotional-support', label: 'Emotional Support', icon: Heart, color: 'bg-pastel-pink' },
  { id: 'writing-feedback', label: 'Refine My Text', icon: PenTool, color: 'bg-pastel-blue' },
  { id: 'topic-insights', label: 'Topic Insights', icon: Lightbulb, color: 'bg-pastel-lavender' },
  { id: 'content-summary', label: 'Summary', icon: FileText, color: 'bg-pastel-mint' },
];

const OTHER_MODES = [
  { id: 'content-summary', label: 'Summarize', icon: FileText, color: 'bg-pastel-mint' },
  { id: 'topic-insights', label: 'Key Takeaways', icon: ListChecks, color: 'bg-pastel-lavender' },
];

interface AiAnalysisProps {
  postId: number;
  isOwnPost: boolean;
}

export default function AiAnalysis({ postId, isOwnPost }: AiAnalysisProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modes = isOwnPost ? OWN_MODES : OTHER_MODES;

  const handleAnalyze = async () => {
    if (!selectedMode || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await analyzePost(postId, selectedMode);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary text-sm text-text-secondary hover:bg-surface-tertiary transition"
        >
          <Sparkles size={16} />
          {isOwnPost ? 'AI Analysis' : 'AI Summary'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-surface-secondary rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <Sparkles size={16} />
          {isOwnPost ? 'AI Analysis' : 'AI Summary'}
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-text-muted hover:text-text-primary transition"
        >
          Close
        </button>
      </div>

      {/* Mode selector */}
      <div className={`grid ${isOwnPost ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'} gap-2 mb-4`}>
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition ${
                selectedMode === mode.id
                  ? `${mode.color} text-text-primary`
                  : 'bg-white text-text-muted hover:bg-white/80'
              }`}
            >
              <Icon size={14} />
              {mode.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!selectedMode || loading}
        className="w-full py-2.5 rounded-xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-sm text-text-primary transition disabled:opacity-50 mb-4"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {loading && (
        <div className="text-center py-6">
          <div className="inline-block w-6 h-6 border-2 border-pastel-lavender border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted mt-2">Thinking...</p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-pastel-pink text-sm text-text-secondary text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* NLP Stats */}
          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            <span>Sentiment: <span className={
              result.nlp.sentiment.label === 'positive' ? 'text-green-500' :
              result.nlp.sentiment.label === 'negative' ? 'text-red-400' : 'text-text-muted'
            }>{result.nlp.sentiment.label} ({result.nlp.sentiment.score})</span></span>
            <span>{result.nlp.wordCount} words</span>
            <span>{result.nlp.readingTimeMinutes} min read</span>
          </div>

          {/* Keywords */}
          {result.nlp.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.nlp.keywords.map((keyword, i) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-pastel-blue text-text-secondary">
                  {keyword}
                </span>
              ))}
            </div>
          )}

          {/* AI Response */}
          <div className="bg-white rounded-2xl p-6 prose prose-sm max-w-none text-text-secondary">
            <Markdown>{result.aiResponse}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
