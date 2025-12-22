import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface MarketHeaderProps {
    market: {
        question: string
        image: string
        category: string
        ending: string
        volume: string
    }
}

export function MarketHeader({ market }: MarketHeaderProps) {
    return (
        <div className="relative overflow-hidden bg-card border border-border/50">
            <div className="absolute inset-0 h-48 bg-gradient-to-b from-primary/10 to-transparent" />
            
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden border-4 border-background shadow-xl">
                    <Image
                        src={market.image}
                        alt={market.question}
                        fill
                        className="object-cover"
                    />
                </div>
                
                <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="px-3 py-1">
                            {market.category}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary">
                            Ends {market.ending}
                        </Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
                        {market.question}
                    </h1>
                </div>
            </div>
        </div>
    )
}
