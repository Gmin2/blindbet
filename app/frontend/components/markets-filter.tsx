'use client'

import { cn } from '@/lib/utils'
import { MarketsCommandDialog } from '@/components/markets-command'
import { Market } from '@/types/market'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export type Category = {
    slug: string
    title: string
}

export type MarketsFilterProps = {
    categories: Category[]
    posts: Market[]
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export const MarketsFilter = ({ categories, posts, activeCategory, onCategoryChange }: MarketsFilterProps) => {
    
    return (
        <div className="mx-auto mb-6 mt-12 max-w-6xl md:px-6 lg:px-12">
            <div className="flex items-center justify-between gap-4">
                <div
                    className="-ml-0.5 flex snap-x snap-mandatory overflow-x-auto py-3 max-md:pl-6"
                    role="tablist"
                    aria-label="Market categories">
                    <FilterButton
                        key="all"
                        category={{ slug: 'All', title: 'All' }}
                        activeCategory={activeCategory}
                        handleClick={onCategoryChange}
                    />

                    {categories.map((category) => (
                        <FilterButton
                            key={category.slug}
                            category={category}
                            activeCategory={activeCategory}
                            handleClick={onCategoryChange}
                        />
                    ))}
                </div>

                <div className="flex gap-1 max-md:pr-3">
                    <MarketsCommandDialog
                        categories={categories}
                        markets={posts}
                    />
                </div>
            </div>
        </div>
    )
}

const FilterButton = ({ category, activeCategory, handleClick }: { category: Category; activeCategory: string; handleClick: (slug: string) => void }) => {
    return (
        <button
            onClick={() => handleClick(category.slug)}
            role="tab"
            aria-selected={activeCategory === category.slug}
            className="text-muted-foreground group snap-center px-1 disabled:pointer-events-none disabled:opacity-50">
            <span className={cn('flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors [&>svg]:size-4', activeCategory === category.slug ? 'bg-card ring-foreground/5 text-primary font-medium shadow-sm ring-1' : 'hover:text-foreground group-hover:bg-foreground/5')}>
                <span className="capitalize">{category.title}</span>
            </span>
        </button>
    )
}
