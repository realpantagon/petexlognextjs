// Summary.js
import React from "react";

function Summary({ totalAmount }) {
  const storedInitialMoney = localStorage.getItem("initialMoney");
  const initialMoney = parseFloat(storedInitialMoney);
  const formattedTotalAmount = Number(totalAmount.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const remain = (initialMoney - parseFloat(totalAmount.replace(/,/g, ''))).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Summary</h2>
      <p>จ่ายไป: {formattedTotalAmount}</p>
      <p>คงเหลือ: {remain}</p>
    </div>
  );
}

export default Summary;