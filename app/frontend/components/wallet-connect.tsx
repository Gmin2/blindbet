'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);

  const {
    address,
    isConnected,
    isConnecting,
    error,
    avatar,
    balance,
    ensName,
    chainId,
    connect,
    disconnect,
    formatAddress,
    isMetaMaskInstalled,
  } = useWallet();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing during SSR
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
      >
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  // If wallet not installed
  if (!isMetaMaskInstalled) {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Install MetaMask
        </a>
      </Button>
    );
  }

  // If not connected
  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // If connected - show wallet info dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {avatar && (
            <Image
              src={avatar}
              alt="Wallet avatar"
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="font-mono">{ensName || formatAddress(address)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          {avatar && (
            <Image
              src={avatar}
              alt="Wallet avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {ensName || 'Wallet'}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {formatAddress(address)}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Balance:</span>
            <span className="font-mono font-medium">
              {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '...'}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Network:</span>
            <span className="text-xs">
              {chainId === 11155111 ? (
                <span className="text-green-600">Sepolia ✓</span>
              ) : (
                <span className="text-yellow-600">Wrong Network</span>
              )}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/portfolio">
            View Portfolio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (address) {
              window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
            }
          }}
        >
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnect}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Error display component (optional)
export function WalletError() {
  const { error } = useWallet();

  if (!error) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    </div>
  );
}
