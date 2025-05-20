

import React, { useState, ChangeEvent } from "react";
import { DepositModal } from "swypt-checkout";
import "swypt-checkout/dist/styles.css";

export default function PaymentPage() {
  // State to control the modal visibility
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  
  // State to control deposit amount
  const [depositAmount, setDepositAmount] = useState(100);
  
  // Example merchant address - replace with your actual address
  const merchantAddress = "0x6d19a24D93379D1bA58d28884fFBBEf1bc145387";
  
  // Function to handle deposit amount change
  const handleAmountChange = (e) => {
    setDepositAmount(parseFloat(e.target.value));
  };

  // Function to handle modal open
  const handleOpenModal = () => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    setIsDepositOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    // Restore body scrolling when modal is closed
    document.body.style.overflow = 'auto';
    setIsDepositOpen(false);
  };

  return (
    <div className="min-18 bg-gray-300 rounded-[30px] p-10 flex items-center justify-center bottom-0 top-0 left-0 right-0">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 ">
        <h1 className="text-2xl font-bold mb-6">Buy Crypto</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Deposit
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute left-0 pl-3 flex items-center pointer-cursor">
                {/* <span className="text-gray-500 sm:text-sm">$</span> */}
              </div>
              <input
                type="number"
                value={depositAmount}
                onChange={handleAmountChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full ml-7 pl-16 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md pointer-cursor                                                  "
                placeholder="0.00 KES"
                min="1"
                step="0.01"
              />
            </div>
          </div>
          
          <button
            onClick={handleOpenModal}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Open Deposit Modal
          </button>
        </div>
      </div>
      
      {/* Modal container with overlay */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          
          {/* Modal content */}
          <div className="relative z-50">
            <DepositModal
              isOpen={isDepositOpen}
              onClose={handleCloseModal}
              headerBackgroundColor="linear-gradient(to right, #044639, #FF4040)"
              businessName="On Pay"
              merchantName="On Pay"
              merchantAddress='0x0000000'
              amount={depositAmount}
            />
          </div>
        </div>
      )}
    </div>
  );
}