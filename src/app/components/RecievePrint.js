const RecievePrint = (items, formatDate) => {
  // Format number with commas and optionally 2 decimal places
  const formatMoney = (amount, withDecimals = true) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: withDecimals ? 2 : 0, 
      maximumFractionDigits: withDecimals ? 2 : 0 
    }).format(amount);
  };

  const totalAmount = items.reduce(
    (total, item) => total + parseFloat(item.fields.Total1),
    0
  );

  return `
    <div style="width: 5.5cm; font-size: 12px; text-align: center; font-family: Arial, sans-serif;">
      <img src="/PeterXReceipt.png" alt="Peter Exchange Logo" style="width: 150px; height: auto;" />
      <p style="font-size: 12px; font-weight: bold;">Peter Exchange Limited Partnership</p>
      <p style="font-size: 10px;">8 Nimmanhaemin Rd., Suthep, Mueang Chiang Mai, Chiang Mai</p>
      <p style="font-size: 10px;"><strong>Tel:</strong> 081-951-9678</p>
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #000; height: 20px;">
            <th style="text-align: center; padding: 5px 0;">Currency</th>
            <th style="text-align: center; padding: 5px 0;">Rate</th>
            <th style="text-align: center; padding: 5px 0;">Amount</th>
            <th style="text-align: center; padding: 5px 0;">THB</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td style="text-align: center; padding: 8px 0;">${item.fields.Currency}</td>
              <td style="text-align: center; padding: 8px 0;">${item.fields.Rate}</td>
              <td style="text-align: center; padding: 8px 0;">${formatMoney(item.fields.Amount, false)}</td>
              <td style="text-align: center; padding: 8px 0;">${formatMoney(item.fields.Total1)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; width: 100%; font-size: 12px; margin: 5px 0;">
        <p style="margin: 0;"><strong>Total:</strong></p>
        <p style="text-align: right; margin: 0;">${formatMoney(totalAmount)} THB</p>
      </div>

      <p style="font-size: 10px; margin-top: 5px;">Date: ${
        formatDate ? formatDate(new Date()) : "N/A"
      }</p>

      <p style="border-top: 1px solid #000; padding-top: 5px; margin-top: 5px;">
        Thank you for your business!
      </p>
    </div>
  `;
};

export default RecievePrint;
