"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencyForm from "./components/CurrencyForm";
import RecordDisplay from "./components/RecordDisplay";
import FormActions from "./components/ClearRecordsButton";
import { TextField } from "@mui/material";
import EditRecordModal from "./components/EditRecordModal";

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
  const [initialMoney, setInitialMoney] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);

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

  const handleEditRecord = (record) => {
    setEditingRecord(record);
  };

  const handleAddClick = () => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
    const total = type === "Buying" ? rate * amount : -(rate * amount);
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);

    const airtableData = {
      records: [
        {
          fields: {
            Currency: selectedOption,
            Rate: rate,
            Amount: formattedAmount,
            Type: type,
            Total1: formattedTotal,
          },
        },
      ],
    };

    axios
      .post(
        "https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE",
        airtableData,
        {
          headers: {
            Authorization:
              "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Data sent to Airtable successfully");
      })
      .catch((error) => {
        console.error("Error sending data to Airtable:", error);
      });

    setSelectedOption("");
    setRate("");
    setAmount("");

    const message = `\n${type} ${selectedOption}\n Rate: ${rate} \n Amount: ${amount} \n ${formattedTotal} baht`;

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

  return (
    <div className="container mx-auto p-4">
<div className="grid grid-cols-2 gap-4 mb-4">
  <p className="text-gray-700 font-bold text-5xl">NIMMAN PROMENADE</p>
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
    <RecordDisplay data={data} onEdit={handleEditRecord} initialMoney={initialMoney} />
    <FormActions />
    </div>
  );
}

export default Forminput;