'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';

export interface UserPosition {
  marketId: number;
  marketAddress: string;
  question: string;
  position: 'YES' | 'NO' | 'BOTH';
  yesAmount: string;
  noAmount: string;
  totalInvested: string;
  status: 'Open' | 'Locked' | 'Resolved';
  image: string;
  category: string;
  canClaim: boolean;
}

export function useUserPositions() {
  const { address, isConnected } = useWallet();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!address || !isConnected) {
      setPositions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useUserPositions] Fetching from API for address:', address);

      // Call backend API instead of blockchain directly
      const response = await fetch(`/api/positions?address=${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch positions');
      }

      const apiPositions = data.positions || [];

      console.log('[useUserPositions] ✅ Loaded', apiPositions.length, 'positions');
      if (data.cached) {
        console.log('[useUserPositions] Using cached data (age:', data.cacheAge || 0, 'seconds)');
      }

      setPositions(apiPositions);
    } catch (err: any) {
      console.error('[useUserPositions] ❌ Error:', err);
      setError(err.message || 'Failed to fetch positions');
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && address) {
      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [isConnected, address, fetchPositions]);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
  };
}
