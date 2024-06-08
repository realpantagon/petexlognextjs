// Record.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditRecordModal from "./components/EditRecordModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour clock
  });
  return `${formattedDate} ${formattedTime}`;
}

function formatTotal(total) {
  return parseFloat(total).toFixed(2);
}

function Record({ data, onUpdate, onDelete }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEditClick = (record) => {
    setEditingRecord(record);
  };

  const handleCloseModal = () => {
    setEditingRecord(null);
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedRecord(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Time</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap">{formatDateTime(item.createdTime)}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{item.fields.Currency}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{item.fields.Rate}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{item.fields.Amount}</TableCell>
              <TableCell
                className={`px-6 py-4 whitespace-nowrap ${item.fields.Type === "Buying" ? "text-green-600" : "text-red-600"}`}
              >
                {item.fields.Type}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{formatTotal(item.fields.Total)}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{item.fields.Branch}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <IconButton onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-800">
                  <DeleteForeverIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingRecord && (
        <EditRecordModal
          open={true}
          onClose={handleCloseModal}
          record={editingRecord}
          onUpdate={onUpdate}
        />
      )}
      {selectedRecord && (
        <ConfirmDeleteModal
          open={deleteConfirmationOpen}
          onClose={handleCloseDeleteConfirmation}
          record={selectedRecord}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default Record;