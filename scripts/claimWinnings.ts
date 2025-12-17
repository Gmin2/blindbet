import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // Get contract addresses
  const factoryAddress = "0x94aB1b72d4636341fa1A9328cC26112c860Dcf99";
  const tokenAddress = "0x0B1451FdA80b818b8B92E1E5802A3bc1511Dd4DB";

  // Get market ID from command line args
  const marketId = process.argv[2] ? parseInt(process.argv[2]) : 0;

  console.log("\n💰 Claiming Winnings");
  console.log("================");
  console.log("Market ID:", marketId);
  console.log("User:", signer.address);

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
  console.log("- Resolved Outcome:", ["NotSet", "Yes", "No", "Invalid"][marketData.resolvedOutcome]);

  // Check if market is resolved
  if (marketData.state !== 3) {
    throw new Error("Market is not resolved yet");
  }

  // Get user's position
  const position = await market.getEncryptedPosition(0, signer.address);
  console.log("\nYour Position (encrypted):");
  console.log("- Yes Amount Handle:", position.yesAmount);
  console.log("- No Amount Handle:", position.noAmount);
  console.log("- Has Position:", position.hasPosition);

  // Check if already claimed
  const userPosition = await market.positions(0, signer.address);
  if (userPosition.claimed) {
    throw new Error("You have already claimed your winnings");
  }

  // Get balance before claiming
  console.log("\n📊 Balance Check:");
  const balanceBefore = await token.balanceOf(signer.address);
  console.log("Balance Before (encrypted handle):", balanceBefore);

  // Claim winnings
  console.log("\n💸 Claiming winnings...");
  const tx = await market.claimWinnings(0);
  console.log("Transaction:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Claim successful!");
  console.log("Block number:", receipt?.blockNumber);

  // Get balance after claiming
  const balanceAfter = await token.balanceOf(signer.address);
  console.log("\nBalance After (encrypted handle):", balanceAfter);

  // Parse events to see payout
  const claimEvent = receipt?.logs
    ?.map((log: any) => {
      try {
        return market.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((event: any) => event && event.name === "WinningsClaimed");

  if (claimEvent) {
    console.log("\n🎉 Winnings Claimed Event:");
    console.log("- Market ID:", claimEvent.args.marketId.toString());
    console.log("- User:", claimEvent.args.user);
    console.log("- Payout Handle:", claimEvent.args.encryptedPayoutHandle);
  }

  console.log("\n✅ Done! Your encrypted balance has been updated.");
  console.log("\nNote: Balances are encrypted. To view your actual balance,");
  console.log("you would need to decrypt it using the FHE decryption process.");

  // Show outcome summary
  const outcome = marketData.resolvedOutcome;
  if (outcome === 1) {
    console.log("\n💚 Market resolved as YES");
  } else if (outcome === 2) {
    console.log("\n❤️ Market resolved as NO");
  } else if (outcome === 3) {
    console.log("\n⚪ Market was INVALID - your bet was refunded");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
