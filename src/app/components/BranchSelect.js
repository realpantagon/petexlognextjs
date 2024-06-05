"use client";

import React from "react";
import { Select, MenuItem } from "@mui/material";

function BranchSelect({ selectedBranch, handleBranchChange }) {
  return (
    <Select value={selectedBranch} onChange={handleBranchChange}>
      <MenuItem value="">Select a branch</MenuItem>
      <MenuItem value="N PARC">N PARC</MenuItem>
      <MenuItem value="Nimman Promenade">Nimman Promenade</MenuItem>
    </Select>
  );
}

export default BranchSelect;
