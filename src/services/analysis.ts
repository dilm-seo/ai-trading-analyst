import { useSettingsStore } from '../store/settings';
import { getOpenAIAnalysis } from './openai';

interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
}

export const analyzeFundamentals = async (news: NewsItem[]) => {
  const prompt = ' IMPORTANT: Respond in ${language} language.`;
  Analyze these latest forex news items and identify potential trading opportunities. For each significant opportunity, provide:
- Currency pair affected
- Sentiment (bullish/bearish/neutral)
- Confidence level (0-100)
- Suggested timeframe
- Entry price or range
- Target price
- Stop loss level
- Brief rationale
- Impact level (high/medium/low)
- Related news headlines

Format the response as a JSON array of opportunities. Example format:
[{
  "pair": "EUR/USD",
  "sentiment": "bullish",
  "confidence": 85,
  "timeframe": "4h",
  "entry": {
    "price": 1.0850,
    "range": "1.0840-1.0860"
  },
  "target": 1.0920,
  "stopLoss": 1.0810,
  "rationale": "Strong economic data from Eurozone combined with weakening USD",
  "impactLevel": "high",
  "relatedNews": ["ECB hints at rate stability", "US jobless claims higher than expected"]
}]

News to analyze:
${news.map(item => `
Title: ${item.title}
Date: ${item.pubDate}
Description: ${item.description}
`).join('\n---\n')}`;

  try {
    const response = await getOpenAIAnalysis(prompt, []);
    return JSON.parse(response || '[]');
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze fundamentals');
  }
};
