"use client";
import React, { useState, useEffect } from "react";
import { fetchData } from "../api/GetTransaction"; // Import fetchData from the new file
import PrintIcon from '@mui/icons-material/Print';
import RecievePrint from "./RecievePrint"; // Import the RecievePrint component
import Spinner from './Spinner'; // Import Spinner component

const MainContent = ({ refreshTrigger }) => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [selectedCurrency, setSelectedCurrency] = useState(""); // Selected currency for filtering
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows

  // Fetch the data on component mount and when refreshTrigger changes
  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      // Sort the data by Created date in descending order (newest first)
      const sortedData = fetchedData.sort((a, b) => new Date(b.fields.Created) - new Date(a.fields.Created));
      setData(sortedData); // Set the sorted data to the state
      setIsLoading(false); // Stop loading
    };

    getData();
  }, [refreshTrigger]); // Add refreshTrigger as a dependency

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id); // Deselect
      } else {
        return [...prevSelectedRows, id]; // Select
      }
    });
  };

  // Handle master checkbox select
  const handleMasterSelect = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]); // Deselect all if all are selected
    } else {
      setSelectedRows(data.map((item) => item.id)); // Select all
    }
  };

  // Extract unique currencies from the data
  const currencies = [...new Set(data.map((item) => item.fields.Currency))];

  // Handle currency filter
  const filteredData = data.filter((item) => {
    return selectedCurrency ? item.fields.Currency === selectedCurrency : true;
  });

  // Function to format date time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format to a readable date-time string
  };

  // Function to handle print
  const handlePrint = (items) => {
    const printContent = RecievePrint(items, formatDate);
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintSelected = () => {
    const selectedItems = data.filter((item) => selectedRows.includes(item.id));
    const filteredSelectedItems = selectedItems.filter((item) => {
      return selectedCurrency ? item.fields.Currency === selectedCurrency : true;
    });
    handlePrint(filteredSelectedItems);
  };

  const formatMoney = (amount) => {
    return amount.toLocaleString( { style: 'currency', currency: 'USD' });
  };

  const calculateSumByCurrency = (data) => {
    const sums = {};
    data.forEach((item) => {
      const currency = item.fields.Currency;
      const total = parseFloat(item.fields.Total1);
      const amount = parseFloat(item.fields.Amount);
      if (!sums[currency]) {
        sums[currency] = { totalSum: 0, amountSum: 0 };
      }
      sums[currency].totalSum += total;
      sums[currency].amountSum += amount;
    });
    return sums;
  };

  const calculateTotalSum = (sums) => {
    return Object.values(sums).reduce((acc, curr) => acc + curr.totalSum, 0);
  };

  return (
    <div className="p-6 h-[80vh] w-full overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-4">Transaction Details</h1>
      {isLoading ? (
        <Spinner /> // Show Spinner when loading
      ) : (
        <>
          {/* Currency Selector */}
          <div className="relative pb-4 bg-white flex items-center">
            <label htmlFor="currency-select" className="sr-only">
              Currency
            </label>
            <div className="relative mt-1">
              <select
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)} // Update selected currency
                className="block w-64 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 bg-white transition duration-150 ease-in-out"
              >
                <option value="">All Currencies</option>
                {currencies.map((currency, index) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <button className="ml-4 p-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition duration-150 ease-in-out" onClick={handlePrintSelected}>
              <PrintIcon />
            </button>
          </div>
          {/* Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-white">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                        checked={selectedRows.length === data.length}
                        onChange={handleMasterSelect} // Select/Deselect all rows
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Currency
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Print
                  </th> {/* Added new column for Print */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-${item.id}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                          checked={selectedRows.includes(item.id)} // Check if the row is selected
                          onChange={() => handleRowSelect(item.id)} // Handle individual row selection
                        />
                        <label
                          htmlFor={`checkbox-table-${item.id}`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.fields.Currency}
                    </th>
                    <td className="px-6 py-4">{formatMoney(item.fields.Amount)}</td>
                    <td className="px-6 py-4">{item.fields.Rate}</td>
                    <td className="px-6 py-4">{formatMoney(item.fields.Total1)}</td> {/* Display Total with 2 decimal places */}
                    <td className="px-6 py-4">{item.fields.Type}</td>
                    <td className="px-6 py-4">
                      {formatDate(item.fields.Created)}
                    </td>
                    <td className="px-6 py-4">
                      <PrintIcon className="text-blue-600 cursor-pointer" onClick={() => handlePrint([item])} /> {/* Print only this row */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Summary Table */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-white">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Currency</th>
                  <th scope="col" className="px-6 py-3">Amount Sum</th>
                  <th scope="col" className="px-6 py-3">Total Sum</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(calculateSumByCurrency(data)).map(([currency, sums]) => (
                  <tr key={currency} className="bg-white border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{currency}</td>
                    <td className="px-6 py-4">{formatMoney(sums.amountSum)}</td>
                    <td className="px-6 py-4">{formatMoney(sums.totalSum)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Total</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">{formatMoney(calculateTotalSum(calculateSumByCurrency(data)))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;
