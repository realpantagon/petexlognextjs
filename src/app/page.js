"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BranchSelect from "./components/BranchSelect";
import CurrencyForm from "./components/CurrencyForm";
import RecordDisplay from "./components/RecordDisplay";
import Summary from "./components/Summary";
import FormActions from "./components/FormActions";
import { TextField } from "@mui/material";

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

      const desiredOrder = [
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
        "South Korean Won",
      ];

      const sortedCurrencyData = currencyData.sort(
        (a, b) => desiredOrder.indexOf(a.label) - desiredOrder.indexOf(b.label)
      );

      setCurrencies(sortedCurrencyData);
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
  try {
    setData(JSON.parse(storedData));
  } catch (error) {
    console.error("Error parsing stored data:", error);
    // Handle the error, e.g., clear the stored data
    localStorage.removeItem("formData");
  }
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

    const message = `${timestamp}\n ${selectedBranch}\n ${selectedOption}\n ${rate}\n ${formattedAmount}\n ${type}\n ${formattedTotal} baht\n ซื้อแล้ว: ${new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "THB",
      }
    ).format(totalBought)}\n เหลือเงิน: ${new Intl.NumberFormat("en-US", {
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
      setInitialMoney("");
      localStorage.removeItem("formData");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("initialMoney");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <BranchSelect
          selectedBranch={selectedBranch}
          handleBranchChange={handleBranchChange}
        />
        <TextField
          label="เงินตั้งต้น"
          value={initialMoney}
          onChange={handleInitialMoneyChange}
          className="w-full"
        />
      </div>

      <CurrencyForm
        selectedOption={selectedOption}
        handleOptionChange={handleOptionChange}
        currencies={currencies}
        rate={rate}
        amount={amount}
        handleInput1Change={handleInput1Change}
        handleInput2Change={handleInput2Change}
        type={type}
        handleTypeChange={handleTypeChange}
        handleAddClick={handleAddClick}
      />
      <Summary initialMoney={initialMoney} data={data} />
      <FormActions handleClearClick={handleClearClick} />
      <RecordDisplay data={data} />
    </div>
  );
}

export default Forminput;
