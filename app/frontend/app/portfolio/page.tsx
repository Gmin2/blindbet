'use client'

import { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/useWallet'
import { TransactionHistory } from '@/components/transaction-history'
import { useUserPositions } from '@/hooks/useUserPositions'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { Wallet, TrendingUp, History, Loader2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PortfolioPage() {
    const { address, avatar, formatAddress, isConnected, connect } = useWallet()
    const { positions, loading: positionsLoading } = useUserPositions()
    const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions')

    // Show connect wallet message if not connected
    if (!isConnected) {
        return (
            <main className="min-h-screen bg-background pt-24 pb-20">
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <Card className="border-border/50 rounded-none">
                        <CardContent className="p-12 flex flex-col items-center justify-center gap-6">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-full">
                                <Wallet className="h-12 w-12 text-primary" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
                                <p className="text-muted-foreground mb-6">
                                    Connect your wallet to view your portfolio and transaction history
                                </p>
                                <Button onClick={connect} size="lg" className="rounded-none">
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Connect Wallet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-12">
                {/* Header */}
                <div className="mb-8">
                    <Breadcrumb className="mb-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/portfolio">Portfolio</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-start gap-4">
                        {avatar ? (
                            <div className="h-16 w-16 border border-primary/20 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                                <Image
                                    src={avatar}
                                    alt="Wallet avatar"
                                    width={64}
                                    height={64}
                                />
                            </div>
                        ) : (
                            <div className="h-16 w-16 border border-primary/20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Wallet className="h-8 w-8 text-white" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                Your Portfolio
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">{formatAddress(address)}</span>
                                <a
                                    href={`https://sepolia.etherscan.io/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'positions' | 'history')} className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2 rounded-none bg-muted/50">
                        <TabsTrigger value="positions" className="rounded-none data-[state=active]:bg-background">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Positions
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-background">
                            <History className="h-4 w-4 mr-2" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Positions Tab */}
                    <TabsContent value="positions" className="space-y-4">
                        {positionsLoading ? (
                            <Card className="border-border/50 rounded-none">
                                <CardContent className="p-12 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Loading your positions...</p>
                                </CardContent>
                            </Card>
                        ) : positions.length === 0 ? (
                            <Card className="border-border/50 rounded-none">
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground mb-2">No active positions</p>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Start by placing your first bet on a prediction market
                                    </p>
                                    <Button asChild className="rounded-none">
                                        <Link href="/markets">Browse Markets</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-foreground">Your Positions</h2>
                                    <Badge variant="secondary" className="rounded-none">
                                        {positions.length} {positions.length === 1 ? 'Position' : 'Positions'}
                                    </Badge>
                                </div>

                                <div className="grid gap-4">
                                    {positions.map((position) => (
                                        <Card
                                            key={`${position.marketId}-${position.marketAddress}`}
                                            className="border-border/50 rounded-none hover:shadow-md transition-shadow"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    {/* Market Image */}
                                                    <div className="relative h-20 w-20 shrink-0 border border-border/50 overflow-hidden">
                                                        <Image
                                                            src={position.image}
                                                            alt={position.question}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                            <div className="flex-1">
                                                                <Link
                                                                    href={`/market/${position.marketId}`}
                                                                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                                                                >
                                                                    {position.question}
                                                                </Link>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Market #{position.marketId} • {position.category}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    'rounded-none shrink-0',
                                                                    position.status === 'Open' && 'border-blue-500/50 text-blue-600 bg-blue-500/10',
                                                                    position.status === 'Locked' && 'border-orange-500/50 text-orange-600 bg-orange-500/10',
                                                                    position.status === 'Resolved' && 'border-green-500/50 text-green-600 bg-green-500/10'
                                                                )}
                                                            >
                                                                {position.status}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border border-border/50">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Position</p>
                                                                <p className="text-sm font-medium text-foreground">
                                                                    {position.position === 'BOTH' ? 'Encrypted' : position.position}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Invested</p>
                                                                <p className="text-sm font-medium text-foreground font-mono">
                                                                    {position.totalInvested}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Actions</p>
                                                                {position.canClaim ? (
                                                                    <Button size="sm" variant="default" className="rounded-none h-7 text-xs">
                                                                        Claim Winnings
                                                                    </Button>
                                                                ) : (
                                                                    <Button size="sm" variant="outline" asChild className="rounded-none h-7 text-xs">
                                                                        <Link href={`/market/${position.marketId}`}>
                                                                            View Market
                                                                        </Link>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {position.totalInvested === '???' && (
                                                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                                                <span className="inline-block w-1 h-1 bg-primary rounded-full"></span>
                                                                Amounts are encrypted. Visit the market to decrypt your position.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Transaction History Tab */}
                    <TabsContent value="history">
                        <TransactionHistory />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
