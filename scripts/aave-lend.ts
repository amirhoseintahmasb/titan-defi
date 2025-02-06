import { ethers } from "ethers";
import dotenv from "dotenv";
import wrappedTokenGatewayV3ABI from "../abi/baseWrappedTokenGatewayV3ABI.json"; //base
import { abi as poolAddressProviderAbi } from "@aave/core-v3/artifacts/contracts/protocol/configuration/PoolAddressesProvider.sol/PoolAddressesProvider.json";
import { abi as poolAbi } from "@aave/core-v3/artifacts/contracts/interfaces/IPool.sol/IPool.json";
import { abi as erc20Abi } from "@aave/core-v3/artifacts/contracts/dependencies/openzeppelin/contracts/ERC20.sol/ERC20.json";

dotenv.config({ path: "../.env" });
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.BASE_PRIVATE_KEY!, provider);

// Deployment addresses on Base network
const poolAddressProviderAddress = "0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D";
const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const wrappedTokenGatewayV3Address =
  "0x8be473dCfA93132658821E67CbEB684ec8Ea2E74";
const eth = "ETH";

// Contract objects
const poolAddressProviderContract = new ethers.Contract(
  poolAddressProviderAddress,
  poolAddressProviderAbi,
  wallet
);
const wtGatewayContract = new ethers.Contract(
  wrappedTokenGatewayV3Address,
  wrappedTokenGatewayV3ABI,
  wallet
);

// Supply the token in Aave
async function supplyToken(tokenAmount: number, tokenAddress: string) {
  const poolProxyAddress = await poolAddressProviderContract.getPool();
  const poolContract = new ethers.Contract(poolProxyAddress, poolAbi, wallet);

  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const token = {
    address: tokenAddress,
    decimals: await tokenContract.decimals(),
    symbol: await tokenContract.symbol(),
  };
  const supplyAmount = ethers.utils.parseUnits(
    tokenAmount.toString(),
    token.decimals
  );

  // Approving Aave pool contract
  console.log("=============================================================");
  const approveTx = await tokenContract.approve(
    poolProxyAddress,
    supplyAmount,
    {
      gasPrice: (await provider.getGasPrice()).mul(105).div(100),
    }
  );

  console.log(`Approve transaction hash: ${approveTx.hash}`);
  const approveReceipt = await approveTx.wait();
  console.log(
    `Approve transaction confirmed in block ${approveReceipt.blockNumber}`
  );

  // Supplying token
  console.log("=============================================================");
  const supplyTx = await poolContract.supply(
    tokenAddress,
    supplyAmount,
    wallet.address,
    0,
    {
      gasPrice: (await provider.getGasPrice()).mul(105).div(100),
    }
  );
  console.log(`Supply transaction hash: ${supplyTx.hash}`);
  const supplyReceipt = await supplyTx.wait();
  console.log(
    `Supply transaction confirmed in block ${supplyReceipt.blockNumber}`
  );
  console.log(` ---- Supplied ${tokenAmount} ${token.symbol} on Aave ----`);
}

// supply ETH in Aave
async function supplyEth(amount: number) {
  const ethAmount = ethers.utils.parseEther(amount.toString());
  const poolProxyAddress = await poolAddressProviderContract.getPool();
  const tx = await wtGatewayContract.depositETH(
    poolProxyAddress,
    wallet.address,
    0,
    {
      value: ethAmount,
      gasPrice: (await provider.getGasPrice()).mul(105).div(100),
    }
  );
  console.log(`ETH supply transaction hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(
    `ETH supply transaction confirmed in block ${receipt.blockNumber}`
  );
}

// Calls the right function base on supplying token being ETH or other tokens
async function supply(amount: number, tokenAddress: string) {
  if (tokenAddress === "ETH") {
    supplyEth(amount);
  } else {
    supplyToken(amount, tokenAddress);
  }
}

// Supply 0.000001 ETH in Aave
//supply(0.000001,eth).catch(console.error);
