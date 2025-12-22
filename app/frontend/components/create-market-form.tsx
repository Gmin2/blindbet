'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateMarket } from '@/hooks/useCreateMarket'
import { useWallet } from '@/hooks/useWallet'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateMarketForm() {
    const router = useRouter()
    const { isConnected, connect } = useWallet()
    const { createMarket, loading } = useCreateMarket()

    const [formData, setFormData] = useState({
        question: '',
        category: 'Cryptocurrency',
        duration: '604800',
        delay: '86400',
        resolver: '',
        image: ''
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        // Check wallet connection
        if (!isConnected) {
            setError('Please connect your wallet first')
            connect()
            return
        }

        try {
            const result = await createMarket({
                question: formData.question,
                bettingDuration: formData.duration,
                resolutionDelay: formData.delay,
                resolver: formData.resolver,
                image: formData.image,
                category: formData.category,
            })

            console.log('Market created:', result)
            setSuccess(true)

            // Redirect to the new market page after 2 seconds
            setTimeout(() => {
                router.push(`/market/${result.marketId}`)
            }, 2000)
        } catch (err: any) {
            console.error('Error creating market:', err)
            setError(err.message || 'Failed to create market')
        }
    }

    return (
        <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
            <form
                onSubmit={handleSubmit}
                className="max-w-xl m-auto h-fit w-full">
                <div className="p-6">
                    <div>
                        <h1 className="mt-6 text-balance text-xl font-semibold">
                            <span className="text-muted-foreground">Create a new market</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Define the rules and parameters for your prediction market.
                        </p>
                    </div>

                    <hr className="mb-5 mt-6" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="question"
                                className="block text-sm font-medium">
                                Market Question
                            </Label>
                            <Textarea
                                required
                                name="question"
                                id="question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="e.g. Will ETH reach $5000 by December 2025?"
                                className="ring-foreground/15 border-transparent ring-1 min-h-[100px] resize-none rounded-none"
                            />
                            <p className="text-muted-foreground text-xs">
                                The question must be clear and resolvable.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="category"
                                className="block text-sm font-medium">
                                Category
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger className="w-full rounded-none border-transparent ring-1 ring-foreground/15">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                                    <SelectItem value="Politics">Politics</SelectItem>
                                    <SelectItem value="Sports">Sports</SelectItem>
                                    <SelectItem value="AI">AI</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Science">Science</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-muted-foreground text-xs">
                                Choose the most relevant category for your market.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="duration"
                                    className="block text-sm font-medium">
                                    Betting Duration
                                </Label>
                                <Select
                                    value={formData.duration}
                                    onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                                    <SelectTrigger className="w-full rounded-none border-transparent ring-1 ring-foreground/15">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="3600">1 Hour</SelectItem>
                                        <SelectItem value="86400">24 Hours</SelectItem>
                                        <SelectItem value="604800">7 Days</SelectItem>
                                        <SelectItem value="2592000">30 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="delay"
                                    className="block text-sm font-medium">
                                    Resolution Delay
                                </Label>
                                <Select
                                    value={formData.delay}
                                    onValueChange={(value) => setFormData({ ...formData, delay: value })}>
                                    <SelectTrigger className="w-full rounded-none border-transparent ring-1 ring-foreground/15">
                                        <SelectValue placeholder="Select delay" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="3600">1 Hour</SelectItem>
                                        <SelectItem value="86400">24 Hours</SelectItem>
                                        <SelectItem value="172800">48 Hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="resolver"
                                className="block text-sm font-medium">
                                Resolver Address
                            </Label>
                            <Input
                                type="text"
                                required
                                name="resolver"
                                id="resolver"
                                value={formData.resolver}
                                onChange={(e) => setFormData({ ...formData, resolver: e.target.value })}
                                placeholder="0x..."
                                className="ring-foreground/15 border-transparent ring-1 rounded-none font-mono"
                            />
                            <p className="text-muted-foreground text-xs">
                                The address responsible for resolving the market outcome.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="image"
                                className="block text-sm font-medium">
                                Image URL
                            </Label>
                            <Input
                                type="url"
                                required
                                name="image"
                                id="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="ring-foreground/15 border-transparent ring-1 rounded-none"
                            />
                            <p className="text-muted-foreground text-xs">
                                URL to an image representing this market (IPFS or standard HTTP).
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-500">Error</p>
                                    <p className="text-sm text-red-500/80">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-500">Success!</p>
                                    <p className="text-sm text-green-500/80">
                                        Market created successfully. Redirecting...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Wallet Connection Warning */}
                        {!isConnected && (
                            <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-500">Wallet Not Connected</p>
                                    <p className="text-sm text-orange-500/80">
                                        Please connect your wallet to create a market.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !isConnected}
                            className="w-full rounded-none"
                            size="lg">
                            {loading ? 'Creating Market...' : 'Create Market'}
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    )
}
