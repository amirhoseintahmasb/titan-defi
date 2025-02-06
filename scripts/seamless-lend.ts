import { ethers } from "ethers";
import dotenv from "dotenv";
import wrappedTokenGatewayV3ABI from "../abi/baseWrappedTokenGatewayV3ABI.json"; //base
import { abi as poolAddressProviderAbi } from "@aave/core-v3/artifacts/contracts/protocol/configuration/PoolAddressesProvider.sol/PoolAddressesProvider.json";
import { abi as poolAbi } from "@aave/core-v3/artifacts/contracts/interfaces/IPool.sol/IPool.json";
import { abi as erc20Abi } from "@aave/core-v3/artifacts/contracts/dependencies/openzeppelin/contracts/ERC20.sol/ERC20.json";

dotenv.config({path:"../.env"});
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.BASE_PRIVATE_KEY!, provider);

// Deployment addresses on Base network
const swapRouterAddress = "0x2626664c2603336E57B271c5C0b26F421741e481";
const poolAddressProviderAddress = "0x0E02EB705be325407707662C6f6d3466E939f3a0";
const wrappedTokenGatewayV3Address =
  "0xaeeB3898edE6a6e86864688383E211132BAa1Af3";

// Token addresses based on seamless protocol UI
const wethAddress = "0x4200000000000000000000000000000000000006";
const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const cbETHAddress = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22";
const wstETH = "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452"; //**** CHECK UNISWAP POOL LIQUIDITY BEFORE SWAPPING THIS TOKEN ****
const daiAddress = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb";
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



// Supply the token in Seamless
async function supplyToken(tokenAmount: number, tokenAddress: string) {
  const poolProxyAddress = await poolAddressProviderContract.getPool();
  const poolContract = new ethers.Contract(poolProxyAddress, poolAbi, wallet);

  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const token = {
    address: tokenAddress,
    decimals: await tokenContract.decimals(),
    symbol: await tokenContract.symbol(),
  };
  const supplyAmount = ethers.utils.parseUnits(tokenAmount.toString(),token.decimals);

  // Approving Seamless pool contract
  console.log("=============================================================");
  const approveTx = await tokenContract.approve(poolProxyAddress, supplyAmount, {
    gasPrice: (await provider.getGasPrice()).mul(105).div(100),
  });

  console.log(`Approve transaction hash: ${approveTx.hash}`);
  const approveReceipt = await approveTx.wait();
  console.log(`Approve transaction confirmed in block ${approveReceipt.blockNumber}`);
  
  // Supplying token
  console.log("=============================================================");
  const supplyTx = await poolContract.supply(tokenAddress, supplyAmount, wallet.address, 0, {
    gasPrice: (await provider.getGasPrice()).mul(105).div(100),
  });
  console.log(`Supply transaction hash: ${supplyTx.hash}`);
  const supplyReceipt = await supplyTx.wait();
  console.log(`Supply transaction confirmed in block ${supplyReceipt.blockNumber}`);
  console.log(` ---- Supplied ${tokenAmount} ${token.symbol} on Seamless ----`);
  
}

// supply ETH in Seamless
async function supplyEth(amount: number) {
  const ethAmount = ethers.utils.parseEther(amount.toString());
  const poolProxyAddress = await poolAddressProviderContract.getPool();
  const tx = await wtGatewayContract.depositETH(poolProxyAddress, wallet.address, 0, {
    value: ethAmount,
    gasPrice: (await provider.getGasPrice()).mul(105).div(100),
  });
  console.log(`ETH supply transaction hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`ETH supply transaction confirmed in block ${receipt.blockNumber}`);
}

// Calls the right function base on supplying token being ETH or other tokens
async function supply(amount:number , tokenAddress:string) {
  if (tokenAddress === "ETH") {
    supplyEth(amount)
  } else {
    supplyToken(amount, tokenAddress)
  }
}


// Supply 0.000001 ETH in Seamless
//supply(0.000001,eth).catch(console.error);


