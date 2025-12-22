import { ArrowBigRight, Equal } from 'lucide-react'
import { CardDecorator } from "@/components/card-decorator"
import { DocumentIllustation } from "@/components/document-illustration"
import { IDCheckIllustration } from "@/components/id-check-illustration"

export const VerificationFlow = () => {
    return (
        <div className="relative flex flex-col items-center justify-center py-8">
            <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="@lg:flex-row @4xl:aspect-auto flex aspect-video flex-col items-center gap-12">
                <div className="relative">
                    <div className="relative mx-auto size-fit rounded-lg">
                        <CardDecorator className="size-2" />
                        <DocumentIllustation />
                    </div>
                    <ArrowBigRight
                        strokeWidth={4}
                        className="fill-border stroke-border @lg:inset-y-0 @lg:right-0 @lg:my-auto @lg:translate-x-[150%] @lg:rotate-0 @xl:translate-y-0 absolute bottom-0 translate-x-[125%] translate-y-[200%] rotate-90"
                    />
                </div>

                <div className="relative">
                    <IDCheckIllustration />
                    <Equal
                        strokeWidth={4}
                        className="fill-border stroke-border @lg:inset-x-auto @lg:inset-y-0 @lg:right-0 @lg:my-auto @lg:translate-x-[150%] @xl:translate-y-0 absolute inset-x-0 bottom-0 mx-auto translate-y-[150%]"
                    />
                </div>
                <div className="relative mx-auto flex size-fit -space-x-6">
                    <DocumentIllustation className="translate-y-1 -rotate-12" />
                    <DocumentIllustation className="z-11 relative" />
                    <DocumentIllustation className="translate-y-1 rotate-12" />
                </div>
            </div>
        </div>
    )
}
