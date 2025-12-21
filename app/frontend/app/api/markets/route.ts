import { NextResponse } from 'next/server';
import { ethers, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS, CHAIN_CONFIG } from '@/lib/contracts';
import { MarketState } from '@/types/market';

// Server-side cache (persists during server lifetime)
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (increased to match other APIs)

interface MarketData {
  id: string;
  address: string;
  question: string;
  state: number;
  createdAt: string;
  bettingDeadline: string;
  resolutionTime: string;
  creator: string;
  resolver: string;
  resolvedOutcome: number;
  image: string;
  category: string;
  totalVolume: string;
  timeRemaining: number;
  isActive: boolean;
  canLock: boolean;
  canResolve: boolean;
}

async function fetchMarketsFromBlockchain(): Promise<MarketData[]> {
  console.log('[API] Fetching markets from blockchain...');

  // Create provider
  const provider = new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);

  // Create factory contract instance
  const factoryContract = new Contract(
    CONTRACT_ADDRESSES.factory,
    ABIS.factory,
    provider
  );

  // Get total market count
  const marketCount = await factoryContract.marketCount();
  const count = Number(marketCount);

  if (count === 0) {
    return [];
  }

  // Add delay helper
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch markets sequentially with delays to avoid rate limiting
  const validMarkets: MarketData[] = [];

  for (let i = 0; i < count; i++) {
    const market = await fetchSingleMarket(provider, factoryContract, i);
    if (market) {
      validMarkets.push(market);
    }

    // Add delay between requests (except for last one)
    if (i < count - 1) {
      await delay(200);
    }
  }

  console.log('[API] ✅ Fetched', validMarkets.length, 'markets');

  return validMarkets;
}

async function fetchSingleMarket(
  provider: ethers.JsonRpcProvider,
  factoryContract: Contract,
  marketId: number
): Promise<MarketData | null> {
  try {
    // Get market address from factory
    const marketAddress = await factoryContract.markets(marketId);

    if (marketAddress === ethers.ZeroAddress) {
      return null;
    }

    // Create market contract instance
    const marketContract = new Contract(marketAddress, ABIS.market, provider);

    // Fetch market data
    const marketData = await marketContract.getMarket(0);

    // Calculate time remaining
    const now = Math.floor(Date.now() / 1000);
    const bettingDeadline = Number(marketData.bettingDeadline);
    const timeRemaining = Math.max(0, bettingDeadline - now);

    // Determine if market is active
    const isActive = marketData.state === MarketState.Open && timeRemaining > 0;
    const canLock = marketData.state === MarketState.Open && timeRemaining === 0;
    const resolutionTime = Number(marketData.resolutionTime);
    const canResolve = marketData.state === MarketState.Locked && now >= resolutionTime;

    // Convert BigInt to string before returning
    return {
      id: marketId.toString(),
      address: marketAddress,
      question: marketData.question,
      state: Number(marketData.state),
      createdAt: marketData.createdAt.toString(),
      bettingDeadline: marketData.bettingDeadline.toString(),
      resolutionTime: marketData.resolutionTime.toString(),
      creator: marketData.creator,
      resolver: marketData.resolver,
      resolvedOutcome: Number(marketData.resolvedOutcome),
      image: marketData.image,
      category: marketData.category,
      totalVolume: '0', // Encrypted
      timeRemaining,
      isActive,
      canLock,
      canResolve,
    };
  } catch (err) {
    console.error(`[API] Error fetching market ${marketId}:`, err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const now = Date.now();
    const cacheAge = now - lastFetchTime;

    // Return cached data if less than 5 minutes old
    if (cachedData && cacheAge < CACHE_DURATION) {
      console.log('[API] Returning cached data (age:', Math.round(cacheAge / 1000), 'seconds)');
      return NextResponse.json({
        markets: cachedData,
        cached: true,
        cacheAge: Math.round(cacheAge / 1000),
      });
    }

    // Fetch fresh data
    console.log('[API] Cache miss or stale, fetching fresh data...');
    const markets = await fetchMarketsFromBlockchain();

    // Update cache
    cachedData = markets;
    lastFetchTime = now;

    return NextResponse.json({
      markets,
      cached: false,
      timestamp: now,
    });
  } catch (error: any) {
    console.error('[API] Error in markets route:', error);

    // Check for rate limit error
    const isRateLimitError = error.message?.includes('Too Many Requests') ||
                             error.code === -32005 ||
                             error.code === 'BAD_DATA';

    // Return cached data if available, even if stale
    if (isRateLimitError && cachedData) {
      console.warn('[API] Rate limited, returning stale cache');
      return NextResponse.json({
        markets: cachedData,
        cached: true,
        stale: true,
        error: 'Rate limited - using cached data',
      });
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch markets',
        markets: cachedData || [],
      },
      { status: isRateLimitError ? 429 : 500 }
    );
  }
}
