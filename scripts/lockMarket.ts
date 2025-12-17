import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // Get contract addresses
  const factoryAddress = "0x94aB1b72d4636341fa1A9328cC26112c860Dcf99";

  // Get market ID from command line args
  const marketId = process.argv[2] ? parseInt(process.argv[2]) : 0;

  console.log("\n🔒 Locking Market");
  console.log("================");
  console.log("Market ID:", marketId);
  console.log("Signer:", signer.address);

  // Get factory and market contracts
  const factory = await ethers.getContractAt("BlindBetFactory", factoryAddress, signer);
  const marketAddress = await factory.markets(marketId);

  if (marketAddress === ethers.ZeroAddress) {
    throw new Error(`Market ${marketId} does not exist`);
  }

  console.log("Market Address:", marketAddress);

  const market = await ethers.getContractAt("BlindBetMarket", marketAddress, signer);

  // Get market info
  const marketData = await market.getMarket(0);
  console.log("\nMarket Info:");
  console.log("- Question:", marketData.question);
  console.log("- State:", ["Open", "Locked", "Resolving", "Resolved"][marketData.state]);
  console.log("- Betting Deadline:", new Date(Number(marketData.bettingDeadline) * 1000).toLocaleString());
  console.log("- Resolution Time:", new Date(Number(marketData.resolutionTime) * 1000).toLocaleString());

  // Check if market can be locked
  const now = Math.floor(Date.now() / 1000);
  const deadline = Number(marketData.bettingDeadline);

  if (marketData.state !== 0) {
    throw new Error("Market is not in Open state");
  }

  if (now < deadline) {
    const timeLeft = deadline - now;
    const hoursLeft = Math.floor(timeLeft / 3600);
    const minutesLeft = Math.floor((timeLeft % 3600) / 60);
    throw new Error(
      `Cannot lock market yet. Betting deadline is in ${hoursLeft}h ${minutesLeft}m`
    );
  }

  // Lock the market
  console.log("\n🔐 Locking market...");
  const tx = await market.lockMarket(0);
  console.log("Transaction:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Market locked successfully!");
  console.log("Block number:", receipt?.blockNumber);

  // Verify state changed
  const updatedMarketData = await market.getMarket(0);
  console.log("\nUpdated State:", ["Open", "Locked", "Resolving", "Resolved"][updatedMarketData.state]);

  console.log("\n✅ Done! Market is now locked. No more bets can be placed.");
  console.log("Next step: Wait until resolution time, then run resolveMarket.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
