import { IntegrationsIllustration } from "@/components/integrations-illustration"
import { Zap, Sparkles, Lock, Cpu } from 'lucide-react'
import { InvoiceIllustration } from "@/components/invoice-illustration"
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
    return (
        <section className="bg-background">
            <div className="bg-muted/50 @container py-24">
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="relative">
                        <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
                        <PlusDecorator className="right-0 -translate-y-[calc(50%-0.5px)] translate-x-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 right-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

                        <div className="border-foreground/10 *:nth-2:border-r-0 @max-4xl:*:nth-4:border-r-0 @max-4xl:*:nth-5:border-b-0 @max-4xl:*:first:border-r-0 @4xl:*:not-nth-2:border-b-0 *:nth-1:border-b! divide-foreground/10 @4xl:grid-cols-4 @4xl:*:p-8 relative grid grid-cols-2 divide-x divide-y overflow-hidden border *:p-4">
                            <div className="@4xl:col-span-2 col-span-full row-span-2 grid grid-rows-subgrid gap-8 !p-8">
                                <div className="max-w-84 mx-auto w-full self-center">
                                    <InvoiceIllustration />
                                </div>
                                <div className="mx-auto max-w-sm text-center">
                                    <h3 className="text-balance font-semibold">Powerful analytics dashboard</h3>
                                    <p className="text-muted-foreground mt-3">Track performance metrics with real-time data visualization and customizable reports for informed.</p>
                                </div>
                            </div>
                            <div className="@4xl:col-span-2 relative col-span-full row-span-2 grid grid-rows-subgrid gap-8 !p-8">
                                <PlusDecorator className="bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />

                                <div className="@4xl:px-8 mx-auto max-w-sm self-center">
                                    <IntegrationsIllustration />
                                </div>
                                <div className="relative z-10 mx-auto max-w-sm text-center">
                                    <h3 className="text-balance font-semibold">Streamlined invoicing system</h3>
                                    <p className="text-muted-foreground mt-3">Generate, send, and manage professional invoices automatically with integrated payment tracking.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Faaast</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Powerful</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Security</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">An helping developers businesses innovate.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-foreground size-4" />

                                    <h3 className="text-sm font-medium">AI Powered</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Helping developers businesses innovate.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const PlusDecorator = ({ className }: { className?: string }) => (
    <div
        aria-hidden
        className={cn('mask-radial-from-15% before:bg-foreground/25 after:bg-foreground/25 absolute size-3 before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px', className)}
    />
)