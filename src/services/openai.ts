import OpenAI from 'openai';
import { useSettingsStore } from '../store/settings';
import { getCachedAnalysis, setCachedAnalysis } from './cache';

export const getOpenAIAnalysis = async (
  prompt: string,
  marketData: any
) => {
  const { apiKey, model, language } = useSettingsStore.getState();
  
  if (!apiKey) throw new Error('OpenAI API key not configured');

  // Generate cache key from prompt and data
  const cacheKey = JSON.stringify({ prompt, marketData, model, language });
  
  // Check cache first
  const cached = await getCachedAnalysis(cacheKey);
  if (cached) return cached;

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const summarizedData = marketData.slice(-10).map(({ time, open, high, low, close }) => ({
    time, open, high, low, close
  }));

  const systemPrompt = `You are an expert financial analyst. Analyze the provided market data and user query. Focus on:
- Technical Analysis (key trends, patterns)
- Risk Assessment
- Entry/Exit Points
- Market Sentiment
Provide concise, actionable insights.
IMPORTANT: Respond in ${language} language.`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${prompt}\n\nRecent market data: ${JSON.stringify(summarizedData)}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = response.choices[0].message.content;
    
    // Cache the result
    await setCachedAnalysis(cacheKey, analysis);
    
    return analysis;
  } catch (error: any) {
    if (error.error?.code === 'context_length_exceeded') {
      throw new Error('Analysis request too long. Please try a shorter prompt or reduce market data.');
    }
    throw new Error(error.message || 'Failed to get analysis');
  }
};