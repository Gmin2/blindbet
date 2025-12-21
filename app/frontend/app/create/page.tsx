import CreateMarketForm from '@/components/create-market-form'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function CreateMarketPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-12">
                <div className="max-w-md mb-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/markets">Markets</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/create">Create</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="relative">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-x-px -inset-y-6 border-x"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-y-6 inset-x-0 left-1/2 w-2 -translate-x-1 border-x max-sm:hidden lg:left-1/3 lg:-translate-x-1.5"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-y-6 inset-x-0 right-1/3 ml-auto w-2 translate-x-1.5 border-x max-lg:hidden"
                    />
                    
                    <div className="relative z-10">
                        <CreateMarketForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
