import { Network, Server, Globe, Database, Cpu, Share2 } from 'lucide-react'

export const OracleNetwork = () => {
    return (
        <>
            <div className="@md:grid-cols-6 relative grid grid-cols-3 gap-4">
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>
                <div className="rounded-(--radius) bg-illustration ring-border-illustration shadow-black/10flex aspect-square items-center justify-center p-4 shadow-md ring-1">
                    <Network className="size-6 text-primary" />
                </div>
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>
                <div className="rounded-(--radius) bg-illustration ring-border-illustration flex aspect-square items-center justify-center p-4 shadow-md shadow-black/10 ring-1">
                    <Server className="size-6 text-primary" />
                </div>
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>
                <div className="rounded-(--radius) bg-illustration ring-border-illustration flex aspect-square items-center justify-center p-4 shadow-md shadow-black/10 ring-1">
                    <Globe className="size-6 text-primary" />
                </div>
            </div>
            <div className="@md:grid-cols-6 relative mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-(--radius) bg-illustration ring-border-illustration flex aspect-square items-center justify-center shadow-md shadow-black/10 ring-1">
                    <Database className="size-6 text-primary" />
                </div>
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>

                <div className="rounded-(--radius) bg-illustration ring-border-illustration flex aspect-square items-center justify-center shadow-md shadow-black/10 ring-1">
                    <Cpu className="size-6 text-primary" />
                </div>
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>
                <div className="rounded-(--radius) bg-illustration ring-border-illustration flex aspect-square items-center justify-center shadow-md shadow-black/10 ring-1">
                    <Share2 className="size-6 text-primary" />
                </div>
                <div className="@md:block rounded-(--radius) bg-background/50 border-foreground/15 hidden aspect-square border border-dashed backdrop-blur-3xl"></div>
            </div>
        </>
    )
}
