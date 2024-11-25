import React from 'react';
import { useQuery } from 'react-query';
import { Newspaper, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchForexNews } from '../services/rss';
import { getOpenAIAnalysis } from '../services/openai';

export const NewsFeed: React.FC = () => {
  const { 
    data: news,
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews
  } = useQuery('forexNews', fetchForexNews, {
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const analyzeTradingOpportunity = async (newsItem: any) => {
    try {
      const prompt = `Based on this forex news: "${newsItem.title}. ${newsItem.description}"
      
      Please analyze:
      1. Potential impact on major currency pairs
      2. Possible trading opportunities
      3. Risk assessment
      4. Recommended timeframe for the trade
      
      Be specific with currency pairs and potential entry/exit points.`;

      const analysis = await getOpenAIAnalysis(prompt, []);
      alert(analysis); // For simplicity, we'll use an alert. In production, use a modal or dedicated UI component
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze trading opportunity. Please try again.');
    }
  };

  if (newsLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error loading news feed</h3>
        </div>
        <button 
          onClick={() => refetchNews()}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Latest Forex News</h2>
        </div>
        <button
          onClick={() => refetchNews()}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          title="Refresh news"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {news?.map((item: any, index: number) => (
          <div key={index} className="border-b border-slate-700 last:border-0 pb-4 last:pb-0">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 mb-2">{item.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {item.creator} • {item.pubDate}
              </span>
              <div className="space-x-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Read More
                </a>
                <button
                  onClick={() => analyzeTradingOpportunity(item)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white transition-colors"
                >
                  Analyze Opportunity
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};