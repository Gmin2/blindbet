import { cn } from '@/lib/utils'
import { Fingerprint } from 'lucide-react'

export const FingerprintScanIllustration = () => {
    return (
        <div className="relative aspect-square">
            <div className="mask-radial-from-0% mask-radial-to-75% relative flex aspect-square justify-center items-center">
                <div className="size-full scale-110 bg-zinc-50 flex items-center justify-center">
                     <Fingerprint className="size-32 text-blue-600" strokeWidth={2} />
                </div>
            </div>
            <div className="aspect-3/4 bg-linear-to-b from-foreground/5 to-foreground/5 inset-18 -translate-y-9.5 absolute m-auto translate-x-1.5 via-transparent">
                <CardDecorator className="border-primary" />
                <div className="animate-scan absolute inset-0 z-10">
                    <div className="absolute inset-x-0 m-auto h-2 w-2/3 bg-blue-600 blur-lg"></div>
                </div>
            </div>
        </div>
    )
}

export const CardDecorator = ({ className }: { className?: string }) => (
    <>
        <span className={cn('absolute -left-px -top-px block size-2.5 rounded-tl border-l-[1.5px] border-t-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -right-px -top-px block size-2.5 rounded-tr border-r-[1.5px] border-t-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -bottom-px -left-px block size-2.5 rounded-bl border-b-[1.5px] border-l-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -bottom-px -right-px block size-2.5 rounded-br border-b-[1.5px] border-r-[1.5px] border-white', className)}></span>
    </>
)