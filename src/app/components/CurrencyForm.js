import React from "react";
import { TextField, Select, MenuItem, Button } from "@mui/material";

function CurrencyForm({
  selectedOption,
  handleOptionChange,
  currencies,
  rate,
  amount,
  handleInput1Change,
  handleInput2Change,
  type,
  handleTypeChange,
  handleAddClick,
}) {
  const handleCurrencyChange = (event) => {
    console.log("Currency Changed:", event.target.value);
    handleOptionChange(event);
  };

  const handleRateChange = (event) => {
    console.log("Rate Changed:", event.target.value);
    handleInput1Change(event);
  };

  const handleAmountChange = (event) => {
    console.log("Amount Changed:", event.target.value);
    handleInput2Change(event);
  };

  return (
    <div className="grid grid-cols-5 gap-4 mb-4">
      <Select value={selectedOption} onChange={handleCurrencyChange} displayEmpty>
        <MenuItem value="">Select a Currency</MenuItem>
        {currencies.map((currency) => (
          <MenuItem key={currency.label} value={currency.label}>
            {currency.label}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Rate"
        value={rate}
        onChange={handleRateChange}
        className="w-full"
      />
      <TextField
        label="Amount"
        value={amount}
        onChange={handleAmountChange}
        className="w-full"
      />
      <Select value={type} onChange={handleTypeChange} className="w-full">
        <MenuItem value="Buying">Buying</MenuItem>
        <MenuItem value="Selling">Selling</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add
      </Button>
    </div>
  );
}

export default CurrencyForm;
