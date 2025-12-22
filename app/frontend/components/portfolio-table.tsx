import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export const PortfolioTable = ({ className }: { className?: string }) => {
    const positions = [
        {
            id: 1,
            market: "Will ETH reach $5000 by December 2025?",
            image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
            position: 'YES',
            invested: '$1,000.00',
            value: '$1,800.00',
            pnl: '+$800.00',
            pnlPercent: '+80%',
            status: 'Open',
        },
        {
            id: 2,
            market: "Will GPT-5 be released in 2024?",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
            position: 'NO',
            invested: '$500.00',
            value: '$450.00',
            pnl: '-$50.00',
            pnlPercent: '-10%',
            status: 'Open',
        },
        {
            id: 3,
            market: "Will SpaceX Starship reach orbit in Q1 2024?",
            image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
            position: 'YES',
            invested: '$2,000.00',
            value: '$4,200.00',
            pnl: '+$2,200.00',
            pnlPercent: '+110%',
            status: 'Won',
        },
        {
            id: 4,
            market: "Will Bitcoin hit $100k in 2024?",
            image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
            position: 'NO',
            invested: '$750.00',
            value: '$0.00',
            pnl: '-$750.00',
            pnlPercent: '-100%',
            status: 'Lost',
        },
    ]

    return (
        <div className={cn('bg-background ring-border-illustration relative mx-auto w-full border border-border/50 shadow-sm ring-1', className)}>
            <div className="p-6 border-b border-border/50">
                <div className="font-semibold text-lg">Your Positions</div>
                <p className="text-muted-foreground mt-1 text-sm">Manage your active and closed bets.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr className="*:p-4 *:font-medium">
                            <th>Market</th>
                            <th>Position</th>
                            <th>Invested</th>
                            <th>Current Value</th>
                            <th>PnL</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {positions.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-muted/50 transition-colors *:p-4">
                                <td className="min-w-[300px]">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border/50">
                                            <Image
                                                src={item.image}
                                                alt={item.market}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-foreground line-clamp-2">{item.market}</span>
                                    </div>
                                </td>
                                <td>
                                    <Badge 
                                        variant="outline" 
                                        className={cn(
                                            "rounded-none font-bold border-transparent",
                                            item.position === 'YES' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                        )}
                                    >
                                        {item.position}
                                    </Badge>
                                </td>
                                <td className="font-medium">{item.invested}</td>
                                <td className="font-medium">{item.value}</td>
                                <td>
                                    <div className={cn("font-medium", item.pnl.startsWith('+') ? "text-green-500" : "text-red-500")}>
                                        {item.pnl}
                                        <span className="text-xs ml-1 opacity-80">({item.pnlPercent})</span>
                                    </div>
                                </td>
                                <td>
                                    <Badge variant="secondary" className="rounded-none font-normal">
                                        {item.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
