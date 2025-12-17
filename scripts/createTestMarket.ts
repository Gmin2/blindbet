import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // Get deployed contracts (FHEVM v0.9.1 deployment)
  const factoryAddress = "0xD3FcA2Bd814176e983667674ea1099d3b75c0bc7";
  const factory = await ethers.getContractAt("BlindBetFactory", factoryAddress, signer);

  console.log("\nCreating test market...");
  console.log("Factory address:", factoryAddress);
  console.log("Deployer:", signer.address);

  const params = {
    question: "Will Bitcoin reach $150,000 by end of 2025?",
    bettingDuration: 604800, // 7 days
    resolutionDelay: 86400, // 1 day
    resolver: signer.address,
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    category: "Cryptocurrency",
  };

  console.log("\nMarket parameters:");
  console.log("- Question:", params.question);
  console.log("- Betting duration:", params.bettingDuration, "seconds (7 days)");
  console.log("- Resolution delay:", params.resolutionDelay, "seconds (1 day)");
  console.log("- Resolver:", params.resolver);
  console.log("- Image:", params.image);
  console.log("- Category:", params.category);

  const tx = await factory.deployMarket(params);
  console.log("\nTransaction submitted:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt?.blockNumber);

  // Get the created market
  const marketCount = await factory.marketCount();
  const marketId = marketCount - 1n;
  const marketAddress = await factory.markets(marketId);

  console.log("\n✅ Market created successfully!");
  console.log("- Market ID:", marketId.toString());
  console.log("- Market address:", marketAddress);
  console.log("- Transaction hash:", receipt?.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
