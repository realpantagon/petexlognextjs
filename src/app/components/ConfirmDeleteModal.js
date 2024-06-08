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

function ConfirmDeleteModal({ open, onClose, record, onConfirmDelete }) {
    const handleDelete = () => {
      onConfirmDelete(record.id);
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this record?</Typography>
          {record && record.fields && (
            <>
              <Typography>Currency: {record.fields.Currency}</Typography>
              <Typography>Rate: {record.fields.Rate}</Typography>
              <Typography>Amount: {record.fields.Amount}</Typography>
              <Typography>Type: {record.fields.Type}</Typography>
              <Typography>Total: {record.fields.Total}</Typography>
              <Typography>Branch: {record.fields.Branch}</Typography>
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