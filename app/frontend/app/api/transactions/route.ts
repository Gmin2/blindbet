import { NextResponse } from 'next/server';
import { ethers, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS, CHAIN_CONFIG } from '@/lib/contracts';

// Cache for transaction history per address
const transactionCache = new Map<string, { data: any[]; timestamp: number }>();
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
    const cached = transactionCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`[API] Returning cached transactions for ${address} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`);
      return NextResponse.json({
        transactions: cached.data,
        cached: true,
        cacheAge: Math.round((now - cached.timestamp) / 1000),
      });
    }

    console.log(`[API] Fetching transactions for ${address} from blockchain...`);

    const provider = new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);
    const factoryContract = new Contract(CONTRACT_ADDRESSES.factory, ABIS.factory, provider);

    // Get market count
    const marketCount = await factoryContract.marketCount();
    const count = Number(marketCount);

    const allTransactions: any[] = [];

    // Get current block for limiting range
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 100000); // Last ~100k blocks

    // Add delay between requests to avoid rate limiting
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Fetch events from each market
    for (let i = 0; i < count; i++) {
      try {
        const marketAddress = await factoryContract.markets(i);
        if (marketAddress === ethers.ZeroAddress) continue;

        const marketContract = new Contract(marketAddress, ABIS.market, provider);

        // Get market data for question
        let marketQuestion = `Market #${i}`;
        try {
          const marketData = await marketContract.getMarket(0);
          marketQuestion = marketData.question;
        } catch (err) {
          console.error(`Error fetching market ${i} data:`, err);
        }

        // Get BetPlaced events for this user
        try {
          const betPlacedFilter = marketContract.filters.BetPlaced(i, address);
          const betPlacedEvents = await marketContract.queryFilter(
            betPlacedFilter,
            fromBlock,
            'latest'
          );

          for (const event of betPlacedEvents) {
            const block = await event.getBlock();
            allTransactions.push({
              id: `${event.transactionHash}-${event.index}`,
              type: 'BET_PLACED',
              marketId: i,
              marketQuestion,
              amount: 'Encrypted',
              timestamp: block.timestamp,
              txHash: event.transactionHash,
              status: 'success',
              blockNumber: event.blockNumber,
            });
          }
        } catch (err: any) {
          console.error(`Error fetching BetPlaced events for market ${i}:`, err);

          // If rate limited, stop and return what we have
          if (err.code === -32005 || err.code === 'BAD_DATA') {
            console.warn(`[API] Rate limited at market ${i}, stopping transaction fetch`);
            break;
          }
        }

        // Get WinningsClaimed events for this user
        try {
          const claimedFilter = marketContract.filters.WinningsClaimed(i, address);
          const claimedEvents = await marketContract.queryFilter(
            claimedFilter,
            fromBlock,
            'latest'
          );

          for (const event of claimedEvents) {
            const block = await event.getBlock();
            allTransactions.push({
              id: `${event.transactionHash}-${event.index}`,
              type: 'WINNINGS_CLAIMED',
              marketId: i,
              marketQuestion,
              amount: 'Encrypted',
              timestamp: block.timestamp,
              txHash: event.transactionHash,
              status: 'success',
              blockNumber: event.blockNumber,
            });
          }
        } catch (err: any) {
          console.error(`Error fetching WinningsClaimed events for market ${i}:`, err);

          // If rate limited, stop
          if (err.code === -32005 || err.code === 'BAD_DATA') {
            console.warn(`[API] Rate limited, stopping transaction fetch`);
            break;
          }
        }

        // Add delay between markets
        if (i < count - 1) {
          await delay(200);
        }
      } catch (err: any) {
        console.error(`Error processing market ${i}:`, err);

        // If rate limited, stop
        if (err.code === -32005 || err.code === 'BAD_DATA') {
          console.warn(`[API] Rate limited, stopping transaction fetch`);
          break;
        }
      }
    }

    // Get MarketDeployed events where user is creator
    try {
      const marketDeployedFilter = factoryContract.filters.MarketDeployed();
      const marketDeployedEvents = await factoryContract.queryFilter(
        marketDeployedFilter,
        fromBlock,
        'latest'
      );

      console.log(`[API] Found ${marketDeployedEvents.length} total MarketDeployed events`);

      for (const event of marketDeployedEvents) {
        const block = await event.getBlock();
        const tx = await event.getTransaction();

        // Check if transaction was sent by this user
        if (tx.from.toLowerCase() === address.toLowerCase()) {
          allTransactions.push({
            id: `${event.transactionHash}-${event.index}`,
            type: 'MARKET_CREATED',
            marketId: Number(event.args?.[0] || 0),
            marketQuestion: String(event.args?.[2] || 'Unknown Market'), // Question is 3rd arg (index 2)
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            status: 'success',
            blockNumber: event.blockNumber,
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching MarketDeployed events:', err);
      // Don't fail the whole request if this fails
    }

    // Sort by timestamp (most recent first)
    allTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // Update cache
    transactionCache.set(cacheKey, { data: allTransactions, timestamp: now });

    console.log(`[API] ✅ Fetched ${allTransactions.length} transactions for ${address}`);

    return NextResponse.json({
      transactions: allTransactions,
      cached: false,
      timestamp: now,
    });
  } catch (error: any) {
    console.error('[API] Error fetching transactions:', error);

    // Check for rate limit error
    const isRateLimitError = error.message?.includes('Too Many Requests') ||
                             error.code === -32005 ||
                             error.code === 'BAD_DATA';

    // Try to return cached data even if stale
    const address = new URL(request.url).searchParams.get('address');
    if (address && isRateLimitError) {
      const cached = transactionCache.get(address.toLowerCase());
      if (cached) {
        console.warn(`[API] Rate limited, returning stale cache for ${address}`);
        return NextResponse.json({
          transactions: cached.data,
          cached: true,
          stale: true,
          error: 'Rate limited - using cached data',
        });
      }
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch transactions',
        transactions: [],
      },
      { status: isRateLimitError ? 429 : 500 }
    );
  }
}
