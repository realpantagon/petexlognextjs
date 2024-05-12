import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function Record({ data }) {
  const reversedData = [...data].reverse(); // Create a new array with reversed order

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Currency</TableCell>
          <TableCell>Rate</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reversedData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.currency}</TableCell>
            <TableCell>{item.rate}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell
              style={{
                color: item.type === "Buying" ? "#00b512" : "#f7786b",
              }}
            >
              {item.type}
            </TableCell>
            <TableCell>{item.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Record;