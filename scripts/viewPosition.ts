import { FhevmType } from "@fhevm/hardhat-plugin";
import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const { fhevm } = hre;
  const [signer] = await ethers.getSigners();

  // Initialize FHEVM CLI API for user decryption
  await fhevm.initializeCLIApi();

  // Get contract addresses (FHEVM v0.9.1 deployment)
  const factoryAddress = "0xD3FcA2Bd814176e983667674ea1099d3b75c0bc7";

  // Get market ID from command line args
  const marketId = process.argv[2] ? parseInt(process.argv[2]) : 0;

  console.log("\n👀 View Position");
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

  // Get market info
  const marketData = await market.getMarket(0);
  console.log("\nMarket Info:");
  console.log("- Question:", marketData.question);
  console.log("- State:", ["Open", "Locked", "Resolving", "Resolved"][marketData.state]);

  // Get encrypted position
  console.log("\n🔐 Getting encrypted position...");
  const [yesAmountHandle, noAmountHandle, existsHandle] = await market.getEncryptedPosition(0, signer.address);

  console.log("Encrypted Position:");
  console.log("- Yes Amount Handle:", yesAmountHandle);
  console.log("- No Amount Handle:", noAmountHandle);
  console.log("- Exists Handle:", existsHandle);

  // Check if position exists by checking if handles are not zero
  console.log("\n🔓 Decrypting position...");
  console.log("Checking if position exists...");

  const hasPosition = yesAmountHandle !== ethers.ZeroHash || noAmountHandle !== ethers.ZeroHash;

  if (!hasPosition) {
    console.log("\n📊 No position found in this market.");
    console.log("✅ Done!");
    return;
  }

  console.log("✅ Position exists! Decrypting amounts...");

  let yesAmount = 0n;
  let noAmount = 0n;

  // Decrypt yes amount if handle is not zero
  if (yesAmountHandle !== ethers.ZeroHash) {
    console.log("Decrypting Yes amount...");
    yesAmount = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      yesAmountHandle,
      marketAddress,
      signer
    );
  }

  // Decrypt no amount if handle is not zero
  if (noAmountHandle !== ethers.ZeroHash) {
    console.log("Decrypting No amount...");
    noAmount = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      noAmountHandle,
      marketAddress,
      signer
    );
  }

  // Display results
  console.log("\n📊 Decrypted Position:");
  console.log("================");

  const yesAmountFormatted = ethers.formatUnits(yesAmount, 6);
  const noAmountFormatted = ethers.formatUnits(noAmount, 6);
  const totalBet = Number(yesAmountFormatted) + Number(noAmountFormatted);

  console.log("Yes Amount:", yesAmountFormatted, "cUSDC");
  console.log("No Amount:", noAmountFormatted, "cUSDC");
  console.log("Total Bet:", totalBet.toFixed(6), "cUSDC");

  if (Number(yesAmountFormatted) > 0) {
    console.log("\n💚 You bet YES with", yesAmountFormatted, "cUSDC");
  }
  if (Number(noAmountFormatted) > 0) {
    console.log("\n❤️ You bet NO with", noAmountFormatted, "cUSDC");
  }

  console.log("\n✅ Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
