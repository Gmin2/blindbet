import { NextResponse } from 'next/server';
import { ethers, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS, CHAIN_CONFIG } from '@/lib/contracts';
import { MarketState } from '@/types/market';

// Cache for individual markets
const marketCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: marketId } = await params;
    const now = Date.now();

    // Check cache
    const cached = marketCache.get(marketId);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`[API] Returning cached market ${marketId} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`);
      return NextResponse.json({
        market: cached.data,
        cached: true,
      });
    }

    console.log(`[API] Fetching market ${marketId} from blockchain...`);

    // Create provider
    const provider = new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);

    // Create factory contract instance
    const factoryContract = new Contract(
      CONTRACT_ADDRESSES.factory,
      ABIS.factory,
      provider
    );

    // Get market address
    const marketAddress = await factoryContract.markets(marketId);

    if (marketAddress === ethers.ZeroAddress) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      );
    }

    // Create market contract instance
    const marketContract = new Contract(marketAddress, ABIS.market, provider);

    // Fetch market data
    const marketData = await marketContract.getMarket(0);

    // Calculate computed fields
    const currentTime = Math.floor(Date.now() / 1000);
    const bettingDeadline = Number(marketData.bettingDeadline);
    const timeRemaining = Math.max(0, bettingDeadline - currentTime);
    const isActive = marketData.state === MarketState.Open && timeRemaining > 0;
    const canLock = marketData.state === MarketState.Open && timeRemaining === 0;
    const resolutionTime = Number(marketData.resolutionTime);
    const canResolve = marketData.state === MarketState.Locked && currentTime >= resolutionTime;

    // Convert BigInt to string/number before returning
    const market = {
      id: marketId,
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

    // Update cache
    marketCache.set(marketId, { data: market, timestamp: now });

    console.log(`[API] ✅ Fetched market ${marketId}`);

    return NextResponse.json({
      market,
      cached: false,
    });
  } catch (error: any) {
    console.error('[API] Error fetching market:', error);

    // Get marketId from params again for error handling
    const { id: marketId } = await params;

    // Check for rate limit error
    const isRateLimitError = error.message?.includes('Too Many Requests') ||
                             error.code === -32005 ||
                             error.code === 'BAD_DATA';

    // Try to return cached data even if stale
    const cached = marketCache.get(marketId);
    if (isRateLimitError && cached) {
      console.warn(`[API] Rate limited, returning stale cache for market ${marketId}`);
      return NextResponse.json({
        market: cached.data,
        cached: true,
        stale: true,
        error: 'Rate limited - using cached data',
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch market' },
      { status: isRateLimitError ? 429 : 500 }
    );
  }
}
