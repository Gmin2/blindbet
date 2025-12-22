import { Card, CardContent } from '@/components/ui/card'
import { Activity, Lock, Clock, Info } from 'lucide-react'
import { Market, MarketState } from '@/types/market'

interface MarketStatsProps {
    market: Market
}

// Tooltip component
function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
    return (
        <div className="group/tooltip relative inline-flex">
            {children}
            {/* Tooltip container - positioned above the icon */}
            <div className="pointer-events-none absolute bottom-full right-0 mb-3 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-[100] w-64">
                <div className="bg-black text-white text-xs rounded-none p-3 shadow-2xl border border-white/20">
                    {text}
                    {/* Arrow pointing down to the info icon */}
                    <div className="absolute top-full right-3 -mt-[1px]">
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MarketStats({ market }: MarketStatsProps) {
    // Format time remaining
    const formatTimeRemaining = (seconds: number) => {
        if (seconds <= 0) return 'Ended'

        const days = Math.floor(seconds / 86400)
        const hours = Math.floor((seconds % 86400) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        if (days > 0) return `${days}d ${hours}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    // Get market status
    const getMarketStatus = () => {
        // Convert to number to ensure proper comparison
        const state = Number(market.state)

        switch (state) {
            case 0: // MarketState.Open
                return market.isActive ? 'Active' : 'Ending Soon'
            case 1: // MarketState.Locked
                return 'Locked'
            case 2: // MarketState.Resolving
                return 'Resolving'
            case 3: // MarketState.Resolved
                return 'Resolved'
            default:
                return 'Active' // Default to Active for new markets
        }
    }

    const timeRemaining = market.timeRemaining || 0
    const isActive = market.state === MarketState.Open

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Volume - Purple gradient */}
            <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-none relative">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/20">
                            <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Tooltip text="Volume is encrypted using FHE (Fully Homomorphic Encryption) to prevent market manipulation. It will be revealed after resolution.">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-purple-500 transition-colors cursor-help" />
                        </Tooltip>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">Private</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Volume</div>
                    </div>
                </CardContent>
            </Card>

            {/* Status - Blue gradient */}
            <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-none relative">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">{getMarketStatus()}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Status</div>
                    </div>
                </CardContent>
            </Card>

            {/* Probability - Green gradient */}
            <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-none relative">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-green-500/10 border border-green-500/20">
                            <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <Tooltip text="Probabilities are encrypted to prevent front-running. All bets remain confidential until market resolution.">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-green-500 transition-colors cursor-help" />
                        </Tooltip>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">Private</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Probability</div>
                    </div>
                </CardContent>
            </Card>

            {/* Time Left - Orange/Gray gradient */}
            <Card className={`border-border/50 bg-gradient-to-br ${isActive ? 'from-orange-500/10 to-orange-600/5' : 'from-gray-500/10 to-gray-600/5'} backdrop-blur-sm rounded-none relative`}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 ${isActive ? 'bg-orange-500/10 border-orange-500/20' : 'bg-gray-500/10 border-gray-500/20'} border`}>
                            <Clock className={`h-5 w-5 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className={`text-2xl font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {formatTimeRemaining(timeRemaining)}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Time Left</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
