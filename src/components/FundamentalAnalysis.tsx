import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Brain, TrendingUp, BarChart2, AlertTriangle, RefreshCw, Loader } from 'lucide-react';
import { fetchForexNews } from '../services/rss';
import { analyzeFundamentals } from '../services/analysis';

interface Opportunity {
  pair: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: string;
  entry: {
    price: number;
    range: string;
  };
  target: number;
  stopLoss: number;
  rationale: string;
  impactLevel: 'high' | 'medium' | 'low';
  relatedNews: string[];
}

export const FundamentalAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const { 
    data: news,
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews
  } = useQuery('forexNews', fetchForexNews, {
    refetchInterval: 5 * 60 * 1000,
  });

  const analyzeNews = async () => {
    if (!news?.length) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeFundamentals(news.slice(0, 20));
      setOpportunities(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-500';
      case 'bearish':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
    }
  };

  const getConfidenceBar = (confidence: number) => {
    const color = confidence > 75 ? 'bg-green-500' : 
                 confidence > 50 ? 'bg-yellow-500' : 
                 'bg-red-500';
    
    return (
      <div className="w-full bg-slate-700 h-2 rounded-full">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-500`} 
          style={{ width: `${confidence}%` }}
        />
      </div>
    );
  };

  if (newsLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading news feed...</span>
        </div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span>Failed to load news feed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-semibold">AI Fundamental Analysis</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchNews()}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Refresh news"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={analyzeNews}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart2 className="w-4 h-4" />
                Analyze Latest News
              </>
            )}
          </button>
        </div>
      </div>

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((opp, index) => (
            <div 
              key={index}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{opp.pair}</h3>
                  <span className={`${getSentimentColor(opp.sentiment)} font-medium`}>
                    {opp.sentiment.toUpperCase()}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(opp.impactLevel)} bg-opacity-20`}>
                  {opp.impactLevel.toUpperCase()} IMPACT
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>Confidence</span>
                  <span>{opp.confidence}%</span>
                </div>
                {getConfidenceBar(opp.confidence)}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">Entry</div>
                  <div className="font-medium">{opp.entry.range}</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">Target</div>
                  <div className="font-medium text-green-400">{opp.target}</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">Stop Loss</div>
                  <div className="font-medium text-red-400">{opp.stopLoss}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm text-slate-400 mb-1">Rationale</div>
                <p className="text-sm">{opp.rationale}</p>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-1">Related News</div>
                <ul className="text-sm space-y-1">
                  {opp.relatedNews.map((news, idx) => (
                    <li key={idx} className="truncate text-blue-400 hover:text-blue-300">
                      {news}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Click "Analyze Latest News" to get trading opportunities</p>
        </div>
      )}
    </div>
  );
};