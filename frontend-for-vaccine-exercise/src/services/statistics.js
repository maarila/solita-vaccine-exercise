import axios from 'axios';

const baseUrl = '/api/statistics';

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
