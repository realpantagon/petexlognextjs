// EditRecordModal.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

function EditRecordModal({ record, data, setData, onSave, onCancel }) {
  const [editedRecord, setEditedRecord] = useState(record);

  useEffect(() => {
    setEditedRecord(record);
  }, [record]);

  const handleChange = (field, value) => {
    setEditedRecord((prevRecord) => ({
      ...prevRecord,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedRecord = {
      ...editedRecord,
      rate: parseFloat(editedRecord.rate),
      amount: parseFloat(editedRecord.amount).toFixed(2),
      total: (
        parseFloat(editedRecord.rate) * parseFloat(editedRecord.amount)
      ).toFixed(2),
    };

    const updatedData = data.map((record) =>
      record.time === updatedRecord.time ? updatedRecord : record
    );

    onSave(updatedData);
    onCancel();
  };
  
  

  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>Edit Record</DialogTitle>
      <DialogContent>
        <TextField
          label="Currency"
          value={editedRecord.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rate"
          value={editedRecord.rate}
          onChange={(e) => handleChange("rate", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          value={editedRecord.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          value={editedRecord.type}
          onChange={(e) => handleChange("type", e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Buying">Buying</MenuItem>
          <MenuItem value="Selling">Selling</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRecordModal;