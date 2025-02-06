import { ethers } from "ethers";
import dotenv from "dotenv";
import SwapRouterABI from "../abi/baseRouterABI.json";// Router ABI for base
import { abi as erc20Abi } from "../abi/ERC20ABI.json";

dotenv.config({path:"../.env"});
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.BASE_PRIVATE_KEY!, provider);

// Deployment addresses on Base network
const swapRouterAddress = "0x2626664c2603336E57B271c5C0b26F421741e481";
const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const wethAddress = "0x4200000000000000000000000000000000000006";

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

// swaps 0.0001 ETH for USDC
//swapETHForToken(0.0001, usdcAddress);




