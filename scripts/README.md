# BlindBet Scripts

Scripts for interacting with BlindBet prediction markets on Sepolia testnet.

## Prerequisites

```bash
# Install dependencies
npm install
# or
pnpm install
```

## Contract Addresses (Sepolia)

- **Factory**: `0x94aB1b72d4636341fa1A9328cC26112c860Dcf99`
- **Token (cUSDC)**: `0x0B1451FdA80b818b8B92E1E5802A3bc1511Dd4DB`
- **Test Market**: `0x0e2d0C6F735B0859331d6018f0c99EF91e78702D`

## Scripts

### 1. Create Market

Create a new prediction market.

```bash
npx hardhat run scripts/createTestMarket.ts --network sepolia
```

**Output**: Market ID and address

---

### 2. Place Bet

Place an encrypted bet on a market.

```bash
npx hardhat run scripts/placeBet.ts --network sepolia -- <marketId> <amount> <outcome>
```

**Parameters**:
- `marketId` - Market ID (default: 0)
- `amount` - Bet amount in cUSDC (default: 100)
- `outcome` - "yes" or "no" (default: yes)

**Examples**:
```bash
# Bet 100 cUSDC on YES for market 0
npx hardhat run scripts/placeBet.ts --network sepolia

# Bet 250 cUSDC on YES for market 1
npx hardhat run scripts/placeBet.ts --network sepolia -- 1 250 yes

# Bet 500 cUSDC on NO for market 0
npx hardhat run scripts/placeBet.ts --network sepolia -- 0 500 no
```

**What it does**:
1. ✅ Encrypts your bet amount using FHE
2. ✅ Encrypts your outcome (Yes/No)
3. ✅ Approves cUSDC spending
4. ✅ Places the encrypted bet on-chain
5. ✅ Shows your encrypted position handles

---

### 3. View Position

Decrypt and view your position in a market.

```bash
npx hardhat run scripts/viewPosition.ts --network sepolia -- <marketId>
```

**Parameters**:
- `marketId` - Market ID (default: 0)

**Examples**:
```bash
# View position in market 0
npx hardhat run scripts/viewPosition.ts --network sepolia

# View position in market 1
npx hardhat run scripts/viewPosition.ts --network sepolia -- 1
```

**What it does**:
1. ✅ Fetches your encrypted position
2. ✅ Decrypts the position using FHE
3. ✅ Shows your Yes and No bet amounts
4. ✅ Displays total bet amount

---

### 4. Lock Market

Lock a market after betting deadline (no more bets allowed).

```bash
npx hardhat run scripts/lockMarket.ts --network sepolia -- <marketId>
```

**Parameters**:
- `marketId` - Market ID (default: 0)

**Examples**:
```bash
# Lock market 0
npx hardhat run scripts/lockMarket.ts --network sepolia

# Lock market 1
npx hardhat run scripts/lockMarket.ts --network sepolia -- 1
```

**Requirements**:
- ⏰ Betting deadline must have passed
- 📊 Market must be in "Open" state

**What it does**:
1. ✅ Checks if deadline has passed
2. ✅ Locks the market
3. ✅ Prevents any new bets
4. ✅ Prepares market for resolution

---

### 5. Resolve Market

Resolve a market with the winning outcome.

```bash
npx hardhat run scripts/resolveMarket.ts --network sepolia -- <marketId> <outcome>
```

**Parameters**:
- `marketId` - Market ID (default: 0)
- `outcome` - "yes", "no", or "invalid" (default: yes)

**Examples**:
```bash
# Resolve market 0 as YES
npx hardhat run scripts/resolveMarket.ts --network sepolia -- 0 yes

# Resolve market 1 as NO
npx hardhat run scripts/resolveMarket.ts --network sepolia -- 1 no

# Mark market 2 as INVALID (refund all bets)
npx hardhat run scripts/resolveMarket.ts --network sepolia -- 2 invalid
```

**Requirements**:
- 🔒 Market must be in "Locked" state
- ⏰ Resolution time must have passed
- 👤 Caller should be the designated resolver

**What it does**:
1. ✅ Checks if resolution time has passed
2. ✅ Sets the winning outcome
3. ✅ Changes market state to "Resolved"
4. ✅ Enables winners to claim winnings

