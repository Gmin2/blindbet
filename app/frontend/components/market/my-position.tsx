'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff, TrendingUp, Lock } from 'lucide-react'
import { ethers, Contract, BrowserProvider } from 'ethers'
import { ABIS } from '@/lib/contracts'
import { useWallet } from '@/hooks/useWallet'
import { useFhevm } from '@/hooks/useFhevm'

interface MyPositionProps {
  marketId: number
  marketAddress: string
}

export function MyPosition({ marketId, marketAddress }: MyPositionProps) {
  const { isConnected, address } = useWallet()
  const { instance: fhevmInstance, initialize } = useFhevm()
  const [loading, setLoading] = useState(false)
  const [hasPosition, setHasPosition] = useState(false)
  const [decryptedPosition, setDecryptedPosition] = useState<{
    yesAmount: string
    noAmount: string
    outcome: 'yes' | 'no'
    totalBet: string
  } | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)

  // Check if user has a position (by checking encrypted handles)
  useEffect(() => {
    const checkPosition = async () => {
      if (!isConnected || !address) {
        setHasPosition(false)
        return
      }

      try {
        setLoading(true)
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const marketContract = new Contract(
          marketAddress,
          ABIS.market,
          signer
        )

        // Get encrypted position
        const [yesAmountHandle, noAmountHandle] = await marketContract.getEncryptedPosition(
          0, // Market uses internal ID 0
          address
        )

        // Check if handles are not zero (meaning position exists)
        const positionExists = yesAmountHandle !== ethers.ZeroHash || noAmountHandle !== ethers.ZeroHash
        setHasPosition(positionExists)
      } catch (error) {
        console.error('Error checking position:', error)
        setHasPosition(false)
      } finally {
        setLoading(false)
      }
    }

    checkPosition()
  }, [isConnected, address, marketAddress])

  const handleDecryptPosition = async () => {
    if (!isConnected || !address) return

    setIsDecrypting(true)

    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress() // Get checksummed address

      const marketContract = new Contract(
        marketAddress,
        ABIS.market,
        signer
      )

      // Get encrypted position handles (returns 3 values: yesAmount, noAmount, exists)
      const [yesAmountHandle, noAmountHandle, existsHandle] = await marketContract.getEncryptedPosition(
        0, // Market uses internal ID 0
        userAddress
      )

      console.log('[MyPosition] Encrypted handles:', {
        yesAmount: yesAmountHandle,
        noAmount: noAmountHandle,
        exists: existsHandle
      })

      // Initialize FHEVM if not already initialized
      let instance = fhevmInstance
      if (!instance) {
        console.log('[MyPosition] Initializing FHEVM...')
        instance = await initialize()
      }

      console.log('[MyPosition] Instance methods:', Object.keys(instance))

      // Generate keypair for user decryption
      console.log('[MyPosition] Generating keypair...')
      const { publicKey, privateKey } = instance.generateKeypair()
      console.log('[MyPosition] Keypair generated:', { publicKey: publicKey.substring(0, 20) + '...', privateKey: privateKey.substring(0, 20) + '...' })

      // Create EIP712 for signature with timestamp and validity
      console.log('[MyPosition] Creating EIP712 signature request...')
      console.log('[MyPosition] Market address:', marketAddress)
      console.log('[MyPosition] User address:', userAddress)
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const eip712 = instance.createEIP712(
        publicKey,
        [marketAddress],
        timestamp,
        "10" // Validity period in seconds
      )
      console.log('[MyPosition] EIP712 created:', { domain: eip712.domain, types: Object.keys(eip712.types) })

      // Sign the EIP712 message
      console.log('[MyPosition] Requesting user signature...')
      console.log('[MyPosition] EIP712 types:', eip712.types)
      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      )

      if (!signature) {
        throw new Error('Signature was cancelled or failed')
      }

      console.log('[MyPosition] Signature obtained:', signature.substring(0, 20) + '...')

      // Prepare handles to decrypt (only non-zero handles)
      const handlesToDecrypt = []
      const handleMap = { yesIndex: -1, noIndex: -1 }

      if (yesAmountHandle !== ethers.ZeroHash) {
        handleMap.yesIndex = handlesToDecrypt.length
        handlesToDecrypt.push({ handle: yesAmountHandle, contractAddress: marketAddress })
      }

      if (noAmountHandle !== ethers.ZeroHash) {
        handleMap.noIndex = handlesToDecrypt.length
        handlesToDecrypt.push({ handle: noAmountHandle, contractAddress: marketAddress })
      }

      console.log('[MyPosition] Handles to decrypt:', handlesToDecrypt)
      console.log('[MyPosition] Contract addresses:', [marketAddress])
      console.log('[MyPosition] User address (checksummed):', userAddress)

      // Decrypt all handles at once using userDecrypt
      console.log('[MyPosition] Calling userDecrypt...')
      const decryptedValues = await instance.userDecrypt(
        handlesToDecrypt,
        privateKey,
        publicKey,
        signature.replace('0x', ''),
        [marketAddress],
        userAddress,
        timestamp,
        "10" // Validity period in seconds
      )

      console.log('[MyPosition] Decrypted values:', decryptedValues)

      // Extract decrypted amounts
      let yesAmount = 0n
      let noAmount = 0n

      if (handleMap.yesIndex !== -1) {
        yesAmount = BigInt(decryptedValues[handlesToDecrypt[handleMap.yesIndex].handle])
        console.log('[MyPosition] Yes amount decrypted:', yesAmount)
      }

      if (handleMap.noIndex !== -1) {
        noAmount = BigInt(decryptedValues[handlesToDecrypt[handleMap.noIndex].handle])
        console.log('[MyPosition] No amount decrypted:', noAmount)
      }

      // Format and set the decrypted position
      const yesAmountFormatted = ethers.formatUnits(yesAmount, 6)
      const noAmountFormatted = ethers.formatUnits(noAmount, 6)
      const totalBet = (Number(yesAmountFormatted) + Number(noAmountFormatted)).toFixed(2)

      const outcome: 'yes' | 'no' = Number(yesAmountFormatted) > Number(noAmountFormatted) ? 'yes' : 'no'

      console.log('[MyPosition] Position decrypted:', {
        yesAmount: yesAmountFormatted,
        noAmount: noAmountFormatted,
        totalBet,
        outcome
      })

      setDecryptedPosition({
        yesAmount: yesAmountFormatted,
        noAmount: noAmountFormatted,
        outcome,
        totalBet
      })
    } catch (error) {
      console.error('[MyPosition] Error decrypting position:', error)
      // Show error to user
      alert(`Failed to decrypt position: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDecrypting(false)
    }
  }

  if (!isConnected) {
    return null
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking position...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasPosition) {
    return null
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Your Position</span>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!decryptedPosition ? (
          <>
            <div className="p-4 bg-muted/30 border border-border/30">
              <div className="flex items-start gap-3">
                <EyeOff className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Position Encrypted
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your bet is stored encrypted on-chain. Click below to decrypt and view your position.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDecryptPosition}
              disabled={isDecrypting}
              variant="outline"
              className="w-full rounded-none"
            >
              {isDecrypting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Decrypting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Decrypt Position
                </span>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Decrypted Position Display */}
            <div className="space-y-3">
              {/* Outcome Badge */}
              <div className="flex items-center justify-center py-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="text-center">
                  <p className="text-xs text-green-500/70 mb-1">Betting on</p>
                  <p className="text-2xl font-bold text-green-500">
                    {decryptedPosition.outcome.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Bet Details */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Yes Amount</span>
                  <span className="text-sm font-medium text-foreground">
                    {decryptedPosition.yesAmount} cUSDC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">No Amount</span>
                  <span className="text-sm font-medium text-foreground">
                    {decryptedPosition.noAmount} cUSDC
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/30">
                  <span className="text-sm font-semibold text-foreground">Total Bet</span>
                  <span className="text-sm font-bold text-foreground">
                    {decryptedPosition.totalBet} cUSDC
                  </span>
                </div>
              </div>

              {/* Potential Return (Placeholder) */}
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-500">Potential Return</p>
                  <p className="text-xs text-blue-500/70 mt-0.5">
                    Calculated after market resolution
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setDecryptedPosition(null)}
              variant="ghost"
              size="sm"
              className="w-full text-xs rounded-none"
            >
              <EyeOff className="h-3 w-3 mr-2" />
              Hide Position
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
