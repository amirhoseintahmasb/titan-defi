import { ethers } from "ethers";
import dotenv from "dotenv";
import SwapRouterABI from "../abi/sepoliaRouterABI.json";// Router ABI for sepolia
import { abi as erc20Abi } from "../abi/ERC20ABI.json";

dotenv.config({path:"../../.env"});
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

// Deployment addresses on sepolia network
const swapRouterAddress = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
const wethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

// Contract objects
const swapRouter = new ethers.Contract(
  swapRouterAddress,
  SwapRouterABI,
  wallet
);

// Swap ETH for token using uniswapV3
async function swapETHForToken(swapAmount: number, tokenAddress: string) {

  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const token = {
    address: tokenAddress,
    decimals: await tokenContract.decimals(),
    symbol: await tokenContract.symbol(),
  };

  // Swap params
  const params = {
    tokenIn: wethAddress,
    tokenOut: token.address,
    fee: 3000,
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000 + 60 * 10), // 10 minutes
    amountIn: ethers.utils.parseEther(swapAmount.toString()),
    amountOutMinimum: 0, // No min
    sqrtPriceLimitX96: 0, // No limit
  };

  // Performing the swap
  console.log("=============================================================");
  const tx = await swapRouter.exactInputSingle(params, {
    value: ethers.utils.parseEther(swapAmount.toString()),
    gasPrice: (await provider.getGasPrice()).mul(105).div(100),
  });

  console.log(`Swap transaction hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Swap transaction confirmed in block ${receipt.blockNumber}`);

  // Calculating amountOut
  const logs = receipt.events.filter((e: any) => e.address === token.address);
  const amountOut = BigInt(parseInt(logs[0].data, 16));
  console.log(
    ` --- Swaped ${swapAmount} ETH for ${
      Number(amountOut) / 10 ** token.decimals
    } ${token.symbol} ----`
  );
  return amountOut;
}

// swaps 0.001 ETH for USDC
swapETHForToken(0.001, usdcAddress);





