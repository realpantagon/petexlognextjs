// EditRecordModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

function EditRecordModal({ open, onClose, record, onUpdate }) {
  const [editedRecord, setEditedRecord] = useState(record);

  const handleChange = (field, value) => {
    setEditedRecord((prevRecord) => ({
      ...prevRecord,
      fields: {
        ...prevRecord.fields,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const total1 = parseFloat(editedRecord.fields.Rate) * parseFloat(editedRecord.fields.Amount);
      
      const updatedFields = {
        Currency: editedRecord.fields.Currency,
        Rate: editedRecord.fields.Rate,
        Amount: editedRecord.fields.Amount,
        Type: editedRecord.fields.Type,
        Total1: total1.toString(),
        Branch: editedRecord.fields.Branch,
      };
  
      await axios.patch(
        `https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE`,
        {
          records: [
            {
              id: editedRecord.id,
              fields: updatedFields,
            },
          ],
        },
        {
          headers: {
            Authorization:
              "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
            "Content-Type": "application/json",
          },
        }
      );
      onUpdate(editedRecord);
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Record</DialogTitle>
      <DialogContent>
        <TextField
          label="Currency"
          value={editedRecord.fields.Currency}
          onChange={(e) => handleChange("Currency", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rate"
          value={editedRecord.fields.Rate}
          onChange={(e) => handleChange("Rate", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          value={editedRecord.fields.Amount}
          onChange={(e) => handleChange("Amount", e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* <TextField
          label="Type"
          value={editedRecord.fields.Type}
          onChange={(e) => handleChange("Type", e.target.value)}
          fullWidth
          margin="normal"
        /> */}
        <TextField
          label="Total"
          value={editedRecord.fields.Total1}
          onChange={(e) => handleChange("Total", e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* <TextField
          label="Branch"
          value={editedRecord.fields.Branch}
          onChange={(e) => handleChange("Branch", e.target.value)}
          fullWidth
          margin="normal"
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRecordModal;
