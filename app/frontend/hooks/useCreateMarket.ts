'use client';

import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS } from '@/lib/contracts';

interface MarketParams {
  question: string;
  bettingDuration: string; // In seconds as string
  resolutionDelay: string; // In seconds as string
  resolver: string; // Ethereum address
  image: string;
  category: string;
}

interface CreateMarketResult {
  marketAddress: string;
  marketId: number;
  transactionHash: string;
}

interface UseCreateMarketReturn {
  createMarket: (params: MarketParams) => Promise<CreateMarketResult>;
  loading: boolean;
  error: string | null;
}

export function useCreateMarket(): UseCreateMarketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMarket = async (params: MarketParams): Promise<CreateMarketResult> => {
    setLoading(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to create markets');
      }

      // Get provider and signer
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected');
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate resolver address
      if (!ethers.isAddress(params.resolver)) {
        throw new Error('Invalid resolver address');
      }

      // Create factory contract instance
      const factoryContract = new Contract(
        CONTRACT_ADDRESSES.factory,
        ABIS.factory,
        signer
      );

      // Prepare market params tuple
      const marketParams = {
        question: params.question,
        bettingDuration: params.bettingDuration,
        resolutionDelay: params.resolutionDelay,
        resolver: params.resolver,
        image: params.image,
        category: params.category,
      };

      console.log('Creating market with params:', marketParams);

      // Call deployMarket function
      const tx = await factoryContract.deployMarket(marketParams);
      console.log('Transaction sent:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Parse MarketDeployed event to get market address and ID
      const marketDeployedEvent = receipt.logs
        .map((log: any) => {
          try {
            return factoryContract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((event: any) => event && event.name === 'MarketDeployed');

      if (!marketDeployedEvent) {
        throw new Error('MarketDeployed event not found in transaction receipt');
      }

      const marketAddress = marketDeployedEvent.args.marketAddress;
      const marketId = Number(marketDeployedEvent.args.marketId);

      setLoading(false);

      // Invalidate markets cache to show new market immediately
      try {
        await fetch('/api/markets?refresh=true');
        console.log('Markets cache invalidated');
      } catch (err) {
        console.warn('Failed to invalidate markets cache:', err);
      }

      return {
        marketAddress,
        marketId,
        transactionHash: receipt.hash,
      };
    } catch (err: any) {
      console.error('Error creating market:', err);

      // Parse error message for better user feedback
      let errorMessage = 'Failed to create market';

      if (err.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected';
      } else if (err.message.includes('InvalidQuestion')) {
        errorMessage = 'Invalid question: must be between 10-500 characters';
      } else if (err.message.includes('InvalidDuration')) {
        errorMessage = 'Invalid duration: check betting duration and resolution delay';
      } else if (err.message.includes('InvalidResolver')) {
        errorMessage = 'Invalid resolver address';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    createMarket,
    loading,
    error,
  };
}
