// Summary.js
import React from "react";

function Summary({ totalAmount, initialMoney }) {
  const formattedTotalAmount = Number(totalAmount.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const remain = (initialMoney - parseFloat(totalAmount.replace(/,/g, ''))).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="m-4 p-4 bg-sky-200 shadow rounded-lg grid grid-cols-3 gap-4 items-center">
      <h2 className="text-xl font-bold text-gray-800 col-span-1">Summary</h2>
      <p className="text-lg text-gray-600 col-span-1">จ่ายไป: <span className="text-blue-600">{formattedTotalAmount}</span></p>
      <p className="text-lg text-gray-600 col-span-1">คงเหลือ: <span className={`text-${remain < 0 ? 'red' : 'green'}-600`}>{remain}</span></p>
    </div>
  );
}

export default Summary;
