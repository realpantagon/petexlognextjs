import axios from 'axios';

const API_URL = 'https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Branch1';
const API_TOKEN = 'patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383'; // Private token

export const saveRate = async (rate, rateInput, amount, transactionType, calculatedValue) => {
  try {
    const amountWithoutCommas = amount.replace(/,/g, '');

    if (amountWithoutCommas === "" || parseFloat(amountWithoutCommas) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const data = {
      records: [
        {
          fields: {
            Currency: `${rate.cur}`,
            Rate: rateInput,
            Amount: amountWithoutCommas, // Send the raw number without commas
            Type: transactionType,
            Total1: calculatedValue,
          },
        },
      ],
    };

    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Data saved to Airtable:', response.data);
    alert('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Error saving data');
  }
};
