export const FairnessChart = () => {
    return (
        <div
            aria-hidden
            className="mask-b-from-65% before:bg-background before:border-border after:border-border after:bg-background/50 before:z-1 group relative -mx-4 px-4 pt-6 before:absolute before:inset-x-6 before:bottom-0 before:top-4 before:rounded-2xl before:border after:absolute after:inset-x-9 after:bottom-0 after:top-2 after:rounded-2xl after:border">
            <div className="bg-illustration ring-border-illustration relative z-10 rounded-2xl border border-transparent p-6 shadow-xl shadow-black/10 ring-1">
                <div className="text-foreground font-medium">
                    <span className="bg-green-100 py-1 px-2 rounded text-green-900">FHE</span> Verified
                </div>
                <div className="text-muted-foreground mt-0.5 text-sm">Market Resolution Integrity</div>
                <div className="relative mb-4 mt-4 flex">
                    <div className="h-5 w-full rounded-md bg-primary/20 overflow-hidden">
                        <div className="h-full bg-primary w-full animate-[shimmer_2s_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)]" />
                    </div>
                </div>
                <div className="flex gap-1 border-b border-dashed pb-3">
                    <div className="w-1/2">
                        <div className="text-foreground text-xl font-medium">100%</div>
                        <div className="text-muted-foreground text-sm">Accuracy</div>
                    </div>
                    <div className="w-1/2">
                        <div className="text-foreground text-xl font-medium">0ms</div>
                        <div className="text-muted-foreground text-sm">Leakage</div>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <div className="size-1.5 rounded-full bg-green-500"></div>
                        <div className="line-clamp-1 text-sm font-medium">
                            Proof Generation <span className="text-muted-foreground">Verified</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <div className="size-1.5 rounded-full bg-green-500"></div>
                        <div className="line-clamp-1 text-sm font-medium">
                            Input Privacy <span className="text-muted-foreground">Secured</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
