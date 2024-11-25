import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, AlertTriangle } from 'lucide-react';

interface Indicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
}

interface TimeframeAnalysis {
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  indicators: Indicator[];
  support: number;
  resistance: number;
}

export const TechnicalAnalysis: React.FC = () => {
  const [pair, setPair] = useState('EUR/USD');
  const [loading, setLoading] = useState(false);

  const timeframes: TimeframeAnalysis[] = [
    {
      timeframe: 'M15',
      trend: 'bullish',
      indicators: [
        { name: 'RSI', value: 65.5, signal: 'buy', strength: 0.7 },
        { name: 'MACD', value: 0.0023, signal: 'buy', strength: 0.8 },
        { name: 'MA Cross', value: 1.1234, signal: 'buy', strength: 0.9 }
      ],
      support: 1.0920,
      resistance: 1.0950
    },
    {
      timeframe: 'H1',
      trend: 'neutral',
      indicators: [
        { name: 'RSI', value: 52.3, signal: 'neutral', strength: 0.5 },
        { name: 'MACD', value: -0.0012, signal: 'sell', strength: 0.6 },
        { name: 'MA Cross', value: 1.1230, signal: 'buy', strength: 0.4 }
      ],
      support: 1.0900,
      resistance: 1.0960
    },
    {
      timeframe: 'H4',
      trend: 'bearish',
      indicators: [
        { name: 'RSI', value: 42.1, signal: 'sell', strength: 0.6 },
        { name: 'MACD', value: -0.0045, signal: 'sell', strength: 0.7 },
        { name: 'MA Cross', value: 1.1220, signal: 'sell', strength: 0.8 }
      ],
      support: 1.0880,
      resistance: 1.0980
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-500';
      case 'sell':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStrengthBar = (strength: number) => {
    const width = strength * 100;
    const color = strength > 0.7 ? 'bg-green-500' : strength > 0.4 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-slate-700 h-1.5 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }}></div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Multi-Timeframe Analysis</h2>
        <div className="flex items-center gap-4">
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="bg-slate-700 text-slate-200 rounded px-3 py-1.5"
          >
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
            <option value="USD/CHF">USD/CHF</option>
          </select>
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-6">
        {timeframes.map((tf) => (
          <div key={tf.timeframe} className="border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{tf.timeframe}</span>
                {getTrendIcon(tf.trend)}
              </div>
              <div className="text-sm">
                <span className="text-slate-400">S/R: </span>
                <span className="text-red-400">{tf.resistance}</span>
                <span className="text-slate-400"> / </span>
                <span className="text-green-400">{tf.support}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tf.indicators.map((indicator) => (
                <div key={indicator.name} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{indicator.name}</span>
                    <span className={getSignalColor(indicator.signal)}>
                      {indicator.value.toFixed(4)}
                    </span>
                  </div>
                  {getStrengthBar(indicator.strength)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400 mb-1">Analysis Summary</h4>
            <p className="text-sm text-slate-300">
              Mixed signals across timeframes suggest cautious trading. H4 shows bearish pressure while M15 indicates potential short-term bullish momentum. Consider waiting for confirmation or trading smaller positions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};