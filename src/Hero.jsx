import { useState } from 'react';
import { useAccount, useBalance, useChainId, useSwitchChain, useWriteContract, useDisconnect } from 'wagmi';
import { lisk } from 'wagmi/chains';
import { ethers } from 'ethers';
import tokenAbi from './contracts/erc20Abi.mjs';
import onpaylogo1 from '../src/assets/onpaylogo1.png';

const liskUSDTAddress = '0x05D032ac25d322df992303dCa074EE7392C117b9';

function Hero() {
  const [copyButtonState, setCopyButtonState] = useState('copy');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txHash, setTxHash] = useState('');

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: ethBalance } = useBalance({ address });
  const { data: usdcBalance } = useBalance({
    address,
    token: liskUSDTAddress,
  });

  // Write contract hook
  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        setTxHash(data);
        setTxStatus('Transaction successful!');
      },
      onError: (error) => {
        setTxStatus(`Transaction failed: ${error.message}`);
        setTxHash('');
      },
    },
  });

  // Handle sending tokens
  const handleSendTokens = async () => {
    if (!recipientAddress || !amount) {
      setTxStatus("Please enter recipient address and amount");
      return;
    }
    writeContract({
      address: liskUSDTAddress,
      abi: tokenAbi,
      functionName: 'transfer',
      args: [recipientAddress, ethers.parseUnits(amount, 6)],
    });
  };

  // Copy to clipboard utility
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyButtonState('copying');
    setTimeout(() => setCopyButtonState('copy'), 2000);
  };

  return (
    <section className="bg-[#eaeaea] min-h-screen flex items-center justify-center">
      <div className="bg-[#eaeaea] p-6 rounded-lg w-full max-w-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <img src={onpaylogo1} alt="OnPay Logo" className="w-1/2 h-18" />
          {isConnected ? (
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <button
                  onClick={() => copyToClipboard(address)}
                  className="bg-gray-100 px-2 py-1 rounded text-sm"
                >
                  {copyButtonState}
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600">
                  {ethers.formatUnits(ethBalance?.value || '0', 18).slice(0, 6)} ETH
                </p>
                <p className="text-sm text-gray-600">
                  {ethers.formatUnits(usdcBalance?.value || '0', 6).slice(0, 6)} USDT
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => disconnect()}
                  className="text-red-600 text-sm hover:bg-red-100 px-2 py-1 rounded"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <w3m-button />
          )}
        </div>

        {/* Send Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">You send</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <select
              value={chainId}
              onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value={lisk.id}>Lisk Mainnet</option>
            </select>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendTokens}
          disabled={isPending}
          className="w-full text-black p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {isPending ? 'Processing...' : 'Send'}
        </button>

        {/* Transaction Status */}
        {txHash && (
          <div className="mt-4 text-sm text-gray-600">
            <p className="text-green-600">{txStatus}</p>
            <p>
              <a
                href={`https://blockscout.lisk.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Lisk Explorer
              </a>
            </p>
            <p>
              Tx: {txHash.slice(0, 6)}...{txHash.slice(-4)}{' '}
              <button
                onClick={() => copyToClipboard(txHash)}
                className="text-blue-500 hover:underline"
              >
                Copy
              </button>
            </p>
          </div>
        )}

        {/* Error Message */}
        {!txHash && txStatus && (
          <div className="mt-4 text-sm text-red-600">
            {txStatus}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;