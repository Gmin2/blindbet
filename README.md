# BlindBet

A fully confidential prediction market platform built on Zama's fhEVM, enabling truly private betting where positions,
amounts, and outcomes remain encrypted until settlement.

## What Makes BlindBet Different

### Privacy-First Architecture

Unlike traditional prediction markets where all bets are publicly visible, BlindBet leverages Fully Homomorphic
Encryption (FHE) to ensure:

- **Hidden bet amounts**: No one can see how much you're wagering
- **Private positions**: Your Yes/No stance remains encrypted
- **Confidential liquidity pools**: Total pool sizes are hidden, preventing market manipulation
- **Front-running protection**: Encrypted order flow eliminates MEV attacks
- **Selective disclosure**: You control who sees your positions and when

### Traditional Prediction Markets vs BlindBet

| Feature             | Traditional Markets   | BlindBet             |
| ------------------- | --------------------- | -------------------- |
| Bet visibility      | Public                | Encrypted            |
| Position tracking   | On-chain, transparent | FHE-encrypted        |
| Market manipulation | Vulnerable to whales  | Protected by privacy |
| Front-running risk  | High                  | Eliminated           |
| Privacy             | None                  | Complete             |

## Key Features

### For Users

- **Create prediction markets** on any binary outcome
- **Place encrypted bets** with full privacy guarantees
- **View your positions** through secure decryption
- **Track transaction history** across all markets
- **Claim winnings** after market resolution

### For Developers

- **fhEVM smart contracts** with confidential state management
- **Dual-signature pattern** for secure token transfers
- **ACL permission system** for granular access control
- **Decryption oracle integration** for settlement
- **Server-side caching** to optimize RPC usage

## Technical Architecture

### Smart Contracts

```
contracts/
├── core/
│   ├── BlindBetFactory.sol      # Market deployment factory
│   └── BlindBetMarket.sol       # Core market logic
├── tokens/
│   ├── ConfidentialERC20.sol    # FHE token base
│   └── ConfidentialUSDC.sol     # Payment token
├── libraries/
│   ├── MarketLib.sol            # Market state management
│   ├── PayoutCalculator.sol     # Winner calculations
│   └── FeeManager.sol           # Fee handling
├── abstract/
│   └── MarketBase.sol           # Base functionality
└── interfaces/
    ├── IBlindBetMarket.sol
    ├── IConfidentialERC20.sol
    └── IBlindBetFactory.sol
```

### Frontend Application

```
app/frontend/
├── app/
│   ├── (marketing)/             # Landing pages
│   ├── markets/                 # Market browsing
│   ├── market/[id]/             # Market details
│   ├── create/                  # Market creation
│   ├── portfolio/               # User dashboard
│   └── api/                     # Backend API routes
├── components/
│   ├── market/                  # Market components
│   ├── ui/                      # UI primitives
│   └── wallet-connect.tsx       # Wallet integration
├── hooks/
│   ├── useMarkets.ts
│   ├── usePlaceBet.ts
│   ├── useUserPositions.ts
│   └── useTransactionHistory.ts
└── lib/
    ├── contracts.ts             # Contract ABIs & addresses
    └── const.ts                 # Configuration
```

## Technology Stack

### Blockchain & Encryption

- **fhEVM**: Zama's Fully Homomorphic Encryption Virtual Machine
- **Solidity**: Smart contract development
- **Hardhat**: Development environment and testing
- **Ethers.js v6**: Blockchain interaction

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: UI component library

### Infrastructure

- **Zama Sepolia Testnet**: Deployment network
- **Server-side caching**: Optimized RPC usage
- **Rate limit handling**: Graceful degradation

## Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/Gmin2/blindbet.git
cd blindbet
```

2. Install dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd app/frontend
npm install
```

3. Configure environment variables

```bash
# Set Hardhat configuration variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY

# Frontend environment (.env.local in app/frontend)
NEXT_PUBLIC_CHAIN_ID=8009
NEXT_PUBLIC_RPC_URL=https://sepolia.zama.network
```

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Zama Sepolia
npx hardhat deploy --network sepolia
```

### Frontend Development

```bash
cd app/frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Smart Contract Overview

### BlindBetMarket.sol

Core market functionality with FHE operations:

```solidity
// Place encrypted bet
function placeBet(
  uint256 marketId,
  externalEuint64 encryptedAmount,
  externalEbool encryptedOutcome,
  bytes calldata inputProof
) external;

// View encrypted position
function getEncryptedPosition(
  uint256 marketId,
  address user
) external view returns (euint64 yesAmount, euint64 noAmount, ebool hasPosition);

// Claim winnings after resolution
function claimWinnings(uint256 marketId) external;
```

