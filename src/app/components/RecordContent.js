"use client";
import React, { useState, useEffect } from "react";

// Function to fetch the data from Airtable
const fetchData = async () => {
  const API_URL =
    "https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Branch1?&view=Gridview";
  const API_TOKEN =
    "patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383"; // Your API token

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    const data = await response.json();
    return data.records; // Return the records from the API
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const MainContent = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [selectedCurrency, setSelectedCurrency] = useState(""); // Selected currency for filtering
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows

  // Fetch the data on component mount
  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData); // Set the fetched data to the state
      setIsLoading(false); // Stop loading
    };

    getData();
  }, []);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Transaction Details</h1>

      {/* Currency Selector */}
      <div className="relative pb-4 bg-white">
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
              </th>{" "}
              {/* Added new column for Created */}
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
                <td className="px-6 py-4">{item.fields.Amount}</td>
                <td className="px-6 py-4">{item.fields.Rate}</td>
                <td className="px-6 py-4">{item.fields.Total1}</td>
                <td className="px-6 py-4">{item.fields.Type}</td>
                <td className="px-6 py-4">
                  {formatDate(item.fields.Created)}
                </td>{" "}
                {/* Display formatted date */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
