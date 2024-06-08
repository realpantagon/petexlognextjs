import React, { useState, useEffect } from "react";
import axios from "axios";
import Record from "/src/app/Record";
import Summary from "./Summary";

function RecordDisplay({ selectedBranch }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Log%20Day?maxRecords=10&view=${selectedBranch}`,
          {
            headers: {
              Authorization:
                "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
            },
          }
        );

        // Sort data by created time, newest first
        const sortedData = response.data.records.sort(
          (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
        );
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data from Airtable:", error);
      }
    };

    fetchData(); // Fetch data when the component mounts
    const interval = setInterval(fetchData, 1000); // Fetch data every 1 second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [selectedBranch]); // Dependency on selectedBranch

  const handleUpdate = (updatedRecord) => {
    setData((prevData) =>
      prevData.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDelete = (deletedRecordId) => {
    setData((prevData) =>
      prevData.filter((record) => record.id !== deletedRecordId)
    );
  };

// Calculate the sum of the "Total" field
const totalSum = data
  .filter(record => record.fields && record.fields.Branch === selectedBranch) // Filter records by selected branch
  .reduce((sum, record) => {
    if (record.fields && record.fields.Total) {
      const total = parseFloat(record.fields.Total1.replace(/,/g, ""));
      return sum + total;
    }
    return sum;
  }, 0);

  return (
    <div>
      <Record data={data} onUpdate={handleUpdate} onDelete={handleDelete} />
      {/* <Summary totalSum={totalSum} /> */}
    </div>
  );
}

export default RecordDisplay;
