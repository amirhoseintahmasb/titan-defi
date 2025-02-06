import { Injectable } from '@nestjs/common';
import { FeeAmount, nearestUsableTick, Pool, Position } from "@uniswap/v3-sdk";
import { Token, WETH9 } from "@uniswap/sdk-core";
import * as dotenv from 'dotenv';

import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

import { ERC20, ROUTER } from "./abi";
import { BigNumberish, Contract, ethers } from 'ethers';
// import { expandTo18DecimalsBN, expandTo6DecimalsBN } from './shared/helpers'
import { Pair } from '@uniswap/v2-sdk'
import { RoutePlanner, CommandType } from './shared/planner'


dotenv.config();


const WETH = new Token(1, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether')
const USDC = new Token(1, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin')

const UniversalRouterV1_2 = "0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4"
const UniversalRouterV1_2_V2Support = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"
const UnsupportedProtocol = "0x9E18Efb3BE848940b0C92D300504Fb08C287FE85"


function encodePathExactInput(tokens: string[]) {
  return encodePath(tokens, new Array(tokens.length - 1).fill(FeeAmount.MEDIUM))
}

const FEE_SIZE = 3


// v3
export function encodePath(path: string[], fees: FeeAmount[]): string {
  if (path.length != fees.length + 1) {
    throw new Error('path/fee lengths do not match')
  }

  let encoded = '0x'
  for (let i = 0; i < fees.length; i++) {
    // 20 byte encoding of the address
    encoded += path[i].slice(2)
    // 3 byte encoding of the fee
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0')
  }
  // encode the final token
  encoded += path[path.length - 1].slice(2)

  return encoded.toLowerCase()
}

@Injectable()
export class UniswapService {
  chainId;
  provider;
  planner: RoutePlanner
  DEADLINE = 2000000000

  constructor() {
    this.chainId = process.env.CHAINID ? parseInt(process.env.CHAINID) : 1;
    this.provider = new ethers.JsonRpcProvider(process.env.PROVIDER);
    this.planner = new RoutePlanner()
  }


  public async QouteRequest(): Promise<object> {
    try {
      return {}
    } catch (error) {

    }
  }


// Function parameters could be adjusted based on whether you're doing a swap on V2 or V3, this is a simplified version
async swapTokens(
  tokenIn, // Address of the input token
  tokenOut, // Address of the output token
  amountIn, // Amount of the input token
  userAddress, // User's address performing the swap
  privateKey // Private key of the user for signing transactions
) {
  const signer = new ethers.Wallet(privateKey, this.provider);
  const router = new ethers.Contract(UniversalRouterV1_2, ROUTER, signer);

  // Example of a swap command, details such as path would depend on whether it's a V2 or V3 swap and should be encoded accordingly
  const path = [tokenIn, tokenOut]; // Simplified, real path encoding might be needed based on the swap
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time

  // This is a placeholder function call, adjust according to your actual router method for swapping
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    0,
    path,
    userAddress,
    deadline
  );

  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}


  // async swapETHtoERC20(
  //   private_key: string,
  //   recipient: string,
  //   value: number,) {

  //     const signer = new ethers.Wallet(
  //       private_key,
  //       this.provider,
  //     );
  //   const tokens = [WETH.address, USDC.address]
  //   const amountOutMin: BigNumberish = 0n

  //   this.planner.addCommand(CommandType.WRAP_ETH, [recipient, value])
  //   addV3ExactInTrades(this.planner, 1, amountOutMin, recipient, tokens, UniversalRouterV1_2)

  //   await this.executeRouter(this.planner, value)

  // }

  async  executeRouter(planner: RoutePlanner,router: any, value?: BigNumberish){
    const { commands, inputs } = planner

    const receipt = await (await router['execute(bytes,bytes[],uint256)'](commands, inputs, this.DEADLINE, { value })).wait()
    const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice)

  }

  public async swap(
    private_key: string,
    recipient: string,
    value: number,
  ) {

    // const minAmountOut = expandTo18DecimalsBN(0.001)
    const pairAddress = Pair.getAddress(USDC, WETH)

    console.log(pairAddress)
    this.planner.addCommand(CommandType.WRAP_ETH, [pairAddress, value])
    // amountIn of 0 because the weth is already in the pair
    this.planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
      recipient,
      0,
      0,
      [WETH.address, USDC.address],
      recipient,
    ])

    const { commands, inputs } = this.planner

    console.log(commands)

    const signer = new ethers.Wallet(
      private_key,
      this.provider,
    );
    const router = new ethers.Contract(
      UniversalRouterV1_2,
      ROUTER, // Use the abi property of the imported contract interface
      signer,
    ) as any;


    const receipt = await (await router.execute({ commands: "0x3593564c", inputs: "000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006614a51700000000000000000000000000000000000000000000000000000000000000040b000604000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000001c6bf5263400000000000000000000000000000000000000000000000000000000000001bf0ef00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b42000000000000000000000000000000000000060001f4833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000e9f2dcfdbb31149b02a520f8babd89227a0c6568000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000000000000000000000000000000000000000000001", deadline: this.DEADLINE }, { gasLimit: 5000000, value })).wait()

    // const receipt = await (await router['execute(bytes,bytes[],uint256)']("0x3593564c", inputs, this.DEADLINE, { gasLimit: 5000000, value })).wait()
    console.log(receipt)

  }

  addV3ExactInTrades = (
    planner: RoutePlanner,
    numTrades: number,
    amountOutMin: BigNumberish,
    recipient?: string,
    tokens: string[] = [USDC.address, WETH.address],
    tokenSource: boolean = SOURCE_MSG_SENDER
  ) => {
    const path = encodePathExactInput(tokens)
    for (let i = 0; i < numTrades; i++) {
      planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
        recipient ?? MSG_SENDER,
        amountIn,
        amountOutMin,
        path,
        tokenSource,
      ])
    }
  }
  // public async swap(
  //   private_key: string,
  //   recipient: string,
  //   amountIn: number,
  // ): Promise<object | undefined> {
  //   try {
  //     const signer = new ethers.Wallet(
  //       private_key,
  //       this.provider,
  //     );
  //     const router = new ethers.Contract(
  //       this.routerAddress,
  //       ROUTER, // Use the abi property of the imported contract interface
  //       signer,
  //     ) as any;

  //     const params = {
  //       commands: [0b,00,06,04]
  //       inputs: {
  //         tokenIn: this.weth,
  //         tokenOut: this.usdc,
  //         fee: 500,
  //         recipient,
  //         deadline: 1712237423, // 20 minutes deadline
  //         amountIn,
  //         amountOutMinimum: 0,
  //         sqrtPriceLimitX96: 0,
  //       },
  //       deadline:1831151
  //     };

  //     const tx = await router.execute(params, {
  //       gasLimit: 5000000,
  //     });

  //     console.log(`Transaction hash: ${tx.hash}`);

  //     const receipt = await tx.wait();
  //     console.log(`Transaction was mined in block ${receipt.blockNumber}`);

  //     return receipt;
  //   } catch (error) {
  //     console.error("Error occurred during swap:", error.message);
  //     return undefined;
  //   }
  // }


  async addLiquidityToPool(
    private_key: string,
    address: string,
    token0: string,
    token1: string,
    amountToken0: string,
    amountToken1: string
  ): Promise<object> {
    let signer = new ethers.Wallet(
      private_key,
      this.provider,
    );

    const token0Contract = new Contract(token0, ERC20, signer);
    const token1Contract = new Contract(token1, ERC20, signer);

    const nonfungiblePositionManager = new Contract(
      require("../data.json")["uniswapV3"]["nonfungiblePositionManager"],
      require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi,
      signer
    );

    const poolContract = new Contract(address, UniswapV3Pool.abi, signer);

    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    let sqrtPriceX96 = slot0[0];
    let tick = slot0[1];

    const pool = new Pool(
      new Token(
        this.chainId,
        token0,
        await (token0Contract.connect(signer) as any).decimals(),
        await (token0Contract.connect(signer) as any).symbol(),
        await (token0Contract.connect(signer) as any).name()
      ),
      new Token(
        this.chainId,
        token1,
        await (token1Contract.connect(signer) as any).decimals(),
        await (token1Contract.connect(signer) as any).symbol(),
        await (token1Contract.connect(signer) as any).name()
      ),
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );

    const position = Position.fromAmounts({
      pool,
      tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing * 2,
      tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing * 2,
      amount0: amountToken0,
      amount1: amountToken1,
      useFullPrecision: true,
    });

    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;

    let params = {
      token0,
      token1,
      fee: fee,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      amount0Desired: amount0Desired.toString(),
      amount1Desired: amount1Desired.toString(),
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const tx = await (nonfungiblePositionManager.connect(signer) as any).mint(params, { gasLimit: "5000000" });

    const receipt = await tx.wait();

    return receipt;
  }

}
