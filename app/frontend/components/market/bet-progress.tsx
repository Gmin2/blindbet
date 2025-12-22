'use client'

import { CheckCircle2, Loader2, Circle } from 'lucide-react'

export type BetStep =
  | 'idle'
  | 'encrypting'
  | 'approving'
  | 'placing'
  | 'confirming'
  | 'complete'
  | 'error'

interface BetProgressProps {
  currentStep: BetStep
  error?: string | null
}

const steps = [
  { id: 'encrypting', label: 'Creating encrypted input', description: 'Encrypting bet data...' },
  { id: 'approving', label: 'Approving cUSDC', description: 'Approving token spending...' },
  { id: 'placing', label: 'Placing bet', description: 'Sending transaction...' },
  { id: 'confirming', label: 'Confirming transaction', description: 'Waiting for confirmation...' },
  { id: 'complete', label: 'Complete', description: 'Bet placed successfully!' },
]

export function BetProgress({ currentStep, error }: BetProgressProps) {
  if (currentStep === 'idle') return null

  const getStepState = (stepId: string): 'pending' | 'active' | 'complete' | 'error' => {
    if (currentStep === 'error') return 'error'

    const stepIndex = steps.findIndex(s => s.id === stepId)
    const currentIndex = steps.findIndex(s => s.id === currentStep)

    // If we're at 'complete', all steps including 'complete' should show as complete
    if (currentStep === 'complete' && stepIndex <= currentIndex) return 'complete'

    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="space-y-4 mt-6 p-4 border border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Transaction Progress</h3>
        {currentStep === 'complete' && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const state = getStepState(step.id)

          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {state === 'complete' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : state === 'active' ? (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                ) : state === 'error' ? (
                  <Circle className="h-4 w-4 text-red-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  state === 'complete' ? 'text-foreground' :
                  state === 'active' ? 'text-blue-500' :
                  state === 'error' ? 'text-red-500' :
                  'text-muted-foreground/50'
                }`}>
                  {step.label}
                </p>
                <p className={`text-xs ${
                  state === 'complete' ? 'text-muted-foreground' :
                  state === 'active' ? 'text-blue-500/70' :
                  state === 'error' ? 'text-red-500/70' :
                  'text-muted-foreground/30'
                }`}>
                  {state === 'active' ? step.description :
                   state === 'complete' ? '✓ Done' :
                   ''}
                </p>
              </div>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[1.6rem] mt-6 w-px h-6 bg-border/30" />
              )}
            </div>
          )
        })}
      </div>

      {/* Error Message */}
      {currentStep === 'error' && error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20">
          <p className="text-xs font-medium text-red-500">Error</p>
          <p className="text-xs text-red-500/80 mt-1">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {currentStep === 'complete' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20">
          <p className="text-xs font-medium text-green-500">Success!</p>
          <p className="text-xs text-green-500/80 mt-1">
            Your bet has been placed and is now encrypted on-chain
          </p>
        </div>
      )}
    </div>
  )
}
