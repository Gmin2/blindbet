import { LayoutIllustration } from "@/components/layout-illustration"

export default function FeaturesSection5() {
    return (
        <section>
            <div className="bg-muted py-24 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] [--color-primary:var(--color-sky-600)] [--radius:1rem]">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="relative">
                        <div className="z-10 max-w-xl">
                            <h2 className="mb-4 text-4xl font-semibold">Set the product direction</h2>
                            <p className="mb-8 text-lg">
                                Monitor your application's activity in real-time. <span className="text-muted-foreground"> Instantly identify and resolve issues.</span>
                            </p>
                        </div>

                        <div className="-translate-x-44 md:translate-x-0">
                            <LayoutIllustration />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}