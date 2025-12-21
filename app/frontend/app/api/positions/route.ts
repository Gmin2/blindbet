import { NextResponse } from 'next/server';
import { ethers, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS, CHAIN_CONFIG } from '@/lib/contracts';

// Cache for positions per address
const positionsCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (increased to reduce RPC calls)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      );
    }

    const now = Date.now();
    const cacheKey = address.toLowerCase();

    // Check cache
    const cached = positionsCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`[API] Returning cached positions for ${address} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`);
      return NextResponse.json({
        positions: cached.data,
        cached: true,
        cacheAge: Math.round((now - cached.timestamp) / 1000),
      });
    }

    console.log(`[API] Fetching positions for ${address} from blockchain...`);

    // OPTIMIZATION: First check transactions to know which markets user has activity in
    // This avoids querying every single market
    let marketsWithActivity = new Set<number>();

    try {
      console.log(`[API] Checking transaction history to find markets with activity...`);
      const txResponse = await fetch(
        `${request.url.split('/api')[0]}/api/transactions?address=${address}`,
        { cache: 'no-store' }
      );
      const txData = await txResponse.json();
      const transactions = txData.transactions || [];

      // Extract market IDs from BetPlaced transactions
      transactions.forEach((tx: any) => {
        if (tx.type === 'BET_PLACED' && tx.marketId !== undefined) {
          marketsWithActivity.add(Number(tx.marketId));
        }
      });

      console.log(`[API] Found activity in markets: ${Array.from(marketsWithActivity).join(', ')}`);
    } catch (err) {
      console.warn(`[API] Could not pre-filter markets from transactions:`, err);
      // Continue anyway - we'll check all markets
    }

    // Get all markets from the markets cache/API
    const marketsResponse = await fetch(
      `${request.url.split('/api')[0]}/api/markets`,
      { cache: 'no-store' }
    );
    const marketsData = await marketsResponse.json();
    const markets = marketsData.markets || [];

    // If markets data is empty due to rate limiting, return what we can
    if (markets.length === 0 && marketsWithActivity.size > 0) {
      console.warn(`[API] ⚠️  Markets data unavailable (likely rate limited), but we know user has activity in ${marketsWithActivity.size} markets`);
      console.warn(`[API] Markets with activity: ${Array.from(marketsWithActivity).join(', ')}`);
      console.warn(`[API] Returning minimal position data based on transaction history only`);

      // Create minimal position entries based on transaction data only
      const minimalPositions: any[] = [];
      for (const marketId of marketsWithActivity) {
        minimalPositions.push({
          marketId: marketId,
          marketAddress: 'Unknown',
          question: `Market #${marketId}`,
          position: 'BOTH',
          yesAmount: '???',
          noAmount: '???',
          totalInvested: '???',
          status: 'Unknown',
          image: '',
          category: 'Unknown',
          canClaim: false,
          betCount: 1, // We know they have at least 1 bet
        });
      }

      // Cache the minimal data
      positionsCache.set(cacheKey, { data: minimalPositions, timestamp: now });

      return NextResponse.json({
        positions: minimalPositions,
        cached: false,
        timestamp: now,
        warning: 'Markets data unavailable - showing minimal position info. Please refresh in a few moments.',
      });
    }

    // Filter to only markets with known activity (if we found any)
    const marketsToCheck = marketsWithActivity.size > 0
      ? markets.filter((m: any) => marketsWithActivity.has(Number(m.id)))
      : markets;

    console.log(`[API] Checking ${marketsToCheck.length} out of ${markets.length} markets for positions`);

    const provider = new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);
    const userPositions: any[] = [];

    // Get current block once, outside loop
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 100000); // Last ~100k blocks
    console.log(`[API] Querying events from block ${fromBlock} to ${currentBlock} (range: ${currentBlock - fromBlock} blocks)`);

    // Add delay between requests to avoid rate limiting
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // For each market with activity, check positions
    for (let i = 0; i < marketsToCheck.length; i++) {
      const market = marketsToCheck[i];
      const marketIdNum = Number(market.id);

      console.log(`[API] Checking market ${marketIdNum} (${market.address}) for user ${address}`);

      try {
        const marketContract = new Contract(market.address, ABIS.market, provider);

        // Check for BetPlaced events from this user
        const betPlacedFilter = marketContract.filters.BetPlaced(marketIdNum, address);

        console.log(`[API] Querying BetPlaced events for market ${marketIdNum}...`);
        const betPlacedEvents = await marketContract.queryFilter(
          betPlacedFilter,
          fromBlock,
          'latest'
        );

        console.log(`[API] Market ${marketIdNum}: Found ${betPlacedEvents.length} BetPlaced events`);

        // If user has placed bets in this market
        if (betPlacedEvents.length > 0) {
          console.log(`[API] ✅ Adding position for market ${marketIdNum}`);
          userPositions.push({
            marketId: marketIdNum,
            marketAddress: market.address,
            question: market.question,
            position: 'BOTH', // Can't tell without decryption
            yesAmount: '???', // Encrypted
            noAmount: '???', // Encrypted
            totalInvested: '???', // Encrypted
            status: market.state === 0 ? 'Open' : market.state === 1 ? 'Locked' : 'Resolved',
            image: market.image,
            category: market.category,
            canClaim: market.state === 3, // Resolved state
            betCount: betPlacedEvents.length,
          });
        } else {
          console.log(`[API] ❌ No BetPlaced events found for market ${marketIdNum}`);
        }

        // Add delay between markets to avoid rate limiting
        if (i < marketsToCheck.length - 1) {
          await delay(300); // Increased to 300ms for better rate limit handling
        }
      } catch (err: any) {
        console.error(`[API] ❌ Error checking position for market ${marketIdNum}:`, err.message || err);

        // If rate limited, stop checking more markets and return what we have
        if (err.code === -32005 || err.code === 'BAD_DATA') {
          console.warn(`[API] ⚠️  Rate limited at market ${marketIdNum}, stopping further checks`);
          break;
        }
      }
    }

    // Update cache
    positionsCache.set(cacheKey, { data: userPositions, timestamp: now });

    console.log(`[API] ✅ Fetched ${userPositions.length} positions for ${address}`);

    return NextResponse.json({
      positions: userPositions,
      cached: false,
      timestamp: now,
    });
  } catch (error: any) {
    console.error('[API] Error fetching positions:', error);

    // Check for rate limit error
    const isRateLimitError = error.message?.includes('Too Many Requests') ||
                             error.code === -32005 ||
                             error.code === 'BAD_DATA';

    // Try to return cached data even if stale
    const address = new URL(request.url).searchParams.get('address');
    if (address && isRateLimitError) {
      const cached = positionsCache.get(address.toLowerCase());
      if (cached) {
        console.warn(`[API] Rate limited, returning stale cache for ${address}`);
        return NextResponse.json({
          positions: cached.data,
          cached: true,
          stale: true,
          error: 'Rate limited - using cached data',
        });
      }
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch positions',
        positions: [],
      },
      { status: isRateLimitError ? 429 : 500 }
    );
  }
}
