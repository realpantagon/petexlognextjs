// src/app/api/GetRate.js

import axios from 'axios';

const API_URL = 'https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Rate';
const API_TOKEN = 'patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383'; // Private token

export const fetchRates = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    console.log('Data fetched from Airtable:', response.data.records);
    return response.data.records;
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    return [];
  }
};
