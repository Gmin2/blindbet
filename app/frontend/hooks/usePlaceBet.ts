'use client';

import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import { CONTRACT_ADDRESSES, ABIS } from '@/lib/contracts';
import { useFhevm } from './useFhevm';

export type BetStep =
  | 'idle'
  | 'encrypting'
  | 'approving'
  | 'placing'
  | 'confirming'
  | 'complete'
  | 'error';

interface PlaceBetParams {
  marketId: number;
  marketAddress: string;
  amount: string; // Amount in cUSDC
  outcome: boolean; // true = Yes, false = No
}

interface PlaceBetResult {
  transactionHash: string;
  success: boolean;
}

interface UsePlaceBetReturn {
  placeBet: (params: PlaceBetParams) => Promise<PlaceBetResult>;
  loading: boolean;
  error: string | null;
  currentStep: BetStep;
}

export function usePlaceBet(): UsePlaceBetReturn {
  const { instance: fhevmInstance, initialized, initialize } = useFhevm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<BetStep>('idle');

  const placeBet = async (params: PlaceBetParams): Promise<PlaceBetResult> => {
    console.log('[usePlaceBet] Place bet called:', params);
    setLoading(true);
    setError(null);
    setCurrentStep('encrypting');

    try {
      // Initialize FHEVM if not already initialized and get the instance
      let instance = fhevmInstance;
      if (!initialized || !instance) {
        console.log('[usePlaceBet] FHEVM not initialized, initializing now...');
        instance = await initialize();
        console.log('[usePlaceBet] FHEVM initialized');
      } else {
        console.log('[usePlaceBet] FHEVM already initialized');
      }

      // Verify we have a valid instance
      if (!instance) {
        throw new Error('Failed to initialize FHEVM instance');
      }

      // Check if MetaMask is installed
      console.log('[usePlaceBet] Checking for MetaMask...');
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
      }
      console.log('[usePlaceBet] MetaMask detected');

      // Get provider and signer
      console.log('[usePlaceBet] Getting provider and signer...');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('[usePlaceBet] User address:', userAddress);

      // Create contract instances
      console.log('[usePlaceBet] Creating contract instances...');
      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.token,
        ABIS.token,
        signer
      );

      const marketContract = new Contract(
        params.marketAddress,
        ABIS.market,
        signer
      );
      console.log('[usePlaceBet] Contracts created:', {
        token: CONTRACT_ADDRESSES.token,
        market: params.marketAddress,
      });

      // Convert amount to smallest unit (6 decimals for cUSDC)
      const amountInSmallestUnit = ethers.parseUnits(params.amount, 6);
      console.log('[usePlaceBet] Amount in smallest unit:', amountInSmallestUnit.toString());

      // Step 1: Create encrypted input for bet
      console.log('[usePlaceBet] Creating encrypted input for bet...');
      const input = instance.createEncryptedInput(
        params.marketAddress,
        userAddress
      );
      console.log('[usePlaceBet] Input instance created, adding values...');

      input.add64(Number(amountInSmallestUnit));
      console.log('[usePlaceBet] Added amount (64-bit)');

      input.addBool(params.outcome);
      console.log('[usePlaceBet] Added outcome (bool):', params.outcome);

      console.log('[usePlaceBet] Encrypting bet input...');
      const encryptedInput = await input.encrypt();
      console.log('[usePlaceBet] ✅ Bet input encrypted!', {
        handlesLength: encryptedInput.handles?.length,
        hasInputProof: !!encryptedInput.inputProof,
      });

      // Create encrypted input for approval
      console.log('[usePlaceBet] Creating encrypted input for approval...');
      const approvalInput = instance.createEncryptedInput(
        CONTRACT_ADDRESSES.token,
        userAddress
      );
      approvalInput.add64(Number(amountInSmallestUnit));
      console.log('[usePlaceBet] Encrypting approval input...');
      const approvalEncrypted = await approvalInput.encrypt();
      console.log('[usePlaceBet] ✅ Approval input encrypted!');

      // Step 2: Approve tokens
      setCurrentStep('approving');
      console.log('[usePlaceBet] Sending approval transaction...');
      const approveTx = await tokenContract.approve(
        params.marketAddress,
        approvalEncrypted.handles[0],
        approvalEncrypted.inputProof
      );
      console.log('[usePlaceBet] Approval tx sent:', approveTx.hash);
      console.log('[usePlaceBet] Waiting for approval confirmation...');

      await approveTx.wait();
      console.log('[usePlaceBet] ✅ Approval confirmed!');

      // Step 3: Place bet
      setCurrentStep('placing');
      console.log('[usePlaceBet] Sending bet transaction...');
      const betTx = await marketContract.placeBet(
        0, // Market uses internal ID 0
        encryptedInput.handles[0], // Encrypted amount
        encryptedInput.handles[1], // Encrypted outcome
        encryptedInput.inputProof
      );
      console.log('[usePlaceBet] Bet tx sent:', betTx.hash);

      // Step 4: Confirming
      setCurrentStep('confirming');
      console.log('[usePlaceBet] Waiting for bet confirmation...');

      const receipt = await betTx.wait();
      console.log('[usePlaceBet] ✅ Bet placed successfully!', receipt.hash);

      // Step 5: Complete
      setCurrentStep('complete');
      setLoading(false);

      return {
        transactionHash: receipt.hash,
        success: true,
      };
    } catch (err: any) {
      console.error('Error placing bet:', err);

      // Parse error message
      let errorMessage = 'Failed to place bet';

      if (err.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected';
      } else if (err.message.includes('BettingDeadlinePassed')) {
        errorMessage = 'Betting deadline has passed';
      } else if (err.message.includes('MarketNotOpen')) {
        errorMessage = 'Market is not open for betting';
      } else if (err.message.includes('InvalidAmount')) {
        errorMessage = 'Invalid bet amount';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setCurrentStep('error');
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    placeBet,
    loading,
    error,
    currentStep,
  };
}
