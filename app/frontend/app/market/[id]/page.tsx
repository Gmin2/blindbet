'use client'

import React from 'react'
import { MarketHeader } from '@/components/market/market-header'
import { MarketChart } from '@/components/market/market-chart'
import { BettingInterface } from '@/components/market/betting-interface'
import { MarketStats } from '@/components/market/market-stats'
import { MyPosition } from '@/components/market/my-position'
import { useMarket } from '@/hooks/useMarkets'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function MarketPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    // Handle both sync and async params for Next.js compatibility
    const [marketId, setMarketId] = React.useState<number | null>(null)

    React.useEffect(() => {
        console.log('[MarketPage] Component mounted');
        async function getParams() {
            console.log('[MarketPage] Getting params...');
            const resolvedParams = await Promise.resolve(params)
            const id = parseInt(resolvedParams.id)
            console.log('[MarketPage] Parsed ID:', id);
            if (!isNaN(id)) {
                setMarketId(id)
                console.log('[MarketPage] Market ID set:', id);
            } else {
                console.error('[MarketPage] Invalid ID:', resolvedParams.id);
            }
        }
        getParams()
    }, [params])

    console.log('[MarketPage] Render with marketId:', marketId);
    // Only fetch market when we have a valid marketId
    const { market, loading, error } = useMarket(marketId !== null ? marketId : -1)
    console.log('[MarketPage] useMarket returned:', { hasMarket: !!market, loading, error });

    // Show loading while parsing params or fetching market
    if (marketId === null || (loading && market === null)) {
        return (
            <main className="min-h-screen bg-background pb-20 pt-24">
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <span className="ml-3 text-muted-foreground">Loading market...</span>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !market) {
        return (
            <main className="min-h-screen bg-background pb-20 pt-24">
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="text-center py-12">
                        <p className="text-red-600 font-semibold mb-2">Market not found</p>
                        <p className="text-muted-foreground mb-6">{error || 'The requested market does not exist.'}</p>
                        <Button asChild>
                            <Link href="/markets">Browse Markets</Link>
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background pb-20 pt-24">
            <div className="mx-auto max-w-6xl px-6 lg:px-12">
                <div className="relative">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-x-px -inset-y-6 border-x"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-y-6 inset-x-0 left-1/2 w-2 -translate-x-1 border-x max-sm:hidden lg:left-1/3 lg:-translate-x-1.5"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-y-6 inset-x-0 right-1/3 ml-auto w-2 translate-x-1.5 border-x max-lg:hidden"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
                        {/* Left Column: Market Info & Chart */}
                        <div className="lg:col-span-8 space-y-8">
                            <MarketHeader market={{
                                question: market.question,
                                volume: "Hidden", // Encrypted
                                ending: new Date(Number(market.bettingDeadline) * 1000).toLocaleDateString(),
                                image: market.image,
                                category: market.category,
                            }} />
                            <MarketStats market={market} />
                            <MarketChart />

                            {/* Market Description / Rules */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground mb-4">Market Description</h3>
                                    <div className="text-muted-foreground space-y-3">
                                        <p>
                                            This market will resolve to <strong className="text-green-500">"Yes"</strong> if {market.question.toLowerCase().replace('will ', '').replace('?', '')}.
                                            Otherwise, it will resolve to <strong className="text-red-500">"No"</strong>.
                                        </p>
                                        <p>
                                            All bets placed on this market are <strong className="text-primary">fully encrypted</strong> using Zama's FHE technology.
                                            This means your bet amount and position remain completely private until market resolution, preventing front-running and market manipulation.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-foreground mb-4">Resolution Rules</h3>
                                    <div className="text-muted-foreground space-y-2">
                                        <p>
                                            <strong>Resolution Source:</strong> This market will be resolved by the designated oracle/resolver based on publicly verifiable data sources.
                                        </p>
                                        <p>
                                            <strong>Betting Deadline:</strong> {new Date(Number(market.bettingDeadline) * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p>
                                            <strong>Resolution Time:</strong> {new Date(Number(market.resolutionTime) * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-border/50 pt-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-4">Market Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Creator</p>
                                            <p className="font-mono text-foreground">{market.creator.slice(0, 6)}...{market.creator.slice(-4)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Resolver</p>
                                            <p className="font-mono text-foreground">{market.resolver.slice(0, 6)}...{market.resolver.slice(-4)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Category</p>
                                            <p className="text-foreground">{market.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Created</p>
                                            <p className="text-foreground">{new Date(Number(market.createdAt) * 1000).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-primary" />
                                        Privacy Features
                                    </h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Your bet amount remains encrypted on-chain</li>
                                        <li>• Your position (Yes/No) is hidden from other traders</li>
                                        <li>• Total market volume is encrypted until resolution</li>
                                        <li>• Only you can decrypt and view your own positions</li>
                                        <li>• Prevents whale manipulation and front-running</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Betting Interface */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                <BettingInterface marketId={marketId} marketAddress={market.address} />
                                <MyPosition marketId={marketId} marketAddress={market.address} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
