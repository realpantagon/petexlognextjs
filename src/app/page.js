"use client";

import React, { useState, useEffect } from "react";
import { Select, MenuItem, TextField, Button } from "@mui/material";
import Record from "./Record";
import axios from "axios";

function Forminput() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Buying");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialMoney, setInitialMoney] = useState("");

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
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }

    const storedBranch = localStorage.getItem("selectedBranch");
    if (storedBranch) {
      setSelectedBranch(storedBranch);
    }

    const storedInitialMoney = localStorage.getItem("initialMoney");
    if (storedInitialMoney) {
      setInitialMoney(storedInitialMoney);
    }

    fetchCurrenciesData();

    const interval = setInterval(() => {
      setIsRefreshing(true);
      fetchCurrenciesData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleBranchChange = (event) => {
    const selectedBranch = event.target.value;
    setSelectedBranch(selectedBranch);
    localStorage.setItem("selectedBranch", selectedBranch);
  };

  const handleOptionChange = (event) => {
    const selectedCurrency = event.target.value;
    const currencyInfo = currencies.find(
      (currency) => currency.label === selectedCurrency
    );
    setSelectedOption(selectedCurrency);
    if (currencyInfo) {
      setRate(currencyInfo.rate);
    } else {
      setRate("");
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

  const handleInitialMoneyChange = (event) => {
    const value = event.target.value;
    setInitialMoney(value);
    localStorage.setItem("initialMoney", value);
  };

  const handleAddClick = () => {
    const timestamp = new Date().toLocaleString("en-US", { hour12: false });
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
    const total = type === "Buying" ? rate * amount : -(rate * amount);
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
    const newData = {
      time: timestamp,
      branch: selectedBranch,
      currency: selectedOption,
      rate,
      amount: formattedAmount,
      type,
      total: formattedTotal,
    };
    const updatedData = [...data, newData];
    setData(updatedData);
    setSelectedOption("");
    setRate("");
    setAmount("");
  
    localStorage.setItem("formData", JSON.stringify(updatedData));
  
    const totalBought = updatedData.reduce(
      (acc, item) => acc + parseFloat(item.total.replace(",", "")),
      0
    );
    const remainingMoney = parseFloat(initialMoney) - totalBought;
  
    const message = `${timestamp}\n ${selectedBranch}\n ${selectedOption}\n ${rate}\n ${formattedAmount}\n ${type}\n ${formattedTotal} baht\n ซื้อแล้ว: ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
    }).format(totalBought)}\n เหลือเงิน: ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
    }).format(remainingMoney)}`;
  
    console.log(message);
    sendLineNotification(message)
      .then(() => console.log("Line notification sent successfully"))
      .catch((error) =>
        console.error("Error sending Line notification:", error)
      );
  };

  const sendLineNotification = async (message) => {
    await axios.post("/api", { message });
  };

  const handleClearClick = () => {
    if (window.confirm("Are you sure you want to delete all data?")) {
      setData([]);
      setSelectedBranch("");
      setInitialMoney("");
      localStorage.removeItem("formData");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("initialMoney");
    }
  };

  const exportToGoogleSheet = () => {
    const csvData = [
      ["Time", "Branch", "Currency", "Rate", "Amount", "Type", "Total", "ซื้อแล้ว", "เหลือเงิน"].join(","),
      ...data.map((entry) => {
        const totalBought = data.slice(0, data.indexOf(entry) + 1).reduce(
          (acc, item) => acc + parseFloat(item.total.replace(",", "")),
          0
        );
        const remainingMoney = parseFloat(initialMoney) - totalBought;
        return `${entry.time},${entry.branch},${entry.currency},${entry.rate},${entry.amount},${entry.type},${parseFloat(entry.total.replace(",", "")).toFixed(2)},${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "THB",
        }).format(totalBought)},${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "THB",
        }).format(remainingMoney)}`;
      }),
    ].join("\n");
  
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
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedBranch} onChange={handleBranchChange}>
          <MenuItem value="">Select a branch</MenuItem>
          <MenuItem value="N PARC">N PARC</MenuItem>
          <MenuItem value="Nimman Promenade">Nimman Promenade</MenuItem>
        </Select>
        <TextField
          label="เงินตั้งต้น"
          value={initialMoney}
          onChange={handleInitialMoneyChange}
        />
      </div>
      <div className="text-3xl text-center mt-8">PETEX DATA</div>

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
            inputProps={{ pattern: "^[0-9]*.?[0-9]*$" }}
            error={!/^[0-9]*\.?[0-9]*$/.test(rate)}
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
            inputProps={{ pattern: "^[0-9]*.?[0-9]*$" }}
            error={!/^[0-9]*\.?[0-9]*$/.test(amount)}
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ADD
        </button>
      </div>
      <Record data={data} />
      <div className="Summary">
        <p className="total">เงินตั้งต้นวัน : </p>
        <p className="totaldata">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "THB",
          }).format(parseFloat(initialMoney))}
        </p>
        <p className="total">ซื้อแล้ว : </p>
        <p className="totaldata">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "THB",
          }).format(
            data.reduce(
              (acc, item) => acc + parseFloat(item.total.replace(",", "")),
              0
            )
          )}
        </p>
        <p className="total">เหลือเงิน : </p>
        <p className="totaldata">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "THB",
          }).format(
            parseFloat(initialMoney) -
              data.reduce(
                (acc, item) => acc + parseFloat(item.total.replace(",", "")),
                0
              )
          )}
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