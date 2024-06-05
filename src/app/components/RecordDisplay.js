"use client";

import React from "react";
import Record from "/src/app/Record";

function RecordDisplay({ data, onEdit }) {
  return <Record data={data} onEdit={onEdit} />;
}

export default RecordDisplay;