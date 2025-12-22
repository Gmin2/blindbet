import Link from 'next/link'
import { ArrowUpRight, Clock, BarChart3 } from 'lucide-react'

interface MarketCardProps {
    id: string | number
    question: string
    volume: string
    ending: string
    category?: string
    image?: string
}

export function MarketCard({ id, question, volume, ending, category, image }: MarketCardProps) {
    return (
        <Link 
            href={`/market/${id}`}
            className="group relative flex flex-col h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10"
        >
            {/* Image Background with improved overlay */}
            <div className="absolute inset-0 z-0">
                {image ? (
                    <img 
                        src={image} 
                        alt={question}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    />
                ) : (
                    <div className="h-full w-full bg-zinc-800" />
                )}
                {/* Multi-layer gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/90" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6">
                {/* Top Section */}
                <div className="flex items-start justify-between">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md transition-colors group-hover:bg-white/10">
                        {category || 'Market'}
                    </span>
                    <div className="rounded-full bg-white/5 p-2 backdrop-blur-md transition-all group-hover:bg-white/10 group-hover:scale-110">
                        <ArrowUpRight className="size-4 text-zinc-400 transition-colors group-hover:text-white" />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold leading-snug text-white antialiased line-clamp-3 group-hover:text-purple-100 transition-colors">
                        {question}
                    </h3>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-200 ring-1 ring-inset ring-purple-500/20">
                            <BarChart3 className="size-3.5 text-purple-400" />
                            <span>{volume}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-200 ring-1 ring-inset ring-blue-500/20">
                            <Clock className="size-3.5 text-blue-400" />
                            <span>{ending}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
