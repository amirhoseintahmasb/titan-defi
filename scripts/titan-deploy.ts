const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Titan testnet...");

  // Deploy TitanRouter
  const TitanRouter = await hre.ethers.getContractFactory("TitanRouter");
  const titanRouter = await TitanRouter.deploy(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 Router address on Titan
    "0x..." // WETH address on Titan
  );
  await titanRouter.waitForDeployment();
  console.log("TitanRouter deployed to:", await titanRouter.getAddress());

  // Deploy LiquidityManager
  const LiquidityManager = await hre.ethers.getContractFactory(
    "LiquidityManager"
  );
  const liquidityManager = await LiquidityManager.deploy(
    await titanRouter.getAddress()
  );
  await liquidityManager.waitForDeployment();
  console.log(
    "LiquidityManager deployed to:",
    await liquidityManager.getAddress()
  );

  // Verify contracts
  console.log("Verifying contracts...");
  try {
    await hre.run("verify:verify", {
      address: await titanRouter.getAddress(),
      constructorArguments: [
        "0x...", // Uniswap V3 Router address
        "0x...", // WETH address
      ],
    });

    await hre.run("verify:verify", {
      address: await liquidityManager.getAddress(),
      constructorArguments: [await titanRouter.getAddress()],
    });
  } catch (error) {
    console.error("Verification error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
