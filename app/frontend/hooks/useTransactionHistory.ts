'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';

export interface Transaction {
  id: string;
  type: 'BET_PLACED' | 'MARKET_CREATED' | 'WINNINGS_CLAIMED' | 'TOKEN_MINT';
  marketId?: number;
  marketQuestion?: string;
  amount?: string;
  timestamp: number;
  txHash: string;
  status: 'success' | 'pending' | 'failed';
  blockNumber: number;
}

export function useTransactionHistory() {
  const { address, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionHistory = useCallback(async () => {
    if (!address || !isConnected) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useTransactionHistory] Fetching from API for address:', address);

      // Call backend API instead of blockchain directly
      const response = await fetch(`/api/transactions?address=${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      const apiTransactions = data.transactions || [];

      console.log('[useTransactionHistory] ✅ Loaded', apiTransactions.length, 'transactions');
      if (data.cached) {
        console.log('[useTransactionHistory] Using cached data (age:', data.cacheAge || 0, 'seconds)');
      }

      setTransactions(apiTransactions);
    } catch (err: any) {
      console.error('[useTransactionHistory] ❌ Error:', err);
      setError(err.message || 'Failed to fetch transaction history');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactionHistory();
    } else {
      setTransactions([]);
    }
  }, [isConnected, address, fetchTransactionHistory]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactionHistory,
  };
}
