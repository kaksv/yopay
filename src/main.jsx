import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './viem.config';
import { createWeb3Modal } from '@web3modal/wagmi/react'; // Correct import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lisk, baseSepolia } from 'wagmi/chains'; // Import chains
import './index.css';
// import { CryptoProvider } from 'swypt-checkout';

const queryClient = new QueryClient();

// Initialize Web3Modal
// eslint-disable-next-line no-undef
createWeb3Modal({
   wagmiConfig, 
   projectId: 'aa51d05f03cacb17680bb46a725c6032',
   chains: [lisk, baseSepolia] });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <CryptoProvider> */}
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
{/* </CryptoProvider> */}
  </React.StrictMode>
);