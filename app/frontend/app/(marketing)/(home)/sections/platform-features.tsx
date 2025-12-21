import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const trendingMarkets = [
    {
        id: 0,
        question: "Will ETH reach $5000 by December 2025?",
        volume: "$3.5M",
        ending: "Dec 31, 2025",
        image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
        category: "Crypto",
        color: "from-blue-500/20 to-purple-500/20"
    },
    {
        id: 1,
        question: "Will BTC hit $100k in 2025?",
        volume: "$12.1M",
        ending: "Dec 31, 2025",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
        category: "Crypto",
        color: "from-orange-500/20 to-yellow-500/20"
    },
    {
        id: 2,
        question: "Will Trump win 2024 election?",
        volume: "$45.2M",
        ending: "Nov 5, 2024",
        image: "https://images.unsplash.com/photo-1730992907035-65ec4eaea035?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Politics",
        color: "from-red-500/20 to-blue-500/20"
    },
    {
        id: 3,
        question: "Will SOL reach $200 in 2025?",
        volume: "$8.4M",
        ending: "Dec 31, 2025",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2069&auto=format&fit=crop",
        category: "Crypto",
        color: "from-purple-500/20 to-indigo-500/20"
    },
    {
        id: 4,
        question: "Will Chiefs win Super Bowl LIX?",
        volume: "$18.2M",
        ending: "Feb 9, 2025",
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2007&auto=format&fit=crop",
        category: "Sports",
        color: "from-red-600/20 to-yellow-600/20"
    },
    {
        id: 5,
        question: "Will GPT-5 be released in 2025?",
        volume: "$9.2M",
        ending: "Dec 31, 2025",
        image: "https://images.unsplash.com/photo-1737894543924-15e1ff7adbdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoYXRncHR8ZW58MHx8MHx8fDA%3D",
        category: "AI",
        color: "from-green-500/20 to-teal-500/20"
    }
]

