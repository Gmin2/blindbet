'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Eip1193Provider } from 'ethers';
import { CHAIN_CONFIG } from '@/lib/contracts';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string | null;
  ensName: string | null;
  avatar: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  formatAddress: (address: string | null) => string;
  isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    provider: null,
    signer: null,
    chainId: null,
    balance: null,
    ensName: null,
    avatar: null,
  });

  // Generate avatar URL from address
  const getAvatarUrl = useCallback((address: string): string => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
  }, []);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.ethereum);
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.'
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ethereum = window.ethereum as Eip1193Provider;
      const provider = new BrowserProvider(ethereum);

      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Get signer
      const signer = await provider.getSigner();

      // Get network info
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Check if on correct network
      if (chainId !== CHAIN_CONFIG.chainId) {
        // Try to switch to Sepolia
        try {
          await provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}` }
          ]);
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await provider.send('wallet_addEthereumChain', [
                {
                  chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}`,
                  chainName: CHAIN_CONFIG.chainName,
                  nativeCurrency: CHAIN_CONFIG.nativeCurrency,
                  rpcUrls: [CHAIN_CONFIG.rpcUrl],
                  blockExplorerUrls: [CHAIN_CONFIG.blockExplorer],
                },
              ]);
            } catch (addError) {
              throw new Error('Failed to add Sepolia network to MetaMask');
            }
          } else {
            throw switchError;
          }
        }
      }

      // Get balance
      const balanceBigInt = await provider.getBalance(address);
      const balance = ethers.formatEther(balanceBigInt);

      // Try to get ENS name (won't work on Sepolia, but good to have)
      let ensName: string | null = null;
      try {
        ensName = await provider.lookupAddress(address);
      } catch {
        // ENS not available on this network
      }

      // Generate avatar URL
      const avatar = getAvatarUrl(address);

      setState({
        address,
        isConnected: true,
        isConnecting: false,
        error: null,
        provider,
        signer,
        chainId,
        balance,
        ensName,
        avatar,
      });

      // Save connection state to localStorage
      localStorage.setItem('walletConnected', 'true');
      console.log('[WalletContext] Wallet connected:', address);
    } catch (error: any) {
      console.error('[WalletContext] Error connecting wallet:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, [isMetaMaskInstalled, getAvatarUrl]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: null,
      ensName: null,
      avatar: null,
    });
    localStorage.removeItem('walletConnected');
    console.log('[WalletContext] Wallet disconnected');
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    // Type assertion for ethereum with event emitter methods
    const ethereum = window.ethereum as Eip1193Provider & {
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('[WalletContext] Accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnect();
      } else if (accounts[0] !== state.address) {
        // User switched accounts - reconnect
        connect();
      }
    };

    const handleChainChanged = () => {
      console.log('[WalletContext] Chain changed, reloading...');
      // Reload the page when chain changes
      window.location.reload();
    };

    ethereum.on?.('accountsChanged', handleAccountsChanged);
    ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [state.address, connect, disconnect]);

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    console.log('[WalletContext] Checking auto-connect:', { wasConnected, isMetaMaskInstalled: isMetaMaskInstalled(), isConnected: state.isConnected });

    if (wasConnected === 'true' && isMetaMaskInstalled() && !state.isConnected && !state.isConnecting) {
      console.log('[WalletContext] Auto-connecting...');
      connect();
    }
  }, []); // Only run once on mount

  // Format address for display (0x1234...5678)
  const formatAddress = useCallback((address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const value: WalletContextType = {
    ...state,
    connect,
    disconnect,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
