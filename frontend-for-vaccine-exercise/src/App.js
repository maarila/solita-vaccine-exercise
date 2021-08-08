import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [lastDataTime, setLastDataTime] = useState('');
  const [getDataFromTimestamp, setGetDataFromTimestamp] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001').then((response) => {
      setSummary(response.data);
      setFirstDataTime(response.data.first_data_point);
      setLastDataTime(response.data.last_data_point);
      setGetDataFromTimestamp(
        formatDefaultDatetime(response.data.last_data_point, 'up')
      );
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

  const getUntilDate = (event) => {
    event.preventDefault();
    console.log(getDataFromTimestamp);
  };

  const handleTimeChange = (event) => {
    setGetDataFromTimestamp(formatDefaultDatetime(event.target.value));
  };

  return (
    <>
      <h1>Vaccine statistics</h1>
      <h3>
        Statistics available from {formatTimestamp(firstDataTime)} until{' '}
        {formatTimestamp(lastDataTime, 'up')}
      </h3>
      <form onSubmit={getUntilDate}>
        <label htmlFor="getStatisticsUntilTime">
          Get statistics up to this day and time:
        </label>
        <input
          type="datetime-local"
          id="timeToGet"
          name="timeToGet"
          onChange={handleTimeChange}
          value={getDataFromTimestamp}
          min={formatDefaultDatetime(firstDataTime)}
          max={formatDefaultDatetime(lastDataTime, 'up')}
        />
        <button type="submit">Get statistics</button>
      </form>
      <br />
      <br />
      <div>Expired Bottles: {summary.expired_bottles}</div>
      <div>Expired vaccines: {summary.expired_vaccines}</div>
      <div>Vaccinations remaining: {summary.vaccinations_remaining}</div>
      <div>Expires in 10 days: {summary.expires_in_ten_days}</div>
      <PerGender data={summary.vaccinations_given_by_gender} />
      <div>
        Total vaccinations given:{' '}
        {givenVaccinationsSum(summary.vaccinations_given_by_gender)}
      </div>
      <OrdersByProducer data={summary.orders_and_vaccinations_by_producer} />
      <div>
        Orders total: {ordersSum(summary.orders_and_vaccinations_by_producer)}
      </div>
      <div>
        Vaccinations total:{' '}
        {vaccinationsSum(summary.orders_and_vaccinations_by_producer)}
      </div>
    </>
  );
};

export default App;
