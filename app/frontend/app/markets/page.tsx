"use client"

import { useState, useEffect, Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MarketsGrid } from '@/components/markets-grid'
import { MarketsFilter, Category } from '@/components/markets-filter'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Market, MarketState, Outcome } from '@/types/market'
import { useMarkets } from '@/hooks/useMarkets'

// Keep mock data as fallback (will be removed later)
const mockMarkets: Market[] = [
    {
        id: 0n,
        address: "0x1234567890123456789012345678901234567890",
        question: "Will ETH reach $5000 by December 2025?",
        state: MarketState.Open,
        createdAt: 1704067200n,
        bettingDeadline: 1735689600n,
        resolutionTime: 1735776000n,
        creator: "0xAlice...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.NotSet,
        image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
        category: "Crypto",
        totalVolume: 3500000n,
        timeRemaining: 86400,
        isActive: true
    },
    {
        id: 1n,
        address: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
        question: "Will BTC hit $100k in 2025?",
        state: MarketState.Locked,
        createdAt: 1704067200n,
        bettingDeadline: 1704153600n,
        resolutionTime: 1704240000n,
        creator: "0xBob...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.NotSet,
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
        category: "Crypto",
        totalVolume: 12100000n,
        timeRemaining: 0,
        isActive: false
    },
    {
        id: 2n,
        address: "0x9999999999999999999999999999999999999999",
        question: "Will Trump win the 2024 US Election?",
        state: MarketState.Resolved,
        createdAt: 1704067200n,
        bettingDeadline: 1704153600n,
        resolutionTime: 1704240000n,
        creator: "0xCharlie...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.Yes,
        image: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2070&auto=format&fit=crop",
        category: "Politics",
        totalVolume: 45200000n,
        timeRemaining: 0,
        isActive: false
    },
    {
        id: 3n,
        address: "0x8888888888888888888888888888888888888888",
        question: "Will GPT-5 be released before Q3 2025?",
        state: MarketState.Open,
        createdAt: 1704067200n,
        bettingDeadline: 1751328000n,
        resolutionTime: 1751414400n,
        creator: "0xDave...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.NotSet,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        category: "AI",
        totalVolume: 1200000n,
        timeRemaining: 15552000,
        isActive: true
    },
    {
        id: 4n,
        address: "0x7777777777777777777777777777777777777777",
        question: "Will SpaceX land on Mars by 2030?",
        state: MarketState.Open,
        createdAt: 1704067200n,
        bettingDeadline: 1924905600n,
        resolutionTime: 1924992000n,
        creator: "0xElon...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.NotSet,
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
        category: "Space",
        totalVolume: 850000n,
        timeRemaining: 189216000,
        isActive: true
    },
    {
        id: 5n,
        address: "0x6666666666666666666666666666666666666666",
        question: "Will the Fed cut rates in March 2024?",
        state: MarketState.Resolved,
        createdAt: 1704067200n,
        bettingDeadline: 1710892800n,
        resolutionTime: 1710979200n,
        creator: "0xFrank...",
        resolver: "0xOracle...",
        resolvedOutcome: Outcome.No,
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop",
        category: "Finance",
        totalVolume: 5600000n,
        timeRemaining: 0,
        isActive: false
    }
]

function MarketsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryParam = searchParams.get('category')
    const selectedCategory = categoryParam || "All"

    // Fetch real markets from blockchain (with caching, actual refresh is less frequent)
    const { markets, loading, error } = useMarkets(120000) // Refresh every 2 minutes

    // Filter markets by category
    const filteredMarkets = useMemo(() => {
        return selectedCategory === "All"
            ? markets
            : markets.filter(market => market.category.toLowerCase() === selectedCategory.toLowerCase())
    }, [markets, selectedCategory])

    // Extract unique categories from real markets
    const categories: Category[] = useMemo(() => {
        const uniqueCategories = Array.from(new Set(markets.map(m => m.category)))
        return uniqueCategories.map(cat => ({
            slug: cat.toLowerCase(),
            title: cat
        }))
    }, [markets])

    const handleCategoryChange = (category: string) => {
        if (category === 'All') {
            router.push('/markets')
        } else {
            router.push(`/markets?category=${category}`)
        }
    }

    return (
        <>
            <div className="mx-auto max-w-6xl px-6 lg:px-12">
                <div className="flex items-end justify-between">
                    <div className="max-w-md">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/markets">Markets</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h1 className="text-muted-foreground mt-4 text-balance text-4xl font-semibold">
                            Explore Markets on <strong className="text-foreground font-semibold">BlindBet</strong>
                        </h1>
                    </div>
                    <Button asChild className="rounded-none mb-2">
                        <Link href="/create">
                            Create Market
                        </Link>
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mx-auto max-w-6xl px-6 lg:px-12 mt-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        <p className="font-semibold">Error loading markets</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="mx-auto max-w-6xl px-6 lg:px-12 mt-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <span className="ml-3 text-muted-foreground">Loading markets from blockchain...</span>
                    </div>
                </div>
            ) : (
                <>
                    <MarketsFilter
                        categories={categories}
                        posts={filteredMarkets}
                        activeCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />

                    {filteredMarkets.length === 0 ? (
                        <div className="mx-auto max-w-6xl px-6 lg:px-12 mt-8">
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No markets found.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/create">Create the first market</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <MarketsGrid markets={filteredMarkets} />
                    )}
                </>
            )}
        </>
    )
}

export default function MarketsPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <Suspense fallback={<div>Loading markets...</div>}>
                <MarketsContent />
            </Suspense>
        </main>
    )
}
