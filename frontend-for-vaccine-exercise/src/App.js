import { useState, useEffect } from 'react';
import statsService from './services/statistics';
import { defaults } from 'react-chartjs-2';
import HeaderBar from './components/HeaderBar';
import MainTitle from './components/MainTitle';
import DateTimePicker from './components/DateTimePicker';
import StatisticalInfo from './components/StatisticalInfo';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [summary, setSummary] = useState([]);
  const [firstDate, setFirstDate] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  useEffect(() => {
    statsService.getFullSummary().then((summary) => {
      setSummary(summary);
      setFirstDate(summary.first_data_point);
      setLastDate(summary.last_data_point);
      setCurrentTimestamp(formatDefaultDatetime('2021-04-12T11:10:06.473587Z'));
    });
  }, []);

  // disable animating charts
  defaults.animation = false;

  const formatDefaultDatetime = (timestamp, rounding) => {
    if (timestamp) {
      const splitTimestamp = timestamp.split(':');
      let minutes = splitTimestamp[1];
      if (rounding === 'up') {
        if (minutes.startsWith('0')) {
          minutes = '0' + (Number(minutes.slice(1)) + 1);
        } else {
          minutes = Number(minutes) + 1;
        }
      }
      return splitTimestamp[0] + ':' + minutes;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await statsService.getSummaryUntil(currentTimestamp);
    setSummary(response);
  };

  const handleTimeChange = (event) => {
    setCurrentTimestamp(formatDefaultDatetime(event.target.value));
  };

  return (
    <>
      <HeaderBar lastDate={lastDate} />
      <div className="container">
        <MainTitle />
        <DateTimePicker
          handleSubmit={handleSubmit}
          handleTimeChange={handleTimeChange}
          currentTimestamp={currentTimestamp}
          formatDefaultDatetime={formatDefaultDatetime}
          firstDate={firstDate}
        />
        <StatisticalInfo summary={summary} />
        <Footer />
      </div>
    </>
  );
};

export default App;
