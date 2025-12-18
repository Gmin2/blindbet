/**
 * Smart Contract Configuration
 * ============================
 *
 * Deployed on Sepolia Testnet
 * Deployment Date: December 25, 2025
 */

import BlindBetFactoryABI from './abis/BlindBetFactory.json';
import BlindBetMarketABI from './abis/BlindBetMarket.json';
import ConfidentialUSDCABI from './abis/ConfidentialUSDC.json';

// Contract Addresses (Sepolia Testnet - FHEVM v0.9.1)
export const CONTRACT_ADDRESSES = {
  factory: '0xD3FcA2Bd814176e983667674ea1099d3b75c0bc7',
  token: '0x5e40269e28bDc9171dF1554027608665CeeB7d3e',
} as const;

// Test Market (First market created)
export const TEST_MARKET = {
  id: 0,
  address: '0x7917a9285EA2FF8D89415d22e50eE9F1fEc13ec2',
  question: 'Will Bitcoin reach $150,000 by end of 2025?',
  category: 'Cryptocurrency',
} as const;

// Contract ABIs
export const ABIS = {
  factory: BlindBetFactoryABI,
  market: BlindBetMarketABI,
  token: ConfidentialUSDCABI,
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
  chainId: 11155111, // Sepolia
  chainName: 'Sepolia Testnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

// Deployment Info
export const DEPLOYMENT_INFO = {
  network: 'sepolia',
  deployedAt: '2025-12-25T22:00:00Z',
  deployer: '0x7D26625133a2964d133dcdF228da319877557ec1',
  fhevmVersion: '0.9.1',
  blockNumbers: {
    token: 9912807,
    factory: 9912808,
    testMarket: 0, // To be created
  },
  transactionHashes: {
    token: '0xbb1158fa204eaff6dddbed2e75f6a8ef77ec8a076061c3f72ad994b2372542be',
    factory: '0xf7413f0ef10577e803ca37e40cfcd9984f34bba41b4139de845f476dd92dcc83',
    testMarket: '', // To be created
  },
} as const;

// Helper function to get block explorer URL
export function getExplorerUrl(type: 'address' | 'tx', value: string): string {
  return `${CHAIN_CONFIG.blockExplorer}/${type}/${value}`;
}

// Helper function to get contract explorer link
export function getContractExplorerUrl(contractType: 'factory' | 'token' | 'testMarket'): string {
  const address = contractType === 'factory'
    ? CONTRACT_ADDRESSES.factory
    : contractType === 'token'
    ? CONTRACT_ADDRESSES.token
    : TEST_MARKET.address;

  return getExplorerUrl('address', address);
}
