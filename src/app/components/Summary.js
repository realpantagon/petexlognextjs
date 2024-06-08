// Summary.js
import React from "react";

function Summary({ totalSum }) {
  return (
    <div>
      <h2>Summary</h2>
      <p>Remain: {totalSum.toFixed(2)}</p>
    </div>
  );
}

export default Summary;