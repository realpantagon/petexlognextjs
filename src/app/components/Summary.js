"use client";

import React from "react";

function Summary({ initialMoney, data }) {
  const totalBought = data.reduce(
    (acc, item) => acc + parseFloat(item.total.replace(",", "")),
    0
  );
  const remainingMoney = parseFloat(initialMoney) - totalBought;

  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md">
      <div className="grid grid-cols-3 gap-8 mb-4">
        <div>
          <p className="text-gray-600 font-semibold mb-2">เงินตั้งต้นวัน :</p>
          <p className="text-lg font-bold text-green-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "THB",
            }).format(parseFloat(initialMoney))}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold mb-2">ซื้อแล้ว :</p>
          <p className="text-lg font-bold text-red-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "THB",
            }).format(totalBought)}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold mb-2">เหลือเงิน :</p>
          <p className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "THB",
            }).format(remainingMoney)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Summary;
