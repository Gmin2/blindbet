import { Card } from '@/components/ui/card'
import { Lock, EyeOff, ShieldCheck, Network } from 'lucide-react'
import { FingerprintScanIllustration } from '@/components/fingerprint-scan-illustration'
import { FairnessChart } from '@/components/fairness-chart'
import { OracleNetwork } from '@/components/oracle-network'
import { VerificationFlow } from '@/components/verification-flow'

export function MoreFeatures() {
    return (
        <section className="relative">
            <div
                aria-hidden
                className="mask-b-from-65% pointer-events-none absolute -left-2 right-0 -mt-12 sm:-top-24 lg:inset-x-0 lg:-top-32">
                <svg
                    viewBox="0 0 2400 1653"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground/15 fill-background/35 w-full">
                    <path
                        d="M6.81602 605.752L38.684 642.748C42.4362 647.104 44.5 652.662 44.5 658.411V1628.23C44.5 1641.59 55.4076 1652.38 68.7652 1652.23L2375.26 1626.76C2388.42 1626.62 2399 1615.92 2399 1602.76V2L2153.06 247.941C2144.06 256.943 2131.85 262 2119.12 262H90.4852C84.094 262 77.9667 264.549 73.4616 269.083L7.97632 334.98C3.50795 339.476 1 345.558 1 351.897V590.089C1 595.838 3.06383 601.396 6.81602 605.752Z"
                        stroke="currentColor"
                    />
                </svg>
            </div>

            <div className="@container relative z-10 py-16 lg:py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <span className="text-primary font-mono text-sm uppercase">Why BlindBet?</span>
                        <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
                            <h2 className="text-foreground text-4xl font-semibold md:text-5xl">The Future of Confidential Prediction Markets</h2>
                            <div className="lg:pl-12">
                                <p className="text-muted-foreground text-balance text-lg">Built on the first confidential L2, ensuring your trades remain private and secure. Experience the next generation of betting.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="@xl:grid-cols-2 @3xl:grid-cols-6 mt-16 grid gap-4 lg:-mx-8">
                        
                        {/* Encrypted Liquidity - Large Card with Verification Flow */}
                        <Card className="@3xl:col-span-4 group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 transition-all hover:bg-muted/50 min-h-[400px]">
                            <div className="relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-foreground text-2xl font-semibold">Encrypted Liquidity</h3>
                                <p className="text-muted-foreground mt-3 text-lg max-w-md">Trade against encrypted liquidity pools. No front-running, no MEV. Your strategy remains yours.</p>
                            </div>
                            <div className="absolute inset-0 z-0 flex items-center justify-center pt-20">
                                <VerificationFlow />
                            </div>
                        </Card>

                        {/* Private Positions - Tall Card with Fingerprint Scan */}
                        <Card className="@3xl:col-span-2 group relative grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 transition-all hover:bg-muted/50">
                            <div className="relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                                    <EyeOff className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-foreground text-xl font-semibold">Private Positions</h3>
                                <p className="text-muted-foreground mt-3">Your bets are confidential by default. Only you can see your position.</p>
                            </div>
                            <div className="relative -m-8 mt-auto p-8">
                                <FingerprintScanIllustration />
                            </div>
                        </Card>

                        {/* Verifiable Fairness - Standard Card with Chart */}
                        <Card className="@3xl:col-span-3 group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 transition-all hover:bg-muted/50">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-foreground text-xl font-semibold">Verifiable Fairness</h3>
                                <p className="text-muted-foreground mt-3">FHE ensure that market resolution is tamper-proof and mathematically verifiable.</p>
                            </div>
                            <FairnessChart />
                        </Card>

                        {/* Decentralized Oracles - Standard Card with Network */}
                        <Card className="@3xl:col-span-3 group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 transition-all hover:bg-muted/50">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                                    <Network className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-foreground text-xl font-semibold">Decentralized Oracles</h3>
                                <p className="text-muted-foreground mt-3">Markets are resolved by a decentralized network of oracles, ensuring unbiased outcomes.</p>
                            </div>
                            <div className="bg-linear-to-b border-background -m-8 flex flex-col justify-center border-x from-transparent via-primary/5 to-zinc-50 p-8">
                                <OracleNetwork />
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
            <div
                aria-hidden
                className="mask-t-from-65% pointer-events-none absolute -inset-x-7 bottom-0">
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
        </section>
    )
}