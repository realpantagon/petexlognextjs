import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function Record({ data }) {
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
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.currency}</TableCell>
            <TableCell>{item.rate}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Record;