### ConfidentialERC20.sol

FHE-enabled token with dual-signature pattern:

```solidity
// For user-initiated transfers (fresh encrypted inputs)
function transfer(address to, externalEuint64 encryptedAmount, bytes calldata inputProof) external returns (bool);

// For contract-to-contract transfers (existing encrypted values)
function transferEncrypted(address to, euint64 amount) external returns (bool);
```

## API Routes

### Server-Side Endpoints

- **GET /api/markets** - Fetch all markets with caching
- **GET /api/market/[id]** - Get specific market details
- **GET /api/transactions?address=0x...** - User transaction history
- **GET /api/positions?address=0x...** - User market positions

All endpoints implement:

- 10-minute server-side caching
- Rate limit protection
- Graceful error handling

## Key Innovations

### 1. Confidential State Management

All sensitive data stored as encrypted types:

```solidity
struct Position {
  euint64 yesAmount; // Encrypted
  euint64 noAmount; // Encrypted
  ebool hasPosition; // Encrypted
  bool claimed; // Public (safe after resolution)
}
```

### 2. Balance Verification Pattern

Handles silent failures in encrypted transfers:

```solidity
euint64 balanceBefore = token.balanceOf(address(this));
token.transferFromEncrypted(msg.sender, address(this), amount);
euint64 balanceAfter = token.balanceOf(address(this));
euint64 actualAmount = FHE.sub(balanceAfter, balanceBefore);
```

### 3. Conditional Logic Without Branching

Uses FHE.select for encrypted conditionals:

```solidity
position.yesAmount = FHE.select(
    outcome,
    FHE.add(position.yesAmount, actualAmount),
    position.yesAmount
);
```

### 4. ACL Permission Management

Granular access control for encrypted data:

```solidity
FHE.allowThis(encryptedValue);              // Contract access
FHE.allow(encryptedValue, user);             // User access
FHE.allowTransient(amount, address(other));  // Temporary access
```

## Testing

### Smart Contract Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/core/BlindBetMarket.test.ts

# Run with gas reporting
REPORT_GAS=true npm test
```

Test coverage:

- 197 passing tests
- 6 pending (FHEVM plugin limitations)
- 0 failing tests

### Test Categories

- Token operations
- Market creation and validation
- Betting functionality
- Market locking and resolution
- Claims and payouts
- Factory operations
- Fee management
- Security edge cases
- Full integration flows

## Security Considerations

### Smart Contract Security

- ReentrancyGuard on all state-changing functions
- Custom errors for gas optimization
- Input validation at all entry points
- ACL permission verification
- Silent failure handling for encrypted transfers

### FHE-Specific Security

- No branching on encrypted values
- Balance verification after transfers
- Proper ACL permission management
- Request ID validation in oracle callbacks
- Signature verification for decryption

## Deployment

### Contract Addresses (Zama Sepolia)

```
BlindBetFactory: 0xd3fca2bd814176e983667674ea1099d3b75c0bc7
ConfidentialUSDC: 0x8af03bccc2994e191c7aef30a8ca90c47f0e1e8d
```

### Verification

Contracts verified on Zama Sepolia Explorer:

- Factory: [View on Explorer](https://sepolia.explorer.zama.ai/address/0xd3fca2bd814176e983667674ea1099d3b75c0bc7)
- Token: [View on Explorer](https://sepolia.explorer.zama.ai/address/0x8af03bccc2994e191c7aef30a8ca90c47f0e1e8d)

## Roadmap

### Phase 1: Core Functionality (Complete)

- Basic market creation and betting
- Encrypted position tracking
- Market resolution and claims
- Frontend integration

### Phase 2: Enhanced Features (In Progress)

- Automated Market Maker (AMM)
- Liquidity provision
- Partial position closing
- Advanced analytics

### Phase 3: Advanced Privacy (Planned)

- Multi-outcome markets
- Conditional betting
- Reputation system
- Order book system

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

## Contact

- **GitHub**: [Gmin2/blindbet](https://github.com/Gmin2/blindbet)
- **X**: [@Min2_gg](https://x.com/Min2_gg)
- **LinkedIn**: [mintu-gogoi](https://linkedin.com/in/mintu-gogoi)

## Documentation

For detailed documentation, see:

- [Smart Contract Documentation](./SMART_CONTRACT_SUMMARY.md)
- [Frontend Development Guide](./FRONTEND_DEVELOPMENT_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Acknowledgments

- **Zama** for the fhEVM technology
- **Hardhat** for the development environment
- **Next.js** team for the excellent framework
- **shadcn/ui** for the beautiful components

---

Built with privacy at the core. Powered by Zama fhEVM.
