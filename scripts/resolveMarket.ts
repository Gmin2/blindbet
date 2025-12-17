import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // Get contract addresses
  const factoryAddress = "0x94aB1b72d4636341fa1A9328cC26112c860Dcf99";

  // Get market ID and outcome from command line args
  const marketId = process.argv[2] ? parseInt(process.argv[2]) : 0;
  const outcomeStr = process.argv[3] ? process.argv[3].toLowerCase() : "yes";

  // Outcome enum: 0 = NotSet, 1 = Yes, 2 = No, 3 = Invalid
  let outcome: number;
  if (outcomeStr === "yes") {
    outcome = 1;
  } else if (outcomeStr === "no") {
    outcome = 2;
  } else if (outcomeStr === "invalid") {
    outcome = 3;
  } else {
    throw new Error("Invalid outcome. Use: yes, no, or invalid");
  }

  console.log("\n⚖️ Resolving Market");
  console.log("================");
  console.log("Market ID:", marketId);
  console.log("Outcome:", ["NotSet", "Yes", "No", "Invalid"][outcome]);
  console.log("Resolver:", signer.address);

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
  console.log("- Creator:", marketData.creator);
  console.log("- Resolver:", marketData.resolver);
  console.log("- Betting Deadline:", new Date(Number(marketData.bettingDeadline) * 1000).toLocaleString());
  console.log("- Resolution Time:", new Date(Number(marketData.resolutionTime) * 1000).toLocaleString());

  // Check if signer is authorized
  if (marketData.resolver !== signer.address) {
    console.log("\n⚠️ Warning: You are not the designated resolver");
    console.log("Designated resolver:", marketData.resolver);
    console.log("Your address:", signer.address);
  }

  // Check if market is locked
  if (marketData.state !== 1) {
    throw new Error("Market must be in Locked state to resolve");
  }

  // Check if resolution time has passed
  const now = Math.floor(Date.now() / 1000);
  const resolutionTime = Number(marketData.resolutionTime);

  if (now < resolutionTime) {
    const timeLeft = resolutionTime - now;
    const hoursLeft = Math.floor(timeLeft / 3600);
    const minutesLeft = Math.floor((timeLeft % 3600) / 60);
    throw new Error(
      `Cannot resolve yet. Resolution time is in ${hoursLeft}h ${minutesLeft}m`
    );
  }

  // Resolve the market
  console.log("\n🎯 Resolving market with outcome:", ["NotSet", "Yes", "No", "Invalid"][outcome]);
  const tx = await market.resolveMarket(0, outcome);
  console.log("Transaction:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Market resolved successfully!");
  console.log("Block number:", receipt?.blockNumber);

  // Verify state changed
  const updatedMarketData = await market.getMarket(0);
  console.log("\nUpdated Market Info:");
  console.log("- State:", ["Open", "Locked", "Resolving", "Resolved"][updatedMarketData.state]);
  console.log("- Resolved Outcome:", ["NotSet", "Yes", "No", "Invalid"][updatedMarketData.resolvedOutcome]);

  console.log("\n✅ Done! Market is now resolved.");
  console.log("Winners can now claim their winnings using claimWinnings.ts");

  // Show outcome summary
  if (outcome === 1) {
    console.log("\n💚 YES bettors won!");
  } else if (outcome === 2) {
    console.log("\n❤️ NO bettors won!");
  } else if (outcome === 3) {
    console.log("\n⚪ Market marked as INVALID - all bets will be refunded");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
