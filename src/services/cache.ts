import { get, set } from 'idb-keyval';

const CACHE_PREFIX = 'analysis-cache-';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface CacheEntry {
  data: string;
  timestamp: number;
}

export const getCachedAnalysis = async (key: string): Promise<string | null> => {
  const cacheKey = CACHE_PREFIX + key;
  const cached = await get<CacheEntry>(cacheKey);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY;
  if (isExpired) return null;

  return cached.data;
};

export const setCachedAnalysis = async (key: string, data: string): Promise<void> => {
  const cacheKey = CACHE_PREFIX + key;
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  await set(cacheKey, entry);
};