"use client";

import React from "react";
import { Select, MenuItem } from "@mui/material";

function CurrencySelect({ selectedOption, handleOptionChange, currencies }) {
  return (
    <Select value={selectedOption} onChange={handleOptionChange} displayEmpty>
      <MenuItem value="">Select a Currency</MenuItem>
      {currencies.map((currency) => (
        <MenuItem key={currency.label} value={currency.label}>
          {currency.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export default CurrencySelect;
