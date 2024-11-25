import React from 'react';
import { Brain, AlertTriangle } from 'lucide-react';

interface AnalysisProps {
  analysis: string | null;
  loading: boolean;
  error: Error | null;
}

export const Analysis: React.FC<AnalysisProps> = ({ analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error</h3>
        </div>
        <p className="text-red-300">{error.message}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Request an analysis to get started</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <div className="prose prose-invert max-w-none">
        {analysis.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};