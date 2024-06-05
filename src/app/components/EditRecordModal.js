import React, { useState } from "react";
import { Modal, Button } from "@mui/material";
import CurrencyForm from "./CurrencyForm";

function EditRecordModal({ isOpen, onClose, recordToEdit, onSave }) {
  const [editedData, setEditedData] = useState(recordToEdit);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div>
        <CurrencyForm
          selectedOption={editedData.currency}
          handleOptionChange={handleChange}
          rate={editedData.rate}
          amount={editedData.amount}
          handleInput1Change={handleChange}
          handleInput2Change={handleChange}
          type={editedData.type}
          handleTypeChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Modal>
  );
}

export default EditRecordModal;
