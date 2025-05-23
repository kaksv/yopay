import { useEffect, useState } from 'react';
import { useAccount, useBalance, useChainId, useSwitchChain, useWriteContract, useDisconnect } from 'wagmi';
import { lisk } from 'wagmi/chains';
import { ethers } from 'ethers';
import tokenAbi from './contracts/erc20Abi.mjs';
import onpaylogo1 from '../src/assets/onpaylogo1.png';
import axios from 'axios';


const liskUSDTAddress = '0x05D032ac25d322df992303dCa074EE7392C117b9';

function Hero() {
  const [copyButtonState, setCopyButtonState] = useState('copy');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [activeTab, setActiveTab] = useState('onramp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recipentAddress2, setRecipentAddress2] = useState('');
  const [kenyanamount, setKenyanAmount] = useState('');
  const [responseObject, setResponseObject] = useState({}); //exchange rate
  const [responseObject2, setResponseObject2] = useState({}); //handling estimated amount
  const [responseObject3, setResponseObject3] = useState({}); //handling STK request

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

  useEffect(() => {
    if (chainId !== lisk.id) {
      switchChain?.(lisk.id);
    }
    const getExchangeRate = async () => {
      
    try {
      const response = await axios.post('/api/api/swypt-quotes', {
  
  type: "onramp",
  amount: "1",
  fiatCurrency: "KES",
  cryptoCurrency: "USDT", //cKes, USDC
  network: "lisk",
  },
  {
     headers: {
    'Content-Type': 'application/json',
  },

});
const requiredData =await  response.data.data;
setResponseObject(requiredData);
console.log("requiredData",requiredData);
    }catch(error) {
      console.log('this is the error',error);
    }
    };
    getExchangeRate();
  }, []);

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

  const onRampData = async() => {

    try {
      const userOnRampdata = await axios.post('/api/api/swypt-quotes', {
  
        type: "onramp",
        amount: kenyanamount,
        fiatCurrency: "KES",
        cryptoCurrency: "USDT", //cKes, USDC
        network: "lisk",
        },
        {
           headers: {
          'Content-Type': 'application/json',
        }
      });
      const requiredData =await  userOnRampdata.data.data;
      setResponseObject2(requiredData);
      // console.log("requiredData",requiredData);
    }catch(error) {
      console.log('this is the error',error);
    }
  }

  const stkRequest = async() => {

    try {

    const response = await axios.post('/api/api/swypt-onramp', {
  partyA: phoneNumber,
  amount: kenyanamount,
  side: "onramp",
  userAddress: recipentAddress2,
  tokenAddress: liskUSDTAddress
}, {
   headers: {
          'Content-Type': 'application/json',
        }
});
const requiredData =await  response.data.data;
setResponseObject3(requiredData);
    }catch(error) {
      console.log('this is the error',error);
    }
  }


  return (
    <section className="bg-[#eaeaea] min-h-screen flex  items-center justify-center">
      <div className="bg-[#eaeaea] p-6 rounded-lg w-full max-w-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <img src={onpaylogo1} alt="OnPay Logo" className="w-1/2 h-18" />
          {isConnected ? (
            <div className="bg-white p-2 rounded-md shadow-sm">
              {/* Connection Status Message */}
              <div className="flex items-center gap-1 mb-2">
                {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                <span className="text-sm text-gray-600">
                  🔷 {chainId === lisk.id ? 'Lisk Mainnet' : 'Unknown Network'}
                </span>
                <hr className="h-px  bg-gray-800  dark:bg-gray-900" />
              </div>
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
          className="w-full mb-4 text-black p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {isPending ? 'Processing...' : 'Send'}
        </button>



                {/* Onramp/Offramp Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('onramp')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'onramp' 
                  ? 'text-black border-b-2 border-black ' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setActiveTab('offramp')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'offramp' 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cash Out
            </button>
          </div>
          
          <div className="p-4">
            {activeTab === 'onramp' ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600"> Payment method: MPESA</p>
                <p className="text-sm text-gray-600">1 Ksh ~ {(1/responseObject.exchangeRate).toFixed(2)} USDT</p>
                {/* <button
                 className="w-full p-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                  MPESA
                </button> */}
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={"254754920903"}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-none `}
                  />

                  <input
                    type="text"
                    value={recipentAddress2}
                    onChange={(e) => setRecipentAddress2(e.target.value)}
                    placeholder={"Enter your Wallet Address"}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-none `}
                  />

                  <input
                    type="number"
                    value={kenyanamount}
                    onChange={(e) => {setKenyanAmount(e.target.value); onRampData()}}
                    placeholder={"100"}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-none `}
                  />
                  <p className="text-sm text-gray-600">You recieve ~ {(Number(kenyanamount)/responseObject2.exchangeRate).toFixed(2)} USDT</p>
                  {/* Onramp button */}
                 <button
                    onClick={stkRequest}
                    disabled={isPending}
                    className="w-full mb-4 text-black p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-none focus:ring-gray-500   "
                  >
                    {isPending ? 'Waiting for approval...' : 'GET USDT'}
                  </button>
                <div className="text-center text-xs text-gray-500 mt-2">
                  Powered by Swypt • CC • OnPay
                </div>
              </div>
            ) : (


              <div className="space-y-3">
                <p className="text-sm text-gray-600">Withdrawal method: MPESA</p>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={"Enter your phone number"}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-none `}
                  />

                  <input
                    type="text"
                    value={recipentAddress2}
                    onChange={(e) => setRecipentAddress2(e.target.value)}
                    placeholder={"Enter your Wallet Address"}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-none `}
                  />
                  {/* Onramp button */}
                 <button
                    onClick=""
                    disabled={isPending}
                    className="w-full mb-4 text-black p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-none focus:ring-gray-500   "
                  >
                    {isPending ? 'Waiting for approval...' : 'Withdraw to MPESA'}
                  </button>
                <div className="text-center text-xs text-gray-500 mt-2">
                  Supported Swypt:  • CC • OnPay
                </div>
              </div>
            )}
          </div>
        </div>

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
      {/* <div className='absolute flex justify-center items-center bottom-0 right-0 top-0 left-0' >
      <Payment />
      </div> */}
    </section>
  );
}

export default Hero;