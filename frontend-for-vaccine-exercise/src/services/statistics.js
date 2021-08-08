import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/statistics';

const getFullSummary = async (timestamp) => {
  const response = await axios.get(`${baseUrl}`);
  return response.data;
};

const getSummaryUntil = async (timestamp) => {
  const response = await axios.get(`${baseUrl}/${timestamp}`);
  return response.data;
};

const objectToReturn = { getFullSummary, getSummaryUntil };

export default objectToReturn;
