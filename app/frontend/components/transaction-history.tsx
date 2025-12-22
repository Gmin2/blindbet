'use client';

import { useTransactionHistory, Transaction } from '@/hooks/useTransactionHistory';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, TrendingUp, Trophy, DollarSign, Loader2, ExternalLink } from 'lucide-react';
import { CHAIN_CONFIG } from '@/lib/contracts';

export function TransactionHistory() {
  const { transactions, loading, error } = useTransactionHistory();

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_PLACED':
        return <TrendingUp className="h-5 w-5" />;
      case 'MARKET_CREATED':
        return <DollarSign className="h-5 w-5" />;
      case 'WINNINGS_CLAIMED':
        return <Trophy className="h-5 w-5" />;
      case 'TOKEN_MINT':
        return <ArrowUpRight className="h-5 w-5" />;
      default:
        return <ArrowUpRight className="h-5 w-5" />;
    }
  };

  // Get label for transaction type
  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_PLACED':
        return 'Bet Placed';
      case 'MARKET_CREATED':
        return 'Market Created';
      case 'WINNINGS_CLAIMED':
        return 'Winnings Claimed';
      case 'TOKEN_MINT':
        return 'Tokens Minted';
      default:
        return 'Transaction';
    }
  };

  // Get color for transaction type
  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'BET_PLACED':
        return 'from-blue-500/10 to-blue-600/5 border-blue-500/20';
      case 'MARKET_CREATED':
        return 'from-purple-500/10 to-purple-600/5 border-purple-500/20';
      case 'WINNINGS_CLAIMED':
        return 'from-green-500/10 to-green-600/5 border-green-500/20';
      case 'TOKEN_MINT':
        return 'from-orange-500/10 to-orange-600/5 border-orange-500/20';
      default:
        return 'from-gray-500/10 to-gray-600/5 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50 rounded-none">
        <CardContent className="p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading transaction history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/50 rounded-none">
        <CardContent className="p-12 text-center">
          <p className="text-red-500 font-medium mb-2">Failed to load transactions</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border/50 rounded-none">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-2">No transactions yet</p>
          <p className="text-sm text-muted-foreground">Place your first bet to see it here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
        <Badge variant="secondary" className="rounded-none">
          {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
        </Badge>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <Card
            key={tx.id}
            className={cn(
              'border-border/50 rounded-none bg-gradient-to-br backdrop-blur-sm transition-all duration-200 hover:shadow-md',
              getTransactionColor(tx.type)
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left side: Icon and details */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    'p-2 border rounded-none mt-1',
                    tx.type === 'BET_PLACED' && 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
                    tx.type === 'MARKET_CREATED' && 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
                    tx.type === 'WINNINGS_CLAIMED' && 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
                    tx.type === 'TOKEN_MINT' && 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
                  )}>
                    {getTransactionIcon(tx.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {getTransactionLabel(tx.type)}
                      </h3>
                      <Badge
                        variant={tx.status === 'success' ? 'default' : 'secondary'}
                        className="rounded-none text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>

                    {tx.marketQuestion && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {tx.marketQuestion}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(tx.timestamp)}</span>
                      {tx.amount && (
                        <span className="font-medium">Amount: {tx.amount}</span>
                      )}
                      <a
                        href={`${CHAIN_CONFIG.blockExplorer}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        View on Explorer
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right side: Market ID badge */}
                {tx.marketId !== undefined && (
                  <Badge variant="outline" className="rounded-none font-mono shrink-0">
                    #{tx.marketId}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
