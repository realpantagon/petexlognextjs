"use client";
import React, { useState, useEffect } from "react";
import { saveRate } from "../api/SaveRate"; // Import the saveRate controller

const Modal = ({ isOpen, onClose, rate, onSave }) => {
  if (!isOpen) return null;

  const [rateInput, setRateInput] = useState(rate.rate); // State for rate input
  const [amount, setAmount] = useState(""); // State for amount input
  const [amountError, setAmountError] = useState(false); // State for amount error
  const [transactionType, setTransactionType] = useState("Buying"); // State for transaction type (Buying/Selling)
  const [calculatedValue, setCalculatedValue] = useState(""); // State for calculated value

  // Handle changes for rate input
  const handleRateChange = (e) => {
    setRateInput(e.target.value);
  };

  // Function to format numbers with commas
  const formatNumber = (value) => {
    const formatted = value.replace(/\D/g, ''); // Remove non-numeric characters
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
  };

  // Handle changes for amount input
  const handleAmountChange = (e) => {
    let formattedAmount = e.target.value;

    // Remove any non-numeric characters except for commas
    formattedAmount = formattedAmount.replace(/\D/g, '');

    // Prevent negative values
    if (parseFloat(formattedAmount) < 0) {
      return; // Do not update the state if the value is negative
    }

    // Format amount with commas
    formattedAmount = formatNumber(formattedAmount);
    setAmount(formattedAmount);
    setAmountError(formattedAmount === ""); // Set error if amount is empty
  };

  // Handle changes for transaction type
  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  // Calculate the value for the new text input (rate * amount)
  useEffect(() => {
    if (rateInput && amount) {
      const calculated = Math.floor(parseFloat(rateInput.replace(/,/g, '')) * parseFloat(amount.replace(/,/g, '')));
      setCalculatedValue(calculated.toLocaleString()); // Format with commas
    }
  }, [rateInput, amount]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal if the click is on the backdrop (outside the modal)
    }
  };

  // Function to handle saving data to Airtable using the controller
  const handleSave = async () => {
    if (amount === "") {
      setAmountError(true); // Set error if amount is empty
      return;
    }
    const flooredValue = Math.floor(parseFloat(calculatedValue.replace(/,/g, '')));
    const amountNumber = parseFloat(amount.replace(/,/g, '')); // Convert amount to number
    await saveRate(rate, rateInput, amountNumber, transactionType, flooredValue.toLocaleString()); // Call the saveRate function
    onSave(); // Trigger the save refresh in the parent
    onClose(); // Close the modal after saving
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
      onClick={handleBackdropClick} // Handle backdrop click
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-sm space-y-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rate Details</h2>

        {/* Dropdown for Buying / Selling */}
        <div className="mb-4">
          <label htmlFor="transaction-type" className="block text-sm font-medium mb-2 text-gray-600">
            Transaction Type
          </label>
          <select
            id="transaction-type"
            value={transactionType}
            onChange={handleTransactionTypeChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Buying">Buying</option>
            <option value="Selling">Selling</option>
          </select>
        </div>

        {/* Rate input field, prefilled with rate data */}
        <div className="flex items-center mb-4">
          {rate.flags.length > 0 ? (
            <img
              src={rate.flags[0].thumbnails.small.url}
              alt={rate.flags[0].filename}
              width="40"
              height="40"
              className="mr-4"
            />
          ) : (
            <span>No flag</span>
          )}
          <span className="text-lg font-medium text-gray-700 mr-8">{rate.cur}</span>
          <input
            type="text"
            value={rateInput}
            onChange={handleRateChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount input field */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-600">
            Amount
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className={`border border-gray-300 rounded-lg px-4 py-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${amountError ? 'border-red-500' : ''}`}
            placeholder="Enter amount"
          />
          {amountError && <p className="text-red-500 text-sm mt-1">*fill amount*</p>}
        </div>

        {/* Calculated value input field */}
        <div className="mb-4">
          <label htmlFor="calculated-value" className="block text-sm font-medium mb-2 text-gray-600">
            Calculated Value (Rate * Amount)
          </label>
          <input
            type="text"
            id="calculated-value"
            value={calculatedValue}
            disabled
            className="border border-gray-300 rounded-lg px-4 py-2 w-full text-lg bg-gray-200 cursor-not-allowed"
            placeholder="Calculated value"
          />
        </div>

        <div className="flex justify-end space-x-4">
          {/* Close button */}
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onClose} // Close the modal
          >
            Close
          </button>

          {/* Save button */}
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSave} // Trigger the save action
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
