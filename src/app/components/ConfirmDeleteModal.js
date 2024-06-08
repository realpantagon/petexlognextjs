// ConfirmDeleteModal.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

function ConfirmDeleteModal({ open, onClose, record, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE`,
        {
          headers: {
            Authorization:
              "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          params: {
            records: [record.id],
          },
        }
      );
      onDelete(record.id);
      onClose();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        {record && record.fields && (
          <>
            <Typography>Currency: {record.fields.Currency}</Typography>
            <Typography>Rate: {record.fields.Rate}</Typography>
            <Typography>Amount: {record.fields.Amount}</Typography>
            <Typography>Type: {record.fields.Type}</Typography>
            <Typography>Total: {record.fields.Total1}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;