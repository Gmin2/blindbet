'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Market } from '@/types/market'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'

export function MarketsGrid({ markets }: { markets: Market[] }) {
    const moreMarkets = markets.slice(2)
    const lastMarkets = markets.slice(markets.length - 3)

    // Helper to format volume
    const formatVolume = (volume: bigint) => {
        const val = Number(volume) / 1_000_000 // Assuming 6 decimals like USDC
        // Volume is encrypted, show "Hidden" instead of $0
        if (val === 0) return 'Hidden'
        if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
        if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`
        return `$${val.toFixed(0)}`
    }

    return (
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

                <div className="space-y-12">
                    {markets.slice(0, 2).map((market, index) => (
                        <div
                            key={`${market.id}-${index}`}
                            className="group relative">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -inset-x-6 -inset-y-px group-first:border-y"
                            />
                            <article className={cn('bg-card/75 ring-foreground/3 hover:bg-card/50 focus-within:bg-card/50 group relative gap-2 border border-transparent shadow-md ring-1 duration-200 sm:grid sm:grid-cols-3')}>
                                <div className="before:border-border-illustration relative m-0.5 aspect-square overflow-hidden before:absolute before:inset-0 before:border">
                                    <Image
                                        src={market.image}
                                        alt={market.question}
                                        width={6394}
                                        height={4500}
                                        className="h-full w-full object-cover"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                        priority={index === 0}
                                    />
                                </div>

                                <div className="col-span-2 flex flex-col gap-3 p-6">
                                    <time
                                        className="text-muted-foreground text-sm"
                                        dateTime={new Date(Number(market.bettingDeadline) * 1000).toISOString()}>
                                        Ends: {formatDate(new Date(Number(market.bettingDeadline) * 1000).toISOString())}
                                    </time>
                                    <h2 className="text-foreground text-balance text-lg font-semibold md:text-xl">
                                        <Link
                                            href={`/market/${market.id}`}
                                            className="before:absolute before:inset-0">
                                            {market.question}
                                        </Link>
                                    </h2>
                                    <p className="text-muted-foreground">Volume: {formatVolume(market.totalVolume)}</p>

                                    <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-2 pt-4">
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                                <div className="ring-border-illustration bg-card aspect-square size-6 overflow-hidden border border-transparent shadow-md shadow-black/15 ring-1">
                                                    <div className="size-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {market.creator.slice(2, 4).toUpperCase()}
                                                    </div>
                                                </div>
                                                <span className="text-muted-foreground line-clamp-1 text-sm font-mono">
                                                    {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex h-6 items-center">
                                            <span
                                                aria-label={`Trade ${market.question}`}
                                                className="text-primary group-hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors duration-200">
                                                Trade
                                                <ChevronRight
                                                    strokeWidth={2.5}
                                                    aria-hidden="true"
                                                    className="size-3.5 translate-y-px duration-200 group-hover:translate-x-0.5"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* More Markets Grid */}
            {moreMarkets.length > 0 && (
                <div className="mt-12">
                    <div className="relative">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-x-px -inset-y-6 border-x"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-y-6 inset-x-0 left-1/2 w-2 -translate-x-1.5 border-x max-sm:hidden lg:left-1/3 lg:-translate-x-1.5"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-y-6 inset-x-0 right-1/3 ml-auto w-2 translate-x-1.5 border-x max-lg:hidden"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-x-6 -inset-y-px border-y"
                        />

                        <div className="-mx-6 border-b px-12 py-2">
                            <h2 className="text-foreground text-xs font-medium uppercase">More Markets</h2>
                        </div>
                        <div className="grid gap-x-2 sm:grid-cols-2 lg:grid-cols-3">
                            {moreMarkets.map((market, index) => (
                                <article
                                    key={market.id.toString()}
                                    className={cn('group relative row-span-2 grid grid-rows-subgrid overflow-hidden duration-200 min-h-[280px]', index < moreMarkets.length - lastMarkets.length && 'border-b')}>
                                    {/* Image Background */}
                                    <div className="absolute inset-0 z-0">
                                        {market.image ? (
                                            <img
                                                src={market.image}
                                                alt={market.question}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-muted/20" />
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                                        <div className="space-y-3">
                                            <time
                                                className="text-white/70 block text-sm"
                                                dateTime={new Date(Number(market.bettingDeadline) * 1000).toISOString()}>
                                                Ends: {formatDate(new Date(Number(market.bettingDeadline) * 1000).toISOString())}
                                            </time>
                                            <h3 className="text-white text-lg font-semibold leading-tight">
                                                <Link
                                                    href={`/market/${market.id}`}
                                                    className="before:absolute before:inset-0">
                                                    {market.question}
                                                </Link>
                                            </h3>
                                            <p className="text-white/70">Volume: {formatVolume(market.totalVolume)}</p>
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto] items-end gap-2 pt-4 mt-4 border-t border-white/10">
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                                    <div className="ring-border-illustration bg-card/20 backdrop-blur-sm aspect-square size-6 overflow-hidden border border-white/20 shadow-md shadow-black/15 ring-1 ring-white/10">
                                                        <div className="size-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                            {market.creator.slice(2, 4).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <span className="text-white/70 line-clamp-1 text-sm font-mono">
                                                        {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex h-6 items-center">
                                                <span
                                                    aria-label={`Trade ${market.question}`}
                                                    className="text-white/90 group-hover:text-white flex items-center gap-1 text-sm font-medium transition-colors duration-200">
                                                    Trade
                                                    <ChevronRight
                                                        strokeWidth={2.5}
                                                        aria-hidden="true"
                                                        className="size-3.5 translate-y-px duration-200 group-hover:translate-x-0.5"
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
