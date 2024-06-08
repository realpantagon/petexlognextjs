// ClearRecordsButton.js
import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const ClearRecordsButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearRecords = async () => {
    try {
      // Fetch all records from Airtable
      const response = await axios.get(
        'https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE',
        {
          headers: {
            Authorization:
              'Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383',
          },
        }
      );

      const records = response.data.records;

      // Delete each record
      const deletePromises = records.map((record) =>
        axios.delete(`https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE/${record.id}`, {
          headers: {
            Authorization:
              'Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383',
          },
        })
      );

      await Promise.all(deletePromises);

      console.log('All records deleted successfully');
      handleClose();
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        CLEAR RECORDS
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Clear Records</DialogTitle>
        <DialogContent>
          Are you sure you want to delete all records?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClearRecords} color="error">
            Clear Records
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClearRecordsButton;