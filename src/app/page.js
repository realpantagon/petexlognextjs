"use client";

import React, { useState, useEffect } from "react";
import { Select, MenuItem, TextField, Button } from "@mui/material";
// import Record from "./Record";
import axios from "axios";

function Forminput() {
  const [selectedOption, setSelectedOption] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Buying");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCurrenciesData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Table%201",
        {
          headers: {
            Authorization:
              "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
          },
        }
      );
      const currencyData = response.data.records.map((record) => ({
        label: record.fields.Currency,
        rate: record.fields.Rate,
      }));
      setCurrencies(currencyData);

      // Clear stored data after successful fetch
      localStorage.removeItem("formData");
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Set isRefreshing to false after fetching data
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      setData([]);
    }

    fetchCurrenciesData();

    // Fetch data every minute
    const interval = setInterval(() => {
      setIsRefreshing(true); // Set isRefreshing to true before fetching data
      fetchCurrenciesData();
    }, 60000); // 60000 milliseconds = 1 minute

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const handleOptionChange = (event) => {
    const selectedCurrency = event.target.value;
    const currencyInfo = currencies.find(
      (currency) => currency.label === selectedCurrency
    );
    setSelectedOption(selectedCurrency);
    if (currencyInfo) {
      setRate(currencyInfo.rate);
    } else {
      setRate(""); // Clear rate if currency not found
    }
  };

  const handleInput1Change = (event) => {
    setRate(event.target.value);
  };

  const handleInput2Change = (event) => {
    setAmount(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleAddClick = () => {
    const timestamp = new Date().toLocaleString("en-US", { hour12: false });
    const newData = {
      time: timestamp,
      currency: selectedOption,
      rate,
      amount,
      type,
      total: type === "Buying" ? rate * amount : -(rate * amount),
    };
    setData([...data, newData]);
    setSelectedOption("");
    setRate("");
    setAmount("");

    // Store the updated data in localStorage
    localStorage.setItem("formData", JSON.stringify([...data, newData]));

    // Send Line notification
    const message = `${timestamp}\n ${selectedOption}\n ${rate}\n ${amount}\n ${type}\n ${newData.total.toFixed(
      2
    )} baht`;
    console.log(message);
    sendLineNotification(message)
      .then(() => console.log("Line notification sent successfully"))
      .catch((error) =>
        console.error("Error sending Line notification:", error)
      );
  };

  const sendLineNotification = async (message) => {
    const resp = await axios.post("/api", { message });
    if (!response.ok) {
      throw new Error("Failed to send Line notification");
    }
  };

  const handleClearClick = () => {
    if (window.confirm("Are you sure you want to delete all data?")) {
      setData([]);
      localStorage.removeItem("formData");
    }
  };

  const exportToGoogleSheet = () => {
    // Convert data to CSV format
    const csvData = [
      ["Time", "Currency", "Rate", "Amount", "Type", "Total"].join(","),
      ...data.map(
        (entry) =>
          `${entry.time},${entry.currency},${entry.rate},${entry.amount},${
            entry.type
          },${entry.total.toFixed(2)}`
      ),
    ].join("\n");

    // Create a temporary anchor element to download the CSV file
    const downloadLink = document.createElement("a");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="p-5">
      <div className="text-3xl text-center">PETEX DATA</div>
      {isRefreshing && <div>Refreshing data...</div>}
      <div className="grid grid-cols-10 gap-4 m-4 p-4 rounded-lg">
        <button
          onClick={() => {
            setIsRefreshing(true);
            fetchCurrenciesData();
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 h-full"
        >
          Refresh
        </button>
        <Select
          value={selectedOption}
          onChange={handleOptionChange}
          className="col-span-2 select"
        >
          <MenuItem value="">Select a Currency</MenuItem>
          {currencies.map((currency) => (
            <MenuItem key={currency.label} value={currency.label}>
              {currency.label}
            </MenuItem>
          ))}
        </Select>
        <div className="col-span-2">
          <TextField
            id="rate"
            type="text"
            value={rate}
            onChange={handleInput1Change}
            label="Rate"
            variant="outlined"
            className="w-full"
            inputProps={{ pattern: "^[0-9]*.?[0-9]*$" }} // Allow numbers and decimals
            error={!/^[0-9]*\.?[0-9]*$/.test(rate)} // Check if input is a valid number
            helperText={
              !/^[0-9]*\.?[0-9]*$/.test(rate)
                ? "Please enter a valid number"
                : ""
            }
          />
        </div>
        <div className="col-span-2">
          <TextField
            id="amount"
            type="text"
            value={amount}
            onChange={handleInput2Change}
            label="Amount"
            className="w-full"
            variant="outlined"
            inputProps={{ pattern: "^[0-9]*.?[0-9]*$" }} // Allow numbers and decimals
            error={!/^[0-9]*\.?[0-9]*$/.test(amount)} // Check if input is a valid number
            helperText={
              !/^[0-9]*\.?[0-9]*$/.test(amount)
                ? "Please enter a valid number"
                : ""
            }
          />
        </div>
        <Select
          value={type}
          onChange={handleTypeChange}
          className="col-span-2 type"
        >
          <MenuItem value="Buying">Buying</MenuItem>
          <MenuItem value="Selling">Selling</MenuItem>
        </Select>
        <button
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
        >
          ADD
        </button>
      </div>
      {/* <Record data={data} /> */}
      <div className="Summary">
        <p className="total">Total : </p>
        <p className="totaldata">
          {data.reduce((acc, item) => acc + item.total, 0).toFixed(2)}{" "}
        </p>
      </div>

      <button
        onClick={handleClearClick}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        DELETE
      </button>
      <button
        onClick={exportToGoogleSheet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
      >
        Export as CSV
      </button>
    </div>
  );
}

export default Forminput;
