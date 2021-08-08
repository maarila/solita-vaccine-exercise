import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001').then((response) => {
      setSummary(response.data);
    });
  });

  return (
    <>
      <h1>Vaccine statistics</h1>
      <div>Expired Bottles: {summary.expired_bottles}</div>
    </>
  );
};

export default App;