export function PlatformFeatures() {
    return (
        <section className="relative overflow-hidden py-24">
             <div
                aria-hidden
                className="mask-b-from-65% absolute -inset-x-7 top-12">
                <svg
                    className="text-foreground/15 fill-background/35 max-md:scale-x-250 w-full origin-top-right max-md:translate-x-3 max-md:scale-y-125"
                    viewBox="0 0 2402 1372"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.6015 1033.34L4.26185 1343.72C4.39367 1359.1 16.9052 1371.49 32.2849 1371.48L2310.36 1369.51C2317.81 1369.5 2324.95 1366.53 2330.2 1361.25L2393.36 1297.69C2398.57 1292.44 2401.5 1285.35 2401.5 1277.95V1042.9C2401.5 1036.19 2399.09 1029.7 2394.71 1024.62L2364.79 989.877C2360.41 984.795 2358 978.311 2358 971.603V377.809C2358 370.258 2361.05 363.028 2366.46 357.758L2389.04 335.742C2394.45 330.472 2397.5 323.242 2397.5 315.691V29C2397.5 13.536 2384.96 1 2369.5 1H2300.5H1544.71C1536.92 1 1529.49 4.24189 1524.19 9.94736L1501.81 34.0526C1496.51 39.7581 1489.08 43 1481.29 43H926.196C918.712 43 911.539 40.0038 906.279 34.6801L881.221 9.31992C875.961 3.99621 868.788 1 861.304 1H87.598C80.1719 1 73.05 3.95 67.799 9.20102L9.20101 67.799C3.94999 73.05 1 80.1719 1 87.598V315.075C1 322.101 3.64086 328.869 8.3986 334.038L34.1014 361.962C38.8591 367.131 41.5 373.899 41.5 380.925V970.299C41.5 977.786 38.5014 984.961 33.1741 990.222L9.9264 1013.18C4.53979 1018.5 1.53662 1025.77 1.6015 1033.34Z"
                        stroke="currentColor"
                    />
                </svg>
            </div>
            <div
                aria-hidden
                className="mask-t-from-65% absolute -inset-x-7 bottom-0">
                <svg
                    className="text-foreground/15 fill-background/35 max-md:scale-x-250 w-full origin-top-right max-md:translate-x-3 max-md:scale-y-125"
                    viewBox="0 0 2402 1372"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.6015 1033.34L4.26185 1343.72C4.39367 1359.1 16.9052 1371.49 32.2849 1371.48L2310.36 1369.51C2317.81 1369.5 2324.95 1366.53 2330.2 1361.25L2393.36 1297.69C2398.57 1292.44 2401.5 1285.35 2401.5 1277.95V1042.9C2401.5 1036.19 2399.09 1029.7 2394.71 1024.62L2364.79 989.877C2360.41 984.795 2358 978.311 2358 971.603V377.809C2358 370.258 2361.05 363.028 2366.46 357.758L2389.04 335.742C2394.45 330.472 2397.5 323.242 2397.5 315.691V29C2397.5 13.536 2384.96 1 2369.5 1H2300.5H1544.71C1536.92 1 1529.49 4.24189 1524.19 9.94736L1501.81 34.0526C1496.51 39.7581 1489.08 43 1481.29 43H926.196C918.712 43 911.539 40.0038 906.279 34.6801L881.221 9.31992C875.961 3.99621 868.788 1 861.304 1H87.598C80.1719 1 73.05 3.95 67.799 9.20102L9.20101 67.799C3.94999 73.05 1 80.1719 1 87.598V315.075C1 322.101 3.64086 328.869 8.3986 334.038L34.1014 361.962C38.8591 367.131 41.5 373.899 41.5 380.925V970.299C41.5 977.786 38.5014 984.961 33.1741 990.222L9.9264 1013.18C4.53979 1018.5 1.53662 1025.77 1.6015 1033.34Z"
                        stroke="currentColor"
                    />
                </svg>
            </div>
            <div className="@container relative pb-24 pt-32">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <span className="text-primary font-mono text-sm uppercase">Live Markets</span>
                        <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
                            <h2 className="text-foreground text-4xl font-semibold md:text-5xl">Trending Prediction Markets</h2>
                            <div className="lg:pl-12">
                                <p className="text-muted-foreground text-balance text-lg">Explore trending markets and place your encrypted bets. Trade on future outcomes with full privacy.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bento Grid */}
                    <div className="@xl:grid-cols-2 @3xl:grid-cols-3 mt-16 grid gap-4 lg:-mx-8">
                        
                        {/* Market 0: ETH (Wide - Top Left) */}
                        <Link href={`/market/${trendingMarkets[0].id}`} className="@xl:col-span-2 group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[0].image} 
                                alt="ETH" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-blue-500/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[0].category}
                                </span>
                                <h3 className="text-white text-3xl font-bold leading-tight max-w-xl">{trendingMarkets[0].question}</h3>
                                <div className="mt-4 flex items-center gap-6 text-white/80">
                                    <p className="text-base font-medium">Volume: {trendingMarkets[0].volume}</p>
                                    <p className="text-base">Ends {trendingMarkets[0].ending}</p>
                                </div>
                            </div>
                        </Link>

                        {/* Market 1: BTC (Standard - Top Right) */}
                        <Link href={`/market/${trendingMarkets[1].id}`} className="group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[1].image} 
                                alt="BTC" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-orange-500/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[1].category}
                                </span>
                                <h3 className="text-white text-2xl font-bold leading-tight">{trendingMarkets[1].question}</h3>
                                <div className="mt-4 flex items-center justify-between text-white/80">
                                    <p className="text-sm font-medium">Vol: {trendingMarkets[1].volume}</p>
                                    <p className="text-sm">Ends {trendingMarkets[1].ending}</p>
                                </div>
                            </div>
                        </Link>

                        {/* Market 2: Trump (Standard - Middle Left) */}
                        <Link href={`/market/${trendingMarkets[2].id}`} className="group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[2].image} 
                                alt="Trump" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-red-500/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[2].category}
                                </span>
                                <h3 className="text-white text-2xl font-bold leading-tight">{trendingMarkets[2].question}</h3>
                                <div className="mt-4 flex items-center justify-between text-white/80">
                                    <p className="text-sm font-medium">Vol: {trendingMarkets[2].volume}</p>
                                    <p className="text-sm">Ends {trendingMarkets[2].ending}</p>
                                </div>
                            </div>
                        </Link>

                        {/* Market 3: SOL (Wide - Middle Right) */}
                        <Link href={`/market/${trendingMarkets[3].id}`} className="@xl:col-span-2 group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[3].image} 
                                alt="SOL" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-purple-500/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[3].category}
                                </span>
                                <h3 className="text-white text-3xl font-bold leading-tight max-w-xl">{trendingMarkets[3].question}</h3>
                                <div className="mt-4 flex items-center gap-6 text-white/80">
                                    <p className="text-base font-medium">Volume: {trendingMarkets[3].volume}</p>
                                    <p className="text-base">Ends {trendingMarkets[3].ending}</p>
                                </div>
                            </div>
                        </Link>

                        {/* Market 4: Sports (Wide - Bottom Left) */}
                        <Link href={`/market/${trendingMarkets[4].id}`} className="@xl:col-span-2 group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[4].image} 
                                alt="Sports" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-orange-600/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[4].category}
                                </span>
                                <h3 className="text-white text-3xl font-bold leading-tight max-w-xl">{trendingMarkets[4].question}</h3>
                                <div className="mt-4 flex items-center gap-6 text-white/80">
                                    <p className="text-base font-medium">Volume: {trendingMarkets[4].volume}</p>
                                    <p className="text-base">Ends {trendingMarkets[4].ending}</p>
                                </div>
                            </div>
                        </Link>

                        {/* Market 5: AI (Standard - Bottom Right) */}
                        <Link href={`/market/${trendingMarkets[5].id}`} className="group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 border border-transparent min-h-[300px]">
                            <Image 
                                src={trendingMarkets[5].image} 
                                alt="GPT-5" 
                                fill
                                className="absolute inset-0 object-cover opacity-60 saturate-50 transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                            
                            <div className="relative z-10 flex flex-col justify-end h-full">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-white bg-green-500/80 rounded-full w-fit backdrop-blur-sm">
                                    {trendingMarkets[5].category}
                                </span>
                                <h3 className="text-white text-2xl font-bold leading-tight">{trendingMarkets[5].question}</h3>
                                <div className="mt-4 flex items-center justify-between text-white/80">
                                    <p className="text-sm font-medium">Vol: {trendingMarkets[5].volume}</p>
                                    <p className="text-sm">Ends {trendingMarkets[5].ending}</p>
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* View All Button */}
                    <div className="mt-12 flex justify-center">
                        <Link href="/markets">
                            <Button size="lg" className="rounded-full px-8 h-12 text-base">
                                Explore All Markets
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}