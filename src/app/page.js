"use client";
import React, { useState } from "react";
import RateTable from "../app/components/RateTable";
import Modal from "../app/components/modal";
import MainContent from "../app/components/RecordContent"; // Import the MainContent component

const MainPage = () => {
  const [selectedRate, setSelectedRate] = useState(null); // State to store the selected rate
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Function to refresh data in MainContent
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRowClick = (rate) => {
    setSelectedRate(rate); // Set the selected rate
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSave = () => {
    setRefreshTrigger(prev => !prev); // Trigger data refresh
    setIsModalOpen(false); // Close modal after save
  };

  return (
    <div className="container flex">
      <div className="w-4/12 p-4 bg-stone-100">
        <RateTable onRowClick={handleRowClick} />
      </div>
      <div className="w-8/12 p-4">
        <MainContent refreshTrigger={refreshTrigger} /> {/* Pass refreshTrigger to MainContent */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rate={selectedRate} // Pass the selected rate to the modal
        onSave={handleSave} // Pass the handleSave function to Modal
      />
    </div>
  );
};

export default MainPage;
