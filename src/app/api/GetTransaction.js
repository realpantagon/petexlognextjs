// Function to fetch the data from Airtable
export const fetchData = async () => {
  const API_URL =
    "https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Branch1?&view=Gridview";
  const API_TOKEN =
    "patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383"; // Your API token

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    const data = await response.json();
    return data.records; // Return the records from the API
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
