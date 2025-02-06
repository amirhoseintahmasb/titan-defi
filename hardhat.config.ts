import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    titanchain: {
      url: "https://titan-json-rpc.titanlab.io",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || "",
        process.env.OPERATOR_PRIVATE_KEY || "",
      ],
    },
    titanTestnet: {
      url: process.env.TITAN_TESTNET_RPC || "https://testnet-rpc.titanlabs.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1001,
      gasPrice: "auto",
    },
    titanMainnet: {
      url: process.env.TITAN_MAINNET_RPC || "https://rpc.titanlabs.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
