"use client";
import React, { useState, useEffect } from "react";
import { fetchRates } from "../api/GetRate";
import { Rate } from "../models/Rate";
import Spinner from './Spinner'; // Import Spinner component

const RateTable = ({ onRowClick }) => {
  const [rates, setRates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // Track selected row
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [lastFetchTime, setLastFetchTime] = useState(null); // Track last fetch time

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch rates when the component mounts or refreshes
  const getRates = async () => {
    setIsLoading(true); // Start loading
    const fetchedRates = await fetchRates();
    const formattedRates = fetchedRates.map(
      (rate) =>
        new Rate(
          rate.id,
          rate.fields.Cur,
          rate.fields.Currency,
          rate.fields.Rate,
          rate.fields.Flags
        )
    );
  
    // Sort the rates based on the custom order
    const sortedRates = formattedRates.sort((a, b) => {
      const indexA = customCurrencyOrder.indexOf(a.currency);
      const indexB = customCurrencyOrder.indexOf(b.currency);
  
      // Handle cases where the currency is not in the custom order
      if (indexA === -1) return 1; // If a.currency is not in the custom order, place it at the end
      if (indexB === -1) return -1; // If b.currency is not in the custom order, place it at the end
  
      return indexA - indexB; // Otherwise, sort by the custom order
    });
  
    setRates(sortedRates);
    setIsLoading(false); // Stop loading
    setLastFetchTime(new Date()); // Update last fetch time
  };
  

  // Fetch rates on mount
  useEffect(() => {
    getRates();
  }, []);

  const handleRowClick = (rate) => {
    setSelectedRow(rate.id); // Set the clicked row as selected
    if (onRowClick) {
      onRowClick(rate); // Call the onRowClick function passed from MainPage
    }
  };

  const handleRefresh = () => {
    getRates(); // Re-fetch the rates when the button is clicked
  };

  const customCurrencyOrder = [
    "US Dollar $50-100", 
    "US Dollar $5-20", 
    "US Dollar $1", 
    "Euro", 
    "Japanese Yen", 
    "British Pound", 
    "Singapore Dollar", 
    "Australian Dollar", 
    "Swiss Franc", 
    "Hong Kong Dollar", 
    "Canadian Dollar", 
    "New Zealand Dollar", 
    "Swedish Krona", 
    "Taiwan Dollar", 
    "Norwegian Krone", 
    "Malaysian Ringgit", 
    "Chinese Yuan Renminbi", 
    "South Korean Won"
  ];
  

  return (
    <div className="container flex justify-start bg-white">
      <div className="max-w-xs mx-auto">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          Refresh Rates
        </button>
        {lastFetchTime && (
          <span className="block mb-4 text-sm text-gray-500">
            Last Update: {formatTime(lastFetchTime)}
          </span>
        )}
        {/* Loading Spinner */}
        {isLoading ? (
          <Spinner /> // Show Spinner when loading
        ) : (
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Flags</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr
                  key={rate.id}
                  className={`cursor-pointer ${
                    selectedRow === rate.id ? "bg-gray-200" : ""
                  } hover:bg-gray-100 border-b border-gray-300`}
                  onClick={() => handleRowClick(rate)}
                >
                  <td className="px-4 py-2">
                    {rate.flags.length > 0 ? (
                      <img
                        src={rate.flags[0].thumbnails.small.url}
                        alt={rate.flags[0].filename}
                        width="20"
                        height="20"
                      />
                    ) : (
                      "No flag"
                    )}
                  </td>
                  <td className="px-4 py-2">{rate.cur}</td>
                  <td className="px-4 py-2">{rate.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RateTable;
