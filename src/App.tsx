import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Send, Brain } from 'lucide-react';
import { FundamentalAnalysis } from './components/FundamentalAnalysis';
import { Analysis } from './components/Analysis';
import { SettingsPanel } from './components/SettingsPanel';
import { NewsFeed } from './components/NewsFeed';
import { getOpenAIAnalysis } from './services/openai';
import { useSettingsStore } from './store/settings';

function App() {
  const [prompt, setPrompt] = useState('');
  const { apiKey } = useSettingsStore();

  const { data: analysis, isLoading, error, refetch } = useQuery(
    ['analysis', prompt],
    () => getOpenAIAnalysis(prompt, []),
    { enabled: false }
  );

  const handleAnalysis = async () => {
    if (!apiKey) {
      alert('Please configure your OpenAI API key in settings');
      return;
    }
    refetch();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold">AI Trading Analyst</h1>
          </div>
          <SettingsPanel />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FundamentalAnalysis />

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Custom Analysis Request</h2>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you'd like to analyze..."
                  className="w-full h-32 bg-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAnalysis}
                  disabled={isLoading || !prompt}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg">
              <h2 className="text-lg font-semibold p-6 border-b border-slate-700">AI Analysis</h2>
              <Analysis analysis={analysis} loading={isLoading} error={error as Error} />
            </div>

            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;