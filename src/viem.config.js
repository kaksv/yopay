import { createPublicClient, http } from 'viem';
import { lisk, sepolia, baseSepolia, optimismSepolia, polygonAmoy, celoAlfajores } from 'viem/chains';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

// Define your chains
const chains = [
  lisk,
  sepolia
  // , sepolia, baseSepolia, optimismSepolia, polygonAmoy,
  //liskSepolia, no usdc support from circle for now 
  // celoAlfajores, 
  // kakarotStarknetSepolia no usdc support from circles for now
]; //Add new chains

// Create Wagmi config
// eslint-disable-next-line no-undef
const projectId = import.meta.env.VITE_WALLET_CONNECT_ID // Get this from https://cloud.walletconnect.com
const metadata = {
  name: 'OnPay',
  description: 'Cross-border payments with stablecoins',
  url: 'https://onpay.com', // Your dApp URL
  icons: ['https://onpay.com/logo.png'], // Your dApp logo
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Create Web3Modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export const publicClient = createPublicClient({
  chain: sepolia, // Default chain
  transport: http(),
});

export const basePublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export { wagmiConfig };