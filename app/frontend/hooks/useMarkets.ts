'use client';

import { useState, useEffect, useCallback } from 'react';
import { Market } from '@/types/market';

interface UseMarketsReturn {
  markets: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache for markets with timestamp
const CACHE_KEY = 'blindbet_markets_cache';
const CACHE_DURATION = 60000; // 1 minute

interface CachedData {
  markets: any[];
  timestamp: number;
}

// Get cached data
function getCachedMarkets(): Market[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    // Return cached data if less than 1 minute old
    if (age < CACHE_DURATION) {
      console.log('[useMarkets] Using cached data (age:', Math.round(age / 1000), 'seconds)');
      return data.markets.map(m => ({
        ...m,
        id: BigInt(m.id),
        createdAt: BigInt(m.createdAt),
        bettingDeadline: BigInt(m.bettingDeadline),
        resolutionTime: BigInt(m.resolutionTime),
        totalVolume: BigInt(m.totalVolume || 0),
      }));
    }

    return null;
  } catch (err) {
    console.error('[useMarkets] Cache read error:', err);
    return null;
  }
}

// Set cache
function setCachedMarkets(markets: Market[]) {
  if (typeof window === 'undefined') return;

  try {
    const data: CachedData = {
      markets: markets.map(m => ({
        ...m,
        id: m.id.toString(),
        createdAt: m.createdAt.toString(),
        bettingDeadline: m.bettingDeadline.toString(),
        resolutionTime: m.resolutionTime.toString(),
        totalVolume: m.totalVolume.toString(),
      })),
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[useMarkets] Cache write error:', err);
  }
}

export function useMarkets(refreshInterval: number = 120000): UseMarketsReturn { // Increased to 2 minutes
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMarkets = useCallback(async () => {
    try {
      console.log('[useMarkets] Fetching from API...');
      setLoading(true);
      setError(null);

      // Call backend API instead of blockchain directly
      const response = await fetch('/api/markets');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch markets');
      }

      // Transform API response to Market objects
      const apiMarkets = data.markets || [];
      const validMarkets = apiMarkets.map((m: any) => ({
        ...m,
        id: BigInt(m.id),
        createdAt: BigInt(m.createdAt),
        bettingDeadline: BigInt(m.bettingDeadline),
        resolutionTime: BigInt(m.resolutionTime),
        totalVolume: BigInt(m.totalVolume || 0),
      })).sort((a: Market, b: Market) => Number(b.createdAt) - Number(a.createdAt));

      setMarkets(validMarkets);
      setCachedMarkets(validMarkets); // Still cache client-side for instant loads
      setRetryCount(0);
      setLoading(false);

      if (data.cached) {
        console.log('[useMarkets] ✅ Loaded from server cache (age:', data.cacheAge || 0, 'seconds)');
      } else {
        console.log('[useMarkets] ✅ Loaded fresh data,', validMarkets.length, 'markets');
      }
    } catch (err: any) {
      console.error('[useMarkets] Error fetching from API:', err);

      // Try to use client-side stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        console.warn('[useMarkets] Using stale client cache');
        const data = JSON.parse(staleCache);
        const cachedMarkets = data.markets.map((m: any) => ({
          ...m,
          id: BigInt(m.id),
          createdAt: BigInt(m.createdAt),
          bettingDeadline: BigInt(m.bettingDeadline),
          resolutionTime: BigInt(m.resolutionTime),
          totalVolume: BigInt(m.totalVolume || 0),
        }));
        setMarkets(cachedMarkets);
        setError('Using cached data (server unavailable)');
        setRetryCount(prev => prev + 1);
      } else {
        setError(err.message || 'Failed to fetch markets');
      }

      setLoading(false);
    }
  }, [retryCount]);

  // Initial fetch
  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Auto-refresh at interval with exponential backoff on errors
  useEffect(() => {
    if (refreshInterval > 0) {
      // Apply exponential backoff: base interval * 2^retryCount (max 5 minutes)
      const backoffInterval = Math.min(refreshInterval * Math.pow(2, retryCount), 300000);
      console.log('[useMarkets] Next refresh in', Math.round(backoffInterval / 1000), 'seconds');

      const interval = setInterval(fetchMarkets, backoffInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchMarkets, retryCount]);

  return {
    markets,
    loading,
    error,
    refetch: fetchMarkets,
  };
}

// Hook to fetch a single market by ID
export function useMarket(marketId: number | bigint) {
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarket = useCallback(async () => {
    console.log('[useMarket] fetchMarket called with ID:', marketId);

    // Don't fetch if marketId is invalid (null, undefined, NaN, or -1)
    if (marketId === null || marketId === undefined || (typeof marketId === 'number' && (isNaN(marketId) || marketId < 0))) {
      console.log('[useMarket] Invalid market ID, skipping fetch');
      setLoading(false);
      setError(null); // Don't set error for intentionally skipped fetches
      return;
    }

    try {
      console.log('[useMarket] Fetching from API for market:', marketId);
      setLoading(true);
      setError(null);

      // Call backend API instead of blockchain directly
      const response = await fetch(`/api/markets/${marketId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch market');
      }

      // Transform API response to Market object
      const m = data.market;
      const marketObj: Market = {
        id: BigInt(m.id),
        address: m.address,
        question: m.question,
        state: m.state,
        createdAt: BigInt(m.createdAt),
        bettingDeadline: BigInt(m.bettingDeadline),
        resolutionTime: BigInt(m.resolutionTime),
        creator: m.creator,
        resolver: m.resolver,
        resolvedOutcome: m.resolvedOutcome,
        image: m.image,
        category: m.category,
        totalVolume: BigInt(m.totalVolume || 0),
        timeRemaining: m.timeRemaining,
        isActive: m.isActive,
        canLock: m.canLock,
        canResolve: m.canResolve,
      };

      setMarket(marketObj);
      setLoading(false);

      if (data.cached) {
        console.log('[useMarket] ✅ Loaded from cache');
      } else {
        console.log('[useMarket] ✅ Loaded fresh data');
      }
    } catch (err: any) {
      console.error('[useMarket] ❌ Error fetching market:', err);
      setError(err.message || 'Failed to fetch market');
      setLoading(false);
    }
  }, [marketId]);

  useEffect(() => {
    console.log('[useMarket] useEffect triggered, calling fetchMarket');
    fetchMarket();
  }, [fetchMarket]);

  return {
    market,
    loading,
    error,
    refetch: fetchMarket,
  };
}
