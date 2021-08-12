import { useState, useEffect } from 'react';
import statsService from './services/statistics';
import './App.css';

const PerGender = ({ data }) => {
  return data
    ? data.map((item) => (
        <div key={item.gender}>
          <div>
            {item.gender} {item.vaccinations_given}
          </div>
        </div>
      ))
    : null;
};

const OrdersByProducer = ({ data }) => {
  return data
    ? data.map((item) => (
        <div key={item.producer}>
          producer: {item.producer} orders: {item.orders} vaccinations:{' '}
          {item.vaccinations}
        </div>
      ))
    : null;
};

const App = () => {
  const [summary, setSummary] = useState([]);
  const [firstDataTime, setFirstDataTime] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  useEffect(() => {
    statsService.getFullSummary().then((summary) => {
      setSummary(summary);
      setFirstDataTime(summary.first_data_point);
      setCurrentTimestamp(formatDefaultDatetime('2021-04-12T11:10:06.473587Z'));
    });
  }, []);

  const givenVaccinationsSum = (vaccByGender) => {
    return vaccByGender
      ? vaccByGender
          .map((genderData) => Number(genderData.vaccinations_given))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const ordersSum = (orderByProducer) => {
    return orderByProducer
      ? orderByProducer
          .map((order) => Number(order.orders))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const vaccinationsSum = (orderByProducer) => {
    return orderByProducer
      ? orderByProducer
          .map((order) => Number(order.vaccinations))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const formatTimestamp = (timestamp, rounding) => {
    if (timestamp) {
      const newTimestamp = new Date(timestamp);
      const day = newTimestamp.getDate();
      const month = newTimestamp.getMonth() + 1;
      const year = newTimestamp.getFullYear();
      let hours = newTimestamp.getUTCHours();
      hours = hours < 10 ? (hours = '0' + hours) : hours;
      let minutes = newTimestamp.getMinutes();
      minutes = rounding === 'up' ? minutes + 1 : minutes;
      minutes = minutes < 10 ? (minutes = '0' + minutes) : minutes;

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    return null;
  };

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

  const getUntilDate = async (event) => {
    event.preventDefault();
    const response = await statsService.getSummaryUntil(currentTimestamp);
    setSummary(response);
  };

  const handleTimeChange = (event) => {
    setCurrentTimestamp(formatDefaultDatetime(event.target.value));
  };

  return (
    <div className="container">
      <div className="header-container">
        <div className="title">
          <div className="main-title">
            <h1>Vaccine statistics</h1>
          </div>
          <div className="sub-title">
            <h3>
              Statistics are available from{' '}
              {formatTimestamp(firstDataTime, 'up')}.
            </h3>
          </div>
        </div>
        <div className="dateform-container">
          <div className="dateform">
            <form onSubmit={getUntilDate}>
              <label htmlFor="getStatisticsUntilTime">
                Currently showing:{' '}
              </label>
              <input
                type="datetime-local"
                id="timeToGet"
                name="timeToGet"
                onChange={handleTimeChange}
                value={currentTimestamp}
                min={formatDefaultDatetime(firstDataTime, 'up')}
              />
              <button type="submit">Get statistics</button>
            </form>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="main-view-container">
        <div className="summary-bar">
          <div className="vaccinations-given">
            Total vaccinations given:{' '}
            {givenVaccinationsSum(summary.vaccinations_given_by_gender)}
          </div>
          <div className="vaccinations-remaining">
            Vaccinations remaining: {summary.vaccinations_remaining}
          </div>
          <div className="vaccinations-expiring">
            Expires in 10 days: {summary.expires_in_ten_days}
          </div>
        </div>
        <div className="chart-container">
          <div className="vaccine-order-container">
            <OrdersByProducer
              data={summary.orders_and_vaccinations_by_producer}
            />
            <div className="orders-total">
              Orders total:{' '}
              {ordersSum(summary.orders_and_vaccinations_by_producer)}
            </div>
            <div className="vaccinations-total">
              Vaccinations total:{' '}
              {vaccinationsSum(summary.orders_and_vaccinations_by_producer)}
            </div>
          </div>
          <div className="vaccine-by-gender-container">
            <PerGender data={summary.vaccinations_given_by_gender} />
          </div>
        </div>
        <div className="expiring-container">
          <div className="expired-bottles">
            Expired Bottles: {summary.expired_bottles}
          </div>
          <div className="expired-vaccines">
            Expired vaccines: {summary.expired_vaccines}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
