import React, { useState, useEffect } from "react";
import axios from "axios";
import Record from "/src/app/Record";
import Summary from "./Summary";

function RecordDisplay() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/appXvdgNSlqDP9QwS/PROMENADE?view=Gridview`,
          {
            headers: {
              Authorization:
                "Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383",
            },
          }
        );

        const sortedData = response.data.records.sort(
          (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
        );
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data from Airtable:", error);
      }
    };

    fetchData(); 
    const interval = setInterval(fetchData, 1000); 

    return () => clearInterval(interval); 
  }); 

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


  return (
    <div>
      <Record data={data} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}

export default RecordDisplay;
