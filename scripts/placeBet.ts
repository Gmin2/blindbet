import { ethers } from "hardhat";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/node";

async function main() {
  const [signer] = await ethers.getSigners();

  // Get contract addresses (FHEVM v0.9.1 deployment)
  const factoryAddress = "0xD3FcA2Bd814176e983667674ea1099d3b75c0bc7";
  const tokenAddress = "0x5e40269e28bDc9171dF1554027608665CeeB7d3e";

  // Get market ID from environment or command line args
  const marketId = process.env.MARKET_ID ? parseInt(process.env.MARKET_ID) : (process.argv[2] ? parseInt(process.argv[2]) : 0);
  const betAmount = process.env.BET_AMOUNT || process.argv[3] || "50"; // Default 50 cUSDC
  const betOutcome = process.env.BET_OUTCOME ? process.env.BET_OUTCOME.toLowerCase() === "yes" : (process.argv[4] ? process.argv[4].toLowerCase() === "yes" : true); // Default Yes

  console.log("\n🎲 Placing Bet");
  console.log("================");
  console.log("Market ID:", marketId);
  console.log("Bet Amount:", betAmount, "cUSDC");
  console.log("Outcome:", betOutcome ? "YES" : "NO");
  console.log("Signer:", signer.address);

  // Get factory and market contracts
  const factory = await ethers.getContractAt("BlindBetFactory", factoryAddress, signer);
  const marketAddress = await factory.markets(marketId);

  if (marketAddress === ethers.ZeroAddress) {
    throw new Error(`Market ${marketId} does not exist`);
  }

  console.log("Market Address:", marketAddress);

  const market = await ethers.getContractAt("BlindBetMarket", marketAddress, signer);
  const token = await ethers.getContractAt("ConfidentialUSDC", tokenAddress, signer);

  // Get market info
  const marketData = await market.getMarket(0);
  console.log("\nMarket Info:");
  console.log("- Question:", marketData.question);
  console.log("- State:", ["Open", "Locked", "Resolving", "Resolved"][marketData.state]);
  console.log("- Betting Deadline:", new Date(Number(marketData.bettingDeadline) * 1000).toLocaleString());

  // Check if market is open (state should be 0)
  if (Number(marketData.state) !== 0) {
    throw new Error(`Market is not open for betting (current state: ${marketData.state})`);
  }

  // Initialize FHE instance using SepoliaConfig from @zama-fhe/relayer-sdk
  // As recommended by Zama: use the SDK and its public API exclusively
  console.log("\n🔐 Initializing FHE encryption...");
  const instance = await createInstance(SepoliaConfig);
  console.log("✅ FHE instance initialized");

  // Create encrypted input
  console.log("Creating encrypted input...");
  const input = instance.createEncryptedInput(marketAddress, signer.address);

  // Convert amount to smallest unit (6 decimals for cUSDC)
  const amountInSmallestUnit = ethers.parseUnits(betAmount, 6);

  input.add64(Number(amountInSmallestUnit)); // Encrypted amount
  input.addBool(betOutcome); // Encrypted outcome (true = Yes, false = No)

  const encryptedInput = await input.encrypt();

  console.log("✅ Input encrypted successfully");

  // Step 1: Approve token spending
  console.log("\n💰 Approving cUSDC spending...");

  // Create approval encrypted input
  const approvalInput = instance.createEncryptedInput(tokenAddress, signer.address);
  approvalInput.add64(Number(amountInSmallestUnit));
  const approvalEncrypted = await approvalInput.encrypt();

  const approveTx = await token.approve(
    marketAddress,
    approvalEncrypted.handles[0],
    approvalEncrypted.inputProof
  );
  console.log("Approval tx:", approveTx.hash);
  await approveTx.wait();
  console.log("✅ Approval confirmed");

  // Step 2: Place bet
  console.log("\n🎯 Placing bet...");
  const betTx = await market.placeBet(
    0, // Market uses internal ID 0
    encryptedInput.handles[0], // Encrypted amount
    encryptedInput.handles[1], // Encrypted outcome
    encryptedInput.inputProof
  );

  console.log("Bet tx:", betTx.hash);
  const receipt = await betTx.wait();
  console.log("✅ Bet placed successfully!");
  console.log("Block number:", receipt?.blockNumber);

  // Get position (encrypted)
  console.log("\n📊 Your Position (encrypted):");
  const position = await market.getEncryptedPosition(0, signer.address);
  console.log("- Yes Amount Handle:", position.yesAmount);
  console.log("- No Amount Handle:", position.noAmount);
  console.log("- Has Position:", position.hasPosition);

  console.log("\n✅ Done! Run viewPosition.ts to decrypt your position.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
