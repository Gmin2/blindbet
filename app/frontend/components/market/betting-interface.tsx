'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { usePlaceBet } from '@/hooks/usePlaceBet'
import { BetProgress } from './bet-progress'

interface BettingInterfaceProps {
    marketId: number
    marketAddress: string
}

export function BettingInterface({ marketId, marketAddress }: BettingInterfaceProps) {
    const [outcome, setOutcome] = useState<'yes' | 'no'>('yes')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const { isConnected, connect, balance } = useWallet()
    const { placeBet, loading: isPlacingBet, currentStep, error: betError } = usePlaceBet()

    const handlePlaceBet = async () => {
        setError(null)
        setSuccess(false)

        if (!isConnected) {
            connect()
            return
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount')
            return
        }

        try {
            const result = await placeBet({
                marketId,
                marketAddress,
                amount,
                outcome: outcome === 'yes',
            })

            console.log('Bet placed successfully:', result)
            setSuccess(true)
            setAmount('') // Clear input

            // Show success message for 3 seconds
            setTimeout(() => {
                setSuccess(false)
            }, 3000)
        } catch (error: any) {
            console.error('Error placing bet:', error)
            setError(error.message || 'Failed to place bet')
        }
    }

    const displayBalance = balance ? parseFloat(balance).toFixed(4) : '0.0000'

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-fit sticky top-24 rounded-none">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Place Bet</span>
                    {isConnected ? (
                        <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            {displayBalance} ETH
                        </span>
                    ) : (
                        <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Not connected
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="yes" onValueChange={(v) => setOutcome(v as 'yes' | 'no')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-none">
                        <TabsTrigger value="yes" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 rounded-none">Yes</TabsTrigger>
                        <TabsTrigger value="no" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 rounded-none">No</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount (cUSDC)</label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pr-16 text-lg font-medium rounded-none"
                            disabled={!isConnected}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs rounded-none"
                                onClick={() => setAmount('100')}
                                disabled={!isConnected}
                            >
                                100
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Your Bet</span>
                        <span className="font-medium text-foreground">
                            {amount || '0.00'} cUSDC
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Outcome</span>
                        <span className={`font-medium ${outcome === 'yes' ? 'text-green-500' : 'text-red-500'}`}>
                            {outcome.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Your bet amount and position will remain encrypted until market resolution
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-medium text-red-500">Error</p>
                            <p className="text-xs text-red-500/80">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-medium text-green-500">Success!</p>
                            <p className="text-xs text-green-500/80">Your bet has been placed successfully</p>
                        </div>
                    </div>
                )}

                <Button
                    onClick={handlePlaceBet}
                    disabled={!isConnected || isPlacingBet || !amount}
                    className={`w-full text-lg font-semibold h-12 rounded-none ${
                        outcome === 'yes'
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
                    }`}
                >
                    {!isConnected ? (
                        'Connect Wallet to Bet'
                    ) : isPlacingBet ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Placing Bet...
                        </span>
                    ) : (
                        `Buy ${outcome.toUpperCase()}`
                    )}
                </Button>

                {/* Step Progress Indicator */}
                <BetProgress currentStep={currentStep} error={betError} />
            </CardContent>
        </Card>
    )
}
