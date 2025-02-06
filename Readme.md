# 🌟 Titan Labs Integration Smart Contracts

Advanced DeFi integration contracts leveraging Uniswap v3 Universal Router for efficient token swapping and liquidity provision on Titan Chain.

## 📋 Features

- Universal Router Integration for optimal token swaps
- Advanced yield farming strategies
- Automated liquidity provision
- Gas-optimized contract interactions
- Multi-token support
- Emergency withdrawal functionality
- Access control and role management
- Pausable operations for security

## 🛠 Tech Stack

- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Uniswap V3 SDK
- Universal Router Protocol
- Chainlink Price Feeds

## 📦 Installation

# Clone the repository

git clone https://github.com/amirhoseintahmasb/titan-defi

# Install dependencies

npm install

# Copy environment file

cp .env.example .env

## ⚙️ Configuration

1. Configure your `.env` file:

I'll help you add this content to your README.md file. Here's how the changes should be applied:

```markdown:README.md
# 🌟 Titan Labs Integration Smart Contracts

Advanced DeFi integration contracts leveraging Uniswap v3 Universal Router for efficient token swapping and liquidity provision on Titan Chain.

## 📋 Features

- Universal Router Integration for optimal token swaps
- Advanced yield farming strategies
- Automated liquidity provision
- Gas-optimized contract interactions
- Multi-token support
- Emergency withdrawal functionality
- Access control and role management
- Pausable operations for security

## 🛠 Tech Stack

- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Uniswap V3 SDK
- Universal Router Protocol
- Chainlink Price Feeds

## 📦 Installation

# Clone the repository
git clone https://github.com/yourusername/titan-labs-integration

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

## ⚙️ Configuration

1. Configure your `.env` file:
```

PRIVATE_KEY=your_private_key
TITAN_TESTNET_RPC=https://testnet-rpc.titanlabs.xyz
TITAN_MAINNET_RPC=https://mainnet-rpc.titanlabs.xyz
ETHERSCAN_API_KEY=your_etherscan_api_key

````example.env

## 🚀 Deployment

### Testnet Deployment

```bash
# Deploy on Titan Testnet
npx hardhat run scripts/deploy.js --network titanTestnet

# Verify contract
npx hardhat verify --network titanTestnet DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"
````

### Mainnet Deployment

```bash
# Deploy on Titan Mainnet
npx hardhat run scripts/deploy.js --network titanMainnet

# Verify contract
npx hardhat verify --network titanMainnet DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"
```

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/TitanRouter.test.js

# Run coverage report
npx hardhat coverage
```

## 🔒 Security

- All contracts are thoroughly tested and audited
- Implements OpenZeppelin's security standards
- Emergency pause functionality
- Role-based access control
- Slippage protection mechanisms

// ... existing code ...

## 🌐 Titan Labs Network Details

### Titan Testnet

- **Network Name**: Titan Testnet
- **RPC URL**: https://testnet-rpc.titanlabs.xyz
- **Chain ID**: 1001
- **Currency Symbol**: tTITAN
- **Block Explorer**: https://testnet.titanscan.xyz

### Titan Mainnet

- **Network Name**: Titan
- **RPC URL**: https://rpc.titanlabs.xyz
- **Chain ID**: 1
- **Currency Symbol**: TITAN
- **Block Explorer**: https://titanscan.xyz

## 🔧 Network Configuration

### MetaMask Configuration for Testnet

1. Open MetaMask → Networks → Add Network
2. Fill in the following details:
   - Network Name: Titan Testnet
   - New RPC URL: https://testnet-rpc.titanlabs.xyz
   - Chain ID: 1001
   - Currency Symbol: tTITAN
   - Block Explorer URL: https://testnet.titanscan.xyz

### MetaMask Configuration for Mainnet

1. Open MetaMask → Networks → Add Network
2. Fill in the following details:
   - Network Name: Titan
   - New RPC URL: https://rpc.titanlabs.xyz
   - Chain ID: 1
   - Currency Symbol: TITAN
   - Block Explorer URL: https://titanscan.xyz

## 🚰 Getting Testnet Tokens

1. Visit the Titan Testnet Faucet: [https://faucet.titanlabs.xyz](https://faucet.titanlabs.xyz)
2. Connect your wallet
3. Request test tokens (tTITAN)
4. Wait for confirmation (usually takes 1-2 minutes)

## 📝 Smart Contract Deployment Addresses

### Testnet Infrastructure

- **Universal Router**: `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD`
- **Permit2**: `0x000000000022D473030F116dDEE9F6B43aC78BA3`
- **Factory**: `0x1F98431c8aD98523631AE4a59f267346ea31F984`
- **SwapRouter**: `0xE592427A0AEce92De3Edee1F18E0157C05861564`
- **NFTDescriptor**: `0x42B24A95702b9986e82d421cC3568932790A48Ec`
- **NonfungibleTokenPositionDescriptor**: `0x91ae842A5Ffd8d12023116943e72A606179294f3`
- **NonfungiblePositionManager**: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- **Quoter**: `0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6`
- **TickLens**: `0xbfd8137f7d1516D3ea5cA83523914859ec47F573`

### Mainnet Infrastructure

- **Universal Router**: `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD`
- **Permit2**: `0x000000000022D473030F116dDEE9F6B43aC78BA3`
- **Factory**: `0x1F98431c8aD98523631AE4a59f267346ea31F984`
- **SwapRouter**: `0xE592427A0AEce92De3Edee1F18E0157C05861564`
- **NFTDescriptor**: `0x42B24A95702b9986e82d421cC3568932790A48Ec`
- **NonfungibleTokenPositionDescriptor**: `0x91ae842A5Ffd8d12023116943e72A606179294f3`
- **NonfungiblePositionManager**: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- **Quoter**: `0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6`
- **TickLens**: `0xbfd8137f7d1516D3ea5cA83523914859ec47F573`

## 🔍 Contract Verification

### Testnet Verification

bash
npx hardhat verify --network titanTestnet DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"
Verification
bash
npx hardhat verify --network titanMainnet DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"

## 📝 Contract Addresses

### Testnet

- TitanRouter: `0x...`
- LiquidityManager: `0x...`
- YieldOptimizer: `0x...`

### Mainnet

- TitanRouter: `0x...`
- LiquidityManager: `0x...`
- YieldOptimizer: `0x...`

## 🔍 Universal Router Integration

The contracts leverage Uniswap V3's Universal Router for:

- Multi-hop swaps
- Permit2 integration
- Gas optimization
- Cross-chain compatibility

## 📈 Gas Optimization

- Implements EIP-2929 for reduced gas costs
- Uses assembly for critical functions
- Batch processing capabilities
- Storage optimization patterns

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## ☕️ Buy me a Coffee

Created by Amir (grevis)

If you find this project helpful, consider buying me a coffee!

ETH Address: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`

## 📞 Support

For support and inquiries:

- Create an issue
- Follow us on [X](https://x.com/groygrevis)