---

### 6. Claim Winnings

Claim your winnings from a resolved market.

```bash
npx hardhat run scripts/claimWinnings.ts --network sepolia -- <marketId>
```

**Parameters**:
- `marketId` - Market ID (default: 0)

**Examples**:
```bash
# Claim winnings from market 0
npx hardhat run scripts/claimWinnings.ts --network sepolia

# Claim winnings from market 1
npx hardhat run scripts/claimWinnings.ts --network sepolia -- 1
```

**Requirements**:
- ✅ Market must be resolved
- 💰 You must have a winning position
- 🚫 You must not have already claimed

**What it does**:
1. ✅ Calculates your encrypted payout
2. ✅ Transfers cUSDC to your wallet (encrypted)
3. ✅ Marks your position as claimed
4. ✅ Emits WinningsClaimed event

---

## Complete Workflow Example

Here's a complete end-to-end workflow:

```bash
# Step 1: Create a test market (7 days betting, 1 day resolution delay)
npx hardhat run scripts/createTestMarket.ts --network sepolia
# Output: Market ID: 0, Address: 0x...

# Step 2: Place bets from different accounts
npx hardhat run scripts/placeBet.ts --network sepolia -- 0 100 yes
npx hardhat run scripts/placeBet.ts --network sepolia -- 0 200 no

# Step 3: View your position (decrypted)
npx hardhat run scripts/viewPosition.ts --network sepolia -- 0
# Output: Yes: 100 cUSDC, No: 200 cUSDC

# Step 4: Wait for betting deadline, then lock market
# (After 7 days)
npx hardhat run scripts/lockMarket.ts --network sepolia -- 0

# Step 5: Wait for resolution time, then resolve market
# (After 1 more day)
npx hardhat run scripts/resolveMarket.ts --network sepolia -- 0 yes

# Step 6: Claim your winnings if you won
npx hardhat run scripts/claimWinnings.ts --network sepolia -- 0
```

---

## Testing Workflow (Fast)

For quick testing, create a market with short durations:

1. **Modify createTestMarket.ts**:
   ```typescript
   const params = {
     question: "Test market?",
     bettingDuration: 60, // 1 minute
     resolutionDelay: 60, // 1 minute
     resolver: signer.address,
     image: "https://example.com/image.jpg",
     category: "Test",
   };
   ```

2. **Run the workflow**:
   ```bash
   # Create market
   npx hardhat run scripts/createTestMarket.ts --network sepolia

   # Place bets immediately
   npx hardhat run scripts/placeBet.ts --network sepolia -- 0 100 yes

   # Wait 1 minute, then lock
   npx hardhat run scripts/lockMarket.ts --network sepolia -- 0

   # Wait 1 more minute, then resolve
   npx hardhat run scripts/resolveMarket.ts --network sepolia -- 0 yes

   # Claim winnings
   npx hardhat run scripts/claimWinnings.ts --network sepolia -- 0
   ```

---

## Troubleshooting

### "Market is not open for betting"
- Market has been locked or resolved
- Check market state with `getMarket()`

### "Cannot lock market yet"
- Betting deadline hasn't passed yet
- Wait until the deadline time

### "Cannot resolve yet"
- Resolution time hasn't passed yet
- Wait until resolution time

### "You have already claimed your winnings"
- You can only claim once per market
- Check your position status

### "Market is not resolved yet"
- Wait for market to be resolved first
- Run `resolveMarket.ts` if you're the resolver

---

## Privacy Features

All bet amounts and outcomes are **fully encrypted** using Zama's FHE:

- ✅ Your bet amount is never visible to others
- ✅ Your bet outcome (Yes/No) is hidden on-chain
- ✅ Total market volume is encrypted until resolution
- ✅ Only you can decrypt your own position
- ✅ Prevents front-running and whale manipulation

---

## Network Configuration

**Sepolia Testnet**:
- Chain ID: `11155111`
- RPC URL: `https://sepolia.infura.io/v3/d18cc4856e3448e1a6c074506290a7eb`
- FHE Gateway: `https://gateway.sepolia.zama.ai`

---

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- View contract code in [contracts/](../contracts/)
- Check test examples in [test/](../test/)
